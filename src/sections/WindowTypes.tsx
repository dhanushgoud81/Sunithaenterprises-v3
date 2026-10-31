import React, { lazy, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Move3d } from 'lucide-react';
import { Stage3D } from '../components/Stage3D';
import { SectionHead, useReveal } from '../components/ui';
import { WINDOW_TYPES, KIND_BY_TITLE, slugForProduct } from '../data/products';
import { cn } from '../lib/utils';

const ShowcaseScene = lazy(() => import('../components/three/ShowcaseScene'));

export function WindowTypes() {
  const ref = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  useReveal(ref);
  const w = WINDOW_TYPES[index];

  const onKey = (e: React.KeyboardEvent) => {
    const d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (index + d + WINDOW_TYPES.length) % WINDOW_TYPES.length;
    setIndex(n);
    tabs.current[n]?.focus();
  };

  const fallback = (
    <div className="absolute inset-0">
      {WINDOW_TYPES.map((t, i) => (
        <img
          key={t.title}
          src={t.img}
          alt={i === index ? t.title : ''}
          className={cn('absolute inset-0 h-full w-full object-cover transition-opacity duration-700', i === index ? 'opacity-100' : 'opacity-0')}
          loading="lazy"
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-anthracite/70 to-transparent" />
    </div>
  );

  return (
    <section ref={ref} id="upvc-types" className="section-y bg-paper" aria-labelledby="types-title">
      <div className="shell">
        <SectionHead
          id="types-title"
          eyebrow="Window types"
          title="Six ways to open a room."
          intro="From casement to sliding, fixed to tilt-and-turn: each type combines durability, energy efficiency and modern design. Pick one to see how it opens."
        />

        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-12 lg:gap-12">
          {/* Viewer */}
          <div data-reveal className="lg:col-span-7 lg:sticky lg:top-[96px] self-start">
            <div className="relative overflow-hidden rounded-[4px] bg-anthracite">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(140,194,187,0.16),transparent_65%)]" aria-hidden="true" />
              <Stage3D className="h-[380px] sm:h-[460px] lg:h-[600px]" fallback={fallback}>
                <ShowcaseScene kind={KIND_BY_TITLE[w.title]} demo tone="dark" />
              </Stage3D>
              <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5">
                <p className="eyebrow text-white/50">Type {w.num} / 06</p>
                <p className="eyebrow text-glass-bright text-right">{w.title}</p>
              </div>
              <p className="pointer-events-none absolute bottom-5 left-5 hidden sm:flex items-center gap-2 eyebrow text-white/40">
                <Move3d className="h-4 w-4" aria-hidden="true" /> Drag to rotate
              </p>
            </div>
          </div>

          {/* Type list */}
          <div className="lg:col-span-5">
            <div role="tablist" aria-label="Window types" aria-orientation="vertical" onKeyDown={onKey} className="flex flex-col border-t border-rule">
              {WINDOW_TYPES.map((t, i) => {
                const on = i === index;
                return (
                  <div key={t.title} className="border-b border-rule">
                    <button
                      ref={el => { tabs.current[i] = el; }}
                      role="tab"
                      id={`type-tab-${i}`}
                      aria-selected={on}
                      aria-controls={`type-panel-${i}`}
                      tabIndex={on ? 0 : -1}
                      onClick={() => setIndex(i)}
                      className="group flex w-full items-baseline gap-5 py-5 text-left"
                    >
                      <span className={cn('font-mono text-sm tabular', on ? 'text-glass' : 'text-muted')}>{t.num}</span>
                      <span className={cn('flex-1 font-display font-semibold font-semiwide text-[1.375rem] transition-colors', on ? 'text-ink' : 'text-ink/55 group-hover:text-ink')}>
                        {t.title}
                      </span>
                      <ArrowRight className={cn('h-4 w-4 transition-transform duration-500', on ? 'rotate-90 text-glass' : 'text-muted group-hover:translate-x-1')} aria-hidden="true" />
                    </button>
                    <div
                      role="tabpanel"
                      id={`type-panel-${i}`}
                      aria-labelledby={`type-tab-${i}`}
                      hidden={!on}
                      className="pb-7 pl-[2.6rem]"
                    >
                      <p className="text-muted measure">{t.overview}</p>
                      <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                        {t.features.map(f => (
                          <li key={f} className="flex gap-2.5 text-[0.9375rem]">
                            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-glass" aria-hidden="true" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-5 text-sm text-muted">
                        <span className="eyebrow text-ink/70 mr-2">Best for</span>
                        {t.applications.join(' · ')}
                      </p>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <button onClick={() => navigate(`/products/${slugForProduct(t.title)}`)} className="btn btn-primary">
                          Explore {t.title.toLowerCase()}
                        </button>
                        <button onClick={() => navigate('/contact')} className="btn btn-line">Get a quote</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
