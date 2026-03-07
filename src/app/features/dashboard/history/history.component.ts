import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, of } from 'rxjs';
import { startWith, switchMap, catchError, map } from 'rxjs/operators';
import { AssetsService } from '../../../core/services/assets.service';
import { HistoryService } from '../../../core/services/history.service';
import {
  HistoryQuery,
  FeaturesHistoryQuery,
  PredictionsHistoryQuery,
} from '../../../core/models/history.model';

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

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './history.component.html',
})
export class HistoryComponent {
  private fb = inject(FormBuilder);
  private assetsService = inject(AssetsService);
  private historyService = inject(HistoryService);

  readonly assets$ = this.assetsService.list();

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

  readonly vm$ = this.form.valueChanges.pipe(
    startWith(this.form.getRawValue()),
    map(value => ({ ...this.form.getRawValue(), ...value }) as HistoryFormValue),
    switchMap((value) => {
      const pricesQuery: HistoryQuery = {
        asset: value.asset,
        timeframe: value.timeframe,
        from: value.from || undefined,
        to: value.to || undefined,
        limit: value.limit,
        order: value.order,
      };
  
      const featuresQuery: FeaturesHistoryQuery = {
        asset: value.asset,
        timeframe: value.timeframe,
        features_version: value.features_version || undefined,
        from: value.from || undefined,
        to: value.to || undefined,
        limit: value.limit,
        order: value.order,
      };
  
      const predictionsQuery: PredictionsHistoryQuery = {
        asset: value.asset,
        timeframe: value.timeframe,
        horizon: value.horizon || undefined,
        model_version: value.model_version || undefined,
        from: value.from || undefined,
        to: value.to || undefined,
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
    })
  );
}