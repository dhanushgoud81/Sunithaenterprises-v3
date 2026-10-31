import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { scrollToTop } from '../lib/scroll';
import { cn } from '../lib/utils';

export const ScrollToTop = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 900);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <button
      onClick={() => scrollToTop()}
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      className={cn(
        'fixed right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-navy/90 text-white backdrop-blur transition-all duration-400 hover:bg-basalt',
        show ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-3'
      )}
      style={{ bottom: 'max(88px, calc(env(safe-area-inset-bottom, 0px) + 80px))' }}
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  );
};
