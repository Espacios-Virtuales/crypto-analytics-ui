export const CHILE_TIME_ZONE = 'America/Santiago';
export const CHILE_TIME_LABEL = 'Hora local Chile';

const CHILE_TIMESTAMP_FORMATTER = new Intl.DateTimeFormat('es-CL', {
  timeZone: CHILE_TIME_ZONE,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

export function formatDashboardTimestamp(
  value: string | null | undefined,
  fallback = '—'
): string {
  if (!value) return fallback;

  const date = parseUtcTimestamp(value);

  if (!date) return value;

  const parts = CHILE_TIMESTAMP_FORMATTER.formatToParts(date);
  const day = getPart(parts, 'day');
  const month = getPart(parts, 'month');
  const year = getPart(parts, 'year');
  const hour = getPart(parts, 'hour');
  const minute = getPart(parts, 'minute');

  if (!day || !month || !year || !hour || !minute) return value;

  return `${day}-${month}-${year} / ${hour}:${minute}`;
}

export function formatChileTime(value: string | null | undefined, fallback = '—'): string {
  const formatted = formatDashboardTimestamp(value, fallback);

  if (formatted === fallback || formatted === value) return formatted;

  return formatted.split(' / ')[1] ?? formatted;
}

function parseUtcTimestamp(value: string): Date | null {
  const trimmed = value.trim();
  const hasExplicitTimeZone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(trimmed);
  const normalized = hasExplicitTimeZone ? trimmed : `${trimmed}Z`;
  const date = new Date(normalized);

  return Number.isNaN(date.getTime()) ? null : date;
}

function getPart(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): string {
  return parts.find((part) => part.type === type)?.value ?? '';
}
