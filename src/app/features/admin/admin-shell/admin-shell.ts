import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Menu } from 'primeng/menu';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-admin-shell',
  imports: [RouterOutlet, Button, Card, Menu],
  templateUrl: './admin-shell.html',
  styleUrl: './admin-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminShell {
  private readonly authService = inject(AuthService);

  readonly currentUser = this.authService.currentUser;

  readonly menuItems = computed<MenuItem[]>(() => [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: '/admin',
    },
    {
      label: 'Users',
      icon: 'pi pi-users',
      disabled: true,
    },
    {
      label: 'Courses',
      icon: 'pi pi-book',
      disabled: true,
    },
    {
      label: 'Resources',
      icon: 'pi pi-folder',
      disabled: true,
    },
    {
      label: 'Enrollments',
      icon: 'pi pi-id-card',
      disabled: true,
    },
    {
      label: 'Audit log',
      icon: 'pi pi-history',
      disabled: true,
    },
  ]);

  async logout(): Promise<void> {
    await this.authService.logout();
  }
}
