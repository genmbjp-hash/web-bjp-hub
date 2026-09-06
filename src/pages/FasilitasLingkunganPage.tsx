import React from 'react';
import { Link } from 'react-router-dom';
import { FasilitasLingkunganConfig } from '../types';
import { formatImageUrl } from '../utils/imageUrl';
import { normalizeFasilitasItems } from '../utils/fasilitas';
import { FALLBACK_ENTITY_IMAGE_URL } from '../constants/defaults';
import { ArrowLeft, Trees, MapPin, Info, ArrowRight } from 'lucide-react';
import { Container } from '../components/ui/Container';

interface FasilitasLingkunganPageProps {
  config?: FasilitasLingkunganConfig;
  onBack: () => void;
}

export const statusStyle = (status?: string) => {
  const s = (status || '').toLowerCase();
  if (s.includes('perbaikan') || s.includes('rusak')) return 'bg-amber-100 text-amber-800 border-amber-200';
  if (s.includes('rencana') || s.includes('rancang') || s.includes('usul')) return 'bg-sky-100 text-sky-800 border-sky-200';
  return 'bg-emerald-100 text-emerald-800 border-emerald-200';
};

export const FasilitasLingkunganPage: React.FC<FasilitasLingkunganPageProps> = ({ config, onBack }) => {
  const items = normalizeFasilitasItems(config?.items || [])
    .filter((f) => f.enabled)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Kelompokkan per kategori untuk pemisah bagian.
  const groups: { category: string; items: typeof items }[] = [];
  items.forEach((f) => {
    const key = f.category?.trim() || 'Lainnya';
    let group = groups.find((g) => g.category === key);
    if (!group) {
      group = { category: key, items: [] };
      groups.push(group);
    }
    group.items.push(f);
  });

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

        {/* Header */}
        <div className="flex items-center gap-4 bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
          <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl shrink-0">
            <Trees className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-black text-stone-900">
              {config?.pageTitle || 'Fasilitas Lingkungan'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              {config?.pageDescription ||
                'Data fasilitas umum dan sarana lingkungan warga Komplek Bintara Jaya Permai (RW 11).'}
            </p>
          </div>
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-16 space-y-3 bg-white rounded-2xl border border-stone-200">
            <Trees className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="font-bold text-stone-700">Belum Ada Data Fasilitas</h3>
            <p className="text-stone-500 text-xs max-w-sm mx-auto">
              Data fasilitas lingkungan akan tampil di sini setelah ditambahkan oleh pengurus melalui menu CMS.
            </p>
          </div>
        )}

        {/* Grouped Facilities */}
        {groups.map((group) => (
          <div key={group.category} className="space-y-3">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-black text-stone-900 shrink-0">{group.category}</h2>
              <div className="h-px flex-1 bg-stone-200" />
              <span className="text-[11px] font-semibold text-stone-400 shrink-0">{group.items.length} fasilitas</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {group.items.map((f) => (
                <Link
                  key={f.id}
                  to={`/fasilitas-lingkungan/${f.slug}`}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs flex flex-col group transition-all hover:border-emerald-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
                >
                  {f.imageUrl && (
                    <div className="w-full bg-stone-100 overflow-hidden">
                      <img
                        src={formatImageUrl(f.imageUrl)}
                        alt={f.name}
                        loading="lazy"
                        decoding="async"
                        style={f.aspectRatio ? { aspectRatio: String(f.aspectRatio) } : undefined}
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_ENTITY_IMAGE_URL; }}
                      />
                    </div>
                  )}

                  <div className="p-4 space-y-2 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-stone-900 text-sm leading-snug">{f.name}</h3>
                      {f.status && (
                        <span
                          className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusStyle(f.status)}`}
                        >
                          {f.status}
                        </span>
                      )}
                    </div>

                    {f.location && (
                      <p className="text-[11px] text-stone-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>{f.location}</span>
                      </p>
                    )}

                    {f.summary && (
                      <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">{f.summary}</p>
                    )}

                    <span className="mt-auto pt-1 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 group-hover:gap-1.5 transition-all">
                      Lihat detail
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {items.length > 0 && (
          <p className="text-[11px] text-stone-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>Data dikelola oleh pengurus RW 11 dan diperbarui berkala.</span>
          </p>
        )}
      </Container>
    </div>
  );
};
