import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card } from 'primeng/card';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-student-profile-page',
  imports: [Card, PageHeader, EmptyState],
  templateUrl: './student-profile-page.html',
  styleUrl: './student-profile-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentProfilePage {}
