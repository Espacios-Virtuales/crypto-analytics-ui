import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, of } from 'rxjs';
import { catchError, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';

import { AssetsService } from '../../../core/services/assets.service';
import { HistoryService } from '../../../core/services/history.service';
import { AssetInfo } from '../../../core/models/assets.model';
import { PricePoint } from '../../../core/models/history.model';
import {
  LineChartComponent,
  LineChartPoint,
} from '../../../shared/components/line-chart/line-chart.component';

type AssetsViewModel = {
  asset: AssetInfo | null;
  prices: PricePoint[];
  priceSeries: LineChartPoint[];
  loading: boolean;
  error: string | null;
};

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LineChartComponent],
  templateUrl: './assets.component.html',
  styleUrl: './assets.component.scss',
})
export class AssetsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly assetsService = inject(AssetsService);
  private readonly historyService = inject(HistoryService);

  readonly form = this.fb.nonNullable.group({
    asset: this.fb.nonNullable.control('BTC'),
    timeframe: this.fb.nonNullable.control('1m'),
    limit: this.fb.nonNullable.control(30),
  });

  readonly assets$ = this.assetsService.list().pipe(
    tap((assets) => this.patchValidSelection(assets)),
    shareReplay(1)
  );

  readonly options$ = combineLatest([
    this.assets$,
    this.form.valueChanges.pipe(startWith(this.form.getRawValue())),
  ]).pipe(
    map(([assets, formValue]) => {
      const selected =
        assets.find((item) => item.asset === formValue.asset) ?? assets[0] ?? null;

      return {
        assets,
        selected,
        timeframes: selected?.timeframes?.length ? selected.timeframes : ['1m'],
      };
    }),
    tap(({ assets }) => this.patchValidSelection(assets)),
    shareReplay(1)
  );

  readonly vm$ = combineLatest([
    this.assets$,
    this.form.valueChanges.pipe(startWith(this.form.getRawValue())),
  ]).pipe(
    switchMap(([assets, formValue]) => {
      const asset =
        assets.find((item) => item.asset === formValue.asset) ?? assets[0] ?? null;

      if (!asset) {
        return of({
          asset: null,
          prices: [],
          priceSeries: [],
          loading: false,
          error: null,
        } satisfies AssetsViewModel);
      }

      return this.historyService
        .getPrices({
          asset: asset.asset,
          timeframe: formValue.timeframe ?? asset.timeframes?.[0] ?? '1m',
          limit: formValue.limit ?? 30,
          order: 'desc',
        })
        .pipe(
          map((response) => {
            const prices = response?.data ?? [];

            return {
              asset,
              prices,
              priceSeries: [...prices]
                .reverse()
                .map((point) => ({ xLabel: point.ts_utc, value: point.close })),
              loading: false,
              error: null,
            } satisfies AssetsViewModel;
          }),
          startWith({
            asset,
            prices: [],
            priceSeries: [],
            loading: true,
            error: null,
          } satisfies AssetsViewModel),
          catchError((error) => {
            console.error('[AssetsComponent] history error', error);

            return of({
              asset,
              prices: [],
              priceSeries: [],
              loading: false,
              error: 'No fue posible cargar el histórico para la selección actual.',
            } satisfies AssetsViewModel);
          })
        );
    }),
    shareReplay(1)
  );

  onAssetChange(asset: string): void {
    const current = this.form.getRawValue();

    this.form.patchValue({
      asset,
      timeframe: current.timeframe,
    });
  }

  formatPrice(value: number): string {
    return value.toLocaleString('es-CL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  formatVolume(value: number): string {
    return value.toLocaleString('es-CL', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4,
    });
  }

  trackByAsset(_: number, item: AssetInfo): string {
    return item.asset;
  }

  trackByPrice(_: number, item: PricePoint): string {
    return item.ts_utc;
  }

  private patchValidSelection(assets: AssetInfo[]): void {
    if (!assets.length) return;

    const current = this.form.getRawValue();
    const selected =
      assets.find((item) => item.asset === current.asset) ?? assets[0];

    const nextTimeframe = selected.timeframes?.includes(current.timeframe)
      ? current.timeframe
      : (selected.timeframes?.[0] ?? '1m');

    if (selected.asset !== current.asset || nextTimeframe !== current.timeframe) {
      this.form.patchValue(
        {
          asset: selected.asset,
          timeframe: nextTimeframe,
        },
        { emitEvent: false }
      );
    }
  }
}
