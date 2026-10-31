import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { SceneCanvas, damp } from './kit';
import { WindowModel } from './WindowModel';
import { layoutFor, wallWithOpening } from './geometry';
import { isCoarsePointer } from '../../lib/motion';

export interface HeroDrive {
  /** 0 → 1 scroll progress through the hero */
  progress: number;
}

const L = layoutFor('villa');

function ViewThrough() {
  const tex = useLoader(THREE.TextureLoader, '/images/upvc-hero-luxury.jpg');
  tex.colorSpace = THREE.SRGBColorSpace;
  return (
    <mesh position={[0, 0.05, -1.6]}>
      <planeGeometry args={[4.6, 4.6]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
}

function Wall() {
  const geo = useMemo(() => wallWithOpening(14, 9, L.w, L.h), []);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <mesh geometry={geo} position={[0, 0, -0.03]} receiveShadow>
      {/* unlit, exactly the page's navy, so the stage has no visible edge */}
      <meshBasicMaterial color="#0B1F33" toneMapped={false} />
    </mesh>
  );
}

function Rig({ drive, wide }: { drive: React.MutableRefObject<HeroDrive>; wide: boolean }) {
  const { camera, pointer } = useThree();
  const open = useRef(0);
  const group = useRef<THREE.Group>(null);
  const look = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dt) => {
    const p = drive.current.progress;
    // Sashes open over the first 70% of the scroll, camera pushes through after.
    open.current = damp(open.current, Math.min(1, p / 0.7) * 0.92, 6, dt);
    const push = THREE.MathUtils.smoothstep(p, 0.25, 1);

    // Window sits right of the headline on wide screens, centred on narrow ones.
    const baseX = wide ? -1.25 : 0;
    const baseY = 0.05;
    const startZ = wide ? 5.4 : 5.2;
    const tx = THREE.MathUtils.lerp(baseX, 0, push) + pointer.x * 0.08 * (1 - push);
    const ty = THREE.MathUtils.lerp(baseY, 0.05, push) + pointer.y * 0.05 * (1 - push);
    const tz = THREE.MathUtils.lerp(startZ, 0.9, push);
    camera.position.x = damp(camera.position.x, tx, 4, dt);
    camera.position.y = damp(camera.position.y, ty, 4, dt);
    camera.position.z = damp(camera.position.z, tz, 4, dt);
    look.set(THREE.MathUtils.lerp(baseX, 0, push), THREE.MathUtils.lerp(baseY - 0.05, 0, push), 0);
    camera.lookAt(look);

    if (group.current) group.current.rotation.y = damp(group.current.rotation.y, -pointer.x * 0.05 * (1 - push), 3, dt);
  });

  return (
    <group ref={group}>
      <WindowModel kind="villa" open={open} liteGlass={isCoarsePointer()} />
    </group>
  );
}

export default function HeroScene({ drive, wide }: { drive: React.MutableRefObject<HeroDrive>; wide: boolean }) {
  return (
    <SceneCanvas camera={{ position: [wide ? -1.25 : 0, 0.05, wide ? 5.4 : 5.2], fov: 30 }} envIntensity={0.55}>
      <ambientLight intensity={0.15} />
      {/* warm evening light spilling through the glass */}
      <pointLight position={[0.3, 0.6, -0.9]} intensity={2.4} distance={4} color="#ffb877" />
      <directionalLight position={[-3, 4, 5]} intensity={0.9} color="#e8f0ee" />
      <Wall />
      <ViewThrough />
      <Rig drive={drive} wide={wide} />
    </SceneCanvas>
  );
}
