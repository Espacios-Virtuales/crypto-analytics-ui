import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, of } from 'rxjs';
import { catchError, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';

import { AssetsService } from '../../../core/services/assets.service';
import { LatestService } from '../../../core/services/latest.service';
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

type DisplayQuoteOption = 'MARKET' | 'USD' | 'CLP';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],

})
export class HomeComponent {
  private readonly fb = inject(FormBuilder);
  private readonly assetsService = inject(AssetsService);
  private readonly latestService = inject(LatestService);

  readonly assets$ = this.assetsService.list().pipe(
    tap((assets) => {
      if (!assets.length) return;

      const selected =
        assets.find((a) => a.asset === this.form.controls.asset.value) ?? assets[0];

      const nextTimeframe = selected.timeframes?.includes(this.form.controls.timeframe.value)
        ? this.form.controls.timeframe.value
        : (selected.timeframes?.[0] ?? '1m');

      const nextHorizon = selected.horizons?.includes(this.form.controls.horizon.value)
        ? this.form.controls.horizon.value
        : (selected.horizons?.[0] ?? '5m');

      this.form.patchValue(
        {
          asset: selected.asset,
          timeframe: nextTimeframe,
          horizon: nextHorizon,
        },
        { emitEvent: false }
      );
    }),
    shareReplay(1)
  );

  readonly form = this.fb.nonNullable.group({
    asset: this.fb.nonNullable.control('BTC'),
    timeframe: this.fb.nonNullable.control('1m'),
    horizon: this.fb.nonNullable.control('5m'),
    displayQuote: this.fb.nonNullable.control<DisplayQuoteOption>('MARKET'),
  });

  readonly options$ = combineLatest([
    this.assets$,
    this.form.valueChanges.pipe(startWith(this.form.getRawValue())),
  ]).pipe(
    map(([assets, formValue]) => {
      const selected =
        assets.find((a) => a.asset === formValue.asset) ?? assets[0] ?? null;

      return {
        assets,
        timeframes: selected?.timeframes ?? ['1m'],
        horizons: selected?.horizons ?? ['5m'],
      };
    }),
    tap((options) => {
      const currentTimeframe = this.form.controls.timeframe.value;
      const currentHorizon = this.form.controls.horizon.value;

      const nextTimeframe = options.timeframes.includes(currentTimeframe)
        ? currentTimeframe
        : (options.timeframes[0] ?? '1m');

      const nextHorizon = options.horizons.includes(currentHorizon)
        ? currentHorizon
        : (options.horizons[0] ?? '5m');

      if (nextTimeframe !== currentTimeframe || nextHorizon !== currentHorizon) {
        this.form.patchValue(
          {
            timeframe: nextTimeframe,
            horizon: nextHorizon,
          },
          { emitEvent: false }
        );
      }
    }),
    shareReplay(1)
  );

  readonly pulse$ = this.form.valueChanges.pipe(
    startWith(this.form.getRawValue()),
    map((value) => ({
      asset: value.asset ?? 'BTC',
      timeframe: value.timeframe ?? '1m',
      horizon: value.horizon ?? '5m',
      displayQuote: value.displayQuote ?? 'MARKET',
    })),
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
    this.form.patchValue({
      asset: asset.asset,
      timeframe: asset.timeframes?.[0] ?? '1m',
      horizon: asset.horizons?.[0] ?? '5m',
    });
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
