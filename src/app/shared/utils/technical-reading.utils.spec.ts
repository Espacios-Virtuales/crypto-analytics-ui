import {
  buildTechnicalReading,
  macdReading,
  rsiReading,
  volatilityLevel,
} from './technical-reading.utils';

describe('technical-reading utils', () => {
  it('translates RSI readings', () => {
    expect(rsiReading(25)).toBe('RSI bajo: posible sobreventa');
    expect(rsiReading(75)).toBe('RSI alto: posible sobrecompra');
    expect(rsiReading(50)).toBe('RSI neutral');
  });

  it('translates MACD readings', () => {
    expect(macdReading(1)).toBe('MACD positivo: momentum positivo');
    expect(macdReading(-1)).toBe('MACD negativo: momentum negativo');
    expect(macdReading(0)).toBe('MACD neutral');
  });

  it('classifies volatility', () => {
    expect(volatilityLevel(0.001)).toBe('Baja');
    expect(volatilityLevel(0.005)).toBe('Media');
    expect(volatilityLevel(0.02)).toBe('Alta');
  });

  it('builds a compact technical reading', () => {
    const reading = buildTechnicalReading(28, -3, 0.003);

    expect(reading.rsiText).toContain('sobreventa');
    expect(reading.macdText).toContain('momentum negativo');
    expect(reading.volatilityText).toBe('Volatilidad media');
  });
});
