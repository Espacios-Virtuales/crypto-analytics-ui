import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
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
import { AuthFacade } from '../../../core/auth/auth.facade';
import { UserSession } from '../../../core/models/auth.model';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, CommonModule],
  templateUrl: './dashboard-shell.component.html',
})
export class DashboardShellComponent {
  private readonly MOBILE_BREAKPOINT = 992;

  @ViewChild('sidebarToggle') sidebarToggle?: ElementRef<HTMLButtonElement>;
  @ViewChild('sidebar') sidebar?: ElementRef<HTMLElement>;
  @ViewChild('accountButton') accountButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('userDialog') userDialog?: ElementRef<HTMLDialogElement>;

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

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isMobile() && this.isSidebarOpen()) {
      this.closeSidebar(true);
    }
  }

  toggleSidebar() {
    const willOpen = !this.isSidebarOpen();
    this.isSidebarOpen.set(willOpen);
    if (this.isMobile() && willOpen) {
      setTimeout(() => this.sidebar?.nativeElement.querySelector<HTMLElement>('a')?.focus());
    }
  }

  closeSidebar(restoreFocus = false) {
    this.isSidebarOpen.set(false);
    if (restoreFocus) {
      this.sidebarToggle?.nativeElement.focus();
    }
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
    this.userDialog?.nativeElement.showModal();
  }

  closeUserModal() {
    const dialog = this.userDialog?.nativeElement;
    if (dialog?.open) {
      dialog.close();
    }
    this.accountButton?.nativeElement.focus();
  }

  logout() {
    this.authfacade.logout();
  }
}
