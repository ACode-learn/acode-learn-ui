import { Injectable, computed, inject, signal } from '@angular/core';
import {
  OidcSecurityService,
  type LoginResponse,
} from 'angular-auth-oidc-client';
import { firstValueFrom } from 'rxjs';
import { authConfig } from './auth.config';
import {
  AppRole,
  AuthUser,
  JwtTokenClaims,
  mapKeycloakRolesToAppRoles,
} from './auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly oidcSecurityService = inject(OidcSecurityService);
  private readonly oidcClientId = this.resolveOidcClientId();
  private initializationPromise: Promise<void> | null = null;

  private readonly authenticated = signal(false);

  readonly currentUser = signal<AuthUser | null>(null);

  readonly isAuthenticated = computed(() => this.authenticated());

  readonly isStudent = computed(
    () => this.currentUser()?.roles.includes('student') ?? false,
  );

  readonly isInstructor = computed(
    () => this.currentUser()?.roles.includes('instructor') ?? false,
  );

  readonly isAdmin = computed(
    () => this.currentUser()?.roles.includes('admin') ?? false,
  );

  async initialize(): Promise<void> {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.initializeInternal();

    return this.initializationPromise;
  }

  async ensureInitialized(): Promise<void> {
    await this.initialize();
  }

  private async initializeInternal(): Promise<void> {
    try {
      const loginResponse = await firstValueFrom(this.oidcSecurityService.checkAuth());
      this.authenticated.set(loginResponse.isAuthenticated);

      if (!this.isLoginResponseAuthenticated(loginResponse)) {
        this.currentUser.set(null);
        return;
      }

      await this.refreshUserFromToken();
    } catch (error) {
      console.error('OIDC initialization failed', error);
      this.currentUser.set(null);
      this.authenticated.set(false);
    }
  }

  async login(redirectUri?: string): Promise<void> {
    this.oidcSecurityService.authorize(undefined, {
      redirectUrl: redirectUri ?? window.location.origin,
    });
  }

  async logout(redirectUri?: string): Promise<void> {
    const logoutOptions = redirectUri
      ? {
          customParams: {
            post_logout_redirect_uri: redirectUri,
          },
        }
      : undefined;

    await firstValueFrom(this.oidcSecurityService.logoff(undefined, logoutOptions));
    this.currentUser.set(null);
    this.authenticated.set(false);
  }

  hasRole(role: AppRole): boolean {
    return this.currentUser()?.roles.includes(role) ?? false;
  }

  hasAnyRole(roles: readonly AppRole[]): boolean {
    return roles.some((role) => this.hasRole(role));
  }

  async getAccessToken(): Promise<string | null> {
    try {
      const token = await firstValueFrom(this.oidcSecurityService.getAccessToken());
      return token || null;
    } catch {
      return null;
    }
  }

  private async refreshUserFromToken(): Promise<void> {
    const claims = await this.getAccessTokenClaims();

    if (!claims?.sub) {
      this.currentUser.set(null);
      return;
    }

    const realmRoles = claims.realm_access?.roles ?? [];
    const clientRoles = this.resolveClientRoles(claims);
    const roles = mapKeycloakRolesToAppRoles([...realmRoles, ...clientRoles]);

    this.currentUser.set({
      id: claims.sub,
      username: claims.preferred_username ?? claims.sub,
      displayName: claims.name ?? claims.preferred_username ?? 'User',
      email: claims.email,
      roles,
    });
  }

  private async getAccessTokenClaims(): Promise<JwtTokenClaims | null> {
    try {
      return (await firstValueFrom(
        this.oidcSecurityService.getPayloadFromAccessToken(),
      )) as JwtTokenClaims | null;
    } catch {
      return null;
    }
  }

  private resolveClientRoles(claims: JwtTokenClaims): readonly string[] {
    if (!claims.resource_access) {
      return [];
    }

    if (this.oidcClientId) {
      return claims.resource_access[this.oidcClientId]?.roles ?? [];
    }

    return Object.values(claims.resource_access).flatMap(
      (resourceAccess) => resourceAccess.roles ?? [],
    );
  }

  private resolveOidcClientId(): string | null {
    const config = authConfig.config;

    if (!config) {
      return null;
    }

    if (Array.isArray(config)) {
      return config[0]?.clientId ?? null;
    }

    return config.clientId ?? null;
  }

  private isLoginResponseAuthenticated(
    loginResponse: LoginResponse,
  ): loginResponse is LoginResponse & { isAuthenticated: true } {
    return loginResponse.isAuthenticated;
  }
}
