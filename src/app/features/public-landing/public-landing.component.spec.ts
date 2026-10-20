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

  it('announces and toggles the mobile menu', () => {
    const toggle = fixture.nativeElement.querySelector(
      '.landing__menu-toggle',
    ) as HTMLButtonElement;
    const menu = fixture.nativeElement.querySelector('.landing__mobile-nav') as HTMLElement;

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
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
