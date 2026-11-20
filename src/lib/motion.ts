import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import barba from '@barba/core';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;
let initialized = false;

/**
 * Initializes Lenis smooth scrolling, syncs it with GSAP ScrollTrigger,
 * and configures Barba.js page transitions. Safe to call once on page load.
 */
export function initMotion(): void {
  if (typeof window === 'undefined' || initialized) return;
  initialized = true;

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenisInstance.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenisInstance?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  barba.init({
    preventRunning: true,
    transitions: [
      {
        name: 'grace-fade',
        leave(data) {
          return gsap.to(data.current.container, {
            opacity: 0,
            y: -12,
            duration: 0.35,
            ease: 'power2.inOut',
          });
        },
        enter(data) {
          window.scrollTo(0, 0);
          lenisInstance?.scrollTo(0, { immediate: true });
          return gsap.from(data.next.container, {
            opacity: 0,
            y: 12,
            duration: 0.45,
            ease: 'power2.out',
          });
        },
      },
    ],
  });

  barba.hooks.beforeLeave(() => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  });

  barba.hooks.after(() => {
    ScrollTrigger.refresh();
  });
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}
