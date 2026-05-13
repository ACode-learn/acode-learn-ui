import { Injectable, computed, signal } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from '../../../environments/environment';
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
  private keycloak: Keycloak | null = null;

  readonly currentUser = signal<AuthUser | null>(null);

  readonly isAuthenticated = computed(() => this.currentUser() !== null);

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
    this.keycloak = new Keycloak({
      url: environment.keycloak.url,
      realm: environment.keycloak.realm,
      clientId: environment.keycloak.clientId,
    });

    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        silentCheckSsoRedirectUri:
          window.location.origin + '/silent-check-sso.html',
      });

      if (authenticated) {
        this.refreshUserFromToken();
      }

      this.keycloak.onAuthSuccess = () => this.refreshUserFromToken();
      this.keycloak.onAuthRefreshSuccess = () => this.refreshUserFromToken();
      this.keycloak.onAuthLogout = () => this.currentUser.set(null);
    } catch (error) {
      console.error('Keycloak initialization failed', error);
      this.currentUser.set(null);
    }
  }

  async login(redirectUri?: string): Promise<void> {
    await this.keycloak?.login({
      redirectUri: redirectUri ?? window.location.origin,
    });
  }

  async logout(redirectUri?: string): Promise<void> {
    await this.keycloak?.logout({
      redirectUri: redirectUri ?? window.location.origin,
    });
    this.currentUser.set(null);
  }

  hasRole(role: AppRole): boolean {
    return this.currentUser()?.roles.includes(role) ?? false;
  }

  hasAnyRole(roles: readonly AppRole[]): boolean {
    return roles.some((role) => this.hasRole(role));
  }

  async getAccessToken(): Promise<string | null> {
    if (!this.keycloak) {
      return null;
    }
    try {
      await this.keycloak.updateToken(30);
      return this.keycloak.token ?? null;
    } catch {
      return null;
    }
  }

  private refreshUserFromToken(): void {
    const claims = this.keycloak?.tokenParsed as JwtTokenClaims | undefined;
    if (!claims) {
      this.currentUser.set(null);
      return;
    }

    const realmRoles = claims.realm_access?.roles ?? [];
    const clientRoles =
      claims.resource_access?.[environment.keycloak.clientId]?.roles ?? [];
    const roles = mapKeycloakRolesToAppRoles([...realmRoles, ...clientRoles]);

    this.currentUser.set({
      id: claims.sub,
      username: claims.preferred_username ?? claims.sub,
      displayName: claims.name ?? claims.preferred_username ?? 'User',
      email: claims.email,
      roles,
    });
  }
}
