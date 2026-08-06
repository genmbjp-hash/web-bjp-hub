import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MediaPartnerItem } from '../types';
import { Instagram, Youtube, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatImageUrl } from '../utils/imageUrl';

interface MediaPartnersSectionProps {
  partners?: MediaPartnerItem[];
  mediaPartners?: MediaPartnerItem[];
}

export const MediaPartnersSection: React.FC<MediaPartnersSectionProps> = ({
  partners,
  mediaPartners
}) => {
  const itemsList = partners || mediaPartners || [];
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Touch Swipe tracking
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Filter active partners sorted by order
  const activePartners = itemsList
    .filter((p) => p.enabled)
    .sort((a, b) => a.order - b.order);

  // Auto slide timer (every 4 seconds)
  useEffect(() => {
    if (activePartners.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activePartners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [activePartners.length, isHovered]);

  if (activePartners.length === 0) return null;

  const handlePrev = useCallback(() => {
    if (activePartners.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + activePartners.length) % activePartners.length);
  }, [activePartners.length]);

  const handleNext = useCallback(() => {
    if (activePartners.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % activePartners.length);
  }, [activePartners.length]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 40) handleNext();
    else if (distance < -40) handlePrev();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section className="my-6 bg-gradient-to-br from-stone-900 via-stone-900 to-emerald-950 text-white rounded-3xl p-4 sm:p-6 shadow-xl border border-stone-800 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Section (Title strictly "Media Partner", subtitle removed) */}
      <div className="flex items-center justify-between gap-3 mb-4 border-b border-stone-800 pb-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 bg-amber-500/20 text-amber-300 rounded-xl shrink-0 border border-amber-500/30">
            <Users className="w-4 h-4" />
          </span>
          <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
            Media Partner
          </h2>
        </div>

        {/* Navigation Buttons */}
        {activePartners.length > 1 && (
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handlePrev}
              className="p-2 bg-stone-800 hover:bg-emerald-600 text-stone-200 hover:text-white rounded-lg transition-all border border-stone-700/80 cursor-pointer shadow-xs"
              title="Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 bg-stone-800 hover:bg-emerald-600 text-stone-200 hover:text-white rounded-lg transition-all border border-stone-700/80 cursor-pointer shadow-xs"
              title="Selanjutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Partners Carousel Container */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative z-10 overflow-hidden py-1"
      >
        {/* Responsive Flex Track Carousel */}
        <div
          className="flex transition-transform duration-500 ease-out gap-3"
          style={{
            transform: `translateX(-${currentIndex * (100 / Math.min(activePartners.length, 5))}%)`,
          }}
        >
          {activePartners.map((item, idx) => {
            const isHighlighted = idx === currentIndex;
            const logo = item.logoUrl
              ? formatImageUrl(item.logoUrl)
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=0D9488&color=fff&bold=true`;

            return (
              <div
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-[calc(70%-8px)] sm:w-[calc(45%-8px)] md:w-[calc(30%-8px)] lg:w-[calc(20%-9.6px)] shrink-0 p-3.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between gap-3 bg-stone-800/90 hover:bg-stone-800 cursor-pointer ${
                  isHighlighted
                    ? 'border-emerald-400/80 bg-stone-800 shadow-md ring-1 ring-emerald-400/30'
                    : 'border-stone-700/60 hover:border-stone-600 opacity-90 hover:opacity-100'
                }`}
              >
                {/* Top: Logo + Name / Description (No Subtitle) */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={logo}
                      alt={item.name}
                      className="w-10 h-10 rounded-xl object-cover border border-stone-600 bg-stone-900 shadow-xs"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=0D9488&color=fff&bold=true`;
                      }}
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border border-stone-800 rounded-full" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-extrabold text-white text-xs sm:text-sm leading-snug break-words" title={item.name}>
                      {item.name}
                    </h3>
                  </div>
                </div>

                {/* Bottom: Social Media Icons */}
                <div className="pt-2 border-t border-stone-700/60 flex items-center justify-end gap-1.5 shrink-0">
                  {item.instagramEnabled && item.instagramUrl && (
                    <a
                      href={item.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-lg transition-all shadow-xs flex items-center justify-center"
                      title={`Instagram ${item.name}`}
                    >
                      <Instagram className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {item.youtubeEnabled && item.youtubeUrl && (
                    <a
                      href={item.youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all shadow-xs flex items-center justify-center"
                      title={`YouTube ${item.name}`}
                    >
                      <Youtube className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Pagination Dots */}
        {activePartners.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 pt-3.5">
            {activePartners.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setCurrentIndex(dotIdx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  dotIdx === currentIndex
                    ? 'w-6 bg-emerald-400 shadow-xs'
                    : 'w-2 bg-stone-600 hover:bg-stone-400'
                }`}
                title={`Ke slide #${dotIdx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
