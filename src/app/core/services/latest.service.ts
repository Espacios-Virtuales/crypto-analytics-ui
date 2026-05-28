import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  LatestFeatureResponse,
  LatestPredictionQuery,
  LatestPredictionResponse,
  LatestPriceResponse,
  LatestQuery,
  LatestSignalQuery,
  LatestSignalResponse,
} from '../models/latest.model';

@Injectable({ providedIn: 'root' })
export class LatestService {
  constructor(private api: ApiService) {}

  getPrice(query: LatestQuery): Observable<LatestPriceResponse> {
    return this.api.get<LatestPriceResponse>('/latest/price', query);
  }

  getFeature(query: LatestQuery): Observable<LatestFeatureResponse> {
    return this.api.get<LatestFeatureResponse>('/latest/feature', query);
  }

  getPrediction(query: LatestPredictionQuery): Observable<LatestPredictionResponse> {
    return this.api.get<LatestPredictionResponse>('/latest/prediction', query);
  }

  getSignal(query: LatestSignalQuery): Observable<LatestSignalResponse> {
    return this.api.get<LatestSignalResponse>('/latest/signal', query);
  }
}
