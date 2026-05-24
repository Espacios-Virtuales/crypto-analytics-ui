export interface AssetLast {
    feature_ts_utc: string | null;
    prediction_ts_utc: string | null;
    price_ts_utc: string | null;
    timeframe: string;
    horizon: string;
  }
  
  export interface AssetVersions {
    features_version: string;
    model_version: string;
  }
  
  export interface AssetInfo {
    asset: string;          // "BTC"
    ready: boolean;
    timeframes: string[];
    horizons: string[];
    last: AssetLast;
    versions: AssetVersions;
  }
  
  export interface AssetsMetaDefaults {
    timeframe: string;
    horizon: string;
    features_version: string;
    model_version: string;
    ready_max_age_seconds: number;
  }
  
  export interface AssetsResponse {
    data: AssetInfo[];
    meta: {
      count: number;
      defaults: AssetsMetaDefaults;
    };
  }
