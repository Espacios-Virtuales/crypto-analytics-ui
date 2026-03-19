import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, of } from 'rxjs';
import { catchError, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';

import { AssetsService } from '../../../core/services/assets.service';
import { AssetInfo } from '../../../core/models/assets.model';
import { HistoryService } from '../../../core/services/history.service';
import {
  FeaturesHistoryQuery,
  HistoryQuery,
  PredictionsHistoryQuery,
} from '../../../core/models/history.model';
import {
  LineChartComponent,
  LineChartPoint,
} from '../../../shared/components/line-chart/line-chart.component';

type DisplayQuoteOption = 'USD' | 'CLP';

type HistoryFormValue = {
  asset: string;
  timeframe: string;
  horizon: string;
  limit: number;
  displayQuote: DisplayQuoteOption;
};

type PriceRow = {
  ts_utc: string;
  close: number;
  volume: number;
};

type FeatureRow = {
  ts_utc: string;
  rsi: number;
  macd: number;
  volatility: number;
};

type PredictionRow = {
  ts_utc: string;
  y_hat: number;
  confidence: number;
};

type PricesResponse = {
  meta: {
    asset: string;
    timeframe: string;
  };
  data: PriceRow[];
};

type FeaturesResponse = {
  meta: {
    asset: string;
    timeframe: string;
    features_version?: string;
  };
  data: FeatureRow[];
};

type PredictionsResponse = {
  meta: {
    asset: string;
    timeframe: string;
    horizon: string;
  };
  data: PredictionRow[];
};

type HistoryVm = {
  prices: PricesResponse;
  features: FeaturesResponse;
  predictions: PredictionsResponse;
};

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LineChartComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent {
  private readonly fb = inject(FormBuilder);
  private readonly assetsService = inject(AssetsService);
  private readonly historyService = inject(HistoryService);

  // Stub temporal para piloto. Luego reemplazar por contrato FX real.
  readonly fxRateUsdClp = 950;

  activeTable: 'prices' | 'features' | 'predictions' = 'prices';

  readonly form = this.fb.nonNullable.group({
    asset: this.fb.nonNullable.control<string>('BTC'),
    timeframe: this.fb.nonNullable.control<string>('1m'),
    horizon: this.fb.nonNullable.control<string>('5m'),
    limit: this.fb.nonNullable.control<number>(20),
    displayQuote: this.fb.nonNullable.control<DisplayQuoteOption>('USD'),
  });

  readonly assets$ = this.assetsService.list().pipe(
    tap((assets: AssetInfo[]) => {
      if (!assets.length) return;

      const currentAsset = this.form.controls.asset.value;
      const selectedAsset =
        assets.find((item) => item.asset === currentAsset) ?? assets[0];

      const nextTimeframe =
        selectedAsset.timeframes?.includes(this.form.controls.timeframe.value)
          ? this.form.controls.timeframe.value
          : (selectedAsset.timeframes?.[0] ?? '1m');

      const nextHorizon =
        selectedAsset.horizons?.includes(this.form.controls.horizon.value)
          ? this.form.controls.horizon.value
          : (selectedAsset.horizons?.[0] ?? '5m');

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
    this.form.controls.asset.valueChanges.pipe(
      startWith(this.form.controls.asset.value)
    ),
  ]).pipe(
    map(([assets, asset]) => assets.find((item) => item.asset === asset) ?? null),
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
    map((value) => this.normalizeFormValue(value as HistoryFormValue)),
    switchMap((value) => {
      const pricesQuery: HistoryQuery = {
        asset: value.asset,
        timeframe: value.timeframe,
        limit: value.limit,
        order: 'desc',
      };

      const featuresQuery: FeaturesHistoryQuery = {
        asset: value.asset,
        timeframe: value.timeframe,
        limit: value.limit,
        order: 'desc',
      };

      const predictionsQuery: PredictionsHistoryQuery = {
        asset: value.asset,
        timeframe: value.timeframe,
        horizon: value.horizon,
        limit: value.limit,
        order: 'desc',
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
    return this.convertMonetaryValue(vm?.prices?.data?.[0]?.close ?? 0);
  }

  latestPrediction(vm: HistoryVm): number {
    return this.convertMonetaryValue(vm?.predictions?.data?.[0]?.y_hat ?? 0);
  }

  latestRsi(vm: HistoryVm): number {
    return vm?.features?.data?.[0]?.rsi ?? 0;
  }

  monetaryCode(): DisplayQuoteOption {
    return this.form.controls.displayQuote.value;
  }

  monetaryContextLabel(): string {
    return this.monetaryCode() === 'CLP'
      ? `Conversión referencial USD→CLP`
      : 'Valores en USD';
  }

  formatMoney(value: number, currency: DisplayQuoteOption): string {
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

  formatTableMoney(value: number): string {
    return this.formatMoney(this.convertMonetaryValue(value), this.monetaryCode());
  }

  toPriceSeries(rows: PriceRow[] = []): LineChartPoint[] {
    return [...rows].reverse().map((row) => ({
      xLabel: row.ts_utc,
      value: this.convertMonetaryValue(row.close),
    }));
  }

  toPredictionSeries(rows: PredictionRow[] = []): LineChartPoint[] {
    return [...rows].reverse().map((row) => ({
      xLabel: row.ts_utc,
      value: this.convertMonetaryValue(row.y_hat),
    }));
  }

  toRsiSeries(rows: FeatureRow[] = []): LineChartPoint[] {
    return [...rows].reverse().map((row) => ({
      xLabel: row.ts_utc,
      value: row.rsi,
    }));
  }

  toMacdSeries(rows: FeatureRow[] = []): LineChartPoint[] {
    return [...rows].reverse().map((row) => ({
      xLabel: row.ts_utc,
      value: row.macd,
    }));
  }

  setActiveTable(table: 'prices' | 'features' | 'predictions'): void {
    this.activeTable = table;
  }

  private convertMonetaryValue(value: number): number {
    return this.monetaryCode() === 'CLP' ? value * this.fxRateUsdClp : value;
  }

  private normalizeFormValue(value: HistoryFormValue): HistoryFormValue {
    return {
      asset: value.asset,
      timeframe: value.timeframe,
      horizon: value.horizon,
      limit: this.normalizeLimit(value.limit),
      displayQuote: value.displayQuote ?? 'USD',
    };
  }

  private normalizeLimit(limit: number): number {
    const parsed = Number(limit);
    if (Number.isNaN(parsed)) return 20;
    return Math.max(5, Math.min(200, parsed));
  }
}