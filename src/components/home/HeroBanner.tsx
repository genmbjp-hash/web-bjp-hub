import React from 'react';
import { Users, Megaphone, ChevronDown, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  siteTitle?: string;
  siteDescription?: string;
  totalEntities?: number;
  totalAnnouncements?: number;
  onExplore: () => void;
}

const HERO_BG = '/images/hero-beranda.jpg';

export const HeroBanner: React.FC<HeroBannerProps> = ({
  siteTitle,
  siteDescription,
  totalEntities = 0,
  totalAnnouncements = 0,
  onExplore,
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

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/85 via-stone-900/55 to-stone-950/90" />
      <div className="absolute inset-0 bg-emerald-950/25 mix-blend-multiply" />

      {/* Animated shimmer overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.08)_0%,_transparent_70%)]" />

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
          <div className="flex items-center gap-3 sm:gap-6 flex-wrap justify-center">
            {totalEntities > 0 && (
              <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2.5 rounded-2xl">
                <div className="p-1.5 bg-emerald-500/30 rounded-lg">
                  <Users className="w-4 h-4 text-emerald-300" />
                </div>
                <div className="text-left">
                  <p className="text-white font-black text-lg leading-none">{totalEntities}</p>
                  <p className="text-stone-400 text-[11px] font-medium">Komunitas Aktif</p>
                </div>
              </div>
            )}
            {totalAnnouncements > 0 && (
              <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2.5 rounded-2xl">
                <div className="p-1.5 bg-amber-500/30 rounded-lg">
                  <Megaphone className="w-4 h-4 text-amber-300" />
                </div>
                <div className="text-left">
                  <p className="text-white font-black text-lg leading-none">{totalAnnouncements}</p>
                  <p className="text-stone-400 text-[11px] font-medium">Pengumuman</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={onExplore}
          className="group inline-flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-emerald-900/40 hover:shadow-emerald-700/40 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
        >
          <span>Jelajahi Sekarang</span>
          <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-stone-100 to-transparent" />
    </section>
  );
};
