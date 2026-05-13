import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Card } from 'primeng/card';
import { AuthService } from '../../../core/auth/auth.service';
import { PageHeader } from '../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-home-page',
  imports: [Card, PageHeader],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  private readonly authService = inject(AuthService);

  readonly currentUser = this.authService.currentUser;
  readonly isAuthenticated = this.authService.isAuthenticated;
}
