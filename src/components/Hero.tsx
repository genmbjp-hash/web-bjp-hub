import React from 'react';
import { Sparkles } from 'lucide-react';

interface HeroProps {
  onOpenCMS: () => void;
  totalEntities: number;
}

export const Hero: React.FC<HeroProps> = ({ totalEntities }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 text-white border-b border-stone-800">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 relative z-10">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pusat Informasi & Ekosistem Terpadu Komplek Bintara Jaya Permai</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Seluruh Informasi Kegiatan & Komunitas Komplek <span className="text-emerald-400 underline decoration-emerald-500/40 underline-offset-4">Dalam Satu Tempat</span>
          </h1>

          <p className="text-stone-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Selamat datang di portal informasi terpadu RW 11 Bintara Jaya Permai.
          </p>


        </div>
      </div>
    </div>
  );
};

