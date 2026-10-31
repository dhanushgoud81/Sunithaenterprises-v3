import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { SceneCanvas, damp, useDragRotate } from './kit';
import { WindowModel } from './WindowModel';
import { layoutFor } from './geometry';
import type { WindowKind } from '../../data/products';

/** Loads lamination textures on demand and caches them for the session. */
const texCache = new Map<string, THREE.Texture>();
function useLamination(url?: string | null) {
  const [tex, setTex] = useState<THREE.Texture | null>(url ? texCache.get(url) ?? null : null);
  useEffect(() => {
    if (!url) { setTex(null); return; }
    const hit = texCache.get(url);
    if (hit) { setTex(hit); return; }
    let live = true;
    new THREE.TextureLoader().load(url, t => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(1.6, 1.6);
      t.anisotropy = 4;
      texCache.set(url, t);
      if (live) setTex(t);
    });
    return () => { live = false; };
  }, [url]);
  return tex;
}

interface ShowcaseProps {
  kind: WindowKind;
  /** lamination texture for the frame (finish preview) */
  textureUrl?: string | null;
  /** loop an opening demonstration */
  demo?: boolean;
  /** static open amount when not demoing */
  openAmount?: number;
  idleSpin?: boolean;
}

function Showcase({ kind, textureUrl, demo = true, openAmount = 0, idleSpin = false, target }: ShowcaseProps & { target: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const open = useRef(0);
  const [shown, setShown] = useState(kind);
  const phase = useRef<'in' | 'out' | 'idle'>('in');
  const clock = useRef(0);
  const map = useLamination(textureUrl);
  const { camera, size } = useThree();

  // Fit the camera to the window's size so every type fills the stage similarly.
  const L = useMemo(() => layoutFor(shown), [shown]);
  const fitZ = useMemo(() => {
    const aspect = size.width / Math.max(1, size.height);
    const fov = THREE.MathUtils.degToRad((camera as THREE.PerspectiveCamera).fov);
    const needH = L.h * 1.6;
    const needW = (L.w * 1.65) / aspect;
    return Math.max(needH, needW) / (2 * Math.tan(fov / 2));
  }, [L, size, camera]);

  useEffect(() => {
    if (kind !== shown) phase.current = 'out';
  }, [kind, shown]);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    clock.current += dt;

    // "Turn" morph: the old type rotates away, the new one rotates in.
    if (phase.current === 'out') {
      g.rotation.y = damp(g.rotation.y, Math.PI / 2, 9, dt);
      g.scale.setScalar(damp(g.scale.x, 0.86, 9, dt));
      open.current = damp(open.current, 0, 10, dt);
      if (g.rotation.y > Math.PI / 2 - 0.06) {
        setShown(kind);
        g.rotation.y = -Math.PI / 2;
        phase.current = 'in';
        clock.current = 0;
      }
    } else {
      const spin = idleSpin ? Math.sin(clock.current * 0.35) * 0.32 : -0.28;
      g.rotation.y = damp(g.rotation.y, spin + target.current, phase.current === 'in' ? 6 : 3, dt);
      g.scale.setScalar(damp(g.scale.x, 1, 6, dt));
      if (Math.abs(g.rotation.y - (spin + target.current)) < 0.05) phase.current = 'idle';

      if (demo) {
        // pause closed → open → hold → close, 6 s cycle
        const c = (clock.current % 6) / 6;
        const o = c < 0.15 ? 0 : c < 0.45 ? (c - 0.15) / 0.3 : c < 0.7 ? 1 : c < 0.95 ? 1 - (c - 0.7) / 0.25 : 0;
        open.current = damp(open.current, o, 5, dt);
      } else {
        open.current = damp(open.current, openAmount, 5, dt);
      }
    }
    camera.position.z = damp(camera.position.z, fitZ, 4, dt);
    camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={group} rotation={[0, -Math.PI / 2, 0]} scale={0.86}>
      {/* nothing sits behind the window here, so reflective glass reads better than transmission */}
      <WindowModel kind={shown} open={open} frameMap={map} liteGlass />
    </group>
  );
}

export default function ShowcaseScene(props: ShowcaseProps & { tone?: 'dark' | 'light' }) {
  const drag = useDragRotate(1.2);
  return (
    <SceneCanvas
      camera={{ position: [0.35, 0.18, 5], fov: 30 }}
      envIntensity={props.tone === 'light' ? 1.1 : 0.75}
      onPointerDown={drag.onPointerDown}
      className="cursor-grab"
    >
      <ambientLight intensity={props.tone === 'light' ? 0.6 : 0.2} />
      <directionalLight position={[3, 4, 5]} intensity={1.3} />
      <directionalLight position={[-4, 1, -3]} intensity={0.6} color="#8CC2BB" />
      <Showcase {...props} target={drag.target} />
    </SceneCanvas>
  );
}
