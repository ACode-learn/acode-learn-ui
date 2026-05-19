import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'not-authorized',
    loadComponent: () =>
      import('./features/auth/not-authorized/not-authorized').then(
        (m) => m.NotAuthorized,
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/app-shell/app-shell').then((m) => m.AppShell),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/home/home-page/home-page').then((m) => m.HomePage),
      },
      {
        path: 'admin',
        canActivate: [roleGuard(['admin'])],
        loadChildren: () =>
          import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
      },
      {
        path: 'student',
        canActivate: [authGuard, roleGuard(['student'])],
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './features/student/student-home-page/student-home-page'
              ).then((m) => m.StudentHomePage),
          },
          {
            path: 'profile',
            loadComponent: () =>
              import(
                './features/student/student-profile-page/student-profile-page'
              ).then((m) => m.StudentProfilePage),
          },
        ],
      },
      {
        path: 'courses',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./features/courses/courses.routes').then((m) => m.COURSES_ROUTES),
      },
      {
        path: 'instructor',
        canActivate: [authGuard, roleGuard(['instructor', 'admin'])],
        loadChildren: () =>
          import('./features/instructor/instructor.routes').then(
            (m) => m.INSTRUCTOR_ROUTES,
          ),
      },
      {
        path: 'resources',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./features/resources/resources.routes').then(
            (m) => m.RESOURCES_ROUTES,
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
