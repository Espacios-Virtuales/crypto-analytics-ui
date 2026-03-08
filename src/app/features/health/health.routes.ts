import { Routes } from '@angular/router';
import { PATHS } from '../../utils/paths';
import { lazy } from '../../shared/lazy';

export const HEALTH_ROUTES: Routes = [
  {
    path: PATHS.health,
    title: 'Health',
    loadComponent: () => lazy(import('./health.component'), 'HealthComponent'),
  },
];
