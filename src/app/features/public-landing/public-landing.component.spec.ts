import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PublicLandingComponent } from './public-landing.component';

@Component({ standalone: true, template: '<p>Login</p>' })
class LoginStubComponent {}

describe('PublicLandingComponent', () => {
  let fixture: ComponentFixture<PublicLandingComponent>;
  let component: PublicLandingComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicLandingComponent],
      providers: [provideRouter([{ path: 'login', component: LoginStubComponent }])],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('exposes every public section in desktop and mobile navigation', () => {
    const host = fixture.nativeElement as HTMLElement;
    const desktopLinks = host.querySelectorAll<HTMLAnchorElement>('.landing__nav a');
    const mobileLinks = host.querySelectorAll<HTMLAnchorElement>('.landing__mobile-nav a');

    expect(Array.from(desktopLinks, link => link.hash)).toEqual([
      '#analiza',
      '#compara',
      '#sigue',
      '#flujo',
    ]);
    expect(Array.from(mobileLinks, link => link.hash)).toEqual([
      '#analiza',
      '#compara',
      '#sigue',
      '#flujo',
    ]);
  });

  it('labels every product preview as illustrative rather than live analysis', () => {
    const host = fixture.nativeElement as HTMLElement;
    const pulse = host.querySelector('.pulse-panel') as HTMLElement;
    const compare = host.querySelector('.compare-preview') as HTMLElement;
    const history = host.querySelector('.history-preview') as HTMLElement;

    expect(pulse.textContent).toContain('sin cotizaciones ni señales');
    expect(compare.textContent).toContain('no corresponden a un análisis ejecutado');
    expect(history.textContent).toContain(
      'no representa precio, rendimiento, tendencia o predicción',
    );
    expect(pulse.textContent).not.toContain('BTC / USD');
    expect(pulse.textContent).not.toContain('Marco: 4h');
    expect(pulse.textContent).not.toContain('$—');
  });

  it('uses semantic examples for comparison and an ordered conceptual history', () => {
    const host = fixture.nativeElement as HTMLElement;
    const assets = Array.from(
      host.querySelectorAll<HTMLTableCellElement>('.compare-preview tbody th strong'),
      cell => cell.textContent,
    );
    const historyMoments = host.querySelectorAll('.history-preview__timeline li');

    expect(assets).toEqual(['BTC', 'ETH', 'SOL']);
    expect(historyMoments.length).toBe(4);
    expect(host.querySelector('.compare-preview table')).not.toBeNull();
  });

  it('separates technical interaction from value hierarchy', () => {
    const host = fixture.nativeElement as HTMLElement;
    const waypoints = host.querySelectorAll('.landing__waypoint > .crypto-value');
    const humanOutcome = host.querySelector('.landing__principle--human');

    expect(waypoints.length).toBe(3);
    expect(humanOutcome?.textContent).toContain('Decisión humana');
    expect(host.querySelector('.landing__login--primary.crypto-value')).toBeNull();
  });

  it('announces and toggles the mobile menu', () => {
    const toggle = fixture.nativeElement.querySelector(
      '.landing__menu-toggle',
    ) as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('.landing__mobile-nav') as HTMLElement;

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(toggle.getAttribute('aria-label')).toContain('Menú');
    expect(menu.hidden).toBeTrue();

    toggle.click();
    fixture.detectChanges();

    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(toggle.getAttribute('aria-controls')).toBe(menu.id);
    expect(menu.hidden).toBeFalse();
  });

  it('closes with Escape and returns focus to the menu button', () => {
    const toggle = fixture.nativeElement.querySelector(
      '.landing__menu-toggle',
    ) as HTMLButtonElement;

    toggle.click();
    fixture.detectChanges();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    expect(component.mobileMenuOpen()).toBeFalse();
    expect(document.activeElement).toBe(toggle);
  });

  it('closes from an outside click', () => {
    component.toggleMobileMenu();
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(component.mobileMenuOpen()).toBeFalse();
  });

  it('closes after navigation and moves focus to the destination', fakeAsync(() => {
    const destination = fixture.nativeElement.querySelector('#compara') as HTMLElement;
    const focusSpy = spyOn(destination, 'focus');
    component.toggleMobileMenu();

    component.navigateToSection('compara');
    tick();

    expect(component.mobileMenuOpen()).toBeFalse();
    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
  }));
});
