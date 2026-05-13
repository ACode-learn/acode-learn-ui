``` markdown
# Modern ACode Learn UI ? Minimal Angular Rebuild Plan

## Goal

Create a **new latest-Angular application** and migrate the old app feature by feature.

Do **not** upgrade the existing Angular 8 app in place.

The new app should use:

- Latest Angular
- Standalone components
- Lazy-loaded routes
- Signals
- Strict TypeScript
- Reactive forms
- Keycloak JWT authentication
- PrimeNG for UI
- NgRx only if state becomes complex
- Playwright for E2E tests
- ESLint + Prettier
- No jQuery
- No Bootstrap JavaScript
- No Protractor
- No TSLint

---

# 1. Create New Angular App

Create the new project as a sibling of the existing project.
```

bash cd /home/alexandros/projects/acode-learn/repos
npx @angular/cli@latest new acode-learn-ui-platform-modern
--routing
--style=scss
--strict
--package-manager=npm``` 

Enter the project:
```

bash cd acode-learn-ui-platform-modern``` 

---

# 2. Install Required Packages

## PrimeNG
```

bash npm install primeng primeicons @primeuix/themes``` 

## Keycloak

Prefer `keycloak-angular` if it supports the selected Angular version.
```

bash npm install keycloak-angular keycloak-js``` 

## NgRx

Do **not** add NgRx immediately unless needed.

Add NgRx later only if the app develops complex shared state.

Potential future install:
```

bash npm install @ngrx/store @ngrx/effects @ngrx/store-devtools @ngrx/signals``` 

## Playwright
```

bash npm init playwright@latest``` 

---

# 3. Core Architecture

Use this minimal structure:
```

text src/ app/ app.config.ts app.routes.ts
core/
  api/
    api-client.service.ts

  auth/
    auth.models.ts
    auth.service.ts
    auth.guard.ts
    role.guard.ts
    auth.interceptor.ts

  layout/
    app-shell/
    top-nav/

  notifications/
    notification.service.ts

features/
  auth/
    login/
    not-authorized/

  home/
    home-page/

  student/
    student-home-page/
    student-profile-page/

  courses/
    courses.routes.ts
    course-list-page/
    course-detail-page/

  instructor/
    instructor.routes.ts
    instructor-dashboard-page/
    instructor-courses-page/
    instructor-course-detail-page/

  resources/
    resources.routes.ts
    resource-viewer-page/
    resource-editor-page/

shared/
  components/
    page-header/
    loading-state/
    empty-state/
    confirm-dialog/

  models/
    user.model.ts
    course.model.ts
    resource.model.ts``` 

Keep the initial skeleton small. Add more folders only when migrating actual features.

---

# 4. Angular Best Practices

The new app must follow these rules:

## Components

Use standalone components.

Use:
```

typescript @Component({ selector: 'app-example', imports: [], templateUrl: './example.component.html', styleUrl: './example.component.scss', changeDetection: ChangeDetectionStrategy.OnPush, }) export class ExampleComponent {}``` 

Rules:

- Use `ChangeDetectionStrategy.OnPush`.
- Use `input()` and `output()` instead of `@Input()` and `@Output()`.
- Use signals for local state.
- Use `computed()` for derived state.
- Avoid `any`.
- Use reactive forms.
- Use native control flow: `@if`, `@for`, `@switch`.
- Do not use jQuery.
- Do not use direct DOM manipulation unless unavoidable.
- Do not create a large root `AppModule`.

---

## Services

Use root-provided services.
```

typescript @Injectable({ providedIn: 'root', }) export class ExampleService { private readonly http = inject(HttpClient); }``` 

Use `inject()` instead of constructor injection where practical.

---

## HTTP

Use provider-based HTTP setup.
```

typescript provideHttpClient``` 

Do not use `HttpClientModule`.

---

# 5. App Configuration

Create `src/app/app.config.ts`.

Required providers:
```

typescript import { ApplicationConfig } from '@angular/core'; import { provideRouter, withComponentInputBinding } from '@angular/router'; import { provideHttpClient, withInterceptors } from '@angular/common/http'; import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; import { routes } from './app.routes'; import { authInterceptor } from './core/auth/auth.interceptor';
export const appConfig: ApplicationConfig = { providers: , };``` 

PrimeNG configuration can be added here depending on the latest PrimeNG setup.

---

# 6. Environment Configuration

Create environment files:
```

text src/environments/environment.ts src/environments/environment.development.ts src/environments/environment.production.ts``` 

Example:
```

