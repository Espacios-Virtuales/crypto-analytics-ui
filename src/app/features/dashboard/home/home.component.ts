import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, of } from 'rxjs';
import { catchError, map, shareReplay, startWith, switchMap } from 'rxjs/operators';

import { AssetsService } from '../../../core/services/assets.service';
import { LatestService } from '../../../core/services/latest.service';
import { AssetInfo } from '../../../core/models/assets.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private fb = inject(FormBuilder);
  private assetsService = inject(AssetsService);
  private latestService = inject(LatestService);

  readonly assets$ = this.assetsService.list().pipe(shareReplay(1));

  readonly form = this.fb.nonNullable.group({
    asset: 'BTC',
    timeframe: '1m',
    horizon: '5m',
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
    shareReplay(1)
  );

  readonly pulse$ = this.form.valueChanges.pipe(
    startWith(this.form.getRawValue()),
    switchMap((value) =>
      combineLatest({
        price: this.latestService.getPrice({
          asset: value.asset ?? 'BTC',
          timeframe: value.timeframe ?? '1m',
        }),
        feature: this.latestService.getFeature({
          asset: value.asset ?? 'BTC',
          timeframe: value.timeframe ?? '1m',
        }),
        prediction: this.latestService.getPrediction({
          asset: value.asset ?? 'BTC',
          timeframe: value.timeframe ?? '1m',
          horizon: value.horizon ?? '5m',
        }),
      }).pipe(
        catchError((error) => {
          console.error('[HomeComponent] pulse error', error);
          return of(null);
        })
      )
    ),
    shareReplay(1)
  );

  onAssetChange(asset: AssetInfo): void {
    this.form.patchValue({
      asset: asset.asset,
      timeframe: asset.timeframes?.[0] ?? '1m',
      horizon: asset.horizons?.[0] ?? '5m',
    });
  }
}