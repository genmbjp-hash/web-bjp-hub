import React, { useState } from 'react';
import { Entity, Announcement } from '../types';
import {
  X, Plus, Edit3, Trash2, Copy, Download, Upload, RefreshCw, Check,
  Image as ImageIcon, Sparkles, LayoutGrid, Megaphone, HelpCircle,
  Bold, Italic, List, Heading, ExternalLink, ShieldAlert, ArrowLeft
} from 'lucide-react';
import { exportDataAsJSON, importDataFromJSON, resetToDefaults } from '../utils/storage';
import { InstagramIcon, FacebookIcon, TikTokIcon, WhatsAppIcon, SocialBadges } from './SocialIcons';

interface CMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  entities: Entity[];
  onSaveEntities: (entities: Entity[]) => void;
  announcements: Announcement[];
  onSaveAnnouncements: (announcements: Announcement[]) => void;
  editingEntityInit?: Entity | null;
  initialCategoryForNewEntity?: string | null;
}

// Preset Images for board members without photo links
const IMAGE_PRESETS = [
  { label: 'Pusat Hub / Portal', url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80' },
  { label: 'Pemerintahan / RT RW', url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80' },
  { label: 'Masjid / DKM', url: 'https://images.unsplash.com/photo-1590076175571-4b5459efb08c?auto=format&fit=crop&w=600&q=80' },
  { label: 'UMKM / Kuliner', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80' },
  { label: 'Lingkungan / Sampah', url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80' },
  { label: 'Keluarga / PKK', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80' },
  { label: 'Kesehatan / Posyandu', url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80' },
  { label: 'Bulutangkis / Badminton', url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80' },
  { label: 'Tenis Meja / Pingpong', url: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=600&q=80' },
  { label: 'Padel Tennis', url: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=600&q=80' },
  { label: 'Senam / Aerobik', url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80' },
  { label: 'Jalan Sehat / Olahraga', url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=80' },
];

const WORDING_PRESETS = [
  'Kunjungi Instagram',
  'Daftar Sekarang',
  'Booking GOR & Lapangan',
  'Lihat Katalog UMKM',
  'Hubungi Admin / Whatsapp',
  'Kunjungi Portal Web',
  'Tonton Video Youtube',
  'Jadwal Kegiatan',
];

const CATEGORY_PRESETS = [
  'Sentra Usaha BJP',
  'Pusat Hub',
  'Administratif / Pemerintahan',
  'Keagamaan',
  'Lingkungan',
  'Kesejahteraan Keluarga',
  'Kesehatan',
  'Kepemudaan',
  'Olahraga',
];

export const CMSModal: React.FC<CMSModalProps> = ({
  isOpen,
  onClose,
  entities,
  onSaveEntities,
  announcements,
  onSaveAnnouncements,
  editingEntityInit,
  initialCategoryForNewEntity,
}) => {
  const [activeTab, setActiveTab] = useState<'entities' | 'announcements' | 'backup'>('entities');
  const [editingEntity, setEditingEntity] = useState<Entity | null>(editingEntityInit || null);
  const [isCreatingNewEntity, setIsCreatingNewEntity] = useState(false);

  // Form State for Entity
  const [formEntity, setFormEntity] = useState<Partial<Entity>>({
    name: '',
    category: 'Pusat Hub',
    description: '',
    image: IMAGE_PRESETS[0].url,
    ctaUrl: '',
    ctaWording: 'Kunjungi Tautan',
    instagram: '',
    mediaUrl: '',
    contact: '',
    schedule: '',
    isFeatured: false,
  });

  // Form State for Announcement
  const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);
  const [isCreatingAnn, setIsCreatingAnn] = useState(false);
  const [formAnn, setFormAnn] = useState<Partial<Announcement>>({
    title: '',
    category: 'Umum',
    content: '',
    author: 'Pengurus RW 11',
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    ctaUrl: '',
    ctaWording: 'Info Selengkapnya',
    isImportant: false,
  });

  const [notification, setNotification] = useState<string | null>(null);

  // Social toggles helper
  const toggleSocial = (platform: 'tiktok' | 'facebook' | 'instagram' | 'whatsapp') => {
    const currentSocials = formEntity.socials || {};
    const currentItem = currentSocials[platform] || { enabled: false, url: '' };

    let initialUrl = currentItem.url;
    if (!currentItem.enabled && !initialUrl && platform === 'instagram' && formEntity.instagram) {
      initialUrl = formEntity.instagram;
    }

    const updated = {
      ...currentSocials,
      [platform]: {
        enabled: !currentItem.enabled,
        url: initialUrl,
      },
    };

    setFormEntity({
      ...formEntity,
      socials: updated,
    });
  };

  const updateSocialUrl = (platform: 'tiktok' | 'facebook' | 'instagram' | 'whatsapp', url: string) => {
    const currentSocials = formEntity.socials || {};
    const currentItem = currentSocials[platform] || { enabled: true, url: '' };

    setFormEntity({
      ...formEntity,
      socials: {
        ...currentSocials,
        [platform]: {
          ...currentItem,
          url,
        },
      },
      ...(platform === 'instagram' ? { instagram: url } : {}),
    });
  };

  // ENTITY CRUD HANDLERS
  const handleStartNewEntity = (presetCat?: string) => {
    setEditingEntity(null);
    setIsCreatingNewEntity(true);
    const cat = presetCat || initialCategoryForNewEntity || 'Olahraga';
    setFormEntity({
      name: '',
      category: cat,
      description: 'Deskripsi singkat mengenai entitas atau kegiatan warga komplek...',
      image: IMAGE_PRESETS[0].url,
      ctaUrl: '#',
      ctaWording: 'Kunjungi Tautan',
      instagram: '',
      mediaUrl: '',
      contact: '',
      schedule: '',
      isFeatured: false,
      productPhotos: [],
      socials: {
        instagram: { enabled: false, url: '' },
        facebook: { enabled: false, url: '' },
        tiktok: { enabled: false, url: '' },
        whatsapp: { enabled: false, url: '' },
      },
    });
  };

  // Handle edit or create initial entity if passed
  React.useEffect(() => {
    if (editingEntityInit) {
      setEditingEntity(editingEntityInit);
      const socials = editingEntityInit.socials || {
        instagram: { enabled: !!editingEntityInit.instagram, url: editingEntityInit.instagram || '' },
        facebook: { enabled: false, url: '' },
        tiktok: { enabled: false, url: '' },
        whatsapp: { enabled: false, url: '' },
      };
      setFormEntity({ ...editingEntityInit, socials });
      setIsCreatingNewEntity(false);
      setActiveTab('entities');
    } else if (initialCategoryForNewEntity) {
      handleStartNewEntity(initialCategoryForNewEntity);
      setActiveTab('entities');
    }
  }, [editingEntityInit, initialCategoryForNewEntity]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleStartEditEntity = (ent: Entity) => {
    setEditingEntity(ent);
    setIsCreatingNewEntity(false);
    const socials = ent.socials || {
      instagram: { enabled: !!ent.instagram, url: ent.instagram || '' },
      facebook: { enabled: false, url: '' },
      tiktok: { enabled: false, url: '' },
      whatsapp: { enabled: false, url: '' },
    };
    setFormEntity({ ...ent, socials });
  };

  const handleSaveEntity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEntity.name?.trim()) {
      alert('Nama entitas wajib diisi!');
      return;
    }

    const now = new Date().toISOString();

    if (editingEntity) {
      // Update existing
      const updated = entities.map((item) =>
        item.id === editingEntity.id
          ? ({
              ...item,
              ...formEntity,
              updatedAt: now,
            } as Entity)
          : item
      );
      onSaveEntities(updated);
      showToast(`Entitas "${formEntity.name}" berhasil diperbarui!`);
    } else {
      // Create new
      const newEnt: Entity = {
        id: `ent-${Date.now()}`,
        name: formEntity.name || 'Entitas Baru',
        category: formEntity.category || 'Pusat Hub',
        description: formEntity.description || '',
        image: formEntity.image || IMAGE_PRESETS[0].url,
        ctaUrl: formEntity.ctaUrl || '#',
        ctaWording: formEntity.ctaWording || 'Kunjungi Tautan',
        instagram: formEntity.instagram || '',
        mediaUrl: formEntity.mediaUrl || '',
        contact: formEntity.contact || '',
        schedule: formEntity.schedule || '',
        isFeatured: formEntity.isFeatured || false,
        productPhotos: formEntity.productPhotos || [],
        createdAt: now,
        updatedAt: now,
      };
      onSaveEntities([newEnt, ...entities]);
      showToast(`Entitas "${newEnt.name}" berhasil ditambahkan!`);
    }

    setEditingEntity(null);
    setIsCreatingNewEntity(false);
  };

  const handleDeleteEntity = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus entitas "${name}"?`)) {
      const filtered = entities.filter((item) => item.id !== id);
      onSaveEntities(filtered);
      showToast(`Entitas "${name}" berhasil dihapus.`);
    }
  };

  const handleDuplicateEntity = (ent: Entity) => {
    const duplicated: Entity = {
      ...ent,
      id: `ent-${Date.now()}`,
      name: `${ent.name} (Salinan)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSaveEntities([duplicated, ...entities]);
    showToast(`Berhasil menyalin "${ent.name}".`);
  };

  // ANNOUNCEMENT CRUD HANDLERS
  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAnn.title?.trim()) {
      alert('Judul pengumuman wajib diisi!');
      return;
    }

    if (editingAnn) {
      const updated = announcements.map((item) =>
        item.id === editingAnn.id ? ({ ...item, ...formAnn } as Announcement) : item
      );
      onSaveAnnouncements(updated);
      showToast('Pengumuman berhasil diperbarui!');
    } else {
      const newAnn: Announcement = {
        id: `ann-${Date.now()}`,
        title: formAnn.title || '',
        category: formAnn.category || 'Umum',
        content: formAnn.content || '',
        author: formAnn.author || 'Pengurus RW 11',
        date: formAnn.date || new Date().toLocaleDateString('id-ID'),
        ctaUrl: formAnn.ctaUrl || '',
        ctaWording: formAnn.ctaWording || 'Info Selengkapnya',
        isImportant: formAnn.isImportant || false,
      };
      onSaveAnnouncements([newAnn, ...announcements]);
      showToast('Pengumuman baru berhasil ditambahkan!');
    }

    setEditingAnn(null);
    setIsCreatingAnn(false);
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (confirm('Hapus pengumuman ini?')) {
      const filtered = announcements.filter((a) => a.id !== id);
      onSaveAnnouncements(filtered);
      showToast('Pengumuman berhasil dihapus.');
    }
  };

  // BACKUP HANDLERS
  const handleExport = () => {
    exportDataAsJSON(entities, announcements);
    showToast('File backup bjp-hub-data.json berhasil didownload!');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importDataFromJSON(content);
      if (res.success) {
        if (res.entities) onSaveEntities(res.entities);
        if (res.announcements) onSaveAnnouncements(res.announcements);
        showToast(res.message);
      } else {
        alert(res.message);
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (confirm('RESET DATA: Apakah Anda ingin mengembalikan seluruh data ke 13 Entitas Awal dari PDF? Seluruh perubahan lokal akan ditimpa.')) {
      const res = resetToDefaults();
      onSaveEntities(res.entities);
      onSaveAnnouncements(res.announcements);
      showToast('Data berhasil di-reset ke 13 Entitas Awal PDF!');
    }
  };

  // Helper Rich Text Format Inserter
  const insertFormatting = (tag: 'bold' | 'italic' | 'bullet' | 'heading') => {
    const current = formEntity.description || '';
    if (tag === 'bold') setFormEntity({ ...formEntity, description: current + ' <strong>teks tebal</strong> ' });
    if (tag === 'italic') setFormEntity({ ...formEntity, description: current + ' <em>teks miring</em> ' });
    if (tag === 'bullet')
      setFormEntity({
        ...formEntity,
        description: current + '\n<ul>\n  <li>Poin 1</li>\n  <li>Poin 2</li>\n</ul>',
      });
    if (tag === 'heading') setFormEntity({ ...formEntity, description: current + '\n<p><strong>Judul Bagian:</strong></p>' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/80 backdrop-blur-md animate-fade-in">
      <div className="bg-stone-50 rounded-2xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl border border-stone-300 overflow-hidden relative">

        {/* Toast Notification */}
        {notification && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-800 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-lg border border-emerald-600 flex items-center gap-2 animate-bounce">
            <Check className="w-4 h-4 text-emerald-300" />
            <span>{notification}</span>
          </div>
        )}

        {/* Header Bar */}
        <div className="bg-stone-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 text-stone-950 rounded-xl font-bold">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg tracking-tight">
                CMS Pengurus Komplek Bintara Jaya Permai (RW 11)
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-xl transition-colors"
            title="Tutup CMS"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-stone-200 px-4 pt-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              setActiveTab('entities');
              setEditingEntity(null);
              setIsCreatingNewEntity(false);
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'entities'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-emerald-700" />
            <span>Kelola Entitas Kegiatan ({entities.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('announcements');
              setEditingAnn(null);
              setIsCreatingAnn(false);
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'announcements'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Megaphone className="w-4 h-4 text-emerald-700" />
            <span>Kelola Pengumuman ({announcements.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'backup'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>Backup & Publish Vercel</span>
          </button>
        </div>

        {/* Main Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-100/60">

          {/* TAB 1: ENTITIES MANAGER */}
          {activeTab === 'entities' && (
            <div>
              {/* IF CREATING OR EDITING ENTITY */}
              {isCreatingNewEntity || editingEntity ? (
                <div className="space-y-4">
                  {/* Back button */}
                  <button
                    onClick={() => {
                      setEditingEntity(null);
                      setIsCreatingNewEntity(false);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white px-3 py-1.5 rounded-lg border border-stone-200"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Daftar Entitas</span>
                  </button>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* FORM INPUTS (LEFT) */}
                    <form onSubmit={handleSaveEntity} className="lg:col-span-7 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                        <h3 className="font-bold text-stone-900 text-base">
                          {editingEntity ? `Edit: ${editingEntity.name}` : 'Tambah Entitas / Unit Baru'}
                        </h3>
                        <span className="text-xs text-stone-400">Semua field mudah disesuaikan</span>
                      </div>

                      {/* Title */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-700">1. Nama Entitas / Unit Kegiatan *</label>
                        <input
                          type="text"
                          required
                          value={formEntity.name || ''}
                          onChange={(e) => setFormEntity({ ...formEntity, name: e.target.value })}
                          placeholder="Contoh: Badminton Club BJP, DKM Masjid Al Aqwam..."
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                        />
                      </div>

                      {/* Category & Featured */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-stone-700">2. Kategori Kegiatan *</label>
                          <select
                            value={formEntity.category || 'Pusat Hub'}
                            onChange={(e) => setFormEntity({ ...formEntity, category: e.target.value })}
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                          >
                            {CATEGORY_PRESETS.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center pt-5">
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800">
                            <input
                              type="checkbox"
                              checked={formEntity.isFeatured || false}
                              onChange={(e) => setFormEntity({ ...formEntity, isFeatured: e.target.checked })}
                              className="w-4 h-4 text-emerald-600 rounded-md border-stone-300 focus:ring-emerald-500"
                            />
                            <span>Tampilkan Penanda "★ Unggulan"</span>
                          </label>
                        </div>
                      </div>

                      {/* Image Picker with Presets */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
                          <span>3. URL Foto / Gambar Utama</span>
                          <span className="text-[11px] text-stone-400">Bisa pilih foto cepat di bawah ini</span>
                        </label>
                        <input
                          type="text"
                          value={formEntity.image || ''}
                          onChange={(e) => setFormEntity({ ...formEntity, image: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />

                        {/* Presets Grid */}
                        <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 space-y-1.5">
                          <span className="text-[11px] font-semibold text-stone-500 block">
                            Pilih Foto Siap Pakai (Click untuk pilih):
                          </span>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                            {IMAGE_PRESETS.map((p, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setFormEntity({ ...formEntity, image: p.url })}
                                className={`text-[10px] p-1.5 rounded-lg border text-left truncate transition-all ${
                                  formEntity.image === p.url
                                    ? 'bg-emerald-800 text-white border-emerald-900 font-bold'
                                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                                }`}
                              >
                                {p.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Description Rich Text Editor */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-stone-700">4. Deskripsi & Fungsi Utama (Rich Text Format)</label>
                          {/* Rich Text Toolbar */}
                          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200">
                            <button
                              type="button"
                              onClick={() => insertFormatting('bold')}
                              className="p-1 hover:bg-white rounded text-stone-700"
                              title="Teks Tebal"
                            >
                              <Bold className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => insertFormatting('italic')}
                              className="p-1 hover:bg-white rounded text-stone-700"
                              title="Teks Miring"
                            >
                              <Italic className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => insertFormatting('bullet')}
                              className="p-1 hover:bg-white rounded text-stone-700"
                              title="Daftar Poin (List)"
                            >
                              <List className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => insertFormatting('heading')}
                              className="p-1 hover:bg-white rounded text-stone-700"
                              title="Judul Bagian"
                            >
                              <Heading className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <textarea
                          rows={5}
                          value={formEntity.description || ''}
                          onChange={(e) => setFormEntity({ ...formEntity, description: e.target.value })}
                          placeholder="Jelaskan mengenai entitas kegiatan ini, fungsi utama, dan jadwal warga..."
                          className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white font-mono"
                        />
                      </div>

                      {/* CTA & Wordings */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-stone-700">5. Tautan Tombol Utama (CTA URL)</label>
                          <input
                            type="text"
                            value={formEntity.ctaUrl || ''}
                            onChange={(e) => setFormEntity({ ...formEntity, ctaUrl: e.target.value })}
                            placeholder="https://instagram.com/... atau https://bit.ly/..."
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-stone-700">6. Teks / Wording Tombol (CTA)</label>
                          <input
                            type="text"
                            value={formEntity.ctaWording || ''}
                            onChange={(e) => setFormEntity({ ...formEntity, ctaWording: e.target.value })}
                            placeholder="Contoh: Kunjungi Instagram"
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                          />
                        </div>
                      </div>

                      {/* Wording Presets */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[11px] font-semibold text-stone-400 w-full">Teks Tombol Cepat:</span>
                        {WORDING_PRESETS.map((w) => (
                          <button
                            key={w}
                            type="button"
                            onClick={() => setFormEntity({ ...formEntity, ctaWording: w })}
                            className="text-[10px] bg-stone-100 hover:bg-stone-200 text-stone-700 px-2 py-0.5 rounded-md border border-stone-200 transition-colors"
                          >
                            + {w}
                          </button>
                        ))}
                      </div>

                      {/* Social Media Settings with Toggle ON/OFF */}
                      <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200/80 pb-2 gap-1">
                          <div>
                            <h4 className="text-xs font-bold text-stone-800">Media Sosial (TikTok, Facebook, Instagram, WhatsApp)</h4>
                            <p className="text-[11px] text-stone-500">
                              Aktifkan toggle ON/OFF untuk menentukan logo sosmed yang tampil pada kartu di halaman utama.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          {/* Instagram */}
                          <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                                <InstagramIcon className="w-4 h-4 text-pink-600" />
                                <span>Instagram</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleSocial('instagram')}
                                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                                  formEntity.socials?.instagram?.enabled ? 'bg-emerald-600' : 'bg-stone-300'
                                }`}
                              >
                                <span
                                  className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                                    formEntity.socials?.instagram?.enabled ? 'translate-x-4' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                            </div>
                            {formEntity.socials?.instagram?.enabled && (
                              <input
                                type="text"
                                value={formEntity.socials?.instagram?.url || ''}
                                onChange={(e) => updateSocialUrl('instagram', e.target.value)}
                                placeholder="https://instagram.com/username"
                                className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                              />
                            )}
                          </div>

                          {/* Facebook */}
                          <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                                <FacebookIcon className="w-4 h-4 text-blue-600" />
                                <span>Facebook</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleSocial('facebook')}
                                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                                  formEntity.socials?.facebook?.enabled ? 'bg-emerald-600' : 'bg-stone-300'
                                }`}
                              >
                                <span
                                  className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                                    formEntity.socials?.facebook?.enabled ? 'translate-x-4' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                            </div>
                            {formEntity.socials?.facebook?.enabled && (
                              <input
                                type="text"
                                value={formEntity.socials?.facebook?.url || ''}
                                onChange={(e) => updateSocialUrl('facebook', e.target.value)}
                                placeholder="https://facebook.com/page"
                                className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                              />
                            )}
                          </div>

                          {/* TikTok */}
                          <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                                <TikTokIcon className="w-4 h-4 text-stone-900" />
                                <span>TikTok</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleSocial('tiktok')}
                                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                                  formEntity.socials?.tiktok?.enabled ? 'bg-emerald-600' : 'bg-stone-300'
                                }`}
                              >
                                <span
                                  className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                                    formEntity.socials?.tiktok?.enabled ? 'translate-x-4' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                            </div>
                            {formEntity.socials?.tiktok?.enabled && (
                              <input
                                type="text"
                                value={formEntity.socials?.tiktok?.url || ''}
                                onChange={(e) => updateSocialUrl('tiktok', e.target.value)}
                                placeholder="https://tiktok.com/@username"
                                className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                              />
                            )}
                          </div>

                          {/* WhatsApp */}
                          <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                                <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
                                <span>WhatsApp</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleSocial('whatsapp')}
                                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                                  formEntity.socials?.whatsapp?.enabled ? 'bg-emerald-600' : 'bg-stone-300'
                                }`}
                              >
                                <span
                                  className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                                    formEntity.socials?.whatsapp?.enabled ? 'translate-x-4' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                            </div>
                            {formEntity.socials?.whatsapp?.enabled && (
                              <input
                                type="text"
                                value={formEntity.socials?.whatsapp?.url || ''}
                                onChange={(e) => updateSocialUrl('whatsapp', e.target.value)}
                                placeholder="08123456789 atau https://wa.me/..."
                                className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Extra Meta (Contact, Schedule) */}
                      <div className="border-t border-stone-100 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-stone-700">Kontak Admin / No. HP (Opsional)</label>
                          <input
                            type="text"
                            value={formEntity.contact || ''}
                            onChange={(e) => setFormEntity({ ...formEntity, contact: e.target.value })}
                            placeholder="Contoh: 0812-3456-7890 (Pak RW)"
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-stone-700">Jadwal Operasional / Rutin (Opsional)</label>
                          <input
                            type="text"
                            value={formEntity.schedule || ''}
                            onChange={(e) => setFormEntity({ ...formEntity, schedule: e.target.value })}
                            placeholder="Contoh: Setiap Hari Minggu Pagi (06.30 WIB)"
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                          />
                        </div>
                      </div>

                      {/* Product / Gallery Photos (Optional) */}
                      <div className="border-t border-stone-100 pt-3 space-y-1">
                        <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Foto Produk / Galeri Usaha (Opsional)</span>
                          </span>
                          <span className="text-[11px] font-normal text-stone-400">1 URL per baris</span>
                        </label>
                        <textarea
                          rows={3}
                          value={formEntity.productPhotos ? formEntity.productPhotos.join('\n') : ''}
                          onChange={(e) => {
                            const urls = e.target.value
                              .split('\n')
                              .map((s) => s.trim())
                              .filter(Boolean);
                            setFormEntity({ ...formEntity, productPhotos: urls });
                          }}
                          placeholder="https://images.unsplash.com/photo-1555396273-367ea4eb4db5&#10;https://images.unsplash.com/photo-1504674900247-0877df9cc836"
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                        />
                        <p className="text-[11px] text-stone-400">
                          Masukkan URL foto produk atau galeri kegiatan. Di halaman detail card, section foto ini dapat di-expand/collapse.
                        </p>
                      </div>

                      {/* Submit Actions */}
                      <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingEntity(null);
                            setIsCreatingNewEntity(false);
                          }}
                          className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-semibold rounded-xl hover:bg-stone-100"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md transition-colors"
                        >
                          Simpan Entitas Ini
                        </button>
                      </div>
                    </form>

                    {/* LIVE PREVIEW (RIGHT) */}
                    <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3 sticky top-0">
                      <div className="flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-wider border-b border-stone-100 pb-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Pratinjau Kartu (Live Preview)</span>
                      </div>

                      {/* Mock Card */}
                      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden space-y-3">
                        <div className="relative h-40 bg-stone-100">
                          <img
                            src={formEntity.image || IMAGE_PRESETS[0].url}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = IMAGE_PRESETS[0].url;
                            }}
                          />
                          <div className="absolute top-2 left-2 flex gap-1">
                            <span className="bg-emerald-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                              {formEntity.category || 'Pusat Hub'}
                            </span>
                          </div>
                          <div className="absolute bottom-2 left-2 right-2 text-white font-bold text-sm drop-shadow-md">
                            {formEntity.name || 'Nama Entitas Kegiatan'}
                          </div>
                        </div>

                        <div className="p-3 space-y-2">
                          <p className="text-stone-600 text-xs line-clamp-3">
                            {(formEntity.description || '').replace(/<[^>]*>?/gm, '') || 'Deskripsi entitas...'}
                          </p>

                          {/* Live Social Badges */}
                          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                            <SocialBadges socials={formEntity.socials} fallbackInstagram={formEntity.instagram} />
                            <span className="bg-emerald-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                              {formEntity.ctaWording || 'Kunjungi Tautan'} →
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-amber-50 p-3 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
                        💡 <strong>Tips Pengurus:</strong> Setelah selesai menambah atau mengubah entitas, jangan lupa klik <strong>"Simpan Entitas Ini"</strong>. Anda dapat mengunduh backup JSON di tab Backup agar data tetap aman saat dipublish ke Vercel!
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* ENTITIES LIST BY SECTION / CATEGORY */
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                    <div>
                      <h3 className="font-bold text-stone-900 text-base">Kelola Entitas & Card Per Section ({entities.length} Card Total)</h3>
                      <p className="text-xs text-stone-500">Anda dapat menambah card baru di setiap section atau mengedit card yang sudah ada.</p>
                    </div>

                    <button
                      onClick={() => handleStartNewEntity()}
                      className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition-colors shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Tambah Card Baru</span>
                    </button>
                  </div>

                  {/* Grouped by Section Category */}
                  {CATEGORY_PRESETS.map((cat) => {
                    const sectionEntities = entities.filter(
                      (item) =>
                        item.category.toLowerCase().includes(cat.toLowerCase()) ||
                        cat.toLowerCase().includes(item.category.toLowerCase())
                    );

                    return (
                      <div key={cat} className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-4">
                        {/* Section Header */}
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                          <div className="flex items-center gap-2.5">
                            <h4 className="font-bold text-stone-900 text-sm sm:text-base">{cat}</h4>
                            <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                              {sectionEntities.length} Card
                            </span>
                          </div>

                          <button
                            onClick={() => handleStartNewEntity(cat)}
                            className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Tambah Card di {cat}</span>
                          </button>
                        </div>

                        {/* Cards Grid for this Section */}
                        {sectionEntities.length === 0 ? (
                          <div className="p-4 rounded-xl border border-dashed border-stone-200 text-center bg-stone-50/50 space-y-2">
                            <p className="text-xs text-stone-400 italic">Belum ada card di section "{cat}".</p>
                            <button
                              onClick={() => handleStartNewEntity(cat)}
                              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Tambah card pertama di {cat}</span>
                            </button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {sectionEntities.map((item) => (
                              <div
                                key={item.id}
                                className="bg-stone-50/80 rounded-2xl p-4 border border-stone-200 hover:border-emerald-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                              >
                                <div className="space-y-2">
                                  <div className="flex items-start justify-between gap-2">
                                    <span className="bg-white text-stone-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-stone-200">
                                      {item.category}
                                    </span>
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={() => handleDuplicateEntity(item)}
                                        className="p-1 hover:bg-stone-200 text-stone-500 rounded-md"
                                        title="Salin Entitas Ini"
                                      >
                                        <Copy className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteEntity(item.id, item.name)}
                                        className="p-1 hover:bg-red-50 text-red-600 rounded-md"
                                        title="Hapus Entitas"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-12 h-12 rounded-xl object-cover border border-stone-200 flex-shrink-0 bg-white"
                                    />
                                    <div>
                                      <h5 className="font-bold text-stone-900 text-sm leading-snug line-clamp-1">
                                        {item.name}
                                      </h5>
                                      <p className="text-[11px] text-stone-500 line-clamp-1">
                                        CTA: {item.ctaWording || 'Kunjungi Tautan'}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="pt-2 border-t border-stone-200/70 flex items-center justify-between">
                                  <span className="text-[10px] text-stone-400">
                                    Diupdate: {new Date(item.updatedAt || Date.now()).toLocaleDateString('id-ID')}
                                  </span>
                                  <button
                                    onClick={() => handleStartEditEntity(item)}
                                    className="flex items-center gap-1 bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-stone-200 hover:border-emerald-300 transition-colors"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Edit Detail</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ANNOUNCEMENTS MANAGER */}
          {activeTab === 'announcements' && (
            <div className="space-y-4">
              {isCreatingAnn || editingAnn ? (
                <form onSubmit={handleSaveAnnouncement} className="bg-white p-5 rounded-2xl border border-stone-200 max-w-2xl mx-auto space-y-4">
                  <h3 className="font-bold text-stone-900 text-base border-b border-stone-100 pb-2">
                    {editingAnn ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}
                  </h3>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Judul Pengumuman *</label>
                    <input
                      type="text"
                      required
                      value={formAnn.title || ''}
                      onChange={(e) => setFormAnn({ ...formAnn, title: e.target.value })}
                      placeholder="Contoh: Jadwal Bazar UMKM Hari Minggu..."
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Kategori</label>
                      <input
                        type="text"
                        value={formAnn.category || 'Umum'}
                        onChange={(e) => setFormAnn({ ...formAnn, category: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Penulis / Sumber</label>
                      <input
                        type="text"
                        value={formAnn.author || 'Pengurus RW 11'}
                        onChange={(e) => setFormAnn({ ...formAnn, author: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Isi Pengumuman</label>
                    <textarea
                      rows={4}
                      value={formAnn.content || ''}
                      onChange={(e) => setFormAnn({ ...formAnn, content: e.target.value })}
                      placeholder="Tuliskan isi pengumuman atau agenda warga secara jelas..."
                      className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Tautan Pendaftaran/CTA (Opsional)</label>
                      <input
                        type="text"
                        value={formAnn.ctaUrl || ''}
                        onChange={(e) => setFormAnn({ ...formAnn, ctaUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Teks Tombol CTA</label>
                      <input
                        type="text"
                        value={formAnn.ctaWording || 'Info Selengkapnya'}
                        onChange={(e) => setFormAnn({ ...formAnn, ctaWording: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
                      />
                    </div>
                  </div>

                  <div className="flex items-center pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800">
                      <input
                        type="checkbox"
                        checked={formAnn.isImportant || false}
                        onChange={(e) => setFormAnn({ ...formAnn, isImportant: e.target.checked })}
                        className="w-4 h-4 text-emerald-600 rounded-md"
                      />
                      <span>Tandai Sebagai Pengumuman Penting</span>
                    </label>
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAnn(null);
                        setIsCreatingAnn(false);
                      }}
                      className="px-4 py-2 text-stone-600 text-xs font-semibold"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-5 py-2 rounded-xl"
                    >
                      Simpan Pengumuman
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200">
                    <h3 className="font-bold text-stone-900 text-base">Pengumuman & Agenda Warga</h3>
                    <button
                      onClick={() => setIsCreatingAnn(true)}
                      className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-4 py-2 rounded-xl"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Buat Pengumuman</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {announcements.map((ann) => (
                      <div
                        key={ann.id}
                        className="bg-white p-4 rounded-2xl border border-stone-200 flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="bg-stone-100 text-stone-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                              {ann.category}
                            </span>
                            <span className="text-stone-400 text-xs">{ann.date}</span>
                          </div>
                          <h4 className="font-bold text-stone-900 text-sm">{ann.title}</h4>
                          <p className="text-stone-600 text-xs line-clamp-2">{ann.content}</p>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingAnn(ann);
                              setFormAnn(ann);
                            }}
                            className="p-1.5 text-stone-600 hover:bg-stone-100 rounded-lg"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAnnouncement(ann.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BACKUP & VERCEL PUBLISH GUIDE */}
          {activeTab === 'backup' && (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Download / Upload Card */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <h3 className="font-bold text-stone-900 text-base border-b border-stone-100 pb-3 flex items-center gap-2">
                  <Download className="w-5 h-5 text-emerald-700" />
                  <span>Ekspor & Impor Backup Data JSON</span>
                </h3>

                <p className="text-stone-600 text-xs leading-relaxed">
                  Semua perubahan yang Anda masukkan tersimpan di browser lokal HP/Laptop Anda. Gunakan opsi di bawah ini untuk mengunduh cadangan data atau memindahkannya ke perangkat lain.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <button
                    onClick={handleExport}
                    className="flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-xs transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download File JSON Backup</span>
                  </button>

                  <label className="flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl cursor-pointer shadow-xs transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Upload File JSON Backup</span>
                    <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
                  </label>
                </div>

                <div className="pt-3 border-t border-stone-100 flex justify-end">
                  <button
                    onClick={handleResetData}
                    className="flex items-center gap-1.5 text-red-600 hover:text-red-700 text-xs font-semibold hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Data ke 13 Entitas Awal PDF</span>
                  </button>
                </div>
              </div>

              {/* Step-by-step Vercel Guide for Non-Coders */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <h3 className="font-bold text-stone-900 text-base border-b border-stone-100 pb-3 flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-amber-600" />
                  <span>Panduan Cara Publish ke Vercel (Gratis & Mudah)</span>
                </h3>

                <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
                  <p className="font-semibold text-stone-900">
                    Aplikasi ini dirancang 100% siap untuk dipublish di Vercel tanpa perlu setup server database khusus:
                  </p>

                  <ol className="list-decimal pl-5 space-y-2">
                    <li>
                      <strong>Ekspor / Export project ke GitHub / ZIP:</strong>
                      <br />
                      Klik menu <em>Settings</em> di pojok kanan atas AI Studio lalu pilih <strong>Export to GitHub</strong> atau <strong>Download ZIP</strong>.
                    </li>
                    <li>
                      <strong>Login ke Vercel:</strong>
                      <br />
                      Buka website <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-emerald-800 font-bold underline">Vercel.com</a>, daftar/login secara gratis menggunakan akun Google/GitHub pengurus.
                    </li>
                    <li>
                      <strong>Import Repository / Upload:</strong>
                      <br />
                      Pilih <strong>"Add New" → "Project"</strong>, lalu hubungkan repository GitHub hasil export tadi.
                    </li>
                    <li>
                      <strong>Deploy:</strong>
                      <br />
                      Sistem Vercel akan mendeteksi framework <em>Vite + React</em> secara otomatis. Klik tombol <strong>"Deploy"</strong> dan tunggu 1 menit hingga website aktif!
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
