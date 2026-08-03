import React from 'react';
import { Entity } from '../../types';
import { ArrowRight } from 'lucide-react';
import { EntityCard } from '../EntityCard';
import { motion } from 'motion/react';

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
  // Show featured first, then by latest
  const featured = [
    ...entities.filter((e) => e.isFeatured),
    ...entities.filter((e) => !e.isFeatured),
  ].slice(0, 8);

  if (featured.length === 0) return null;

  return (
    <section className="bg-stone-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black text-stone-900 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-emerald-600 rounded-full inline-block" />
              Sorotan Komunitas
            </h2>
            <p className="text-sm font-medium text-stone-600 mt-1 ml-3.5">Komunitas unggulan & terbaru BJP.hub</p>
          </div>
          <button
            onClick={onSwitchToEntities}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-white hover:bg-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-300 transition-all"
          >
            Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {featured.map((entity, index) => (
            <motion.div
              key={entity.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: index * 0.07 }}
              className="h-full"
            >
              <EntityCard
                entity={entity}
                onSelect={onSelectEntity}
              />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
