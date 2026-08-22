import React from 'react';
import { Announcement } from '../types';
import { formatImageUrl } from '../utils/imageUrl';
import { Megaphone, Calendar, User, ExternalLink, Shield, PlusCircle, AlertCircle, Maximize2, X, Share2 } from 'lucide-react';

interface AnnouncementsListProps {
  announcements: Announcement[];
  onOpenCMS: () => void;
  isCMSActive: boolean;
  onShare?: (ann: Announcement) => void;
}

export const AnnouncementsList: React.FC<AnnouncementsListProps> = ({
  announcements,
  onOpenCMS,
  isCMSActive,
  onShare,
}) => {
  const [selectedLightboxImage, setSelectedLightboxImage] = React.useState<{ url: string; title: string } | null>(null);

  return (
    <div className="space-y-6">
      {/* Top Section Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <Megaphone className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-stone-900">Pengumuman & Agenda Warga</h2>
          </div>
          <p className="text-stone-600 text-xs sm:text-sm">
            Informasi penting, jadwal kegiatan, dan acara terkini di Komplek Bintara Jaya Permai (RW 11).
          </p>
        </div>
      </div>

      {/* Announcements List Grid */}
      {announcements.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-stone-200 space-y-3">
          <AlertCircle className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="font-bold text-stone-700">Belum Ada Pengumuman Baru</h3>
          <p className="text-stone-500 text-xs max-w-sm mx-auto">
            Pengurus RW atau pengurus komunitas dapat menambahkan pengumuman baru melalui menu CMS Pengurus.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className={`bg-white rounded-2xl p-5 border transition-all duration-200 space-y-3 flex flex-col justify-between ${
                ann.isImportant
                  ? 'border-amber-300/80 bg-amber-50/30 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300 shadow-2xs'
              }`}
            >
              <div className="space-y-3">
                {/* Optional Announcement Banner Image */}
                {ann.image && (
                  <div
                    onClick={() => setSelectedLightboxImage({ url: ann.image!, title: ann.title })}
                    className="relative w-full aspect-[2/1] bg-stone-100 rounded-xl overflow-hidden border border-stone-200 group cursor-pointer shadow-2xs"
                  >
                    <img
                      src={formatImageUrl(ann.image)}
                      alt={ann.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5">
                      <Maximize2 className="w-4 h-4" />
                      <span>Perbesar Banner</span>
                    </div>
                  </div>
                )}

                {/* Meta Badges */}
                <div className="flex items-center justify-between gap-2">
                  <span className="bg-stone-100 text-stone-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-lg border border-stone-200">
                    {ann.category}
                  </span>
                  <div className="flex items-center gap-2">
                    {ann.isImportant && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                        Penting
                      </span>
                    )}
                    {onShare && (
                      <button
                        onClick={() => onShare(ann)}
                        className="flex items-center gap-1 bg-stone-100 hover:bg-emerald-100 hover:text-emerald-800 text-stone-600 text-xs font-bold px-2.5 py-1 rounded-lg border border-stone-200 transition-colors"
                        title="Bagikan Pengumuman ini"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Bagikan</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-stone-900 text-base sm:text-lg leading-snug">
                  {ann.title}
                </h3>

                {/* Content */}
                <div
                  className="text-stone-600 text-xs sm:text-sm leading-relaxed prose prose-stone prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: ann.content }}
                />
              </div>

              {/* Footer Meta & CTA */}
              <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    {ann.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    {ann.author}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {onShare && (
                    <button
                      onClick={() => onShare(ann)}
                      className="p-1.5 text-stone-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Bagikan Ke WhatsApp"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {ann.ctaUrl && ann.ctaUrl !== '#' && (
                    <a
                      href={ann.ctaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-900 font-bold bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
                    >
                      <span>{ann.ctaWording || 'Info Selengkapnya'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal for Announcement Banner */}
      {selectedLightboxImage && (
        <div
          className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedLightboxImage(null)}
              className="self-end text-white hover:text-stone-300 p-2 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <X className="w-6 h-6" />
              <span>Tutup</span>
            </button>
            <img
              src={formatImageUrl(selectedLightboxImage.url)}
              alt={selectedLightboxImage.title}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/20"
            />
            <p className="text-white text-center text-xs sm:text-sm bg-black/60 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-xs max-w-xl font-semibold">
              {selectedLightboxImage.title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
