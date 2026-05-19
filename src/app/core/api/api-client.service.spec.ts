import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { ApiClientService } from './api-client.service';

describe('ApiClientService', () => {
  let service: ApiClientService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ApiClientService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('prepends the API base URL for GET requests', () => {
    service.get<{ ok: boolean }>('/health').subscribe((response) => {
      expect(response.ok).toBe(true);
    });

    const request = httpController.expectOne(`${environment.apiBaseUrl}/health`);
    expect(request.request.method).toBe('GET');
    request.flush({ ok: true });
  });

  it('normalizes paths without a leading slash', () => {
    service.get<void>('courses').subscribe();

    const request = httpController.expectOne(`${environment.apiBaseUrl}/courses`);
    expect(request.request.method).toBe('GET');
    request.flush({});
  });

  it('uses absolute URLs as-is', () => {
    service.get<void>('https://example.com/health').subscribe();

    const request = httpController.expectOne('https://example.com/health');
    expect(request.request.method).toBe('GET');
    request.flush({});
  });

  it('maps object params, including arrays, and drops nullish values', () => {
    service
      .get<{ items: number[] }>('/users', {
        params: {
          page: 1,
          active: false,
          role: ['student', 'instructor'],
          optional: undefined,
          nullable: null,
        },
      })
      .subscribe();

    const request = httpController.expectOne((value) => value.url === `${environment.apiBaseUrl}/users`);

    expect(request.request.params.get('page')).toBe('1');
    expect(request.request.params.get('active')).toBe('false');
    expect(request.request.params.getAll('role')).toEqual(['student', 'instructor']);
    expect(request.request.params.has('optional')).toBe(false);
    expect(request.request.params.has('nullable')).toBe(false);
    request.flush({ items: [] });
  });

  it('forwards request options for POST calls', () => {
    service
      .post<{ title: string }, { id: string }>(
        '/courses',
        { title: 'Angular API Design' },
        {
          headers: { 'X-Correlation-Id': 'trace-123' },
          withCredentials: true,
        },
      )
      .subscribe();

    const request = httpController.expectOne(`${environment.apiBaseUrl}/courses`);

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ title: 'Angular API Design' });
    expect(request.request.headers.get('X-Correlation-Id')).toBe('trace-123');
    expect(request.request.withCredentials).toBe(true);
    request.flush({ id: '1' });
  });

  it('supports PATCH and DELETE verbs', () => {
    service.patch<{ name: string }, { id: string }>('/users/1', { name: 'Alex' }).subscribe();
    const patchRequest = httpController.expectOne(`${environment.apiBaseUrl}/users/1`);
    expect(patchRequest.request.method).toBe('PATCH');
    patchRequest.flush({ id: '1' });

    service.delete<void>('/users/1', { params: { hardDelete: true } }).subscribe();
    const deleteRequest = httpController.expectOne(
      (value) => value.url === `${environment.apiBaseUrl}/users/1`,
    );
    expect(deleteRequest.request.method).toBe('DELETE');
    expect(deleteRequest.request.params.get('hardDelete')).toBe('true');
    deleteRequest.flush({});
  });
});
