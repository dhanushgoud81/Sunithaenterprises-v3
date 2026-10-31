import React, { lazy, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Stage3D } from '../components/Stage3D';
import { Spec, useMediaQuery } from '../components/ui';
import { prefersReducedMotion, useCan3D } from '../lib/motion';
import { scrollToId } from '../lib/scroll';
import type { HeroDrive } from '../components/three/HeroScene';

gsap.registerPlugin(ScrollTrigger);
const HeroScene = lazy(() => import('../components/three/HeroScene'));

const PROOF = [
  { value: '45', unit: 'dB', label: 'Sound reduction' },
  { value: '0.99', unit: 'W/m²K', label: 'Uw thermal value' },
  { value: '41', unit: 'mm', label: 'Maximum glazing' },
  { value: '70', unit: 'mm', label: '5-chamber profile depth' },
];

export function Hero() {
  const navigate = useNavigate();
  const section = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const drive = useRef<HeroDrive>({ progress: 0 });
  const wide = useMediaQuery('(min-width: 1024px)');
  const can3D = useCan3D();

  useGSAP(() => {
    const el = section.current;
    if (!el) return;
    const reduced = prefersReducedMotion();

    // Intro: headline lines rise in, proof strip follows.
    if (!reduced) {
      gsap.from(el.querySelectorAll('[data-hero-in]'), {
        y: 36, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09, delay: 0.15,
      });
    }

    if (!can3D) return;
    // Scroll: drive the 3D window; pin on wide screens so the move completes in view.
    // One timeline owns the pin, so the text fade and the 3D move share the same scroll range.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: wide ? '+=110%' : 'bottom top',
        pin: wide,
        scrub: true,
        onUpdate: self => { drive.current.progress = self.progress; },
      },
    });
    // Desktop: the headline clears away as the camera moves in. Phones keep it readable.
    if (wide) tl.to(content.current, { opacity: 0, y: -60, ease: 'none', duration: 0.4 });
    tl.to({}, { duration: wide ? 0.6 : 1 });
  }, { scope: section, dependencies: [wide, can3D], revertOnUpdate: true });

  const fallback = (
    <div className="absolute inset-0">
      <img
        src="/images/upvc-hero-luxury.jpg"
        alt=""
        className="h-full w-full object-cover"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-anthracite via-anthracite/80 to-anthracite/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-anthracite via-transparent to-anthracite/50" />
    </div>
  );

  return (
    <section
      ref={section}
      id="upvc-hero"
      className="relative flex flex-col overflow-hidden bg-anthracite text-white lg:block lg:h-[100svh] lg:min-h-[640px]"
      aria-labelledby="hero-title"
    >
      {/* Desktop: full-bleed stage behind the text. Phones: its own block between text and specs. */}
      <Stage3D
        className="order-2 h-[58svh] min-h-[360px] lg:absolute lg:inset-0 lg:h-auto lg:min-h-0"
        fallback={fallback}
        preload="0px"
      >
        <HeroScene drive={drive} wide={wide} />
      </Stage3D>

      {/* legibility veil on the text side (desktop) */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block bg-gradient-to-r from-anthracite/85 via-anthracite/20 to-transparent" />

      <div ref={content} className="contents lg:block lg:absolute lg:inset-0 lg:pointer-events-none">
        <div className="order-1 relative z-10 shell lg:pointer-events-auto pt-[112px] pb-4 lg:absolute lg:inset-x-0 lg:top-0 lg:bottom-[172px] lg:flex lg:flex-col lg:justify-center lg:pt-[72px] lg:pb-0">
          <div className="max-w-[44rem] flex flex-col gap-6">
            <p data-hero-in className="eyebrow text-glass-bright">aluplast uPVC systems · Engineered for Indian weather</p>
            <h1 id="hero-title" data-hero-in className="display-xl text-white">
              Premium uPVC windows <span className="text-glass-bright">&amp;&nbsp;doors</span>
            </h1>
            <p data-hero-in className="text-white/70 text-[1.0625rem] lg:text-lg measure max-w-[34rem]">
              Sunitha Enterprises designs, fabricates and installs high-performance uPVC windows and doors, made for the Indian climate with lasting durability, energy efficiency and quiet elegance.
            </p>
            <div data-hero-in className="flex flex-wrap gap-3 pt-2">
              <button onClick={() => navigate('/contact')} className="btn btn-accent">Get a quote</button>
              <button onClick={() => scrollToId('upvc-types')} className="btn btn-line-light">Explore windows</button>
            </div>
          </div>
        </div>

        <div className="order-3 relative z-10 shell lg:pointer-events-auto pb-10 lg:pb-[84px] lg:absolute lg:inset-x-0 lg:bottom-0">
          <div data-hero-in className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-6 sm:grid-cols-4 lg:max-w-[46rem]">
            {PROOF.map(p => <Spec key={p.label} {...p} tone="dark" />)}
          </div>
        </div>
      </div>
    </section>
  );
}
