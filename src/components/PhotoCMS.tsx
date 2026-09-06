import React, { useState, useEffect } from 'react';
import { SiteSettings, FeaturedPhotoItem } from '../types';
import { Images, Save, Plus, Trash2, Eye, EyeOff, Upload } from 'lucide-react';
import { formatImageUrl } from '../utils/imageUrl';
import { CARD_TITLE_MAX_LENGTH } from '../constants/defaults';
import { CharCounter } from './CharCounter';

interface PhotoCMSProps {
  siteSettings: SiteSettings;
  onSaveSiteSettings: (settings: SiteSettings) => void;
}

const emptyPhoto = (order: number): FeaturedPhotoItem => ({
  id: `photo-${Date.now()}`,
  imageUrl: '',
  caption: '',
  year: String(new Date().getFullYear()),
  enabled: true,
  order,
});

export const PhotoCMS: React.FC<PhotoCMSProps> = ({ siteSettings, onSaveSiteSettings }) => {
  const [photos, setPhotos] = useState<FeaturedPhotoItem[]>(siteSettings.featuredPhotos || []);

  useEffect(() => {
    setPhotos(siteSettings.featuredPhotos || []);
  }, [siteSettings]);

  const handleSave = () => {
    onSaveSiteSettings({ ...siteSettings, featuredPhotos: photos });
    alert('Foto Kegiatan berhasil disimpan!');
  };

  const updatePhoto = (id: string, patch: Partial<FeaturedPhotoItem>) => {
    setPhotos(photos.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };
  const removePhoto = (id: string) => setPhotos(photos.filter((p) => p.id !== id));
  const addPhoto = () => setPhotos([...photos, emptyPhoto(photos.length)]);

  return (
    <div className="max-w-3xl mx-auto pb-6">
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Images className="w-5 h-5 text-emerald-700" />
            <h4 className="font-bold text-stone-900 text-sm sm:text-base">Foto Kegiatan Terbaru</h4>
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
          Foto yang diaktifkan akan tampil pada bagian "Foto Kegiatan Terbaru" di halaman Beranda dan halaman Dokumentasi, tanpa perlu terikat ke data komunitas/entitas tertentu.
        </p>

        {photos.length === 0 && (
          <p className="text-xs text-stone-400 italic text-center py-4">Belum ada foto. Tambahkan foto pertama di bawah.</p>
        )}

        <div className="space-y-3">
          {photos.map((p) => (
            <div key={p.id} className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900">{p.caption || 'Foto Kegiatan'}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updatePhoto(p.id, { enabled: !p.enabled })}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40 ${
                      p.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {p.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{p.enabled ? 'Aktif' : 'Nonaktif'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => removePhoto(p.id)}
                    className="p-1.5 text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={p.imageUrl}
                  onChange={(e) => updatePhoto(p.id, { imageUrl: e.target.value })}
                  placeholder="URL Gambar (contoh: https://drive.google.com/file/d/.../view)"
                  className="flex-1 px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-medium transition-colors shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (evt) => {
                          const result = evt.target?.result as string;
                          if (result) updatePhoto(p.id, { imageUrl: result });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                {p.imageUrl && (
                  <div className="w-12 h-10 bg-stone-100 rounded-lg overflow-hidden border border-stone-200 shrink-0">
                    <img
                      src={formatImageUrl(p.imageUrl)}
                      alt={p.caption || 'Preview'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <CharCounter value={p.caption || ''} max={CARD_TITLE_MAX_LENGTH} />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={CARD_TITLE_MAX_LENGTH}
                  value={p.caption || ''}
                  onChange={(e) => updatePhoto(p.id, { caption: e.target.value })}
                  placeholder="Keterangan foto, contoh: Bazar UMKM Warga BJP.hub"
                  className="flex-1 px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <input
                  type="number"
                  value={p.year || ''}
                  onChange={(e) => updatePhoto(p.id, { year: e.target.value })}
                  placeholder="Tahun"
                  min={2000}
                  max={2100}
                  className="w-20 shrink-0 px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addPhoto}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-lg text-xs transition-colors border border-dashed border-stone-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
        >
          <Plus className="w-4 h-4 text-emerald-700" />
          Tambah Foto
        </button>
      </div>
    </div>
  );
};
