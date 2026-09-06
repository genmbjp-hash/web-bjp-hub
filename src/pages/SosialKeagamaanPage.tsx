import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Entity } from '../types';
import { formatImageUrl } from '../utils/imageUrl';
import { FALLBACK_ENTITY_IMAGE_URL } from '../constants/defaults';
import { stripHtml } from '../utils/meta';
import { ArrowLeft, CalendarDays, ArrowRight, SearchX } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { EntityCard } from '../components/EntityCard';

interface SosialKeagamaanPageProps {
  entities: Entity[];
  onSelectEntity: (entity: Entity) => void;
  onBack: () => void;
}

export const SosialKeagamaanPage: React.FC<SosialKeagamaanPageProps> = ({
  entities,
  onSelectEntity,
  onBack,
}) => {
  const navigate = useNavigate();
  const keagamaanEntities = entities.filter((e) => e.category === 'Keagamaan');
  const dkmMasjid = keagamaanEntities.find((e) => e.name.toLowerCase().includes('dkm masjid'));
  const otherEntities = keagamaanEntities.filter((e) => e.id !== dkmMasjid?.id);

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
          <h1 className="text-xl sm:text-2xl font-black text-stone-900">Sosial Keagamaan</h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Pusat informasi unit-unit kegiatan sosial keagamaan warga Komplek Bintara Jaya Permai (RW 11).
          </p>
        </div>

        {/* DKM Masjid Highlight */}
        {dkmMasjid && (
          <div className="relative bg-stone-950 rounded-2xl overflow-hidden">
            <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <img
                src={formatImageUrl(dkmMasjid.image)}
                alt={dkmMasjid.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-white/20 shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_ENTITY_IMAGE_URL; }}
              />
              <div className="flex-1 min-w-0">
                <span className="inline-block text-[11px] font-bold text-emerald-200 bg-white/10 px-3 py-1 rounded-full border border-white/20 mb-2">
                  {dkmMasjid.category}
                </span>
                <h2 className="text-lg sm:text-xl font-black text-white">{dkmMasjid.name}</h2>
                <p className="text-stone-300 text-xs sm:text-sm mt-1 leading-relaxed line-clamp-2">
                  {stripHtml(dkmMasjid.description)}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
                <button
                  onClick={() => onSelectEntity(dkmMasjid)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-colors"
                >
                  <span>Lihat Profil</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => navigate('/dkm-masjid')}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>Agenda & Struktur Organisasi</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Other Keagamaan Entities */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Unit Kegiatan Sosial Keagamaan Lainnya
          </h3>
          {otherEntities.length === 0 ? (
            <div className="text-center py-16 space-y-3 bg-white rounded-2xl border border-stone-200">
              <SearchX className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="font-bold text-stone-700">Belum Ada Unit Kegiatan</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {otherEntities.map((entity) => (
                <EntityCard key={entity.id} entity={entity} onSelect={onSelectEntity} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};
