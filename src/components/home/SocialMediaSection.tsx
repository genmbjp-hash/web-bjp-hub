import React from 'react';
import { ExternalLink, Share2, Instagram, Youtube } from 'lucide-react';
import { MediaPartnerItem } from '../../types';
import { MediaPartnersSection } from './MediaPartnersSection';
import { Container } from '../ui/Container';
import { Card } from '../ui/Card';

// Icon badges keep just enough brand color for recognition; the card itself
// stays neutral so the section doesn't compete with the site's emerald accent.
const SOCIAL_LINKS = [
  {
    id: 'instagram',
    label: 'Instagram BJP.hub',
    handle: '@bintarajayapermai.ofc',
    url: 'https://www.instagram.com/bintarajayapermai.ofc/',
    icon: Instagram,
    iconClass: 'bg-pink-50 text-pink-600',
    description: 'Follow kami untuk info kegiatan terbaru',
  },
  {
    id: 'youtube',
    label: 'YouTube BJP.hub',
    handle: '@BJP.hub RW 11',
    url: 'https://www.youtube.com/@bjphub',
    icon: Youtube,
    iconClass: 'bg-red-50 text-red-600',
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
      <Container>
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
              <Card
                key={social.id}
                as="a"
                href={social.url}
                target="_blank"
                rel="noreferrer"
                interactive
                padding="lg"
                className="group flex-1 flex flex-col items-center gap-3 text-center cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${social.iconClass}`}>
                  <Icon />
                </div>
                <div>
                  <p className="font-black text-lg text-stone-900">{social.label}</p>
                  <p className="text-stone-500 text-sm">{social.handle}</p>
                </div>
                <p className="text-stone-600 text-xs leading-relaxed">{social.description}</p>
                <div className="flex items-center gap-1.5 bg-emerald-50 group-hover:bg-emerald-100 text-emerald-800 text-xs font-bold px-4 py-2 rounded-xl transition-colors mt-1">
                  <span>Kunjungi Sekarang</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Media Partner (merged into the same "follow us" section) */}
        {hasPartners && (
          <div className="mt-10 pt-10 border-t border-stone-200 max-w-4xl mx-auto">
            <MediaPartnersSection partners={mediaPartners} />
          </div>
        )}
      </Container>
    </section>
  );
};
