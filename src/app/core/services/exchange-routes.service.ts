import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ExchangeRoutesResponse } from '../models/exchange-route.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ExchangeRoutesService {
  constructor(private api: ApiService) {}

  routes(asset: string, quote = 'USD'): Observable<ExchangeRoutesResponse> {
    return this.api.get<ExchangeRoutesResponse>('/exchange/routes', { asset, quote });
  }
}
