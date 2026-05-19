import { TestBed } from '@angular/core/testing';
import {
  OidcSecurityService,
  type LoginResponse,
} from 'angular-auth-oidc-client';
import { Observable, of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { AuthService } from './auth.service';

const checkAuthMock = vi.fn<() => Observable<LoginResponse>>();
const authorizeMock = vi.fn();
const logoffMock = vi.fn();
const getAccessTokenMock = vi.fn<() => Observable<string>>();
const getPayloadFromAccessTokenMock = vi.fn<() => Observable<unknown>>();

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    checkAuthMock.mockReset();
    checkAuthMock.mockReturnValue(
      of({
        isAuthenticated: false,
        userData: null,
        accessToken: '',
        idToken: '',
      }),
    );
    authorizeMock.mockReset();
    logoffMock.mockReset();
    logoffMock.mockReturnValue(of(undefined));
    getAccessTokenMock.mockReset();
    getAccessTokenMock.mockReturnValue(of('token'));
    getPayloadFromAccessTokenMock.mockReset();
    getPayloadFromAccessTokenMock.mockReturnValue(of(null));

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {
          provide: OidcSecurityService,
          useValue: {
            checkAuth: checkAuthMock,
            authorize: authorizeMock,
            logoff: logoffMock,
            getAccessToken: getAccessTokenMock,
            getPayloadFromAccessToken: getPayloadFromAccessTokenMock,
          },
        },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('maps authenticated user data from OIDC access token payload', async () => {
    checkAuthMock.mockReturnValue(
      of({
        isAuthenticated: true,
        userData: {},
        accessToken: 'token',
        idToken: 'id-token',
      }),
    );
    getPayloadFromAccessTokenMock.mockReturnValue(
      of({
        sub: 'user-1',
        preferred_username: 'alex',
        name: 'Alex',
        email: 'alex@example.com',
        realm_access: {
          roles: ['student'],
        },
        resource_access: {
          'acode-learn-ui': {
            roles: ['admin'],
          },
        },
      }),
    );

    await service.initialize();

    expect(service.isAuthenticated()).toBe(true);
    expect(service.currentUser()).toEqual({
      id: 'user-1',
      username: 'alex',
      displayName: 'Alex',
      email: 'alex@example.com',
      roles: ['student', 'admin'],
    });
  });

  it('keeps authenticated state when OIDC login is successful but claims cannot be mapped', async () => {
    checkAuthMock.mockReturnValue(
      of({
        isAuthenticated: true,
        userData: null,
        accessToken: 'token',
        idToken: 'id-token',
      }),
    );
    getPayloadFromAccessTokenMock.mockReturnValue(
      of({
        preferred_username: 'alex',
      }),
    );

    await service.initialize();

    expect(service.isAuthenticated()).toBe(true);
    expect(service.currentUser()).toBeNull();
  });

  it('keeps unauthenticated state when OIDC reports no active session', async () => {
    checkAuthMock.mockReturnValue(
      of({
        isAuthenticated: false,
        userData: null,
        accessToken: '',
        idToken: '',
      }),
    );

    await service.initialize();

    expect(getPayloadFromAccessTokenMock).not.toHaveBeenCalled();
    expect(service.currentUser()).toBeNull();
  });

  it('falls back to unauthenticated state when OIDC initialization fails', async () => {
    const initializationError = new Error('oidc init failed');
    checkAuthMock.mockReturnValue(throwError(() => initializationError));
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await service.initialize();

    expect(service.currentUser()).toBeNull();
    expect(errorSpy).toHaveBeenCalledWith(
      'OIDC initialization failed',
      initializationError,
    );
  });

  it('runs OIDC initialization once even when called multiple times', async () => {
    await Promise.all([service.ensureInitialized(), service.ensureInitialized()]);

    expect(checkAuthMock).toHaveBeenCalledTimes(1);
  });

  it('redirects to identity provider on login', async () => {
    await service.login('/admin');

    expect(authorizeMock).toHaveBeenCalledWith(undefined, {
      redirectUrl: '/admin',
    });
  });

  it('logs out using OIDC client and clears user state', async () => {
    service.currentUser.set({
      id: 'user-1',
      username: 'alex',
      displayName: 'Alex',
      email: 'alex@example.com',
      roles: ['student'],
    });

    await service.logout('/signed-out');

    expect(logoffMock).toHaveBeenCalledWith(undefined, {
      customParams: {
        post_logout_redirect_uri: '/signed-out',
      },
    });
    expect(service.currentUser()).toBeNull();
  });

  it('returns access token from OIDC service and null on errors', async () => {
    getAccessTokenMock.mockReturnValueOnce(of('jwt-token'));

    await expect(service.getAccessToken()).resolves.toBe('jwt-token');

    getAccessTokenMock.mockReturnValueOnce(throwError(() => new Error('no token')));

    await expect(service.getAccessToken()).resolves.toBeNull();
  });
});
