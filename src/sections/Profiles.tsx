import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Plus, Minus } from 'lucide-react';
import { SectionHead, useReveal, useMediaQuery } from '../components/ui';
import { PROFILES, profileCategory } from '../data/products';
import { cn } from '../lib/utils';

type Filter = 'All' | 'Casement' | 'Sliding';
type Profile = typeof PROFILES[number];

/** Pull the construction depth out of the tagline for the list ("54 mm"). */
const depthOf = (p: Profile) => p.tagline.match(/(\d+)\s*mm/)?.[1];

function ProfileDetail({ p, onQuote }: { p: Profile; onQuote: () => void }) {
  return (
    <div className="flex flex-col gap-7">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[4px] bg-mist">
        <img key={p.id} src={p.img} alt={`${p.name} uPVC profile`} className="h-full w-full object-cover animate-[fadeIn_.6s_ease]" loading="lazy" />
        <p className="absolute left-4 top-4 eyebrow rounded-[2px] bg-paper/90 px-2.5 py-1.5 text-glass backdrop-blur">{profileCategory(p)}</p>
      </div>
      <div className="flex flex-col gap-3">
        <p className="eyebrow text-glass">{p.tagline}</p>
        <h3 className="text-[2rem] font-semibold font-semiwide leading-tight">{p.name}</h3>
        <p className="text-muted measure">{p.desc}</p>
      </div>
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[4px] border border-rule bg-rule">
        {p.specs.map(s => (
          <div key={s.label} className="bg-white px-4 py-3.5">
            <dt className="text-[0.75rem] text-muted">{s.label}</dt>
            <dd className="mt-1 font-mono text-[0.9375rem] font-medium tabular">{s.value}</dd>
          </div>
        ))}
      </dl>
      <ul className="grid gap-2.5">
        {p.features.map(f => (
          <li key={f} className="flex gap-2.5 text-[0.9375rem]">
            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-glass" aria-hidden="true" />
            {f}
          </li>
        ))}
      </ul>
      <button onClick={onQuote} className="btn btn-primary w-fit">
        Get a quote for {p.name} <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export function Profiles() {
  const ref = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const wide = useMediaQuery('(min-width: 1024px)');
  const [filter, setFilter] = useState<Filter>('All');
  const [selected, setSelected] = useState<string>(PROFILES[3].id); // IDEAL 4000 first
  const [openMobile, setOpenMobile] = useState<string | null>(null);
  useReveal(ref);

  const list = useMemo(() => PROFILES.filter(p => filter === 'All' || profileCategory(p) === filter), [filter]);
  const current = PROFILES.find(p => p.id === selected) ?? list[0];
  const quote = () => navigate('/contact');

  const setF = (f: Filter) => {
    setFilter(f);
    const first = PROFILES.find(p => f === 'All' || profileCategory(p) === f);
    if (first && !(f === 'All' || profileCategory(current) === f)) setSelected(first.id);
  };

  return (
    <section ref={ref} id="upvc-profiles" className="section-y bg-white" aria-labelledby="profiles-title">
      <div className="shell">
        <SectionHead
          id="profiles-title"
          eyebrow="Profile systems"
          title="Eight aluplast profiles, chosen by how the window opens."
          intro="The profile is the backbone of every uPVC window. Each system below is engineered for specific openings and performance needs, from compact 54 mm sliders to the 70 mm, 5-chamber IDEAL 4000®."
          aside={
            <div role="radiogroup" aria-label="Filter profiles" className="inline-flex w-fit rounded-[2px] border border-rule p-1">
              {(['All', 'Casement', 'Sliding'] as Filter[]).map(f => (
                <button
                  key={f}
                  role="radio"
                  aria-checked={filter === f}
                  onClick={() => setF(f)}
                  className={cn('px-4 py-2 text-sm font-medium rounded-[2px] transition-colors', filter === f ? 'bg-ink text-white' : 'text-muted hover:text-ink')}
                >
                  {f}
                  <span className="ml-1.5 font-mono text-xs opacity-60">
                    {PROFILES.filter(p => f === 'All' || profileCategory(p) === f).length}
                  </span>
                </button>
              ))}
            </div>
          }
        />

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-14">
          <ul className="lg:col-span-5 flex flex-col border-t border-rule">
            {list.map(p => {
              const on = wide ? p.id === current.id : openMobile === p.id;
              return (
                <li key={p.id} data-reveal className="border-b border-rule">
                  <button
                    onClick={() => (wide ? setSelected(p.id) : setOpenMobile(on ? null : p.id))}
                    aria-expanded={on}
                    className="group grid w-full grid-cols-[1fr_auto] items-center gap-4 py-5 text-left"
                  >
                    <span className="flex flex-col gap-1">
                      <span className={cn('font-display text-[1.375rem] font-semibold font-semiwide transition-colors', on ? 'text-ink' : 'text-ink/60 group-hover:text-ink')}>
                        {p.name}
                      </span>
                      <span className="text-sm text-muted">{p.tagline}</span>
                    </span>
                    <span className="flex items-center gap-4">
                      {depthOf(p) && (
                        <span className="font-mono text-sm tabular text-muted">
                          {depthOf(p)}<span className="text-xs"> mm</span>
                        </span>
                      )}
                      {wide
                        ? <ArrowRight className={cn('h-4 w-4 transition-all', on ? 'text-glass translate-x-0' : 'text-rule -translate-x-1 group-hover:text-muted')} aria-hidden="true" />
                        : on ? <Minus className="h-4 w-4 text-glass" aria-hidden="true" /> : <Plus className="h-4 w-4 text-muted" aria-hidden="true" />}
                    </span>
                  </button>
                  {!wide && on && <div className="pb-8"><ProfileDetail p={p} onQuote={quote} /></div>}
                </li>
              );
            })}
          </ul>

          {wide && (
            <div className="lg:col-span-7">
              <div className="sticky top-[96px]" aria-live="polite">
                <ProfileDetail p={current} onQuote={quote} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
