import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { CenterHead, useReveal } from '../components/ui';
import { PROFILES } from '../data/products';
import { prefersReducedMotion } from '../lib/motion';
import { cn } from '../lib/utils';

export function ProfilesAlternating() {
  const ref = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  useReveal(ref);

  // Gentle image drift inside each frame as it passes through the viewport.
  useGSAP(() => {
    if (prefersReducedMotion() || !ref.current) return;
    gsap.utils.toArray<HTMLElement>('[data-drift]', ref.current).forEach(img => {
      gsap.fromTo(img, { yPercent: -4 }, {
        yPercent: 4, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  }, { scope: ref });

  return (
    <section ref={ref} id="upvc-profiles" className="section-y bg-paper" aria-labelledby="profiles-title">
      <div className="shell flex flex-col gap-16 lg:gap-24">
        <CenterHead
          id="profiles-title"
          eyebrow="Profile systems"
          title="Types of uPVC profiles"
          intro="The profile is the backbone of every uPVC window. We fabricate on aluplast profile systems, each engineered for specific openings and performance requirements."
        />

        <div className="flex flex-col gap-20 lg:gap-28">
          {PROFILES.map((p, idx) => (
            <article key={p.id} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div data-reveal className={cn('relative aspect-[5/4] overflow-hidden rounded-[4px] bg-mist', idx % 2 === 1 && 'lg:order-2')}>
                <img data-drift src={p.img} alt={`${p.name} uPVC profile section`} className="absolute inset-0 -top-[5%] h-[110%] w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="eyebrow text-white/70">{p.tagline}</p>
                  <p className="mt-2 font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold font-semiwide leading-none text-white">{p.name}</p>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div data-reveal className="flex flex-col gap-3">
                  <p className="eyebrow text-brand">{p.tagline}</p>
                  <h3 className="font-display text-[clamp(1.9rem,3.2vw,2.75rem)] font-semibold font-semiwide leading-tight">{p.name}</h3>
                </div>
                <p data-reveal className="measure border-l-2 border-brand pl-5 text-muted">{p.desc}</p>
                <dl data-reveal className="grid grid-cols-2 gap-px overflow-hidden rounded-[4px] border border-rule bg-rule">
                  {p.specs.map(s => (
                    <div key={s.label} className="bg-white px-4 py-3.5">
                      <dt className="text-[0.75rem] text-muted">{s.label}</dt>
                      <dd className="mt-1 font-mono text-[0.9375rem] font-medium tabular text-ink">{s.value}</dd>
                    </div>
                  ))}
                </dl>
                <ul data-reveal className="grid gap-2.5">
                  {p.features.map(f => (
                    <li key={f} className="flex gap-3 text-[0.9375rem]">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div data-reveal>
                  <button onClick={() => navigate('/contact')} className="btn btn-primary">
                    Get a quote <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
