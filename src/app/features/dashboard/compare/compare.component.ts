import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';

import { AssetsService } from '../../../core/services/assets.service';
import { CompareService } from '../../../core/services/compare.service';
import { AssetInfo } from '../../../core/models/assets.model';
import { CompareRow, CompareSignal } from '../../../core/models/compare.model';

type CompareFormValue = {
  assets: string[];
  timeframe: string;
  horizon: string;
};

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './compare.component.html',
  styleUrl: './compare.component.scss',
})
export class CompareComponent {
  private readonly fb = inject(FormBuilder);
  private readonly assetsService = inject(AssetsService);
  private readonly compareService = inject(CompareService);

  readonly form = this.fb.nonNullable.group({
    assets: this.fb.nonNullable.control<string[]>(['BTC', 'ETH', 'SOL']),
    timeframe: this.fb.nonNullable.control<string>('1m'),
    horizon: this.fb.nonNullable.control<string>('5m'),
  });

  readonly assets$ = this.assetsService.list().pipe(
    tap((assets: AssetInfo[]) => {
      if (!assets.length) return;

      const selectedAssets = this.form.controls.assets.value.filter((asset) =>
        assets.some((item) => item.asset === asset)
      );

      const firstAsset = assets[0];
      const currentTimeframe = this.form.controls.timeframe.value;
      const currentHorizon = this.form.controls.horizon.value;

      const nextAssets = selectedAssets.length
        ? selectedAssets
        : assets.slice(0, 3).map((item) => item.asset);

      const nextTimeframe = firstAsset.timeframes?.includes(currentTimeframe)
        ? currentTimeframe
        : (firstAsset.timeframes?.[0] ?? '1m');

      const nextHorizon = firstAsset.horizons?.includes(currentHorizon)
        ? currentHorizon
        : (firstAsset.horizons?.[0] ?? '5m');

      this.form.patchValue(
        {
          assets: nextAssets,
          timeframe: nextTimeframe,
          horizon: nextHorizon,
        },
        { emitEvent: false }
      );
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

      return {
        availableAssets: assets,
        selectedAssets,
        timeframes: firstSelectedAsset?.timeframes ?? ['1m'],
        horizons: firstSelectedAsset?.horizons ?? ['5m'],
      };
    }),
    tap((summary) => {
      const currentTimeframe = this.form.controls.timeframe.value;
      const currentHorizon = this.form.controls.horizon.value;

      const nextTimeframe = summary.timeframes.includes(currentTimeframe)
        ? currentTimeframe
        : (summary.timeframes[0] ?? '1m');

      const nextHorizon = summary.horizons.includes(currentHorizon)
        ? currentHorizon
        : (summary.horizons[0] ?? '5m');

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
    map((value) => this.normalizeFormValue(value as CompareFormValue)),
    switchMap((value) =>
      this.compareService.getCompare(value.assets, value.timeframe, value.horizon)
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
        return 'bg-success-subtle text-success-emphasis border border-success-subtle';
      case 'SELL':
        return 'bg-danger-subtle text-danger-emphasis border border-danger-subtle';
      default:
        return 'bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle';
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

  formatNumber(value: number | null, min = 2, max = 2): string {
    if (value == null) return '—';

    return value.toLocaleString('es-CL', {
      minimumFractionDigits: min,
      maximumFractionDigits: max,
    });
  }

  private normalizeFormValue(value: CompareFormValue): CompareFormValue {
    return {
      assets: (value.assets ?? []).slice(0, 6),
      timeframe: value.timeframe ?? '1m',
      horizon: value.horizon ?? '5m',
    };
  }
}