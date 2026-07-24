import React from 'react';
import { Entity } from '../types';
import { X, ExternalLink, Globe, Calendar, Phone, Shield, Share2, Check } from 'lucide-react';
import { SocialBadges } from './SocialIcons';

interface EntityDetailModalProps {
  entity: Entity | null;
  onClose: () => void;
  onEdit?: (entity: Entity) => void;
  isCMSActive?: boolean;
}

export const EntityDetailModal: React.FC<EntityDetailModalProps> = ({
  entity,
  onClose,
  onEdit,
  isCMSActive,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!entity) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative h-56 sm:h-64 bg-stone-100 overflow-hidden">
          <img
            src={entity.image}
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

          {/* Category Tag & Featured */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="bg-emerald-800 text-emerald-50 text-xs font-semibold px-3 py-1 rounded-lg border border-emerald-600/30">
              {entity.category}
            </span>
            {entity.isFeatured && (
              <span className="bg-amber-400 text-amber-950 text-xs font-bold px-2.5 py-1 rounded-lg">
                ★ Unggulan Komplek
              </span>
            )}
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
          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-xs">
            {entity.schedule && (
              <div className="flex items-start gap-2 text-stone-700">
                <Calendar className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-900 block">Jadwal Operasional / Rutin:</span>
                  <span>{entity.schedule}</span>
                </div>
              </div>
            )}
            {entity.contact && (
              <div className="flex items-start gap-2 text-stone-700">
                <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-900 block">Kontak Pengurus / Admin:</span>
                  <span>{entity.contact}</span>
                </div>
              </div>
            )}
          </div>

          {/* Description Content */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider text-stone-400">
              Deskripsi & Fungsi Utama
            </h3>
            <div
              className="text-stone-700 text-sm leading-relaxed prose prose-stone max-w-none space-y-2"
              dangerouslySetInnerHTML={{ __html: entity.description }}
            />
          </div>

          {/* Social / Extra Links */}
          <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center gap-3">
            <SocialBadges socials={entity.socials} fallbackInstagram={entity.instagram} size="md" />

            {entity.mediaUrl && (
              <a
                href={entity.mediaUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-2 rounded-xl border border-blue-200 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>Portal Media / Website</span>
              </a>
            )}

            <button
              onClick={handleShare}
              className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold px-3 py-2 rounded-xl border border-stone-200 transition-colors ml-auto"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Tautan Disalin!' : 'Bagikan Info'}</span>
            </button>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-semibold rounded-xl hover:bg-stone-200 transition-colors"
          >
            Tutup
          </button>

          <div className="flex items-center gap-2">
            {isCMSActive && onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(entity);
                }}
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-colors"
              >
                <Shield className="w-4 h-4" />
                <span>Edit Entitas di CMS</span>
              </button>
            )}

            {entity.ctaUrl && entity.ctaUrl !== '#' && (
              <a
                href={entity.ctaUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-md transition-colors"
              >
                <span>{entity.ctaWording || 'Kunjungi Tautan'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
