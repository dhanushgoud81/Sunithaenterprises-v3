import React, { useRef, useState } from 'react';
import { CenterHead, useReveal } from '../components/ui';
import { ALUDEC_LAMINATIONS, WOODEC_LAMINATIONS } from '../data/products';
import { cn } from '../lib/utils';

type Lam = typeof ALUDEC_LAMINATIONS[number];

const LIGHT = new Set(['aludec traffic white', 'sheffield oak alpine', 'turner oak malt']);
const shortName = (n: string) => n.replace('aludec ', '').replace('sheffield ', '').replace('turner ', '');

function Strip({ family, items, tag }: { family: string; items: readonly Lam[]; tag: string }) {
  const [active, setActive] = useState(0);
  return (
    <div role="radiogroup" aria-label={`${family} finishes`} className="flex h-[360px] w-full overflow-hidden rounded-[4px] border border-rule bg-white md:h-[400px]">
      {items.map((l, i) => {
        const on = i === active;
        const light = LIGHT.has(l.name);
        return (
          <button
            key={l.name}
            role="radio"
            aria-checked={on}
            aria-label={l.name}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            className={cn('group relative overflow-hidden border-r border-black/5 text-left transition-[flex-grow] duration-700 ease-[var(--ease-frame)] last:border-r-0', on ? 'grow-[6] md:grow-[3.2]' : 'grow')}
            style={{ flexBasis: 0, backgroundColor: l.bg, backgroundImage: `url(${l.texture})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <span className="absolute inset-0 bg-gradient-to-tr from-black/15 via-transparent to-white/5" />
            {/* vertical name while collapsed */}
            <span className={cn('absolute inset-x-0 bottom-6 flex justify-center transition-opacity duration-500', on ? 'opacity-0' : 'opacity-100')}>
              <span className={cn('whitespace-nowrap text-xs font-medium capitalize [writing-mode:vertical-rl] rotate-180', light ? 'text-ink/75' : 'text-white/85')}>
                {shortName(l.name)}
              </span>
            </span>
            {/* detail card while open */}
            <span className={cn('absolute inset-x-3 bottom-3 flex flex-col gap-1 rounded-[2px] bg-white/90 p-3 md:p-4 backdrop-blur transition-[opacity,transform] duration-500', on ? 'translate-y-0 opacity-100 delay-150' : 'translate-y-3 opacity-0')}>
              <span className="eyebrow text-brand">{tag}</span>
              <span className="font-display text-lg font-semibold capitalize leading-tight text-ink">{shortName(l.name)}</span>
              <span className="text-sm text-muted">{l.desc}</span>
              <span className="font-mono text-xs text-muted">{l.bg.toUpperCase()}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function LaminationStrips() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section ref={ref} id="upvc-lamination" className="section-y bg-white" aria-labelledby="lam-title">
      <div className="shell flex flex-col gap-14">
        <CenterHead
          id="lam-title"
          eyebrow="aluplast surface coatings"
          title="Lamination options"
          intro="Two catalogues from aluplast: the powder-coated look of aludec aluminium-style finishes, or the warm, textured touch of woodec woodgrains."
        />

        <div className="mx-auto flex w-full max-w-6xl flex-col gap-16">
          <div className="flex flex-col gap-6">
            <div data-reveal className="flex flex-col gap-2 border-l-2 border-ink pl-5">
              <h3 className="text-2xl font-semibold font-semiwide">aludec <span className="font-normal text-muted">inspired by style</span></h3>
              <p className="measure text-[0.9375rem] text-muted">
                Perfect aluminium look and a pleasant feel: aludec offers the high-quality look of an aluminium shell combined with easy processing. It has never been easier or more resource-saving to produce a uPVC window in aluminium look.
              </p>
            </div>
            <div data-reveal><Strip family="aludec" tag="aludec surface" items={ALUDEC_LAMINATIONS} /></div>
          </div>

          <div className="flex flex-col gap-6">
            <div data-reveal className="flex flex-col gap-2 border-l-2 border-oak pl-5">
              <h3 className="text-2xl font-semibold font-semiwide"><span className="text-oak">woodec</span> <span className="font-normal text-muted">inspired by nature</span></h3>
              <p className="measure text-[0.9375rem] text-muted">
                An astonishing wood look and a unique feel, combined with all the advantages of a uPVC window: this is what the woodec surface for aluplast window and door systems offers.
              </p>
            </div>
            <div data-reveal><Strip family="woodec" tag="woodec woodgrain" items={WOODEC_LAMINATIONS} /></div>
          </div>
        </div>

        <p className="eyebrow text-center text-muted">All aluplast systems offer superior UV and climate resistance · Sample swatches available</p>
      </div>
    </section>
  );
}
