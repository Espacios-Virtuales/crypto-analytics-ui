import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, of } from 'rxjs';
import { catchError, filter, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';

import { AssetsService } from '../../../core/services/assets.service';
import { LatestService } from '../../../core/services/latest.service';
import { MarketSelectionService } from '../../../core/services/market-selection.service';
import { AssetInfo } from '../../../core/models/assets.model';
import { CryptoTimestampPipe } from '../../../shared/pipes/crypto-timestamp.pipe';
import {
  buildSignalReading,
  expectedReturnClass,
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
  private readonly latestService = inject(LatestService);
  private readonly marketSelection = inject(MarketSelectionService);
  private readonly initialSelection = this.marketSelection.snapshot();

  readonly form = this.fb.nonNullable.group({
    asset: this.fb.nonNullable.control<string>(this.initialSelection.asset),
    timeframe: this.fb.nonNullable.control<string>(this.initialSelection.timeframe),
    horizon: this.fb.nonNullable.control<string>(this.initialSelection.horizon),
  });

  readonly assets$ = this.assetsService.list().pipe(
    tap((assets: AssetInfo[]) => {
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
          { emitEvent: false }
        );
      }

      this.marketSelection.update(this.form.getRawValue());
    }),
    shareReplay(1)
  );

  readonly vm$ = this.form.valueChanges.pipe(
    startWith(this.form.getRawValue()),
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
      }).pipe(
        map(({ price, prediction, feature }) => {
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
            signal: buildSignalReading(currentPrice, predictedPrice, confidence),
            technical: buildTechnicalReading(rsi, macd, volatility),
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

  signalBadgeClass(signal: SignalAction): string {
    return signalBadgeClass(signal).replace('signal-', 'tm-badge-');
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

  expectedReturnClass(reading: SignalReading): string {
    return expectedReturnClass(reading.tone);
  }
}
