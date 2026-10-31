import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ExternalLink, Maximize2 } from 'lucide-react';
import { GalleryPhoto } from '../lib/galleryService';

interface GalleryLightboxProps {
  photos: GalleryPhoto[];
  currentIndex: number;
  galleryTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSelectIndex: (index: number) => void;
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
  photos,
  currentIndex,
  galleryTitle,
  isOpen,
  onClose,
  onNext,
  onPrev,
  onSelectIndex,
}) => {
  const currentPhoto = photos[currentIndex];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    },
    [isOpen, onClose, onNext, onPrev]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !currentPhoto) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image Lightbox"
      data-lenis-prevent className="fixed inset-0 z-[100] flex flex-col bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300 select-none"
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/80 z-20">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 bg-electric-blue rounded-full animate-pulse" />
          <span className="text-white font-oswald uppercase tracking-widest text-sm font-bold">
            {galleryTitle}
          </span>
          <span className="text-slate-500 font-mono text-xs hidden sm:inline">
            / {photos.length} photos
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={currentPhoto.path}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"
            title="Open original image"
            aria-label="Open original image"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"
            title="Close (Esc)"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden">
        {/* Navigation Arrows */}
        {photos.length > 1 && (
          <>
            <button
              onClick={onPrev}
              aria-label="Previous photo"
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 md:p-4 bg-slate-900/80 hover:bg-electric-blue text-white rounded-none border border-white/10 backdrop-blur-md shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 group"
            >
              <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={onNext}
              aria-label="Next photo"
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 md:p-4 bg-slate-900/80 hover:bg-electric-blue text-white rounded-none border border-white/10 backdrop-blur-md shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 group"
            >
              <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </>
        )}

        {/* Central Display Image */}
        <div className="relative max-w-full max-h-[75vh] flex items-center justify-center">
          <img
            key={currentPhoto.id}
            src={currentPhoto.path}
            alt={currentPhoto.title}
            className="max-h-[75vh] max-w-full w-auto object-contain shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 rounded-sm transition-transform duration-300"
          />
        </div>
      </div>

      {/* Bottom Bar with Caption & Thumbnails */}
      <div className="px-6 py-4 border-t border-white/10 bg-slate-950/90 z-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h4 className="text-white font-oswald text-lg md:text-xl font-bold uppercase tracking-tight">
              {currentPhoto.title}
            </h4>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              File: {currentPhoto.filename}
            </p>
          </div>

          {/* Photo Counter */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-xl font-black text-electric-blue">
              {String(currentIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-slate-600 font-mono text-sm">/</span>
            <span className="font-mono text-sm text-slate-400">
              {String(photos.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Thumbnail Carousel */}
        {photos.length > 1 && (
          <div className="max-w-4xl mx-auto mt-4 flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {photos.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => onSelectIndex(idx)}
                className={`relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0 overflow-hidden border-2 transition-all ${
                  idx === currentIndex
                    ? 'border-electric-blue scale-105 ring-2 ring-electric-blue/40 shadow-lg'
                    : 'border-white/10 opacity-50 hover:opacity-100'
                }`}
                aria-label={`Go to image ${idx + 1}`}
              >
                <img
                  src={p.path}
                  alt={p.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
