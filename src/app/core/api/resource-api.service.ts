import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import {
  CreateFileResourceCommand,
  CreateResourceCommand,
  Resource,
  ResourceSummaryView,
  ResourceType,
  UpdateResourceCommand,
} from './acode-api.models';

@Injectable({
  providedIn: 'root',
})
export class ResourceApiService {
  private readonly apiClient = inject(ApiClientService);

  getCourseResources(courseId: number, type?: ResourceType): Observable<ResourceSummaryView[]> {
    return this.apiClient.get<ResourceSummaryView[]>(`/courses/${courseId}/resources`, {
      params: { type },
    });
  }

  getResource(courseId: number, resourceId: number): Observable<Resource> {
    return this.apiClient.get<Resource>(`/courses/${courseId}/resources/${resourceId}`);
  }

  createResource(courseId: number, body: CreateResourceCommand): Observable<Resource> {
    return this.apiClient.post<CreateResourceCommand, Resource>(`/courses/${courseId}/resources`, body);
  }

  createFileResource(
    courseId: number,
    name: string,
    file: Blob,
    summary?: string,
  ): Observable<Resource> {
    return this.apiClient.post<CreateFileResourceCommand, Resource>(
      `/courses/${courseId}/resources/file`,
      { file },
      { params: { name, summary } },
    );
  }

  updateResource(courseId: number, resourceId: number, body: UpdateResourceCommand): Observable<Resource> {
    return this.apiClient.put<UpdateResourceCommand, Resource>(
      `/courses/${courseId}/resources/${resourceId}`,
      body,
    );
  }

  deleteResource(courseId: number, resourceId: number): Observable<void> {
    return this.apiClient.delete<void>(`/courses/${courseId}/resources/${resourceId}`);
  }

  getFile(courseId: number, resourceId: number): Observable<string> {
    return this.apiClient.get<string>(`/courses/${courseId}/resources/${resourceId}/file`);
  }
}
