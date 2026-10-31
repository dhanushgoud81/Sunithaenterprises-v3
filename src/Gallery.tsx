import React, { useState, useEffect, useMemo } from 'react';
import { PageWrapper } from './components/Shared';
import { GalleryLightbox } from './components/GalleryLightbox';
import { getGalleries, Gallery, GalleryPhoto } from './lib/galleryService';
import { 
  Layers, 
  Images, 
  ArrowUpRight, 
  Eye, 
  Search
} from 'lucide-react';

export default function GalleryPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxPhotos, setLightboxPhotos] = useState<GalleryPhoto[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxTitle, setLightboxTitle] = useState('');

  // Initial load
  useEffect(() => {
    loadData(false);
  }, []);

  const loadData = async (forceRefresh = false) => {
    setIsLoading(true);

    try {
      const result = await getGalleries(forceRefresh);
      setGalleries(result.galleries);
    } catch (err) {
      console.error('Failed to load galleries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered photos based on active tab and search query
  const displayedPhotos = useMemo(() => {
    let pool: { photo: GalleryPhoto; galleryTitle: string; galleryId: string }[] = [];

    if (activeTab === 'all') {
      galleries.forEach((g) => {
        g.photos.forEach((p) => {
          pool.push({ photo: p, galleryTitle: g.title, galleryId: g.id });
        });
      });
    } else {
      const targetGallery = galleries.find((g) => g.id === activeTab);
      if (targetGallery) {
        targetGallery.photos.forEach((p) => {
          pool.push({ photo: p, galleryTitle: targetGallery.title, galleryId: targetGallery.id });
        });
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      pool = pool.filter(
        (item) =>
          item.photo.title.toLowerCase().includes(q) ||
          item.galleryTitle.toLowerCase().includes(q) ||
          item.photo.filename.toLowerCase().includes(q)
      );
    }

    return pool;
  }, [galleries, activeTab, searchQuery]);

  const openLightbox = (photos: GalleryPhoto[], startIndex: number, title: string) => {
    setLightboxPhotos(photos);
    setLightboxIndex(startIndex);
    setLightboxTitle(title);
    setLightboxOpen(true);
  };

  const handleNextPhoto = () => {
    setLightboxIndex((prev) => (prev + 1) % lightboxPhotos.length);
  };

  const handlePrevPhoto = () => {
    setLightboxIndex((prev) => (prev - 1 + lightboxPhotos.length) % lightboxPhotos.length);
  };

  const totalPhotosCount = useMemo(() => {
    return galleries.reduce((acc, g) => acc + g.count, 0);
  }, [galleries]);

  return (
    <PageWrapper>

      {/* ── Page intro ─────────────────────────────────────────────────────── */}
      <header className="bg-paper">
        <div className="shell pt-16 pb-10 lg:pt-24 lg:pb-14">
          <p className="eyebrow text-glass mb-5">Gallery</p>
          <h1 className="display-xl max-w-[16ch]">uPVC windows in finished homes.</h1>
          <p className="mt-6 text-muted text-lg measure">Sliding doors, arched elevations and tilt-and-turn windows, photographed in place.</p>
        </div>
      </header>

      {/* ── Main Gallery Section ─────────────────────────────────────────── */}
      <section className="pb-20 md:pb-28 bg-paper min-h-[60vh] text-ink" id="gallery-grid">
        <div className="shell">

          {/* Controls Bar: Gallery Tabs & Search */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 pb-8 mb-8 border-b border-slate-200">
            
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200 border ${
                  activeTab === 'all'
                    ? 'bg-slate-950 text-white border-slate-950 shadow-md'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-electric-blue hover:text-electric-blue'
                }`}
              >
                All Works ({totalPhotosCount})
              </button>

              {galleries.map((gallery) => (
                <button
                  key={gallery.id}
                  onClick={() => setActiveTab(gallery.id)}
                  className={`px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200 border flex items-center gap-2 ${
                    activeTab === gallery.id
                      ? 'bg-electric-blue text-white border-electric-blue shadow-md'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-electric-blue hover:text-electric-blue'
                  }`}
                >
                  <span>{gallery.title}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                      activeTab === gallery.id
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {gallery.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search photos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search photos" className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-slate-200 text-primary placeholder-slate-400 focus:outline-none focus:border-electric-blue transition-colors rounded-none font-sans"
              />
            </div>
          </div>

          {/* Gallery Overview Cards (When "All" is selected and no search) */}
          {activeTab === 'all' && !searchQuery && galleries.length > 1 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="eyebrow text-glass">
                    Curated Collections
                  </span>
                  <h3 className="text-2xl font-semibold font-display font-semiwide">
                    Active Gallery Folders
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  {galleries.length} detected folders
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleries.map((gallery) => (
                  <div
                    key={gallery.id}
                    onClick={() => setActiveTab(gallery.id)}
                    className="group relative bg-slate-950 rounded-[4px] overflow-hidden border border-white/10 shadow-xl cursor-pointer hover:border-electric-blue transition-all duration-300"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={gallery.coverImage}
                        alt={gallery.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                      
                      <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-mono font-bold text-white border border-white/20 flex items-center gap-1.5">
                        <Images className="w-3.5 h-3.5 text-electric-blue" />
                        <span>{gallery.count} photos</span>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="text-lg font-bold font-display text-white uppercase tracking-tight group-hover:text-glass-bright transition-colors">
                          {gallery.title}
                        </h4>
                        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-electric-blue group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {gallery.description}
                      </p>
                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-glass-bright font-bold font-display uppercase tracking-wider">
                        <span>View Full Gallery</span>
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section Subhead for Photos */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="eyebrow text-glass">
                {activeTab === 'all' ? 'Entire Collection' : galleries.find(g => g.id === activeTab)?.title}
              </span>
              <h3 className="text-2xl sm:text-3xl font-semibold font-display font-semiwide">
                Photographs
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Showing {displayedPhotos.length} {displayedPhotos.length === 1 ? 'photo' : 'photos'}
            </span>
          </div>

          {/* Loading Skeleton */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="aspect-[4/3] bg-slate-200 animate-pulse rounded-[4px] border border-slate-300" />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && displayedPhotos.length === 0 && (
            <div className="py-20 text-center bg-white border border-slate-200 rounded-[4px] p-8">
              <Layers className="w-12 h-12 mx-auto text-slate-400 mb-4 stroke-1" />
              <h4 className="text-xl font-bold font-display uppercase text-primary mb-2">
                No Photos Found
              </h4>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                {searchQuery
                  ? `No photos matched "${searchQuery}". Try clearing the search filter.`
                  : 'No photos are currently available in this collection. Please check back soon.'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-2.5 bg-electric-blue text-white text-xs font-bold uppercase tracking-widest"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}

          {/* Main Photo Grid */}
          {!isLoading && displayedPhotos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedPhotos.map((item, idx) => {
                const photosList = displayedPhotos.map((dp) => dp.photo);
                return (
                  <div
                    key={item.photo.id}
                    onClick={() => openLightbox(photosList, idx, item.galleryTitle)}
                    className="group relative bg-slate-950 aspect-[4/3] overflow-hidden rounded-[4px] cursor-pointer border border-slate-200 shadow-lg hover:shadow-2xl hover:border-electric-blue transition-all duration-300"
                  >
                    {/* Image */}
                    <img
                      src={item.photo.path}
                      alt={item.photo.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />

                    {/* Dark gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Hover Info & View Action */}
                    <div className="absolute inset-0 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex justify-between items-start">
                        <span className="bg-slate-950/80 backdrop-blur-md text-glass-bright text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border border-glass-bright/30">
                          {item.galleryTitle}
                        </span>
                        <div className="p-1.5 bg-electric-blue text-white rounded-none shadow-md">
                          <Eye className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      <div>
                        <h5 className="text-white font-display text-base font-bold uppercase tracking-tight leading-snug">
                          {item.photo.title}
                        </h5>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          Click to view full size
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* Fullscreen Lightbox Viewer */}
      <GalleryLightbox
        isOpen={lightboxOpen}
        photos={lightboxPhotos}
        currentIndex={lightboxIndex}
        galleryTitle={lightboxTitle}
        onClose={() => setLightboxOpen(false)}
        onNext={handleNextPhoto}
        onPrev={handlePrevPhoto}
        onSelectIndex={(idx) => setLightboxIndex(idx)}
      />
    </PageWrapper>
  );
}
