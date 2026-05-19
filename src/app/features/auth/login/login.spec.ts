import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { vi } from 'vitest';
import { AuthService } from '../../../core/auth/auth.service';
import { Login } from './login';

describe('Login', () => {
  const loginSpy = vi.fn<(redirectUri?: string) => Promise<void>>().mockResolvedValue();

  const authService = {
    login: loginSpy,
  } as unknown as AuthService;

  beforeEach(() => {
    loginSpy.mockReset();
    loginSpy.mockResolvedValue();
  });

  async function setup(returnUrl?: string): Promise<Login> {
    const queryParams = returnUrl ? { returnUrl } : {};

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap(queryParams),
            },
          },
        },
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();

    return TestBed.createComponent(Login).componentInstance;
  }

  it('uses the returnUrl query parameter as redirect URI when valid', async () => {
    const component = await setup('/admin?tab=users');

    await component.login();

    expect(loginSpy).toHaveBeenCalledWith(`${window.location.origin}/admin?tab=users`);
  });

  it('falls back to default redirect when returnUrl is missing', async () => {
    const component = await setup();

    await component.login();

    expect(loginSpy).toHaveBeenCalledWith(undefined);
  });

  it('falls back to default redirect when returnUrl points to the app root', async () => {
    const component = await setup('/');

    await component.login();

    expect(loginSpy).toHaveBeenCalledWith(undefined);
  });

  it('ignores external returnUrl values', async () => {
    const component = await setup('https://malicious.example/admin');

    await component.login();

    expect(loginSpy).toHaveBeenCalledWith(undefined);
  });
});
