import React from 'react';
import { cn } from '../lib/utils';

/** Window-mark: a frame with a tilted sash line. Uses currentColor + accent. */
export const LogoMark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
    <rect x="3" y="3" width="26" height="26" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
    <path d="M16 3v26M3 16h13" stroke="currentColor" strokeWidth="1.6" />
    <path d="M19.5 7.5h6v17h-6z" fill="#5CB8F2" opacity=".9" />
  </svg>
);

export const Logo = ({ className, tone = 'light' }: { className?: string; tone?: 'light' | 'dark' }) => (
  <span className={cn('flex items-center gap-3', className)}>
    <LogoMark className={cn('w-8 h-8 shrink-0', tone === 'light' ? 'text-white' : 'text-ink')} />
    <span className="flex flex-col leading-none">
      <span className={cn('font-display font-semibold text-[1.35rem] font-wide tracking-[-0.01em]', tone === 'light' ? 'text-white' : 'text-ink')}>
        Sunitha
      </span>
      <span className={cn('font-mono text-[0.625rem] tracking-[0.22em] uppercase mt-1', tone === 'light' ? 'text-sky' : 'text-brand')}>
        Enterprises
      </span>
    </span>
  </span>
);
