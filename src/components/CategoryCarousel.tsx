import React, { useState, useEffect } from 'react';
import { Entity, CategoryHeaderConfig } from '../types';
import { EntityCard } from './EntityCard';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { formatImageUrl } from '../utils/imageUrl';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { ScrollNavButton } from './ui/ScrollNavButton';
import { useDragScroll } from '../hooks/useDragScroll';

interface CategoryCarouselProps {
  catConfig: CategoryHeaderConfig;
  entities: Entity[];
  onVisitCategory: (catName: string) => void;
  onSelectEntity: (entity: Entity) => void;
  onShareEntity: (entity: Entity) => void;
  onEditEntity?: (entity: Entity) => void;
  isCMSActive?: boolean;
}

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  catConfig,
  entities,
  onVisitCategory,
  onSelectEntity,
  onShareEntity,
  onEditEntity,
  isCMSActive = true,
}) => {
  const scrollRef = useDragScroll<HTMLDivElement>();
  const [isHovered, setIsHovered] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll bounds
  const checkScrollBounds = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScrollBounds();
    el.addEventListener('scroll', checkScrollBounds);
    window.addEventListener('resize', checkScrollBounds);

    return () => {
      el.removeEventListener('scroll', checkScrollBounds);
      window.removeEventListener('resize', checkScrollBounds);
    };
  }, [entities]);

  // Auto-slide effect every 3.5s if not hovered and multiple items exist
  useEffect(() => {
    if (isHovered || entities.length <= 1) return;

    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const cardWidth = 320; // approximate width of card + gap

      if (scrollLeft + clientWidth >= scrollWidth - 15) {
        // Scroll back to start
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isHovered, entities.length]);

  const handleScrollLeft = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const handleScrollRight = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
  };

  const rawLogo = catConfig.logoUrl || (entities.length > 0 ? entities[0].image : null);
  const categoryLogo = rawLogo ? formatImageUrl(rawLogo) : null;

  return (
    <Card
      padding="md"
      className="space-y-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Category Header with Logo & Visit CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3.5">
        <div className="flex items-center gap-3.5">
          {categoryLogo ? (
            <img
              src={categoryLogo}
              alt={catConfig.name}
              loading="lazy"
              decoding="async"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-contain bg-white border border-stone-200 p-1.5 shadow-2xs shrink-0"
              onError={(e) => {
                const parent = (e.target as HTMLImageElement).parentElement;
                (e.target as HTMLImageElement).style.display = 'none';
                if (parent && !parent.querySelector('.carousel-fallback')) {
                  const fallback = document.createElement('div');
                  fallback.className = 'carousel-fallback w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold text-base shrink-0 border border-emerald-900';
                  fallback.innerText = catConfig.name.charAt(0).toUpperCase();
                  parent.insertBefore(fallback, e.target as HTMLImageElement);
                }
              }}
            />
          ) : (
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold text-base shrink-0 border border-emerald-900">
              {catConfig.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-xl font-bold text-stone-900 tracking-tight leading-snug">
                {catConfig.name}
              </h3>
              <Badge variant="accent">{entities.length} Card</Badge>
            </div>
            <p className="text-xs text-stone-500 mt-0.5 max-w-2xl line-clamp-1">
              {catConfig.description || `Unit komunitas & kegiatan warga dalam kategori ${catConfig.name}`}
            </p>
          </div>
        </div>

        {/* Small Simple CTA "Kunjungi [Nama Komunitas/Kategori]" */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            onClick={() => onVisitCategory(catConfig.name)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 hover:text-emerald-900 border border-emerald-200/80 text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
          >
            <span>Kunjungi {catConfig.name}</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Nav Controls */}
          {entities.length > 2 && (
            <div className="hidden sm:flex items-center gap-1 pl-2 border-l border-stone-200">
              <ScrollNavButton direction="left" onClick={handleScrollLeft} disabled={!canScrollLeft} aria-label="Previous Slide" />
              <ScrollNavButton direction="right" onClick={handleScrollRight} disabled={!canScrollRight} aria-label="Next Slide" />
            </div>
          )}
        </div>
      </div>

      {/* Auto Sliding Horizontal Scroll Container */}
      <div className="relative group">
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-1 px-0.5 cursor-grab select-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {entities.map((entity) => (
            <div
              key={entity.id}
              className="snap-start shrink-0 w-[270px] sm:w-[310px] lg:w-[340px] flex flex-col"
            >
              <EntityCard
                entity={entity}
                onSelect={onSelectEntity}
                onShare={onShareEntity}
                onEdit={onEditEntity}
                isCMSActive={isCMSActive}
              />
            </div>
          ))}
        </div>

        {/* Floating Arrow Indicators for Mobile / On Hover */}
        {entities.length > 2 && (
          <>
            {canScrollLeft && (
              <button
                onClick={handleScrollLeft}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/95 text-stone-800 shadow-lg border border-stone-200 flex items-center justify-center hover:bg-white hover:scale-105 transition-all cursor-pointer sm:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
                aria-label="Scroll Left"
              >
                <ChevronLeft className="w-5 h-5 text-stone-700" />
              </button>
            )}
            {canScrollRight && (
              <button
                onClick={handleScrollRight}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/95 text-stone-800 shadow-lg border border-stone-200 flex items-center justify-center hover:bg-white hover:scale-105 transition-all cursor-pointer sm:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
                aria-label="Scroll Right"
              >
                <ChevronRight className="w-5 h-5 text-stone-700" />
              </button>
            )}
          </>
        )}
      </div>
    </Card>
  );
};
