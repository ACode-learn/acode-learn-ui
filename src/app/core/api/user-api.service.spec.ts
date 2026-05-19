import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { UserApiService } from './user-api.service';

describe('UserApiService', () => {
  let service: UserApiService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(UserApiService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('loads the current user', () => {
    service.getCurrentUser().subscribe((response) => {
      expect(response.username).toBe('alex');
    });

    const request = httpController.expectOne(`${environment.apiBaseUrl}/users/me`);
    expect(request.request.method).toBe('GET');
    request.flush({ id: 1, username: 'alex', roles: ['STUDENT'] });
  });

  it('maps pageable query fields and array sort values for users by role', () => {
    service
      .getUsersByRole('STUDENT', {
        page: 2,
        sort: ['lastName,asc', 'firstName,asc'],
      })
      .subscribe();

    const request = httpController.expectOne((value) => value.url === `${environment.apiBaseUrl}/users`);

    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('role')).toBe('STUDENT');
    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.has('size')).toBe(false);
    expect(request.request.params.getAll('sort')).toEqual(['lastName,asc', 'firstName,asc']);
    request.flush({ content: [] });
  });

  it('lists admin users with optional filters and pageable params', () => {
    service
      .listUsers({ page: 0, size: 20, sort: ['lastName,asc'] }, 'alex', 'TEACHER')
      .subscribe();

    const request = httpController.expectOne(
      (value) => value.url === `${environment.apiBaseUrl}/admin/users`,
    );

    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('q')).toBe('alex');
    expect(request.request.params.get('role')).toBe('TEACHER');
    expect(request.request.params.get('page')).toBe('0');
    expect(request.request.params.get('size')).toBe('20');
    expect(request.request.params.getAll('sort')).toEqual(['lastName,asc']);
    request.flush({ content: [] });
  });

  it('loads a specific admin user profile', () => {
    service.getUser(12).subscribe((response) => {
      expect(response.id).toBe(12);
    });

    const request = httpController.expectOne(`${environment.apiBaseUrl}/admin/users/12`);
    expect(request.request.method).toBe('GET');
    request.flush({ id: 12, username: 'alex12' });
  });

  it('updates admin user profile with PATCH', () => {
    service.updateProfile(9, { firstName: 'Alex' }).subscribe((response) => {
      expect(response.firstName).toBe('Alex');
    });

    const request = httpController.expectOne(`${environment.apiBaseUrl}/admin/users/9`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ firstName: 'Alex' });
    request.flush({ id: 9, firstName: 'Alex' });
  });

  it('sets admin user roles with PUT', () => {
    service.setRoles(9, { roles: ['ADMIN'] }).subscribe((response) => {
      expect(response.roles).toEqual(['ADMIN']);
    });

    const request = httpController.expectOne(`${environment.apiBaseUrl}/admin/users/9/roles`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({ roles: ['ADMIN'] });
    request.flush({ id: 9, roles: ['ADMIN'] });
  });
});
