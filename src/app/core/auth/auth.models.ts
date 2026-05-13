export type AppRole = 'student' | 'instructor' | 'admin';

export interface AuthUser {
  readonly id: string;
  readonly username: string;
  readonly displayName: string;
  readonly email?: string;
  readonly roles: readonly AppRole[];
}

export interface JwtTokenClaims {
  readonly sub: string;
  readonly preferred_username?: string;
  readonly name?: string;
  readonly email?: string;
  readonly exp?: number;
  readonly realm_access?: {
    readonly roles?: readonly string[];
  };
  readonly resource_access?: Record<
    string,
    {
      readonly roles?: readonly string[];
    }
  >;
}

export function mapKeycloakRolesToAppRoles(
  keycloakRoles: readonly string[],
): readonly AppRole[] {
  const roles = new Set<AppRole>();

  if (keycloakRoles.includes('ROLE_STUDENT') || keycloakRoles.includes('student')) {
    roles.add('student');
  }
  if (
    keycloakRoles.includes('ROLE_TEACHER') ||
    keycloakRoles.includes('instructor') ||
    keycloakRoles.includes('teacher')
  ) {
    roles.add('instructor');
  }
  if (keycloakRoles.includes('ROLE_ADMIN') || keycloakRoles.includes('admin')) {
    roles.add('admin');
  }

  return [...roles];
}
