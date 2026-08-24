import React, { useState, useEffect } from 'react';
import { SiteSettings, BankSampahConfig, BankSampahChartItem } from '../types';
import { DEFAULT_BANK_SAMPAH_CONFIG } from '../utils/storage';
import { CARD_TITLE_MAX_LENGTH } from '../constants/defaults';
import { CharCounter } from './CharCounter';
import { Recycle, Save, Plus, Trash2, Eye, EyeOff, Upload } from 'lucide-react';

interface BankSampahCMSProps {
  siteSettings: SiteSettings;
  onSaveSiteSettings: (settings: SiteSettings) => void;
}

const emptyChart = (order: number): BankSampahChartItem => ({
  id: `chart-${Date.now()}`,
  title: '',
  imageUrl: '',
  enabled: true,
  order,
});

export const BankSampahCMS: React.FC<BankSampahCMSProps> = ({ siteSettings, onSaveSiteSettings }) => {
  const [config, setConfig] = useState<BankSampahConfig>(siteSettings.bankSampahConfig || DEFAULT_BANK_SAMPAH_CONFIG);

  useEffect(() => {
    setConfig(siteSettings.bankSampahConfig || DEFAULT_BANK_SAMPAH_CONFIG);
  }, [siteSettings]);

  const handleSave = () => {
    onSaveSiteSettings({ ...siteSettings, bankSampahConfig: config });
    alert('Dashboard Bank Sampah KMS berhasil disimpan!');
  };

  const charts = config.charts || [];
  const updateChart = (id: string, patch: Partial<BankSampahChartItem>) => {
    setConfig({ ...config, charts: charts.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
  };
  const removeChart = (id: string) => setConfig({ ...config, charts: charts.filter((c) => c.id !== id) });
  const addChart = () => setConfig({ ...config, charts: [...charts, emptyChart(charts.length)] });

  return (
    <div className="max-w-3xl mx-auto pb-6 space-y-5">
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Recycle className="w-5 h-5 text-emerald-700" />
            <h4 className="font-bold text-stone-900 text-sm sm:text-base">Dashboard Bank Sampah KMS</h4>
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

        {/* Enable toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h5 className="text-sm font-bold text-stone-800">Tampilkan Dashboard di Halaman Bank Sampah</h5>
            <p className="text-xs text-stone-500">Jika nonaktif, bagian statistik/chart tidak akan tampil.</p>
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

        {/* Logo */}
        <div className="space-y-1 pt-2 border-t border-stone-100">
          <label className="text-xs font-bold text-stone-700 block">Logo / Badge Bulat Bank Sampah</label>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={config.logoUrl || ''}
              onChange={(e) => setConfig({ ...config, logoUrl: e.target.value })}
              placeholder="https://... (kosongkan untuk pakai foto entitas)"
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
                      if (result) setConfig({ ...config, logoUrl: result });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          </div>
        </div>

        {/* Dashboard header */}
        <div className="grid grid-cols-1 gap-3 pt-2 border-t border-stone-100">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 block">Judul Dashboard</label>
            <input
              type="text"
              value={config.dashboardTitle}
              onChange={(e) => setConfig({ ...config, dashboardTitle: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 block">Deskripsi Dashboard</label>
            <input
              type="text"
              value={config.dashboardDescription || ''}
              onChange={(e) => setConfig({ ...config, dashboardDescription: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>

        {/* Charts list */}
        <div className="space-y-3 pt-2 border-t border-stone-100">
          <div>
            <h5 className="text-xs font-bold text-stone-800">Gambar Chart / Statistik ({charts.length})</h5>
            <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
              Tempel link gambar chart dari Google Sheets/Excel. Untuk Google Sheets: buka chart, klik menu titik tiga → Publikasikan chart → pilih format <strong>Gambar</strong>, lalu salin link yang dihasilkan (biasanya berformat <code className="font-mono">...pubchart?oid=...&amp;format=image</code>). Bisa juga tempel link gambar/screenshot biasa (PNG/JPG).
            </p>
          </div>

          {charts.length === 0 && (
            <p className="text-xs text-stone-400 italic text-center py-4">Belum ada chart. Tambahkan chart pertama di bawah.</p>
          )}

          <div className="space-y-3">
            {charts.map((c) => (
              <div key={c.id} className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900">{c.title || 'Chart Baru'}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateChart(c.id, { enabled: !c.enabled })}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40 ${
                        c.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {c.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{c.enabled ? 'Aktif' : 'Nonaktif'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeChart(c.id)}
                      className="p-1.5 text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <CharCounter value={c.title} max={CARD_TITLE_MAX_LENGTH} />
                </div>
                <input
                  type="text"
                  maxLength={CARD_TITLE_MAX_LENGTH}
                  value={c.title}
                  onChange={(e) => updateChart(c.id, { title: e.target.value })}
                  placeholder="Judul Chart, contoh: Tipe Nasabah"
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <input
                  type="text"
                  value={c.imageUrl}
                  onChange={(e) => updateChart(c.id, { imageUrl: e.target.value })}
                  placeholder="https://docs.google.com/spreadsheets/d/.../pubchart?oid=...&format=image"
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                {c.imageUrl && (
                  <img
                    src={c.imageUrl}
                    alt={c.title || 'Preview chart'}
                    className="w-full max-h-40 object-contain bg-white rounded-lg border border-stone-200"
                  />
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addChart}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-lg text-xs transition-colors border border-dashed border-stone-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
          >
            <Plus className="w-4 h-4 text-emerald-700" />
            Tambah Chart
          </button>
        </div>
      </div>
    </div>
  );
};
