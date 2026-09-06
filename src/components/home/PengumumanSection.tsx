import React from 'react';
import { Announcement } from '../../types';
import { formatImageUrl } from '../../utils/imageUrl';
import { FALLBACK_IMAGE_URL } from '../../constants/defaults';
import { stripHtml } from '../../utils/meta';
import { CalendarDays, AlertCircle, ArrowRight, ExternalLink, Megaphone } from 'lucide-react';

interface PengumumanSectionProps {
  announcements: Announcement[];
  onViewAll: () => void;
}

export const PengumumanSection: React.FC<PengumumanSectionProps> = ({
  announcements,
  onViewAll,
}) => {
  const latest = announcements.slice(0, 3);

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-black text-stone-900">Pengumuman & Agenda</h2>
            <p className="text-sm font-medium text-stone-600 mt-0.5">Info terbaru dari pengurus RW 11</p>
          </div>
          <button
            onClick={onViewAll}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-white hover:bg-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-300 transition-all"
          >
            Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Empty State */}
        {latest.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4 bg-stone-50 rounded-2xl border border-stone-200 border-dashed">
            <div className="p-4 bg-stone-100 rounded-full">
              <Megaphone className="w-8 h-8 text-stone-400" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-stone-700 text-sm">Belum Ada Pengumuman</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Pengurus RW belum menambahkan pengumuman. Pantau terus untuk mendapatkan info terbaru!
              </p>
            </div>
            <button
              onClick={onViewAll}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              Cek Halaman Pengumuman <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {latest.map((ann) => {
              const cleanContent = stripHtml(ann.content);
              const snippet = cleanContent.length > 120 ? cleanContent.slice(0, 120) + '…' : cleanContent;

              return (
                <div
                  key={ann.id}
                  className="group bg-white rounded-2xl border border-stone-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden"
                >
                  {/* Image or colored header */}
                  {ann.image ? (
                    <div className="h-40 overflow-hidden">
                      <img
                        src={formatImageUrl(ann.image) || FALLBACK_IMAGE_URL}
                        alt={ann.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE_URL; }}
                      />
                    </div>
                  ) : (
                    <div className="h-3 bg-emerald-600" />
                  )}

                  <div className="p-5 flex flex-col flex-1 gap-3">
                    {/* Category + Important badge */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        {ann.category}
                      </span>
                      {ann.isImportant && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                          <AlertCircle className="w-3 h-3" />
                          Penting
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-stone-900 leading-snug line-clamp-2 group-hover:text-emerald-800 transition-colors">
                      {ann.title}
                    </h3>

                    {/* Snippet */}
                    <p className="text-xs text-stone-500 leading-relaxed flex-1">{snippet}</p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                      <div className="flex items-center gap-1.5 text-stone-400 text-xs">
                        <CalendarDays className="w-3 h-3" />
                        <span>{ann.date}</span>
                      </div>
                      {ann.ctaUrl && ann.ctaUrl !== '#' && (
                        <a
                          href={ann.ctaUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
                        >
                          {ann.ctaWording || 'Selengkapnya'} <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
