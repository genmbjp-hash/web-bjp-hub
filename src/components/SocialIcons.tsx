import React from 'react';
import { EntitySocials } from '../types';

export const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

export const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68a6.34 6.34 0 0 0 10.86 4.49A6.27 6.27 0 0 0 15.8 15.7V8.87a8.28 8.28 0 0 0 4.8 1.53V6.95a4.84 4.84 0 0 1-1.01-.26z" />
  </svg>
);

export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.67-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.99c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.87 11.87 0 0 0 5.707 1.456h.005c6.554 0 11.89-5.335 11.893-11.893 0-3.177-1.238-6.163-3.488-8.411" />
  </svg>
);

interface SocialBadgesProps {
  socials?: EntitySocials;
  fallbackInstagram?: string;
  size?: 'sm' | 'md';
}

export const SocialBadges: React.FC<SocialBadgesProps> = ({
  socials,
  fallbackInstagram,
  size = 'sm',
}) => {
  // Compute enabled items
  const hasInstagram =
    (socials?.instagram?.enabled && socials.instagram.url) ||
    (!socials && fallbackInstagram);
  const instagramUrl = socials?.instagram?.url || fallbackInstagram || '';

  const hasFacebook = socials?.facebook?.enabled && socials.facebook.url;
  const facebookUrl = socials?.facebook?.url || '';

  const hasTikTok = socials?.tiktok?.enabled && socials.tiktok.url;
  const tiktokUrl = socials?.tiktok?.url || '';

  const hasWhatsApp = socials?.whatsapp?.enabled && socials.whatsapp.url;
  let whatsappUrl = socials?.whatsapp?.url || '';
  if (hasWhatsApp && whatsappUrl && !whatsappUrl.startsWith('http')) {
    // Clean phone number
    const cleanNum = whatsappUrl.replace(/[^0-9]/g, '');
    whatsappUrl = `https://wa.me/${cleanNum.startsWith('0') ? '62' + cleanNum.slice(1) : cleanNum}`;
  }

  if (!hasInstagram && !hasFacebook && !hasTikTok && !hasWhatsApp) {
    return null;
  }

  const paddingClass = size === 'md' ? 'p-2' : 'p-1.5';
  const iconClass = size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {hasInstagram && (
        <a
          href={instagramUrl}
          target="_blank"
          rel="noreferrer"
          className={`${paddingClass} bg-pink-50 text-pink-700 hover:bg-pink-100 rounded-lg transition-colors border border-pink-200/60`}
          title="Instagram"
          onClick={(e) => e.stopPropagation()}
        >
          <InstagramIcon className={iconClass} />
        </a>
      )}

      {hasFacebook && (
        <a
          href={facebookUrl}
          target="_blank"
          rel="noreferrer"
          className={`${paddingClass} bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200/60`}
          title="Facebook"
          onClick={(e) => e.stopPropagation()}
        >
          <FacebookIcon className={iconClass} />
        </a>
      )}

      {hasTikTok && (
        <a
          href={tiktokUrl}
          target="_blank"
          rel="noreferrer"
          className={`${paddingClass} bg-stone-900 text-stone-100 hover:bg-stone-800 rounded-lg transition-colors border border-stone-800`}
          title="TikTok"
          onClick={(e) => e.stopPropagation()}
        >
          <TikTokIcon className={iconClass} />
        </a>
      )}

      {hasWhatsApp && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className={`${paddingClass} bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200/60`}
          title="WhatsApp"
          onClick={(e) => e.stopPropagation()}
        >
          <WhatsAppIcon className={iconClass} />
        </a>
      )}
    </div>
  );
};
