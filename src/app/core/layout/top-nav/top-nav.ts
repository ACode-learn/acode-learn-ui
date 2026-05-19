import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Menubar } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-top-nav',
  imports: [Menubar, Button, RouterLink],
  templateUrl: './top-nav.html',
  styleUrl: './top-nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopNav {
  private readonly authService = inject(AuthService);

  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly currentUser = this.authService.currentUser;

  readonly menuItems = computed<MenuItem[]>(() => {
    const items: MenuItem[] = [
      { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
      { label: 'Courses', icon: 'pi pi-book', routerLink: '/courses' },
    ];

    if (this.authService.isStudent()) {
      items.push({ label: 'Student', icon: 'pi pi-user', routerLink: '/student' });
    }
    if (this.authService.isInstructor() || this.authService.isAdmin()) {
      items.push({
        label: 'Instructor',
        icon: 'pi pi-briefcase',
        routerLink: '/instructor',
      });
    }
    if (this.authService.isAdmin()) {
      items.push({
        label: 'Admin',
        icon: 'pi pi-shield',
        routerLink: '/admin',
      });
    }

    return items;
  });

  async login(): Promise<void> {
    await this.authService.login();
  }

  async logout(): Promise<void> {
    await this.authService.logout();
  }
}
