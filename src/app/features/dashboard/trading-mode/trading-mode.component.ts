import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, filter, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';

import { AssetsService } from '../../../core/services/assets.service';
import { ExchangeRoutesService } from '../../../core/services/exchange-routes.service';
import { LatestService } from '../../../core/services/latest.service';
import { ExchangeRoute } from '../../../core/models/exchange-route.model';
import { MarketSelectionService } from '../../../core/services/market-selection.service';
import { AssetInfo } from '../../../core/models/assets.model';
import { LatestSignalResponse } from '../../../core/models/latest.model';
import { CryptoTimestampPipe } from '../../../shared/pipes/crypto-timestamp.pipe';
import {
  buildSignalReading,
  expectedReturnClass,
  SIGNAL_HOLD_THRESHOLD_LABEL,
  SignalAction,
  SignalReading,
  signalBadgeClass,
} from '../../../shared/utils/signal-reading.utils';
import {
  buildTechnicalReading,
  TechnicalReading,
} from '../../../shared/utils/technical-reading.utils';

type TradingVm = {
  asset: string;
  timeframe: string;
  horizon: string;
  price: number;
  prediction: number;
  signal: SignalReading;
  technical: TechnicalReading;
  technicalValues: {
    rsi: number | null;
    macd: number | null;
    volatility: number | null;
  };
  routes: ExchangeRoute[];
  asof_ts_utc: string | null;
};
type TradingBlockResult<T> = { data: T | null; error: string | null };

@Component({
  selector: 'app-trading-mode',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CryptoTimestampPipe],
  templateUrl: './trading-mode.component.html',
  styleUrl: './trading-mode.component.scss',
})
export class TradingModeComponent {
  private readonly fb = inject(FormBuilder);
  private readonly assetsService = inject(AssetsService);
  private readonly exchangeRoutesService = inject(ExchangeRoutesService);
  private readonly latestService = inject(LatestService);
  private readonly marketSelection = inject(MarketSelectionService);
  private readonly initialSelection = this.marketSelection.snapshot();
  private readonly latestRefreshRequests$ = new BehaviorSubject<number>(0);
  readonly refreshRequestedAt = signal<string | null>(null);
  readonly signalThresholdLabel = SIGNAL_HOLD_THRESHOLD_LABEL;
  readonly vmLoading = signal(true);
  readonly vmRefreshing = signal(false);
  readonly vmError = signal<string | null>(null);
  readonly priceLoading = signal(true);
  readonly predictionLoading = signal(true);
  readonly featureLoading = signal(true);
  readonly signalLoading = signal(true);
  readonly routesLoading = signal(true);
  readonly priceError = signal<string | null>(null);
  readonly predictionError = signal<string | null>(null);
  readonly featureError = signal<string | null>(null);
  readonly signalError = signal<string | null>(null);
  readonly routesError = signal<string | null>(null);
  private readonly blockCache = new Map<string, unknown>();
  private requestGeneration = 0;
  private pendingBlocks = 0;
  private manualRefreshPending = false;

  readonly form = this.fb.nonNullable.group({
    asset: this.fb.nonNullable.control<string>(this.initialSelection.asset),
    timeframe: this.fb.nonNullable.control<string>(this.initialSelection.timeframe),
    horizon: this.fb.nonNullable.control<string>(this.initialSelection.horizon),
  });

  readonly assets$ = this.assetsService.list().pipe(
    tap((assets: AssetInfo[]) => {
      if (!assets.length) return;

      const selected = this.marketSelection.resolve(assets, this.form.getRawValue());

      this.patchSelection(selected);
      this.marketSelection.update(selected);
    }),
    shareReplay(1)
  );

