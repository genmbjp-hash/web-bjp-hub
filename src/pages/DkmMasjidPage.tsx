import React, { useState } from 'react';
import { Entity, DkmMasjidConfig } from '../types';
import { formatImageUrl } from '../utils/imageUrl';
import { FALLBACK_ENTITY_IMAGE_URL } from '../constants/defaults';
import { ArrowLeft, Church, CalendarDays, Users, CalendarX2, UserX } from 'lucide-react';
import { Container } from '../components/ui/Container';

interface DkmMasjidPageProps {
  entity?: Entity;
  config?: DkmMasjidConfig;
  onBack: () => void;
}

export const DkmMasjidPage: React.FC<DkmMasjidPageProps> = ({ entity, config, onBack }) => {
  const [activeTab, setActiveTab] = useState<'agenda' | 'struktur'>('agenda');

  const agenda = (config?.agenda || [])
    .filter((a) => a.enabled)
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : (a.order ?? 0) - (b.order ?? 0)));
  const struktur = (config?.struktur || [])
    .filter((s) => s.enabled)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const formatDate = (iso: string) => {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return iso;
    }
  };

  return (
    <div className="pb-10">
      <Container className="pt-6 space-y-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs border border-stone-200 shadow-sm transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
        >
          <ArrowLeft className="w-4 h-4 text-stone-500" />
          <span>Kembali ke Sosial Keagamaan</span>
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
          <img
            src={entity?.image ? formatImageUrl(entity.image) : FALLBACK_ENTITY_IMAGE_URL}
            alt={entity?.name || 'DKM Masjid'}
            className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shrink-0"
            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_ENTITY_IMAGE_URL; }}
          />
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-black text-stone-900 truncate">
              {entity?.name || 'DKM Masjid Ja\'mi Al Aqwam'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              {config?.aboutText || 'Agenda kegiatan dan susunan pengurus DKM Masjid Ja\'mi Al Aqwam.'}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-white rounded-2xl border border-stone-200 p-1.5 w-fit">
          <button
            onClick={() => setActiveTab('agenda')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'agenda' ? 'bg-emerald-700 text-white' : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Agenda ({agenda.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('struktur')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'struktur' ? 'bg-emerald-700 text-white' : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Struktur Organisasi ({struktur.length})</span>
          </button>
        </div>

        {/* Content */}
        {activeTab === 'agenda' ? (
          agenda.length === 0 ? (
            <div className="text-center py-16 space-y-3 bg-white rounded-2xl border border-stone-200">
              <CalendarX2 className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="font-bold text-stone-700">Belum Ada Agenda</h3>
              <p className="text-stone-500 text-xs max-w-sm mx-auto">
                Agenda kegiatan DKM Masjid belum ditambahkan oleh pengurus melalui menu CMS.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {agenda.map((a) => (
                <div key={a.id} className="bg-white rounded-2xl border border-stone-200 p-5 flex items-start gap-4">
                  <div className="shrink-0 w-14 h-14 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col items-center justify-center text-emerald-800">
                    <Church className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-stone-900 text-sm">{a.title}</h3>
                    {a.date && <p className="text-xs text-emerald-700 font-semibold mt-0.5">{formatDate(a.date)}</p>}
                    {a.description && <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">{a.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : struktur.length === 0 ? (
          <div className="text-center py-16 space-y-3 bg-white rounded-2xl border border-stone-200">
            <UserX className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="font-bold text-stone-700">Belum Ada Susunan Pengurus</h3>
            <p className="text-stone-500 text-xs max-w-sm mx-auto">
              Struktur organisasi DKM Masjid belum ditambahkan oleh pengurus melalui menu CMS.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {struktur.map((s) => (
              <div key={s.id} className="bg-white rounded-2xl border border-stone-200 p-4 text-center space-y-2">
                <img
                  src={s.photoUrl ? formatImageUrl(s.photoUrl) : FALLBACK_ENTITY_IMAGE_URL}
                  alt={s.name}
                  className="w-16 h-16 rounded-full object-cover border border-stone-200 mx-auto"
                  onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_ENTITY_IMAGE_URL; }}
                />
                <div>
                  <p className="text-xs font-bold text-stone-900 leading-tight">{s.name}</p>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">{s.role}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};
