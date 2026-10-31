import React from 'react';
import { MessageCircle } from 'lucide-react';
import { whatsappLink } from '../config/company';

export const WhatsAppWidget = () => (
  <a
    href={whatsappLink()}
    target="_blank"
    rel="noopener noreferrer"
    className="group fixed right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.45)] transition-transform duration-300 hover:scale-105 animate-[fadeIn_.6s_ease_1s_both]"
    style={{ bottom: 'max(20px, calc(env(safe-area-inset-bottom, 0px) + 12px))' }}
    aria-label="Chat with us on WhatsApp"
  >
    <span className="pointer-events-none absolute right-[4.25rem] whitespace-nowrap rounded-[2px] bg-anthracite px-3 py-2 text-xs font-medium text-white opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
      Chat on WhatsApp
    </span>
    <MessageCircle className="h-6 w-6" strokeWidth={2.2} aria-hidden="true" />
  </a>
);
