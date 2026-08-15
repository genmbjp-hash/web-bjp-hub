import React from 'react';
import { MediaPartnerItem } from '../../types';
import { Instagram, Youtube, Users } from 'lucide-react';
import { formatImageUrl } from '../../utils/imageUrl';

interface MediaPartnersSectionProps {
  partners?: MediaPartnerItem[];
}

export const MediaPartnersSection: React.FC<MediaPartnersSectionProps> = ({ partners = [] }) => {
  const activePartners = partners.filter((p) => p.enabled).sort((a, b) => a.order - b.order);

  if (activePartners.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-2.5 mb-6">
        <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
          <Users className="w-4 h-4" />
        </span>
        <h2 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight">
          Media Partner
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {activePartners.map((item) => {
          const logo = item.logoUrl
            ? formatImageUrl(item.logoUrl)
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=e7e5e4&color=44403c&bold=true`;

          return (
            <div
              key={item.id}
              className="bg-white p-3.5 rounded-xl border border-stone-200 flex flex-col items-center text-center gap-2 hover:border-stone-300 hover:shadow-xs transition-all"
            >
              <img
                src={logo}
                alt={item.name}
                loading="lazy"
                decoding="async"
                className="w-12 h-12 rounded-full object-cover border border-stone-200 bg-stone-50"
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=e7e5e4&color=44403c&bold=true`;
                }}
              />
              <h3 className="font-semibold text-stone-800 text-xs leading-snug line-clamp-2" title={item.name}>
                {item.name}
              </h3>

              {(item.instagramEnabled || item.youtubeEnabled) && (
                <div className="flex items-center gap-1.5">
                  {item.instagramEnabled && item.instagramUrl && (
                    <a
                      href={item.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-stone-500 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                      title={`Instagram ${item.name}`}
                    >
                      <Instagram className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {item.youtubeEnabled && item.youtubeUrl && (
                    <a
                      href={item.youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title={`YouTube ${item.name}`}
                    >
                      <Youtube className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
