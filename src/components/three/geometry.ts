import * as THREE from 'three';
import type { WindowKind } from '../../data/products';

/** 1 unit = 1 metre. Profiles are modelled at their real depth (60–70 mm). */
export const FRAME_W = 0.07;   // visible frame face
export const FRAME_D = 0.07;   // IDEAL 4000 construction depth
export const SASH_W = 0.062;
export const SASH_D = 0.06;

const BEVEL = { bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 2, curveSegments: 24 };

function rectPath<T extends THREE.Path>(p: T, w: number, h: number): T {
  p.moveTo(-w / 2, -h / 2);
  p.lineTo(w / 2, -h / 2);
  p.lineTo(w / 2, h / 2);
  p.lineTo(-w / 2, h / 2);
  p.lineTo(-w / 2, -h / 2);
  return p;
}

function archPath<T extends THREE.Path>(p: T, w: number, h: number): T {
  const r = w / 2;
  const spring = h / 2 - r;
  p.moveTo(-w / 2, -h / 2);
  p.lineTo(w / 2, -h / 2);
  p.lineTo(w / 2, spring);
  p.absarc(0, spring, r, 0, Math.PI, false);
  p.lineTo(-w / 2, -h / 2);
  return p;
}

/** A hollow rectangular (or arched) frame ring, centred, extruded along Z. */
export function ringGeometry(w: number, h: number, t: number, depth: number, arch = false) {
  const outer = arch ? archPath(new THREE.Shape(), w, h) : rectPath(new THREE.Shape(), w, h);
  const hole = arch
    ? archHolePath(w, h, t)
    : rectPath(new THREE.Path(), w - 2 * t, h - 2 * t);
  outer.holes.push(hole);
  const g = new THREE.ExtrudeGeometry(outer, { depth, ...BEVEL });
  g.translate(0, 0, -depth / 2);
  return g;
}

function archHolePath(w: number, h: number, t: number) {
  // Inner arch keeps the same spring line so the profile width stays constant.
  const r = w / 2 - t;
  const spring = h / 2 - w / 2;
  const p = new THREE.Path();
  p.moveTo(-r, -h / 2 + t);
  p.lineTo(r, -h / 2 + t);
  p.lineTo(r, spring);
  p.absarc(0, spring, r, 0, Math.PI, false);
  p.lineTo(-r, -h / 2 + t);
  return p;
}

/** Flat glass sheet geometry (rectangle or arch top only). */
export function glassGeometry(w: number, h: number, archTop = false) {
  if (!archTop) return new THREE.PlaneGeometry(w, h);
  // Half-disc fanlight
  const s = new THREE.Shape();
  s.moveTo(-w / 2, 0);
  s.absarc(0, 0, w / 2, Math.PI, 0, true);
  s.lineTo(-w / 2, 0);
  return new THREE.ShapeGeometry(s, 48);
}

export function boxGeometry(w: number, h: number, d: number) {
  return new THREE.BoxGeometry(w, h, d);
}

/** Wall with a window-shaped opening (used by the hero to frame the view). */
export function wallWithOpening(wallW: number, wallH: number, w: number, h: number, arch = false) {
  const s = rectPath(new THREE.Shape(), wallW, wallH);
  s.holes.push(arch ? archPath(new THREE.Path(), w, h) : rectPath(new THREE.Path(), w, h));
  return new THREE.ShapeGeometry(s, 32);
}

// ─── Window layouts ──────────────────────────────────────────────────────────
export type PaneMode = 'fixed' | 'slide' | 'hingeL' | 'hingeR' | 'tiltTurn';
export interface Pane { x: number; y: number; w: number; h: number; mode: PaneMode; z?: number; grill?: boolean }
export interface Layout {
  w: number; h: number; arch?: boolean;
  bars: { x: number; y: number; w: number; h: number }[];
  panes: Pane[];
  fanlight?: { y: number; w: number };   // arched fixed glass
  fixedGlass?: { x: number; y: number; w: number; h: number }[];
}

export function layoutFor(kind: WindowKind): Layout {
  const t = FRAME_W;
  switch (kind) {
    case 'sliding': {
      const w = 1.8, h = 1.3, iw = w - 2 * t, ih = h - 2 * t, pw = iw / 2 + 0.04;
      return {
        w, h, bars: [],
        panes: [
          { x: -iw / 4 + 0.02, y: 0, w: pw, h: ih, mode: 'fixed', z: -0.016 },
          { x: iw / 4 - 0.02, y: 0, w: pw, h: ih, mode: 'slide', z: 0.016 },
        ],
      };
    }
    case 'casement': {
      const w = 1.0, h = 1.4;
      return { w, h, bars: [], panes: [{ x: 0, y: 0, w: w - 2 * t, h: h - 2 * t, mode: 'hingeL' }] };
    }
    case 'tilt-turn': {
      const w = 1.0, h = 1.4;
      return { w, h, bars: [], panes: [{ x: 0, y: 0, w: w - 2 * t, h: h - 2 * t, mode: 'tiltTurn' }] };
    }
    case 'villa': {
      const w = 1.5, h = 1.9, iw = w - 2 * t, ih = h - 2 * t;
      return {
        w, h, bars: [],
        panes: [
          { x: -iw / 4, y: 0, w: iw / 2, h: ih, mode: 'hingeL', grill: true },
          { x: iw / 4, y: 0, w: iw / 2, h: ih, mode: 'hingeR', grill: true },
        ],
      };
    }
    case 'combination': {
      const w = 1.8, h = 1.6, iw = w - 2 * t, ih = h - 2 * t;
      const topH = 0.42, botH = ih - topH - t, cw = (iw - 2 * t) / 3;
      const topY = ih / 2 - topH / 2, botY = -ih / 2 + botH / 2;
      return {
        w, h,
        bars: [
          { x: 0, y: ih / 2 - topH - t / 2, w: iw, h: t },
          { x: -cw / 2 - t / 2, y: botY, w: t, h: botH },
          { x: cw / 2 + t / 2, y: botY, w: t, h: botH },
        ],
        fixedGlass: [
          { x: 0, y: topY, w: iw, h: topH },
          { x: 0, y: botY, w: cw, h: botH },
        ],
        panes: [
          { x: -cw - t, y: botY, w: cw, h: botH, mode: 'hingeL' },
          { x: cw + t, y: botY, w: cw, h: botH, mode: 'hingeR' },
        ],
      };
    }
    case 'arch': {
      const w = 1.2, h = 1.8, iw = w - 2 * t;
      const spring = h / 2 - w / 2;                 // where the arc starts
      const botTop = spring - t / 2, botBottom = -h / 2 + t;
      const bh = botTop - botBottom;
      const by = botBottom + bh / 2;
      return {
        w, h, arch: true,
        bars: [{ x: 0, y: spring, w: iw, h: t }],
        fanlight: { y: spring + t / 2, w: iw },
        panes: [
          { x: -iw / 4, y: by, w: iw / 2, h: bh, mode: 'hingeL' },
          { x: iw / 4, y: by, w: iw / 2, h: bh, mode: 'hingeR' },
        ],
      };
    }
  }
}
