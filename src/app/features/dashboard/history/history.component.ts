import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, of } from 'rxjs';
import { startWith, switchMap, catchError, map, tap, shareReplay } from 'rxjs/operators';
import { AssetsService } from '../../../core/services/assets.service';
import { AssetInfo } from '../../../core/models/assets.model';
import { HistoryService } from '../../../core/services/history.service';
import {
  HistoryQuery,
  FeaturesHistoryQuery,
  PredictionsHistoryQuery,
} from '../../../core/models/history.model';
import {
  LineChartComponent,
  LineChartPoint,
} from '../../../shared/components/line-chart/line-chart.component';

type HistoryFormValue = {
  asset: string;
  timeframe: string;
  horizon: string;
  features_version: string;
  model_version: string;
  limit: number;
  order: 'asc' | 'desc';
  from: string;
  to: string;
};

type HistoryVm = {
  prices: any;
  features: any;
  predictions: any;
};

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LineChartComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent {
  private fb = inject(FormBuilder);
  private assetsService = inject(AssetsService);
  private historyService = inject(HistoryService);

  activeTable: 'prices' | 'features' | 'predictions' = 'prices';

  readonly form = this.fb.nonNullable.group({
    asset: this.fb.nonNullable.control<string>('BTC'),
    timeframe: this.fb.nonNullable.control<string>('1m'),
    horizon: this.fb.nonNullable.control<string>('5m'),
    features_version: this.fb.nonNullable.control<string>('f1'),
    model_version: this.fb.nonNullable.control<string>('m1'),
    limit: this.fb.nonNullable.control<number>(20),
    order: this.fb.nonNullable.control<'asc' | 'desc'>('desc'),
    from: this.fb.nonNullable.control<string>(''),
    to: this.fb.nonNullable.control<string>(''),
  });

  readonly assets$ = this.assetsService.list().pipe(
    tap((assets: AssetInfo[]) => {
      if (!assets.length) return;

      const currentAsset = this.form.controls.asset.value;
      const selectedAsset =
        assets.find((a: AssetInfo) => a.asset === currentAsset) ?? assets[0];

      const nextTimeframe =
        selectedAsset.timeframes?.[0] ?? this.form.controls.timeframe.value ?? '1m';

      const nextHorizon =
        selectedAsset.horizons?.[0] ?? this.form.controls.horizon.value ?? '5m';

      this.form.patchValue(
        {
          asset: selectedAsset.asset,
          timeframe: nextTimeframe,
          horizon: nextHorizon,
        },
        { emitEvent: false }
      );
    }),
    shareReplay(1)
  );

  readonly selectedAssetMeta$ = combineLatest([
    this.assets$,
    this.form.controls.asset.valueChanges.pipe(startWith(this.form.controls.asset.value)),
  ]).pipe(
    map(([assets, asset]) => assets.find((a: AssetInfo) => a.asset === asset) ?? null),
    tap((assetMeta) => {
      if (!assetMeta) return;

      const currentTimeframe = this.form.controls.timeframe.value;
      const currentHorizon = this.form.controls.horizon.value;

      const validTimeframes = assetMeta.timeframes ?? [];
      const validHorizons = assetMeta.horizons ?? [];

      const nextTimeframe = validTimeframes.includes(currentTimeframe)
        ? currentTimeframe
        : (validTimeframes[0] ?? '1m');

      const nextHorizon = validHorizons.includes(currentHorizon)
        ? currentHorizon
        : (validHorizons[0] ?? '5m');

      this.form.patchValue(
        {
          timeframe: nextTimeframe,
          horizon: nextHorizon,
        },
        { emitEvent: false }
      );
    }),
    shareReplay(1)
  );

  readonly vm$ = this.form.valueChanges.pipe(
    startWith(this.form.getRawValue()),
    map((value) => ({ ...this.form.getRawValue(), ...value }) as HistoryFormValue),
    switchMap((value) => {
      const pricesQuery: HistoryQuery = {
        asset: value.asset,
        timeframe: value.timeframe,
        limit: value.limit,
        order: value.order,
      };

      const featuresQuery: FeaturesHistoryQuery = {
        asset: value.asset,
        timeframe: value.timeframe,
        features_version: value.features_version || undefined,
        limit: value.limit,
        order: value.order,
      };

      const predictionsQuery: PredictionsHistoryQuery = {
        asset: value.asset,
        timeframe: value.timeframe,
        horizon: value.horizon || undefined,
        model_version: value.model_version || undefined,
        limit: value.limit,
        order: value.order,
      };

      return combineLatest({
        prices: this.historyService.getPrices(pricesQuery),
        features: this.historyService.getFeatures(featuresQuery),
        predictions: this.historyService.getPredictions(predictionsQuery),
      }).pipe(
        catchError((error) => {
          console.error('[HistoryComponent] vm error', error);
          return of(null);
        })
      );
    }),
    shareReplay(1)
  );

  latestClose(vm: HistoryVm): number {
    return vm?.prices?.data?.[0]?.close ?? 0;
  }

  latestPrediction(vm: HistoryVm): number {
    return vm?.predictions?.data?.[0]?.y_hat ?? 0;
  }

  latestRsi(vm: HistoryVm): number {
    return vm?.features?.data?.[0]?.rsi ?? 0;
  }

  toPriceSeries(rows: { ts_utc: string; close: number }[]): LineChartPoint[] {
    return [...rows].reverse().map((row) => ({
      xLabel: row.ts_utc,
      value: row.close,
    }));
  }

  toPredictionSeries(rows: { ts_utc: string; y_hat: number }[]): LineChartPoint[] {
    return [...rows].reverse().map((row) => ({
      xLabel: row.ts_utc,
      value: row.y_hat,
    }));
  }

  toRsiSeries(rows: { ts_utc: string; rsi: number }[]): LineChartPoint[] {
    return [...rows].reverse().map((row) => ({
      xLabel: row.ts_utc,
      value: row.rsi,
    }));
  }

  toMacdSeries(rows: { ts_utc: string; macd: number }[]): LineChartPoint[] {
    return [...rows].reverse().map((row) => ({
      xLabel: row.ts_utc,
      value: row.macd,
    }));
  }
}