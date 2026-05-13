import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card } from 'primeng/card';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-resource-editor-page',
  imports: [Card, PageHeader, EmptyState],
  templateUrl: './resource-editor-page.html',
  styleUrl: './resource-editor-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceEditorPage {}
