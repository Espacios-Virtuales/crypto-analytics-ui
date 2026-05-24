import {
  buildSignalReading,
  confidenceLevel,
  expectedReturn,
} from './signal-reading.utils';

describe('signal-reading utils', () => {
  it('calculates expected return from close and prediction', () => {
    expect(expectedReturn(100, 110)).toBeCloseTo(0.1);
    expect(expectedReturn(100, 90)).toBeCloseTo(-0.1);
  });

  it('maps confidence to readable levels', () => {
    expect(confidenceLevel(0.39)).toBe('Baja');
    expect(confidenceLevel(0.4)).toBe('Moderada');
    expect(confidenceLevel(0.7)).toBe('Alta');
    expect(confidenceLevel(0.85)).toBe('Muy alta');
  });

  it('builds the assisted reading text', () => {
    const reading = buildSignalReading(100, 110, 0.65);

    expect(reading.signal).toBe('BUY');
    expect(reading.confidenceLevel).toBe('Moderada');
    expect(reading.text).toBe('BUY con confianza moderada');
  });
});
