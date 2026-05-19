import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.ensureInitialized().then(() => {
    if (authService.isAuthenticated()) {
      if (authService.hasRole('admin') && !state.url.startsWith('/admin')) {
        return router.createUrlTree(['/admin']);
      }

      return true;
    }

    return state.url === '/'
      ? router.createUrlTree(['/login'])
      : router.createUrlTree(['/login'], {
          queryParams: { returnUrl: state.url },
        });
  });
};
