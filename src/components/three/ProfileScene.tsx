import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { SceneCanvas, damp, useDragRotate } from './kit';
import type { ProfilePart } from '../../data/products';

/**
 * Illustrative cut-through of a 70 mm, 5-chamber casement profile with
 * steel reinforcement, EPDM gaskets and a double-glazed unit.
 * Drawn in millimetres, scaled 1:100 (so 70 mm = 0.7 units).
 * Not a manufacturer drawing — proportions are simplified for clarity.
 */
export interface ProfileDrive { explode: number; active: ProfilePart | null }

const OAK = new THREE.Color('#b08754');
const ANTHRACITE = new THREE.Color('#2b2d30');
const ACCENT = new THREE.Color('#8CC2BB');
const NO_GLOW = new THREE.Color('#000000');
const S = 0.01;          // mm → scene units
const LEN = 70;          // length of the cut piece (mm)

function rect(p: THREE.Path, x0: number, y0: number, x1: number, y1: number) {
  p.moveTo(x0, y0); p.lineTo(x1, y0); p.lineTo(x1, y1); p.lineTo(x0, y1); p.lineTo(x0, y0);
  return p;
}

function extrude(shape: THREE.Shape, depth = LEN) {
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: 0.4, bevelSize: 0.4, bevelSegments: 1, curveSegments: 8 });
  g.translate(-35, -32, -depth / 2); // centre the 70 × 64 body
  g.scale(S, S, S);
  return g;
}

function buildParts() {
  // Body 70 × 64 with five chambers
  const body = rect(new THREE.Shape(), 0, 0, 70, 64) as THREE.Shape;
  [[4, 4, 17, 36], [21, 4, 49, 36], [53, 4, 66, 36], [4, 40, 31, 60], [35, 40, 66, 60]]
    .forEach(([a, b, c, d]) => body.holes.push(rect(new THREE.Path(), a, b, c, d)));

  // Steel U-channel inside the central chamber
  const steel = new THREE.Shape();
  steel.moveTo(23, 6); steel.lineTo(47, 6); steel.lineTo(47, 34); steel.lineTo(44.5, 34); steel.lineTo(44.5, 8.5);
  steel.lineTo(25.5, 8.5); steel.lineTo(25.5, 34); steel.lineTo(23, 34); steel.lineTo(23, 6);

  // Gaskets either side of the glass, sitting on top of the profile
  const gasketA = rect(new THREE.Shape(), 14, 64, 19, 74) as THREE.Shape;
  const gasketB = rect(new THREE.Shape(), 51, 64, 56, 74) as THREE.Shape;

  // Double-glazed unit: two 6 mm panes, 20 mm argon gap, aluminium spacer
  const paneA = rect(new THREE.Shape(), 19.5, 64, 25.5, 150) as THREE.Shape;
  const paneB = rect(new THREE.Shape(), 45, 64, 51, 150) as THREE.Shape;
  const spacer = rect(new THREE.Shape(), 25.5, 64.5, 45, 72) as THREE.Shape;

  return {
    body: extrude(body), steel: extrude(steel, LEN - 6),
    gasketA: extrude(gasketA), gasketB: extrude(gasketB),
    paneA: extrude(paneA), paneB: extrude(paneB), spacer: extrude(spacer),
  };
}

type PartKey = 'body' | 'steel' | 'gasketA' | 'gasketB' | 'paneA' | 'paneB' | 'spacer';

const PART_GROUP: Record<PartKey, ProfilePart> = {
  body: 'chambers', steel: 'steel', gasketA: 'gaskets', gasketB: 'gaskets',
  paneA: 'glass', paneB: 'glass', spacer: 'glass',
};

/** Exploded offsets (scene units) per part at explode = 1 */
const EXPLODE: Record<PartKey, [number, number, number]> = {
  body: [0, 0, 0],
  steel: [0, 0, -0.75],
  gasketA: [-0.24, 0.3, 0],
  gasketB: [0.24, 0.3, 0],
  paneA: [-0.34, 0.5, 0],
  paneB: [0.34, 0.5, 0],
  spacer: [0, 0.4, 0],
};

