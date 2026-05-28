import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { shareReplay } from 'rxjs/operators';

import { AssetInfo, AssetMatrixEntry } from '../../../core/models/assets.model';
import { AssetsService } from '../../../core/services/assets.service';
import { CryptoTimestampPipe } from '../../../shared/pipes/crypto-timestamp.pipe';

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [CommonModule, CryptoTimestampPipe],
  templateUrl: './assets.component.html',
  styleUrl: './assets.component.scss',
})
export class AssetsComponent {
  private readonly assetsService = inject(AssetsService);

  readonly assets$ = this.assetsService.list().pipe(shareReplay(1));

  trackByAsset(_: number, item: AssetInfo): string {
    return item.asset;
  }

  lastStatus(asset: AssetInfo): string {
    const latest = this.latestMatrixEntry(asset);
    return asset.last?.status ?? latest?.status ?? '-';
  }

  lastTimestamp(asset: AssetInfo): string | null {
    return (
      asset.last?.signal_ts_utc ??
      asset.last?.prediction_ts_utc ??
      asset.last?.feature_ts_utc ??
      asset.last?.price_ts_utc ??
      null
    );
  }

  summary(asset: AssetInfo): string {
    const summary = asset.status_summary;
    if (!summary) return '-';
    return `OK ${summary.ok}/${summary.total} · stale ${summary.stale} · parcial ${summary.partial} · missing ${summary.missing}`;
  }

  private latestMatrixEntry(asset: AssetInfo): AssetMatrixEntry | null {
    const matrix = asset.matrix ?? {};

    for (const timeframe of asset.timeframes ?? []) {
      const byHorizon = matrix[timeframe] ?? {};
      for (const horizon of asset.horizons ?? []) {
        const entry = byHorizon[horizon];
        if (entry) return entry;
      }
    }

    return null;
  }
}
