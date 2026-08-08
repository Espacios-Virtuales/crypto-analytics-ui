import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, filter, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';

import { AssetsService } from '../../../core/services/assets.service';
import { LatestService } from '../../../core/services/latest.service';
import { MarketSelectionService } from '../../../core/services/market-selection.service';
import { AssetInfo } from '../../../core/models/assets.model';
import {
  FxContext,
  LatestFeatureResponse,
  LatestPredictionResponse,
  LatestPriceResponse,
  LatestSignalResponse,
} from '../../../core/models/latest.model';
import {
  buildSignalReading,
  expectedReturnClass,
  SIGNAL_HOLD_THRESHOLD_LABEL,
  signalBadgeClass,
  SignalReading,
} from '../../../shared/utils/signal-reading.utils';
import {
  buildTechnicalReading,
  TechnicalReading,
} from '../../../shared/utils/technical-reading.utils';
import { CryptoTimestampPipe } from '../../../shared/pipes/crypto-timestamp.pipe';

type DisplayQuoteOption = 'MARKET' | 'USD' | 'CLP';
type BlockResult<T> = { data: T | null; error: string | null };
type HomePulse = {
  price: LatestPriceResponse | null;
  feature: LatestFeatureResponse | null;
  prediction: LatestPredictionResponse | null;
  signal: LatestSignalResponse | null;
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CryptoTimestampPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],

})
export class HomeComponent {
  private readonly fb = inject(FormBuilder);
  private readonly assetsService = inject(AssetsService);
  private readonly latestService = inject(LatestService);
  private readonly marketSelection = inject(MarketSelectionService);
  explanationOpen = false;
  private readonly initialSelection = this.marketSelection.snapshot();
  private readonly latestRefreshRequests$ = new BehaviorSubject<number>(0);
  readonly refreshRequestedAt = signal<string | null>(null);
  readonly signalThresholdLabel = SIGNAL_HOLD_THRESHOLD_LABEL;
  readonly latestLoading = signal(true);
  readonly latestRefreshing = signal(false);
  readonly latestError = signal<string | null>(null);
  readonly priceLoading = signal(true);
  readonly featureLoading = signal(true);
  readonly predictionLoading = signal(true);
  readonly signalLoading = signal(true);
  readonly priceError = signal<string | null>(null);
  readonly featureError = signal<string | null>(null);
  readonly predictionError = signal<string | null>(null);
  readonly signalError = signal<string | null>(null);
  private readonly blockCache = new Map<string, unknown>();
  private requestGeneration = 0;
  private pendingBlocks = 0;
  private manualRefreshPending = false;

  readonly assets$ = this.assetsService.list().pipe(
    tap((assets) => {
      if (!assets.length) return;

      const selected = this.marketSelection.resolve(assets, this.form.getRawValue());

      this.patchSelection(selected);
      this.marketSelection.update(selected);
    }),
    shareReplay(1)
  );

  readonly form = this.fb.nonNullable.group({
    asset: this.fb.nonNullable.control(this.initialSelection.asset),
    timeframe: this.fb.nonNullable.control(this.initialSelection.timeframe),
    horizon: this.fb.nonNullable.control(this.initialSelection.horizon),
    displayQuote: this.fb.nonNullable.control<DisplayQuoteOption>('MARKET'),
  });

