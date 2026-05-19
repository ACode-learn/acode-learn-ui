import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import {
  AddResourcesToSectionCommand,
  CourseEnrollmentView,
  CourseSectionView,
  CourseSummaryView,
  CreateCourseCommand,
  CreateCourseSectionCommand,
  EnrollByEmailCommand,
  ReorderSectionsCommand,
  ResourceSummaryView,
  TransferOwnershipRequest,
  UpdateCourseCommand,
  UpdateCourseSectionCommand,
} from './acode-api.models';

@Injectable({
  providedIn: 'root',
})
export class CourseApiService {
  private readonly apiClient = inject(ApiClientService);

  createCourse(body: CreateCourseCommand): Observable<CourseSummaryView> {
    return this.apiClient.post<CreateCourseCommand, CourseSummaryView>('/courses', body);
  }

  updateCourse(courseId: number, body: UpdateCourseCommand): Observable<CourseSummaryView> {
    return this.apiClient.patch<UpdateCourseCommand, CourseSummaryView>(`/courses/${courseId}`, body);
  }

  transferOwnership(
    courseId: number,
    body: TransferOwnershipRequest,
  ): Observable<CourseSummaryView> {
    return this.apiClient.post<TransferOwnershipRequest, CourseSummaryView>(
      `/courses/${courseId}/transfer-ownership`,
      body,
    );
  }

  getUserCourses(): Observable<CourseSummaryView[]> {
    return this.apiClient.get<CourseSummaryView[]>('/user-courses');
  }

  getOwnedCourses(): Observable<CourseSummaryView[]> {
    return this.apiClient.get<CourseSummaryView[]>('/instructor/owned-courses');
  }

  getSections(courseId: number): Observable<CourseSectionView[]> {
    return this.apiClient.get<CourseSectionView[]>(`/courses/${courseId}/sections`);
  }

  getSection(courseId: number, sectionId: number): Observable<CourseSectionView> {
    return this.apiClient.get<CourseSectionView>(`/courses/${courseId}/sections/${sectionId}`);
  }

  createSection(courseId: number, body: CreateCourseSectionCommand): Observable<CourseSectionView> {
    return this.apiClient.post<CreateCourseSectionCommand, CourseSectionView>(
      `/courses/${courseId}/sections`,
      body,
    );
  }

  updateSection(
    courseId: number,
    sectionId: number,
    body: UpdateCourseSectionCommand,
  ): Observable<CourseSectionView> {
    return this.apiClient.patch<UpdateCourseSectionCommand, CourseSectionView>(
      `/courses/${courseId}/sections/${sectionId}`,
      body,
    );
  }

  deleteSection(courseId: number, sectionId: number): Observable<void> {
    return this.apiClient.delete<void>(`/courses/${courseId}/sections/${sectionId}`);
  }

  reorderSections(
    courseId: number,
    body: ReorderSectionsCommand,
  ): Observable<CourseSectionView[]> {
    return this.apiClient.put<ReorderSectionsCommand, CourseSectionView[]>(
      `/courses/${courseId}/sections/order`,
      body,
    );
  }

  addResourcesToSection(
    courseId: number,
    sectionId: number,
    body: AddResourcesToSectionCommand,
  ): Observable<CourseSectionView> {
    return this.apiClient.post<AddResourcesToSectionCommand, CourseSectionView>(
      `/courses/${courseId}/sections/${sectionId}/resources`,
      body,
    );
  }

  removeResourcesFromSection(
    courseId: number,
    sectionId: number,
    resourceIds: readonly number[],
  ): Observable<CourseSectionView> {
    return this.apiClient.delete<CourseSectionView>(`/courses/${courseId}/sections/${sectionId}/resources`, {
      params: { resourceIds },
    });
  }

  getCourseResources(courseId: number, type?: string): Observable<ResourceSummaryView[]> {
    return this.apiClient.get<ResourceSummaryView[]>(`/courses/${courseId}/resources`, {
      params: { type },
    });
  }

  addInstructor(courseId: number, userId: number): Observable<void> {
    return this.apiClient.put<undefined, void>(`/courses/${courseId}/instructors/${userId}`, undefined);
  }

  removeInstructor(courseId: number, userId: number): Observable<void> {
    return this.apiClient.delete<void>(`/courses/${courseId}/instructors/${userId}`);
  }

  enrollStudent(courseId: number, userId: number): Observable<CourseEnrollmentView> {
    return this.apiClient.put<undefined, CourseEnrollmentView>(
      `/courses/${courseId}/enrollments/${userId}`,
      undefined,
    );
  }

  removeEnrollment(courseId: number, userId: number): Observable<void> {
    return this.apiClient.delete<void>(`/courses/${courseId}/enrollments/${userId}`);
  }

  enrollByEmail(courseId: number, body: EnrollByEmailCommand): Observable<CourseEnrollmentView> {
    return this.apiClient.post<EnrollByEmailCommand, CourseEnrollmentView>(
      `/courses/${courseId}/enrollments/by-email`,
      body,
    );
  }

  listEnrollments(courseId: number): Observable<CourseEnrollmentView[]> {
    return this.apiClient.get<CourseEnrollmentView[]>(`/courses/${courseId}/enrollments`);
  }

  listPendingEnrollments(courseId: number): Observable<CourseEnrollmentView[]> {
    return this.apiClient.get<CourseEnrollmentView[]>(`/courses/${courseId}/enrollments/pending`);
  }
}
