import React from 'react';
import { Entity } from '../types';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  entities: Entity[];
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  entities,
}) => {
  const getCategoryCount = (cat: string) => {
    if (cat === 'Semua') return entities.length;
    return entities.filter((e) => e.category.toLowerCase().includes(cat.toLowerCase()) || cat.toLowerCase().includes(e.category.toLowerCase())).length;
  };

  return (
    <div className="bg-stone-50 border-b border-stone-200 py-3 sticky top-16 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs sm:text-sm">
          <span className="text-stone-400 font-medium text-xs whitespace-nowrap pr-1 hidden sm:inline">
            Kategori:
          </span>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = getCategoryCount(cat);

            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition-all text-xs font-medium border ${
                  isSelected
                    ? 'bg-emerald-800 text-white border-emerald-900 font-semibold shadow-xs'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-emerald-700 text-emerald-100' : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
