import React, { useState, useEffect } from 'react';
import {
  SiteSettings, FasilitasLingkunganItem, FasilitasFact, FasilitasPhoto, FasilitasBlock, FasilitasBlockType,
} from '../types';
import {
  Trees, Save, Plus, Trash2, Eye, EyeOff, Upload, ChevronDown, ChevronUp, Wand2, FileText, Image as ImageIcon, Type,
} from 'lucide-react';
import { formatImageUrl } from '../utils/imageUrl';
import { slugify, uniqueSlug } from '../utils/slug';
import { normalizeFasilitasItems } from '../utils/fasilitas';
import { DEFAULT_FASILITAS_LINGKUNGAN_CONFIG } from '../utils/storage';

interface FasilitasLingkunganCMSProps {
  siteSettings: SiteSettings;
  onSaveSiteSettings: (settings: SiteSettings) => void;
}

const CATEGORY_PRESETS = ['Taman', 'Olahraga', 'Keamanan', 'Persampahan', 'Ibadah', 'Pendidikan', 'Pemerintahan', 'Umum'];
const STATUS_PRESETS = ['Aktif', 'Dalam Perbaikan', 'Rencana Pembangunan'];

const rid = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const emptyItem = (order: number): FasilitasLingkunganItem => ({
  id: rid('fasilitas'),
  name: '',
  slug: '',
  category: 'Umum',
  location: '',
  status: 'Aktif',
  summary: '',
  imageUrl: '',
  facts: [],
  gallery: [],
  blocks: [],
  mapEmbedUrl: '',
  enabled: true,
  order,
});

const emptyFact = (): FasilitasFact => ({ id: rid('fact'), label: '', value: '' });

const emptyPhoto = (order: number): FasilitasPhoto => ({
  id: rid('photo'), url: '', caption: '', enabled: true, order,
});

const emptyBlock = (type: FasilitasBlockType, order: number): FasilitasBlock => ({
  id: rid('block'), type, title: '', text: '', imageUrl: '', imageCaption: '', fileUrl: '', fileName: '', enabled: true, order,
});

/** Baca file gambar → data URL + rasio asli (probe), lalu callback. */
function readImageWithRatio(file: File, cb: (dataUrl: string, ratio?: number) => void) {
  const reader = new FileReader();
  reader.onload = (evt) => {
    const result = evt.target?.result as string;
    if (!result) return;
    const probe = new Image();
    probe.onload = () => {
      const ratio = probe.naturalWidth && probe.naturalHeight ? probe.naturalWidth / probe.naturalHeight : undefined;
      cb(result, ratio);
    };
    probe.onerror = () => cb(result);
    probe.src = result;
  };
  reader.readAsDataURL(file);
}

/** Nomori ulang `order` sesuai urutan array agar konsisten saat dirender. */
function reindex(items: FasilitasLingkunganItem[]): FasilitasLingkunganItem[] {
  return items.map((it, i) => ({
    ...it,
    order: i,
    gallery: (it.gallery || []).map((p, j) => ({ ...p, order: j })),
    blocks: (it.blocks || []).map((b, j) => ({ ...b, order: j })),
  }));
}

