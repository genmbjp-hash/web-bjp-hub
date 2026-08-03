import React, { useState } from 'react';
import { motion } from 'motion/react';

interface Kanal {
  id: string;
  label: string;
  emoji: string;
  category: string;
  color: string;
  bgColor: string;
  activeColor: string;
}

const KANALS: Kanal[] = [
  {
    id: 'rt-rw11',
    label: 'RT RW 11',
    emoji: '🏛️',
    category: 'Administratif / Pemerintahan',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    activeColor: 'bg-blue-600 border-blue-700 text-white',
  },
  {
    id: 'sosial-keagamaan',
    label: 'Sosial & Keagamaan',
    emoji: '🕌',
    category: 'Keagamaan',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    activeColor: 'bg-purple-600 border-purple-700 text-white',
  },
  {
    id: 'sentra-usaha',
    label: 'Sentra Usaha BJP',
    emoji: '🛍️',
    category: 'Sentra Usaha BJP',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
    activeColor: 'bg-amber-600 border-amber-700 text-white',
  },
  {
    id: 'pkk-posyandu',
    label: 'PKK & Posyandu',
    emoji: '💗',
    category: 'Kesejahteraan Keluarga',
    color: 'text-pink-700',
    bgColor: 'bg-pink-50 border-pink-200 hover:bg-pink-100',
    activeColor: 'bg-pink-600 border-pink-700 text-white',
  },
  {
    id: 'lingkungan-bjp',
    label: 'Lingkungan BJP',
    emoji: '🌿',
    category: 'Lingkungan',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
    activeColor: 'bg-emerald-600 border-emerald-700 text-white',
  },
  {
    id: 'genm-bjp',
    label: 'GenM BJP',
    emoji: '⚡',
    category: 'Kepemudaan',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
    activeColor: 'bg-orange-500 border-orange-600 text-white',
  },
  {
    id: 'sports-bjp',
    label: 'Sports BJP',
    emoji: '⚽',
    category: 'Olahraga',
    color: 'text-sky-700',
    bgColor: 'bg-sky-50 border-sky-200 hover:bg-sky-100',
    activeColor: 'bg-sky-600 border-sky-700 text-white',
  },
  {
    id: 'podjok-santai',
    label: 'Podjok Santai BJP',
    emoji: '☕',
    category: 'Pusat Hub',
    color: 'text-stone-700',
    bgColor: 'bg-stone-50 border-stone-200 hover:bg-stone-100',
    activeColor: 'bg-stone-700 border-stone-800 text-white',
  },
];

interface KanalSliderProps {
  onSelectCategory: (category: string) => void;
  onSwitchToEntities: () => void;
}

export const KanalSlider: React.FC<KanalSliderProps> = ({
  onSelectCategory,
  onSwitchToEntities,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleClick = (kanal: Kanal) => {
    setActiveId(kanal.id);
    onSelectCategory(kanal.category);
    onSwitchToEntities();
  };

  return (
    <section className="bg-white border-b border-stone-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-stone-700 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1 h-4 bg-emerald-600 rounded-full inline-block" />
            Jelajahi Kanal BJP.hub
          </h2>
        </div>

        {/* Kanal Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {KANALS.map((kanal, index) => {
            const isActive = activeId === kanal.id;
            return (
              <motion.button
                key={kanal.id}
                onClick={() => handleClick(kanal)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className={`flex flex-col items-center gap-2 px-3 py-4 rounded-2xl border text-sm font-semibold transition-all cursor-pointer shadow-sm ${
                  isActive
                    ? kanal.activeColor + ' shadow-md ring-2 ring-offset-1 ring-emerald-400'
                    : kanal.bgColor + ' ' + kanal.color
                }`}
              >
                <span className="text-2xl">{kanal.emoji}</span>
                <span className="text-sm font-semibold text-center leading-tight whitespace-normal">{kanal.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
