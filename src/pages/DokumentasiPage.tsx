import React, { useState } from 'react';
import { Entity, FeaturedVideoItem } from '../types';
import { formatImageUrl } from '../utils/imageUrl';
import { FALLBACK_IMAGE_URL } from '../constants/defaults';
import {
  ArrowLeft,
  Images,
  Play,
  Youtube,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { Container } from '../components/ui/Container';

interface DokumentasiPageProps {
  entities: Entity[];
  featuredVideos: FeaturedVideoItem[];
  onBack?: () => void;
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export const DokumentasiPage: React.FC<DokumentasiPageProps> = ({ entities, featuredVideos, onBack }) => {
  const [activeTab, setActiveTab] = useState<'foto' | 'video'>('foto');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Collect every available photo across all entities (product photos first, entity photo as fallback).
  // Each photo gets a year: the per-photo year set in CMS, or the entity's creation year as fallback.
  const photos: { src: string; caption: string; year: string }[] = [];
  entities.forEach((e) => {
    const entityYear = e.createdAt ? String(new Date(e.createdAt).getFullYear()) : 'Lainnya';
    if (e.productPhotos && e.productPhotos.length > 0) {
      e.productPhotos.forEach((photo, idx) => {
        const yearOverride = e.productPhotoYears?.[idx]?.trim();
        photos.push({
          src: formatImageUrl(photo) || photo,
          caption: e.productPhotoCaptions?.[idx] || e.name,
          year: yearOverride || entityYear,
        });
      });
    } else if (e.image) {
      photos.push({ src: formatImageUrl(e.image), caption: e.name, year: entityYear });
    }
  });

  // Group photos by year (newest first) for section separators in the photo wall.
  const photoGroups: { year: string; items: { src: string; caption: string; index: number }[] }[] = [];
  photos.forEach((photo, idx) => {
    let group = photoGroups.find((g) => g.year === photo.year);
    if (!group) {
      group = { year: photo.year, items: [] };
      photoGroups.push(group);
    }
    group.items.push({ ...photo, index: idx });
  });
  photoGroups.sort((a, b) => b.year.localeCompare(a.year, undefined, { numeric: true }));

  const videos = featuredVideos
    .filter((v) => v.enabled)
    .sort((a, b) => a.order - b.order)
    .map((v) => ({ title: v.title, youtubeId: extractYouTubeId(v.youtubeUrl) }))
    .filter((v): v is { title: string; youtubeId: string } => Boolean(v.youtubeId));

  const hasPhotos = photos.length > 0;
  const hasVideos = videos.length > 0;

  const openLightbox = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);
  const prevPhoto = () => setLightboxIdx((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
  const nextPhoto = () => setLightboxIdx((i) => (i === null ? null : (i + 1) % photos.length));

  return (
    <div className="pb-12">
      <Container className="pt-8 space-y-6">
        {/* Global Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs border border-stone-200 shadow-sm transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
            title="Kembali ke Beranda"
          >
            <ArrowLeft className="w-4 h-4 text-stone-500" />
            <span>Kembali ke Beranda</span>
          </button>
        )}

        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-stone-200 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl shrink-0">
              <Images className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">Dokumentasi</h1>
              <p className="text-stone-500 text-xs sm:text-sm">
                Kumpulan foto & video kegiatan warga Komplek Bintara Jaya Permai (RW 11)
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          {(hasPhotos || hasVideos) && (
            <div className="inline-flex items-center gap-1 bg-stone-100 p-1 rounded-xl self-start sm:self-auto">
              <button
                onClick={() => setActiveTab('foto')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'foto' ? 'bg-white text-emerald-800 shadow-sm' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Images className="w-3.5 h-3.5" />
                <span>Foto ({photos.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('video')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'video' ? 'bg-white text-emerald-800 shadow-sm' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Youtube className="w-3.5 h-3.5" />
                <span>Video ({videos.length})</span>
              </button>
            </div>
          )}
        </div>

        {/* Empty State */}
        {!hasPhotos && !hasVideos && (
          <div className="text-center py-16 space-y-3">
            <Sparkles className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="font-bold text-stone-700">Belum Ada Dokumentasi</h3>
            <p className="text-stone-500 text-xs max-w-sm mx-auto">
              Foto dan video kegiatan akan tampil di sini setelah ditambahkan oleh pengurus melalui menu CMS.
            </p>
          </div>
        )}

        {/* Photo Wall, grouped by year */}
        {activeTab === 'foto' && hasPhotos && (
          <div className="space-y-8">
            {photoGroups.map((group) => (
              <div key={group.year} className="space-y-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-base font-black text-stone-900 shrink-0">{group.year}</h2>
                  <div className="h-px flex-1 bg-stone-200" />
                  <span className="text-[11px] font-semibold text-stone-400 shrink-0">{group.items.length} foto</span>
                </div>

                <div className="columns-2 sm:columns-3 md:columns-4 gap-3 space-y-3">
                  {group.items.map((photo) => (
                    <button
                      key={photo.index}
                      onClick={() => openLightbox(photo.index)}
                      className="block w-full break-inside-avoid rounded-2xl overflow-hidden group relative border border-stone-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
                    >
                      <img
                        src={photo.src}
                        alt={photo.caption}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE_URL; }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end p-2.5 opacity-0 group-hover:opacity-100">
                        <span className="text-white text-[11px] font-medium line-clamp-1">{photo.caption}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Video Grid */}
        {activeTab === 'video' && hasVideos && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {videos.map((video, idx) => (
              <div key={`${video.youtubeId}-${idx}`} className="rounded-2xl overflow-hidden border border-stone-200 bg-white shadow-sm">
                <div className="relative aspect-video bg-stone-900 group">
                  {playingId === video.youtubeId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
                      title={video.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <img
                        src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                        alt={video.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
                        }}
                      />
                      <button
                        onClick={() => setPlayingId(video.youtubeId)}
                        aria-label={`Putar video ${video.title}`}
                        className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors cursor-pointer"
                      >
                        <span className="w-12 h-12 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                          <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                        </span>
                      </button>
                    </>
                  )}
                </div>
                <div className="p-3.5">
                  <p className="text-stone-800 font-bold text-sm line-clamp-2 leading-snug">{video.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>

      {/* Photo Lightbox */}
      {lightboxIdx !== null && photos[lightboxIdx] && (
        <div
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-stone-300 p-2 text-xs font-bold flex items-center gap-1 cursor-pointer"
            onClick={closeLightbox}
          >
            <X className="w-6 h-6" />
            <span>Tutup</span>
          </button>

          <button
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm cursor-pointer"
            onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="relative max-w-4xl max-h-[85vh] flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[lightboxIdx].src}
              alt={photos[lightboxIdx].caption}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/20"
              onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE_URL; }}
            />
            <p className="text-white text-center text-xs sm:text-sm bg-black/60 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-xs max-w-xl">
              {photos[lightboxIdx].caption} · {lightboxIdx + 1} / {photos.length}
            </p>
          </div>

          <button
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm cursor-pointer"
            onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};
