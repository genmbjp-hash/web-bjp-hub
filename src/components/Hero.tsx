import React from 'react';
import { Sparkles } from 'lucide-react';
import { BJP_LOGO_URL } from '../assets/logo';

interface HeroProps {
  onOpenCMS: () => void;
  totalEntities: number;
  logoUrl?: string;
}

import { formatImageUrl } from '../utils/imageUrl';

export const Hero: React.FC<HeroProps> = ({ totalEntities, logoUrl }) => {
  const displayLogo = logoUrl ? formatImageUrl(logoUrl) : BJP_LOGO_URL;

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 text-white border-b border-stone-800">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3.5">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pusat Informasi & Ekosistem Terpadu Komplek Bintara Jaya Permai (RW 11)</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Seluruh Informasi Kegiatan & Komunitas Komplek <span className="text-emerald-400 underline decoration-emerald-500/40 underline-offset-4">Dalam Satu Tempat</span>
            </h1>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Selamat datang di portal informasi terpadu RW 11 Bintara Jaya Permai.
            </p>
          </div>

          <div className="hidden md:flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xs shrink-0">
            <img
              src={displayLogo}
              alt="Logo BJP HUB RW 11"
              className="w-20 h-20 rounded-xl object-cover border border-amber-400/40 shadow-xl"
            />
            <span className="text-xs font-bold text-amber-300 mt-2">BJP HUB</span>
            <span className="text-[10px] text-stone-400 font-medium">Official RW 11 Portal</span>
          </div>
        </div>
      </div>
    </div>
  );
};

