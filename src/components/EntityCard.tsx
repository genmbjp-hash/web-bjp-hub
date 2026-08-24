import React from 'react';
import { Entity } from '../types';
import { formatImageUrl } from '../utils/imageUrl';
import { stripHtml } from '../utils/meta';
import { Calendar, Phone, ArrowRight, MapPin, Info, Edit } from 'lucide-react';
import { SocialBadges } from './SocialIcons';
import { PhotoAlbumCard } from './PhotoAlbumCard';
import { Card } from './ui/Card';

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
  if (entity.cardType === 'photo_album') {
    return (
      <PhotoAlbumCard
        entity={entity}
        onSelect={onSelect}
        onShare={onShare}
        onEdit={onEdit}
        isCMSAllowed={isCMSActive}
      />
    );
  }

  const cleanDescription = stripHtml(entity.description);

  return (
    <Card padding="none" interactive className="h-full group flex flex-col overflow-hidden">
      {/* Image Header */}
      <div
        className="relative h-40 bg-stone-100 overflow-hidden cursor-pointer shrink-0"
        onClick={() => onSelect(entity)}
      >
        <img
          src={formatImageUrl(entity.image)}
          alt={entity.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />

        {/* Category Badge */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="bg-emerald-700/90 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-md">
            {entity.category}
          </span>
        </div>

        {/* CMS Edit button (top right) */}
        {isCMSActive && onEdit && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onEdit(entity); }}
            className="absolute top-2.5 right-2.5 z-10 p-1.5 bg-amber-400/90 hover:bg-amber-500 text-stone-900 rounded-lg backdrop-blur-md transition-all shadow-sm"
            title="Edit entitas ini"
          >
            <Edit className="w-3 h-3" />
          </button>
        )}

        {/* Title overlay */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
          <h3 className="font-bold text-base leading-snug drop-shadow-sm line-clamp-2">
            {entity.name}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div className="p-3 flex-1 flex flex-col gap-2">
        {/* Description */}
        <p className="text-stone-700 text-sm line-clamp-2 leading-relaxed flex-1">
          {cleanDescription}
        </p>

        {/* Info row (schedule/contact) */}
        {(entity.schedule?.trim() || entity.contact?.trim()) && (
          <div className="space-y-1 text-xs text-stone-700 border-t border-stone-200 pt-2">
            {entity.schedule?.trim() && (
              <div className="flex items-center gap-1 line-clamp-1">
                <Calendar className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>{entity.schedule}</span>
              </div>
            )}
            {entity.contact?.trim() && (
              <div className="flex items-center gap-1 line-clamp-1">
                <Phone className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>{entity.contact}</span>
              </div>
            )}
            {entity.address?.trim() && (
              <div className="flex items-center gap-1 line-clamp-1">
                <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>{entity.address}</span>
              </div>
            )}
            {entity.infoNotes?.trim() && (
              <div className="flex items-center gap-1 line-clamp-1">
                <Info className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>{entity.infoNotes}</span>
              </div>
            )}
          </div>
        )}

        {/* Social badges */}
        {(entity.socials || entity.instagram) && (
          <div className="flex items-center gap-1 flex-wrap border-t border-stone-100 pt-2">
            <SocialBadges socials={entity.socials} fallbackInstagram={entity.instagram} size="md" />
          </div>
        )}

        {/* Single unified CTA button */}
        <div className="mt-auto pt-2 border-t border-stone-100">
          <button
            onClick={() => onSelect(entity)}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
          >
            Lihat Detail
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>
    </Card>
  );
};
