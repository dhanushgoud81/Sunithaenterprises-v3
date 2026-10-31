import React, { lazy, useRef, useState } from 'react';
import { Move3d } from 'lucide-react';
import { Stage3D } from '../components/Stage3D';
import { SectionHead, useReveal } from '../components/ui';
import { ALUDEC_LAMINATIONS, WOODEC_LAMINATIONS } from '../data/products';
import { cn } from '../lib/utils';

const ShowcaseScene = lazy(() => import('../components/three/ShowcaseScene'));

type Lam = typeof ALUDEC_LAMINATIONS[number];

const FAMILIES = [
  {
    id: 'aludec',
    name: 'aludec',
    sub: 'inspired by style',
    accent: 'text-ink',
    text: 'Perfect aluminium look and a pleasant feel: aludec offers the high-quality look of an aluminium shell combined with easy processing. It has never been easier or more resource-saving to produce a uPVC window in aluminium look.',
    items: ALUDEC_LAMINATIONS,
  },
  {
    id: 'woodec',
    name: 'woodec',
    sub: 'inspired by nature',
    accent: 'text-oak',
    text: 'An astonishing wood look and a unique feel, combined with all the advantages of a uPVC window: this is what the woodec surface for aluplast window and door systems offers.',
    items: WOODEC_LAMINATIONS,
  },
];

export function Finishes() {
  const ref = useRef<HTMLElement>(null);
  const [sel, setSel] = useState<Lam>(ALUDEC_LAMINATIONS.find(l => l.name.includes('anthracite')) ?? ALUDEC_LAMINATIONS[0]);
  useReveal(ref);

  const fallback = (
    <div
      className="absolute inset-0 transition-[background-image] duration-500"
      style={{ backgroundImage: `url(${sel.texture})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      role="img"
      aria-label={`${sel.name} surface sample`}
    />
  );

  return (
    <section ref={ref} id="upvc-lamination" className="section-y bg-paper" aria-labelledby="finish-title">
      <div className="shell">
        <SectionHead
          id="finish-title"
          eyebrow="aluplast surface finishes"
          title="Choose a finish. See it on the frame."
          intro="Two catalogues from aluplast: the powder-coated look of aludec aluminium-style finishes, or the warm, textured touch of woodec woodgrains. Pick a swatch to apply it to the window."
        />

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-14">
          <div data-reveal className="lg:col-span-7 lg:sticky lg:top-[96px] self-start">
            <div className="relative overflow-hidden rounded-[4px] bg-[linear-gradient(180deg,#E9ECEA_0%,#D5D9D6_100%)]">
              <Stage3D className="h-[380px] sm:h-[460px] lg:h-[580px]" fallback={fallback}>
                <ShowcaseScene kind="casement" textureUrl={sel.texture} demo={false} openAmount={0.32} idleSpin tone="light" />
              </Stage3D>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-5">
                <div className="rounded-[2px] bg-white/85 px-4 py-3 backdrop-blur">
                  <p className="eyebrow text-glass">{sel.name.startsWith('aludec') ? 'aludec' : 'woodec'}</p>
                  <p className="mt-1 font-display text-lg font-semibold capitalize">{sel.name.replace('aludec ', '')}</p>
                  <p className="text-sm text-muted">{sel.desc}</p>
                </div>
                <p className="hidden sm:flex items-center gap-2 eyebrow text-ink/50">
                  <Move3d className="h-4 w-4" aria-hidden="true" /> Drag to rotate
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-12">
            {FAMILIES.map(f => (
              <div key={f.id} data-reveal className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-semibold font-semiwide">
                    <span className={f.accent}>{f.name}</span>{' '}
                    <span className="font-normal text-muted">{f.sub}</span>
                  </h3>
                  <p className="text-[0.9375rem] text-muted measure">{f.text}</p>
                </div>
                <div role="radiogroup" aria-label={`${f.name} finishes`} className="grid grid-cols-4 gap-3 sm:grid-cols-7 lg:grid-cols-4 xl:grid-cols-4">
                  {f.items.map(l => {
                    const on = l.name === sel.name;
                    return (
                      <button
                        key={l.name}
                        role="radio"
                        aria-checked={on}
                        aria-label={l.name}
                        title={l.name}
                        onClick={() => setSel(l)}
                        className="group flex flex-col gap-2 text-left"
                      >
                        <span
                          className={cn('block aspect-square w-full rounded-[2px] ring-offset-2 ring-offset-paper transition-[box-shadow,transform] duration-300', on ? 'ring-2 ring-glass' : 'ring-1 ring-rule group-hover:-translate-y-0.5')}
                          style={{ backgroundColor: l.bg, backgroundImage: `url(${l.texture})`, backgroundSize: 'cover' }}
                        />
                        <span className={cn('text-xs leading-tight capitalize', on ? 'text-ink font-medium' : 'text-muted')}>
                          {l.name.replace('aludec ', '').replace('sheffield ', '').replace('turner ', '')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <p className="eyebrow text-muted">All aluplast systems offer superior UV and climate resistance · Sample swatches available</p>
          </div>
        </div>
      </div>
    </section>
  );
}
