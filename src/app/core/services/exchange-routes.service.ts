import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ExchangeRoute, ExchangeRoutesResponse } from '../models/exchange-route.model';
import { ApiService } from './api.service';

const EXCHANGE_ORDER = ['binance', 'kraken', 'coinbase'];

@Injectable({ providedIn: 'root' })
export class ExchangeRoutesService {
  constructor(private api: ApiService) {}

  routes(asset: string, quote = 'USD'): Observable<ExchangeRoutesResponse> {
    return this.api.get<ExchangeRoutesResponse>('/exchange/routes', { asset, quote }).pipe(
      map((response) => ({
        ...response,
        routes: this.sortRoutes(response?.routes ?? []),
      }))
    );
  }

  private sortRoutes(routes: ExchangeRoute[]): ExchangeRoute[] {
    return routes
      .map((route, index) => ({ route, index }))
      .sort((left, right) => {
        const leftOrder = this.exchangeOrder(left.route.exchange);
        const rightOrder = this.exchangeOrder(right.route.exchange);

        if (leftOrder !== rightOrder) return leftOrder - rightOrder;
        return left.index - right.index;
      })
      .map(({ route }) => route);
  }

  private exchangeOrder(exchange: string): number {
    const index = EXCHANGE_ORDER.indexOf(exchange.toLowerCase());
    return index >= 0 ? index : EXCHANGE_ORDER.length;
  }
}
