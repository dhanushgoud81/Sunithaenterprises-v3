import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CenterHead, useReveal } from '../components/ui';
import { WINDOW_TYPES, slugForProduct } from '../data/products';
import { cn } from '../lib/utils';

/**
 * Six photo panels side by side; the active one opens wide with its details.
 * Desktop: hover, focus or click opens a panel. Phones: panels stack, tap to open.
 */
export function TypesAccordion() {
  const ref = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  useReveal(ref);

  return (
    <section ref={ref} id="upvc-types" className="section-y bg-white" aria-labelledby="types-title">
      <div className="shell flex flex-col gap-14">
        <CenterHead
          id="types-title"
          eyebrow="Our range"
          title="We manufacture all types of uPVC windows"
          intro="From casement to sliding, fixed to tilt-and-turn: each type is designed with unique features combining durability, energy efficiency and modern design."
        />

        <div data-reveal className="flex h-[min(720px,calc(100svh-120px))] min-h-[560px] flex-col gap-1.5 overflow-hidden rounded-[4px] bg-anthracite p-1.5 lg:h-[600px] lg:min-h-0 lg:flex-row">
          {WINDOW_TYPES.map((w, i) => {
            const on = i === active;
            return (
              <div
                key={w.title}
                onMouseEnter={() => setActive(i)}
                className={cn(
                  'group relative overflow-hidden rounded-[2px] transition-[flex-grow] duration-700 ease-[var(--ease-frame)]',
                  on ? 'grow-[6] lg:grow-[5]' : 'grow-[1]'
                )}
                style={{ flexBasis: 0 }}
              >
                <img
                  src={w.img}
                  alt={on ? w.title : ''}
                  className={cn('absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-frame)]', on ? 'scale-100' : 'scale-110')}
                  loading="lazy"
                />
                <div className={cn('absolute inset-0 transition-colors duration-700', on ? 'bg-gradient-to-t from-anthracite/95 via-anthracite/55 to-anthracite/5 lg:via-anthracite/35' : 'bg-anthracite/55 group-hover:bg-anthracite/40')} />

                {/* Collapsed label: vertical on desktop, horizontal on phones */}
                <button
                  onClick={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-expanded={on}
                  aria-controls={`type-detail-${i}`}
                  className={cn('absolute inset-0 flex items-center justify-center transition-opacity duration-500', on ? 'pointer-events-none opacity-0' : 'opacity-100')}
                >
                  <span className="flex items-center gap-3 text-white lg:flex-col lg:gap-4">
                    <span className="font-mono text-xs text-glass-bright tabular">{w.num}</span>
                    <span className="font-display text-base font-semibold font-semiwide whitespace-nowrap lg:text-lg lg:[writing-mode:vertical-rl] lg:rotate-180">
                      {w.title}
                    </span>
                  </span>
                </button>

                {/* Expanded details */}
                <div
                  id={`type-detail-${i}`}
                  className={cn(
                    'absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 transition-[opacity,transform] duration-700 ease-[var(--ease-frame)] sm:p-8 lg:p-10',
                    on ? 'translate-y-0 opacity-100 delay-200' : 'pointer-events-none translate-y-6 opacity-0'
                  )}
                  aria-hidden={!on}
                >
                  <p className="eyebrow text-glass-bright">Window type {w.num}</p>
                  <h3 className="font-display text-[clamp(1.6rem,3vw,2.5rem)] font-semibold font-semiwide leading-tight text-white">{w.title}</h3>
                  <p className="measure max-w-[34rem] text-[0.9375rem] text-white/75 sm:text-base">{w.desc}</p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button tabIndex={on ? 0 : -1} onClick={() => navigate(`/products/${slugForProduct(w.title)}`)} className="btn btn-accent">
                      Know more <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button tabIndex={on ? 0 : -1} onClick={() => navigate('/contact')} className="btn btn-line-light hidden sm:inline-flex">Get a quote</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
