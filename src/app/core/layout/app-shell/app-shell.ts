import { toSignal } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { TopNav } from '../top-nav/top-nav';

@Component({
  selector: 'app-app-shell',
  imports: [RouterOutlet, TopNav],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShell {
  private readonly router = inject(Router);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  readonly showTopNav = computed(() => !this.currentUrl().startsWith('/admin'));
}
