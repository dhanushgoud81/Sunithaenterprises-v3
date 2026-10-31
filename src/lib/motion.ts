import { useSyncExternalStore } from 'react';

/**
 * Motion preferences: the OS "reduce motion" setting OR the on-site
 * accessibility toggle. Everything that animates asks here first.
 */
const STORAGE_KEY = 'se-a11y';
const EVENT = 'se-motion-change';

type Prefs = { reduceMotion: boolean; largeText: boolean };

function readPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { reduceMotion: false, largeText: false, ...JSON.parse(raw) };
  } catch { /* storage unavailable */ }
  return { reduceMotion: false, largeText: false };
}

let prefs: Prefs = typeof window !== 'undefined' ? readPrefs() : { reduceMotion: false, largeText: false };

const mq = typeof window !== 'undefined' && window.matchMedia
  ? window.matchMedia('(prefers-reduced-motion: reduce)')
  : null;

export function applyPrefsToDocument() {
  const root = document.documentElement;
  root.classList.toggle('reduce-motion', prefs.reduceMotion);
  root.classList.toggle('text-large', prefs.largeText);
}

export function getPrefs(): Prefs { return prefs; }

export function setPref<K extends keyof Prefs>(key: K, value: Prefs[K]) {
  prefs = { ...prefs, [key]: value };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch { /* ignore */ }
  applyPrefsToDocument();
  window.dispatchEvent(new Event(EVENT));
}

export function prefersReducedMotion(): boolean {
  return prefs.reduceMotion || !!mq?.matches;
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  mq?.addEventListener?.('change', cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    mq?.removeEventListener?.('change', cb);
  };
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, prefersReducedMotion, () => false);
}

export function usePrefs(): Prefs {
  return useSyncExternalStore(subscribe, getPrefs, getPrefs);
}

/**
 * Can this device render the 3D scenes well?
 * Falls back to photography on: no WebGL, data-saver, low memory, reduced motion.
 */
let webglCache: boolean | null = null;
export function supportsWebGL(): boolean {
  if (webglCache !== null) return webglCache;
  try {
    const c = document.createElement('canvas');
    webglCache = !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    webglCache = false;
  }
  return webglCache;
}

export function canRender3D(): boolean {
  if (typeof window === 'undefined') return false;
  if (prefersReducedMotion()) return false;
  if (!supportsWebGL()) return false;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (nav.connection?.saveData) return false;
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory < 4) return false;
  return true;
}

export function useCan3D(): boolean {
  const reduced = useReducedMotion();
  return !reduced && canRender3D();
}

export const isCoarsePointer = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches;
