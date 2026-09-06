import React, { useState } from 'react';
import { Entity, BankSampahConfig } from '../types';
import { formatImageUrl } from '../utils/imageUrl';
import { FALLBACK_ENTITY_IMAGE_URL } from '../constants/defaults';
import { stripHtml } from '../utils/meta';
import {
  ArrowLeft,
  Recycle,
  ExternalLink,
  Globe,
  Calendar,
  Phone,
  MapPin,
  Info,
  Maximize2,
  X,
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, TikTokIcon, WhatsAppIcon } from '../components/SocialIcons';
import { Container } from '../components/ui/Container';

interface BankSampahPageProps {
  entity?: Entity;
  config?: BankSampahConfig;
  onBack: () => void;
}

export const BankSampahPage: React.FC<BankSampahPageProps> = ({ entity, config, onBack }) => {
  const [lightboxImage, setLightboxImage] = useState<{ url: string; caption?: string } | null>(null);

  if (!entity) {
    return (
      <Container className="py-8 space-y-6">
        <div className="flex justify-start">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs border border-stone-200 shadow-sm transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
          >
            <ArrowLeft className="w-4 h-4 text-stone-500" />
            <span>Kembali ke Beranda</span>
          </button>
        </div>
        <div className="text-center py-16 space-y-3">
          <Recycle className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="font-bold text-stone-700">Bank Sampah KMS Belum Tersedia</h3>
          <p className="text-stone-500 text-xs max-w-sm mx-auto">
            Data Bank Sampah KMS belum ditambahkan oleh pengurus melalui menu CMS.
          </p>
        </div>
      </Container>
    );
  }

  const socials = entity.socials;
  const hasInstagram = (socials?.instagram?.enabled && socials.instagram.url) || (!socials && entity.instagram);
  const instagramUrl = socials?.instagram?.url || entity.instagram || '';
  const hasFacebook = socials?.facebook?.enabled && socials.facebook.url;
  const facebookUrl = socials?.facebook?.url || '';
  const hasTikTok = socials?.tiktok?.enabled && socials.tiktok.url;
  const tiktokUrl = socials?.tiktok?.url || '';
  const hasWhatsApp = socials?.whatsapp?.enabled && socials.whatsapp.url;
  let whatsappUrl = socials?.whatsapp?.url || '';
  if (hasWhatsApp && whatsappUrl && !whatsappUrl.startsWith('http')) {
    const cleanNum = whatsappUrl.replace(/[^0-9]/g, '');
    whatsappUrl = `https://wa.me/${cleanNum.startsWith('0') ? '62' + cleanNum.slice(1) : cleanNum}`;
  }
  const hasAnySocial = hasInstagram || hasFacebook || hasTikTok || hasWhatsApp || entity.mediaUrl;
  const productPhotos = entity.productPhotos && entity.productPhotos.length > 0 ? entity.productPhotos : [];

  const heroLogo = config?.logoUrl ? formatImageUrl(config.logoUrl) : formatImageUrl(entity.image);
  // The hero shows the intro paragraph as a plain-text tagline; the body below
  // only needs the rest of the rich description so the intro isn't repeated twice.
  const introBreakIdx = entity.description.indexOf('<p>');
  const heroText = stripHtml(introBreakIdx >= 0 ? entity.description.slice(0, introBreakIdx) : entity.description);
  const bodyDescription = introBreakIdx >= 0 ? entity.description.slice(introBreakIdx) : '';

  const activeCharts = (config?.charts || [])
    .filter((c) => c.enabled && c.imageUrl)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="pb-10">
      {/* Global Back Button */}
      <Container className="pt-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs border border-stone-200 shadow-sm transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
          title="Kembali ke Beranda"
        >
          <ArrowLeft className="w-4 h-4 text-stone-500" />
          <span>Kembali ke Beranda</span>
        </button>
      </Container>

      {/* Full-bleed Hero Banner */}
      <div className="relative mt-6 bg-stone-950 overflow-hidden">
        <Container className="relative py-8 sm:py-14 flex flex-row items-start gap-4 sm:gap-10">
          <img
            src={heroLogo}
            alt={entity.name}
            className="w-16 h-16 sm:w-36 sm:h-36 object-contain shrink-0"
            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_ENTITY_IMAGE_URL; }}
          />
          <div className="text-left space-y-2 sm:space-y-3 max-w-2xl">
            <span className="inline-block text-[11px] font-bold text-emerald-200 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {entity.category}
            </span>
            <h1 className="text-xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {entity.name}
            </h1>
            <p className="text-stone-200 text-xs sm:text-base leading-relaxed">
              {heroText}
            </p>
          </div>
        </Container>
      </div>

      <Container className="pt-8 pb-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {bodyDescription && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Deskripsi & Fungsi Utama
                </h3>
                <div
                  className="text-stone-700 text-sm leading-relaxed prose prose-stone max-w-none space-y-2"
                  dangerouslySetInnerHTML={{ __html: bodyDescription }}
                />
              </div>
            )}

            {/* Product / Documentation Photos */}
            {productPhotos.length > 0 && (
              <div className="space-y-2 border-t border-stone-200 pt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Foto & Galeri
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {productPhotos.map((photo, idx) => {
                    const caption = entity.productPhotoCaptions?.[idx] || '';
                    return (
                      <div
                        key={idx}
                        onClick={() => setLightboxImage({ url: photo, caption })}
                        className="flex flex-col rounded-xl overflow-hidden border border-stone-200 group cursor-pointer hover:border-emerald-300 transition-all"
                      >
                        <div className="relative aspect-square w-full bg-stone-100 overflow-hidden">
                          <img
                            src={formatImageUrl(photo)}
                            alt={caption || `${entity.name} ${idx + 1}`}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_ENTITY_IMAGE_URL; }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Maximize2 className="w-4 h-4" />
                          </div>
                        </div>
                        {caption && (
                          <div className="p-2 bg-stone-50 text-[11px] text-stone-700 font-medium border-t border-stone-100 line-clamp-2">
                            {caption}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Dashboard Data Nasabah */}
            {config?.enabled && activeCharts.length > 0 && (
              <div className="border-t border-stone-200 pt-6 space-y-5">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-stone-900">
                    {config.dashboardTitle || 'Data Setoran Nasabah'}
                  </h2>
                  {config.dashboardDescription && (
                    <p className="text-xs sm:text-sm text-stone-500 mt-0.5">{config.dashboardDescription}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {activeCharts.map((chart) => (
                    <div key={chart.id} className="rounded-2xl border border-stone-200 bg-stone-50 overflow-hidden">
                      {chart.title && (
                        <div className="px-4 py-2.5 border-b border-stone-200 bg-white">
                          <h4 className="text-sm font-bold text-stone-700">{chart.title}</h4>
                        </div>
                      )}
                      <div className="flex items-center justify-center min-h-56 p-4">
                        <img
                          src={chart.imageUrl}
                          alt={chart.title || 'Chart Bank Sampah'}
                          loading="lazy"
                          className="max-w-full max-h-72 object-contain cursor-zoom-in hover:opacity-90 transition-opacity"
                          onClick={() => setLightboxImage({ url: chart.imageUrl, caption: chart.title })}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 lg:sticky lg:top-24 space-y-5">
            {/* Quick Info Panel */}
            {(entity.schedule?.trim() || entity.contact?.trim() || entity.address?.trim() || entity.infoNotes?.trim()) && (
              <div className="bg-stone-50 rounded-2xl p-5 space-y-4 text-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">Info Singkat</h3>
                {entity.schedule?.trim() && (
                  <div className="flex items-start gap-2 text-stone-700">
                    <Calendar className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-stone-900 block">Jadwal Operasional</span>
                      <span>{entity.schedule}</span>
                    </div>
                  </div>
                )}
                {entity.contact?.trim() && (
                  <div className="flex items-start gap-2 text-stone-700">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-stone-900 block">Kontak Pengurus</span>
                      <span>{entity.contact}</span>
                    </div>
                  </div>
                )}
                {entity.address?.trim() && (
                  <div className="flex items-start gap-2 text-stone-700">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-stone-900 block">Alamat Lokasi</span>
                      <span>{entity.address}</span>
                    </div>
                  </div>
                )}
                {entity.infoNotes?.trim() && (
                  <div className="flex items-start gap-2 text-stone-700">
                    <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-stone-900 block">Info Lainnya</span>
                      <span>{entity.infoNotes}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Social Media & Channels */}
            {hasAnySocial && (
              <div className="bg-stone-50 rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Sosial Media & Saluran Resmi
                </h3>
                <div className="flex flex-col gap-2">
                  {hasInstagram && (
                    <a href={instagramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-xl border border-pink-200/60 text-xs font-semibold transition-colors">
                      <InstagramIcon className="w-4 h-4" />
                      <span>Instagram</span>
                    </a>
                  )}
                  {hasWhatsApp && (
                    <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200/60 text-xs font-semibold transition-colors">
                      <WhatsAppIcon className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </a>
                  )}
                  {hasFacebook && (
                    <a href={facebookUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl border border-blue-200/60 text-xs font-semibold transition-colors">
                      <FacebookIcon className="w-4 h-4" />
                      <span>Facebook</span>
                    </a>
                  )}
                  {hasTikTok && (
                    <a href={tiktokUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-xl border border-stone-800 text-xs font-semibold transition-colors">
                      <TikTokIcon className="w-4 h-4" />
                      <span>TikTok</span>
                    </a>
                  )}
                  {entity.mediaUrl && (
                    <a href={entity.mediaUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl border border-sky-200/60 text-xs font-semibold transition-colors">
                      <Globe className="w-4 h-4" />
                      <span>Portal Website</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* CTA */}
            {entity.ctaUrl && entity.ctaUrl !== '#' && (
              <a
                href={entity.ctaUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-md transition-colors"
              >
                <span>{entity.ctaWording || 'Kunjungi Tautan'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </aside>
        </div>
      </Container>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-60 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightboxImage(null)}
              className="self-end text-white hover:text-stone-300 p-2 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <X className="w-6 h-6" />
              <span>Tutup</span>
            </button>
            <img
              src={formatImageUrl(lightboxImage.url)}
              alt={lightboxImage.caption || 'Galeri'}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-lg border border-white/20 bg-white"
            />
            {lightboxImage.caption && (
              <p className="text-white text-center text-xs sm:text-sm bg-black/30 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-md max-w-xl">
                {lightboxImage.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
