import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, EMPTY } from 'rxjs';
import { catchError, filter, finalize, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';

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
import { CryptoTimestampPipe } from '../../../shared/pipes/crypto-timestamp.pipe';
import { HISTORY_LIMIT_OPTIONS } from '../../../shared/constants/market-options';

type DisplayQuoteOption = 'USD' | 'CLP';

type HistoryFormValue = {
  asset: string;
  timeframe: string;
  horizon: string;
  limit: number;
  offset: number;
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
    limit?: number;
    offset?: number;
    total?: number;
  };
  data: PriceRow[];
};

type FeaturesResponse = {
  meta: {
    asset: string;
    timeframe: string;
    features_version?: string;
    limit?: number;
    offset?: number;
    total?: number;
  };
  data: FeatureRow[];
};

type PredictionsResponse = {
  meta: {
    asset: string;
    timeframe: string;
    horizon: string;
    limit?: number;
    offset?: number;
    total?: number;
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
  imports: [CommonModule, ReactiveFormsModule, LineChartComponent, CryptoTimestampPipe],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent {
  private readonly fb = inject(FormBuilder);
  private readonly assetsService = inject(AssetsService);
  private readonly historyService = inject(HistoryService);

  // Stub temporal para piloto. Luego reemplazar por contrato FX real.
  readonly fxRateUsdClp = 950;
  readonly historyLimitOptions = HISTORY_LIMIT_OPTIONS;
  readonly historyLoading = signal(true);
  readonly historyError = signal<string | null>(null);

  activeTable: 'prices' | 'features' | 'predictions' = 'prices';

  readonly form = this.fb.nonNullable.group({
    asset: this.fb.nonNullable.control<string>(''),
    timeframe: this.fb.nonNullable.control<string>(''),
    horizon: this.fb.nonNullable.control<string>(''),
    limit: this.fb.nonNullable.control<number>(25),
    offset: this.fb.nonNullable.control<number>(0),
    displayQuote: this.fb.nonNullable.control<DisplayQuoteOption>('USD'),
  });

  readonly assets$ = this.assetsService.list().pipe(
    tap((assets: AssetInfo[]) => {
      if (!assets.length) return;

      const selected = this.resolveSelection(assets, this.form.getRawValue());

      this.patchSelection(selected);
    }),
    shareReplay(1)
  );

  readonly selectedMarketOptions$ = combineLatest([
    this.assets$,
    this.form.controls.asset.valueChanges.pipe(
      startWith(this.form.controls.asset.value)
    ),
  ]).pipe(
    map(([assets, asset]) => {
      const selected = this.resolveSelection(assets, {
        ...this.form.getRawValue(),
        asset,
      });

      return selected;
    }),
    tap((selected) => {
      const currentTimeframe = this.form.controls.timeframe.value;
      const currentHorizon = this.form.controls.horizon.value;

      const nextTimeframe = selected.timeframes.includes(currentTimeframe)
        ? currentTimeframe
        : (selected.timeframes[0] ?? '');

      const nextHorizon = selected.horizons.includes(currentHorizon)
        ? currentHorizon
        : (selected.horizons[0] ?? '');

      this.patchSelection({
        asset: this.form.controls.asset.value,
        timeframe: nextTimeframe,
        horizon: nextHorizon,
      });
    }),
    shareReplay(1)
  );

  readonly vm$ = this.form.valueChanges.pipe(
    startWith(this.form.getRawValue()),
    map((value) => this.normalizeFormValue(value as HistoryFormValue)),
    filter((value) => !!value.asset && !!value.timeframe && !!value.horizon),
    switchMap((value) => {
      this.historyError.set(null);
      this.historyLoading.set(true);

      const pricesQuery: HistoryQuery = {
        asset: value.asset,
        timeframe: value.timeframe,
        limit: value.limit,
        offset: value.offset,
        order: 'desc',
      };

      const featuresQuery: FeaturesHistoryQuery = {
        asset: value.asset,
        timeframe: value.timeframe,
        limit: value.limit,
        offset: value.offset,
        order: 'desc',
      };

      const predictionsQuery: PredictionsHistoryQuery = {
        asset: value.asset,
        timeframe: value.timeframe,
        horizon: value.horizon,
        limit: value.limit,
        offset: value.offset,
        order: 'desc',
      };

      return combineLatest({
        prices: this.historyService.getPrices(pricesQuery),
        features: this.historyService.getFeatures(featuresQuery),
        predictions: this.historyService.getPredictions(predictionsQuery),
      }).pipe(
        catchError((error) => {
          console.error('[HistoryComponent] vm error', error);
          this.historyError.set('No se pudieron cargar los datos. Intenta actualizar nuevamente.');
          return EMPTY;
        }),
        finalize(() => this.historyLoading.set(false))
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

  resetOffset(): void {
    if (this.form.controls.offset.value !== 0) {
      this.form.controls.offset.setValue(0);
    }
  }

  previousPage(): void {
    const limit = this.form.controls.limit.value;
    const offset = this.form.controls.offset.value;
    this.form.controls.offset.setValue(Math.max(0, offset - limit));
  }

  nextPage(vm: HistoryVm): void {
    if (!this.canGoNext(vm)) return;

    const limit = this.form.controls.limit.value;
    const offset = this.form.controls.offset.value;
    this.form.controls.offset.setValue(offset + limit);
  }

  canGoPrevious(): boolean {
    return this.form.controls.offset.value > 0;
  }

  canGoNext(vm: HistoryVm): boolean {
    const total = this.activeTotal(vm);
    const rows = this.activeRowsLength(vm);
    const limit = this.form.controls.limit.value;
    const offset = this.form.controls.offset.value;

    if (total != null) {
      return offset + limit < total;
    }

    return rows === limit;
  }

  paginationLabel(vm: HistoryVm): string {
    const rows = this.activeRowsLength(vm);
    const total = this.activeTotal(vm);
    const offset = this.form.controls.offset.value;

    if (!rows) return 'Sin registros';

    const start = offset + 1;
    const end = offset + rows;

    return total == null ? `${start}-${end}` : `${start}-${end} de ${total}`;
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
      offset: this.normalizeOffset(value.offset),
      displayQuote: value.displayQuote ?? 'USD',
    };
  }

  private resolveSelection(assets: AssetInfo[], current: Partial<HistoryFormValue>) {
    const selectedAsset = assets.find((item) => item.asset === current.asset) ?? assets[0];
    const timeframes = selectedAsset?.timeframes ?? [];
    const horizons = selectedAsset?.horizons ?? [];

    return {
      asset: selectedAsset?.asset ?? '',
      timeframe: timeframes.includes(current.timeframe ?? '')
        ? current.timeframe ?? ''
        : timeframes[0] ?? '',
      horizon: horizons.includes(current.horizon ?? '')
        ? current.horizon ?? ''
        : horizons[0] ?? '',
      timeframes,
      horizons,
    };
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

  private normalizeLimit(limit: number): number {
    const parsed = Number(limit);
    if (Number.isNaN(parsed)) return 25;
    return this.historyLimitOptions.includes(parsed as any) ? parsed : 25;
  }

  private normalizeOffset(offset: number): number {
    const parsed = Number(offset);
    if (Number.isNaN(parsed)) return 0;
    return Math.max(0, parsed);
  }

  private activeTotal(vm: HistoryVm): number | null {
    switch (this.activeTable) {
      case 'features':
        return vm.features.meta.total ?? null;
      case 'predictions':
        return vm.predictions.meta.total ?? null;
      default:
        return vm.prices.meta.total ?? null;
    }
  }

  private activeRowsLength(vm: HistoryVm): number {
    switch (this.activeTable) {
      case 'features':
        return vm.features.data.length;
      case 'predictions':
        return vm.predictions.data.length;
      default:
        return vm.prices.data.length;
    }
  }
}
