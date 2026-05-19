import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AppShell } from './app-shell';

class RouterStub {
  url = '/';
  readonly events = new Subject<unknown>();
}

@Component({
  selector: 'app-top-nav',
  template: '',
})
class TopNavStub {}

describe('AppShell', () => {
  let routerStub: RouterStub;

  beforeEach(async () => {
    routerStub = new RouterStub();

    await TestBed.configureTestingModule({
      imports: [AppShell],
      providers: [{ provide: Router, useValue: routerStub }],
    })
      .overrideComponent(AppShell, {
        set: {
          imports: [TopNavStub],
          template: `
            @if (showTopNav()) {
              <app-top-nav />
            }
          `,
        },
      })
      .compileComponents();
  });

  it('shows top navigation for non-admin routes', () => {
    routerStub.url = '/courses';

    const fixture = TestBed.createComponent(AppShell);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('app-top-nav'))).not.toBeNull();
  });

  it('hides top navigation for admin routes', () => {
    routerStub.url = '/admin';

    const fixture = TestBed.createComponent(AppShell);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('app-top-nav'))).toBeNull();
  });

  it('reacts to route changes and hides top navigation on admin route', () => {
    routerStub.url = '/';

    const fixture = TestBed.createComponent(AppShell);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('app-top-nav'))).not.toBeNull();

    routerStub.events.next(new NavigationEnd(1, '/admin', '/admin'));
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('app-top-nav'))).toBeNull();
  });
});
