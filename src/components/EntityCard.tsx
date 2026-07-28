import React from 'react';
import { Entity } from '../types';
import { formatImageUrl } from '../utils/imageUrl';
import { Globe, ExternalLink, Calendar, Phone, ArrowRight, Share2, MapPin, Info } from 'lucide-react';
import { SocialBadges } from './SocialIcons';

interface EntityCardProps {
  entity: Entity;
  onSelect: (entity: Entity) => void;
  onShare?: (entity: Entity) => void;
  onEdit?: (entity: Entity) => void;
  isCMSActive?: boolean;
}

export const EntityCard: React.FC<EntityCardProps> = ({
  entity,
  onSelect,
  onShare,
  onEdit,
  isCMSActive,
}) => {
  // Extract text preview without raw html tags
  const cleanDescription = entity.description.replace(/<[^>]*>?/gm, '');

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden relative">
      {/* Category Badge & Image Header */}
      <div className="relative h-44 bg-stone-100 overflow-hidden cursor-pointer" onClick={() => onSelect(entity)}>
        <img
          src={formatImageUrl(entity.image)}
          alt={entity.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // Fallback image if broken
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Category Tag */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="bg-emerald-800/90 backdrop-blur-md text-emerald-50 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-emerald-600/30 shadow-xs">
            {entity.category}
          </span>
        </div>

        {/* Top Right Share Button */}
        {onShare && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onShare(entity);
            }}
            className="absolute top-3 right-3 z-10 p-2 bg-black/40 hover:bg-black/70 text-white rounded-xl backdrop-blur-md transition-all shadow-xs"
            title="Bagikan Card ini ke WhatsApp & Sosmed"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Bottom Title Overlay on Image */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="font-bold text-base sm:text-lg leading-snug drop-shadow-xs group-hover:text-emerald-300 transition-colors line-clamp-1">
            {entity.name}
          </h3>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        {/* Description preview */}
        <p className="text-stone-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
          {cleanDescription}
        </p>

        {/* Extra info pills if available (Jam Buka, Telepon, Alamat, Info Lainnya) */}
        {(Boolean(entity.schedule?.trim()) ||
          Boolean(entity.contact?.trim()) ||
          Boolean(entity.address?.trim()) ||
          Boolean(entity.infoNotes?.trim())) && (
          <div className="space-y-1.5 pt-1 text-xs text-stone-500 border-t border-stone-100">
            {entity.schedule?.trim() && (
              <div className="flex items-center gap-1.5 line-clamp-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>{entity.schedule}</span>
              </div>
            )}
            {entity.contact?.trim() && (
              <div className="flex items-center gap-1.5 line-clamp-1">
                <Phone className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>{entity.contact}</span>
              </div>
            )}
            {entity.address?.trim() && (
              <div className="flex items-center gap-1.5 line-clamp-1 text-stone-600">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>{entity.address}</span>
              </div>
            )}
            {entity.infoNotes?.trim() && (
              <div className="flex items-center gap-1.5 line-clamp-1 text-stone-600">
                <Info className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>{entity.infoNotes}</span>
              </div>
            )}
          </div>
        )}

        {/* Social Badges & Actions */}
        <div className="pt-2 flex items-center justify-between gap-2 border-t border-stone-100">
          {/* Social Links */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <SocialBadges socials={entity.socials} fallbackInstagram={entity.instagram} />
            {entity.mediaUrl && (
              <a
                href={entity.mediaUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200/60"
                title="Tautan Media/Website"
                onClick={(e) => e.stopPropagation()}
              >
                <Globe className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            {onShare && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(entity);
                }}
                className="p-1.5 text-stone-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                title="Bagikan"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => onSelect(entity)}
              className="text-stone-600 hover:text-stone-900 text-xs font-semibold px-2 py-1.5 rounded-lg hover:bg-stone-100 transition-colors"
            >
              Detail
            </button>

            {entity.ctaUrl && entity.ctaUrl !== '#' ? (
              <a
                href={entity.ctaUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
                onClick={(e) => e.stopPropagation()}
              >
                <span>{entity.ctaWording || 'Akses Link'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <button
                onClick={() => onSelect(entity)}
                className="inline-flex items-center gap-1 bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              >
                <span>Lihat Info</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
