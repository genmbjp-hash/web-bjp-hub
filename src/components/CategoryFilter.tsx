import React from 'react';
import { Entity, CategoryHeaderConfig } from '../types';
import { formatImageUrl } from '../utils/imageUrl';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  entities: Entity[];
  categoryConfigs?: CategoryHeaderConfig[];
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  entities,
  categoryConfigs,
}) => {
  const getCategoryCount = (cat: string) => {
    if (cat === 'Semua' || cat === 'Home Page') return entities.length;
    const config = categoryConfigs?.find((c) => c.name === cat || c.id === cat);
    const searchKeys = [cat, config?.id, config?.name].filter(Boolean) as string[];

    return entities.filter((e) => {
      const eCat = e.category.toLowerCase();
      return searchKeys.some((k) => eCat.includes(k.toLowerCase()) || k.toLowerCase().includes(eCat));
    }).length;
  };

  return (
    <div className="bg-stone-50 border-b border-stone-200 py-3 sticky top-16 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs sm:text-sm">
          <span className="text-stone-400 font-medium text-xs whitespace-nowrap pr-1 hidden sm:inline">
            Navigasi:
          </span>

          {categories.map((cat) => {
            const isSemua = cat === 'Semua';
            const displayLabel = isSemua ? 'Semua Kategori' : cat;
            const isSelected = selectedCategory === cat || (isSemua && selectedCategory === 'Semua');
            const count = getCategoryCount(cat);
            const config = categoryConfigs?.find((c) => c.name === cat || c.id === cat);
            
            // Find entity image fallback if category config logoUrl is missing
            const searchKeys = [cat, config?.id, config?.name].filter(Boolean) as string[];
            const matchingEntity = entities.find((e) => {
              const eCat = e.category.toLowerCase();
              return searchKeys.some((k) => eCat.includes(k.toLowerCase()) || k.toLowerCase().includes(eCat));
            });

            const rawLogo = config?.logoUrl || matchingEntity?.image;
            const logo = rawLogo ? formatImageUrl(rawLogo) : null;

            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all text-xs font-medium border cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-800 text-white border-emerald-900 font-semibold shadow-xs'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                {isSemua ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-emerald-300 shrink-0"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                ) : logo ? (
                  <img
                    src={logo}
                    alt=""
                    className="w-4 h-4 rounded-full object-cover shrink-0 bg-white border border-stone-200 p-0.5"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : null}
                <span>{displayLabel}</span>
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

