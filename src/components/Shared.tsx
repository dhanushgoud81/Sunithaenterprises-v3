import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Menu, X, Phone, MessageCircle, ArrowUpRight, Mail, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';
import { Logo } from './Logo';
import { COMPANY, whatsappLink } from '../config/company';
import { scrollToId, scrollToTop, lockScroll, isProgrammaticScroll } from '../lib/scroll';

type NavItem = { label: string; path: string; section?: string };

const NAV_ITEMS: NavItem[] = [
  { label: 'Windows',  path: '/#upvc-types',      section: 'upvc-types' },
  { label: 'Profiles', path: '/#upvc-profiles',   section: 'upvc-profiles' },
  { label: 'Finishes', path: '/#upvc-lamination', section: 'upvc-lamination' },
  { label: 'Projects', path: '/gallery' },
  { label: 'Contact',  path: '/contact' },
];

const isHomePath = (p: string) => p === '/' || p === '/upvc';

/** Shared navigation: handles in-page sections, cross-page sections and routes. */
function useGo() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (path: string) => {
    if (path.startsWith('/#')) {
      const id = path.slice(2);
      if (isHomePath(pathname) && scrollToId(id)) return;
      navigate(path); // Home reads the hash and scrolls once mounted
      return;
    }
    if (path === pathname) { scrollToTop(); return; }
    navigate(path);
  };
}

/** Which home section is currently in view (for the active nav state). */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) { setActive(null); return; }
    const ids = NAV_ITEMS.filter(i => i.section).map(i => i.section!);
    const els = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    els.forEach(el => io.observe(el));
    const onTop = () => { if (window.scrollY < 300) setActive(null); };
    window.addEventListener('scroll', onTop, { passive: true });
    return () => { io.disconnect(); window.removeEventListener('scroll', onTop); };
  }, [enabled]);
  return active;
}

export const Navbar = () => {
  const { pathname } = useLocation();
  const go = useGo();
  const isHome = isHomePath(pathname);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const active = useActiveSection(isHome);

  // Solid after a little scroll; hide on scroll down, reveal on scroll up.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      const prev = lastY.current;
      if (isProgrammaticScroll()) setHidden(false);
      else if (!open) setHidden(h => (y > 480 && y > prev + 4 ? true : y < prev - 4 ? false : h));
      lastY.current = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [open]);

  useEffect(() => { setOpen(false); setHidden(false); }, [pathname]);

  // Mobile menu: lock scroll, focus first link, Escape closes, keep focus inside.
  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    const first = menuRef.current?.querySelector<HTMLElement>('a,button');
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); }
      if (e.key === 'Tab' && menuRef.current) {
        const f = menuRef.current.querySelectorAll<HTMLElement>('a,button');
        const a = f[0], b = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); b.focus(); }
        else if (!e.shiftKey && document.activeElement === b) { e.preventDefault(); a.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); lockScroll(false); };
  }, [open]);

  const isActive = (item: NavItem) =>
    item.section ? isHome && active === item.section : pathname === item.path;

  const solid = scrolled || !isHome || open;

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500 ease-[var(--ease-frame)]',
          solid ? 'bg-anthracite/90 backdrop-blur-xl border-b border-white/[0.07]' : 'bg-transparent border-b border-transparent',
          hidden && !open ? '-translate-y-full' : 'translate-y-0'
        )}
      >
        <div className="shell flex h-[72px] items-center justify-between gap-6">
          <Link to="/" onClick={(e) => { if (isHome) { e.preventDefault(); scrollToTop(); } }} aria-label="Sunitha Enterprises home" className="shrink-0">
            <Logo />
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {NAV_ITEMS.map(item => (
              <button
                key={item.path}
                onClick={() => go(item.path)}
                aria-current={isActive(item) ? 'page' : undefined}
                className={cn(
                  'relative px-4 py-2 text-[0.9375rem] font-medium transition-colors duration-300',
                  isActive(item) ? 'text-white' : 'text-white/65 hover:text-white'
                )}
              >
                {item.label}
                <span
                  className={cn(
                    'absolute left-4 right-4 -bottom-0.5 h-px bg-glass-bright origin-left transition-transform duration-500 ease-[var(--ease-frame)]',
                    isActive(item) ? 'scale-x-100' : 'scale-x-0'
                  )}
                />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a href={COMPANY.phoneHref} className="hidden xl:flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white font-mono tabular">
              <Phone className="w-4 h-4 text-glass-bright" aria-hidden="true" />
              {COMPANY.phoneDisplay}
            </a>
            <button onClick={() => go('/contact')} className="btn btn-accent hidden sm:inline-flex !py-3 !px-5 text-sm">
              Get a quote
            </button>
            <button
              ref={toggleRef}
              className="lg:hidden -mr-2 flex h-11 w-11 items-center justify-center text-white"
              onClick={() => setOpen(v => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / tablet full-screen menu */}
      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={cn(
          'lg:hidden fixed inset-0 z-[45] bg-anthracite pt-[72px] flex flex-col transition-[opacity,visibility] duration-400',
          open ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        )}
      >
        <nav className="shell flex-1 flex flex-col justify-center gap-1 overflow-y-auto" aria-label="Mobile navigation">
          {[{ label: 'Home', path: '/' } as NavItem, ...NAV_ITEMS].map((item, i) => (
            <button
              key={item.path}
              onClick={() => { setOpen(false); setTimeout(() => go(item.path), 50); }}
              tabIndex={open ? 0 : -1}
              className={cn(
                'group flex items-baseline justify-between border-b border-white/[0.08] py-4 text-left font-display font-semibold font-wide text-[clamp(1.75rem,7vw,2.5rem)] leading-tight transition-[transform,opacity,color] duration-500 ease-[var(--ease-frame)]',
                (item.path === '/' ? isHome && !active : isActive(item)) ? 'text-glass-bright' : 'text-white',
                open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              )}
              style={{ transitionDelay: open ? `${80 + i * 45}ms` : '0ms' }}
            >
              {item.label}
              <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-glass-bright" aria-hidden="true" />
            </button>
          ))}
        </nav>
        <div className="shell grid grid-cols-2 gap-3 py-6" style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom, 0px))' }}>
          <a href={COMPANY.phoneHref} tabIndex={open ? 0 : -1} className="btn btn-line-light">
            <Phone className="w-4 h-4" aria-hidden="true" /> Call
          </a>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1} className="btn btn-accent">
            <MessageCircle className="w-4 h-4" aria-hidden="true" /> WhatsApp
          </a>
        </div>
      </div>
    </>
  );
};

