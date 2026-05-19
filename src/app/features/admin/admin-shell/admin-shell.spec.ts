import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import type { AuthUser } from '../../../core/auth/auth.models';
import { AuthService } from '../../../core/auth/auth.service';
import { AdminShell } from './admin-shell';

describe('AdminShell', () => {
  const currentUser = signal<AuthUser | null>(null);
  const logoutMock = vi.fn<() => Promise<void>>();

  beforeEach(async () => {
    currentUser.set({
      id: 'admin-1',
      username: 'admin',
      displayName: 'Admin User',
      roles: ['admin'],
    });
    logoutMock.mockReset();
    logoutMock.mockResolvedValue();

    await TestBed.configureTestingModule({
      imports: [AdminShell],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            currentUser,
            logout: logoutMock,
          },
        },
      ],
    }).compileComponents();
  });

  it('shows user menu with logout inside the admin sidebar', () => {
    const fixture = TestBed.createComponent(AdminShell);
    fixture.detectChanges();

    const sidebar = fixture.debugElement.query(By.css('aside[data-testid="admin-sidebar"]'));
    expect(sidebar).not.toBeNull();
    expect(sidebar.nativeElement.textContent).toContain('Signed in as');
    expect(sidebar.nativeElement.textContent).toContain('Admin User');
    expect(sidebar.query(By.css('p-button'))).not.toBeNull();
  });

  it('calls logout when the sidebar logout button is clicked', () => {
    const fixture = TestBed.createComponent(AdminShell);
    fixture.detectChanges();

    const logoutButton = fixture.debugElement.query(
      By.css('aside[data-testid="admin-sidebar"] p-button'),
    );
    logoutButton.triggerEventHandler('onClick');

    expect(logoutMock).toHaveBeenCalledTimes(1);
  });
});
