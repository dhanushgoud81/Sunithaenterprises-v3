import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar, Footer } from './components/Shared';
import { ScrollToTop } from './components/ScrollToTop';
import { AccessibilityWidget } from './components/AccessibilityWidget';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { applyPrefsToDocument } from './lib/motion';
import { startSmoothScroll, stopSmoothScroll, scrollToTop } from './lib/scroll';
import UPVC from './UPVC';

// Secondary pages load on demand so the home page ships less JavaScript.
const Contact = lazy(() => import('./Contact'));
const Gallery = lazy(() => import('./Gallery'));
const ProductPage = lazy(() => import('./ProductPage'));
const NotFound = lazy(() => import('./NotFound'));

const pageTitles: Record<string, string> = {
  '/':        'Sunitha Enterprises | Premium uPVC Windows & Doors',
  '/upvc':    'Sunitha Enterprises | Premium uPVC Windows & Doors',
  '/gallery': 'Gallery | Sunitha Enterprises',
  '/contact': 'Get a Quote | Sunitha Enterprises',
};

export default function App() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    applyPrefsToDocument();
    startSmoothScroll();
    return () => stopSmoothScroll();
  }, []);

  // New page: title, back to top (unless jumping to a section), re-measure scroll scenes.
  useEffect(() => {
    if (pageTitles[pathname]) document.title = pageTitles[pathname];
    if (!hash) scrollToTop(true);
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => window.clearTimeout(t);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-white focus:px-4 focus:py-2 focus:text-ink">
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="flex-grow">
        <Suspense fallback={<div className="min-h-screen pt-[72px]" aria-busy="true" />}>
        <Routes>
          <Route path="/"                element={<UPVC />} />
          <Route path="/upvc"            element={<UPVC />} />
          <Route path="/products/:slug"  element={<ProductPage />} />
          <Route path="/gallery"         element={<Gallery />} />
          <Route path="/contact"         element={<Contact />} />
          <Route path="*"                element={<NotFound />} />
        </Routes>
        </Suspense>
      </main>
      <ScrollToTop />
      <AccessibilityWidget />
      <WhatsAppWidget />
      <Footer />
    </div>
  );
}