  readonly options$ = combineLatest([
    this.assets$,
    this.form.valueChanges.pipe(startWith(this.form.getRawValue())),
  ]).pipe(
    map(([assets, value]) => {
      const selected = this.marketSelection.resolve(assets, value);

      return {
        assets,
        timeframes: selected.timeframes,
        horizons: selected.horizons,
      };
    }),
    tap((options) => {
      const currentTimeframe = this.form.controls.timeframe.value;
      const currentHorizon = this.form.controls.horizon.value;

      const nextTimeframe = options.timeframes.includes(currentTimeframe)
        ? currentTimeframe
        : (options.timeframes[0] ?? '');

      const nextHorizon = options.horizons.includes(currentHorizon)
        ? currentHorizon
        : (options.horizons[0] ?? '');

      if (nextTimeframe !== currentTimeframe || nextHorizon !== currentHorizon) {
        this.form.patchValue(
          {
            timeframe: nextTimeframe,
            horizon: nextHorizon,
          },
          { emitEvent: true }
        );
      }

      this.marketSelection.update(this.form.getRawValue());
    }),
    shareReplay(1)
  );

  readonly vm$ = combineLatest([
    this.form.valueChanges.pipe(startWith(this.form.getRawValue())),
    this.latestRefreshRequests$,
  ]).pipe(
    map(([value]) => value),
    tap((value) => this.marketSelection.update(value)),
    map((value) => ({
      asset: value.asset ?? '',
      timeframe: value.timeframe ?? '',
      horizon: value.horizon ?? '',
    })),
    filter((value) => !!value.asset && !!value.timeframe && !!value.horizon),
    switchMap((value) => {
      const isManualRefresh = this.manualRefreshPending;
      const generation = ++this.requestGeneration;
      const key = `${value.asset}|${value.timeframe}|${value.horizon}`;

      this.manualRefreshPending = false;
      this.vmError.set(null);
      this.vmLoading.set(!isManualRefresh);
      this.vmRefreshing.set(isManualRefresh);
      this.pendingBlocks = 5;
      this.priceLoading.set(true); this.predictionLoading.set(true); this.featureLoading.set(true);
      this.signalLoading.set(true); this.routesLoading.set(true);
      this.priceError.set(null); this.predictionError.set(null); this.featureError.set(null);
      this.signalError.set(null); this.routesError.set(null);

      return combineLatest({
        price: this.loadBlock('price', key, this.latestService.getPrice({
          asset: value.asset,
          timeframe: value.timeframe,
        }), generation),
        prediction: this.loadBlock('prediction', key, this.latestService.getPrediction({
          asset: value.asset,
          timeframe: value.timeframe,
          horizon: value.horizon,
        }), generation),
        feature: this.loadBlock('feature', key, this.latestService.getFeature({
          asset: value.asset,
          timeframe: value.timeframe,
        }), generation),
        signal: this.loadBlock('signal', key, this.latestService.getSignal({
            asset: value.asset,
            timeframe: value.timeframe,
            horizon: value.horizon,
          }), generation),
        exchangeRoutes: this.loadBlock('routes', key, this.exchangeRoutesService.routes(value.asset, 'USD'), generation),
      }).pipe(
        map(({ price, prediction, feature, signal, exchangeRoutes }) => {
          const currentPrice = price.data?.data?.close ?? 0;
          const predictedPrice = prediction.data?.data?.y_hat ?? 0;
          const confidence = prediction.data?.data?.confidence ?? null;
          const rsi = feature.data?.data?.rsi ?? null;
          const macd = feature.data?.data?.macd ?? null;
          const volatility = feature.data?.data?.volatility ?? null;

          return {
            asset: value.asset,
            timeframe: value.timeframe,
            horizon: value.horizon,
            price: currentPrice,
            prediction: predictedPrice,
            signal: this.signalReading(
              buildSignalReading(currentPrice, predictedPrice, confidence),
              signal.data
            ),
            technical: buildTechnicalReading(rsi, macd, volatility),
            technicalValues: {
              rsi,
              macd,
              volatility,
            },
            routes: exchangeRoutes.data?.routes ?? [],
            asof_ts_utc:
              price.data?.meta?.asof_ts_utc ??
              prediction.data?.meta?.asof_ts_utc ??
              feature.data?.meta?.asof_ts_utc ??
              null,
          } satisfies TradingVm;
        })
      );
    }),
    shareReplay(1)
  );

