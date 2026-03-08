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
})
export class LineChartComponent implements OnChanges {
  @Input() title = 'Chart';
  @Input() height = 260;
  @Input() width = 900;

  @Input() seriesAName = 'Serie A';
  @Input() seriesBName = 'Serie B';

  @Input() seriesA: LineChartPoint[] = [];
  @Input() seriesB: LineChartPoint[] = [];

  private padding = 24;

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
      .map((p) => p.value)
      .filter((v) => Number.isFinite(v));

    if (!values.length) {
      this.minValue = 0;
      this.maxValue = 1;
      return;
    }

    const min = Math.min(...values);
    const max = Math.max(...values);

    this.minValue = min;
    this.maxValue = max === min ? max + 1 : max;
  }

  pointX(index: number, length: number): number {
    if (length <= 1) return this.padding;
    const innerWidth = this.width - this.padding * 2;
    return this.padding + (index / (length - 1)) * innerWidth;
  }

  pointY(value: number): number {
    const innerHeight = this.height - this.padding * 2;
    const ratio = (value - this.minValue) / (this.maxValue - this.minValue || 1);
    return this.height - this.padding - ratio * innerHeight;
  }

  toPolyline(points: LineChartPoint[]): string {
    return points
      .map((p, i) => `${this.pointX(i, points.length)},${this.pointY(p.value)}`)
      .join(' ');
  }

  yTicks(): number[] {
    const steps = 4;
    return Array.from(
      { length: steps + 1 },
      (_, i) => this.minValue + ((this.maxValue - this.minValue) * i) / steps
    );
  }
}