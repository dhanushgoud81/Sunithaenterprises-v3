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
  onPointerDown?: React.PointerEventHandler<HTMLDivElement>;
}

export function SceneCanvas({ children, camera, envIntensity = 1, className, onPointerDown }: SceneCanvasProps) {
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
      onPointerDown={onPointerDown}
    >
      <StudioEnv intensity={envIntensity} />
      <Suspense fallback={null}>
        {children}
        <Ready />
      </Suspense>
    </Canvas>
  );
}

/** Pointer-drag rotation (desktop + touch). Returns a target angle ref and handlers. */
export function useDragRotate(limit = Math.PI) {
  const target = useRef(0);
  const dragging = useRef(false);
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    let lastX = e.clientX;
    const el = e.currentTarget;
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - lastX;
      lastX = ev.clientX;
      target.current = Math.max(-limit, Math.min(limit, target.current + dx * 0.008));
    };
    const up = () => {
      dragging.current = false;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    el.style.cursor = 'grabbing';
    window.addEventListener('pointerup', () => { el.style.cursor = ''; }, { once: true });
  };
  return { target, dragging, onPointerDown };
}

export const damp = THREE.MathUtils.damp;
