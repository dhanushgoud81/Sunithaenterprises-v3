import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { cn } from '../lib/utils';
import { prefersReducedMotion } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger);

export function useMediaQuery(query: string) {
  const get = () => typeof window !== 'undefined' && window.matchMedia(query).matches;
  const [match, setMatch] = useState(get);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}

/**
 * Fade/slide elements marked `data-reveal` into place as they enter.
 * Content is fully visible without JS; motion is skipped when reduced.
 */
export function useReveal(scope: React.RefObject<HTMLElement | null>) {
  useGSAP(() => {
    if (prefersReducedMotion() || !scope.current) return;
    const els = gsap.utils.toArray<HTMLElement>('[data-reveal]', scope.current);
    if (!els.length) return;
    gsap.set(els, { opacity: 0, y: 28 });
    ScrollTrigger.batch(els, {
      start: 'top 88%',
      once: true,
      onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08, overwrite: true }),
    });
  }, { scope });
}

interface SectionHeadProps {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  tone?: 'light' | 'dark';
  className?: string;
  aside?: React.ReactNode;
  id?: string;
}

export function SectionHead({ eyebrow, title, intro, tone = 'light', className, aside, id }: SectionHeadProps) {
  const dark = tone === 'dark';
  return (
    <div className={cn('grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-end', className)}>
      <div className="flex flex-col gap-5">
        <p data-reveal className={cn('eyebrow', dark ? 'text-glass-bright' : 'text-glass')}>{eyebrow}</p>
        <h2 id={id} data-reveal className={cn('display-lg max-w-[20ch]', dark ? 'text-white' : 'text-ink')}>{title}</h2>
      </div>
      {(intro || aside) && (
        <div data-reveal className="flex flex-col gap-6 lg:pb-2">
          {intro && <p className={cn('measure text-[1.0625rem]', dark ? 'text-white/65' : 'text-muted')}>{intro}</p>}
          {aside}
        </div>
      )}
    </div>
  );
}

/** Spec figure in the spec-sheet style: big mono number + unit + label. */
export function Spec({ value, unit, label, tone = 'light' }: { value: string; unit?: string; label: string; tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark';
  return (
    <div className="flex flex-col gap-1.5">
      <p className={cn('font-mono tabular text-[1.75rem] leading-none font-medium', dark ? 'text-white' : 'text-ink')}>
        {value}
        {unit && <span className={cn('text-[0.8125rem] ml-1.5 font-normal', dark ? 'text-white/50' : 'text-muted')}>{unit}</span>}
      </p>
      <p className={cn('text-[0.8125rem]', dark ? 'text-white/55' : 'text-muted')}>{label}</p>
    </div>
  );
}
