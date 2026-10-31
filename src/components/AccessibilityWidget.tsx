import React, { useEffect, useRef, useState } from 'react';
import { Accessibility, Type, PauseCircle, X } from 'lucide-react';
import { setPref, usePrefs } from '../lib/motion';
import { startSmoothScroll, stopSmoothScroll } from '../lib/scroll';
import { cn } from '../lib/utils';

/** Two working options: larger text and reduced motion (also stops 3D scenes). */
export const AccessibilityWidget = () => {
  const [open, setOpen] = useState(false);
  const prefs = usePrefs();
  const panel = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); } };
    const onClick = (e: MouseEvent) => {
      if (!panel.current?.contains(e.target as Node) && !btn.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onClick); };
  }, [open]);

  const toggleMotion = () => {
    const next = !prefs.reduceMotion;
    setPref('reduceMotion', next);
    if (next) stopSmoothScroll(); else startSmoothScroll();
  };

  const options = [
    { key: 'largeText' as const, label: 'Larger text', icon: Type, on: prefs.largeText, toggle: () => setPref('largeText', !prefs.largeText) },
    { key: 'reduceMotion' as const, label: 'Reduce motion', icon: PauseCircle, on: prefs.reduceMotion, toggle: toggleMotion },
  ];

  return (
    <div className="fixed left-5 z-40" style={{ bottom: 'max(20px, calc(env(safe-area-inset-bottom, 0px) + 12px))' }}>
      {open && (
        <div ref={panel} role="dialog" aria-label="Accessibility options" className="absolute bottom-14 left-0 w-60 rounded-[4px] border border-white/10 bg-navy p-4 text-white shadow-2xl animate-[fadeIn_.2s_ease]">
          <div className="mb-3 flex items-center justify-between">
            <p className="eyebrow text-white/50">Accessibility</p>
            <button onClick={() => setOpen(false)} aria-label="Close accessibility options" className="text-white/50 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <ul className="flex flex-col gap-1">
            {options.map(o => (
              <li key={o.key}>
                <button
                  role="switch"
                  aria-checked={o.on}
                  onClick={o.toggle}
                  className="flex w-full items-center gap-3 rounded-[2px] px-2 py-2.5 text-left text-sm hover:bg-white/5"
                >
                  <o.icon className="h-4 w-4 text-sky" aria-hidden="true" />
                  <span className="flex-1">{o.label}</span>
                  <span className={cn('relative h-5 w-9 rounded-full transition-colors', o.on ? 'bg-sky' : 'bg-white/15')}>
                    <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform', o.on ? 'translate-x-[18px]' : 'translate-x-0.5')} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        ref={btn}
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-navy/90 text-white backdrop-blur hover:bg-basalt"
        aria-label="Accessibility options"
      >
        <Accessibility className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
};
