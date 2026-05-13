import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card } from 'primeng/card';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-instructor-dashboard-page',
  imports: [Card, PageHeader, EmptyState],
  templateUrl: './instructor-dashboard-page.html',
  styleUrl: './instructor-dashboard-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructorDashboardPage {}
