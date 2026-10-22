import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { Subject, of, throwError } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { UserSession } from '../../../core/models/auth.model';
import { LoginComponent } from './login.component';

@Component({ standalone: true, template: '<p>Dashboard</p>' })
class DashboardStubComponent {}

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let auth: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    auth = jasmine.createSpyObj<AuthService>('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([{ path: 'dashboard', component: DashboardStubComponent }]),
        {
          provide: ActivatedRoute,
          useValue: { queryParamMap: of(convertToParamMap({})) },
        },
        { provide: AuthService, useValue: auth },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('renders the official identity and accessible form labels', () => {
    const host = fixture.nativeElement as HTMLElement;
    const logo = host.querySelector<HTMLImageElement>('.login-brand__mark img');
    const email = host.querySelector<HTMLInputElement>('#login-email');
    const password = host.querySelector<HTMLInputElement>('#login-password');

    expect(logo?.src).toContain('/brand/CRYPTO_ANALYTICS_CA_MONOGRAM_ANALYTIC_NETWORK_v1.0.svg');
    expect(host.textContent).toContain('Crypto Analytics');
    expect(host.textContent).toContain('Lee el mercado');
    expect(host.textContent).toContain('con contexto.');
    expect(email?.labels?.[0].textContent).toContain('Correo electrónico');
    expect(password?.labels?.[0].textContent).toContain('Contraseña');
    expect(email?.autocomplete).toBe('username');
    expect(password?.autocomplete).toBe('current-password');
  });

  it('marks an invalid form and does not call authentication', () => {
    component.onSubmit();
    fixture.detectChanges();

    expect(auth.login).not.toHaveBeenCalled();
    expect(component.f.email.touched).toBeTrue();
    expect(component.f.password.touched).toBeTrue();
    expect(fixture.nativeElement.querySelector('#email-error').textContent).toContain(
      'Email requerido.',
    );
    expect(fixture.nativeElement.querySelector('#password-error').textContent).toContain(
      'Contraseña requerida.',
    );
  });

  it('submits the unchanged credentials payload and navigates to the dashboard', () => {
    const navigate = spyOn(router, 'navigate');
    auth.login.and.returnValue(of({} as UserSession));
    component.form.setValue({ email: 'analyst@example.com', password: 'secret1' });

    component.onSubmit();

    expect(auth.login).toHaveBeenCalledOnceWith({
      email: 'analyst@example.com',
      password: 'secret1',
    });
    expect(navigate).toHaveBeenCalledOnceWith(['/dashboard']);
  });

  it('communicates the disabled loading state while authentication is pending', () => {
    const response = new Subject<UserSession>();
    auth.login.and.returnValue(response);
    component.form.setValue({ email: 'analyst@example.com', password: 'secret1' });

    component.onSubmit();
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.login-submit') as HTMLButtonElement;
    expect(button.disabled).toBeTrue();
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.textContent).toContain('Ingresando…');
    expect(button.querySelector('.login-submit__spinner')).not.toBeNull();
  });

  it('keeps the server message and restores the submit state after an error', () => {
    auth.login.and.returnValue(
      throwError(() => ({ error: { message: 'Cuenta pendiente de activación.' } })),
    );
    component.form.setValue({ email: 'analyst@example.com', password: 'secret1' });

    component.onSubmit();
    fixture.detectChanges();

    const alert = fixture.nativeElement.querySelector('[role="alert"]') as HTMLElement;
    expect(alert.textContent).toContain('Cuenta pendiente de activación.');
    expect(component.submitting()).toBeFalse();
  });

  it('announces the existing account-created message as a status', () => {
    component.justRegistered.set(true);
    fixture.detectChanges();

    const status = fixture.nativeElement.querySelector('[role="status"]') as HTMLElement;
    expect(status.textContent).toContain('¡Tu cuenta fue creada!');
  });
});
