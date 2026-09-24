import { AfterViewInit, Directive, ElementRef, Inject, NgZone, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/** A dependency-free, reduced-motion-safe reveal primitive for marketing content. */
@Directive({ selector: '[cryptoReveal]', standalone: true })
export class CryptoRevealDirective implements AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;

  constructor(
    private readonly element: ElementRef<HTMLElement>,
    private readonly zone: NgZone,
    @Inject(PLATFORM_ID) private readonly platformId: object,
  ) {}

  ngAfterViewInit(): void {
    const node = this.element.nativeElement;
    node.setAttribute('data-crypto-reveal', 'fade-up');
    if (!isPlatformBrowser(this.platformId) || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      node.classList.add('crypto-revealed');
      return;
    }
    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          node.classList.add('crypto-revealed');
          this.observer?.disconnect();
        }
      }, { threshold: 0.12 });
      this.observer.observe(node);
    });
  }

  ngOnDestroy(): void { this.observer?.disconnect(); }
}
