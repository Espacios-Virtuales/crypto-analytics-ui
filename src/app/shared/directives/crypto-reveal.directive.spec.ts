import { ElementRef, NgZone } from '@angular/core';
import { CryptoRevealDirective } from './crypto-reveal.directive';

class IntersectionObserverStub {
  static instances: IntersectionObserverStub[] = [];

  readonly disconnect = jasmine.createSpy('disconnect');
  readonly observe = jasmine.createSpy('observe');
  readonly options?: IntersectionObserverInit;

  constructor(
    private readonly callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {
    this.options = options;
    IntersectionObserverStub.instances.push(this);
  }

  emit(isIntersecting: boolean): void {
    this.callback(
      [{ isIntersecting } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

describe('CryptoRevealDirective', () => {
  const originalIntersectionObserver = Object.getOwnPropertyDescriptor(
    window,
    'IntersectionObserver',
  );
  const originalMatchMedia = Object.getOwnPropertyDescriptor(window, 'matchMedia');

  let node: HTMLElement;
  let runOutsideAngular: jasmine.Spy;
  let zone: NgZone;

  beforeEach(() => {
    IntersectionObserverStub.instances = [];
    node = document.createElement('div');
    runOutsideAngular = jasmine.createSpy('runOutsideAngular').and.callFake(callback => callback());
    zone = { runOutsideAngular } as unknown as NgZone;

    setMatchMedia(false);
    setIntersectionObserver(IntersectionObserverStub);
  });

  afterEach(() => {
    restoreWindowProperty('IntersectionObserver', originalIntersectionObserver);
    restoreWindowProperty('matchMedia', originalMatchMedia);
  });

  it('observes once outside Angular with the approved threshold', () => {
    const directive = createDirective();

    directive.ngAfterViewInit();

    const observer = IntersectionObserverStub.instances[0];
    expect(node.getAttribute('data-crypto-reveal')).toBe('fade-up');
    expect(runOutsideAngular).toHaveBeenCalledTimes(1);
    expect(IntersectionObserverStub.instances.length).toBe(1);
    expect(observer.options).toEqual({ threshold: 0.12 });
    expect(observer.observe).toHaveBeenCalledOnceWith(node);
    expect(node.classList.contains('crypto-revealed')).toBeFalse();
  });

  it('reveals and disconnects only after the element intersects', () => {
    const directive = createDirective();
    directive.ngAfterViewInit();
    const observer = IntersectionObserverStub.instances[0];

    observer.emit(false);
    expect(node.classList.contains('crypto-revealed')).toBeFalse();
    expect(observer.disconnect).not.toHaveBeenCalled();

    observer.emit(true);
    expect(node.classList.contains('crypto-revealed')).toBeTrue();
    expect(observer.disconnect).toHaveBeenCalledTimes(1);
  });

  it('disconnects an active observer when the directive is destroyed', () => {
    const directive = createDirective();
    directive.ngAfterViewInit();
    const observer = IntersectionObserverStub.instances[0];

    directive.ngOnDestroy();

    expect(observer.disconnect).toHaveBeenCalledTimes(1);
  });

  it('reveals immediately without creating an observer for reduced motion', () => {
    setMatchMedia(true);
    const directive = createDirective();

    directive.ngAfterViewInit();

    expect(node.classList.contains('crypto-revealed')).toBeTrue();
    expect(IntersectionObserverStub.instances.length).toBe(0);
    expect(runOutsideAngular).not.toHaveBeenCalled();
  });

  it('reveals immediately when IntersectionObserver is unavailable', () => {
    Reflect.deleteProperty(window, 'IntersectionObserver');
    const directive = createDirective();

    directive.ngAfterViewInit();

    expect(node.classList.contains('crypto-revealed')).toBeTrue();
    expect(runOutsideAngular).not.toHaveBeenCalled();
  });

  it('reveals immediately during server-side rendering without browser APIs', () => {
    const matchMedia = window.matchMedia as jasmine.Spy;
    const directive = createDirective('server' as unknown as object);

    directive.ngAfterViewInit();

    expect(node.classList.contains('crypto-revealed')).toBeTrue();
    expect(matchMedia).not.toHaveBeenCalled();
    expect(IntersectionObserverStub.instances.length).toBe(0);
  });

  function createDirective(
    platformId: object = 'browser' as unknown as object,
  ): CryptoRevealDirective {
    return new CryptoRevealDirective(new ElementRef(node), zone, platformId);
  }

  function setIntersectionObserver(value: typeof IntersectionObserverStub): void {
    Object.defineProperty(window, 'IntersectionObserver', {
      configurable: true,
      writable: true,
      value,
    });
  }

  function setMatchMedia(reducedMotion: boolean): void {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: jasmine.createSpy('matchMedia').and.returnValue({ matches: reducedMotion }),
    });
  }

  function restoreWindowProperty(
    property: 'IntersectionObserver' | 'matchMedia',
    descriptor: PropertyDescriptor | undefined,
  ): void {
    if (descriptor) Object.defineProperty(window, property, descriptor);
    else Reflect.deleteProperty(window, property);
  }
});
