import { Pipe, PipeTransform } from '@angular/core';

import { formatDashboardTimestamp } from '../utils/timestamp-format.utils';

@Pipe({
  name: 'cryptoTimestamp',
  standalone: true,
})
export class CryptoTimestampPipe implements PipeTransform {
  transform(value: string | null | undefined, fallback = '—'): string {
    return formatDashboardTimestamp(value, fallback);
  }
}
