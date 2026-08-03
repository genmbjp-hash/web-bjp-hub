import React, { useState } from 'react';
import { SocialFeedItem } from '../types';
import { getSocialEmbedUrl } from '../utils/embed';
import { Play, Video, ExternalLink, X, Youtube, Instagram, Sparkles } from 'lucide-react';

interface SocialFeedsSectionProps {
  feeds?: SocialFeedItem[];
}

export const SocialFeedsSection: React.FC<SocialFeedsSectionProps> = ({ feeds = [] }) => {
  const [activeModalFeed, setActiveModalFeed] = useState<SocialFeedItem | null>(null);

  // Filter enabled feeds sorted by order
  const activeFeeds = feeds.filter((f) => f.enabled).sort((a, b) => a.order - b.order);

  if (activeFeeds.length === 0) {
    return null;
  }

  return (
    <section className="my-10 bg-gradient-to-br from-stone-900 via-stone-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Title */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-emerald-500/20 text-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Media & Feeds</span>
            </span>
            <span className="text-xs text-stone-400">• Video & Galeri Digital RW 11</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Galeri Feeds & Dokumentasi Video</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mt-1">
            Saksikan berbagai cuplikan kegiatan warga, promosi Sentra UMKM, dan dokumentasi kemasyarakatan Bintara Jaya Permai secara langsung.
          </p>
        </div>
      </div>

      {/* Mobile-friendly Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
        {activeFeeds.map((item) => {
          const { embedUrl, platform } = getSocialEmbedUrl(item.url);

          return (
            <div
              key={item.id}
              className="bg-stone-800/80 hover:bg-stone-800 border border-stone-700/70 hover:border-emerald-500/60 rounded-2xl overflow-hidden transition-all duration-300 shadow-md group flex flex-col justify-between"
            >
              {/* Embed Frame / Preview Box */}
              <div className="relative aspect-video bg-stone-950 flex items-center justify-center overflow-hidden">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={item.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-stone-500 p-4 text-center">
                    <Video className="w-10 h-10 mb-2 opacity-50" />
                    <span className="text-xs">Preview Media</span>
                  </div>
                )}

                {/* Badge Overlay */}
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 px-2.5 py-1 bg-stone-950/80 backdrop-blur-md rounded-full text-[11px] font-bold text-white border border-stone-700">
                  {platform === 'youtube' && <Youtube className="w-3.5 h-3.5 text-red-500" />}
                  {platform === 'instagram' && <Instagram className="w-3.5 h-3.5 text-pink-500" />}
                  {platform === 'other' && <Video className="w-3.5 h-3.5 text-emerald-400" />}
                  <span className="capitalize">{platform}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-stone-300 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-stone-700/50 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveModalFeed(item)}
                    className="flex items-center gap-1.5 text-emerald-400 font-bold hover:text-emerald-300 transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Layar Penuh</span>
                  </button>

                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-stone-400 hover:text-white transition-colors"
                    >
                      <span>Buka Aplikasi</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Lightbox / Full Player */}
      {activeModalFeed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveModalFeed(null)}
        >
          <div
            className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-stone-800 flex items-center justify-between text-white bg-stone-950">
              <div>
                <h3 className="font-bold text-sm sm:text-base">{activeModalFeed.title}</h3>
                {activeModalFeed.description && (
                  <p className="text-xs text-stone-400 mt-0.5">{activeModalFeed.description}</p>
                )}
              </div>
              <button
                onClick={() => setActiveModalFeed(null)}
                className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Player */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center">
              {getSocialEmbedUrl(activeModalFeed.url).embedUrl ? (
                <iframe
                  src={getSocialEmbedUrl(activeModalFeed.url).embedUrl}
                  title={activeModalFeed.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="text-stone-400 text-sm p-6 text-center">
                  Situs ini tidak mengizinkan pemutaran langsung. Gunakan link "Buka Aplikasi".
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
