import React, { useRef } from 'react';
import { CenterHead, useReveal } from '../components/ui';
import { WHY_UPVC } from '../data/products';

export function WhyUpvc() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section ref={ref} id="why-upvc" className="section-y bg-paper" aria-labelledby="why-title">
      <div className="shell flex flex-col gap-14">
        <CenterHead
          id="why-title"
          eyebrow="Performance"
          title="Why uPVC"
          intro="Engineered chambers, sealed glazing and climate-stable profiles: the quiet luxury of a building that works."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_UPVC.map(item => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                data-reveal
                className="group flex flex-col gap-4 rounded-[4px] border border-rule bg-white p-6 transition-[border-color,transform,box-shadow] duration-500 ease-[var(--ease-frame)] hover:-translate-y-1 hover:border-glass/40 hover:shadow-[0_18px_40px_-24px_rgba(20,23,26,0.35)]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-[2px] bg-glass-soft text-glass transition-colors duration-500 group-hover:bg-glass group-hover:text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="font-sans text-[1.0625rem] font-semibold text-ink">{item.title}</h3>
                <p className="text-[0.9375rem] leading-relaxed text-muted">{item.desc}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
