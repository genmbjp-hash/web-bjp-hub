import React from 'react';
import { ExternalLink, Share2, Instagram, Youtube } from 'lucide-react';
import { MediaPartnerItem } from '../../types';
import { MediaPartnersSection } from './MediaPartnersSection';

const SOCIAL_LINKS = [
  {
    id: 'instagram',
    label: 'Instagram BJP.hub',
    handle: '@bintarajayapermai.ofc',
    url: 'https://www.instagram.com/bintarajayapermai.ofc/',
    icon: Instagram,
    gradientClass: 'from-purple-600 via-pink-600 to-orange-500',
    bgHover: 'hover:shadow-pink-500/30',
    description: 'Follow kami untuk info kegiatan terbaru',
  },
  {
    id: 'youtube',
    label: 'YouTube BJP.hub',
    handle: '@BJP.hub RW 11',
    url: 'https://www.youtube.com/@bjphub',
    icon: Youtube,
    gradientClass: 'from-red-700 to-red-500',
    bgHover: 'hover:shadow-red-500/30',
    description: 'Tonton video dokumentasi kegiatan kami',
  },
];

interface SocialMediaSectionProps {
  mediaPartners?: MediaPartnerItem[];
}

export const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({ mediaPartners = [] }) => {
  const hasPartners = mediaPartners.some((p) => p.enabled);

  return (
    <section className="bg-stone-50 py-12 border-t border-stone-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full mb-4 ring-4 ring-emerald-50">
            <Share2 className="w-6 h-6 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-black text-stone-900 mb-2">Ikuti Keseruannya!</h2>
          <p className="text-sm text-stone-500 max-w-md mx-auto">
            Dapatkan informasi, foto, dan video kegiatan terbaru BJP.hub langsung di sosial media kamu.
          </p>
        </div>

        {/* Official Channel Cards */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center max-w-2xl mx-auto">
          {SOCIAL_LINKS.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className={`group flex-1 relative overflow-hidden rounded-3xl p-8 flex flex-col items-center gap-4 text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl ${social.bgHover}`}
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${social.gradientClass} opacity-90`} />
                <div className="absolute inset-0 bg-black/10" />

                <div className="relative z-10 flex flex-col items-center gap-3 text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                    <Icon />
                  </div>
                  <div>
                    <p className="font-black text-lg">{social.label}</p>
                    <p className="text-white/70 text-sm">{social.handle}</p>
                  </div>
                  <p className="text-white/80 text-xs leading-relaxed">{social.description}</p>
                  <div className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-4 py-2 rounded-xl backdrop-blur-sm transition-colors mt-1">
                    <span>Kunjungi Sekarang</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Media Partner (merged into the same "follow us" section) */}
        {hasPartners && (
          <div className="mt-10 pt-10 border-t border-stone-200 max-w-4xl mx-auto">
            <MediaPartnersSection partners={mediaPartners} />
          </div>
        )}
      </div>
    </section>
  );
};
