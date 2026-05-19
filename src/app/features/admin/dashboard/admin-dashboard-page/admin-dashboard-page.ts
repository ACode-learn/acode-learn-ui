import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { PageHeader } from '../../../../shared/components/page-header/page-header';

interface AdminMetric {
  readonly label: string;
  readonly value: string;
  readonly description: string;
  readonly icon: string;
}

interface AdminModule {
  readonly label: string;
  readonly icon: string;
}

@Component({
  selector: 'app-admin-dashboard-page',
  imports: [PageHeader, Card, Button],
  templateUrl: './admin-dashboard-page.html',
  styleUrl: './admin-dashboard-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardPage {
  readonly metrics = signal<readonly AdminMetric[]>([
    {
      label: 'Total users',
      value: '--',
      description: 'Students, instructors, and admins in the platform.',
      icon: 'pi pi-users',
    },
    {
      label: 'Total courses',
      value: '--',
      description: 'All published and draft courses.',
      icon: 'pi pi-book',
    },
    {
      label: 'Pending enrollments',
      value: '--',
      description: 'Requests that still require attention.',
      icon: 'pi pi-clock',
    },
    {
      label: 'Recent activity',
      value: '--',
      description: 'Latest administrative operations and updates.',
      icon: 'pi pi-history',
    },
  ]);

  readonly upcomingModules = signal<readonly AdminModule[]>([
    { label: 'Users', icon: 'pi pi-users' },
    { label: 'Courses', icon: 'pi pi-book' },
    { label: 'Resources', icon: 'pi pi-folder' },
    { label: 'Enrollments', icon: 'pi pi-id-card' },
    { label: 'Audit log', icon: 'pi pi-history' },
  ]);
}
