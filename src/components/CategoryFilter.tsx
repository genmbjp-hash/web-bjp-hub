import React from 'react';
import { Search, X } from 'lucide-react';
import { Container } from './ui/Container';
import { useDragScroll } from '../hooks/useDragScroll';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchTerm = '',
  onSearchChange,
}) => {
  const scrollRef = useDragScroll<HTMLDivElement>();

  return (
    <div className="bg-stone-50 border-b border-stone-200 py-3 sticky top-16 z-30 shadow-2xs">
      <Container className="space-y-2.5">
        {/* Search Bar */}
        {onSearchChange && (
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari komunitas"
              className="w-full pl-9 pr-8 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
                aria-label="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        <div ref={scrollRef} className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs sm:text-sm cursor-grab select-none">
          {categories.map((cat) => {
            const isSemua = cat === 'Semua';
            const displayLabel = isSemua ? 'Semua Kategori' : cat;
            const isSelected = selectedCategory === cat || (isSemua && selectedCategory === 'Semua');

            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors text-xs font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40 ${
                  isSelected
                    ? 'bg-emerald-800 text-white font-semibold'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                {displayLabel}
              </button>
            );
          })}
        </div>
      </Container>
    </div>
  );
};
