import React, { useState } from 'react';
import { Share2, Check, Sparkles, ExternalLink, Copy } from 'lucide-react';
import { BJP_LOGO_URL, BJP_LOGO_FALLBACK_SVG } from '../assets/logo';
import { formatImageUrl } from '../utils/imageUrl';

interface HomePageHeaderProps {
  siteTitle?: string;
  siteDescription?: string;
  logoUrl?: string;
  totalEntities: number;
}

export const HomePageHeader: React.FC<HomePageHeaderProps> = ({
  siteTitle = 'BJP HUB Bintara Jaya Permai',
  siteDescription = 'Portal Resmi Ekosistem & Kegiatan Warga Komplek Bintara Jaya Permai (RW 11)',
  logoUrl,
  totalEntities,
}) => {
  const [copied, setCopied] = useState(false);
  const displayLogo = logoUrl ? formatImageUrl(logoUrl) : BJP_LOGO_URL;

  const handleShareHomepage = async () => {
    const homepageUrl = window.location.origin + window.location.pathname;
    
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(homepageUrl);
      } else {
        const input = document.createElement('input');
        input.value = homepageUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-stone-800 relative overflow-hidden mb-8">
      {/* Background Subtle Grid Effect */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
      <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8">
        
        {/* Left Info Column */}
        <div className="flex-1 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Home Page &amp; Ekosistem RW 11</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold bg-emerald-400/20 px-1.5 py-0.2 rounded-md">
              {totalEntities} Entitas
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
            {siteTitle}
          </h1>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
            {siteDescription}
          </p>

          {/* Seamless CTA Share Homepage Button */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleShareHomepage}
              className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm shadow-lg transition-all transform cursor-pointer active:scale-95 ${
                copied
                  ? 'bg-emerald-500 text-stone-950 border border-emerald-400 font-extrabold shadow-emerald-500/20'
                  : 'bg-white hover:bg-emerald-50 text-stone-900 hover:text-emerald-950 border border-white/80 shadow-stone-950/40'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-stone-950 stroke-[3]" />
                  <span>Tautan Home Page Disalin!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-emerald-700" />
                  <span>Bagikan Halaman Ini</span>
                  <Copy className="w-3.5 h-3.5 text-stone-400 ml-0.5" />
                </>
              )}
            </button>

            {copied && (
              <span className="text-xs text-emerald-300 font-medium animate-fade-in flex items-center gap-1.5 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>URL disalin ke clipboard</span>
              </span>
            )}
          </div>
        </div>

        {/* Right Logo & Badge */}
        <div className="flex md:flex-col items-center gap-4 bg-white/5 backdrop-blur-md p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-white/10 shrink-0 self-center md:self-auto shadow-2xl">
          <img
            src={displayLogo}
            alt={siteTitle}
            className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-2xl sm:rounded-3xl object-contain bg-white border-2 border-amber-400 p-2 shadow-xl shrink-0"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== BJP_LOGO_FALLBACK_SVG) {
                target.src = BJP_LOGO_FALLBACK_SVG;
              }
            }}
          />
          <div className="text-left md:text-center space-y-0.5">
            <h4 className="font-extrabold text-white text-sm sm:text-base tracking-tight">
              BJP HUB Official
            </h4>
            <p className="text-[11px] text-stone-300 font-medium">
              Komplek Bintara Jaya Permai (RW 11)
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
