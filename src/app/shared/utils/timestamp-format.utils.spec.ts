import { formatDashboardTimestamp } from './timestamp-format.utils';

describe('timestamp-format utils', () => {
  it('formats ISO-like timestamps without timezone shifting', () => {
    expect(formatDashboardTimestamp('2026-05-24T14:12:00')).toBe('24-05-2026 ; 14:12');
  });

  it('returns fallback for empty values', () => {
    expect(formatDashboardTimestamp(null)).toBe('—');
  });
});
