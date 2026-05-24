import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { AssetInfo } from '../models/assets.model';

export interface MarketSelection {
  asset: string;
  timeframe: string;
  horizon: string;
}

export interface ResolvedMarketSelection extends MarketSelection {
  selectedAsset: AssetInfo | null;
  timeframes: string[];
  horizons: string[];
}

const EMPTY_SELECTION: MarketSelection = {
  asset: '',
  timeframe: '',
  horizon: '',
};

@Injectable({ providedIn: 'root' })
export class MarketSelectionService {
  private readonly selectionSubject = new BehaviorSubject<MarketSelection>(EMPTY_SELECTION);
  readonly selection$ = this.selectionSubject.asObservable();

  snapshot(): MarketSelection {
    return this.selectionSubject.value;
  }

  update(selection: Partial<MarketSelection>): void {
    const current = this.snapshot();
    const next = {
      asset: selection.asset ?? current.asset,
      timeframe: selection.timeframe ?? current.timeframe,
      horizon: selection.horizon ?? current.horizon,
    };

    if (
      next.asset === current.asset &&
      next.timeframe === current.timeframe &&
      next.horizon === current.horizon
    ) {
      return;
    }

    this.selectionSubject.next(next);
  }

  resolve(assets: AssetInfo[], current: Partial<MarketSelection>): ResolvedMarketSelection {
    if (!assets.length) {
      return {
        asset: current.asset ?? '',
        timeframe: current.timeframe ?? '',
        horizon: current.horizon ?? '',
        selectedAsset: null,
        timeframes: [],
        horizons: [],
      };
    }

    const selectedAsset =
      assets.find((item) => item.asset === current.asset) ?? assets[0];

    const timeframes = selectedAsset.timeframes ?? [];
    const horizons = selectedAsset.horizons ?? [];

    return {
      asset: selectedAsset.asset,
      timeframe: timeframes.includes(current.timeframe ?? '')
        ? current.timeframe ?? ''
        : timeframes[0] ?? '',
      horizon: horizons.includes(current.horizon ?? '')
        ? current.horizon ?? ''
        : horizons[0] ?? '',
      selectedAsset,
      timeframes,
      horizons,
    };
  }
}
