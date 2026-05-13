import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppRole } from './auth.models';
import { AuthService } from './auth.service';

export function roleGuard(requiredRoles: readonly AppRole[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      return router.createUrlTree(['/login']);
    }

    if (authService.hasAnyRole(requiredRoles)) {
      return true;
    }

    return router.createUrlTree(['/not-authorized']);
  };
}
