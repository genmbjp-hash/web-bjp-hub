import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CategoryHeaderConfig } from '../../types';
import { Container } from '../ui/Container';

interface KanalSliderProps {
  categoryConfigs: CategoryHeaderConfig[];
  onSelectCategory: (category: string) => void;
  onSwitchToEntities: () => void;
}

// Single neutral card style for every kanal — categories are told apart by
// their icon/label, not by a different color per item, to keep emerald as
// the site's one accent color.
const EMOJIS = ['🏛️', '🕌', '🛍️', '💗', '🌿', '⚡', '⚽', '☕', '🌟', '🎯', '🎨', '📚'];

export const KanalSlider: React.FC<KanalSliderProps> = ({
  categoryConfigs,
  onSelectCategory,
  onSwitchToEntities,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleClick = (categoryId: string, categoryName: string) => {
    setActiveId(categoryId);
    // Kita passing categoryName sebagai fallback atau categoryId sesuai routing filter di KomunitasPage
    // Logic filter di App.tsx/KomunitasPage mencari kecocokan string
    onSelectCategory(categoryName);
    onSwitchToEntities();
  };

  const kanals = categoryConfigs.map((config, index) => {
    // Attempt to map some predefined known categories to specific emojis for better UX, fallback to sequential
    let emoji = EMOJIS[index % EMOJIS.length];
    const nameLower = config.name.toLowerCase();
    if (nameLower.includes('rt') || nameLower.includes('rw') || nameLower.includes('pemerintah')) emoji = '🏛️';
    else if (nameLower.includes('agama') || nameLower.includes('masjid') || nameLower.includes('gereja')) emoji = '🕌';
    else if (nameLower.includes('usaha') || nameLower.includes('umkm') || nameLower.includes('ekonomi')) emoji = '🛍️';
    else if (nameLower.includes('pkk') || nameLower.includes('posyandu') || nameLower.includes('kesejahteraan')) emoji = '💗';
    else if (nameLower.includes('lingkungan') || nameLower.includes('taman') || nameLower.includes('hijau')) emoji = '🌿';
    else if (nameLower.includes('muda') || nameLower.includes('karang') || nameLower.includes('remaja')) emoji = '⚡';
    else if (nameLower.includes('olahraga') || nameLower.includes('sport') || nameLower.includes('senam')) emoji = '⚽';
    else if (nameLower.includes('santai') || nameLower.includes('kumpul') || nameLower.includes('hub')) emoji = '☕';

    return {
      id: config.id,
      label: config.name,
      emoji: emoji,
    };
  });

  if (!kanals || kanals.length === 0) return null;

  return (
    <section className="bg-white border-b border-stone-100 py-8">
      <Container>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-stone-700 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1 h-4 bg-emerald-600 rounded-full inline-block" />
            Jelajahi Kanal BJP.hub
          </h2>
        </div>

        {/* Kanal Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {kanals.map((kanal, index) => {
            const isActive = activeId === kanal.id;
            return (
              <motion.button
                key={kanal.id}
                onClick={() => handleClick(kanal.id, kanal.label)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className={`flex flex-col items-center justify-center gap-2 px-3 py-4 rounded-2xl border text-sm font-semibold transition-all cursor-pointer shadow-sm min-h-[100px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40 ${
                  isActive
                    ? 'bg-emerald-700 border-emerald-800 text-white shadow-md'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-800'
                }`}
              >
                <span className="text-2xl">{kanal.emoji}</span>
                <span className="text-sm font-semibold text-center leading-tight whitespace-normal">{kanal.label}</span>
              </motion.button>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
