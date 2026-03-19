import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface LineChartPoint {
  xLabel: string;
  value: number;
}

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
})
export class LineChartComponent implements OnChanges {
  @Input() title = 'Chart';
  @Input() height = 260;
  @Input() width = 900;

  @Input() seriesAName = 'Serie A';
  @Input() seriesBName = 'Serie B';

  @Input() seriesA: LineChartPoint[] = [];
  @Input() seriesB: LineChartPoint[] = [];

  private readonly paddingLeft = 64;
  private readonly paddingRight = 24;
  private readonly paddingTop = 20;
  private readonly paddingBottom = 34;

  hasData = false;
  minValue = 0;
  maxValue = 1;

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['seriesA'] ||
      changes['seriesB'] ||
      changes['height'] ||
      changes['width']
    ) {
      this.recalculateState();
    }
  }

  private recalculateState(): void {
    this.hasData = this.seriesA.length > 1 || this.seriesB.length > 1;

    const values = [...this.seriesA, ...this.seriesB]
      .map((point) => point.value)
      .filter((value) => Number.isFinite(value));

    if (!values.length) {
      this.minValue = 0;
      this.maxValue = 1;
      return;
    }

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;

    if (range === 0) {
      this.minValue = min - 1;
      this.maxValue = max + 1;
      return;
    }

    const padding = range * 0.08;
    this.minValue = min - padding;
    this.maxValue = max + padding;
  }

  chartLeft(): number {
    return this.paddingLeft;
  }

  chartRight(): number {
    return this.width - this.paddingRight;
  }

  chartTop(): number {
    return this.paddingTop;
  }

  chartBottom(): number {
    return this.height - this.paddingBottom;
  }

  pointX(index: number, length: number): number {
    if (length <= 1) {
      return this.chartLeft();
    }

    const innerWidth = this.chartRight() - this.chartLeft();
    return this.chartLeft() + (index / (length - 1)) * innerWidth;
  }

  pointY(value: number): number {
    const innerHeight = this.chartBottom() - this.chartTop();
    const ratio = (value - this.minValue) / (this.maxValue - this.minValue || 1);
    return this.chartBottom() - ratio * innerHeight;
  }

  toPolyline(points: LineChartPoint[]): string {
    return points
      .map((point, index) => `${this.pointX(index, points.length)},${this.pointY(point.value)}`)
      .join(' ');
  }

  yTicks(): number[] {
    const steps = 4;
    return Array.from(
      { length: steps + 1 },
      (_, index) => this.minValue + ((this.maxValue - this.minValue) * index) / steps
    );
  }

  xTicks(): { index: number; label: string }[] {
    const baseSeries = this.seriesA.length ? this.seriesA : this.seriesB;
    const points = baseSeries.length;

    if (!points) {
      return [];
    }

    const maxTicks = 6;
    const step = Math.max(1, Math.ceil(points / maxTicks));

    return baseSeries
      .map((point, index) => ({
        index,
        label: this.formatLabel(point.xLabel),
      }))
      .filter((_, index) => index % step === 0 || index === points - 1);
  }

  formatTick(value: number): string {
    const abs = Math.abs(value);

    if (abs >= 1000) {
      return value.toLocaleString('es-CL', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }

    if (abs >= 1) {
      return value.toLocaleString('es-CL', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

    return value.toLocaleString('es-CL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  }

  private formatLabel(ts: string): string {
    const date = new Date(ts);

    if (Number.isNaN(date.getTime())) {
      return ts;
    }

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
  }
}