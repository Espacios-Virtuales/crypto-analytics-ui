import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { AssetsResponse, AssetInfo } from '../models/assets.model';
import {
  normalizeMarketHorizons,
  normalizeMarketTimeframes,
} from '../../shared/constants/market-options';

@Injectable({ providedIn: 'root' })
export class AssetsService {
  constructor(private api: ApiService) {}

  list(): Observable<AssetInfo[]> {
    return this.api.get<AssetsResponse>('/assets').pipe(
      map((res) => (res?.data ?? []).map((asset) => this.normalizeMarketOptions(asset)))
    );
  }

  private normalizeMarketOptions(asset: AssetInfo): AssetInfo {
    return {
      ...asset,
      timeframes: normalizeMarketTimeframes(asset.timeframes),
      horizons: normalizeMarketHorizons(asset.horizons),
    };
  }
}
