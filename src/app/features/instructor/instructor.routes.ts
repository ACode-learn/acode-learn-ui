import { Routes } from '@angular/router';

export const INSTRUCTOR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./instructor-dashboard-page/instructor-dashboard-page').then(
        (m) => m.InstructorDashboardPage,
      ),
  },
  {
    path: 'courses',
    loadComponent: () =>
      import('./instructor-courses-page/instructor-courses-page').then(
        (m) => m.InstructorCoursesPage,
      ),
  },
  {
    path: 'courses/:id',
    loadComponent: () =>
      import(
        './instructor-course-detail-page/instructor-course-detail-page'
      ).then((m) => m.InstructorCourseDetailPage),
  },
];
