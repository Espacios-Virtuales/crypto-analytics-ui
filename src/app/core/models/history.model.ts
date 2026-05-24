
export interface HistoryMetaBase {
    asset: string;
    timeframe: string;
    limit: number;
    order: 'asc' | 'desc';
    total: number;
  }
  
  export interface PricesHistoryMeta extends HistoryMetaBase {
    from?: string | null;
    to?: string | null;
  }
  
  export interface FeaturesHistoryMeta extends HistoryMetaBase {
    features_version: string;
  }
  
  export interface PredictionsHistoryMeta extends HistoryMetaBase {
    horizon: string;
    model_version: string;
  }
  
  export interface PricePoint {
    ts_utc: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    source: string;
  }
  
  export interface FeaturePoint {
    ts_utc: string;
    ema_12: number;
    ema_26: number;
    macd: number;
    macd_signal: number;
    rsi: number;
    volatility: number;
  }
  
  export interface PredictionPoint {
    ts_utc: string;
    y_hat: number;
    confidence: number;
    explanation: string | null;
  }
  
  export interface PricesHistoryResponse {
    meta: PricesHistoryMeta;
    data: PricePoint[];
  }
  
  export interface FeaturesHistoryResponse {
    meta: FeaturesHistoryMeta;
    data: FeaturePoint[];
  }
  
  export interface PredictionsHistoryResponse {
    meta: PredictionsHistoryMeta;
    data: PredictionPoint[];
  }
  

  export interface HistoryQuery  {
    asset: string;
    timeframe: string;
    from?: string;
    to?: string;
    limit?: number;
    offset?: number;
    order?: 'asc' | 'desc';
  }
  
  export interface FeaturesHistoryQuery extends HistoryQuery {
    features_version?: string;
  }
  
  export interface PredictionsHistoryQuery extends HistoryQuery {
    horizon?: string;
    model_version?: string;
  }
