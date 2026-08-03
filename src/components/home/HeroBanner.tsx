import React from 'react';
import { SiteSettings } from '../../types';
import { MapPin, Users, Building2, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  siteSettings: SiteSettings;
  totalEntities: number;
  totalAnnouncements: number;
  onExplore: () => void;
}

const HERO_BG = '/images/hero-beranda.jpg';

export const HeroBanner: React.FC<HeroBannerProps> = ({
  siteSettings,
  totalEntities,
  totalAnnouncements,
  onExplore,
}) => {
  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image full width */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      
      {/* Gradient Overlay for text clarity: dark at the edges, slightly lighter in the middle */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/90 via-stone-900/60 to-stone-950/90" />
      <div className="absolute inset-0 bg-emerald-950/30 mix-blend-multiply" />

      {/* Content */}
      <div className="relative z-10 px-4 max-w-4xl mx-auto flex flex-col items-center gap-6 text-center">
        {/* Title & Tagline */}
        <div className="space-y-8 md:space-y-10 max-w-3xl">
          <div className="flex flex-col items-center justify-center gap-4 md:gap-5">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-widest leading-tight drop-shadow-2xl text-center whitespace-nowrap">
              SELAMAT DATANG DI BJP.hub
            </h1>
            <h2 className="text-sm sm:text-base md:text-lg text-emerald-300 font-bold tracking-[0.15em] uppercase drop-shadow-lg text-center">
              Komplek Bintara Jaya Permai RW 011
            </h2>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-emerald-50/90 leading-relaxed font-medium text-center max-w-2xl mx-auto">
            Pusat informasi, kolaborasi, dan koordinasi seluruh aktivitas warga. BJP.hub mengintegrasikan berbagai elemen sosial, olahraga, ekonomi, dan keagamaan agar berjalan selaras, inklusif, dan memberikan manfaat maksimal bagi seluruh warga komplek.
          </p>
        </div>
      </div>
    </section>
  );
};
