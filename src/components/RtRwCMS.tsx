import React, { useState, useEffect } from 'react';
import { SiteSettings, RtRwPageConfig, RtDetailItem, RtRwValueItem, RtRwContentCard, RtRwCardType } from '../types';
import { DEFAULT_RTRW_CONFIG } from '../utils/storage';
import { CARD_TITLE_MAX_LENGTH, CARD_DESCRIPTION_MAX_LENGTH } from '../constants/defaults';
import { MapPin, Save, Plus, Trash2, Upload, Eye, EyeOff } from 'lucide-react';

interface RtRwCMSProps {
  siteSettings: SiteSettings;
  onSaveSiteSettings: (settings: SiteSettings) => void;
}

const emptyRt = (): RtDetailItem => ({
  id: `rt-${Date.now()}`,
  rtNumber: '',
  rwNumber: '11',
  chairmanName: '',
  kkCount: '',
  coverageArea: '',
  workSchedule: '',
  featuredProgram: '',
  contactPhone: '',
  enabled: true,
});

const emptyCard = (type: RtRwCardType): RtRwContentCard => ({
  id: `card-${Date.now()}`,
  type,
  title: '',
  description: '',
  enabled: true,
  order: 0,
});

export const RtRwCMS: React.FC<RtRwCMSProps> = ({ siteSettings, onSaveSiteSettings }) => {
  const [config, setConfig] = useState<RtRwPageConfig>(siteSettings.rtRwConfig || DEFAULT_RTRW_CONFIG);

  useEffect(() => {
    setConfig(siteSettings.rtRwConfig || DEFAULT_RTRW_CONFIG);
  }, [siteSettings]);

  const handleSave = () => {
    onSaveSiteSettings({ ...siteSettings, rtRwConfig: config });
    alert('Informasi RT/RW berhasil disimpan!');
  };

  const updateRt = (id: string, patch: Partial<RtDetailItem>) => {
    setConfig({ ...config, rts: config.rts.map((r) => (r.id === id ? { ...r, ...patch } : r)) });
  };
  const addRt = () => setConfig({ ...config, rts: [...config.rts, emptyRt()] });
  const removeRt = (id: string) => setConfig({ ...config, rts: config.rts.filter((r) => r.id !== id) });

  const updateValue = (idx: number, patch: Partial<RtRwValueItem>) => {
    const values = [...config.values];
    values[idx] = { ...values[idx], ...patch };
    setConfig({ ...config, values });
  };
  const addValue = () => setConfig({ ...config, values: [...config.values, { title: '', description: '' }] });
  const removeValue = (idx: number) => setConfig({ ...config, values: config.values.filter((_, i) => i !== idx) });

  const updateMission = (idx: number, value: string) => {
    const missions = [...config.missions];
    missions[idx] = value;
    setConfig({ ...config, missions });
  };
  const addMission = () => setConfig({ ...config, missions: [...config.missions, ''] });
  const removeMission = (idx: number) => setConfig({ ...config, missions: config.missions.filter((_, i) => i !== idx) });

  const cards = config.extraCards || [];
  const updateCard = (id: string, patch: Partial<RtRwContentCard>) => {
    setConfig({ ...config, extraCards: cards.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
  };
  const addCard = (type: RtRwCardType) => setConfig({ ...config, extraCards: [...cards, emptyCard(type)] });
  const removeCard = (id: string) => setConfig({ ...config, extraCards: cards.filter((c) => c.id !== id) });

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-6">
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-xl font-black text-stone-900">Informasi RT/RW</h2>
              <p className="text-sm text-stone-500 font-medium mt-0.5">
                Kelola visi-misi RW, data per-RT, dan dokumen publik RT/RW.
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>Simpan RT/RW</span>
          </button>
        </div>
      </div>

      {/* Enable toggle */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-stone-800">Aktifkan Menu Informasi RT/RW</h4>
          <p className="text-xs text-stone-500">Jika nonaktif, tab ini akan menampilkan pesan tidak tersedia.</p>
        </div>
        <button
          type="button"
          onClick={() => setConfig({ ...config, enabled: !config.enabled })}
          className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
            config.enabled ? 'bg-emerald-600' : 'bg-stone-300'
          }`}
        >
          <span
            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
              config.enabled ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Page Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <h4 className="text-xs font-bold text-stone-800 border-b border-stone-100 pb-2">Header Halaman</h4>
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700 block">Judul Halaman</label>
          <input
            type="text"
            value={config.pageTitle}
            onChange={(e) => setConfig({ ...config, pageTitle: e.target.value })}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700 block">Deskripsi Halaman</label>
          <input
            type="text"
            value={config.pageDescription}
            onChange={(e) => setConfig({ ...config, pageDescription: e.target.value })}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700 block">URL Gambar Hero</label>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={config.heroImage}
              onChange={(e) => setConfig({ ...config, heroImage: e.target.value })}
              placeholder="https://... / /images/..."
              className="flex-1 min-w-[200px] px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
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
                      if (result) setConfig({ ...config, heroImage: result });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <h4 className="text-xs font-bold text-stone-800 border-b border-stone-100 pb-2">Visi & Misi</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 block">Label Badge Visi</label>
            <input
              type="text"
              value={config.visionTitle}
              onChange={(e) => setConfig({ ...config, visionTitle: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 block">Judul Visi</label>
            <input
              type="text"
              value={config.visionHeading}
              onChange={(e) => setConfig({ ...config, visionHeading: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700 block">Teks Visi</label>
          <textarea
            rows={2}
            value={config.visionText}
            onChange={(e) => setConfig({ ...config, visionText: e.target.value })}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        {/* Missions list */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold text-stone-700 block">Misi Utama</label>
          {config.missions.map((m, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={m}
                onChange={(e) => updateMission(idx, e.target.value)}
                className="flex-1 px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <button
                type="button"
                onClick={() => removeMission(idx)}
                className="p-2 text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addMission}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-900"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Misi</span>
          </button>
        </div>

        {/* Values list */}
        <div className="space-y-2 pt-2 border-t border-stone-100">
          <label className="text-xs font-bold text-stone-700 block">Nilai-Nilai Utama</label>
          {config.values.map((v, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={v.title}
                onChange={(e) => updateValue(idx, { title: e.target.value })}
                placeholder="Judul nilai"
                className="w-1/3 px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <input
                type="text"
                value={v.description}
                onChange={(e) => updateValue(idx, { description: e.target.value })}
                placeholder="Deskripsi"
                className="flex-1 px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <button
                type="button"
                onClick={() => removeValue(idx)}
                className="p-2 text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addValue}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-900"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Nilai</span>
          </button>
        </div>
      </div>

      {/* RT List */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <h4 className="text-xs font-bold text-stone-800 border-b border-stone-100 pb-2">
          Rincian Wilayah RT ({config.rts.length})
        </h4>
        <div className="space-y-3">
          {config.rts.map((rt) => (
            <div key={rt.id} className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900">RT {rt.rtNumber || '—'}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateRt(rt.id, { enabled: !rt.enabled })}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                      rt.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {rt.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{rt.enabled ? 'Aktif' : 'Nonaktif'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeRt(rt.id)}
                    className="p-1.5 text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <input type="text" value={rt.rtNumber} onChange={(e) => updateRt(rt.id, { rtNumber: e.target.value })} placeholder="No. RT" className="px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs" />
                <input type="text" value={rt.rwNumber} onChange={(e) => updateRt(rt.id, { rwNumber: e.target.value })} placeholder="No. RW" className="px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs" />
                <input type="text" value={rt.kkCount} onChange={(e) => updateRt(rt.id, { kkCount: e.target.value })} placeholder="Jumlah KK" className="px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs" />
                <input type="text" value={rt.contactPhone} onChange={(e) => updateRt(rt.id, { contactPhone: e.target.value })} placeholder="No. WA Ketua" className="px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs" />
              </div>
              <input type="text" value={rt.chairmanName} onChange={(e) => updateRt(rt.id, { chairmanName: e.target.value })} placeholder="Nama Ketua RT" className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold" />
              <input type="text" value={rt.coverageArea} onChange={(e) => updateRt(rt.id, { coverageArea: e.target.value })} placeholder="Cakupan Wilayah (mis. Blok A1-A15)" className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs" />
              <input type="text" value={rt.workSchedule} onChange={(e) => updateRt(rt.id, { workSchedule: e.target.value })} placeholder="Jadwal Kerja Bakti" className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs" />
              <input type="text" value={rt.featuredProgram} onChange={(e) => updateRt(rt.id, { featuredProgram: e.target.value })} placeholder="Program Unggulan" className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs" />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addRt}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-xs transition-colors border border-dashed border-stone-300"
        >
          <Plus className="w-4 h-4 text-emerald-700" />
          <span>Tambah RT Baru</span>
        </button>
      </div>

      {/* Extra Content Cards */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <h4 className="text-xs font-bold text-stone-800 border-b border-stone-100 pb-2">
          Dokumen, Info & Galeri Publik RT/RW ({cards.length})
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 block">Judul Section</label>
            <input
              type="text"
              value={config.extraSectionTitle || ''}
              onChange={(e) => setConfig({ ...config, extraSectionTitle: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 block">Deskripsi Section</label>
            <input
              type="text"
              value={config.extraSectionDescription || ''}
              onChange={(e) => setConfig({ ...config, extraSectionDescription: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>

        <div className="space-y-3">
          {cards.map((card) => (
            <div key={card.id} className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-stone-200 text-stone-700">
                  {card.type === 'pdf' ? 'PDF' : card.type === 'image' ? 'Gambar' : 'Teks'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateCard(card.id, { enabled: !card.enabled })}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                      card.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {card.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{card.enabled ? 'Aktif' : 'Nonaktif'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeCard(card.id)}
                    className="p-1.5 text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <input type="text" maxLength={CARD_TITLE_MAX_LENGTH} value={card.title} onChange={(e) => updateCard(card.id, { title: e.target.value })} placeholder="Judul" className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold" />
              <input type="text" maxLength={CARD_DESCRIPTION_MAX_LENGTH} value={card.description || ''} onChange={(e) => updateCard(card.id, { description: e.target.value })} placeholder="Deskripsi" className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs" />
              <input type="text" value={card.categoryBadge || ''} onChange={(e) => updateCard(card.id, { categoryBadge: e.target.value })} placeholder="Label Kategori (mis. Dokumen Peraturan)" className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs" />

              {card.type === 'pdf' && (
                <div className="flex flex-wrap items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-medium transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload PDF</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            const result = evt.target?.result as string;
                            if (result) updateCard(card.id, { fileUrl: result, fileName: file.name });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {card.fileName && (
                    <span className="text-[11px] font-mono text-stone-600 bg-white px-2 py-1 rounded border border-stone-200 truncate max-w-[200px]">
                      {card.fileName}
                    </span>
                  )}
                </div>
              )}

              {card.type === 'image' && (
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={card.imageUrl || ''}
                    onChange={(e) => updateCard(card.id, { imageUrl: e.target.value })}
                    placeholder="URL Gambar"
                    className="flex-1 min-w-[160px] px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-mono"
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
                            if (result) updateCard(card.id, { imageUrl: result });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              )}

              {card.type === 'text' && (
                <textarea
                  rows={2}
                  value={card.textContent || ''}
                  onChange={(e) => updateCard(card.id, { textContent: e.target.value })}
                  placeholder="Isi teks informasi..."
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button type="button" onClick={() => addCard('pdf')} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-lg text-xs transition-colors">
            <Plus className="w-3.5 h-3.5 text-emerald-700" /><span>Tambah Kartu PDF</span>
          </button>
          <button type="button" onClick={() => addCard('image')} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-lg text-xs transition-colors">
            <Plus className="w-3.5 h-3.5 text-emerald-700" /><span>Tambah Kartu Gambar</span>
          </button>
          <button type="button" onClick={() => addCard('text')} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-lg text-xs transition-colors">
            <Plus className="w-3.5 h-3.5 text-emerald-700" /><span>Tambah Kartu Teks</span>
          </button>
        </div>
      </div>
    </div>
  );
};
