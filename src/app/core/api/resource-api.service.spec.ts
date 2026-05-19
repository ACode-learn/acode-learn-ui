import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { ResourceApiService } from './resource-api.service';

describe('ResourceApiService', () => {
  let service: ResourceApiService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ResourceApiService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('loads course resources and forwards optional type query param', () => {
    service.getCourseResources(4, 'FILE').subscribe();

    const request = httpController.expectOne(
      (value) => value.url === `${environment.apiBaseUrl}/courses/4/resources`,
    );
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('type')).toBe('FILE');
    request.flush([]);
  });

  it('creates a file resource and drops optional summary when omitted', () => {
    const file = new Blob(['content'], { type: 'text/plain' });

    service.createFileResource(8, 'intro.md', file).subscribe();

    const request = httpController.expectOne(
      (value) => value.url === `${environment.apiBaseUrl}/courses/8/resources/file`,
    );

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ file });
    expect(request.request.params.get('name')).toBe('intro.md');
    expect(request.request.params.has('summary')).toBe(false);
    request.flush({ id: 90, name: 'intro.md', resourceType: 'FILE', courseId: 8 });
  });

  it('fetches a resource file by id', () => {
    service.getFile(3, 22).subscribe((response) => {
      expect(response).toBe('YmFzZTY0');
    });

    const request = httpController.expectOne(`${environment.apiBaseUrl}/courses/3/resources/22/file`);
    expect(request.request.method).toBe('GET');
    request.flush('YmFzZTY0');
  });
});
