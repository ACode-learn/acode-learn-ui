# ACode Learn UI

Modern Angular rebuild of the ACode Learn platform.

## Stack

- **Angular 21** (standalone components, signals, zoneless change detection, native control flow)
- **PrimeNG 21** + **PrimeIcons** (Aura theme via `@primeuix/themes`)
- **keycloak-angular** / **keycloak-js** for Authorization Code + PKCE auth
- **Reactive forms**, strict TypeScript
- **Playwright** for E2E smoke tests
- Lazy-loaded feature routes
- HTTP interceptor that attaches the Keycloak JWT to API calls

## Project structure

```
src/app/
  app.config.ts              # PrimeNG, HTTP, animations, router, auth bootstrap
  app.routes.ts              # Top-level + lazy feature routes
  core/
    api/api-client.service.ts
    auth/                    # auth.models | auth.service | auth.guard | role.guard | auth.interceptor
    layout/app-shell, top-nav
    notifications/notification.service.ts
  features/
    auth/login, auth/not-authorized
    home/home-page
    student/...
    courses/...               # + courses.routes.ts
    instructor/...            # + instructor.routes.ts
    resources/...             # + resources.routes.ts
  shared/
    components/page-header, loading-state, empty-state, confirm-dialog
    models/user.model | course.model | resource.model
src/environments/             # environment(.ts | .development.ts | .production.ts)
public/silent-check-sso.html  # Keycloak silent SSO check
e2e/smoke.spec.ts             # Playwright smoke test
```

## Development

```bash
npm start              # ng serve, http://localhost:4200
npm run build          # production build (file replacements -> environment.production.ts)
npm test               # unit tests (vitest via @angular/build:unit-test)
npm run e2e:install    # one-time: install Playwright browsers
npm run e2e            # run Playwright smoke tests (boots `npm start` automatically)
```

## Keycloak

Configure a public OIDC client with PKCE (`Required`), standard flow on, direct
access grants off. Update redirect URIs to include `http://localhost:4200/*`.
Edit `src/environments/environment.ts` to point at your Keycloak realm/url.

The frontend never holds a client secret; it uses Authorization Code Flow with
PKCE. Backend services are responsible for validating JWTs.
