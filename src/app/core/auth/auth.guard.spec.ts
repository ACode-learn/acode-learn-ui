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
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  const ensureInitialized = vi.fn<() => Promise<void>>();
  const isAuthenticated = vi.fn<() => boolean>();
  const hasRole = vi.fn<(role: string) => boolean>();

  const authService = {
    ensureInitialized,
    isAuthenticated,
    hasRole,
  } as unknown as AuthService;

  beforeEach(() => {
    ensureInitialized.mockReset();
    ensureInitialized.mockResolvedValue();
    isAuthenticated.mockReset();
    hasRole.mockReset();
    hasRole.mockReturnValue(false);

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
      ],
    });
  });

  it('allows navigation for authenticated users', async () => {
    isAuthenticated.mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {
        url: '/admin',
      } as RouterStateSnapshot),
    );

    await expect(result).resolves.toBe(true);
    expect(ensureInitialized).toHaveBeenCalledTimes(1);
  });

  it('redirects to login and preserves the target URL when unauthenticated', async () => {
    isAuthenticated.mockReturnValue(false);
    const router = TestBed.inject(Router);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {
        url: '/admin?tab=users',
      } as RouterStateSnapshot),
    );

    const resolvedResult = await result;

    expect(resolvedResult instanceof UrlTree).toBe(true);
    expect(router.serializeUrl(resolvedResult as UrlTree)).toBe(
      '/login?returnUrl=%2Fadmin%3Ftab%3Dusers',
    );
  });

  it('redirects authenticated admins to /admin when navigating to a non-admin path', async () => {
    isAuthenticated.mockReturnValue(true);
    hasRole.mockReturnValue(true);
    const router = TestBed.inject(Router);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {
        url: '/courses',
      } as RouterStateSnapshot),
    );

    const resolvedResult = await result;

    expect(resolvedResult instanceof UrlTree).toBe(true);
    expect(router.serializeUrl(resolvedResult as UrlTree)).toBe('/admin');
  });

  it('allows authenticated admins to stay on admin routes', async () => {
    isAuthenticated.mockReturnValue(true);
    hasRole.mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {
        url: '/admin/users',
      } as RouterStateSnapshot),
    );

    await expect(result).resolves.toBe(true);
  });

  it('redirects to login without returnUrl when target URL is root', async () => {
    isAuthenticated.mockReturnValue(false);
    const router = TestBed.inject(Router);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {
        url: '/',
      } as RouterStateSnapshot),
    );

    const resolvedResult = await result;

    expect(resolvedResult instanceof UrlTree).toBe(true);
    expect(router.serializeUrl(resolvedResult as UrlTree)).toBe('/login');
  });

  it('waits for auth initialization before evaluating authentication status', async () => {
    let finishInitialization!: () => void;
    ensureInitialized.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          finishInitialization = resolve;
        }),
    );
    isAuthenticated.mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {
        url: '/',
      } as RouterStateSnapshot),
    );

    expect(isAuthenticated).not.toHaveBeenCalled();

    finishInitialization();
    await expect(result).resolves.toBe(true);
    expect(isAuthenticated).toHaveBeenCalledTimes(1);
  });
});
