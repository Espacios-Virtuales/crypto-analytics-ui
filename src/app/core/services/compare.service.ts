import { Injectable, inject } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { LatestService } from './latest.service';
import { CompareRow, CompareSignal, CompareVm } from '../models/compare.model';

@Injectable({ providedIn: 'root' })
export class CompareService {
  private readonly latestService = inject(LatestService);

  getCompare(
    assets: string[],
    timeframe: string,
    horizon: string
  ): Observable<CompareVm> {
    const normalizedAssets = this.normalizeAssets(assets);

    if (!normalizedAssets.length) {
      return of({
        rows: [],
        meta: {
          timeframe,
          horizon,
          count: 0,
        },
      });
    }

    return combineLatest(
      normalizedAssets.map((asset) => this.getCompareRow(asset, timeframe, horizon))
    ).pipe(
      map((rows) => ({
        rows: this.sortRows(rows),
        meta: {
          timeframe,
          horizon,
          count: rows.length,
        },
      }))
    );
  }

  private getCompareRow(
    asset: string,
    timeframe: string,
    horizon: string
  ): Observable<CompareRow> {
    return combineLatest({
      price: this.latestService.getPrice({
        asset,
        timeframe,
      }),
      prediction: this.latestService.getPrediction({
        asset,
        timeframe,
        horizon,
      }),
      feature: this.latestService.getFeature({
        asset,
        timeframe,
      }),
    }).pipe(
      map(({ price, prediction, feature }) => {
        const currentPrice = price?.data?.close ?? 0;
        const predictedPrice = prediction?.data?.y_hat ?? 0;
        const confidence = prediction?.data?.confidence ?? null;
        const rsi = feature?.data?.rsi ?? null;
        const macd = feature?.data?.macd ?? null;
        const signal = this.getSignal(currentPrice, predictedPrice);

        return {
          asset,
          timeframe,
          horizon,
          price: currentPrice,
          prediction: predictedPrice,
          confidence,
          rsi,
          macd,
          signal,
          signalStrength: this.getSignalStrength(currentPrice, predictedPrice),
          asof_ts_utc:
            price?.meta?.asof_ts_utc ??
            prediction?.meta?.asof_ts_utc ??
            feature?.meta?.asof_ts_utc ??
            null,
        };
      }),
      catchError((error) => {
        console.error(`[CompareService] row error for ${asset}`, error);

        return of(this.buildFallbackRow(asset, timeframe, horizon));
      })
    );
  }

  private buildFallbackRow(
    asset: string,
    timeframe: string,
    horizon: string
  ): CompareRow {
    return {
      asset,
      timeframe,
      horizon,
      price: 0,
      prediction: 0,
      confidence: null,
      rsi: null,
      macd: null,
      signal: 'HOLD',
      signalStrength: 0,
      asof_ts_utc: null,
    };
  }

  private sortRows(rows: CompareRow[]): CompareRow[] {
    return [...rows].sort((a, b) => {
      const confidenceA = a.confidence ?? -1;
      const confidenceB = b.confidence ?? -1;

      if (confidenceB !== confidenceA) {
        return confidenceB - confidenceA;
      }

      return b.signalStrength - a.signalStrength;
    });
  }

  private normalizeAssets(assets: string[]): string[] {
    return [...new Set(assets.filter(Boolean))].slice(0, 6);
  }

  private getSignal(price: number, prediction: number): CompareSignal {
    if (!price || !prediction) {
      return 'HOLD';
    }

    const diffRatio = Math.abs(prediction - price) / price;

    if (diffRatio < 0.001) {
      return 'HOLD';
    }

    return prediction > price ? 'BUY' : 'SELL';
  }

  private getSignalStrength(price: number, prediction: number): number {
    if (!price || !prediction) {
      return 0;
    }

    return Math.abs(prediction - price) / price;
  }
}