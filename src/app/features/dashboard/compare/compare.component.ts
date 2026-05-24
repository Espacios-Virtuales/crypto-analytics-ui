import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, of } from 'rxjs';
import { catchError, filter, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';

import { AssetsService } from '../../../core/services/assets.service';
import { CompareService } from '../../../core/services/compare.service';
import { HistoryService } from '../../../core/services/history.service';
import { MarketSelectionService } from '../../../core/services/market-selection.service';
import { AssetInfo } from '../../../core/models/assets.model';
import { CompareRow, CompareSignal } from '../../../core/models/compare.model';
import { CryptoTimestampPipe } from '../../../shared/pipes/crypto-timestamp.pipe';
import { expectedReturnClass } from '../../../shared/utils/signal-reading.utils';

type CompareFormValue = {
  assets: string[];
  timeframe: string;
  horizon: string;
};

type CorrelationItem = {
  asset: string;
  against: string;
  value: number;
  label: string;
};

type CompareViewModel = {
  rows: CompareRow[];
  meta: {
    timeframe: string;
    horizon: string;
    count: number;
  };
  correlations: CorrelationItem[];
  leaderAsset: string | null;
};

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CryptoTimestampPipe],
  templateUrl: './compare.component.html',
  styleUrl: './compare.component.scss',
})
export class CompareComponent {
  private readonly fb = inject(FormBuilder);
  private readonly assetsService = inject(AssetsService);
  private readonly compareService = inject(CompareService);
  private readonly historyService = inject(HistoryService);
  private readonly marketSelection = inject(MarketSelectionService);
  private readonly initialSelection = this.marketSelection.snapshot();

  readonly form = this.fb.nonNullable.group({
    assets: this.fb.nonNullable.control<string[]>(
      this.initialSelection.asset ? [this.initialSelection.asset] : []
    ),
    timeframe: this.fb.nonNullable.control<string>(this.initialSelection.timeframe),
    horizon: this.fb.nonNullable.control<string>(this.initialSelection.horizon),
  });

  readonly assets$ = this.assetsService.list().pipe(
    tap((assets: AssetInfo[]) => {
      if (!assets.length) return;

      const currentAssets = this.form.controls.assets.value.filter((asset) =>
        assets.some((item) => item.asset === asset)
      );

      const currentTimeframe = this.form.controls.timeframe.value;
      const currentHorizon = this.form.controls.horizon.value;

      const nextAssets = currentAssets.length
        ? currentAssets
        : assets.slice(0, 3).map((item) => item.asset);

      const selected = this.marketSelection.resolve(assets, {
        asset: nextAssets[0],
        timeframe: currentTimeframe,
        horizon: currentHorizon,
      });

      this.form.patchValue(
        {
          assets: nextAssets,
          timeframe: selected.timeframe,
          horizon: selected.horizon,
        },
        { emitEvent: false }
      );
      this.marketSelection.update({
        asset: nextAssets[0] ?? '',
        timeframe: selected.timeframe,
        horizon: selected.horizon,
      });
    }),
    shareReplay(1)
  );

  readonly selectionSummary$ = combineLatest([
    this.assets$,
    this.form.valueChanges.pipe(startWith(this.form.getRawValue())),
  ]).pipe(
    map(([assets, formValue]) => {
      const selectedAssets = formValue.assets ?? [];
      const firstSelectedAsset =
        assets.find((item) => item.asset === selectedAssets[0]) ?? assets[0] ?? null;
      const selected = this.marketSelection.resolve(assets, {
        asset: firstSelectedAsset?.asset ?? '',
        timeframe: formValue.timeframe,
        horizon: formValue.horizon,
      });

      return {
        availableAssets: assets,
        selectedAssets,
        timeframes: selected.timeframes,
        horizons: selected.horizons,
      };
    }),
    tap((summary) => {
      const currentTimeframe = this.form.controls.timeframe.value;
      const currentHorizon = this.form.controls.horizon.value;

      const nextTimeframe = summary.timeframes.includes(currentTimeframe)
        ? currentTimeframe
        : (summary.timeframes[0] ?? '');

      const nextHorizon = summary.horizons.includes(currentHorizon)
        ? currentHorizon
        : (summary.horizons[0] ?? '');

      if (nextTimeframe !== currentTimeframe || nextHorizon !== currentHorizon) {
        this.form.patchValue(
          {
            timeframe: nextTimeframe,
            horizon: nextHorizon,
          },
          { emitEvent: false }
        );
      }

      this.marketSelection.update({
        asset: summary.selectedAssets[0] ?? '',
        timeframe: this.form.controls.timeframe.value,
        horizon: this.form.controls.horizon.value,
      });
    }),
    shareReplay(1)
  );

  readonly vm$ = this.form.valueChanges.pipe(
    startWith(this.form.getRawValue()),
    tap((value) =>
      this.marketSelection.update({
        asset: value.assets?.[0] ?? '',
        timeframe: value.timeframe ?? '',
        horizon: value.horizon ?? '',
      })
    ),
    map((value) => this.normalizeFormValue(value as CompareFormValue)),
    filter((value) => !!value.timeframe && !!value.horizon),
    switchMap((value) =>
      combineLatest({
        compare: this.compareService.getCompare(value.assets, value.timeframe, value.horizon),
        correlations: this.getCorrelations(value.assets, value.timeframe),
      }).pipe(
        map(({ compare, correlations }) => ({
          rows: compare.rows,
          meta: compare.meta,
          correlations,
          leaderAsset: value.assets[0] ?? null,
        })),
        catchError((error) => {
          console.error('[CompareComponent] vm error', error);
          return of({
            rows: [],
            meta: {
              timeframe: value.timeframe,
              horizon: value.horizon,
              count: 0,
            },
            correlations: [],
            leaderAsset: value.assets[0] ?? null,
          } satisfies CompareViewModel);
        })
      )
    ),
    shareReplay(1)
  );

