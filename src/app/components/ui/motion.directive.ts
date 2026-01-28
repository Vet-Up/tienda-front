import { Directive, ElementRef, Input, OnInit, Renderer2, OnDestroy } from '@angular/core';

interface MotionOptions {
  opacity?: [number, number];
  y?: [number, number];
  x?: [number, number];
  scale?: [number, number];
  duration?: number; // ms
  delay?: number; // ms
  easing?: string;
}

@Directive({
  selector: '[appMotion]'
})
export class MotionDirective implements OnInit, OnDestroy {
  @Input('motion') motionOptions: MotionOptions = {};

  private observer?: IntersectionObserver;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    const el = this.el.nativeElement;
    const opts = this.motionOptions;
    const duration = opts.duration || 500;
    const delay = opts.delay || 0;
    const easing = opts.easing || 'ease';

    // Set initial styles
    if (opts.opacity) {
      this.renderer.setStyle(el, 'opacity', opts.opacity[0]);
    }
    // Compose transform if multiple
    let transforms = [];
    if (opts.x) transforms.push(`translateX(${opts.x[0]}px)`);
    if (opts.y) transforms.push(`translateY(${opts.y[0]}px)`);
    if (opts.scale) transforms.push(`scale(${opts.scale[0]})`);
    if (transforms.length) {
      this.renderer.setStyle(el, 'transform', transforms.join(' '));
    }

    // Use IntersectionObserver to trigger animation when in viewport
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.renderer.setStyle(el, 'transition', `all ${duration}ms ${easing}`);
          if (opts.opacity) {
            this.renderer.setStyle(el, 'opacity', opts.opacity[1]);
          }
          let endTransforms = [];
          if (opts.x) endTransforms.push(`translateX(${opts.x[1]}px)`);
          if (opts.y) endTransforms.push(`translateY(${opts.y[1]}px)`);
          if (opts.scale) endTransforms.push(`scale(${opts.scale[1]})`);
          if (endTransforms.length) {
            this.renderer.setStyle(el, 'transform', endTransforms.join(' '));
          }
          if (this.observer) {
            this.observer.disconnect(); // Only animate once
          }
        }
      });
    }, { threshold: 0.1 });
    this.observer.observe(el);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
