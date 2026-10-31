import React, { lazy, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Stage3D } from '../components/Stage3D';
import { SectionHead, useReveal } from '../components/ui';
import { BENEFIT_GROUPS, WHY_UPVC, type ProfilePart } from '../data/products';
import { cn } from '../lib/utils';
import type { ProfileDrive } from '../components/three/ProfileScene';

gsap.registerPlugin(ScrollTrigger);
const ProfileScene = lazy(() => import('../components/three/ProfileScene'));

const byTitle = Object.fromEntries(WHY_UPVC.map(w => [w.title, w]));

export function Benefits() {
  const ref = useRef<HTMLElement>(null);
  const drive = useRef<ProfileDrive>({ explode: 0, active: BENEFIT_GROUPS[0].part });
  const [active, setActive] = useState<string>(BENEFIT_GROUPS[0].id);
  useReveal(ref);

  const select = (id: string, part: ProfilePart) => {
    setActive(id);
    drive.current.active = part;
  };

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    // Explode the profile as the list starts scrolling.
    ScrollTrigger.create({
      trigger: el.querySelector('[data-groups]'),
      start: 'top 75%',
      end: 'top 15%',
      scrub: true,
      onUpdate: s => { drive.current.explode = s.progress; },
    });
    // The group crossing the middle of the screen becomes active.
    gsap.utils.toArray<HTMLElement>('[data-group]', el).forEach(g => {
      ScrollTrigger.create({
        trigger: g,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: s => {
          if (!s.isActive) return;
          const group = BENEFIT_GROUPS.find(b => b.id === g.dataset.group);
          if (group) select(group.id, group.part);
        },
      });
    });
  }, { scope: ref });

  const fallback = (
    <div className="absolute inset-0 flex items-center justify-center p-6">
      <img src="/images/profile-ideal-4000.jpg" alt="Cut section of the IDEAL 4000 multi-chamber uPVC profile" className="max-h-full max-w-full object-contain rounded-[4px]" loading="lazy" />
    </div>
  );

  return (
    <section ref={ref} id="why-upvc" className="stage-dark relative section-y" aria-labelledby="why-title">
      <div className="shell">
        <SectionHead
          id="why-title"
          tone="dark"
          eyebrow="Why uPVC"
          title="The engineering is inside the frame."
          intro="Engineered chambers, sealed glazing and climate-stable profiles. Scroll through each benefit to see the part of the profile that delivers it."
        />

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          {/* Sticky 3D stage */}
          <div className="lg:col-span-6 sticky top-[72px] z-10 self-start -mx-5 md:-mx-10 lg:mx-0 bg-anthracite">
            <Stage3D
              className="h-[42svh] min-h-[280px] lg:h-[calc(100svh-120px)] lg:max-h-[720px]"
              fallback={fallback}
            >
              <ProfileScene drive={drive} />
            </Stage3D>
            <p className="px-5 md:px-10 lg:px-0 pb-3 pt-1 eyebrow text-white/35">
              Illustrative cut-through · not to scale
            </p>
          </div>

          {/* Benefit groups */}
          <div data-groups className="lg:col-span-6 flex flex-col">
            {BENEFIT_GROUPS.map((g, gi) => {
              const on = active === g.id;
              return (
                <article
                  key={g.id}
                  data-group={g.id}
                  className={cn('border-t border-white/10 py-10 lg:py-16 lg:min-h-[62svh] transition-opacity duration-500', on ? 'opacity-100' : 'lg:opacity-45')}
                >
                  <button
                    onClick={() => select(g.id, g.part)}
                    aria-pressed={on}
                    className="group flex w-full items-baseline justify-between gap-4 text-left"
                  >
                    <h3 className="display-lg !text-[clamp(1.75rem,2.6vw,2.5rem)] text-white">{g.title}</h3>
                    <span className={cn('eyebrow shrink-0 transition-colors', on ? 'text-glass-bright' : 'text-white/40 group-hover:text-white/70')}>
                      0{gi + 1} · {g.partLabel}
                    </span>
                  </button>
                  <div className="mt-6 grid gap-6">
                    {g.items.map(t => {
                      const item = byTitle[t];
                      if (!item) return null;
                      const Icon = item.icon;
                      return (
                        <div key={t} className="grid grid-cols-[auto_1fr] gap-4">
                          <Icon className="mt-1 h-5 w-5 text-glass-bright" aria-hidden="true" />
                          <div>
                            <h4 className="font-sans text-base font-semibold text-white">{item.title}</h4>
                            <p className="mt-1 text-white/60 text-[0.9375rem] measure">{item.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
