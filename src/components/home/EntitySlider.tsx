import React, { useState, useEffect, useRef } from 'react';
import { Entity } from '../../types';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { EntityCard } from '../EntityCard';

interface EntitySliderProps {
  entities: Entity[];
  onSelectEntity: (entity: Entity) => void;
  onSwitchToEntities: () => void;
}

export const EntitySlider: React.FC<EntitySliderProps> = ({
  entities,
  onSelectEntity,
  onSwitchToEntities,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Show featured first, then by latest
  const featured = [
    ...entities.filter((e) => e.isFeatured),
    ...entities.filter((e) => !e.isFeatured),
  ].slice(0, 10);

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

  if (featured.length === 0) return null;

  const handleScrollLeft = () => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  const handleScrollRight = () => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' });

  return (
    <section className="bg-stone-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-stone-900 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-emerald-600 rounded-full inline-block" />
              Sorotan Komunitas
            </h2>
            <p className="text-sm font-medium text-stone-600 mt-1 ml-3.5">Komunitas unggulan & terbaru BJP.hub</p>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            {featured.length > 2 && (
              <div className="hidden sm:flex items-center gap-1">
                <button
                  onClick={handleScrollLeft}
                  disabled={!canScrollLeft}
                  aria-label="Sebelumnya"
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                    canScrollLeft
                      ? 'bg-white hover:bg-stone-100 border-stone-300 text-stone-800 shadow-2xs'
                      : 'bg-stone-50 border-stone-200 text-stone-300 cursor-not-allowed'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleScrollRight}
                  disabled={!canScrollRight}
                  aria-label="Selanjutnya"
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                    canScrollRight
                      ? 'bg-white hover:bg-stone-100 border-stone-300 text-stone-800 shadow-2xs'
                      : 'bg-stone-50 border-stone-200 text-stone-300 cursor-not-allowed'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
            <button
              onClick={onSwitchToEntities}
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-white hover:bg-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-300 transition-all"
            >
              Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Single-row Horizontal Scroll — exactly N cards visible per breakpoint */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {featured.map((entity) => (
            <div
              key={entity.id}
              className="snap-start shrink-0 w-[80%] sm:w-[calc(50%-10px)] md:w-[calc(33.333%-14px)] lg:w-[calc(25%-15px)]"
            >
              <EntityCard entity={entity} onSelect={onSelectEntity} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