typescript export const environment = { production: false, apiBaseUrl: 'http://localhost:8080/api', keycloak: { url: 'http://localhost:8081', realm: 'acode-learn', clientId: 'acode-learn-ui', }, };``` 

Important:

- Do not store Keycloak client secrets in Angular.
- The Angular app must use a public Keycloak client.
- Use Authorization Code Flow with PKCE.

---

# 7. Keycloak Authentication

## Required Flow

Use:
```

text Authorization Code Flow with PKCE``` 

Do **not** use:
```

text Password grant Client secret in frontend Basic auth from Angular``` 

The browser app should redirect to Keycloak for login.

---

## Keycloak Client Settings

Create a Keycloak client like:
```

text Client ID: acode-learn-ui Client type: OpenID Connect Client authentication: Off Standard flow: On Direct access grants: Off PKCE: Required``` 

Redirect URIs:
```

text http://localhost:4200/* https://your-production-domain/*``` 

Web origins:
```

text http://localhost:4200 https://your-production-domain``` 

---

# 8. Auth Models

Create `src/app/core/auth/auth.models.ts`.
```

typescript export type AppRole = 'student' | 'instructor' | 'admin';
export interface AuthUser { readonly id: string; readonly username: string; readonly displayName: string; readonly email?: string; readonly roles: readonly AppRole[]; }
export interface JwtTokenClaims { readonly sub: string; readonly preferred_username?: string; readonly name?: string; readonly email?: string; readonly exp?: number; readonly realm_access?: { readonly roles?: readonly string[]; }; readonly resource_access?: Record< string, { readonly roles?: readonly string[]; }
; }``` 

Role mapping:
```

typescript export function mapKeycloakRolesToAppRoles: readonly AppRole[] { const roles = new Set();
if (keycloakRoles.includes('ROLE_STUDENT')) { roles.add('student'); }
if (keycloakRoles.includes('ROLE_TEACHER')) { roles.add('instructor'); }
if (keycloakRoles.includes('ROLE_ADMIN')) { roles.add('admin'); }
return [...roles]; }``` 

---

# 9. Auth Service

Create `src/app/core/auth/auth.service.ts`.

Responsibilities:

- Initialize Keycloak.
- Redirect to login.
- Redirect to logout.
- Expose current user as a signal.
- Expose authenticated state as a computed signal.
- Expose role helpers.
- Provide access token for API calls.

Required public API:
```

typescript @Injectable({ providedIn: 'root', }) export class AuthService { readonly currentUser = signal<AuthUser | null>(null);
readonly isAuthenticated = computed(() => this.currentUser() !== null);
readonly isStudent = computed(() => this.currentUser()?.roles.includes('student') ?? false );
readonly isInstructor = computed(() => this.currentUser()?.roles.includes('instructor') ?? false );
readonly isAdmin = computed(() => this.currentUser()?.roles.includes('admin') ?? false );
async initialize(): Promise{ // Initialize Keycloak here. }
async login(): Promise{ // Redirect to Keycloak login. }
async logout(): Promise{ // Redirect to Keycloak logout. }
hasRole(role: AppRole): boolean { return this.currentUser()?.roles.includes(role) ?? false; }
hasAnyRole(roles: readonly AppRole[]): boolean { return roles.some((role) => this.hasRole(role)); }
async getAccessToken(): Promise<string | null> { // Return current Keycloak access token. return null; } }``` 

---

# 10. Auth Guard

Create `src/app/core/auth/auth.guard.ts`.
```

typescript export const authGuard: CanActivateFn = () => { const authService = inject(AuthService); const router = inject(Router);
if (authService.isAuthenticated()) { return true; }
return router.createUrlTree(['/login']); };``` 

---

# 11. Role Guard

Create `src/app/core/auth/role.guard.ts`.
```

typescript export function roleGuard(requiredRoles: readonly AppRole[]): CanActivateFn { return () => { const authService = inject(AuthService); const router = inject(Router);
if (!authService.isAuthenticated()) {
  return router.createUrlTree(['/login']);
}

if (authService.hasAnyRole(requiredRoles)) {
  return true;
}

return router.createUrlTree(['/not-authorized']);
}; }``` 

---

# 12. Auth Interceptor

Create `src/app/core/auth/auth.interceptor.ts`.

Responsibilities:

- Attach JWT access token to backend API calls.
- Only attach token to URLs starting with `environment.apiBaseUrl`.
- Do not attach token to Keycloak URLs.
```

typescript export const authInterceptor: HttpInterceptorFn = async (request, next) => { const authService = inject(AuthService);
if (!request.url.startsWith(environment.apiBaseUrl)) { return next(request); }
const token = await authService.getAccessToken();
if (!token) { return next(request); }
const authenticatedRequest = request.clone({ setHeaders: { Authorization: Bearer ${token}, }, });
return next(authenticatedRequest); };``` 

