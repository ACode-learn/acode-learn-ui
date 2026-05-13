import { Routes } from '@angular/router';

export const RESOURCES_ROUTES: Routes = [
  {
    path: 'view/:id',
    loadComponent: () =>
      import('./resource-viewer-page/resource-viewer-page').then(
        (m) => m.ResourceViewerPage,
      ),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./resource-editor-page/resource-editor-page').then(
        (m) => m.ResourceEditorPage,
      ),
  },
];
