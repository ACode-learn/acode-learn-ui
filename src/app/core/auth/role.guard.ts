import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppRole } from './auth.models';
import { AuthService } from './auth.service';

export function roleGuard(requiredRoles: readonly AppRole[]): CanActivateFn {
  return (_route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.ensureInitialized().then(() => {
      if (!authService.isAuthenticated()) {
        return router.createUrlTree(['/login'], {
          queryParams: { returnUrl: state.url },
        });
      }

      if (authService.hasAnyRole(requiredRoles)) {
        return true;
      }

      return router.createUrlTree(['/not-authorized']);
    });
  };
}
