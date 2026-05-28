export interface ExchangeRoute {
  exchange: string;
  pair: string;
  url: string;
}

export interface ExchangeRoutesResponse {
  asset: string;
  quote: string;
  routes: ExchangeRoute[];
}
