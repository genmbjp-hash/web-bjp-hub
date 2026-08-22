import React, { useState, useEffect } from 'react';
import { SiteSettings, FeaturedVideoItem } from '../types';
import { Youtube, Save, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { CARD_TITLE_MAX_LENGTH } from '../constants/defaults';
import { CharCounter } from './CharCounter';

interface VideoCMSProps {
  siteSettings: SiteSettings;
  onSaveSiteSettings: (settings: SiteSettings) => void;
}

const emptyVideo = (order: number): FeaturedVideoItem => ({
  id: `vid-${Date.now()}`,
  title: '',
  youtubeUrl: '',
  enabled: true,
  order,
});

export const VideoCMS: React.FC<VideoCMSProps> = ({ siteSettings, onSaveSiteSettings }) => {
  const [videos, setVideos] = useState<FeaturedVideoItem[]>(siteSettings.featuredVideos || []);

  useEffect(() => {
    setVideos(siteSettings.featuredVideos || []);
  }, [siteSettings]);

  const handleSave = () => {
    onSaveSiteSettings({ ...siteSettings, featuredVideos: videos });
    alert('Video Kegiatan berhasil disimpan!');
  };

  const updateVideo = (id: string, patch: Partial<FeaturedVideoItem>) => {
    setVideos(videos.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  };
  const removeVideo = (id: string) => setVideos(videos.filter((v) => v.id !== id));
  const addVideo = () => setVideos([...videos, emptyVideo(videos.length)]);

  return (
    <div className="max-w-3xl mx-auto pb-6">
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Youtube className="w-5 h-5 text-red-600" />
            <h4 className="font-bold text-stone-900 text-sm sm:text-base">Video Kegiatan Terbaru</h4>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
          >
            <Save className="w-4 h-4" />
            Simpan
          </button>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          Video yang diaktifkan akan tampil pada bagian "Video Kegiatan Terbaru" di halaman Beranda, sesuai urutan di bawah ini.
        </p>

        {videos.length === 0 && (
          <p className="text-xs text-stone-400 italic text-center py-4">Belum ada video. Tambahkan video pertama di bawah.</p>
        )}

        <div className="space-y-3">
          {videos.map((v) => (
            <div key={v.id} className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900">{v.title || 'Video Baru'}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateVideo(v.id, { enabled: !v.enabled })}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40 ${
                      v.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {v.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{v.enabled ? 'Aktif' : 'Nonaktif'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeVideo(v.id)}
                    className="p-1.5 text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <CharCounter value={v.title} max={CARD_TITLE_MAX_LENGTH} />
              </div>
              <input
                type="text"
                maxLength={CARD_TITLE_MAX_LENGTH}
                value={v.title}
                onChange={(e) => updateVideo(v.id, { title: e.target.value })}
                placeholder="Judul Video, contoh: Bazar UMKM Warga BJP.hub"
                className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <input
                type="text"
                value={v.youtubeUrl}
                onChange={(e) => updateVideo(v.id, { youtubeUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addVideo}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-lg text-xs transition-colors border border-dashed border-stone-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
        >
          <Plus className="w-4 h-4 text-emerald-700" />
          Tambah Video
        </button>
      </div>
    </div>
  );
};
