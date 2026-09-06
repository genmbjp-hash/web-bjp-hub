import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FasilitasLingkunganConfig } from '../types';
import { formatImageUrl } from '../utils/imageUrl';
import { normalizeFasilitasItems } from '../utils/fasilitas';
import { getDrivePreviewUrl, getDriveViewUrl } from '../utils/driveUrl';
import { FALLBACK_ENTITY_IMAGE_URL } from '../constants/defaults';
import {
  ArrowLeft, Trees, MapPin, ChevronRight, ChevronLeft, X, FileText, Download,
  Image as ImageIcon, Maximize2, Info,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { statusStyle } from './FasilitasLingkunganPage';

interface FasilitasLingkunganDetailPageProps {
  config?: FasilitasLingkunganConfig;
}

export const FasilitasLingkunganDetailPage: React.FC<FasilitasLingkunganDetailPageProps> = ({ config }) => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const allItems = normalizeFasilitasItems(config?.items || [])
    .filter((f) => f.enabled)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const item = allItems.find((f) => f.slug === slug);

  // ---- Not found ----------------------------------------------------------
  if (!item) {
    return (
      <div className="pb-10">
        <Container className="pt-6 space-y-6">
          <button
            onClick={() => navigate('/fasilitas-lingkungan')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs border border-stone-200 shadow-sm transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
          >
            <ArrowLeft className="w-4 h-4 text-stone-500" />
            <span>Kembali ke Fasilitas Lingkungan</span>
          </button>
          <div className="text-center py-16 space-y-3 bg-white rounded-2xl border border-stone-200">
            <Trees className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="font-bold text-stone-700">Fasilitas Tidak Ditemukan</h3>
            <p className="text-stone-500 text-xs max-w-sm mx-auto">
              Halaman fasilitas yang Anda tuju tidak tersedia atau sudah dinonaktifkan oleh pengurus.
            </p>
          </div>
        </Container>
      </div>
    );
  }

  const idx = allItems.findIndex((f) => f.slug === item.slug);
  const prev = idx > 0 ? allItems[idx - 1] : null;
  const next = idx < allItems.length - 1 ? allItems[idx + 1] : null;
  const siblings = allItems.filter((f) => f.category === item.category && f.slug !== item.slug);

  const facts = (item.facts || []).filter((f) => f.label?.trim() || f.value?.trim());
  const blocks = (item.blocks || []).filter((b) => b.enabled).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const gallery = (item.gallery || []).filter((p) => p.enabled && p.url).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Lightbox mengumpulkan gambar dari blok "image" lalu galeri (urutan render).
  const lightboxPhotos = [
    ...blocks
      .filter((b) => b.type === 'image' && b.imageUrl)
      .map((b) => ({ src: formatImageUrl(b.imageUrl!), caption: b.imageCaption || b.title || item.name })),
    ...gallery.map((p) => ({ src: formatImageUrl(p.url), caption: p.caption || item.name })),
  ];
  const openLightbox = (src: string) => {
    const i = lightboxPhotos.findIndex((p) => p.src === src);
    if (i >= 0) setLightboxIdx(i);
  };
  const closeLightbox = () => setLightboxIdx(null);
  const stepLightbox = (delta: number) =>
    setLightboxIdx((i) => (i === null ? null : (i + delta + lightboxPhotos.length) % lightboxPhotos.length));

  const heroSrc = item.imageUrl
    ? formatImageUrl(item.imageUrl)
    : gallery[0]
    ? formatImageUrl(gallery[0].url)
    : '';

  return (
    <div className="pb-10">
      <Container className="pt-6 space-y-6">
        {/* Breadcrumb + back */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          <Link
            to="/fasilitas-lingkungan"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-stone-50 text-stone-700 font-bold border border-stone-200 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
          >
            <ArrowLeft className="w-4 h-4 text-stone-500" />
            <span>Fasilitas Lingkungan</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
          <span className="font-semibold text-stone-500 truncate max-w-[60vw]">{item.name}</span>
        </div>

        {/* Header */}
        <Card radius="3xl" padding="none" className="overflow-hidden">
          {heroSrc && (
            <div className="w-full bg-stone-100 max-h-[280px] overflow-hidden">
              <img
                src={heroSrc}
                alt={item.name}
                style={item.aspectRatio ? { aspectRatio: String(item.aspectRatio) } : undefined}
                className="w-full h-auto max-h-[280px] object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_ENTITY_IMAGE_URL; }}
              />
            </div>
          )}
          <div className="p-5 sm:p-6 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
                {item.category || 'Fasilitas'}
              </span>
              {item.status && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusStyle(item.status)}`}>
                  {item.status}
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-stone-900 tracking-tight leading-tight">
              {item.name}
            </h1>
            {item.location && (
              <p className="text-xs sm:text-sm text-stone-500 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                <span>{item.location}</span>
              </p>
            )}
            {item.summary && (
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pt-1">{item.summary}</p>
            )}
          </div>
        </Card>

        {/* Fakta kunci */}
        {facts.length > 0 && (
          <Card radius="3xl" padding="lg" className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400">Informasi Ringkas</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {facts.map((f) => (
                <div key={f.id} className="text-xs sm:text-sm">
                  <dt className="font-bold text-stone-500">{f.label}</dt>
                  <dd className="text-stone-800 mt-0.5">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        )}

        {/* Blok konten */}
        {blocks.map((b) => {
          if (b.type === 'text') {
            return (
              <Card key={b.id} radius="3xl" padding="lg" className="space-y-2">
                {b.title && <h2 className="text-base font-black text-stone-900">{b.title}</h2>}
                {b.text && (
                  <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">{b.text}</p>
                )}
              </Card>
            );
          }
          if (b.type === 'image' && b.imageUrl) {
            const src = formatImageUrl(b.imageUrl);
            return (
              <Card key={b.id} radius="3xl" padding="lg" className="space-y-3">
                {b.title && <h2 className="text-base font-black text-stone-900">{b.title}</h2>}
                <button
                  onClick={() => openLightbox(src)}
                  className="block w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
                >
                  <img
                    src={src}
                    alt={b.imageCaption || b.title || item.name}
                    loading="lazy"
                    decoding="async"
                    style={b.aspectRatio ? { aspectRatio: String(b.aspectRatio) } : undefined}
                    className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_ENTITY_IMAGE_URL; }}
                  />
                </button>
                {b.imageCaption && (
                  <p className="text-[11px] italic text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                    "{b.imageCaption}"
                  </p>
                )}
              </Card>
            );
          }
          if (b.type === 'pdf') {
            const previewUrl = getDrivePreviewUrl(b.fileUrl);
            const viewUrl = getDriveViewUrl(b.fileUrl);
            return (
              <Card key={b.id} radius="3xl" padding="lg" className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-red-100 text-red-800 text-[11px] font-extrabold rounded-md flex items-center gap-1 border border-red-200">
                    <FileText className="w-3.5 h-3.5 text-red-600" />
                    <span>Dokumen PDF</span>
                  </span>
                  {b.title && <h2 className="text-base font-black text-stone-900">{b.title}</h2>}
                </div>
                {previewUrl && (
                  <iframe
                    src={previewUrl}
                    title={b.title || 'Dokumen PDF'}
                    className="w-full h-[520px] rounded-xl border border-stone-200"
                    loading="lazy"
                  />
                )}
                {(viewUrl || b.fileUrl) && (
                  <a
                    href={viewUrl || b.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={!viewUrl && b.fileName ? b.fileName : undefined}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
                  >
                    <Download className="w-4 h-4 text-emerald-300" />
                    <span>Buka Dokumen Lengkap</span>
                  </a>
                )}
              </Card>
            );
          }
          return null;
        })}

        {/* Galeri */}
        {gallery.length > 0 && (
          <Card radius="3xl" padding="lg" className="space-y-3">
            <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
              <ImageIcon className="w-4.5 h-4.5 text-emerald-700" />
              <span>Galeri Foto</span>
              <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                {gallery.length}
              </span>
            </h2>
            <div className="columns-2 sm:columns-3 gap-3 space-y-3">
              {gallery.map((p) => {
                const src = formatImageUrl(p.url);
                return (
                  <button
                    key={p.id}
                    onClick={() => openLightbox(src)}
                    className="block w-full break-inside-avoid rounded-2xl overflow-hidden border border-stone-200 group relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
                  >
                    <img
                      src={src}
                      alt={p.caption || item.name}
                      loading="lazy"
                      decoding="async"
                      style={p.aspectRatio ? { aspectRatio: String(p.aspectRatio) } : undefined}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_ENTITY_IMAGE_URL; }}
                    />
                    <span className="absolute bottom-2 right-2 p-1.5 bg-black/50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>
        )}

        {/* Peta */}
        {item.mapEmbedUrl && (
          <Card radius="3xl" padding="lg" className="space-y-3">
            <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
              <MapPin className="w-4.5 h-4.5 text-emerald-700" />
              <span>Lokasi</span>
            </h2>
            <div className="w-full aspect-video rounded-xl overflow-hidden border border-stone-200">
              <iframe
                src={item.mapEmbedUrl}
                title={`Peta ${item.name}`}
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </Card>
        )}

        {/* Sub-nav: fasilitas sekategori + prev/next */}
        {(siblings.length > 0 || prev || next) && (
          <div className="space-y-3 border-t border-stone-200 pt-5">
            {siblings.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Fasilitas lain — {item.category}
                </h2>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {siblings.map((s) => (
                    <Link
                      key={s.id}
                      to={`/fasilitas-lingkungan/${s.slug}`}
                      className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-700 hover:border-emerald-300 hover:text-emerald-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
                    >
                      <Trees className="w-3.5 h-3.5 text-stone-400" />
                      <span>{s.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-3">
              {prev ? (
                <Link
                  to={`/fasilitas-lingkungan/${prev.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-colors max-w-[45%] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
                >
                  <ChevronLeft className="w-4 h-4 text-stone-400 shrink-0" />
                  <span className="truncate">{prev.name}</span>
                </Link>
              ) : <span />}
              {next ? (
                <Link
                  to={`/fasilitas-lingkungan/${next.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-colors max-w-[45%] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
                >
                  <span className="truncate">{next.name}</span>
                  <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
                </Link>
              ) : <span />}
            </div>
          </div>
        )}

        <p className="text-[11px] text-stone-400 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>Data dikelola oleh pengurus RW 11 dan diperbarui berkala.</span>
        </p>
      </Container>

      {/* Lightbox */}
      {lightboxIdx !== null && lightboxPhotos[lightboxIdx] && (
        <div
          className="fixed inset-0 z-60 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-stone-300 p-2 text-xs font-bold flex items-center gap-1 cursor-pointer"
            onClick={closeLightbox}
          >
            <X className="w-6 h-6" />
            <span>Tutup</span>
          </button>

          {lightboxPhotos.length > 1 && (
            <button
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm cursor-pointer"
              onClick={(e) => { e.stopPropagation(); stepLightbox(-1); }}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <div className="relative max-w-4xl max-h-[85vh] flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxPhotos[lightboxIdx].src}
              alt={lightboxPhotos[lightboxIdx].caption}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-lg border border-white/20"
              onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_ENTITY_IMAGE_URL; }}
            />
            <p className="text-white text-center text-xs sm:text-sm bg-black/30 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-md max-w-xl">
              {lightboxPhotos[lightboxIdx].caption} · {lightboxIdx + 1} / {lightboxPhotos.length}
            </p>
          </div>

          {lightboxPhotos.length > 1 && (
            <button
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm cursor-pointer"
              onClick={(e) => { e.stopPropagation(); stepLightbox(1); }}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
