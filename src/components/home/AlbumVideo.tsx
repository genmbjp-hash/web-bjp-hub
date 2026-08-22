import React, { useState } from 'react';
import { FeaturedVideoItem } from '../../types';
import { Play, Youtube } from 'lucide-react';
import { Container } from '../ui/Container';

interface AlbumVideoProps {
  videos: FeaturedVideoItem[];
}

// Extract YouTube video ID from various URL formats
function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export const AlbumVideo: React.FC<AlbumVideoProps> = ({ videos }) => {
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Only videos the admin has enabled, in the order set in the CMS
  const displayVideos = videos
    .filter((v) => v.enabled)
    .sort((a, b) => a.order - b.order)
    .map((v) => ({ title: v.title, youtubeId: extractYouTubeId(v.youtubeUrl) }))
    .filter((v): v is { title: string; youtubeId: string } => Boolean(v.youtubeId));

  if (displayVideos.length === 0) return null;

  return (
    <section className="py-12 bg-stone-950 border-t border-stone-800">
      <Container>
        {/* Header */}
        <div className="mb-7">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Youtube className="w-5 h-5 text-red-500" />
            Video Kegiatan Terbaru
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">Dokumentasi video aktivitas warga</p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayVideos.map((video, idx) => (
            <div key={`${video.youtubeId}-${idx}`} className="relative rounded-2xl overflow-hidden bg-black aspect-video shadow-lg group">
              {playingId === video.youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
                  title={video.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                    alt={video.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-3">
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={() => setPlayingId(video.youtubeId)}
                        aria-label={`Putar video ${video.title}`}
                        className="w-12 h-12 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                      >
                        <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                      </button>
                    </div>
                    <div className="mt-auto">
                      <p className="text-white font-bold text-xs line-clamp-2 leading-tight">{video.title}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