---

# 13. API Client

Create `src/app/core/api/api-client.service.ts`.
```

typescript @Injectable({ providedIn: 'root', }) export class ApiClientService { private readonly http = inject(HttpClient);
get (path: string): Observable { return this.http.get(${environment.apiBaseUrl}${path}); }
post<TRequest, TResponse>: Observable { return this.http.post(${environment.apiBaseUrl}${path}, body); }
put<TRequest, TResponse>: Observable { return this.http.put(${environment.apiBaseUrl}${path}, body); }
delete (path: string): Observable { return this.http.delete(${environment.apiBaseUrl}${path}); } }``` 

Feature services should use this instead of hardcoding URLs.

---

# 14. Routes

Create `src/app/app.routes.ts`.
```

typescript export const routes: Routes = ;``` 

---

# 15. Minimal Feature Routes

## Courses

Create `src/app/features/courses/courses.routes.ts`.
```

typescript export const COURSES_ROUTES: Routes = ;``` 

## Instructor

Create `src/app/features/instructor/instructor.routes.ts`.
```

typescript export const INSTRUCTOR_ROUTES: Routes = ;``` 

## Resources

Create `src/app/features/resources/resources.routes.ts`.
```

typescript export const RESOURCES_ROUTES: Routes = ;``` 

---

# 16. App Shell

Create a minimal layout:
```

text core/layout/app-shell core/layout/top-nav``` 

The shell should contain:

- PrimeNG toolbar
- user menu
- logout button
- router outlet

Example shell template:
```

html <app-top-nav />``` 

Top nav should show:

- Home
- Courses
- Student link if student
- Instructor link if instructor
- User display name
- Logout button

---

# 17. PrimeNG Usage

Use PrimeNG for:

- Toolbar
- Buttons
- Card
- Menu
- Toast
- Dialog
- ConfirmDialog
- ProgressSpinner
- Table
- Forms

Recommended PrimeNG imports per component, not globally.

Example component imports:
```

typescript @Component({ selector: 'app-login', imports: , templateUrl: './login.component.html', styleUrl: './login.component.scss', changeDetection: ChangeDetectionStrategy.OnPush, }) export class LoginComponent {}``` 

Use PrimeNG `Toast` through a notification service.

Use PrimeNG `ConfirmDialog` through a shared confirmation service.

---

# 18. Notification Service

Create `src/app/core/notifications/notification.service.ts`.

Use PrimeNG `MessageService`.
```

typescript @Injectable({ providedIn: 'root', }) export class NotificationService { private readonly messageService = inject(MessageService);
success(summary: string, detail?: string): void { this.messageService.add({ severity: 'success', summary, detail, }); }
error(summary: string, detail?: string): void { this.messageService.add({ severity: 'error', summary, detail, }); }
info(summary: string, detail?: string): void { this.messageService.add({ severity: 'info', summary, detail, }); } }``` 

Add `MessageService` to `app.config.ts` providers.

---

# 19. Shared Components

Only create these initially:
```

text shared/components/page-header shared/components/loading-state shared/components/empty-state shared/components/confirm-dialog``` 

## Page Header

Used for page title and optional actions.

## Loading State

Used while data is loading.

## Empty State

Used when lists have no data.

## Confirm Dialog

Used later for delete confirmations.

---

# 20. Initial Models

Create only the essential models.

## User
```

typescript export interface User { readonly id: number; readonly username: string; readonly displayName: string; readonly email?: string; }``` 

## Course
```

typescript export interface Course { readonly id: number; readonly title: string; readonly description?: string; }``` 

## Resource
```

typescript export type ResourceType = | 'markdown' | 'code' | 'file' | 'repository' | 'guide';
export interface Resource { readonly id: number; readonly type: ResourceType; readonly title: string; readonly description?: string; }``` 

---

# 21. NgRx Decision

Do not use NgRx at skeleton stage.

Use signals first.

Use NgRx only if one of these becomes true:

- many unrelated components need the same state
- course/resource state becomes complex
- optimistic updates are needed
- caching becomes important
- state transitions become hard to reason about
- multiple effects depend on the same API calls

If NgRx is needed later, prefer:
```

text @ngrx/signals``` 

for feature state.

