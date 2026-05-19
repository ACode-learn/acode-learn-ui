import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./admin-shell/admin-shell').then((m) => m.AdminShell),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./dashboard/admin-dashboard-page/admin-dashboard-page').then(
            (m) => m.AdminDashboardPage,
          ),
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];
