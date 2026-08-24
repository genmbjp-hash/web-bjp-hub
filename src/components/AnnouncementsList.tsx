import React from 'react';
import { Announcement } from '../types';
import { formatImageUrl } from '../utils/imageUrl';
import { Megaphone, Calendar, User, ExternalLink, AlertCircle, Maximize2, X, Share2, ArrowLeft } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

interface AnnouncementsListProps {
  announcements: Announcement[];
  onOpenCMS: () => void;
  isCMSActive: boolean;
  onShare?: (ann: Announcement) => void;
  onBack?: () => void;
}

export const AnnouncementsList: React.FC<AnnouncementsListProps> = ({
  announcements,
  onOpenCMS,
  isCMSActive,
  onShare,
  onBack,
}) => {
  const [selectedLightboxImage, setSelectedLightboxImage] = React.useState<{ url: string; title: string } | null>(null);

  return (
    <div className="space-y-6">
      {/* Global Back Button */}
      {onBack && (
        <div className="flex justify-start">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs border border-stone-200 shadow-sm transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
            title="Kembali ke Beranda"
          >
            <ArrowLeft className="w-4 h-4 text-stone-500" />
            <span>Kembali ke Beranda</span>
          </button>
        </div>
      )}

      {/* Page Header */}
      <Card radius="3xl" padding="none" className="p-6 sm:p-8 space-y-3">
        <span className="inline-block text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80">
          Informasi Warga RW 11
        </span>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl shrink-0">
            <Megaphone className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">Pengumuman & Agenda Warga</h1>
        </div>
        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
          Informasi penting, jadwal kegiatan, dan acara terkini di Komplek Bintara Jaya Permai (RW 11).
        </p>
      </Card>

      {/* Announcements List Grid */}
      {announcements.length === 0 ? (
        <Card padding="none" className="p-12 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="font-bold text-stone-700">Belum Ada Pengumuman Baru</h3>
          <p className="text-stone-500 text-xs max-w-sm mx-auto">
            Pengurus RW atau pengurus komunitas dapat menambahkan pengumuman baru melalui menu CMS Pengurus.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcements.map((ann) => (
            <Card
              key={ann.id}
              padding="sm"
              className={`transition-all duration-200 space-y-3 flex flex-col justify-between ${
                ann.isImportant
                  ? 'border-amber-300/80 bg-amber-50/30 shadow-xs'
                  : 'hover:border-stone-300'
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
                  <Badge variant="neutral" className="rounded-lg">{ann.category}</Badge>
                  <div className="flex items-center gap-2">
                    {ann.isImportant && (
                      <Badge variant="warning" className="items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                        Penting
                      </Badge>
                    )}
                    {onShare && (
                      <button
                        onClick={() => onShare(ann)}
                        className="flex items-center gap-1 bg-stone-100 hover:bg-emerald-100 hover:text-emerald-800 text-stone-600 text-xs font-bold px-2.5 py-1 rounded-lg border border-stone-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
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
                      className="p-1.5 text-stone-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
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
                      className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-900 font-bold bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
                    >
                      <span>{ann.ctaWording || 'Info Selengkapnya'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </Card>
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
