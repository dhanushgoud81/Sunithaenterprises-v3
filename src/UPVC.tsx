import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageWrapper } from './components/Shared';
import { Hero } from './sections/Hero';
import { WhyUpvc } from './sections/WhyUpvc';
import { TypesAccordion } from './sections/TypesAccordion';
import { ProfilesAlternating } from './sections/ProfilesAlternating';
import { LaminationStrips } from './sections/LaminationStrips';
import { scrollToId } from './lib/scroll';

export default function UPVC() {
  const { hash } = useLocation();

  // Deep links such as /#upvc-profiles (from other pages or shared URLs)
  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    const t = window.setTimeout(() => { ScrollTrigger.refresh(); scrollToId(id, true); }, 120);
    return () => window.clearTimeout(t);
  }, [hash]);

  return (
    <PageWrapper>
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'aluplast uPVC Window & Door Systems',
          image: 'https://srikalaprojects.com/images/upvc-hero-luxury.jpg',
          description: 'High-performance uPVC profile systems engineered with German aluplast technology, offering up to 45 dB noise insulation and high wind load resistance.',
          brand: { '@type': 'Brand', name: 'aluplast' },
          offers: { '@type': 'AggregateOffer', priceCurrency: 'INR', itemCondition: 'https://schema.org/NewCondition' },
        })}
      </script>
      <Hero />
      <WhyUpvc />
      <TypesAccordion />
      <ProfilesAlternating />
      <LaminationStrips />
    </PageWrapper>
  );
}
