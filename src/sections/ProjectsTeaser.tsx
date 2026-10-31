import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowRight } from 'lucide-react';
import { SectionHead, useReveal } from '../components/ui';
import { getGalleries, type GalleryPhoto } from '../lib/galleryService';
import { prefersReducedMotion } from '../lib/motion';
import { cn } from '../lib/utils';

export function ProjectsTeaser() {
  const ref = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  useReveal(ref);

  useEffect(() => {
    getGalleries().then(r => setPhotos(r.galleries.flatMap(g => g.photos).slice(0, 5))).catch(() => setPhotos([]));
  }, []);

  useGSAP(() => {
    if (prefersReducedMotion() || !photos.length) return;
    gsap.utils.toArray<HTMLElement>('[data-parallax]', ref.current!).forEach((el, i) => {
      gsap.fromTo(el, { yPercent: -5 }, {
        yPercent: 5, ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
        delay: i * 0.02,
      });
    });
  }, { scope: ref, dependencies: [photos.length] });

  if (!photos.length) return null;

  return (
    <section ref={ref} id="projects" className="section-y bg-white" aria-labelledby="projects-title">
      <div className="shell">
        <SectionHead
          id="projects-title"
          eyebrow="Gallery"
          title="See the systems in place."
          intro="Panoramic sliders, arched elevations and tilt-and-turn windows in finished homes."
          aside={<button onClick={() => navigate('/gallery')} className="link-arrow w-fit">View the full gallery <ArrowRight className="h-4 w-4" aria-hidden="true" /></button>}
        />
        <div className="mt-12 grid auto-rows-[200px] grid-cols-2 gap-3 sm:auto-rows-[240px] lg:mt-16 lg:grid-cols-4 lg:gap-4">
          {photos.map((p, i) => (
            <button
              key={p.id}
              data-reveal
              onClick={() => navigate('/gallery')}
              className={cn(
                'group relative overflow-hidden rounded-[4px] bg-mist text-left',
                i === 0 && 'col-span-2 row-span-2'
              )}
            >
              <img
                data-parallax
                src={p.path}
                alt={p.title}
                className="absolute inset-0 -top-[6%] h-[112%] w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-frame)] group-hover:scale-[1.04]"
                loading="lazy"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-anthracite/75 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
              <span className="absolute bottom-4 left-4 right-4 text-white font-medium text-[0.9375rem]">{p.title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