export const FasilitasLingkunganCMS: React.FC<FasilitasLingkunganCMSProps> = ({ siteSettings, onSaveSiteSettings }) => {
  const config = siteSettings.fasilitasLingkunganConfig || DEFAULT_FASILITAS_LINGKUNGAN_CONFIG;
  const [pageTitle, setPageTitle] = useState(config.pageTitle);
  const [pageDescription, setPageDescription] = useState(config.pageDescription || '');
  const [items, setItems] = useState<FasilitasLingkunganItem[]>(normalizeFasilitasItems(config.items || []));
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const c = siteSettings.fasilitasLingkunganConfig || DEFAULT_FASILITAS_LINGKUNGAN_CONFIG;
    setPageTitle(c.pageTitle);
    setPageDescription(c.pageDescription || '');
    setItems(normalizeFasilitasItems(c.items || []));
  }, [siteSettings]);

  const handleSave = () => {
    const cleaned = reindex(items).map((it) => ({
      ...it,
      slug: it.slug?.trim() || slugify(it.name) || it.id,
    }));
    onSaveSiteSettings({
      ...siteSettings,
      fasilitasLingkunganConfig: { ...config, pageTitle, pageDescription, items: cleaned },
    });
    alert('Halaman Fasilitas Lingkungan berhasil disimpan!');
  };

  // ---- item helpers -----------------------------------------------------
  const updateItem = (id: string, patch: Partial<FasilitasLingkunganItem>) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const removeItem = (id: string) => setItems((prev) => prev.filter((it) => it.id !== id));
  const addItem = () => {
    const it = emptyItem(items.length);
    setItems((prev) => [...prev, it]);
    setExpandedId(it.id);
  };
  const moveItem = (id: string, dir: -1 | 1) =>
    setItems((prev) => {
      const i = prev.findIndex((x) => x.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const copy = [...prev];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });

  const regenSlug = (it: FasilitasLingkunganItem) => {
    const taken = items.filter((x) => x.id !== it.id).map((x) => x.slug);
    updateItem(it.id, { slug: uniqueSlug(it.name || 'fasilitas', taken) });
  };

  // ---- nested helpers -------------------------------------------------
  const patchList = <T,>(list: T[] | undefined, id: string, patch: Partial<T>, key: keyof T) =>
    (list || []).map((x) => ((x[key] as unknown as string) === id ? { ...x, ...patch } : x));

  const addFact = (itemId: string) => {
    const it = items.find((x) => x.id === itemId);
    updateItem(itemId, { facts: [...(it?.facts || []), emptyFact()] });
  };
  const updateFact = (itemId: string, factId: string, patch: Partial<FasilitasFact>) => {
    const it = items.find((x) => x.id === itemId);
    updateItem(itemId, { facts: patchList(it?.facts, factId, patch, 'id') });
  };
  const removeFact = (itemId: string, factId: string) => {
    const it = items.find((x) => x.id === itemId);
    updateItem(itemId, { facts: (it?.facts || []).filter((f) => f.id !== factId) });
  };

  const addPhoto = (itemId: string) => {
    const it = items.find((x) => x.id === itemId);
    updateItem(itemId, { gallery: [...(it?.gallery || []), emptyPhoto((it?.gallery || []).length)] });
  };
  const updatePhoto = (itemId: string, photoId: string, patch: Partial<FasilitasPhoto>) => {
    const it = items.find((x) => x.id === itemId);
    updateItem(itemId, { gallery: patchList(it?.gallery, photoId, patch, 'id') });
  };
  const removePhoto = (itemId: string, photoId: string) => {
    const it = items.find((x) => x.id === itemId);
    updateItem(itemId, { gallery: (it?.gallery || []).filter((p) => p.id !== photoId) });
  };

  const addBlock = (itemId: string, type: FasilitasBlockType) => {
    const it = items.find((x) => x.id === itemId);
    updateItem(itemId, { blocks: [...(it?.blocks || []), emptyBlock(type, (it?.blocks || []).length)] });
  };
  const updateBlock = (itemId: string, blockId: string, patch: Partial<FasilitasBlock>) => {
    const it = items.find((x) => x.id === itemId);
    updateItem(itemId, { blocks: patchList(it?.blocks, blockId, patch, 'id') });
  };
  const removeBlock = (itemId: string, blockId: string) => {
    const it = items.find((x) => x.id === itemId);
    updateItem(itemId, { blocks: (it?.blocks || []).filter((b) => b.id !== blockId) });
  };
  const moveBlock = (itemId: string, blockId: string, dir: -1 | 1) => {
    const it = items.find((x) => x.id === itemId);
    const list = [...(it?.blocks || [])];
    const i = list.findIndex((b) => b.id === blockId);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    updateItem(itemId, { blocks: list });
  };

  const slugCounts = items.reduce<Record<string, number>>((acc, it) => {
    const s = it.slug?.trim();
    if (s) acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const inputCls = 'w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600';

  return (
    <div className="max-w-3xl mx-auto pb-6 space-y-6">
      {/* Header + page settings */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Trees className="w-5 h-5 text-emerald-700" />
            <h4 className="font-bold text-stone-900 text-sm sm:text-base">Halaman Fasilitas Lingkungan</h4>
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
          Setiap fasilitas punya halaman detail sendiri di <code className="bg-stone-100 px-1 rounded">/fasilitas-lingkungan/&lt;slug&gt;</code>.
          Foto (thumbnail, galeri, blok gambar) otomatis menyesuaikan rasio aslinya saat di-upload.
        </p>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-700">Judul Halaman</label>
          <input type="text" value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} className={inputCls} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-700">Deskripsi Halaman (opsional)</label>
          <textarea value={pageDescription} onChange={(e) => setPageDescription(e.target.value)} rows={2} className={inputCls} />
        </div>
      </div>

      {/* Item list */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
          <Trees className="w-4 h-4 text-emerald-700" />
          <h4 className="font-bold text-stone-900 text-sm">Daftar Fasilitas ({items.length})</h4>
        </div>

        {items.length === 0 && (
          <p className="text-xs text-stone-400 italic text-center py-4">
            Belum ada fasilitas. Tambahkan fasilitas pertama di bawah.
          </p>
        )}

        <div className="space-y-3">
          {items.map((f, idx) => {
            const open = expandedId === f.id;
            const slugDup = f.slug?.trim() && slugCounts[f.slug.trim()] > 1;
            return (
              <div key={f.id} className="bg-stone-50 rounded-xl border border-stone-200 overflow-hidden">
                {/* Accordion header */}
                <div className="flex items-center gap-2 p-3">
                  <button
                    type="button"
                    onClick={() => setExpandedId(open ? null : f.id)}
                    className="flex-1 flex items-center gap-2 text-left min-w-0"
                  >
                    {open ? <ChevronUp className="w-4 h-4 text-stone-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />}
                    <span className="text-xs font-bold text-stone-900 truncate">{f.name || 'Fasilitas Baru'}</span>
                    <span className="text-[10px] font-semibold text-stone-500 bg-stone-200 px-1.5 py-0.5 rounded shrink-0">{f.category || '—'}</span>
                  </button>
                  <div className="flex items-center gap-1 shrink-0">
                    <button type="button" onClick={() => moveItem(f.id, -1)} disabled={idx === 0} className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-30">
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={() => moveItem(f.id, 1)} disabled={idx === items.length - 1} className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-30">
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => updateItem(f.id, { enabled: !f.enabled })}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                        f.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {f.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button type="button" onClick={() => removeItem(f.id)} className="p-1.5 text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Accordion body */}
                {open && (
                  <div className="px-4 pb-4 space-y-4 border-t border-stone-200 pt-3">
                    {/* Dasar */}
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={f.name}
                        onChange={(e) => updateItem(f.id, { name: e.target.value })}
                        placeholder="Nama fasilitas, contoh: Masjid Ja'mi Al Aqwam"
                        className={`${inputCls} font-semibold`}
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={f.slug}
                          onChange={(e) => updateItem(f.id, { slug: slugify(e.target.value) })}
                          placeholder="slug-url"
                          className={`${inputCls} font-mono flex-1`}
                        />
                        <button
                          type="button"
                          onClick={() => regenSlug(f)}
                          title="Buat slug dari nama"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-xs font-semibold shrink-0"
                        >
                          <Wand2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {!f.slug?.trim() && <p className="text-[11px] text-amber-600">Slug kosong — akan dibuat otomatis dari nama saat disimpan.</p>}
                      {slugDup && <p className="text-[11px] text-red-600">Slug ini dipakai fasilitas lain. Ubah agar unik.</p>}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input type="text" list={`kat-${f.id}`} value={f.category} onChange={(e) => updateItem(f.id, { category: e.target.value })} placeholder="Kategori" className={inputCls} />
                        <datalist id={`kat-${f.id}`}>{CATEGORY_PRESETS.map((c) => <option key={c} value={c} />)}</datalist>
                        <input type="text" list={`st-${f.id}`} value={f.status || ''} onChange={(e) => updateItem(f.id, { status: e.target.value })} placeholder="Status" className={inputCls} />
                        <datalist id={`st-${f.id}`}>{STATUS_PRESETS.map((s) => <option key={s} value={s} />)}</datalist>
                      </div>
                      <input type="text" value={f.location || ''} onChange={(e) => updateItem(f.id, { location: e.target.value })} placeholder="Lokasi / blok, contoh: Blok C, dekat Pos 2" className={inputCls} />
                      <textarea value={f.summary || ''} onChange={(e) => updateItem(f.id, { summary: e.target.value })} rows={2} placeholder="Ringkasan singkat untuk kartu di halaman daftar" className={inputCls} />
                    </div>

                    {/* Thumbnail */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700">Gambar Utama / Thumbnail</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={f.imageUrl || ''}
                          onChange={(e) => updateItem(f.id, { imageUrl: e.target.value, aspectRatio: undefined })}
                          placeholder="URL Gambar (atau tekan Upload)"
                          className={`${inputCls} font-mono flex-1`}
                        />
                        <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-medium shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) readImageWithRatio(file, (url, ratio) => updateItem(f.id, { imageUrl: url, aspectRatio: ratio }));
                            }}
                          />
                        </label>
                        {f.imageUrl && (
                          <div className="w-12 h-10 bg-stone-100 rounded-lg overflow-hidden border border-stone-200 shrink-0">
                            <img
                              src={formatImageUrl(f.imageUrl)}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              onLoad={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                const img = e.currentTarget;
                                if (!img.naturalWidth || !img.naturalHeight) return;
                                const ratio = img.naturalWidth / img.naturalHeight;
                                if (!f.aspectRatio || Math.abs(f.aspectRatio - ratio) > 0.01) updateItem(f.id, { aspectRatio: ratio });
                              }}
                              onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3'; }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Fakta kunci */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-700">Informasi Ringkas (label : nilai)</label>
                      {(f.facts || []).map((fact) => (
                        <div key={fact.id} className="flex items-center gap-2">
                          <input type="text" value={fact.label} onChange={(e) => updateFact(f.id, fact.id, { label: e.target.value })} placeholder="Label (mis. Luas Lahan)" className={`${inputCls} w-1/3`} />
                          <input type="text" value={fact.value} onChange={(e) => updateFact(f.id, fact.id, { value: e.target.value })} placeholder="Nilai (mis. 2.437 m²)" className={`${inputCls} flex-1`} />
                          <button type="button" onClick={() => removeFact(f.id, fact.id)} className="p-1.5 text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-lg shrink-0"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                      <button type="button" onClick={() => addFact(f.id)} className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-900">
                        <Plus className="w-3.5 h-3.5" /><span>Tambah Fakta</span>
                      </button>
                    </div>

                    {/* Blok konten */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-700">Blok Konten Halaman Detail</label>
                      {(f.blocks || []).map((b, bi) => (
                        <div key={b.id} className="bg-white p-3 rounded-lg border border-stone-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-stone-200 text-stone-700">
                              {b.type === 'pdf' ? 'PDF' : b.type === 'image' ? 'Gambar' : 'Teks'}
                            </span>
                            <div className="flex items-center gap-1">
                              <button type="button" onClick={() => moveBlock(f.id, b.id, -1)} disabled={bi === 0} className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-30"><ChevronUp className="w-3.5 h-3.5" /></button>
                              <button type="button" onClick={() => moveBlock(f.id, b.id, 1)} disabled={bi === (f.blocks || []).length - 1} className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-30"><ChevronDown className="w-3.5 h-3.5" /></button>
                              <button
                                type="button"
                                onClick={() => updateBlock(f.id, b.id, { enabled: !b.enabled })}
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold ${b.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'}`}
                              >
                                {b.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                              </button>
                              <button type="button" onClick={() => removeBlock(f.id, b.id)} className="p-1.5 text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </div>
                          <input type="text" value={b.title || ''} onChange={(e) => updateBlock(f.id, b.id, { title: e.target.value })} placeholder="Judul blok (opsional)" className={`${inputCls} font-semibold`} />

                          {b.type === 'text' && (
                            <textarea value={b.text || ''} onChange={(e) => updateBlock(f.id, b.id, { text: e.target.value })} rows={4} placeholder="Isi teks…" className={inputCls} />
                          )}

                          {b.type === 'image' && (
                            <>
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={b.imageUrl || ''}
                                  onChange={(e) => updateBlock(f.id, b.id, { imageUrl: e.target.value, aspectRatio: undefined })}
                                  placeholder="URL Gambar"
                                  className={`${inputCls} font-mono flex-1`}
                                />
                                <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-medium shrink-0">
                                  <Upload className="w-3.5 h-3.5" /><span>Upload</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) readImageWithRatio(file, (url, ratio) => updateBlock(f.id, b.id, { imageUrl: url, aspectRatio: ratio }));
                                    }}
                                  />
                                </label>
                              </div>
                              <input type="text" value={b.imageCaption || ''} onChange={(e) => updateBlock(f.id, b.id, { imageCaption: e.target.value })} placeholder="Keterangan gambar (opsional)" className={inputCls} />
                            </>
                          )}

                          {b.type === 'pdf' && (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={b.fileUrl && !b.fileUrl.startsWith('data:') ? b.fileUrl : ''}
                                onChange={(e) => updateBlock(f.id, b.id, { fileUrl: e.target.value, fileName: '' })}
                                placeholder="Tempel Link Google Drive PDF (https://drive.google.com/file/d/...)"
                                className={`${inputCls} font-mono`}
                              />
                              <div className="flex flex-wrap items-center gap-2">
                                <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-medium">
                                  <Upload className="w-3.5 h-3.5" /><span>atau Upload File PDF</span>
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
                                          if (result) updateBlock(f.id, b.id, { fileUrl: result, fileName: file.name });
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                                </label>
                                {b.fileName && (
                                  <span className="text-[11px] font-mono text-stone-600 bg-white px-2 py-1 rounded border border-stone-200 truncate max-w-[200px]">{b.fileName}</span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      <div className="flex flex-wrap items-center gap-2">
                        <button type="button" onClick={() => addBlock(f.id, 'text')} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-lg text-xs">
                          <Type className="w-3.5 h-3.5 text-emerald-700" />Kartu Teks
                        </button>
                        <button type="button" onClick={() => addBlock(f.id, 'image')} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-lg text-xs">
                          <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />Kartu Gambar
                        </button>
                        <button type="button" onClick={() => addBlock(f.id, 'pdf')} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-lg text-xs">
                          <FileText className="w-3.5 h-3.5 text-emerald-700" />Kartu PDF
                        </button>
                      </div>
                    </div>

                    {/* Galeri */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-700">Galeri Foto</label>
                      {(f.gallery || []).map((p) => (
                        <div key={p.id} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={p.url}
                            onChange={(e) => updatePhoto(f.id, p.id, { url: e.target.value, aspectRatio: undefined })}
                            placeholder="URL Foto"
                            className={`${inputCls} font-mono flex-1`}
                          />
                          <input type="text" value={p.caption || ''} onChange={(e) => updatePhoto(f.id, p.id, { caption: e.target.value })} placeholder="Keterangan" className={`${inputCls} w-1/4`} />
                          <label className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-medium shrink-0">
                            <Upload className="w-3.5 h-3.5" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) readImageWithRatio(file, (url, ratio) => updatePhoto(f.id, p.id, { url, aspectRatio: ratio }));
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => updatePhoto(f.id, p.id, { enabled: !p.enabled })}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold shrink-0 ${p.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'}`}
                          >
                            {p.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>
                          <button type="button" onClick={() => removePhoto(f.id, p.id)} className="p-1.5 text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-lg shrink-0"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                      <button type="button" onClick={() => addPhoto(f.id)} className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-900">
                        <Plus className="w-3.5 h-3.5" /><span>Tambah Foto</span>
                      </button>
                    </div>

                    {/* Peta */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700">Peta Lokasi — URL sematan Google Maps (opsional)</label>
                      <input
                        type="text"
                        value={f.mapEmbedUrl || ''}
                        onChange={(e) => updateItem(f.id, { mapEmbedUrl: e.target.value })}
                        placeholder='Salin nilai src="..." dari Google Maps → Bagikan → Sematkan peta'
                        className={`${inputCls} font-mono`}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-lg text-xs transition-colors border border-dashed border-stone-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
        >
          <Plus className="w-4 h-4 text-emerald-700" />
          Tambah Fasilitas
        </button>
      </div>
    </div>
  );
};
