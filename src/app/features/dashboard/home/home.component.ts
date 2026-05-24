import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, of } from 'rxjs';
import { catchError, filter, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';

import { AssetsService } from '../../../core/services/assets.service';
import { LatestService } from '../../../core/services/latest.service';
import { MarketSelectionService } from '../../../core/services/market-selection.service';
import { AssetInfo } from '../../../core/models/assets.model';
import {
  FxContext,
  LatestPredictionResponse,
  LatestPriceResponse,
} from '../../../core/models/latest.model';
import {
  buildSignalReading,
  expectedReturnClass,
  signalBadgeClass,
  SignalReading,
} from '../../../shared/utils/signal-reading.utils';
import {
  buildTechnicalReading,
  TechnicalReading,
} from '../../../shared/utils/technical-reading.utils';
import { CryptoTimestampPipe } from '../../../shared/pipes/crypto-timestamp.pipe';

type DisplayQuoteOption = 'MARKET' | 'USD' | 'CLP';

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

  readonly assets$ = this.assetsService.list().pipe(
    tap((assets) => {
      if (!assets.length) return;

      const selected = this.marketSelection.resolve(assets, this.form.getRawValue());

      this.form.patchValue(
        {
          asset: selected.asset,
          timeframe: selected.timeframe,
          horizon: selected.horizon,
        },
        { emitEvent: false }
      );
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
          { emitEvent: false }
        );
      }

      this.marketSelection.update(this.form.getRawValue());
    }),
    shareReplay(1)
  );

  readonly pulse$ = this.form.valueChanges.pipe(
    startWith(this.form.getRawValue()),
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
  
      return combineLatest({
        price: this.latestService.getPrice({
          asset: value.asset,
          timeframe: value.timeframe,
          ...(displayQuote ? { display_quote: displayQuote } : {}),
        }),
        feature: this.latestService.getFeature({
          asset: value.asset,
          timeframe: value.timeframe,
        }),
        prediction: this.latestService.getPrediction({
          asset: value.asset,
          timeframe: value.timeframe,
          horizon: value.horizon,
          ...(displayQuote ? { display_quote: displayQuote } : {}),
        }),
      }).pipe(
        catchError((error) => {
          console.error('[HomeComponent] pulse error', error);
          return of(null);
        })
      );
    }),
    shareReplay(1)
  );

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
    return buildSignalReading(
      this.basePriceValue(pulse?.price),
      this.basePredictionValue(pulse?.prediction),
      pulse?.prediction?.data?.confidence ?? null
    );
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
}
