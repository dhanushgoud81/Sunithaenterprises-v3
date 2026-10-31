import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SectionHead, useReveal } from '../components/ui';
import { prefersReducedMotion } from '../lib/motion';

const STEPS = [
  { title: 'Design', text: 'We measure your openings and recommend the window type, profile system and glazing that suit the room.' },
  { title: 'Fabricate', text: 'Profiles are cut, welded and reinforced with steel, then glazed and fitted with multi-point hardware.' },
  { title: 'Install', text: 'Our team fits, seals and checks every window on site, so it opens smoothly and stays weather-tight.' },
];

export function About() {
  const ref = useRef<HTMLElement>(null);
  const img = useRef<HTMLImageElement>(null);
  useReveal(ref);

  useGSAP(() => {
    if (prefersReducedMotion() || !img.current) return;
    gsap.fromTo(img.current, { yPercent: -6 }, {
      yPercent: 6, ease: 'none',
      scrollTrigger: { trigger: img.current.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  }, { scope: ref });

  return (
    <section ref={ref} id="about" className="section-y bg-paper" aria-labelledby="about-title">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div data-reveal className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-mist">
            <img
              ref={img}
              src="/images/smart-slide-villa.jpg"
              alt="Floor-to-ceiling uPVC sliding doors opening a living room onto a sea-view balcony"
              className="absolute inset-0 h-[112%] w-full -top-[6%] object-cover"
              loading="lazy"
            />
            <p className="absolute bottom-4 left-4 eyebrow bg-anthracite/80 text-white/85 px-3 py-2 rounded-[2px] backdrop-blur">
              smart-slide · 70 mm
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-12 lg:pt-6">
          <SectionHead
            id="about-title"
            eyebrow="About Sunitha Enterprises"
            title="One team from first measurement to final seal."
            className="lg:grid-cols-1"
            intro="We build every window on German aluplast profile systems and adapt them to Indian conditions: high heat, monsoon rain, coastal humidity and city noise. You deal with one team for design, fabrication and installation."
          />
          <ol className="grid gap-px bg-rule border-y border-rule sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} data-reveal className="bg-paper py-6 sm:px-6 sm:first:pl-0 flex flex-col gap-3">
                <span className="font-mono text-sm text-glass tabular">0{i + 1}</span>
                <h3 className="text-xl font-semibold font-semiwide">{s.title}</h3>
                <p className="text-muted text-[0.9375rem]">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
