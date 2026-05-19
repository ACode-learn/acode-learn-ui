import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
  provideRouter,
} from '@angular/router';
import { vi } from 'vitest';
import { AuthService } from './auth.service';
import { roleGuard } from './role.guard';

describe('roleGuard', () => {
  const ensureInitialized = vi.fn<() => Promise<void>>();
  const isAuthenticated = vi.fn<() => boolean>();
  const hasAnyRole = vi.fn<(roles: readonly string[]) => boolean>();

  const authService = {
    ensureInitialized,
    isAuthenticated,
    hasAnyRole,
  } as unknown as AuthService;

  beforeEach(() => {
    ensureInitialized.mockReset();
    ensureInitialized.mockResolvedValue();
    isAuthenticated.mockReset();
    hasAnyRole.mockReset();

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
      ],
    });
  });

  it('redirects unauthenticated users to login and preserves target URL', async () => {
    isAuthenticated.mockReturnValue(false);
    const router = TestBed.inject(Router);

    const result = TestBed.runInInjectionContext(() =>
      roleGuard(['admin'])({} as ActivatedRouteSnapshot, {
        url: '/admin/users',
      } as RouterStateSnapshot),
    );

    const resolvedResult = await result;

    expect(resolvedResult instanceof UrlTree).toBe(true);
    expect(router.serializeUrl(resolvedResult as UrlTree)).toBe('/login?returnUrl=%2Fadmin%2Fusers');
    expect(hasAnyRole).not.toHaveBeenCalled();
  });

  it('allows authenticated users with a required role', async () => {
    isAuthenticated.mockReturnValue(true);
    hasAnyRole.mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      roleGuard(['admin'])({} as ActivatedRouteSnapshot, {
        url: '/admin',
      } as RouterStateSnapshot),
    );

    await expect(result).resolves.toBe(true);
    expect(hasAnyRole).toHaveBeenCalledWith(['admin']);
  });

  it('redirects authenticated users without required roles to forbidden page', async () => {
    isAuthenticated.mockReturnValue(true);
    hasAnyRole.mockReturnValue(false);
    const router = TestBed.inject(Router);

    const result = TestBed.runInInjectionContext(() =>
      roleGuard(['admin'])({} as ActivatedRouteSnapshot, {
        url: '/admin',
      } as RouterStateSnapshot),
    );

    const resolvedResult = await result;

    expect(resolvedResult instanceof UrlTree).toBe(true);
    expect(router.serializeUrl(resolvedResult as UrlTree)).toBe('/not-authorized');
  });

  it('waits for auth initialization before checking roles', async () => {
    let finishInitialization!: () => void;
    ensureInitialized.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          finishInitialization = resolve;
        }),
    );
    isAuthenticated.mockReturnValue(true);
    hasAnyRole.mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      roleGuard(['admin'])({} as ActivatedRouteSnapshot, {
        url: '/admin',
      } as RouterStateSnapshot),
    );

    expect(isAuthenticated).not.toHaveBeenCalled();
    expect(hasAnyRole).not.toHaveBeenCalled();

    finishInitialization();

    await expect(result).resolves.toBe(true);
    expect(isAuthenticated).toHaveBeenCalledTimes(1);
    expect(hasAnyRole).toHaveBeenCalledWith(['admin']);
  });
});
