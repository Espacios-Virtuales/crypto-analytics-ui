import { Component, ElementRef, HostListener, ViewChild, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CryptoRevealDirective } from '../../shared/directives/crypto-reveal.directive';

@Component({
  selector: 'app-public-landing',
  standalone: true,
  imports: [RouterLink, CryptoRevealDirective],
  templateUrl: './public-landing.component.html',
  styleUrl: './public-landing.component.scss',
})
export class PublicLandingComponent {
  @ViewChild('mobileMenuToggle') private mobileMenuToggle?: ElementRef<HTMLButtonElement>;
  @ViewChild('mobileNav') private mobileNav?: ElementRef<HTMLElement>;

  readonly mobileMenuOpen = signal(false);

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(open => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  navigateToSection(sectionId: string): void {
    this.closeMobileMenu();

    setTimeout(() => {
      document.getElementById(sectionId)?.focus({ preventScroll: true });
    });
  }

  @HostListener('document:keydown.escape')
  closeMobileMenuWithEscape(): void {
    if (!this.mobileMenuOpen()) return;

    this.closeMobileMenu();
    this.mobileMenuToggle?.nativeElement.focus();
  }

  @HostListener('document:click', ['$event'])
  closeMobileMenuFromOutside(event: MouseEvent): void {
    if (!this.mobileMenuOpen()) return;

    const target = event.target as Node | null;
    const clickedToggle = target && this.mobileMenuToggle?.nativeElement.contains(target);
    const clickedMenu = target && this.mobileNav?.nativeElement.contains(target);

    if (!clickedToggle && !clickedMenu) this.closeMobileMenu();
  }

  @HostListener('window:resize')
  closeMobileMenuOnDesktop(): void {
    if (window.innerWidth >= 768) this.closeMobileMenu();
  }
}
