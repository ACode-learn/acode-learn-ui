import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card } from 'primeng/card';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-instructor-courses-page',
  imports: [Card, PageHeader, EmptyState],
  templateUrl: './instructor-courses-page.html',
  styleUrl: './instructor-courses-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructorCoursesPage {}
