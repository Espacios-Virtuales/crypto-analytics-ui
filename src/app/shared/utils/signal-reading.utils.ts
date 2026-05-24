export type SignalAction = 'BUY' | 'SELL' | 'HOLD';
export type ConfidenceLevel = 'Baja' | 'Moderada' | 'Alta' | 'Muy alta';
export type ExpectedReturnTone = 'positive' | 'negative' | 'neutral';

export interface SignalReading {
  signal: SignalAction;
  expectedReturn: number;
  absoluteStrength: number;
  confidence: number | null;
  confidenceLevel: ConfidenceLevel;
  text: string;
  tone: ExpectedReturnTone;
}

const HOLD_THRESHOLD = 0.001;

export function expectedReturn(close: number | null | undefined, yHat: number | null | undefined): number {
  if (!close || !yHat) return 0;
  return (yHat - close) / close;
}

export function confidenceLevel(confidence: number | null | undefined): ConfidenceLevel {
  const value = confidence ?? 0;

  if (value < 0.4) return 'Baja';
  if (value < 0.7) return 'Moderada';
  if (value < 0.85) return 'Alta';
  return 'Muy alta';
}

export function signalFromExpectedReturn(value: number): SignalAction {
  if (Math.abs(value) < HOLD_THRESHOLD) return 'HOLD';
  return value > 0 ? 'BUY' : 'SELL';
}

export function toneFromExpectedReturn(value: number): ExpectedReturnTone {
  if (value > 0) return 'positive';
  if (value < 0) return 'negative';
  return 'neutral';
}

export function buildSignalReading(
  close: number | null | undefined,
  yHat: number | null | undefined,
  confidence: number | null | undefined
): SignalReading {
  const value = expectedReturn(close, yHat);
  const signal = signalFromExpectedReturn(value);
  const level = confidenceLevel(confidence);

  return {
    signal,
    expectedReturn: value,
    absoluteStrength: Math.abs(value),
    confidence: confidence ?? null,
    confidenceLevel: level,
    text: `${signal} con confianza ${level.toLowerCase()}`,
    tone: toneFromExpectedReturn(value),
  };
}

export function signalBadgeClass(signal: SignalAction): string {
  switch (signal) {
    case 'BUY':
      return 'signal-buy';
    case 'SELL':
      return 'signal-sell';
    default:
      return 'signal-hold';
  }
}

export function expectedReturnClass(tone: ExpectedReturnTone): string {
  switch (tone) {
    case 'positive':
      return 'expected-return-positive';
    case 'negative':
      return 'expected-return-negative';
    default:
      return 'expected-return-neutral';
  }
}