const SYSTEM_LINKS = [
  { name: 'Sliding windows & doors', path: '/products/sliding-windows' },
  { name: 'Casement windows', path: '/products/casement-windows' },
  { name: 'Tilt & turn windows', path: '/products/tilt-and-turn-windows' },
  { name: 'Arch windows', path: '/products/arch-windows' },
  { name: 'Villa windows', path: '/products/villa-windows' },
];

export const Footer = () => {
  const go = useGo();
  const year = new Date().getFullYear();

  return (
    <footer className="stage-dark relative overflow-hidden">
      {/* Closing call to action */}
      <div className="shell">
        <div className="section-y border-b border-white/[0.08] grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow text-glass-bright mb-5">Start your project</p>
            <h2 className="display-lg text-white max-w-[18ch]">Planning new windows? Get a quote for your openings.</h2>
          </div>
          <div className="flex flex-col gap-4 lg:items-end">
            <p className="text-white/60 measure lg:text-right">
              Share your sizes or drawings. We'll recommend the right profile system and send a quote.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => go('/contact')} className="btn btn-accent">Get a quote</button>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-line-light">
                <MessageCircle className="w-4 h-4" aria-hidden="true" /> WhatsApp us
              </a>
            </div>
          </div>
      </div>
      </div>

      <div className="shell py-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div className="flex flex-col gap-5">
          <Logo />
          <p className="text-white/55 text-[0.9375rem] measure">
            Sunitha Enterprises designs, fabricates and installs uPVC windows and doors built on German aluplast profile systems.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {COMPANY.socials.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="text-sm text-white/55 hover:text-glass-bright">
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="eyebrow text-white/40 mb-5">Explore</h3>
          <ul className="flex flex-col gap-3">
            {[{ label: 'Home', path: '/' }, ...NAV_ITEMS].map(item => (
              <li key={item.path}>
                <button onClick={() => go(item.path)} className="text-[0.9375rem] text-white/75 hover:text-white">{item.label}</button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow text-white/40 mb-5">Window systems</h3>
          <ul className="flex flex-col gap-3">
            {SYSTEM_LINKS.map(s => (
              <li key={s.path}>
                <button onClick={() => go(s.path)} className="text-[0.9375rem] text-white/75 hover:text-white text-left">{s.name}</button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow text-white/40 mb-5">Contact</h3>
          <ul className="flex flex-col gap-4 text-[0.9375rem]">
            <li><a href={COMPANY.phoneHref} className="flex gap-3 text-white/75 hover:text-white font-mono tabular"><Phone className="w-4 h-4 mt-1 text-glass-bright shrink-0" aria-hidden="true" />{COMPANY.phoneDisplay}</a></li>
            <li><a href={`mailto:${COMPANY.email}`} className="flex gap-3 text-white/75 hover:text-white break-all"><Mail className="w-4 h-4 mt-1 text-glass-bright shrink-0" aria-hidden="true" />{COMPANY.email}</a></li>
            <li>
              <a href={COMPANY.mapUrl} target="_blank" rel="noopener noreferrer" className="flex gap-3 text-white/75 hover:text-white leading-relaxed">
                <MapPin className="w-4 h-4 mt-1 text-glass-bright shrink-0" aria-hidden="true" />
                <span>{COMPANY.addressLines.map(l => <span key={l} className="block">{l}</span>)}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="shell"><div className="py-6 border-t border-white/[0.08] flex flex-col sm:flex-row gap-2 justify-between text-xs text-white/40">
        <p>© {year} Sunitha Enterprises. All rights reserved.</p>
        <p>aluplast®, aludec® and woodec® are trademarks of aluplast GmbH.</p>
      </div></div>
    </footer>
  );
};

export const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  return <div className={cn('min-h-screen', isHomePath(pathname) ? '' : 'pt-[72px]')}>{children}</div>;
};
