import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { CourseApiService } from './course-api.service';

describe('CourseApiService', () => {
  let service: CourseApiService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(CourseApiService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('creates a course with the expected payload', () => {
    const body = { title: 'Angular Fundamentals', semester: 2 };

    service.createCourse(body).subscribe((response) => {
      expect(response.title).toBe('Angular Fundamentals');
    });

    const request = httpController.expectOne(`${environment.apiBaseUrl}/courses`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(body);
    request.flush({ id: 10, title: 'Angular Fundamentals', semester: 2 });
  });

  it('uses PATCH to update a course', () => {
    service.updateCourse(7, { courseId: 7, title: 'Advanced Angular' }).subscribe();

    const request = httpController.expectOne(`${environment.apiBaseUrl}/courses/7`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ courseId: 7, title: 'Advanced Angular' });
    request.flush({ id: 7, title: 'Advanced Angular' });
  });

  it('transfers course ownership with the expected payload', () => {
    service.transferOwnership(11, { newOwnerId: 42 }).subscribe();

    const request = httpController.expectOne(
      `${environment.apiBaseUrl}/courses/11/transfer-ownership`,
    );
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ newOwnerId: 42 });
    request.flush({ id: 11, title: 'Transferred course' });
  });

  it('sends array query params when removing resources from a section', () => {
    service.removeResourcesFromSection(7, 12, [100, 200]).subscribe();

    const request = httpController.expectOne(
      (value) => value.url === `${environment.apiBaseUrl}/courses/7/sections/12/resources`,
    );

    expect(request.request.method).toBe('DELETE');
    expect(request.request.params.getAll('resourceIds')).toEqual(['100', '200']);
    request.flush({});
  });

  it('omits optional resource type query param when it is not provided', () => {
    service.getCourseResources(11).subscribe();

    const request = httpController.expectOne(
      (value) => value.url === `${environment.apiBaseUrl}/courses/11/resources`,
    );

    expect(request.request.method).toBe('GET');
    expect(request.request.params.has('type')).toBe(false);
    request.flush([]);
  });

  it('posts section resource ids as body payload', () => {
    service.addResourcesToSection(7, 3, [1, 2, 3]).subscribe();

    const request = httpController.expectOne(`${environment.apiBaseUrl}/courses/7/sections/3/resources`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual([1, 2, 3]);
    request.flush({});
  });

  it('uses PUT to add an instructor', () => {
    service.addInstructor(8, 13).subscribe();

    const request = httpController.expectOne(`${environment.apiBaseUrl}/courses/8/instructors/13`);
    expect(request.request.method).toBe('PUT');
    request.flush({});
  });
});
