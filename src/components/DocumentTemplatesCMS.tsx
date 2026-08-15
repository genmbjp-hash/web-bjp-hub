import React, { useState, useEffect } from 'react';
import { SiteSettings, DocumentTemplate } from '../types';
import { FileText, Save, Plus, Trash2, Upload, Eye, EyeOff } from 'lucide-react';
import { CARD_TITLE_MAX_LENGTH, CARD_DESCRIPTION_MAX_LENGTH } from '../constants/defaults';
import { CharCounter } from './CharCounter';

interface DocumentTemplatesCMSProps {
  siteSettings: SiteSettings;
  onSaveSiteSettings: (settings: SiteSettings) => void;
}

const emptyTemplate = (): DocumentTemplate => ({
  id: `tmpl-${Date.now()}`,
  title: '',
  code: '',
  category: '',
  description: '',
  templateBody: '',
  enabled: true,
});

export const DocumentTemplatesCMS: React.FC<DocumentTemplatesCMSProps> = ({ siteSettings, onSaveSiteSettings }) => {
  const [templates, setTemplates] = useState<DocumentTemplate[]>(siteSettings.documentTemplates || []);

  useEffect(() => {
    setTemplates(siteSettings.documentTemplates || []);
  }, [siteSettings]);

  const updateTemplate = (id: string, patch: Partial<DocumentTemplate>) => {
    setTemplates(templates.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const addTemplate = () => setTemplates([...templates, emptyTemplate()]);
  const removeTemplate = (id: string) => setTemplates(templates.filter((t) => t.id !== id));

  const handleSave = () => {
    onSaveSiteSettings({ ...siteSettings, documentTemplates: templates });
    alert('Template Surat berhasil disimpan!');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-6">
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h2 className="text-xl font-black text-stone-900">Layanan Surat Online</h2>
              <p className="text-sm text-stone-500 font-medium mt-0.5">
                Kelola template surat yang bisa digenerate mandiri oleh warga.
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg transition-colors text-sm shrink-0"
          >
            <Save className="w-4 h-4" />
            Simpan
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {templates.map((t) => (
          <div key={t.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <span className="text-xs font-bold text-stone-900">
                {t.title || 'Template Baru'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateTemplate(t.id, { enabled: !t.enabled })}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                    t.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {t.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{t.enabled ? 'Aktif' : 'Nonaktif'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => removeTemplate(t.id)}
                  className="p-1.5 text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus Template"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-700 block">Judul Surat</label>
                  <CharCounter value={t.title} max={CARD_TITLE_MAX_LENGTH} />
                </div>
                <input
                  type="text"
                  maxLength={CARD_TITLE_MAX_LENGTH}
                  value={t.title}
                  onChange={(e) => updateTemplate(t.id, { title: e.target.value })}
                  placeholder="Contoh: Surat Pengantar RT/RW"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">Kategori</label>
                <input
                  type="text"
                  value={t.category}
                  onChange={(e) => updateTemplate(t.id, { category: e.target.value })}
                  placeholder="Contoh: Kependudukan"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700 block">Deskripsi Singkat</label>
                <CharCounter value={t.description} max={CARD_DESCRIPTION_MAX_LENGTH} />
              </div>
              <input
                type="text"
                maxLength={CARD_DESCRIPTION_MAX_LENGTH}
                value={t.description}
                onChange={(e) => updateTemplate(t.id, { description: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">Isi Keterangan Surat (Body Template)</label>
              <textarea
                rows={3}
                value={t.templateBody}
                onChange={(e) => updateTemplate(t.id, { templateBody: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">
                File Berkas Template (Opsional — Docx/PDF untuk diunduh langsung)
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-medium transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload File</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (evt) => {
                          const result = evt.target?.result as string;
                          if (result) updateTemplate(t.id, { fileUrl: result, fileName: file.name });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                {t.fileName && (
                  <span className="text-[11px] font-mono text-stone-600 bg-stone-100 px-2 py-1 rounded border border-stone-200 truncate max-w-[220px]">
                    {t.fileName}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addTemplate}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-lg text-xs transition-colors border border-dashed border-stone-300"
        >
          <Plus className="w-4 h-4 text-emerald-700" />
          Tambah Template Surat Baru
        </button>
      </div>
    </div>
  );
};
