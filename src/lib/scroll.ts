import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './motion';

gsap.registerPlugin(ScrollTrigger);

export const NAV_HEIGHT = 72;

let lenis: Lenis | null = null;

/** While a nav-triggered scroll runs, the navbar should stay visible. */
let programmaticUntil = 0;
export const isProgrammaticScroll = () => Date.now() < programmaticUntil;
const markProgrammatic = () => { programmaticUntil = Date.now() + 1800; };
let tick: ((time: number) => void) | null = null;

/** Start Lenis smooth scrolling (skipped when motion is reduced). */
export function startSmoothScroll() {
  if (lenis || prefersReducedMotion()) return;
  lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
}

export function stopSmoothScroll() {
  if (tick) gsap.ticker.remove(tick);
  lenis?.destroy();
  lenis = null;
  tick = null;
}

/** Pause/resume page scrolling, e.g. while a menu or dialog is open. */
export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop(); else lenis?.start();
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}

export function scrollToTop(immediate = false) {
  markProgrammatic();
  if (lenis) { lenis.resize(); lenis.scrollTo(0, { immediate, force: true }); }
  else window.scrollTo({ top: 0, behavior: immediate || prefersReducedMotion() ? 'auto' : 'smooth' });
}

/** Scroll to a section by id, clearing the fixed navbar. Returns false if not found. */
export function scrollToId(id: string, immediate = false): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  markProgrammatic();
  if (lenis) {
    lenis.resize(); // page height may have just changed (route change, lazy content)
    lenis.scrollTo(el, { offset: -NAV_HEIGHT + 1, immediate, force: true });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT + 1;
    window.scrollTo({ top, behavior: immediate || prefersReducedMotion() ? 'auto' : 'smooth' });
  }
  return true;
}
