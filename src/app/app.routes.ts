import { Routes } from '@angular/router';
import { HOME_ROUTES } from './routes/home/routes';

export const routes: Routes = [
  {
    path: HOME_ROUTES.HOME.slice(1),
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
];
