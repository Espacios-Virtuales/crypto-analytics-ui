import type { ConfidenceLevel } from '../../shared/utils/signal-reading.utils';
import type {
  MacdContext,
  RsiContext,
  VolatilityLevel,
} from '../../shared/utils/technical-reading.utils';

export type CompareSignal = 'BUY' | 'SELL' | 'HOLD';

export interface CompareRow {
  asset: string;
  timeframe: string;
  horizon: string;
  price: number;
  prediction: number;
  expectedReturn: number;
  confidence: number | null;
  confidenceLevel: ConfidenceLevel;
  rsi: number | null;
  rsiContext: RsiContext;
  macd: number | null;
  macdContext: MacdContext;
  volatility: number | null;
  volatilityLevel: VolatilityLevel;
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
