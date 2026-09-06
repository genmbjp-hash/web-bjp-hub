import React from 'react';
import { Entity } from '../types';
import { ArrowLeft, SearchX } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { EntityCard } from '../components/EntityCard';

interface SportsBjpPageProps {
  entities: Entity[];
  onSelectEntity: (entity: Entity) => void;
  onBack: () => void;
}

export const SportsBjpPage: React.FC<SportsBjpPageProps> = ({ entities, onSelectEntity, onBack }) => {
  const sportsEntities = entities.filter((e) => e.category === 'Olahraga');

  return (
    <div className="pb-10">
      <Container className="pt-6 space-y-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs border border-stone-200 shadow-sm transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
        >
          <ArrowLeft className="w-4 h-4 text-stone-500" />
          <span>Kembali ke Beranda</span>
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900">Sports BJP</h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Fasilitas dan klub olahraga warga Komplek Bintara Jaya Permai (RW 11).
          </p>
        </div>

        {sportsEntities.length === 0 ? (
          <div className="text-center py-16 space-y-3 bg-white rounded-2xl border border-stone-200">
            <SearchX className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="font-bold text-stone-700">Belum Ada Klub Olahraga</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {sportsEntities.map((entity) => (
              <EntityCard key={entity.id} entity={entity} onSelect={onSelectEntity} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};
