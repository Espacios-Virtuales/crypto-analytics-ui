export type VolatilityLevel = 'Baja' | 'Media' | 'Alta';

export interface TechnicalReading {
  rsiText: string;
  macdText: string;
  volatilityLevel: VolatilityLevel;
  volatilityText: string;
}

export function rsiReading(rsi: number | null | undefined): string {
  if (rsi == null) return 'RSI sin lectura suficiente';
  if (rsi <= 30) return 'RSI bajo: posible sobreventa';
  if (rsi >= 70) return 'RSI alto: posible sobrecompra';
  return 'RSI neutral';
}

export function macdReading(macd: number | null | undefined): string {
  if (macd == null) return 'MACD sin lectura suficiente';
  if (macd > 0) return 'MACD positivo: momentum positivo';
  if (macd < 0) return 'MACD negativo: momentum negativo';
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
    macdText: macdReading(macd),
    volatilityLevel: level,
    volatilityText: `Volatilidad ${level.toLowerCase()}`,
  };
}
