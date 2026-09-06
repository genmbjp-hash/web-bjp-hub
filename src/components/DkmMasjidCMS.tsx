import React, { useState, useEffect } from 'react';
import { SiteSettings, DkmAgendaItem, DkmStrukturItem } from '../types';
import { Church, Save, Plus, Trash2, Eye, EyeOff, CalendarDays, Users } from 'lucide-react';
import { CARD_TITLE_MAX_LENGTH } from '../constants/defaults';
import { CharCounter } from './CharCounter';
import { DEFAULT_DKM_MASJID_CONFIG } from '../utils/storage';

interface DkmMasjidCMSProps {
  siteSettings: SiteSettings;
  onSaveSiteSettings: (settings: SiteSettings) => void;
}

const emptyAgenda = (order: number): DkmAgendaItem => ({
  id: `dkm-agenda-${Date.now()}`,
  title: '',
  date: '',
  description: '',
  enabled: true,
  order,
});

const emptyStruktur = (order: number): DkmStrukturItem => ({
  id: `dkm-struktur-${Date.now()}`,
  name: '',
  role: '',
  photoUrl: '',
  enabled: true,
  order,
});

export const DkmMasjidCMS: React.FC<DkmMasjidCMSProps> = ({ siteSettings, onSaveSiteSettings }) => {
  const config = siteSettings.dkmMasjidConfig || DEFAULT_DKM_MASJID_CONFIG;
  const [aboutText, setAboutText] = useState(config.aboutText || '');
  const [agenda, setAgenda] = useState<DkmAgendaItem[]>(config.agenda || []);
  const [struktur, setStruktur] = useState<DkmStrukturItem[]>(config.struktur || []);

  useEffect(() => {
    const c = siteSettings.dkmMasjidConfig || DEFAULT_DKM_MASJID_CONFIG;
    setAboutText(c.aboutText || '');
    setAgenda(c.agenda || []);
    setStruktur(c.struktur || []);
  }, [siteSettings]);

  const handleSave = () => {
    onSaveSiteSettings({
      ...siteSettings,
      dkmMasjidConfig: { ...config, aboutText, agenda, struktur },
    });
    alert('Halaman DKM Masjid berhasil disimpan!');
  };

  const updateAgenda = (id: string, patch: Partial<DkmAgendaItem>) =>
    setAgenda(agenda.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  const removeAgenda = (id: string) => setAgenda(agenda.filter((a) => a.id !== id));
  const addAgenda = () => setAgenda([...agenda, emptyAgenda(agenda.length)]);

  const updateStruktur = (id: string, patch: Partial<DkmStrukturItem>) =>
    setStruktur(struktur.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const removeStruktur = (id: string) => setStruktur(struktur.filter((s) => s.id !== id));
  const addStruktur = () => setStruktur([...struktur, emptyStruktur(struktur.length)]);

  return (
    <div className="max-w-3xl mx-auto pb-6 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Church className="w-5 h-5 text-emerald-700" />
            <h4 className="font-bold text-stone-900 text-sm sm:text-base">Halaman DKM Masjid (Agenda & Struktur)</h4>
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
          Data ini tampil pada sub-halaman "Agenda & Struktur Organisasi" milik DKM Masjid Ja'mi Al Aqwam, yang bisa diakses dari halaman Sosial Keagamaan.
        </p>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-700">Teks Pengantar (opsional)</label>
          <textarea
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            rows={3}
            placeholder="Kalimat pengantar singkat untuk sub-halaman ini, contoh: Berikut agenda kegiatan dan susunan pengurus DKM Masjid Ja'mi Al Aqwam periode berjalan."
            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>
      </div>

      {/* Agenda List */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
          <CalendarDays className="w-4.5 h-4.5 text-emerald-700" />
          <h4 className="font-bold text-stone-900 text-sm">Agenda Kegiatan DKM</h4>
        </div>

        {agenda.length === 0 && (
          <p className="text-xs text-stone-400 italic text-center py-4">Belum ada agenda. Tambahkan agenda pertama di bawah.</p>
        )}

        <div className="space-y-3">
          {agenda.map((a) => (
            <div key={a.id} className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900">{a.title || 'Agenda Baru'}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateAgenda(a.id, { enabled: !a.enabled })}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40 ${
                      a.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {a.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{a.enabled ? 'Aktif' : 'Nonaktif'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAgenda(a.id)}
                    className="p-1.5 text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <CharCounter value={a.title} max={CARD_TITLE_MAX_LENGTH} />
              </div>
              <input
                type="text"
                maxLength={CARD_TITLE_MAX_LENGTH}
                value={a.title}
                onChange={(e) => updateAgenda(a.id, { title: e.target.value })}
                placeholder="Judul Agenda, contoh: Kajian Ba'da Subuh & Tausiah Ramadhan"
                className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <input
                type="date"
                value={a.date}
                onChange={(e) => updateAgenda(a.id, { date: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <textarea
                value={a.description || ''}
                onChange={(e) => updateAgenda(a.id, { description: e.target.value })}
                rows={2}
                placeholder="Keterangan agenda (opsional)"
                className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addAgenda}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-lg text-xs transition-colors border border-dashed border-stone-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
        >
          <Plus className="w-4 h-4 text-emerald-700" />
          Tambah Agenda
        </button>
      </div>

      {/* Struktur Organisasi List */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
          <Users className="w-4.5 h-4.5 text-emerald-700" />
          <h4 className="font-bold text-stone-900 text-sm">Struktur Organisasi DKM</h4>
        </div>

        {struktur.length === 0 && (
          <p className="text-xs text-stone-400 italic text-center py-4">Belum ada susunan pengurus. Tambahkan pengurus pertama di bawah.</p>
        )}

        <div className="space-y-3">
          {struktur.map((s) => (
            <div key={s.id} className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900">{s.name || 'Pengurus Baru'}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateStruktur(s.id, { enabled: !s.enabled })}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40 ${
                      s.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {s.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{s.enabled ? 'Aktif' : 'Nonaktif'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeStruktur(s.id)}
                    className="p-1.5 text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <input
                type="text"
                value={s.name}
                onChange={(e) => updateStruktur(s.id, { name: e.target.value })}
                placeholder="Nama Pengurus"
                className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <input
                type="text"
                value={s.role}
                onChange={(e) => updateStruktur(s.id, { role: e.target.value })}
                placeholder="Jabatan, contoh: Ketua DKM"
                className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <input
                type="text"
                value={s.photoUrl || ''}
                onChange={(e) => updateStruktur(s.id, { photoUrl: e.target.value })}
                placeholder="Link Foto (opsional)"
                className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addStruktur}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-lg text-xs transition-colors border border-dashed border-stone-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
        >
          <Plus className="w-4 h-4 text-emerald-700" />
          Tambah Pengurus
        </button>
      </div>
    </div>
  );
};
