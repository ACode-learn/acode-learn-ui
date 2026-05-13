import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card } from 'primeng/card';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-student-home-page',
  imports: [Card, PageHeader, EmptyState],
  templateUrl: './student-home-page.html',
  styleUrl: './student-home-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentHomePage {}
