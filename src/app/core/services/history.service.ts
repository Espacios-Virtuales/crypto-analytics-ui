import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  FeaturesHistoryQuery,
  FeaturesHistoryResponse,
  HistoryQuery,
  PredictionsHistoryQuery,
  PredictionsHistoryResponse,
  PricesHistoryResponse,
} from '../models/history.model';

@Injectable({ providedIn: 'root' })
export class HistoryService {
  constructor(private api: ApiService) {}

  getPrices(query: HistoryQuery): Observable<PricesHistoryResponse> {
    return this.api.get<PricesHistoryResponse>('/history/prices', query);
  }
  
  getFeatures(query: FeaturesHistoryQuery): Observable<FeaturesHistoryResponse> {
    return this.api.get<FeaturesHistoryResponse>('/history/features', query);
  }
  
  getPredictions(query: PredictionsHistoryQuery): Observable<PredictionsHistoryResponse> {
    return this.api.get<PredictionsHistoryResponse>('/history/predictions', query);
  }
}