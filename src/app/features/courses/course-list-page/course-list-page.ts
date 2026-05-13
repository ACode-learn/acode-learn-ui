import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card } from 'primeng/card';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-course-list-page',
  imports: [Card, PageHeader, EmptyState],
  templateUrl: './course-list-page.html',
  styleUrl: './course-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseListPage {}
