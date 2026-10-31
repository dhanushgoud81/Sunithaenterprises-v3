import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { WindowKind } from '../../data/products';
import {
  FRAME_D, FRAME_W, SASH_D, SASH_W,
  boxGeometry, glassGeometry, layoutFor, ringGeometry, type Pane,
} from './geometry';

// ─── Materials ───────────────────────────────────────────────────────────────
export function useFrameMaterial(color = '#2B2D30', map?: THREE.Texture | null) {
  const mat = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color, roughness: 0.42, metalness: 0, clearcoat: 0.35, clearcoatRoughness: 0.45 }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  useEffect(() => {
    mat.map = map ?? null;
    mat.color.set(map ? '#ffffff' : color);
    mat.needsUpdate = true;
  }, [mat, color, map]);
  useEffect(() => () => mat.dispose(), [mat]);
  return mat;
}

/** Physically-based glass. `lite` swaps transmission for cheap transparency (mobile). */
export function useGlassMaterial(lite: boolean) {
  const mat = useMemo(() => {
    if (lite) {
      return new THREE.MeshPhysicalMaterial({
        color: '#cfe4df', roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.22,
        envMapIntensity: 1.4, side: THREE.DoubleSide, depthWrite: false,
      });
    }
    return new THREE.MeshPhysicalMaterial({
      color: '#e4f1ee', roughness: 0.03, metalness: 0, transmission: 1, thickness: 0.024, ior: 1.5,
      envMapIntensity: 1.2, side: THREE.DoubleSide, attenuationColor: new THREE.Color('#9fd0c6'), attenuationDistance: 0.6,
    });
  }, [lite]);
  useEffect(() => () => mat.dispose(), [mat]);
  return mat;
}

function useShared() {
  const gasket = useMemo(() => new THREE.MeshStandardMaterial({ color: '#0b0c0d', roughness: 0.9 }), []);
  const metal = useMemo(() => new THREE.MeshStandardMaterial({ color: '#b9c0bd', roughness: 0.3, metalness: 0.9 }), []);
  useEffect(() => () => { gasket.dispose(); metal.dispose(); }, [gasket, metal]);
  return { gasket, metal };
}

/** Dispose a set of geometries when they change or unmount. */
function useDisposable<T extends THREE.BufferGeometry[]>(make: () => T, deps: React.DependencyList): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const geos = useMemo(make, deps);
  useEffect(() => () => geos.forEach(g => g.dispose()), [geos]);
  return geos;
}

// ─── Sash (opening pane) ─────────────────────────────────────────────────────
interface SashProps {
  pane: Pane;
  open: React.MutableRefObject<number>;
  frameMat: THREE.Material;
  glassMat: THREE.Material;
}

const smooth = (x: number) => x * x * (3 - 2 * x);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