Possible future stores:
```

text auth store: probably not needed, AuthService signal is enough courses store: maybe needed resources store: likely candidate later instructor course editor store: likely candidate later``` 

---

# 22. Security Rules

Required:

- Use Keycloak Authorization Code + PKCE.
- Do not store client secrets in Angular.
- Do not use password grant.
- Backend must validate JWT and enforce authorization.
- Frontend role guards are only for UX.
- Do not trust decoded JWT on the backend.
- Sanitize rendered Markdown.
- Avoid `bypassSecurityTrustHtml` unless content is sanitized first.

---

# 23. Migration Order

After the skeleton works, migrate features in this order:
```

text
Keycloak auth and role routing
App shell and navigation
Course list
Course detail
Student profile
Instructor dashboard
Instructor courses
Resource viewer
Resource editor
Dynamic guide features``` 

---

# 24. Markdown/Editor Migration Note

For markdown resources:

- Use a maintained markdown renderer.
- Sanitize rendered HTML.
- Do not directly trust rendered HTML.
- Prefer CodeMirror 6 or Monaco for editing.
- Do not copy old CodeMirror 5 patterns directly.

Recommended later packages:
```

text markdown-it or marked DOMPurify CodeMirror 6 or Monaco``` 

---

# 25. Initial Commands

Generate only the required components.
```

bash ng generate component core/layout/app-shell --change-detection=OnPush ng generate component core/layout/top-nav --change-detection=OnPush
ng generate component features/auth/login --change-detection=OnPush ng generate component features/auth/not-authorized --change-detection=OnPush
ng generate component features/home/home-page --change-detection=OnPush
ng generate component features/student/student-home-page --change-detection=OnPush ng generate component features/student/student-profile-page --change-detection=OnPush
ng generate component features/courses/course-list-page --change-detection=OnPush ng generate component features/courses/course-detail-page --change-detection=OnPush
ng generate component features/instructor/instructor-dashboard-page --change-detection=OnPush ng generate component features/instructor/instructor-courses-page --change-detection=OnPush ng generate component features/instructor/instructor-course-detail-page --change-detection=OnPush
ng generate component features/resources/resource-viewer-page --change-detection=OnPush ng generate component features/resources/resource-editor-page --change-detection=OnPush
ng generate component shared/components/page-header --change-detection=OnPush ng generate component shared/components/loading-state --change-detection=OnPush ng generate component shared/components/empty-state --change-detection=OnPush ng generate component shared/components/confirm-dialog --change-detection=OnPush``` 

Create these files manually:
```

text src/app/core/api/api-client.service.ts
src/app/core/auth/auth.models.ts src/app/core/auth/auth.service.ts src/app/core/auth/auth.guard.ts src/app/core/auth/role.guard.ts src/app/core/auth/auth.interceptor.ts
src/app/core/notifications/notification.service.ts
src/app/features/courses/courses.routes.ts src/app/features/instructor/instructor.routes.ts src/app/features/resources/resources.routes.ts
src/app/shared/models/user.model.ts src/app/shared/models/course.model.ts src/app/shared/models/resource.model.ts``` 

---

# 26. Definition of Done for Skeleton

The first version is complete when:
```

text
New Angular app runs locally.
PrimeNG is configured.
Keycloak login/logout works.
Auth state is stored in signals.
JWT is attached to backend API requests.
Role guards work for student/instructor routes.
App shell and top nav work.
Placeholder pages exist.
API client exists.
Notification service exists.
No jQuery exists.
No Bootstrap JavaScript exists.
No NgRx is added unless explicitly needed.
npm run build succeeds.
npm test succeeds.
A basic Playwright smoke test exists.``` 

---

# 27. Claude Code Implementation Instructions

Implement this in small commits.

Rules:
```

text
Do not modify the legacy Angular app.
Create a new sibling Angular project.
Use latest Angular.
Use standalone components.
Use strict TypeScript.
Use PrimeNG for UI.
Use Keycloak Authorization Code + PKCE.
Do not use password grant.
Do not put Keycloak secrets in Angular.
Use signals for auth state.
Use functional guards.
Use provider-based HTTP interceptors.
Do not add NgRx initially.
Do not add Bootstrap JavaScript.
Do not add jQuery.
Generate only the minimal skeleton components.
Keep feature pages as placeholders for now.
Ensure the app builds before migrating features.``` 

Suggested commit order:
```

text chore: create modern angular workspace chore: configure primeng feat: add app shell and top navigation feat: add keycloak auth foundation feat: add auth and role guards feat: add api client and auth interceptor feat: add placeholder feature pages feat: add shared ui primitives test: add smoke test