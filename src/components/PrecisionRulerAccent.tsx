import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const PrecisionRulerAccent = ({ className = "my-6" }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const ticksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Draw central blueprint line from center
      gsap.fromTo(lineRef.current,
        { scaleX: 0, transformOrigin: 'center' },
        { 
          scaleX: 1, 
          duration: 1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 92%',
          }
        }
      );

      // 2. Animate and eject incremental measurement ticks
      if (ticksRef.current) {
        const ticks = ticksRef.current.children;
        gsap.fromTo(ticks,
          { opacity: 0, y: -4 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: {
              each: 0.08,
              from: 'center'
            },
            ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 92%',
            }
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={`flex flex-col items-center gap-1 select-none pointer-events-none ${className}`}>
      {/* Precision blueprint expanding baseline */}
      <div 
        ref={lineRef}
        className="w-28 h-[1.5px] bg-[#2E6B65] shadow-[0_0_8px_rgba(46,107,101,0.25)] rounded-full"
      />
      {/* Fractional tick marks resembling micro-measurements */}
      <div ref={ticksRef} className="flex justify-between w-24 px-1.5 opacity-90">
        <span className="w-px h-1 bg-slate-300" />
        <span className="w-px h-1.5 bg-slate-400" />
        <span className="w-px h-1 bg-slate-300" />
        <span className="w-px h-2 bg-[#2E6B65]" />
        <span className="w-px h-1 bg-slate-300" />
        <span className="w-px h-1.5 bg-slate-400" />
        <span className="w-px h-1 bg-slate-300" />
      </div>
    </div>
  );
};
