// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Crypto Analytics',
    loadComponent: () =>
      import('./features/public-landing/public-landing.component').then(
        m => m.PublicLandingComponent,
      ),
  },
  { path: '', loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES) },
  { path: '', loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES) },
  { path: '', loadChildren: () => import('./features/health/health.routes').then(m => m.HEALTH_ROUTES) },
  { path: '**', redirectTo: '' },
];
