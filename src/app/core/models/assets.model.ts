export interface AssetLast {
  feature_ts_utc?: string | null;
  prediction_ts_utc?: string | null;
  price_ts_utc?: string | null;
  signal_ts_utc?: string | null;
  timeframe?: string;
  horizon?: string;
  status?: string;
}
  
export interface AssetVersions {
  features_version?: string;
  model_version?: string;
}

export interface AssetStatusSummary {
  total: number;
  ok: number;
  stale: number;
  partial: number;
  missing: number;
}

export interface AssetMatrixEntry {
  status: string;
  confidence?: number | null;
  signal?: string | null;
  age_seconds?: number | null;
}
  
export interface AssetInfo {
  asset: string;
  ready: boolean;
  timeframes: string[];
  horizons: string[];
  status_summary?: AssetStatusSummary;
  matrix?: Record<string, Record<string, AssetMatrixEntry>>;
  last?: AssetLast | null;
  versions?: AssetVersions;
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
