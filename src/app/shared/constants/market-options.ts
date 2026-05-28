export const MARKET_TIMEFRAME_OPTIONS = ['5m', '1m'] as const;
export const MARKET_HORIZON_OPTIONS = ['15m', '10m', '5m'] as const;
export const HISTORY_LIMIT_OPTIONS = [25, 50, 100, 250, 500, 1000] as const;

export type MarketTimeframeOption = (typeof MARKET_TIMEFRAME_OPTIONS)[number];
export type MarketHorizonOption = (typeof MARKET_HORIZON_OPTIONS)[number];
export type HistoryLimitOption = (typeof HISTORY_LIMIT_OPTIONS)[number];

export function mergeMarketOptions(
  backendOptions: readonly string[] | null | undefined,
  uiOptions: readonly string[]
): string[] {
  const allowedOptions = new Set(uiOptions);
  const backendAllowedOptions =
    backendOptions?.filter((option) => option && allowedOptions.has(option)) ?? [];
  const options = backendAllowedOptions.length ? backendAllowedOptions : uiOptions;

  return [...new Set(options)].sort((left, right) => durationToSeconds(right) - durationToSeconds(left));
}

export function normalizeMarketTimeframes(
  timeframes: readonly string[] | null | undefined
): string[] {
  return mergeMarketOptions(timeframes, MARKET_TIMEFRAME_OPTIONS);
}

export function normalizeMarketHorizons(
  horizons: readonly string[] | null | undefined
): string[] {
  return mergeMarketOptions(horizons, MARKET_HORIZON_OPTIONS);
}

function durationToSeconds(value: string): number {
  const match = value.match(/^(\d+)([smhd])$/);
  if (!match) return 0;

  const amount = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case 's':
      return amount;
    case 'm':
      return amount * 60;
    case 'h':
      return amount * 60 * 60;
    case 'd':
      return amount * 24 * 60 * 60;
    default:
      return 0;
  }
}
