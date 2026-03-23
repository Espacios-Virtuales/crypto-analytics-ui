export type CompareSignal = 'BUY' | 'SELL' | 'HOLD';

export interface CompareRow {
  asset: string;
  timeframe: string;
  horizon: string;
  price: number;
  prediction: number;
  confidence: number | null;
  rsi: number | null;
  macd: number | null;
  signal: CompareSignal;
  signalStrength: number;
  asof_ts_utc: string | null;
}

export interface CompareVm {
  rows: CompareRow[];
  meta: {
    timeframe: string;
    horizon: string;
    count: number;
  };
}