import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  LatestFeatureResponse,
  LatestPredictionQuery,
  LatestPredictionResponse,
  LatestPriceResponse,
  LatestQuery,
} from '../models/latest.model';

@Injectable({ providedIn: 'root' })
export class LatestService {
  constructor(private api: ApiService) {}

  getPrice(query: LatestQuery): Observable<LatestPriceResponse> {
    return this.api.get<LatestPriceResponse, LatestQuery>('/latest/price', query);
  }

  getFeature(query: LatestQuery): Observable<LatestFeatureResponse> {
    return this.api.get<LatestFeatureResponse, LatestQuery>('/latest/feature', query);
  }

  getPrediction(query: LatestPredictionQuery): Observable<LatestPredictionResponse> {
    return this.api.get<LatestPredictionResponse, LatestPredictionQuery>(
      '/latest/prediction',
      query
    );
  }
}