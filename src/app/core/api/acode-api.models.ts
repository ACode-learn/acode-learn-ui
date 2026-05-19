export type SectionBlockType =
  | 'MARKDOWN'
  | 'RESOURCE'
  | 'VIDEO'
  | 'IMAGE'
  | 'CODE'
  | 'CALLOUT'
  | 'QUIZ'
  | 'CHECKLIST';

export type SectionLayout = 'LESSON' | 'LAB' | 'ASSIGNMENT' | 'QUIZ' | 'RESOURCE_LIST';

export type ResourceType = 'LINK' | 'FILE' | 'REPOSITORY' | 'CODE_SNIPPET' | 'MARKDOWN' | 'GUIDE';

export type EnrollmentStatus = 'PENDING' | 'ACTIVE';

export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export interface UpdateCourseCommand {
  courseId: number;
  title?: string;
  description?: string;
  semester?: number;
}

export interface CourseSummaryView {
  id?: number;
  title?: string;
  description?: string;
  semester?: number;
}

export interface SectionBlock {
  id: string;
  type: SectionBlockType;
  data?: Record<string, unknown>;
}

export interface SectionContent {
  version: number;
  layout?: SectionLayout;
  blocks?: SectionBlock[];
}

export interface UpdateCourseSectionCommand {
  sectionId: number;
  courseId: number;
  name?: string;
  description?: string;
  order?: number;
  content?: SectionContent;
}

export interface CourseSectionView {
  id?: number;
  courseId?: number;
  name?: string;
  description?: string;
  order?: number;
  content?: SectionContent;
  createdAt?: string;
}

export interface UpdateResourceCommand {
  resourceId: number;
  courseId: number;
  name?: string;
  attributes?: Record<string, unknown>;
}

export interface Resource {
  createdAt?: string;
  updatedAt?: string;
  version?: number;
  id?: number;
  name?: string;
  courseId?: number;
  resourceType?: ResourceType;
}

export interface CreateCourseCommand {
  title: string;
  description?: string;
  semester?: number;
}

export interface CreateCourseSectionCommand {
  courseId: number;
  name: string;
  description?: string;
  order?: number;
  content?: SectionContent;
}

export interface CreateResourceCommand {
  name: string;
  courseId: number;
  resourceType: ResourceType;
  attributes?: Record<string, unknown>;
}

export interface CourseEnrollmentView {
  id?: number;
  courseId?: number;
  userId?: number;
  email?: string;
  status?: EnrollmentStatus;
  activatedAt?: string;
}

export interface EnrollByEmailCommand {
  email: string;
}

export interface UserView {
  id?: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  roles?: UserRole[];
}

export interface AdminUserView {
  id?: number;
  username?: string;
  externalId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  roles?: UserRole[];
}

export interface AdminUserProfileUpdate {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface AdminUserRolesUpdate {
  roles: UserRole[];
}

export interface Pageable {
  page?: number;
  size?: number;
  sort?: string[];
}

export interface PageUserView {
  totalElements?: number;
  totalPages?: number;
  first?: boolean;
  last?: boolean;
  size?: number;
  content?: UserView[];
  number?: number;
  sort?: SortObject;
  numberOfElements?: number;
  pageable?: PageableObject;
  empty?: boolean;
}

export interface PageAdminUserView {
  totalElements?: number;
  totalPages?: number;
  first?: boolean;
  last?: boolean;
  size?: number;
  content?: AdminUserView[];
  number?: number;
  sort?: SortObject;
  numberOfElements?: number;
  pageable?: PageableObject;
  empty?: boolean;
}

export interface PageableObject {
  offset?: number;
  sort?: SortObject;
  paged?: boolean;
  pageNumber?: number;
  pageSize?: number;
  unpaged?: boolean;
}

export interface SortObject {
  empty?: boolean;
  sorted?: boolean;
  unsorted?: boolean;
}

export interface ResourceSummaryView {
  id?: number;
  name?: string;
  resourceType?: ResourceType;
  courseId?: number;
  createdAt?: string;
}

export type ReorderSectionsCommand = Record<string, number>;

export type AddResourcesToSectionCommand = number[];

export interface CreateFileResourceCommand {
  file: Blob;
}

export interface TransferOwnershipRequest {
  newOwnerId: number;
}
