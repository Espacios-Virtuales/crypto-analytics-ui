import { formatDashboardTimestamp } from './timestamp-format.utils';

describe('timestamp-format utils', () => {
  it('formats UTC timestamps in Chile local time', () => {
    expect(formatDashboardTimestamp('2026-06-02T23:15:00')).toBe('02-06-2026 / 19:15');
  });

  it('treats timestamps without timezone suffix as UTC', () => {
    expect(formatDashboardTimestamp('2026-05-24T14:12:00')).toBe('24-05-2026 / 10:12');
  });

  it('returns fallback for empty values', () => {
    expect(formatDashboardTimestamp(null)).toBe('—');
  });

  it('returns the original value for invalid timestamps', () => {
    expect(formatDashboardTimestamp('not-a-timestamp')).toBe('not-a-timestamp');
  });
});