  readonly options$ = combineLatest([
    this.assets$,
    this.form.valueChanges.pipe(startWith(this.form.getRawValue())),
  ]).pipe(
    map(([assets, formValue]) => {
      const selected = this.marketSelection.resolve(assets, formValue);

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

  /* Each block is isolated so one failed endpoint cannot terminate the pulse. */
  readonly pulse$ = combineLatest([
    this.form.valueChanges.pipe(startWith(this.form.getRawValue())),
    this.latestRefreshRequests$,
  ]).pipe(
    map(([value]) => value),
    tap((value) => this.marketSelection.update(value)),
    map((value) => ({
      asset: value.asset ?? '',
      timeframe: value.timeframe ?? '',
      horizon: value.horizon ?? '',
      displayQuote: value.displayQuote ?? 'MARKET',
    })),
    filter((value) => !!value.asset && !!value.timeframe && !!value.horizon),
    switchMap((value) => {
      const displayQuote = this.toDisplayQuoteParam(value.displayQuote);
      const isManualRefresh = this.manualRefreshPending;
      const generation = ++this.requestGeneration;
      const key = `${value.asset}|${value.timeframe}|${value.horizon}|${displayQuote ?? 'MARKET'}`;

      this.manualRefreshPending = false;
      this.latestError.set(null);
      this.latestLoading.set(!isManualRefresh);
      this.latestRefreshing.set(isManualRefresh);
  
      this.pendingBlocks = 4;
      this.priceLoading.set(true); this.featureLoading.set(true);
      this.predictionLoading.set(true); this.signalLoading.set(true);
      this.priceError.set(null); this.featureError.set(null);
      this.predictionError.set(null); this.signalError.set(null);

      return combineLatest({
        price: this.loadBlock('price', key, this.latestService.getPrice({
          asset: value.asset,
          timeframe: value.timeframe,
          ...(displayQuote ? { display_quote: displayQuote } : {}),
        }), generation),
        feature: this.loadBlock('feature', key, this.latestService.getFeature({
          asset: value.asset,
          timeframe: value.timeframe,
        }), generation),
        prediction: this.loadBlock('prediction', key, this.latestService.getPrediction({
          asset: value.asset,
          timeframe: value.timeframe,
          horizon: value.horizon,
          ...(displayQuote ? { display_quote: displayQuote } : {}),
        }), generation),
        signal: this.loadBlock('signal', key, this.latestService.getSignal({
            asset: value.asset,
            timeframe: value.timeframe,
            horizon: value.horizon,
          }), generation),
      }).pipe(map((blocks): HomePulse => ({
        price: blocks.price.data,
        feature: blocks.feature.data,
        prediction: blocks.prediction.data,
        signal: blocks.signal.data,
      })))
    }),
    shareReplay(1)
  );

  private loadBlock<T>(block: 'price' | 'feature' | 'prediction' | 'signal', key: string, request$: Observable<T>, generation: number): Observable<BlockResult<T>> {
    const cached = this.blockCache.get(`${block}|${key}`) as T | undefined;
    return request$.pipe(
      map((data) => ({ data, error: null })),
      catchError(() => of({ data: cached ?? null, error: 'No disponible por ahora.' })),
      tap((result) => {
        if (generation !== this.requestGeneration) return;
        if (result.data !== null) this.blockCache.set(`${block}|${key}`, result.data);
        this.setBlockState(block, result.error);
        this.pendingBlocks -= 1;
        if (this.pendingBlocks <= 0) { this.latestLoading.set(false); this.latestRefreshing.set(false); }
      }),
      startWith({ data: cached ?? null, error: null })
    );
  }

  private setBlockState(block: string, error: string | null): void {
    if (block === 'price') { this.priceLoading.set(false); this.priceError.set(error); }
    if (block === 'feature') { this.featureLoading.set(false); this.featureError.set(error); }
    if (block === 'prediction') { this.predictionLoading.set(false); this.predictionError.set(error); }
    if (block === 'signal') { this.signalLoading.set(false); this.signalError.set(error); }
  }

  refreshData(): void {
    if (this.latestRefreshing()) return;

    this.manualRefreshPending = true;
    this.refreshRequestedAt.set(new Date().toISOString());
    this.latestRefreshRequests$.next(this.latestRefreshRequests$.value + 1);
  }

  onAssetChange(asset: AssetInfo): void {
    const selected = this.marketSelection.resolve([asset], {
      ...this.form.getRawValue(),
      asset: asset.asset,
    });

    this.form.patchValue({
      asset: selected.asset,
      timeframe: selected.timeframe,
      horizon: selected.horizon,
    });
  }

  toggleExplanation(): void {
    this.explanationOpen = !this.explanationOpen;
  }

  modelExplanation(prediction: LatestPredictionResponse | null | undefined): string | null {
    const explanation = prediction?.data?.explanation?.trim();
    return explanation || null;
  }

  shownPriceValue(price: LatestPriceResponse | null | undefined): number {
    return price?.data?.display_close ?? price?.data?.close ?? 0;
  }

  shownPriceCurrency(price: LatestPriceResponse | null | undefined): string {
    return price?.data?.display_quote_currency ?? price?.data?.quote_currency ?? 'USD';
  }

  basePriceValue(price: LatestPriceResponse | null | undefined): number {
    return price?.data?.close ?? 0;
  }

  basePriceCurrency(price: LatestPriceResponse | null | undefined): string {
    return price?.data?.quote_currency ?? 'USD';
  }

  hasConvertedPrice(price: LatestPriceResponse | null | undefined): boolean {
    return !!price?.data?.display_quote_currency && price.data.display_close != null;
  }

  shownPredictionValue(prediction: LatestPredictionResponse | null | undefined): number {
    return prediction?.data?.display_y_hat ?? prediction?.data?.y_hat ?? 0;
  }

  shownPredictionCurrency(prediction: LatestPredictionResponse | null | undefined): string {
    return (
      prediction?.data?.display_quote_currency ??
      prediction?.data?.quote_currency ??
      'USD'
    );
  }

  basePredictionValue(prediction: LatestPredictionResponse | null | undefined): number {
    return prediction?.data?.y_hat ?? 0;
  }

  basePredictionCurrency(prediction: LatestPredictionResponse | null | undefined): string {
    return prediction?.data?.quote_currency ?? 'USD';
  }

  hasConvertedPrediction(prediction: LatestPredictionResponse | null | undefined): boolean {
    return !!prediction?.data?.display_quote_currency && prediction.data.display_y_hat != null;
  }

  fxContext(pulse: any): FxContext | null {
    return pulse?.price?.fx_context ?? pulse?.prediction?.fx_context ?? null;
  }

  hasFxContext(pulse: any): boolean {
    return !!this.fxContext(pulse);
  }

  signalReading(pulse: any): SignalReading {
    const fallback = buildSignalReading(
      this.basePriceValue(pulse?.price),
      this.basePredictionValue(pulse?.prediction),
      pulse?.prediction?.data?.confidence ?? null
    );
    const latestSignal = pulse?.signal as LatestSignalResponse | null;

    if (!latestSignal) return fallback;

    return {
      ...fallback,
      signal: this.normalizeSignal(latestSignal.signal),
      absoluteStrength: latestSignal.strength ?? fallback.absoluteStrength,
      confidence: latestSignal.confidence ?? fallback.confidence,
      text: latestSignal.reason || fallback.text,
    };
  }

  signalBadgeClass(reading: SignalReading): string {
    return signalBadgeClass(reading.signal);
  }

  expectedReturnClass(reading: SignalReading): string {
    return expectedReturnClass(reading.tone);
  }

  technicalReading(pulse: any): TechnicalReading {
    return buildTechnicalReading(
      pulse?.feature?.data?.rsi ?? null,
      pulse?.feature?.data?.macd ?? null,
      pulse?.feature?.data?.volatility ?? null
    );
  }

  formatMetric(value: number, currency: string): string {
    if (currency === 'CLP') {
      return `${value.toLocaleString('es-CL', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })} ${currency}`;
    }

    return `${value.toLocaleString('es-CL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ${currency}`;
  }

  private toDisplayQuoteParam(option: DisplayQuoteOption): string | undefined {
    if (option === 'MARKET') return undefined;
    return option;
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

  private normalizeSignal(signal: string): 'BUY' | 'SELL' | 'HOLD' {
    if (signal === 'BUY' || signal === 'SELL' || signal === 'HOLD') return signal;
    return 'HOLD';
  }
}
