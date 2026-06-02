import {
  normalizeMarketHorizons,
  normalizeMarketTimeframes,
} from './market-options';

describe('market-options constants', () => {
  it('sorts timeframes by ascending duration', () => {
    expect(normalizeMarketTimeframes(['15m', '5m', '1m'])).toEqual([
      '1m',
      '5m',
      '15m',
    ]);
  });

  it('sorts horizons by ascending duration', () => {
    expect(normalizeMarketHorizons(['15m', '5m', '10m'])).toEqual([
      '5m',
      '10m',
      '15m',
    ]);
  });

  it('uses allowed defaults when backend options are empty', () => {
    expect(normalizeMarketTimeframes([])).toEqual(['1m', '5m', '15m']);
    expect(normalizeMarketHorizons([])).toEqual(['5m', '10m', '15m']);
  });
});
