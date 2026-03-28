import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, of } from 'rxjs';
import { catchError, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';

import { AssetsService } from '../../../core/services/assets.service';
import { LatestService } from '../../../core/services/latest.service';
import { AssetInfo } from '../../../core/models/assets.model';

type TradingSignal = 'BUY' | 'SELL' | 'HOLD';
type RiskProfile = 'LOW' | 'MEDIUM' | 'HIGH';

type TradingFormValue = {
  asset: string;
  timeframe: string;
  horizon: string;
};

type TradingVm = {
  asset: string;
  timeframe: string;
  horizon: string;
  price: number;
  prediction: number;
  confidence: number | null;
  rsi: number | null;
  macd: number | null;
  signal: TradingSignal;
  riskProfile: RiskProfile;
  positionSizePct: number;
  stopLoss: number;
  takeProfit: number;
  expectedMovePct: number;
  mode: 'PAPER';
  asof_ts_utc: string | null;
};

@Component({
  selector: 'app-trading-mode',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './trading-mode.component.html',
  styleUrl: './trading-mode.component.scss',
})
export class TradingModeComponent {
  private readonly fb = inject(FormBuilder);
  private readonly assetsService = inject(AssetsService);
  private readonly latestService = inject(LatestService);

  readonly form = this.fb.nonNullable.group({
    asset: this.fb.nonNullable.control<string>('BTC'),
    timeframe: this.fb.nonNullable.control<string>('1m'),
    horizon: this.fb.nonNullable.control<string>('5m'),
  });

  readonly assets$ = this.assetsService.list().pipe(
    tap((assets: AssetInfo[]) => {
      if (!assets.length) return;

      const currentAsset = this.form.controls.asset.value;
      const selected =
        assets.find((item) => item.asset === currentAsset) ?? assets[0];

      const nextTimeframe =
        selected.timeframes?.includes(this.form.controls.timeframe.value)
          ? this.form.controls.timeframe.value
          : (selected.timeframes?.[0] ?? '1m');

      const nextHorizon =
        selected.horizons?.includes(this.form.controls.horizon.value)
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

  readonly options$ = combineLatest([
    this.assets$,
    this.form.valueChanges.pipe(startWith(this.form.getRawValue())),
  ]).pipe(
    map(([assets, value]) => {
      const selected =
        assets.find((item) => item.asset === value.asset) ?? assets[0] ?? null;

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

  readonly vm$ = this.form.valueChanges.pipe(
    startWith(this.form.getRawValue()),
    switchMap((value) =>
      combineLatest({
        price: this.latestService.getPrice({
          asset: value.asset ?? 'BTC',
          timeframe: value.timeframe ?? '1m',
        }),
        prediction: this.latestService.getPrediction({
          asset: value.asset ?? 'BTC',
          timeframe: value.timeframe ?? '1m',
          horizon: value.horizon ?? '5m',
        }),
        feature: this.latestService.getFeature({
          asset: value.asset ?? 'BTC',
          timeframe: value.timeframe ?? '1m',
        }),
      }).pipe(
        map(({ price, prediction, feature }) => {
          const currentPrice = price?.data?.close ?? 0;
          const predictedPrice = prediction?.data?.y_hat ?? 0;
          const confidence = prediction?.data?.confidence ?? null;
          const rsi = feature?.data?.rsi ?? null;
          const macd = feature?.data?.macd ?? null;

          const signal = this.getSignal(currentPrice, predictedPrice);
          const expectedMovePct = this.getExpectedMovePct(currentPrice, predictedPrice);
          const riskProfile = this.getRiskProfile(confidence, rsi);
          const positionSizePct = this.getPositionSizePct(confidence, riskProfile);
          const stopLoss = this.getStopLoss(currentPrice, signal, riskProfile);
          const takeProfit = this.getTakeProfit(currentPrice, signal, expectedMovePct);

          return {
            asset: value.asset ?? 'BTC',
            timeframe: value.timeframe ?? '1m',
            horizon: value.horizon ?? '5m',
            price: currentPrice,
            prediction: predictedPrice,
            confidence,
            rsi,
            macd,
            signal,
            riskProfile,
            positionSizePct,
            stopLoss,
            takeProfit,
            expectedMovePct,
            mode: 'PAPER',
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

  signalBadgeClass(signal: TradingSignal): string {
    switch (signal) {
      case 'BUY':
        return 'tm-badge-buy';
      case 'SELL':
        return 'tm-badge-sell';
      default:
        return 'tm-badge-hold';
    }
  }

  riskBadgeClass(risk: RiskProfile): string {
    switch (risk) {
      case 'LOW':
        return 'tm-badge-buy';
      case 'HIGH':
        return 'tm-badge-sell';
      default:
        return 'tm-badge-hold';
    }
  }

  formatPrice(value: number): string {
    return value.toLocaleString('es-CL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  formatPercent(value: number | null): string {
    if (value == null) return '—';

    return value.toLocaleString('es-CL', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
      style: 'percent',
    });
  }

  private getSignal(price: number, prediction: number): TradingSignal {
    if (!price || !prediction) return 'HOLD';

    const diffRatio = Math.abs(prediction - price) / price;
    if (diffRatio < 0.001) return 'HOLD';

    return prediction > price ? 'BUY' : 'SELL';
  }

  private getExpectedMovePct(price: number, prediction: number): number {
    if (!price || !prediction) return 0;
    return (prediction - price) / price;
  }

  private getRiskProfile(confidence: number | null, rsi: number | null): RiskProfile {
    if ((confidence ?? 0) >= 0.75 && rsi != null && rsi > 35 && rsi < 65) {
      return 'LOW';
    }

    if ((confidence ?? 0) < 0.45 || rsi == null || rsi < 25 || rsi > 75) {
      return 'HIGH';
    }

    return 'MEDIUM';
  }

  private getPositionSizePct(confidence: number | null, risk: RiskProfile): number {
    const base =
      risk === 'LOW' ? 0.12 :
      risk === 'MEDIUM' ? 0.08 :
      0.04;

    const multiplier =
      confidence == null ? 0.75 :
      confidence >= 0.8 ? 1 :
      confidence >= 0.6 ? 0.85 :
      0.65;

    return +(base * multiplier).toFixed(4);
  }

  private getStopLoss(price: number, signal: TradingSignal, risk: RiskProfile): number {
    const riskPct =
      risk === 'LOW' ? 0.008 :
      risk === 'MEDIUM' ? 0.012 :
      0.018;

    if (signal === 'BUY') return +(price * (1 - riskPct)).toFixed(2);
    if (signal === 'SELL') return +(price * (1 + riskPct)).toFixed(2);

    return +price.toFixed(2);
  }

  private getTakeProfit(price: number, signal: TradingSignal, expectedMovePct: number): number {
    const move = Math.max(Math.abs(expectedMovePct), 0.01);

    if (signal === 'BUY') return +(price * (1 + move)).toFixed(2);
    if (signal === 'SELL') return +(price * (1 - move)).toFixed(2);

    return +price.toFixed(2);
  }
}