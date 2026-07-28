import React from 'react';
import { Entity } from '../types';
import { stripHtml } from '../utils/meta';
import { formatImageUrl } from '../utils/imageUrl';
import {
  X,
  ExternalLink,
  Globe,
  Calendar,
  Phone,
  Share2,
  Check,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Maximize2,
  MapPin,
  Info,
} from 'lucide-react';
import {
  InstagramIcon,
  FacebookIcon,
  TikTokIcon,
  WhatsAppIcon,
} from './SocialIcons';

interface EntityDetailModalProps {
  entity: Entity | null;
  onClose: () => void;
  onShare?: (entity: Entity) => void;
}

export const EntityDetailModal: React.FC<EntityDetailModalProps> = ({
  entity,
  onClose,
  onShare,
}) => {
  const [copied, setCopied] = React.useState(false);
  const [isPhotosExpanded, setIsPhotosExpanded] = React.useState(true);
  const [selectedLightboxImage, setSelectedLightboxImage] = React.useState<{ photo: string; caption?: string } | null>(null);

  if (!entity) return null;

  const handleShare = async () => {
    if (onShare) {
      onShare(entity);
      return;
    }
    const shareUrl = `${window.location.origin}${window.location.pathname}?entity=${entity.id}`;
    const cleanDesc = stripHtml(entity.description);
    const snippet = cleanDesc.length > 120 ? cleanDesc.slice(0, 120) + '...' : cleanDesc;
    const shareTitle = `${entity.name} - BJP HUB Bintara Jaya Permai`;
    const shareText = `📌 *${entity.name}*\nKategori: ${entity.category}\n\n${snippet}\n\nLihat informasi selengkapnya:`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // User cancelled or share failed, fallback to clipboard
      }
    }

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
        // clipboard error fallback
      }
    }
  };

  // Active Social Media Check
  const socials = entity.socials;
  const hasInstagram =
    (socials?.instagram?.enabled && socials.instagram.url) ||
    (!socials && entity.instagram);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative h-56 sm:h-64 bg-stone-100 overflow-hidden">
          <img
            src={formatImageUrl(entity.image)}
            alt={entity.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/80 hover:bg-white text-stone-800 p-2 rounded-full shadow-md transition-all z-10"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Category Tag */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="bg-emerald-800 text-emerald-50 text-xs font-semibold px-3 py-1 rounded-lg border border-emerald-600/30">
              {entity.category}
            </span>
          </div>

          {/* Bottom Title inside Image */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 className="text-xl sm:text-2xl font-extrabold leading-tight drop-shadow-md">
              {entity.name}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 flex-1">
          {/* Quick Info Grid (Jam Buka, Telepon, Alamat, Info Lainnya) */}
          {(Boolean(entity.schedule?.trim()) ||
            Boolean(entity.contact?.trim()) ||
            Boolean(entity.address?.trim()) ||
            Boolean(entity.infoNotes?.trim())) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 text-xs">
              {entity.schedule?.trim() && (
                <div className="flex items-start gap-2 text-stone-700">
                  <Calendar className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-900 block">Jadwal Operasional / Jam Buka:</span>
                    <span>{entity.schedule}</span>
                  </div>
                </div>
              )}
              {entity.contact?.trim() && (
                <div className="flex items-start gap-2 text-stone-700">
                  <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-900 block">Kontak Pengurus / Telepon:</span>
                    <span>{entity.contact}</span>
                  </div>
                </div>
              )}
              {entity.address?.trim() && (
                <div className="flex items-start gap-2 text-stone-700">
                  <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-900 block">Alamat Lokasi:</span>
                    <span>{entity.address}</span>
                  </div>
                </div>
              )}
              {entity.infoNotes?.trim() && (
                <div className="flex items-start gap-2 text-stone-700">
                  <Info className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-900 block">Info Lainnya / Catatan:</span>
                    <span>{entity.infoNotes}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Description Content */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Deskripsi & Fungsi Utama
            </h3>
            <div
              className="text-stone-700 text-sm leading-relaxed prose prose-stone max-w-none space-y-2"
              dangerouslySetInnerHTML={{ __html: entity.description }}
            />
          </div>

          {/* Optional Product Photos Section (Expandable / Collapsible) */}
          {productPhotos.length > 0 && (
            <div className="border border-stone-200 rounded-2xl overflow-hidden bg-stone-50/50">
              <button
                type="button"
                onClick={() => setIsPhotosExpanded(!isPhotosExpanded)}
                className="w-full px-4 py-3 bg-stone-100 hover:bg-stone-200/80 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs sm:text-sm font-bold text-stone-900">
                    Foto Produk & Galeri
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                    {productPhotos.length} Foto
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-stone-500 font-medium">
                  <span>{isPhotosExpanded ? 'Sembunyikan' : 'Tampilkan Foto'}</span>
                  {isPhotosExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isPhotosExpanded && (
                <div className="p-4 bg-white border-t border-stone-200">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {productPhotos.map((photo, idx) => {
                      const caption = entity.productPhotoCaptions?.[idx] || '';
                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedLightboxImage({ photo, caption })}
                          className="flex flex-col bg-stone-50 rounded-xl overflow-hidden border border-stone-200 group cursor-pointer hover:border-emerald-300 transition-all shadow-2xs"
                        >
                          <div className="relative aspect-square w-full bg-stone-100 overflow-hidden">
                            <img
                              src={formatImageUrl(photo)}
                              alt={caption || `${entity.name} produk ${idx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80';
                              }}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1">
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
                  <p className="text-[11px] text-stone-400 mt-2 text-center">
                    Klik foto untuk memperbesar tampilan dan melihat foto selengkapnya.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Social Media & Active Channels */}
          {hasAnySocial && (
            <div className="pt-3 border-t border-stone-200 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Sosial Media & Saluran Resmi Aktif
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                {hasInstagram && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-xl border border-pink-200/60 text-xs font-semibold transition-colors"
                  >
                    <InstagramIcon className="w-4 h-4" />
                    <span>Instagram</span>
                  </a>
                )}

                {hasWhatsApp && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200/60 text-xs font-semibold transition-colors"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                )}

                {hasFacebook && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl border border-blue-200/60 text-xs font-semibold transition-colors"
                  >
                    <FacebookIcon className="w-4 h-4" />
                    <span>Facebook</span>
                  </a>
                )}

                {hasTikTok && (
                  <a
                    href={tiktokUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-xl border border-stone-800 text-xs font-semibold transition-colors"
                  >
                    <TikTokIcon className="w-4 h-4" />
                    <span>TikTok</span>
                  </a>
                )}

                {entity.mediaUrl && (
                  <a
                    href={entity.mediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl border border-sky-200/60 text-xs font-semibold transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Portal Website</span>
                  </a>
                )}

                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl border border-stone-200 text-xs font-semibold transition-colors ml-auto"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                  <span>{copied ? 'Tautan Disalin!' : 'Bagikan Info'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions (Without Edit Entity Button) */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-semibold rounded-xl hover:bg-stone-200 transition-colors"
          >
            Tutup
          </button>

          {entity.ctaUrl && entity.ctaUrl !== '#' && (
            <a
              href={entity.ctaUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-md transition-colors ml-auto"
            >
              <span>{entity.ctaWording || 'Kunjungi Tautan'}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Lightbox Modal for Product Photos */}
      {selectedLightboxImage && (
        <div
          className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedLightboxImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh] flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedLightboxImage(null)}
              className="self-end text-white hover:text-stone-300 p-2 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <X className="w-6 h-6" />
              <span>Tutup</span>
            </button>
            <img
              src={formatImageUrl(selectedLightboxImage.photo)}
              alt={selectedLightboxImage.caption || "Galeri Produk"}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/20"
            />
            {selectedLightboxImage.caption && (
              <p className="text-white text-center text-xs sm:text-sm bg-black/60 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-xs max-w-xl">
                {selectedLightboxImage.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