  private loadBlock<T>(block: 'price' | 'prediction' | 'feature' | 'signal' | 'routes', key: string, request$: Observable<T>, generation: number): Observable<TradingBlockResult<T>> {
    const cached = this.blockCache.get(`${block}|${key}`) as T | undefined;
    return request$.pipe(
      map((data) => ({ data, error: null })),
      catchError(() => of({ data: cached ?? null, error: 'No disponible por ahora.' })),
      tap((result) => {
        if (generation !== this.requestGeneration) return;
        if (result.data !== null) this.blockCache.set(`${block}|${key}`, result.data);
        this.setBlockState(block, result.error);
        this.pendingBlocks -= 1;
        if (this.pendingBlocks <= 0) { this.vmLoading.set(false); this.vmRefreshing.set(false); }
      }),
      startWith({ data: cached ?? null, error: null })
    );
  }

  private setBlockState(block: string, error: string | null): void {
    if (block === 'price') { this.priceLoading.set(false); this.priceError.set(error); }
    if (block === 'prediction') { this.predictionLoading.set(false); this.predictionError.set(error); }
    if (block === 'feature') { this.featureLoading.set(false); this.featureError.set(error); }
    if (block === 'signal') { this.signalLoading.set(false); this.signalError.set(error); }
    if (block === 'routes') { this.routesLoading.set(false); this.routesError.set(error); }
  }

  refreshData(): void {
    if (this.vmRefreshing()) return;

    this.manualRefreshPending = true;
    this.refreshRequestedAt.set(new Date().toISOString());
    this.latestRefreshRequests$.next(this.latestRefreshRequests$.value + 1);
  }

  signalBadgeClass(signal: SignalAction): string {
    return signalBadgeClass(signal).replace('signal-', 'tm-badge-');
  }

  signalIcon(signal: SignalAction): string {
    if (signal === 'BUY') return '🟢';
    if (signal === 'SELL') return '🔴';
    return '⚪';
  }

  formatPrice(value: number): string {
    return value.toLocaleString('es-CL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  formatSignedPercent(value: number): string {
    const formatted = Math.abs(value).toLocaleString('es-CL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      style: 'percent',
    });

    if (value > 0) return `+${formatted}`;
    if (value < 0) return `-${formatted}`;
    return formatted;
  }

  formatStrength(value: number): string {
    return value.toLocaleString('es-CL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      style: 'percent',
    });
  }

  formatTechnicalValue(value: number | null, maximumFractionDigits = 3): string {
    if (value == null) return 'Sin dato';

    return value.toLocaleString('es-CL', {
      minimumFractionDigits: 0,
      maximumFractionDigits,
    });
  }

  formatVolatility(value: number | null): string {
    if (value == null) return 'Sin dato';

    return value.toLocaleString('es-CL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      style: 'percent',
    });
  }

  expectedReturnClass(reading: SignalReading): string {
    return expectedReturnClass(reading.tone);
  }

  private signalReading(
    fallback: SignalReading,
    latestSignal: LatestSignalResponse | null
  ): SignalReading {
    if (!latestSignal) return fallback;

    const signal = this.normalizeSignal(latestSignal.signal);

    return {
      ...fallback,
      signal,
      absoluteStrength: latestSignal.strength ?? fallback.absoluteStrength,
      confidence: latestSignal.confidence ?? fallback.confidence,
      confidenceLevel: fallback.confidenceLevel,
      text: latestSignal.reason || fallback.text,
    };
  }

  private normalizeSignal(signal: string): SignalAction {
    if (signal === 'BUY' || signal === 'SELL' || signal === 'HOLD') return signal;
    return 'HOLD';
  }

  private patchSelection(selection: { asset: string; timeframe: string; horizon: string }): void {
    const current = this.form.getRawValue();
    const changed =
      current.asset !== selection.asset ||
      current.timeframe !== selection.timeframe ||
      current.horizon !== selection.horizon;

    if (!changed) return;

    this.form.patchValue(
      {
        asset: selection.asset,
        timeframe: selection.timeframe,
        horizon: selection.horizon,
      },
      { emitEvent: true }
    );
  }
}
