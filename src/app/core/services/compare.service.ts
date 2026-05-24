import { Injectable, inject } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { LatestService } from './latest.service';
import { CompareRow, CompareVm } from '../models/compare.model';
import { buildSignalReading } from '../../shared/utils/signal-reading.utils';
import { buildTechnicalReading } from '../../shared/utils/technical-reading.utils';

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
        const volatility = feature?.data?.volatility ?? null;
        const reading = buildSignalReading(currentPrice, predictedPrice, confidence);
        const technical = buildTechnicalReading(rsi, macd, volatility);

        return {
          asset,
          timeframe,
          horizon,
          price: currentPrice,
          prediction: predictedPrice,
          expectedReturn: reading.expectedReturn,
          confidence,
          confidenceLevel: reading.confidenceLevel,
          rsi,
          rsiContext: technical.rsiContext,
          macd,
          macdContext: technical.macdContext,
          volatility,
          volatilityLevel: technical.volatilityLevel,
          signal: reading.signal,
          signalStrength: reading.absoluteStrength,
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
      expectedReturn: 0,
      confidence: null,
      confidenceLevel: 'Baja',
      rsi: null,
      rsiContext: 'Sin lectura',
      macd: null,
      macdContext: 'Sin lectura',
      volatility: null,
      volatilityLevel: 'Baja',
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
}
