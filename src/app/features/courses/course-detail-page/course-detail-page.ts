import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card } from 'primeng/card';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-course-detail-page',
  imports: [Card, PageHeader, EmptyState],
  templateUrl: './course-detail-page.html',
  styleUrl: './course-detail-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseDetailPage {}
