import React, { useState } from 'react';
import { Entity } from '../../types';
import { Play, Youtube } from 'lucide-react';

interface AlbumVideoProps {
  entities: Entity[];
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

const PLACEHOLDER_VIDEOS = [
  { title: 'Profil BJP HUB RW 11', entityName: 'BJP HUB', youtubeId: 'dQw4w9WgXcQ' },
  { title: 'Kegiatan Senam Pagi', entityName: 'Olahraga', youtubeId: 'jNQXAC9IVRw' },
  { title: 'Peresmian Balai Warga', entityName: 'Lingkungan', youtubeId: 'M7lc1UVf-VE' },
  { title: 'Bazar UMKM Warga', entityName: 'Sentra Usaha', youtubeId: 'kJQP7kiw5Fk' },
];

export const AlbumVideo: React.FC<AlbumVideoProps> = ({ entities }) => {
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Collect YouTube videos from entities' mediaUrl
  const videos: { title: string; entityName: string; youtubeId: string }[] = [];
  entities.forEach((e) => {
    if (e.mediaUrl) {
      const youtubeId = extractYouTubeId(e.mediaUrl);
      if (youtubeId) {
        videos.push({ title: e.name, entityName: e.name, youtubeId });
      }
    }
  });

  // Use placeholder if no real videos found, and slice to exactly 4 videos
  let allVideos = videos.length > 0 ? videos : PLACEHOLDER_VIDEOS;
  
  // If we have real videos but less than 4, fill the rest with placeholders
  if (allVideos.length > 0 && allVideos.length < 4) {
    const needed = 4 - allVideos.length;
    allVideos = [...allVideos, ...PLACEHOLDER_VIDEOS.slice(0, needed)];
  }
  
  const displayVideos = allVideos.slice(0, 4);

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-3">
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={() => setPlayingId(video.youtubeId)}
                        className="w-12 h-12 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                      >
                        <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                      </button>
                    </div>
                    <div className="mt-auto">
                      <p className="text-white font-bold text-xs line-clamp-2 leading-tight">{video.title}</p>
                      <p className="text-stone-300 text-[10px] mt-0.5">{video.entityName}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
