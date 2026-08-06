import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SocialFeedItem } from '../types';
import { getSocialEmbedUrl } from '../utils/embed';
import {
  Play,
  Video,
  ExternalLink,
  X,
  Youtube,
  Instagram,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Images,
  Film
} from 'lucide-react';

interface SingleFeedBlockProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  feeds: SocialFeedItem[];
}

const SingleFeedBlock: React.FC<SingleFeedBlockProps> = ({
  title,
  subtitle,
  icon,
  feeds
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Touch Swipe tracking
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Reset index if feeds length changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [feeds.length]);

  // Auto-slide per 4 seconds timer
  useEffect(() => {
    if (feeds.length <= 1 || isHovered || activeModalIndex !== null) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % feeds.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [feeds.length, isHovered, activeModalIndex]);

  const handlePrev = useCallback(() => {
    if (feeds.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + feeds.length) % feeds.length);
  }, [feeds.length]);

  const handleNext = useCallback(() => {
    if (feeds.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % feeds.length);
  }, [feeds.length]);

  // Modal Next/Prev Navigation
  const handleModalPrev = useCallback(() => {
    if (activeModalIndex === null || feeds.length === 0) return;
    setActiveModalIndex((prev) => ((prev ?? 0) - 1 + feeds.length) % feeds.length);
  }, [activeModalIndex, feeds.length]);

  const handleModalNext = useCallback(() => {
    if (activeModalIndex === null || feeds.length === 0) return;
    setActiveModalIndex((prev) => ((prev ?? 0) + 1) % feeds.length);
  }, [activeModalIndex, feeds.length]);

  // Keyboard navigation for modal
  useEffect(() => {
    if (activeModalIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalIndex(null);
      } else if (e.key === 'ArrowLeft') {
        handleModalPrev();
      } else if (e.key === 'ArrowRight') {
        handleModalNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalIndex, handleModalPrev, handleModalNext]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const currentFeed = feeds[currentIndex] || feeds[0];
  const { embedUrl, platform } = currentFeed
    ? getSocialEmbedUrl(currentFeed.url)
    : { embedUrl: '', platform: 'other' };

  // Current modal feed
  const activeModalFeed = activeModalIndex !== null ? feeds[activeModalIndex] : null;
  const activeModalEmbed = activeModalFeed ? getSocialEmbedUrl(activeModalFeed.url) : null;

  return (
    <section className="bg-gradient-to-br from-stone-900 via-stone-900 to-emerald-950 text-white rounded-3xl p-4 sm:p-6 shadow-xl border border-stone-800 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header (No Media Feeds label, No platform tabs) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4 relative z-10 border-b border-stone-800 pb-3.5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-emerald-500/20 text-emerald-300 rounded-lg shrink-0 border border-emerald-500/30">
              {icon}
            </span>
            <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
              {title}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Player Container */}
      {feeds.length > 0 && currentFeed ? (
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative bg-stone-950 rounded-2xl overflow-hidden border border-stone-800 shadow-2xl z-10"
        >
          <div className="flex flex-col lg:flex-row items-stretch min-h-[380px] sm:min-h-[460px]">
            {/* Embedded Player Display */}
            <div className="lg:w-2/3 relative bg-black flex items-center justify-center overflow-hidden min-h-[280px] sm:min-h-[380px] group/player">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={currentFeed.title}
                  className="w-full h-full absolute inset-0 border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="p-6 text-center text-stone-400">
                  <Video className="w-12 h-12 mx-auto mb-2 text-stone-600" />
                  <p className="text-xs">Tautan embed tidak valid</p>
                </div>
              )}

              {/* Subtle hover overlay hint */}
              <div className="absolute inset-0 bg-stone-950/0 group-hover/player:bg-stone-950/20 transition-colors pointer-events-none" />

              {/* Platform Badge & Counter */}
              <div className="absolute top-3 left-3 z-20 flex items-center gap-2 pointer-events-none">
                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1.5 shadow-md ${
                    platform === 'youtube'
                      ? 'bg-red-600 text-white'
                      : platform === 'instagram'
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {platform === 'youtube' && <Youtube className="w-3.5 h-3.5" />}
                  {platform === 'instagram' && <Instagram className="w-3.5 h-3.5" />}
                  <span>{platform.toUpperCase()}</span>
                </span>
                <span className="px-2 py-1 bg-stone-900/80 backdrop-blur-md text-stone-300 rounded-lg text-[10px] font-bold border border-stone-700/60">
                  {currentIndex + 1} / {feeds.length}
                </span>
              </div>

              {/* Slider Next / Prev Controls */}
              {feeds.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2.5 bg-stone-900/80 hover:bg-emerald-600 text-white rounded-full backdrop-blur-md border border-stone-700/80 transition-all opacity-80 hover:opacity-100 hover:scale-110 cursor-pointer"
                    title="Konten Sebelumnya"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2.5 bg-stone-900/80 hover:bg-emerald-600 text-white rounded-full backdrop-blur-md border border-stone-700/80 transition-all opacity-80 hover:opacity-100 hover:scale-110 cursor-pointer"
                    title="Konten Selanjutnya"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Right Information & Action Panel */}
            <div className="p-4 sm:p-6 lg:w-1/3 flex flex-col justify-between space-y-4 bg-stone-900/90">
              <div className="space-y-2.5">
                <h3
                  onClick={() => setActiveModalIndex(currentIndex)}
                  className="font-extrabold text-white text-base sm:text-lg leading-snug text-emerald-300 hover:text-emerald-200 transition-colors cursor-pointer flex items-start gap-2 group/title"
                >
                  <span className="flex-1">{currentFeed.title}</span>
                  <Play className="w-4 h-4 text-emerald-400 group-hover/title:scale-110 transition-transform shrink-0 mt-1 fill-current" />
                </h3>

                {currentFeed.description && (
                  <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                    {currentFeed.description}
                  </p>
                )}
              </div>

              <div className="space-y-3 pt-3 border-t border-stone-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveModalIndex(currentIndex)}
                    className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Layar Penuh</span>
                  </button>

                  <a
                    href={currentFeed.url}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-stone-700"
                    title="Buka Aplikasi Asli"
                  >
                    <span>Aplikasi</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* White Pagination Dots */}
                {feeds.length > 1 && (
                  <div className="flex items-center justify-center gap-1.5 pt-1">
                    {feeds.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={() => setCurrentIndex(dotIdx)}
                        className={`h-2.5 rounded-full transition-all cursor-pointer ${
                          dotIdx === currentIndex
                            ? 'w-7 bg-white shadow-xs'
                            : 'w-2.5 bg-stone-600 hover:bg-stone-400'
                        }`}
                        title={`Lompat ke konten #${dotIdx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-stone-400 bg-stone-950/60 rounded-2xl border border-stone-800">
          <Video className="w-10 h-10 mx-auto mb-2 text-stone-600" />
          <p className="text-sm font-bold">Belum Ada Konten Di Album Ini</p>
          <p className="text-xs text-stone-500 mt-1">
            Gunakan Pengaturan CMS untuk menambahkan konten terbaru pada album ini.
          </p>
        </div>
      )}

      {/* Fullscreen Video / Content Lightbox Modal */}
      {activeModalFeed && activeModalEmbed && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-stone-900 rounded-3xl overflow-hidden border border-stone-700 shadow-2xl flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-3.5 sm:p-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-extrabold uppercase shrink-0">
                  {activeModalEmbed.platform}
                </span>
                <h4 className="font-extrabold text-white text-xs sm:text-sm truncate">
                  {activeModalFeed.title}
                </h4>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={activeModalFeed.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <span className="hidden sm:inline">Buka Aplikasi</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => setActiveModalIndex(null)}
                  className="p-1.5 text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors cursor-pointer"
                  title="Tutup (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Player */}
            <div className="relative bg-black flex-1 min-h-[300px] sm:min-h-[480px]">
              {activeModalEmbed.embedUrl ? (
                <iframe
                  src={activeModalEmbed.embedUrl}
                  title={activeModalFeed.title}
                  className="w-full h-full absolute inset-0 border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="p-8 text-center text-stone-400">
                  <p>Tidak dapat memuat tautan embed modal</p>
                </div>
              )}

              {/* Modal Next / Prev Nav Buttons */}
              {feeds.length > 1 && (
                <>
                  <button
                    onClick={handleModalPrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/70 hover:bg-emerald-600 text-white rounded-full border border-stone-700 transition-all cursor-pointer"
                    title="Sebelumnya (Panah Kiri)"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleModalNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/70 hover:bg-emerald-600 text-white rounded-full border border-stone-700 transition-all cursor-pointer"
                    title="Selanjutnya (Panah Kanan)"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Modal Description Footer */}
            {activeModalFeed.description && (
              <div className="p-3.5 sm:p-4 bg-stone-950 border-t border-stone-800 text-xs text-stone-300 leading-relaxed shrink-0">
                {activeModalFeed.description}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

interface SocialFeedsSectionProps {
  feeds?: SocialFeedItem[];
}

export const SocialFeedsSection: React.FC<SocialFeedsSectionProps> = ({ feeds = [] }) => {
  // Filter active enabled feeds ordered by order
  const activeFeeds = feeds.filter((f) => f.enabled).sort((a, b) => a.order - b.order);

  // Categorize feeds into the 3 sections
  const terbaruFeeds = activeFeeds.filter(
    (f) => !f.section || f.section === 'terbaru'
  );
  const photoFeeds = activeFeeds.filter((f) => f.section === 'album_foto');
  const videoFeeds = activeFeeds.filter((f) => f.section === 'album_video');

  if (activeFeeds.length === 0) {
    return null;
  }

  return (
    <div id="feeds-section" className="my-8 space-y-8">
      {/* 1. Slide Konten Terbaru */}
      <SingleFeedBlock
        title="Slide Konten Terbaru RW 11"
        subtitle="Liputan terkini kegiatan warga, promosi Sentra UMKM, dan dokumentasi Bintara Jaya Permai."
        icon={<Sparkles className="w-5 h-5 text-amber-300" />}
        feeds={terbaruFeeds}
      />

      {/* 2. Album Foto BJP */}
      <SingleFeedBlock
        title="Album Foto Komplek Bintara Jaya Permai"
        subtitle="Galeri foto dokumentasi aksi gotong royong, bazar UMKM, posyandu, dan kebersamaan warga."
        icon={<Images className="w-5 h-5 text-pink-400" />}
        feeds={photoFeeds}
      />

      {/* 3. Album Video BJP */}
      <SingleFeedBlock
        title="Album Video Dokumenter & Highlights BJP"
        subtitle="Kumpulan video liputan profil wilayah, turnamen olahraga, pentas seni, dan video singkat warga."
        icon={<Film className="w-5 h-5 text-red-400" />}
        feeds={videoFeeds}
      />
    </div>
  );
};
