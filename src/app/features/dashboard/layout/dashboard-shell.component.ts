import { Component, computed, inject, signal, HostListener } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

import { AuthService } from '../../../core/auth/auth.service';
import { HasRoleDirective } from '../../../core/auth/directives/has-role';
import { AuthFacade } from '../../../core/auth/auth.facade';
import { UserSession } from '../../../core/models/auth.model';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, CommonModule],
  templateUrl: './dashboard-shell.component.html',
  styleUrls: ['./dashboard-shell.component.scss'],
})
export class DashboardShellComponent {
  private readonly MOBILE_BREAKPOINT = 992;

  authfacade = inject(AuthFacade);
  auth = inject(AuthService);
  router = inject(Router);

  isMobile = signal(typeof window !== 'undefined' ? window.innerWidth < this.MOBILE_BREAKPOINT : false);
  isSidebarOpen = signal(typeof window !== 'undefined' ? window.innerWidth >= this.MOBILE_BREAKPOINT : true);

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.isMobile()) {
          this.closeSidebar();
        }
      });
  }

  @HostListener('window:resize')
  onResize() {
    const mobile = window.innerWidth < this.MOBILE_BREAKPOINT;
    this.isMobile.set(mobile);

    if (mobile) {
      this.isSidebarOpen.set(false);
    } else {
      this.isSidebarOpen.set(true);
    }
  }

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }

  closeSidebar() {
    this.isSidebarOpen.set(false);
  }

  session = computed<UserSession | null>(() => this.auth.getSession());
  email = computed(() => this.session()?.email ?? null);
  primaryRole = computed(() => this.session()?.roles?.[0] ?? null);

  connectedAt = computed<Date | null>(() => {
    const s = this.session();
    if (!s) return null;
    return s.loginAt ?? s.refreshExp ?? null;
  });

  formatDate(d: Date | null): string {
    if (!d) return '—';
    try {
      return new Date(d).toLocaleString();
    } catch {
      return '—';
    }
  }

  openUserModal() {
    (document.getElementById('userDlg') as HTMLDialogElement | null)?.showModal();
  }

  closeUserModal() {
    (document.getElementById('userDlg') as HTMLDialogElement | null)?.close();
  }

  logout() {
    this.authfacade.logout();
  }
}