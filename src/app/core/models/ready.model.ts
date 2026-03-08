export type ReadyStatus = 'READY' | 'NOT_READY';

export interface ReadyCheckGroup {
  ok?: boolean;
  asset?: string;
  timeframe?: string;
  last_ts_utc?: string | null;
  age_seconds?: number | null;
  // features/predictions extra
  features_version?: string;
  model_version?: string;
  horizon?: string;
}

export interface ReadyResponse {
  status: ReadyStatus;
  reason?: string;
  checks: {
    database: string;
    prices: ReadyCheckGroup;
    features: ReadyCheckGroup;
    predictions: ReadyCheckGroup;
  };
}