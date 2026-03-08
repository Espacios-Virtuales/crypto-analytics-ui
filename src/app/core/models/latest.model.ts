export interface LatestMetaBase {
    asset: string;
    timeframe: string;
    asof_ts_utc: string;
  }
  
  export interface LatestPredictionMeta extends LatestMetaBase {
    horizon: string;
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
    source: string;
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
  }
  
  export interface LatestPriceResponse {
    meta: LatestMetaBase;
    data: LatestPriceData;
  }
  
  export interface LatestFeatureResponse {
    meta: LatestMetaBase;
    data: LatestFeatureData;
  }
  
  export interface LatestPredictionResponse {
    meta: LatestPredictionMeta;
    data: LatestPredictionData;
  }
  
  export interface LatestQuery {
    asset: string;
    timeframe: string;
  }
  
  export interface LatestPredictionQuery extends LatestQuery {
    horizon?: string;
  }