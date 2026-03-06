import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { combineLatest } from 'rxjs';
import { LatestService } from '../../../core/services/latest.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private latestService = inject(LatestService);

  readonly asset = 'BTC';
  readonly timeframe = '1m';
  readonly horizon = '5m';

  readonly pulse$ = combineLatest({
    price: this.latestService.getPrice({ asset: this.asset, timeframe: this.timeframe }),
    feature: this.latestService.getFeature({ asset: this.asset, timeframe: this.timeframe }),
    prediction: this.latestService.getPrediction({
      asset: this.asset,
      timeframe: this.timeframe,
      horizon: this.horizon,
    }),
  });
}