function Sash({ pane, open, frameMat, glassMat }: SashProps) {
  const { gasket, metal } = useShared();
  const pivot = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const { w, h, mode } = pane;
  const [ring, gasketRing, glass, handle, grillV, grillH] = useDisposable(() => [
    ringGeometry(w, h, SASH_W, SASH_D),
    ringGeometry(w - 2 * SASH_W + 0.012, h - 2 * SASH_W + 0.012, 0.01, 0.012),
    glassGeometry(w - 2 * SASH_W, h - 2 * SASH_W),
    boxGeometry(0.018, 0.13, 0.03),
    boxGeometry(0.016, h - 2 * SASH_W, 0.012),
    boxGeometry(w - 2 * SASH_W, 0.016, 0.012),
  ], [w, h]);

  // Pivot placement: hinge side for casements, bottom edge for tilt.
  const hingeX = mode === 'hingeL' || mode === 'tiltTurn' ? -w / 2 : mode === 'hingeR' ? w / 2 : 0;
  const handleX = mode === 'hingeR' ? -w / 2 + SASH_W / 2 : w / 2 - SASH_W / 2;

  useFrame(() => {
    const g = pivot.current;
    if (!g) return;
    const o = clamp01(open.current);
    if (mode === 'hingeL') g.rotation.y = -smooth(o) * 1.15;
    else if (mode === 'hingeR') g.rotation.y = smooth(o) * 1.15;
    else if (mode === 'slide') g.position.x = pane.x - smooth(o) * (w * 0.82);
    else if (mode === 'tiltTurn') {
      // 0 → 0.4: tilt in at the top · 0.4 → 0.55: back · 0.55 → 1: turn on the side hinge
      const tilt = o < 0.4 ? smooth(o / 0.4) : o < 0.55 ? 1 - smooth((o - 0.4) / 0.15) : 0;
      const turn = o > 0.55 ? smooth((o - 0.55) / 0.45) : 0;
      if (inner.current) inner.current.rotation.x = -tilt * 0.3;
      g.rotation.y = -turn * 1.1;
    }
  });

  const content = (
    <>
      <mesh geometry={ring} material={frameMat} castShadow />
      <mesh geometry={gasketRing} material={gasket} />
      <mesh geometry={glass} material={glassMat} />
      {pane.grill && (
        <>
          <mesh geometry={grillV} material={frameMat} position={[0, 0, 0.012]} />
          <mesh geometry={grillH} material={frameMat} position={[0, h * 0.12, 0.012]} />
        </>
      )}
      {mode !== 'fixed' && (
        <mesh geometry={handle} material={metal} position={[handleX, 0, SASH_D / 2 + 0.02]} />
      )}
    </>
  );

  const z = pane.z ?? 0;
  if (mode === 'slide' || mode === 'fixed') {
    return <group ref={pivot} position={[pane.x, pane.y, z]}>{content}</group>;
  }
  return (
    <group ref={pivot} position={[pane.x + hingeX, pane.y, z]}>
      {/* tilt pivots on the bottom edge, inside the side-hinge pivot */}
      <group ref={inner} position={[-hingeX, -h / 2, 0]}>
        <group position={[0, h / 2, 0]}>{content}</group>
      </group>
    </group>
  );
}

// ─── Whole window ────────────────────────────────────────────────────────────
export interface WindowModelProps {
  kind: WindowKind;
  open: React.MutableRefObject<number>;
  frameMap?: THREE.Texture | null;
  frameColor?: string;
  liteGlass?: boolean;
}

export function WindowModel({ kind, open, frameMap, frameColor, liteGlass = false }: WindowModelProps) {
  const L = useMemo(() => layoutFor(kind), [kind]);
  const frameMat = useFrameMaterial(frameColor, frameMap);
  const glassMat = useGlassMaterial(liteGlass);
  const { gasket } = useShared();

  const geos = useDisposable(() => {
    const list: THREE.BufferGeometry[] = [ringGeometry(L.w, L.h, FRAME_W, FRAME_D, !!L.arch)];
    L.bars.forEach(b => list.push(boxGeometry(b.w, b.h, FRAME_D * 0.9)));
    L.fixedGlass?.forEach(f => list.push(glassGeometry(f.w, f.h)));
    if (L.fanlight) list.push(glassGeometry(L.fanlight.w, 0, true));
    // sliding track rails
    if (kind === 'sliding') list.push(boxGeometry(L.w - 2 * FRAME_W, 0.012, FRAME_D * 0.8));
    return list;
  }, [L, kind]);

  let gi = 1;
  return (
    <group>
      <mesh geometry={geos[0]} material={frameMat} castShadow receiveShadow />
      {L.bars.map((b, i) => (
        <mesh key={`b${i}`} geometry={geos[gi++]} material={frameMat} position={[b.x, b.y, 0]} />
      ))}
      {L.fixedGlass?.map((f, i) => (
        <mesh key={`f${i}`} geometry={geos[gi++]} material={glassMat} position={[f.x, f.y, -0.01]} />
      ))}
      {L.fanlight && <mesh geometry={geos[gi++]} material={glassMat} position={[0, L.fanlight.y, -0.01]} />}
      {kind === 'sliding' && (
        <mesh geometry={geos[gi++]} material={gasket} position={[0, -L.h / 2 + FRAME_W + 0.006, 0]} />
      )}
      {L.panes.map((p, i) => (
        <Sash key={`${kind}-${i}`} pane={p} open={open} frameMat={frameMat} glassMat={glassMat} />
      ))}
    </group>
  );
}
