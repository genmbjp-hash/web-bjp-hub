import React, { useState, useEffect, useRef } from 'react';
import { Entity, PhotoAlbumItem } from '../types';
import { formatImageUrl } from '../utils/imageUrl';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Images,
  ExternalLink,
  Edit2,
  Trash2,
  Share2,
} from 'lucide-react';
import { useDragScroll } from '../hooks/useDragScroll';

interface PhotoAlbumCardProps {
  entity: Entity;
  onSelect?: (entity: Entity) => void;
  onShare?: (entity: Entity) => void;
  onEdit?: (entity: Entity) => void;
  onDelete?: (id: string) => void;
  isCMSAllowed?: boolean;
}

export const PhotoAlbumCard: React.FC<PhotoAlbumCardProps> = ({
  entity,
  onSelect,
  onShare,
  onEdit,
  onDelete,
  isCMSAllowed = false,
}) => {
  const photos: PhotoAlbumItem[] = (entity.albumPhotos && entity.albumPhotos.length > 0)
    ? entity.albumPhotos.filter((p) => p.enabled)
    : (entity.productPhotos && entity.productPhotos.length > 0)
    ? entity.productPhotos.map((url, idx) => ({
        id: `ph-${idx}`,
        url,
        caption: entity.productPhotoCaptions?.[idx] || '',
        enabled: true,
      }))
    : entity.image
    ? [{ id: 'ph-main', url: entity.image, caption: entity.name, enabled: true }]
    : [];

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const autoSlideTimerRef = useRef<any>(null);
  const thumbStripRef = useDragScroll<HTMLDivElement>();

  // Auto-slide every 3 seconds (3000ms)
  useEffect(() => {
    if (photos.length <= 1 || isPaused || lightboxOpen) return;

    autoSlideTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 3000);

    return () => {
      if (autoSlideTimerRef.current) clearInterval(autoSlideTimerRef.current);
    };
  }, [photos.length, isPaused, lightboxOpen]);

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (photos.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (photos.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const activePhoto = photos[currentIndex];

  return (
    <div
      className="bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md hover:border-stone-300 transition-all duration-300 overflow-hidden group flex flex-col justify-between"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top Main Photo Carousel Display */}
      <div className="relative aspect-4/3 bg-stone-900 overflow-hidden">
        {photos.length > 0 && activePhoto ? (
          <img
            src={formatImageUrl(activePhoto.url)}
            alt={activePhoto.caption || entity.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
            onClick={() => openLightbox(currentIndex)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone-500 p-4">
            <Images className="w-10 h-10 mb-2 opacity-50" />
            <span className="text-xs font-semibold">Album Foto Kosong</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-900/80 text-emerald-100 rounded-full text-xs font-bold border border-emerald-700/50">
            <Images className="w-3.5 h-3.5 text-emerald-300" />
            <span>Album Foto ({photos.length})</span>
          </span>

          <span className="px-2.5 py-1 bg-stone-900/80 text-stone-200 rounded-full text-[11px] font-extrabold border border-stone-600/40">
            {entity.category}
          </span>
        </div>

        {/* Left / Right Carousel Controls */}
        {photos.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs cursor-pointer z-10"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs cursor-pointer z-10"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Lightbox Expand Button */}
        {photos.length > 0 && (
          <button
            onClick={() => openLightbox(currentIndex)}
            className="absolute bottom-3 right-3 p-2 rounded-xl bg-stone-900/80 hover:bg-emerald-800 text-white transition-colors cursor-pointer z-10"
            title="Lihat foto layar penuh"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        )}

        {/* Caption Bar Overlay */}
        {activePhoto?.caption && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-6 text-white text-xs z-10">
            <p className="line-clamp-1 font-medium italic text-stone-100">
              "{activePhoto.caption}"
            </p>
          </div>
        )}

        {/* Dot Indicators */}
        {photos.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
            {photos.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx ? 'w-5 bg-emerald-400' : 'w-1.5 bg-white/60 hover:bg-white'
                }`}
                aria-label={`Go to photo ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Content & Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3
            onClick={() => onSelect?.(entity)}
            className={`font-extrabold text-stone-900 text-base sm:text-lg leading-snug ${onSelect ? 'cursor-pointer' : ''}`}
          >
            {entity.name}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 mt-1.5 leading-relaxed">
            {entity.description}
          </p>
        </div>

        {/* Thumbnail Preview Strip */}
        {photos.length > 1 && (
          <div ref={thumbStripRef} className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 border-t border-b border-stone-100 cursor-grab select-none">
            {photos.map((p, idx) => (
              <img
                key={p.id || idx}
                src={formatImageUrl(p.url)}
                alt={`Thumb ${idx + 1}`}
                loading="lazy"
                decoding="async"
                onClick={() => setCurrentIndex(idx)}
                className={`w-10 h-10 object-cover rounded-lg cursor-pointer border transition-all shrink-0 ${
                  currentIndex === idx
                    ? 'border-emerald-600 ring-2 ring-emerald-400/40 scale-105'
                    : 'border-stone-200 opacity-70 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-between gap-2 border-t border-stone-100 text-xs">
          <div className="flex items-center gap-1.5">
            {onSelect && (
              <button
                onClick={() => onSelect(entity)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl transition-colors shadow-2xs"
              >
                <span>Lihat Detail</span>
              </button>
            )}
            {entity.ctaUrl && (
              <a
                href={entity.ctaUrl}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 font-bold rounded-xl transition-colors ${
                  onSelect
                    ? 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                    : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-2xs'
                }`}
              >
                <span>{entity.ctaWording || 'Kunjungi Tautan'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {!onSelect && !entity.ctaUrl && (
              <button
                onClick={() => openLightbox(currentIndex)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl transition-colors"
              >
                <Images className="w-3.5 h-3.5 text-emerald-700" />
                <span>Buka Galeri Foto</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-1">
            {onShare && (
              <button
                onClick={() => onShare(entity)}
                className="p-1.5 text-stone-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                title="Bagikan"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}
            {/* CMS Controls if logged in */}
            {isCMSAllowed && (
              <>
                {onEdit && (
                  <button
                    onClick={() => onEdit(entity)}
                    className="p-1.5 text-stone-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Edit Album Foto"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(entity.id)}
                    className="p-1.5 text-stone-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus Album Foto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && photos.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col items-center justify-between p-4"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Top Bar */}
          <div className="w-full max-w-6xl flex items-center justify-between text-white py-2">
            <div>
              <h4 className="font-bold text-base">{entity.name}</h4>
              <p className="text-xs text-stone-400">
                Foto {lightboxIndex + 1} dari {photos.length}
              </p>
            </div>
            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2 text-stone-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Main Image */}
          <div
            className="relative flex-1 w-full max-w-5xl flex items-center justify-center my-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={formatImageUrl(photos[lightboxIndex]?.url)}
              alt={photos[lightboxIndex]?.caption || entity.name}
              className="max-h-[80vh] max-w-full object-contain rounded-xl shadow-lg"
            />

            {/* Arrows */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setLightboxIndex((prev) => (prev - 1 + photos.length) % photos.length)
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setLightboxIndex((prev) => (prev + 1) % photos.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Lightbox Caption Footer */}
          <div className="w-full max-w-3xl text-center text-white pb-4">
            {photos[lightboxIndex]?.caption && (
              <p className="text-sm font-semibold text-stone-100 bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl inline-block border border-white/10 shadow-md">
                "{photos[lightboxIndex]?.caption}"
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
