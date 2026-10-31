import React, { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { useStage } from '../Stage3D';
import { isCoarsePointer } from '../../lib/motion';

/** Procedural studio reflections — no HDR file download needed. */
function StudioEnv({ intensity = 1 }: { intensity?: number }) {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const env = pm.fromScene(room, 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = intensity;
    return () => {
      scene.environment = null;
      env.dispose();
      pm.dispose();
      room.traverse(o => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        (m.material as THREE.Material | undefined)?.dispose?.();
      });
    };
  }, [gl, scene, intensity]);
  return null;
}

/** Signals the host stage once everything inside Suspense has loaded. */
function Ready() {
  const { onReady } = useStage();
  const frames = useRef(0);
  useFrame(() => {
    // wait two frames so shaders are compiled before fading in
    if (frames.current++ === 2) onReady();
  });
  return null;
}

interface SceneCanvasProps {
  children: React.ReactNode;
  camera: { position: [number, number, number]; fov?: number };
  envIntensity?: number;
  className?: string;
}

export function SceneCanvas({ children, camera, envIntensity = 1, className }: SceneCanvasProps) {
  const { active } = useStage();
  const coarse = isCoarsePointer();
  return (
    <Canvas
      className={className}
      style={{ touchAction: 'pan-y' }}
      dpr={[1, coarse ? 1.3 : 1.75]}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ fov: camera.fov ?? 30, near: 0.05, far: 60, position: camera.position }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
    >
      <StudioEnv intensity={envIntensity} />
      <Suspense fallback={null}>
        {children}
        <Ready />
      </Suspense>
    </Canvas>
  );
}

export const damp = THREE.MathUtils.damp;
