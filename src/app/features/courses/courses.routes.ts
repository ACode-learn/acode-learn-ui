import { Routes } from '@angular/router';

export const COURSES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./course-list-page/course-list-page').then((m) => m.CourseListPage),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./course-detail-page/course-detail-page').then(
        (m) => m.CourseDetailPage,
      ),
  },
];
