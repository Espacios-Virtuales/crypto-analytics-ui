import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
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
    switchMap((value) =>
      combineLatest({
        price: this.latestService.getPrice({
          asset: value.asset,
          timeframe: value.timeframe,
        }),
        prediction: this.latestService.getPrediction({
          asset: value.asset,
          timeframe: value.timeframe,
          horizon: value.horizon,
        }),
        feature: this.latestService.getFeature({
          asset: value.asset,
          timeframe: value.timeframe,
        }),
        signal: this.latestService
          .getSignal({
            asset: value.asset,
            timeframe: value.timeframe,
            horizon: value.horizon,
          })
          .pipe(catchError(() => of(null))),
        exchangeRoutes: this.exchangeRoutesService
          .routes(value.asset, 'USD')
          .pipe(catchError(() => of(null))),
      }).pipe(
        map(({ price, prediction, feature, signal, exchangeRoutes }) => {
          const currentPrice = price?.data?.close ?? 0;
          const predictedPrice = prediction?.data?.y_hat ?? 0;
          const confidence = prediction?.data?.confidence ?? null;
          const rsi = feature?.data?.rsi ?? null;
          const macd = feature?.data?.macd ?? null;
          const volatility = feature?.data?.volatility ?? null;

          return {
            asset: value.asset,
            timeframe: value.timeframe,
            horizon: value.horizon,
            price: currentPrice,
            prediction: predictedPrice,
            signal: this.signalReading(
              buildSignalReading(currentPrice, predictedPrice, confidence),
              signal
            ),
            technical: buildTechnicalReading(rsi, macd, volatility),
            technicalValues: {
              rsi,
              macd,
              volatility,
            },
            routes: exchangeRoutes?.routes ?? [],
            asof_ts_utc:
              price?.meta?.asof_ts_utc ??
              prediction?.meta?.asof_ts_utc ??
              feature?.meta?.asof_ts_utc ??
              null,
          } satisfies TradingVm;
        }),
        catchError((error) => {
          console.error('[TradingModeComponent] vm error', error);
          return of(null);
        })
      )
    ),
    shareReplay(1)
  );

  refreshData(): void {
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
