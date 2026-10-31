import React, { Component, createContext, Suspense, useContext, useEffect, useRef, useState } from 'react';
import { useCan3D } from '../lib/motion';
import { cn } from '../lib/utils';

/**
 * Lightweight host for a lazily-loaded 3D scene (Three.js lives in a separate chunk).
 * - Shows `fallback` (a photo) until the scene reports ready, and permanently when
 *   the device can't or shouldn't render 3D (no WebGL, reduced motion, data saver).
 * - Mounts the scene only when near the viewport; pauses rendering off-screen.
 */
type StageState = { active: boolean; onReady: () => void };
const StageCtx = createContext<StageState>({ active: true, onReady: () => {} });
export const useStage = () => useContext(StageCtx);

class SceneBoundary extends Component<{ onError: () => void; children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

interface Stage3DProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** Extra margin to start loading before the stage scrolls into view */
  preload?: string;
}

export function Stage3D({ fallback, children, className, preload = '300px' }: Stage3DProps) {
  const can = useCan3D();
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!can || !ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      setActive(e.isIntersecting);
      if (e.isIntersecting) setMounted(true);
    }, { rootMargin: preload });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [can, preload]);

  const show3D = can && mounted && !failed;

  return (
    <div ref={ref} className={cn('relative', className)}>
      <div
        className={cn('absolute inset-0 transition-opacity duration-700', show3D && ready ? 'opacity-0 pointer-events-none' : 'opacity-100')}
        aria-hidden={show3D && ready ? true : undefined}
      >
        {fallback}
      </div>
      {show3D && (
        <div className={cn('absolute inset-0 transition-opacity duration-700', ready ? 'opacity-100' : 'opacity-0')}>
          <SceneBoundary onError={() => setFailed(true)}>
            <Suspense fallback={null}>
              <StageCtx.Provider value={{ active, onReady: () => setReady(true) }}>{children}</StageCtx.Provider>
            </Suspense>
          </SceneBoundary>
        </div>
      )}
    </div>
  );
}
