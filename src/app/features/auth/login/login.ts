import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [Button, Card],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly activatedRoute = inject(ActivatedRoute);

  async login(): Promise<void> {
    await this.authService.login(this.resolveRedirectUri());
  }

  private resolveRedirectUri(): string | undefined {
    const returnUrl = this.activatedRoute.snapshot.queryParamMap.get('returnUrl');

    if (!returnUrl) {
      return undefined;
    }

    try {
      const redirectUrl = new URL(returnUrl, window.location.origin);

      if (redirectUrl.origin !== window.location.origin) {
        return undefined;
      }

      if (redirectUrl.pathname === '/' && !redirectUrl.search && !redirectUrl.hash) {
        return undefined;
      }

      return redirectUrl.toString();
    } catch {
      return undefined;
    }
  }
}
