export type VolatilityLevel = 'Baja' | 'Media' | 'Alta';
export type RsiContext = 'Sobreventa' | 'Sobrecompra' | 'Neutral' | 'Sin lectura';
export type MacdContext = 'Momentum positivo' | 'Momentum negativo' | 'Neutral' | 'Sin lectura';

export interface TechnicalReading {
  rsiText: string;
  rsiContext: RsiContext;
  macdText: string;
  macdContext: MacdContext;
  volatilityLevel: VolatilityLevel;
  volatilityText: string;
}

export function rsiContext(rsi: number | null | undefined): RsiContext {
  if (rsi == null) return 'Sin lectura';
  if (rsi <= 30) return 'Sobreventa';
  if (rsi >= 70) return 'Sobrecompra';
  return 'Neutral';
}

export function rsiReading(rsi: number | null | undefined): string {
  const context = rsiContext(rsi);

  if (context === 'Sin lectura') return 'RSI sin lectura suficiente';
  if (context === 'Sobreventa') return 'RSI bajo: posible sobreventa';
  if (context === 'Sobrecompra') return 'RSI alto: posible sobrecompra';
  return 'RSI neutral';
}

export function macdContext(macd: number | null | undefined): MacdContext {
  if (macd == null) return 'Sin lectura';
  if (macd > 0) return 'Momentum positivo';
  if (macd < 0) return 'Momentum negativo';
  return 'Neutral';
}

export function macdReading(macd: number | null | undefined): string {
  const context = macdContext(macd);

  if (context === 'Sin lectura') return 'MACD sin lectura suficiente';
  if (context === 'Momentum positivo') return 'MACD positivo: momentum positivo';
  if (context === 'Momentum negativo') return 'MACD negativo: momentum negativo';
  return 'MACD neutral';
}

export function volatilityLevel(volatility: number | null | undefined): VolatilityLevel {
  const value = volatility ?? 0;

  if (value < 0.0025) return 'Baja';
  if (value < 0.01) return 'Media';
  return 'Alta';
}

export function buildTechnicalReading(
  rsi: number | null | undefined,
  macd: number | null | undefined,
  volatility: number | null | undefined
): TechnicalReading {
  const level = volatilityLevel(volatility);

  return {
    rsiText: rsiReading(rsi),
    rsiContext: rsiContext(rsi),
    macdText: macdReading(macd),
    macdContext: macdContext(macd),
    volatilityLevel: level,
    volatilityText: `Volatilidad ${level.toLowerCase()}`,
  };
}
