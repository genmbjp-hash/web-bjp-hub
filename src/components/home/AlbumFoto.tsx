import React, { useState, useEffect, useRef } from 'react';
import { Entity } from '../../types';
import { formatImageUrl } from '../../utils/imageUrl';
import { FALLBACK_IMAGE_URL } from '../../constants/defaults';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

interface AlbumFotoProps {
  entities: Entity[];
}

export const AlbumFoto: React.FC<AlbumFotoProps> = ({ entities }) => {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Collect all product photos from entities
  const allPhotos: { src: string; caption: string; entity: string }[] = [];
  entities.forEach((e) => {
    if (e.productPhotos && e.productPhotos.length > 0) {
      e.productPhotos.forEach((photo, idx) => {
        allPhotos.push({
          src: formatImageUrl(photo) || photo,
          caption: e.productPhotoCaptions?.[idx] || e.name,
          entity: e.name,
        });
      });
    } else if (e.image) {
      allPhotos.push({
        src: formatImageUrl(e.image),
        caption: e.name,
        entity: e.name,
      });
    }
  });

  const photos = allPhotos.slice(0, 20);

  // Auto scroll effect
  useEffect(() => {
    if (photos.length <= 1 || isHovered) return;
    
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
      }
    }, 3500); // 3.5 seconds

    return () => clearInterval(interval);
  }, [photos.length, isHovered]);

  if (photos.length === 0) return null;

  const openLightbox = (idx: number) => {
    setLightboxIdx(idx);
    setLightboxSrc(photos[idx].src);
  };

  const closeLightbox = () => setLightboxSrc(null);

  const prevPhoto = () => {
    const idx = (lightboxIdx - 1 + photos.length) % photos.length;
    setLightboxIdx(idx);
    setLightboxSrc(photos[idx].src);
  };

  const nextPhoto = () => {
    const idx = (lightboxIdx + 1) % photos.length;
    setLightboxIdx(idx);
    setLightboxSrc(photos[idx].src);
  };

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  return (
    <section className="bg-stone-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
          <div>
            <h2 className="text-xl font-black text-white">Foto Kegiatan Terbaru</h2>
            <p className="text-xs text-stone-400 mt-0.5">Galeri kegiatan warga Bintara Jaya Permai</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => scroll('left')} className="p-2 text-stone-400 hover:text-white transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={() => scroll('right')} className="p-2 text-stone-400 hover:text-white transition-colors">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Photo Slider */}
        <div 
          ref={scrollRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
          className="flex gap-4 overflow-x-auto py-4 snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {photos.map((photo, idx) => (
            <button
              key={idx}
              onClick={() => openLightbox(idx)}
              className="flex-shrink-0 w-56 sm:w-64 md:w-72 lg:w-80 group relative aspect-square rounded-2xl overflow-hidden bg-stone-800 border-2 border-transparent hover:border-amber-400 transition-all snap-start shadow-xl"
            >
              <img
                src={photo.src}
                alt={photo.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE_URL; }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <ZoomIn className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-[10px] font-medium line-clamp-1">{photo.caption}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-sm"
            onClick={closeLightbox}
          >
            <X className="w-5 h-5" />
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-sm"
            onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <img
            src={lightboxSrc}
            alt={photos[lightboxIdx]?.caption}
            className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE_URL; }}
          />

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-sm"
            onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-center">
            <p className="text-white text-sm font-medium">{photos[lightboxIdx]?.caption}</p>
            <p className="text-stone-400 text-xs mt-1">{lightboxIdx + 1} / {photos.length}</p>
          </div>
        </div>
      )}
    </section>
  );
};
