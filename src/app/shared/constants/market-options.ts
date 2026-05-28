export const MARKET_TIMEFRAME_OPTIONS = ['1m', '5m'] as const;
export const MARKET_HORIZON_OPTIONS = ['5m', '10m', '15m'] as const;
export const HISTORY_LIMIT_OPTIONS = [25, 50, 100, 250, 500, 1000] as const;

export type MarketTimeframeOption = (typeof MARKET_TIMEFRAME_OPTIONS)[number];
export type MarketHorizonOption = (typeof MARKET_HORIZON_OPTIONS)[number];
export type HistoryLimitOption = (typeof HISTORY_LIMIT_OPTIONS)[number];

export function mergeMarketOptions(
  backendOptions: readonly string[] | null | undefined,
  uiOptions: readonly string[]
): string[] {
  const options = backendOptions?.filter(Boolean) ?? [];
  return options.length ? [...new Set(options)] : [...uiOptions];
}
