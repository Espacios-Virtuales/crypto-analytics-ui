export interface LatestMetaBase {
  asset: string;
  timeframe: string;
  asof_ts_utc: string;
}

export interface LatestPredictionMeta extends LatestMetaBase {
  horizon: string;
}

export interface FxContext {
  base_currency: string;
  display_quote_currency: string;
  fx_rate: number;
  fx_asof_ts_utc: string;
  provider: string;
}

export interface LatestPriceData {
  asset: string;
  timeframe: string;
  ts_utc: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  source?: string | null;
  quote_currency?: string;
  display_quote_currency?: string;
  display_close?: number;
}

export interface LatestFeatureData {
  asset: string;
  timeframe: string;
  ts_utc: string;
  rsi: number;
  ema_12: number;
  ema_26: number;
  macd: number;
  macd_signal: number;
  volatility: number;
  features_version: string;
}

export interface LatestPredictionData {
  asset: string;
  timeframe: string;
  ts_utc: string;
  horizon: string;
  y_hat: number;
  confidence: number;
  model_version: string;
  explanation: string;
  quote_currency?: string;
  display_quote_currency?: string;
  display_y_hat?: number;
}

export interface LatestPriceResponse {
  meta: LatestMetaBase;
  data: LatestPriceData;
  fx_context?: FxContext;
}

export interface LatestFeatureResponse {
  meta: LatestMetaBase;
  data: LatestFeatureData;
}

export interface LatestPredictionResponse {
  meta: LatestPredictionMeta;
  data: LatestPredictionData;
  fx_context?: FxContext;
}

export interface LatestSignalResponse {
  signal: 'BUY' | 'SELL' | 'HOLD' | string;
  strength: number;
  confidence: number;
  reason?: string;
  components?: Record<string, unknown>;
}

export interface LatestQuery {
  asset: string;
  timeframe: string;
  display_quote?: string;
}

export interface LatestPredictionQuery extends LatestQuery {
  horizon?: string;
}

export interface LatestSignalQuery {
  asset: string;
  timeframe: string;
  horizon?: string;
}
