import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AssetsService } from '../../../core/services/assets.service';
import { LatestService } from '../../../core/services/latest.service';
import { MarketSelectionService } from '../../../core/services/market-selection.service';
import { HomeComponent } from './home.component';

describe('HomeComponent presentation', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;

  beforeEach(async () => {
    const assets = jasmine.createSpyObj<AssetsService>('AssetsService', ['list']);
    assets.list.and.returnValue(
      of([
        {
          asset: 'BTCUSDT',
          ready: true,
          timeframes: ['1m', '5m', '15m'],
          horizons: ['5m', '10m', '15m'],
        },
      ]),
    );

    const latest = jasmine.createSpyObj<LatestService>('LatestService', [
      'getPrice',
      'getFeature',
      'getPrediction',
      'getSignal',
    ]);
    latest.getPrice.and.returnValue(
      of({
        meta: { asset: 'BTCUSDT', timeframe: '1m', asof_ts_utc: '2026-10-22T12:00:00Z' },
        data: {
          asset: 'BTCUSDT',
          timeframe: '1m',
          ts_utc: '2026-10-22T12:00:00Z',
          open: 34900,
          high: 35100,
          low: 34800,
          close: 35000,
          volume: 120,
          quote_currency: 'USD',
        },
      }),
    );
    latest.getFeature.and.returnValue(
      of({
        meta: { asset: 'BTCUSDT', timeframe: '1m', asof_ts_utc: '2026-10-22T12:00:00Z' },
        data: {
          asset: 'BTCUSDT',
          timeframe: '1m',
          ts_utc: '2026-10-22T12:00:00Z',
          rsi: 55.25,
          ema_12: 34950,
          ema_26: 34850,
          macd: 100,
          macd_signal: 90,
          volatility: 0.0042,
          features_version: 'fixture-v1',
        },
      }),
    );
    latest.getPrediction.and.returnValue(
      of({
        meta: {
          asset: 'BTCUSDT',
          timeframe: '1m',
          horizon: '5m',
          asof_ts_utc: '2026-10-22T12:00:00Z',
        },
        data: {
          asset: 'BTCUSDT',
          timeframe: '1m',
          ts_utc: '2026-10-22T12:00:00Z',
          horizon: '5m',
          y_hat: 35350,
          confidence: 0.82,
          model_version: 'fixture-v1',
          explanation: 'Explicación controlada del modelo.',
          quote_currency: 'USD',
        },
      }),
    );
    latest.getSignal.and.returnValue(
      of({
        signal: 'BUY',
        strength: 0.01,
        confidence: 0.82,
        reason: 'BUY con confianza alta',
      }),
    );

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        MarketSelectionService,
        { provide: AssetsService, useValue: assets },
        { provide: LatestService, useValue: latest },
      ],
    }).compileComponents();

    TestBed.inject(MarketSelectionService).update({
      asset: 'BTCUSDT',
      timeframe: '1m',
      horizon: '5m',
    });
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fixture.detectChanges();
  });

  it('associates every market selector with a visible label', () => {
    const host = fixture.nativeElement as HTMLElement;
    const ids = [
      'dashboard-display-quote',
      'dashboard-asset',
      'dashboard-timeframe',
      'dashboard-horizon',
    ];

    expect(ids.every((id) => host.querySelector(`label[for="${id}"]`))).toBeTrue();
    expect(ids.every((id) => host.querySelector(`#${id}`)?.tagName === 'SELECT')).toBeTrue();
    expect(host.querySelector('.refresh-button')?.getAttribute('aria-busy')).toBe('false');
    (host.querySelector('#dashboard-asset') as HTMLSelectElement).focus();
    expect(document.activeElement).toBe(host.querySelector('#dashboard-asset'));
  });

  it('renders all four metric cards without changing financial values or signal semantics', () => {
    const host = fixture.nativeElement as HTMLElement;
    const headings = Array.from(host.querySelectorAll('.metric-label')).map((item) =>
      item.textContent?.trim(),
    );

    expect(headings).toEqual([
      'Precio actual',
      'Indicadores técnicos',
      'Predicción ML',
      'Señal derivada',
    ]);
    expect(host.querySelector('.dashboard-card--price')?.textContent).toContain('35.000,00 USD');
    expect(host.querySelector('.dashboard-card--prediction')?.textContent).toContain(
      '35.350,00 USD',
    );
    expect(host.querySelector('.signal-pill')?.textContent).toContain('BUY');
    expect(host.querySelector('.signal-pill')?.classList).toContain('signal-buy');
    expect(host.querySelector('.expected-return')?.classList).toContain(
      'expected-return-positive',
    );
  });

  it('presents loading and error states without changing their source values', () => {
    component.latestLoading.set(true);
    component.latestError.set('Error controlado de fixture.');
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const banners = host.querySelector('.state-stack')?.textContent;
    expect(banners).toContain('Cargando datos...');
    expect(banners).toContain('Error controlado de fixture.');
    expect(host.querySelector('.state-banner--error')?.getAttribute('role')).toBe('alert');
  });

  it('keeps the technical explanation disclosure accessible', () => {
    const button = fixture.nativeElement.querySelector(
      '.technical-accordion-toggle',
    ) as HTMLButtonElement;

    expect(button.getAttribute('aria-expanded')).toBe('false');
    button.click();
    fixture.detectChanges();

    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(fixture.nativeElement.querySelector('.technical-accordion-body').textContent).toContain(
      'Explicación controlada del modelo.',
    );
  });
});
