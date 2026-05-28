import {
  normalizeMarketHorizons,
  normalizeMarketTimeframes,
} from './market-options';

describe('market-options constants', () => {
  it('filters and sorts timeframes by descending duration', () => {
    expect(normalizeMarketTimeframes(['30s', '1m', '5m'])).toEqual(['5m', '1m']);
  });

  it('filters and sorts horizons by descending duration', () => {
    expect(normalizeMarketHorizons(['5m', '15m', '30s', '10m'])).toEqual([
      '15m',
      '10m',
      '5m',
    ]);
  });

  it('uses allowed defaults when backend options are empty after filtering', () => {
    expect(normalizeMarketTimeframes(['30s'])).toEqual(['5m', '1m']);
    expect(normalizeMarketHorizons([])).toEqual(['15m', '10m', '5m']);
  });
});
