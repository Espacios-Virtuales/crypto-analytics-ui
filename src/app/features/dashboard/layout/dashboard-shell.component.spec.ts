import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthFacade } from '../../../core/auth/auth.facade';
import { AuthService } from '../../../core/auth/auth.service';
import { UserSession } from '../../../core/models/auth.model';
import { DashboardShellComponent } from './dashboard-shell.component';

@Component({ standalone: true, template: '<p>Contenido</p>' })
class ContentStubComponent {}

describe('DashboardShellComponent', () => {
  let fixture: ComponentFixture<DashboardShellComponent>;
  let component: DashboardShellComponent;
  let facade: jasmine.SpyObj<AuthFacade>;

  const session: UserSession = {
    email: 'analyst@example.com',
    roles: ['ROLE_ANALYST'],
    privileges: ['READ'],
    accessToken: 'fixture-token',
    accessTokenExp: new Date('2030-01-01T00:00:00Z'),
    refreshToken: 'fixture-refresh',
    refreshExp: new Date('2030-01-02T00:00:00Z'),
    loginAt: new Date('2026-10-22T12:00:00Z'),
  };

  beforeEach(async () => {
    facade = jasmine.createSpyObj<AuthFacade>('AuthFacade', ['logout']);
    const auth = jasmine.createSpyObj<AuthService>('AuthService', ['getSession']);
    auth.getSession.and.returnValue(session);

    await TestBed.configureTestingModule({
      imports: [DashboardShellComponent],
      providers: [
        provideRouter([
          {
            path: 'dashboard',
            component: DashboardShellComponent,
            children: [
              { path: '', component: ContentStubComponent },
              { path: 'trading', component: ContentStubComponent },
              { path: 'history', component: ContentStubComponent },
              { path: 'compare', component: ContentStubComponent },
              { path: 'assets', component: ContentStubComponent },
            ],
          },
        ]),
        { provide: AuthService, useValue: auth },
        { provide: AuthFacade, useValue: facade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders the official CA identity and keeps every navigation destination', () => {
    const host = fixture.nativeElement as HTMLElement;
    const logo = host.querySelector<HTMLImageElement>('.brand-mark img');
    const links = Array.from(host.querySelectorAll<HTMLAnchorElement>('.menu-item')).map(
      (link) => link.getAttribute('href'),
    );

    expect(logo?.src).toContain('/brand/CRYPTO_ANALYTICS_CA_MONOGRAM_ANALYTIC_NETWORK_v1.0.svg');
    expect(host.querySelector('.brand-link')?.getAttribute('href')).toBe('/dashboard');
    expect(links).toEqual([
      '/dashboard',
      '/dashboard/trading',
      '/dashboard/history',
      '/dashboard/compare',
      '/dashboard/assets',
    ]);
  });

  it('exposes the session identity and role without changing their values', () => {
    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('.account-copy strong')?.textContent).toContain(session.email);
    expect(host.querySelector('.role-badge')?.textContent).toContain(session.roles[0]);
    expect(host.querySelector('.account-details')?.textContent).toContain(session.email);
    expect(host.querySelector('.account-details')?.textContent).toContain(session.roles[0]);
  });

  it('removes a closed mobile sidebar from keyboard and assistive-technology navigation', () => {
    component.isMobile.set(true);
    component.isSidebarOpen.set(false);
    fixture.detectChanges();

    const sidebar = fixture.nativeElement.querySelector('.ev-sidebar') as HTMLElement;
    const toggle = fixture.nativeElement.querySelector('.hamburger') as HTMLButtonElement;

    expect(sidebar.getAttribute('aria-hidden')).toBe('true');
    expect(sidebar.hasAttribute('inert')).toBeTrue();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');

    toggle.click();
    fixture.detectChanges();

    expect(sidebar.hasAttribute('inert')).toBeFalse();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
  });

  it('moves focus into the mobile navigation when it opens', async () => {
    component.isMobile.set(true);
    component.isSidebarOpen.set(false);
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('.hamburger') as HTMLButtonElement).click();
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve));

    expect(document.activeElement).toBe(fixture.nativeElement.querySelector('.brand-link'));
  });

  it('closes the mobile sidebar with Escape and returns focus to its control', () => {
    component.isMobile.set(true);
    component.isSidebarOpen.set(true);
    fixture.detectChanges();

    component.onEscape();
    fixture.detectChanges();

    expect(component.isSidebarOpen()).toBeFalse();
    expect(document.activeElement).toBe(
      fixture.nativeElement.querySelector('.hamburger') as HTMLButtonElement,
    );
  });

  it('opens the labelled account dialog and preserves the logout delegation', () => {
    const host = fixture.nativeElement as HTMLElement;
    const accountButton = host.querySelector('.account-button') as HTMLButtonElement;
    const dialog = host.querySelector('#userDlg') as HTMLDialogElement;

    accountButton.click();
    fixture.detectChanges();

    expect(dialog.open).toBeTrue();
    expect(dialog.getAttribute('aria-labelledby')).toBe('account-dialog-title');

    (host.querySelector('.dialog-button--danger') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(facade.logout).toHaveBeenCalledTimes(1);
    expect(dialog.open).toBeFalse();
    expect(document.activeElement).toBe(accountButton);
  });

  it('marks the current route through the existing router-link-active behavior', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/dashboard/history');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const active = fixture.nativeElement.querySelector('.menu-item.active') as HTMLAnchorElement;
    expect(active.getAttribute('href')).toBe('/dashboard/history');
  });
});
