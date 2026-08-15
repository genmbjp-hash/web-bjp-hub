import React, { useState, useEffect } from 'react';
import { SiteSettings, PollingPageConfig } from '../types';
import { Vote, Save } from 'lucide-react';
import { CARD_TITLE_MAX_LENGTH, CARD_DESCRIPTION_MAX_LENGTH } from '../constants/defaults';
import { CharCounter } from './CharCounter';

interface PollingCMSProps {
  siteSettings: SiteSettings;
  onSaveSiteSettings: (settings: SiteSettings) => void;
}

const DEFAULT_CONFIG: PollingPageConfig = {
  enabled: true,
  pageTitle: 'Polling & Aspirasi Warga BJP HUB',
  pageDescription: 'Sampaikan saran, partisipasi voting, dan masukan Anda untuk kemajuan Komplek Bintara Jaya Permai (RW 11).',
  section1: { id: 'sec-1', enabled: false, title: '', description: '', formUrl: '' },
  section2: { id: 'sec-2', enabled: false, title: '', description: '', formUrl: '' },
};

export const PollingCMS: React.FC<PollingCMSProps> = ({ siteSettings, onSaveSiteSettings }) => {
  const [config, setConfig] = useState<PollingPageConfig>(siteSettings.pollingConfig || DEFAULT_CONFIG);

  useEffect(() => {
    setConfig(siteSettings.pollingConfig || DEFAULT_CONFIG);
  }, [siteSettings]);

  const handleSave = () => {
    onSaveSiteSettings({ ...siteSettings, pollingConfig: config });
    alert('Pengaturan Polling & Aspirasi Warga berhasil disimpan!');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <Vote className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h2 className="text-xl font-black text-stone-900">Polling & Aspirasi Warga</h2>
            <p className="text-sm text-stone-500 font-medium mt-0.5">
              Atur halaman polling publik yang menyematkan hingga 2 Google Form.
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Polling</span>
        </button>
      </div>

      {/* Enable toggle */}
      <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-stone-800">Aktifkan Menu Polling & Aspirasi</h4>
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

      {/* Page title / description */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            value={config.pageDescription || ''}
            onChange={(e) => setConfig({ ...config, pageDescription: e.target.value })}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>
      </div>

      {/* 2 Sections */}
      {(['section1', 'section2'] as const).map((key, idx) => {
        const section = config[key];
        return (
          <div key={key} className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <h4 className="text-xs font-bold text-stone-800">Section Polling {idx + 1}</h4>
              <button
                type="button"
                onClick={() =>
                  setConfig({ ...config, [key]: { ...section, enabled: !section.enabled } })
                }
                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                  section.enabled ? 'bg-emerald-600' : 'bg-stone-300'
                }`}
              >
                <span
                  className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                    section.enabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700 block">Judul Section</label>
                <CharCounter value={section.title} max={CARD_TITLE_MAX_LENGTH} />
              </div>
              <input
                type="text"
                maxLength={CARD_TITLE_MAX_LENGTH}
                value={section.title}
                onChange={(e) => setConfig({ ...config, [key]: { ...section, title: e.target.value } })}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700 block">Deskripsi</label>
                <CharCounter value={section.description} max={CARD_DESCRIPTION_MAX_LENGTH} />
              </div>
              <input
                type="text"
                maxLength={CARD_DESCRIPTION_MAX_LENGTH}
                value={section.description || ''}
                onChange={(e) => setConfig({ ...config, [key]: { ...section, description: e.target.value } })}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">URL Google Form (Embed)</label>
              <input
                type="text"
                value={section.formUrl}
                onChange={(e) => setConfig({ ...config, [key]: { ...section, formUrl: e.target.value } })}
                placeholder="https://docs.google.com/forms/d/e/.../viewform"
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
