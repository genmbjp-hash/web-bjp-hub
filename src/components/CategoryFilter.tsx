import React from 'react';
import { Entity, CategoryHeaderConfig } from '../types';
import { Home } from 'lucide-react';
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
  const isHomeSelected = selectedCategory === 'Semua' || selectedCategory === 'Home Page';
  const entityCategories = categories.filter((cat) => cat !== 'Semua' && cat !== 'Home Page');

  const getCategoryCount = (cat: string) => {
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
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          {/* Fixed/Pinned Standalone Home Page Button (Does not scroll away on mobile) */}
          <button
            onClick={() => onSelectCategory('Semua')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full whitespace-nowrap transition-all text-xs font-bold border cursor-pointer shrink-0 shadow-xs z-10 ${
              isHomeSelected
                ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400'
            }`}
            title="Kembali ke Home Page Beranda Utama"
          >
            <Home className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>Home Page</span>
          </button>

          {/* Vertical Separator */}
          <div className="h-5 w-[1px] bg-stone-300 mx-0.5 shrink-0" />

          {/* Horizontally Scrollable Entity Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs sm:text-sm min-w-0 flex-1">
            <span className="text-stone-400 font-medium text-xs whitespace-nowrap pr-1 hidden sm:inline shrink-0">
              Kategori Entitas:
            </span>

            {/* Entity Category Pills */}
            {entityCategories.map((cat) => {
              const isSelected = selectedCategory === cat;
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
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all text-xs font-medium border cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-emerald-800 text-white border-emerald-900 font-semibold shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  {logo ? (
                    <img
                      src={logo}
                      alt=""
                      className="w-4 h-4 rounded-full object-cover shrink-0 bg-white border border-stone-200 p-0.5"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : null}
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
    </div>
  );
};

