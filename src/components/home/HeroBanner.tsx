import React from 'react';
import { Users, Megaphone, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  siteTitle?: string;
  siteDescription?: string;
  totalEntities?: number;
  totalAnnouncements?: number;
}

const HERO_BG = '/images/hero-beranda.jpg';

export const HeroBanner: React.FC<HeroBannerProps> = ({
  siteTitle,
  siteDescription,
  totalEntities = 0,
  totalAnnouncements = 0,
}) => {
  const title = siteTitle || 'BJP.hub';
  const description =
    siteDescription ||
    'Pusat informasi, kolaborasi, dan koordinasi seluruh aktivitas warga. BJP.hub mengintegrasikan berbagai elemen sosial, olahraga, ekonomi, dan keagamaan agar berjalan selaras, inklusif, dan memberikan manfaat maksimal bagi seluruh warga komplek.';

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-stone-900"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-stone-950/75" />

      {/* Content */}
      <div className="relative z-10 px-4 max-w-5xl mx-auto flex flex-col items-center gap-8 text-center">

        {/* Top badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-bold px-4 py-2 rounded-full tracking-widest uppercase shadow-lg">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Komplek Bintara Jaya Permai RW 011</span>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-4 max-w-4xl">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-2xl">
            SELAMAT DATANG DI{' '}
            <span className="text-emerald-400">{title}</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-stone-300 leading-relaxed font-medium max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Stats Row */}
        {(totalEntities > 0 || totalAnnouncements > 0) && (
          <div className="flex items-center gap-6 sm:gap-10 flex-wrap justify-center">
            {totalEntities > 0 && (
              <div className="flex items-center gap-2 text-white/90">
                <Users className="w-4 h-4 text-emerald-400" />
                <p className="font-black text-lg leading-none">{totalEntities}</p>
                <p className="text-stone-400 text-xs font-medium">Komunitas Aktif</p>
              </div>
            )}
            {totalAnnouncements > 0 && (
              <div className="flex items-center gap-2 text-white/90">
                <Megaphone className="w-4 h-4 text-emerald-400" />
                <p className="font-black text-lg leading-none">{totalAnnouncements}</p>
                <p className="text-stone-400 text-xs font-medium">Pengumuman</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