  toggleAsset(asset: string, checked: boolean): void {
    const current = this.form.controls.assets.value;

    if (checked) {
      if (current.includes(asset)) return;
      this.form.controls.assets.setValue([...current, asset]);
      return;
    }

    this.form.controls.assets.setValue(current.filter((item) => item !== asset));
  }

  isSelected(asset: string): boolean {
    return this.form.controls.assets.value.includes(asset);
  }

  badgeClass(signal: CompareSignal): string {
    switch (signal) {
      case 'BUY':
        return 'compare-badge-buy';
      case 'SELL':
        return 'compare-badge-sell';
      default:
        return 'compare-badge-hold';
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
      maximumFractionDigits: 0,
      style: 'percent',
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

  expectedReturnClass(row: CompareRow): string {
    if (row.expectedReturn > 0) return expectedReturnClass('positive');
    if (row.expectedReturn < 0) return expectedReturnClass('negative');
    return expectedReturnClass('neutral');
  }

  combinedReading(row: CompareRow): string {
    return `${row.asset} · ${row.signal} · ${row.confidenceLevel} · ${this.formatSignedPercent(row.expectedReturn)}`;
  }

  formatNumber(value: number | null, min = 2, max = 2): string {
    if (value == null) return '—';

    return value.toLocaleString('es-CL', {
      minimumFractionDigits: min,
      maximumFractionDigits: max,
    });
  }

  formatCorrelation(value: number): string {
    return value.toLocaleString('es-CL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  signalCount(rows: CompareRow[], signal: CompareSignal): number {
    return rows.filter((row) => row.signal === signal).length;
  }

  strongestRow(rows: CompareRow[]): CompareRow | null {
    return rows.reduce<CompareRow | null>((best, row) => {
      if (!best) return row;
      return row.signalStrength > best.signalStrength ? row : best;
    }, null);
  }

  formatStrength(value: number): string {
    return value.toLocaleString('es-CL', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
      style: 'percent',
    });
  }

  correlationBadgeClass(value: number): string {
    if (value > 0.7) return 'compare-badge-buy';
    if (value > 0.3) return 'compare-badge-hold';
    if (value > -0.3) return 'compare-badge-hold';
    return 'compare-badge-sell';
  }

  private getCorrelations(assets: string[], timeframe: string) {
    const normalized = [...new Set(assets.filter(Boolean))].slice(0, 6);

    if (normalized.length < 2) {
      return of([] as CorrelationItem[]);
    }

    const leaderAsset = normalized[0];
    const limit = 30;

    return combineLatest(
      normalized.map((asset) =>
        this.historyService.getPrices({
          asset,
          timeframe,
          limit,
          order: 'desc',
        }).pipe(
          map((response) => ({
            asset,
            values: [...(response?.data ?? [])].reverse().map((row) => row.close),
          })),
          catchError((error) => {
            console.error(`[CompareComponent] correlation history error for ${asset}`, error);
            return of({
              asset,
              values: [],
            });
          })
        )
      )
    ).pipe(
      map((series) => {
        const leaderSeries = series.find((item) => item.asset === leaderAsset)?.values ?? [];

        return series
          .filter((item) => item.asset !== leaderAsset)
          .map((item) => {
            const value = this.correlation(leaderSeries, item.values);

            return {
              asset: item.asset,
              against: leaderAsset,
              value,
              label: this.correlationLabel(value),
            };
          });
      })
    );
  }

  private correlation(a: number[], b: number[]): number {
    const len = Math.min(a.length, b.length);

    if (len < 2) return 0;

    const seriesA = a.slice(-len);
    const seriesB = b.slice(-len);

    const avgA = seriesA.reduce((sum, value) => sum + value, 0) / len;
    const avgB = seriesB.reduce((sum, value) => sum + value, 0) / len;

    let numerator = 0;
    let denA = 0;
    let denB = 0;

    for (let index = 0; index < len; index++) {
      const diffA = seriesA[index] - avgA;
      const diffB = seriesB[index] - avgB;

      numerator += diffA * diffB;
      denA += diffA * diffA;
      denB += diffB * diffB;
    }

    return numerator / Math.sqrt(denA * denB || 1);
  }

  private correlationLabel(value: number): string {
    if (value > 0.7) return 'Alta correlación';
    if (value > 0.3) return 'Media correlación';
    if (value > -0.3) return 'Neutral';
    if (value > -0.7) return 'Inversa media';
    return 'Inversa fuerte';
  }

  private normalizeFormValue(value: CompareFormValue): CompareFormValue {
    return {
      assets: [...new Set((value.assets ?? []).filter(Boolean))].slice(0, 6),
      timeframe: value.timeframe ?? '',
      horizon: value.horizon ?? '',
    };
  }
}
