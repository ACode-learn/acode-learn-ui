import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import {
  AdminUserProfileUpdate,
  AdminUserRolesUpdate,
  AdminUserView,
  PageAdminUserView,
  PageUserView,
  Pageable,
  UserRole,
  UserView,
} from './acode-api.models';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private readonly apiClient = inject(ApiClientService);

  getCurrentUser(): Observable<UserView> {
    return this.apiClient.get<UserView>('/users/me');
  }

  getUsersByRole(role: UserRole, pageable: Pageable): Observable<PageUserView> {
    return this.apiClient.get<PageUserView>('/users', {
      params: {
        role,
        page: pageable.page,
        size: pageable.size,
        sort: pageable.sort,
      },
    });
  }

  listUsers(pageable: Pageable, q?: string, role?: UserRole): Observable<PageAdminUserView> {
    return this.apiClient.get<PageAdminUserView>('/admin/users', {
      params: {
        q,
        role,
        page: pageable.page,
        size: pageable.size,
        sort: pageable.sort,
      },
    });
  }

  getUser(userId: number): Observable<AdminUserView> {
    return this.apiClient.get<AdminUserView>(`/admin/users/${userId}`);
  }

  updateProfile(userId: number, body: AdminUserProfileUpdate): Observable<AdminUserView> {
    return this.apiClient.patch<AdminUserProfileUpdate, AdminUserView>(`/admin/users/${userId}`, body);
  }

  setRoles(userId: number, body: AdminUserRolesUpdate): Observable<AdminUserView> {
    return this.apiClient.put<AdminUserRolesUpdate, AdminUserView>(`/admin/users/${userId}/roles`, body);
  }
}