function Profile({ drive, target }: { drive: React.MutableRefObject<ProfileDrive>; target: React.MutableRefObject<number> }) {
  const parts = useMemo(buildParts, []);
  useEffect(() => () => Object.values(parts).forEach(g => g.dispose()), [parts]);

  const mats = useMemo(() => {
    // ExtrudeGeometry groups: 0 = cut faces (caps), 1 = sides
    const cutFace = new THREE.MeshStandardMaterial({ color: '#eceeec', roughness: 0.55 });
    const laminate = new THREE.MeshPhysicalMaterial({ color: '#2b2d30', roughness: 0.55, clearcoat: 0.15, envMapIntensity: 0.6 });
    const steel = new THREE.MeshStandardMaterial({ color: '#9aa3a3', metalness: 0.95, roughness: 0.32 });
    const gasket = new THREE.MeshStandardMaterial({ color: '#16181a', roughness: 0.8 });
    const glass = new THREE.MeshPhysicalMaterial({ color: '#cfe7e1', roughness: 0.04, transmission: 0.92, thickness: 0.06, ior: 1.5, transparent: true });
    const spacer = new THREE.MeshStandardMaterial({ color: '#c9cfcd', metalness: 0.85, roughness: 0.3 });
    return { cutFace, laminate, steel, gasket, glass, spacer };
  }, []);
  useEffect(() => () => Object.values(mats).forEach(m => m.dispose()), [mats]);

  const materialFor = (k: PartKey): THREE.Material | THREE.Material[] => {
    if (k === 'body') return [mats.cutFace, mats.laminate];
    if (k === 'steel') return mats.steel;
    if (k === 'gasketA' || k === 'gasketB') return mats.gasket;
    if (k === 'spacer') return mats.spacer;
    return mats.glass;
  };

  const refs = useRef<Partial<Record<PartKey, THREE.Mesh>>>({});
  const root = useRef<THREE.Group>(null);
  const t = useRef(0);

  useFrame((state, dt) => {
    const { explode, active } = drive.current;
    t.current += dt;
    (Object.keys(EXPLODE) as PartKey[]).forEach(k => {
      const m = refs.current[k];
      if (!m) return;
      const [x, y, z] = EXPLODE[k];
      m.position.x = damp(m.position.x, x * explode, 5, dt);
      m.position.y = damp(m.position.y, y * explode, 5, dt);
      m.position.z = damp(m.position.z, z * explode, 5, dt);
      // Highlight: the active group stays solid, others recede
      const on = !active || PART_GROUP[k] === active || (active === 'surface' && k === 'body');
      const s = on ? 1 : 0.94;
      m.scale.setScalar(damp(m.scale.x, s, 6, dt));
      const mm = Array.isArray(m.material) ? m.material : [m.material];
      mm.forEach(mat => {
        const std = mat as THREE.MeshStandardMaterial;
        const targetOpacity = on ? (k.startsWith('pane') ? 0.9 : 1) : 0.14;
        std.transparent = true;
        std.opacity = damp(std.opacity, targetOpacity, 6, dt);
        std.depthWrite = std.opacity > 0.6;
        // soft accent glow on the highlighted part (skip the white cut face)
        if (std.emissive && mat !== mats.cutFace) {
          std.emissive.lerp(on && active ? ACCENT : NO_GLOW, 1 - Math.exp(-5 * dt));
          std.emissiveIntensity = 0.22;
        }
      });
    });
    // Surface highlight: show the oak laminate on the body sides
    mats.laminate.color.lerp(drive.current.active === 'surface' ? OAK : ANTHRACITE, 1 - Math.exp(-4 * dt));
    if (root.current) {
      root.current.rotation.y = damp(root.current.rotation.y, -0.62 + target.current + Math.sin(t.current * 0.3) * 0.04, 4, dt);
    }
    state.camera.lookAt(0, 0.32, 0);
  });

  return (
    <group ref={root} rotation={[0.18, -0.62, 0]}>
      {(Object.keys(parts) as PartKey[]).map(k => (
        <mesh
          key={k}
          ref={(m) => { if (m) refs.current[k] = m; }}
          geometry={parts[k]}
          material={materialFor(k)}
        />
      ))}
    </group>
  );
}

export default function ProfileScene({ drive }: { drive: React.MutableRefObject<ProfileDrive> }) {
  const drag = useDragRotate(0.9);
  return (
    <SceneCanvas camera={{ position: [0, 0.9, 4.4], fov: 30 }} envIntensity={0.8} onPointerDown={drag.onPointerDown}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[2, 3, 4]} intensity={1.4} />
      <directionalLight position={[-3, 1, -2]} intensity={0.5} color="#8CC2BB" />
      <Profile drive={drive} target={drag.target} />
    </SceneCanvas>
  );
}
