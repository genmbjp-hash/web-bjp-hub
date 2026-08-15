import React, { useState, useEffect } from 'react';
import { SiteSettings, MediaPartnerItem } from '../types';
import { Users, Save, Plus, Trash2, Eye, EyeOff, Instagram, Youtube } from 'lucide-react';
import { CARD_TITLE_MAX_LENGTH } from '../constants/defaults';
import { CharCounter } from './CharCounter';

interface MediaPartnersCMSProps {
  siteSettings: SiteSettings;
  onSaveSiteSettings: (settings: SiteSettings) => void;
}

const emptyPartner = (order: number): MediaPartnerItem => ({
  id: `mp-${Date.now()}`,
  name: '',
  logoUrl: '',
  instagramUrl: '',
  instagramEnabled: false,
  youtubeUrl: '',
  youtubeEnabled: false,
  enabled: true,
  order,
});

export const MediaPartnersCMS: React.FC<MediaPartnersCMSProps> = ({ siteSettings, onSaveSiteSettings }) => {
  const [partners, setPartners] = useState<MediaPartnerItem[]>(siteSettings.mediaPartners || []);

  useEffect(() => {
    setPartners(siteSettings.mediaPartners || []);
  }, [siteSettings]);

  const handleSave = () => {
    onSaveSiteSettings({ ...siteSettings, mediaPartners: partners });
    alert('Media Partner berhasil disimpan!');
  };

  const updatePartner = (id: string, patch: Partial<MediaPartnerItem>) => {
    setPartners(partners.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };
  const removePartner = (id: string) => setPartners(partners.filter((p) => p.id !== id));
  const addPartner = () => setPartners([...partners, emptyPartner(partners.length)]);

  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-700" />
          <h4 className="font-bold text-stone-900 text-sm sm:text-base">Media Partner & Komunitas</h4>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold transition-colors shrink-0"
        >
          <Save className="w-4 h-4" />
          Simpan
        </button>
      </div>

      <p className="text-xs text-stone-600 leading-relaxed">
        Logo partner/komunitas media akan tampil sebagai slider di beranda, lengkap dengan tautan Instagram/YouTube.
      </p>

      <div className="space-y-3">
        {partners.map((p) => (
          <div key={p.id} className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900">{p.name || 'Partner Baru'}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updatePartner(p.id, { enabled: !p.enabled })}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                    p.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {p.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{p.enabled ? 'Aktif' : 'Nonaktif'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => removePartner(p.id)}
                  className="p-1.5 text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <CharCounter value={p.name} max={CARD_TITLE_MAX_LENGTH} />
            </div>
            <input
              type="text"
              maxLength={CARD_TITLE_MAX_LENGTH}
              value={p.name}
              onChange={(e) => updatePartner(p.id, { name: e.target.value })}
              placeholder="Nama Partner / Komunitas"
              className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold"
            />
            <input
              type="text"
              value={p.logoUrl || ''}
              onChange={(e) => updatePartner(p.id, { logoUrl: e.target.value })}
              placeholder="URL Logo"
              className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-mono"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => updatePartner(p.id, { instagramEnabled: !p.instagramEnabled })}
                  className={`p-1.5 rounded-lg shrink-0 ${p.instagramEnabled ? 'bg-pink-100 text-pink-700' : 'bg-stone-200 text-stone-500'}`}
                  title="Aktifkan Instagram"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </button>
                <input
                  type="text"
                  value={p.instagramUrl || ''}
                  onChange={(e) => updatePartner(p.id, { instagramUrl: e.target.value })}
                  placeholder="URL Instagram"
                  className="flex-1 px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => updatePartner(p.id, { youtubeEnabled: !p.youtubeEnabled })}
                  className={`p-1.5 rounded-lg shrink-0 ${p.youtubeEnabled ? 'bg-red-100 text-red-700' : 'bg-stone-200 text-stone-500'}`}
                  title="Aktifkan YouTube"
                >
                  <Youtube className="w-3.5 h-3.5" />
                </button>
                <input
                  type="text"
                  value={p.youtubeUrl || ''}
                  onChange={(e) => updatePartner(p.id, { youtubeUrl: e.target.value })}
                  placeholder="URL YouTube"
                  className="flex-1 px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addPartner}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-lg text-xs transition-colors border border-dashed border-stone-300"
      >
        <Plus className="w-4 h-4 text-emerald-700" />
        Tambah Media Partner
      </button>
    </div>
  );
};
