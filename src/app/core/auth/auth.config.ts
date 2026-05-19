import { PassedInitialConfig } from 'angular-auth-oidc-client';

const browserOrigin =
  typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4200';

export const authConfig: PassedInitialConfig = {
  config: {
    authority: 'http://localhost:8080/realms/acode',
    redirectUrl: browserOrigin,
    postLogoutRedirectUri: browserOrigin,
    clientId: 'acode-learn-ui',
    scope: 'openid profile email offline_access',
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true,
    renewTimeBeforeTokenExpiresInSeconds: 30,
  },
};
