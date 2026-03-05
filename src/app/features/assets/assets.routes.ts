import { Routes } from '@angular/router';
import { PATHS } from '../../utils/paths';
import { lazy } from '../../shared/lazy';

export const ASSETS_ROUTES: Routes = [
  {
    path: PATHS.assets,
    title: 'Assets',
    loadComponent: () => lazy(import('./assets.component'), 'AssetsComponent'),
  },
];