import React, { useState, useEffect } from 'react';
import { Entity, Announcement, SiteSettings, NavbarTabConfig, CategoryHeaderConfig, User, UserRole } from '../types';
import {
  X, Plus, Edit3, Trash2, Copy, Download, Upload, RefreshCw, Check,
  Image as ImageIcon, Sparkles, LayoutGrid, Megaphone, HelpCircle,
  Bold, Italic, List, Heading, ExternalLink, ShieldAlert, ArrowLeft,
  GripVertical, ArrowUp, ArrowDown, MapPin, Info, Globe, Sliders, Palette, Eye, EyeOff,
  Users, UserPlus, ShieldCheck, Shield, Lock, LogOut, CheckSquare, Square, Search, User as UserIcon,
  Database, Server, CheckCircle2, XCircle, Terminal, Code, FileText, Vote, Instagram, Save, Youtube, Recycle, Church
} from 'lucide-react';
import { exportDataAsJSON, importDataFromJSON, resetToDefaults, DEFAULT_CATEGORY_CONFIGS } from '../utils/storage';
import { useDragScroll } from '../hooks/useDragScroll';
import { formatImageUrl } from '../utils/imageUrl';
import { BJP_LOGO_URL } from '../assets/logo';
import { CARD_TITLE_MAX_LENGTH, CARD_DESCRIPTION_MAX_LENGTH } from '../constants/defaults';
import { InstagramIcon, FacebookIcon, TikTokIcon, WhatsAppIcon, SocialBadges } from './SocialIcons';
import { CharCounter } from './CharCounter';
import { SecurityScheduleCMS } from './SecurityScheduleCMS';
import { RtRwCMS } from './RtRwCMS';
import { DocumentTemplatesCMS } from './DocumentTemplatesCMS';
import { PollingCMS } from './PollingCMS';
import { MediaPartnersCMS } from './MediaPartnersCMS';
import { VideoCMS } from './VideoCMS';
import { PhotoCMS } from './PhotoCMS';
import { BankSampahCMS } from './BankSampahCMS';
import { DkmMasjidCMS } from './DkmMasjidCMS';
import {
  isSupabaseConfigured,
  testSupabaseConnection,
  SUPABASE_SQL_SETUP_SCRIPT,
  saveUsersToSupabase,
  saveEntitiesToSupabase,
  saveAnnouncementsToSupabase,
  saveSiteSettingsToSupabase,
  fetchUsersFromSupabase,
  fetchEntitiesFromSupabase,
  fetchAnnouncementsFromSupabase,
  fetchSiteSettingsFromSupabase,
} from '../lib/supabase';

interface CMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  entities: Entity[];
  onSaveEntities: (entities: Entity[]) => void;
  announcements: Announcement[];
  onSaveAnnouncements: (announcements: Announcement[]) => void;
  siteSettings: SiteSettings;
  onSaveSiteSettings: (settings: SiteSettings) => void;
  users: User[];
  onSaveUsers: (users: User[]) => void;
  currentUser: User | null;
  onLogout: () => void;
  editingEntityInit?: Entity | null;
  initialCategoryForNewEntity?: string | null;
}

// Preset Images for board members without photo links
const IMAGE_PRESETS = [
  { label: 'Logo BJP.hub Resmi', url: BJP_LOGO_URL },
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
  siteSettings,
  onSaveSiteSettings,
  users,
  onSaveUsers,
  currentUser,
  onLogout,
  editingEntityInit,
  initialCategoryForNewEntity,
}) => {
const [activeTab, setActiveTab] = useState<'entities' | 'announcements' | 'settings' | 'security' | 'rtrw' | 'documents' | 'polling' | 'videos' | 'photos' | 'banksampah' | 'dkmmasjid' | 'users' | 'supabase' | 'backup'>('entities');
  const navTabsRef = useDragScroll<HTMLDivElement>();

  // Supabase State & Handlers
  const [supabaseTesting, setSupabaseTesting] = useState<boolean>(false);
  const [supabaseTestResult, setSupabaseTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [supabaseSyncing, setSupabaseSyncing] = useState<boolean>(false);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  const handleTestSupabase = async () => {
    setSupabaseTesting(true);
    setSupabaseTestResult(null);
    const res = await testSupabaseConnection();
    setSupabaseTestResult(res);
    setSupabaseTesting(false);
  };

  const handlePushToSupabase = async () => {
    if (!isSupabaseConfigured()) {
      alert('Supabase belum dikonfigurasi di environment!');
      return;
    }
    setSupabaseSyncing(true);
    try {
      const resUsers = await saveUsersToSupabase(users);
      const resEnt = await saveEntitiesToSupabase(entities);
      const resAnn = await saveAnnouncementsToSupabase(announcements);
      const resSet = await saveSiteSettingsToSupabase(siteSettings);

      if (resUsers && resEnt && resAnn && resSet) {
        alert('Berhasil mengunggah seluruh data (Pengguna, Komunitas, Pengumuman, Settings) ke Supabase!');
      } else {
        alert('Sebagian data berhasil diunggah. Pastikan seluruh tabel (bjp_users, bjp_entities, bjp_announcements, bjp_site_settings) sudah dibuat di Supabase.');
      }
    } catch (err: any) {
      alert(`Gagal sync data ke Supabase: ${err?.message || 'Unknown error'}`);
    } finally {
      setSupabaseSyncing(false);
    }
  };

  const handlePullFromSupabase = async () => {
    if (!isSupabaseConfigured()) {
      alert('Supabase belum dikonfigurasi!');
      return;
    }
    setSupabaseSyncing(true);
    try {
      const remoteUsers = await fetchUsersFromSupabase();
      const remoteEntities = await fetchEntitiesFromSupabase();
      const remoteAnnouncements = await fetchAnnouncementsFromSupabase();
      const remoteSettings = await fetchSiteSettingsFromSupabase();

      let count = 0;
      if (remoteUsers && remoteUsers.length > 0) {
        onSaveUsers(remoteUsers);
        count++;
      }
      if (remoteEntities && remoteEntities.length > 0) {
        onSaveEntities(remoteEntities);
        count++;
      }
      if (remoteAnnouncements && remoteAnnouncements.length > 0) {
        onSaveAnnouncements(remoteAnnouncements);
        count++;
      }
      if (remoteSettings) {
        onSaveSiteSettings(remoteSettings);
        count++;
      }

      if (count > 0) {
        alert(`Berhasil mengunduh dan memperbarui ${count} kategori data dari Supabase!`);
      } else {
        alert('Tidak ada data baru di Supabase atau tabel belum terisi data.');
      }
    } catch (err: any) {
      alert(`Gagal menarik data dari Supabase: ${err?.message || 'Unknown error'}`);
    } finally {
      setSupabaseSyncing(false);
    }
  };

  const handleCopySqlScript = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP_SCRIPT);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };
  
  // Permission helpers
  const isSuperAdmin = currentUser?.role === 'super_admin';

  const canEditEntity = (entityId: string) => {
    if (!currentUser) return false;
    if (isSuperAdmin) return true;
    return currentUser.allowedEntityIds.includes('*') || currentUser.allowedEntityIds.includes(entityId);
  };

  // Filter entities visible to current user in CMS
  const allowedEntitiesInCMS = isSuperAdmin
    ? entities
    : entities.filter((e) => canEditEntity(e.id));

  const [editingEntity, setEditingEntity] = useState<Entity | null>(editingEntityInit || null);
  const [isCreatingNewEntity, setIsCreatingNewEntity] = useState(false);

  // User Management Local States
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isCreatingUser, setIsCreatingUser] = useState<boolean>(false);
  const [userSearchQuery, setUserSearchQuery] = useState<string>('');
  const [entitySearchFilter, setEntitySearchFilter] = useState<string>('');
  const [showFormPassword, setShowFormPassword] = useState<boolean>(false);
  const [visiblePasswordUserId, setVisiblePasswordUserId] = useState<string | null>(null);

  const [formUser, setFormUser] = useState<{
    name: string;
    username: string;
    password: string;
    role: UserRole;
    allowedEntityIds: string[];
  }>({
    name: '',
    username: '',
    password: '',
    role: 'entity_admin',
    allowedEntityIds: [],
  });

  // Form State for Entity
  const [formEntity, setFormEntity] = useState<Partial<Entity>>({
    name: '',
    category: 'Pusat Hub',
    description: '',
    image: IMAGE_PRESETS[0].url,
    cardType: 'standard',
    ctaUrl: '',
    ctaWording: 'Kunjungi Tautan',
    instagram: '',
    mediaUrl: '',
    contact: '',
    schedule: '',
    address: '',
    infoNotes: '',
    isFeatured: false,
  });

  // Local state for Site Settings (Branding & Navbar Tabs)
  const [tempLogoUrl, setTempLogoUrl] = useState<string>(siteSettings?.logoUrl || BJP_LOGO_URL);
  const [tempSiteTitle, setTempSiteTitle] = useState<string>(siteSettings?.siteTitle || 'BJP.hub Bintara Jaya Permai');
  const [tempSiteDescription, setTempSiteDescription] = useState<string>(siteSettings?.siteDescription || 'Portal Resmi Ekosistem & Kegiatan Warga Komplek Bintara Jaya Permai (RW 11)');
  const [tempNavbarTabs, setTempNavbarTabs] = useState<NavbarTabConfig[]>(
    siteSettings?.navbarTabs || [
      { id: 'entities', label: 'Komunitas Kegiatan', enabled: true, order: 0 },
      { id: 'announcements', label: 'Pengumuman & Agenda', enabled: true, order: 1 },
    ]
  );
  const [tempCategoryConfigs, setTempCategoryConfigs] = useState<CategoryHeaderConfig[]>(
    siteSettings?.categoryConfigs || DEFAULT_CATEGORY_CONFIGS
  );

  useEffect(() => {
    if (siteSettings) {
      setTempLogoUrl(siteSettings.logoUrl || BJP_LOGO_URL);
      setTempSiteTitle(siteSettings.siteTitle || 'BJP.hub Bintara Jaya Permai');
      setTempSiteDescription(siteSettings.siteDescription || 'Portal Resmi Ekosistem & Kegiatan Warga Komplek Bintara Jaya Permai (RW 11)');
      setTempNavbarTabs(
        siteSettings.navbarTabs || [
          { id: 'entities', label: 'Komunitas Kegiatan', enabled: true, order: 0 },
          { id: 'announcements', label: 'Pengumuman & Agenda', enabled: true, order: 1 },
        ]
      );
      setTempCategoryConfigs(siteSettings.categoryConfigs || DEFAULT_CATEGORY_CONFIGS);
    }
  }, [siteSettings, isOpen]);

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
    image: '',
  });

  const [notification, setNotification] = useState<string | null>(null);

  // Product Photos 5 slots state
  const [isProductPhotosEnabled, setIsProductPhotosEnabled] = useState<boolean>(false);
  const [photoSlot1, setPhotoSlot1] = useState<string>('');
  const [photoSlot2, setPhotoSlot2] = useState<string>('');
  const [photoSlot3, setPhotoSlot3] = useState<string>('');
  const [photoSlot4, setPhotoSlot4] = useState<string>('');
  const [photoSlot5, setPhotoSlot5] = useState<string>('');

  // Product Photo Captions 5 slots state
  const [photoCaption1, setPhotoCaption1] = useState<string>('');
  const [photoCaption2, setPhotoCaption2] = useState<string>('');
  const [photoCaption3, setPhotoCaption3] = useState<string>('');
  const [photoCaption4, setPhotoCaption4] = useState<string>('');
  const [photoCaption5, setPhotoCaption5] = useState<string>('');

  // Product Photo Years 5 slots state (used to group photos by year on the Dokumentasi page)
  const [photoYear1, setPhotoYear1] = useState<string>('');
  const [photoYear2, setPhotoYear2] = useState<string>('');
  const [photoYear3, setPhotoYear3] = useState<string>('');
  const [photoYear4, setPhotoYear4] = useState<string>('');
  const [photoYear5, setPhotoYear5] = useState<string>('');

  const [photoError, setPhotoError] = useState<string | null>(null);

  // Drag & drop sorting for announcements
  const [draggedAnnIndex, setDraggedAnnIndex] = useState<number | null>(null);

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
      description: 'Deskripsi singkat mengenai komunitas atau kegiatan warga komplek...',
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
    setIsProductPhotosEnabled(false);
    setPhotoSlot1(''); setPhotoCaption1(''); setPhotoYear1('');
    setPhotoSlot2(''); setPhotoCaption2(''); setPhotoYear2('');
    setPhotoSlot3(''); setPhotoCaption3(''); setPhotoYear3('');
    setPhotoSlot4(''); setPhotoCaption4(''); setPhotoYear4('');
    setPhotoSlot5(''); setPhotoCaption5(''); setPhotoYear5('');
    setPhotoError(null);
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

      const photos = editingEntityInit.productPhotos || [];
      const captions = editingEntityInit.productPhotoCaptions || [];
      const years = editingEntityInit.productPhotoYears || [];
      setIsProductPhotosEnabled(photos.length > 0);
      setPhotoSlot1(photos[0] || ''); setPhotoCaption1(captions[0] || ''); setPhotoYear1(years[0] || '');
      setPhotoSlot2(photos[1] || ''); setPhotoCaption2(captions[1] || ''); setPhotoYear2(years[1] || '');
      setPhotoSlot3(photos[2] || ''); setPhotoCaption3(captions[2] || ''); setPhotoYear3(years[2] || '');
      setPhotoSlot4(photos[3] || ''); setPhotoCaption4(captions[3] || ''); setPhotoYear4(years[3] || '');
      setPhotoSlot5(photos[4] || ''); setPhotoCaption5(captions[4] || ''); setPhotoYear5(years[4] || '');
      setPhotoError(null);

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

    const photos = ent.productPhotos || [];
    const captions = ent.productPhotoCaptions || [];
    const years = ent.productPhotoYears || [];
    setIsProductPhotosEnabled(photos.length > 0);
    setPhotoSlot1(photos[0] || ''); setPhotoCaption1(captions[0] || ''); setPhotoYear1(years[0] || '');
    setPhotoSlot2(photos[1] || ''); setPhotoCaption2(captions[1] || ''); setPhotoYear2(years[1] || '');
    setPhotoSlot3(photos[2] || ''); setPhotoCaption3(captions[2] || ''); setPhotoYear3(years[2] || '');
    setPhotoSlot4(photos[3] || ''); setPhotoCaption4(captions[3] || ''); setPhotoYear4(years[3] || '');
    setPhotoSlot5(photos[4] || ''); setPhotoCaption5(captions[4] || ''); setPhotoYear5(years[4] || '');
    setPhotoError(null);
  };

  const handleSaveEntity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEntity.name?.trim()) {
      alert('Nama komunitas wajib diisi!');
      return;
    }

    // Validate Product Photos if Toggle is ON
    let finalPhotos: string[] = [];
    let finalCaptions: string[] = [];
    let finalYears: string[] = [];
    if (isProductPhotosEnabled) {
      if (!photoSlot1.trim()) {
        setPhotoError('Mohon isi minimal Gambar 1 (URL Gambar / Google Drive) karena fitur Foto Produk diaktifkan!');
        return;
      }
      const rawPairs = [
        { url: photoSlot1.trim(), caption: photoCaption1.trim(), year: photoYear1.trim() },
        { url: photoSlot2.trim(), caption: photoCaption2.trim(), year: photoYear2.trim() },
        { url: photoSlot3.trim(), caption: photoCaption3.trim(), year: photoYear3.trim() },
        { url: photoSlot4.trim(), caption: photoCaption4.trim(), year: photoYear4.trim() },
        { url: photoSlot5.trim(), caption: photoCaption5.trim(), year: photoYear5.trim() },
      ].filter((p) => Boolean(p.url));

      finalPhotos = rawPairs.map((p) => p.url);
      finalCaptions = rawPairs.map((p) => p.caption);
      finalYears = rawPairs.map((p) => p.year);
    }
    setPhotoError(null);

    const now = new Date().toISOString();
    const updatedEntityData = {
      ...formEntity,
      productPhotos: finalPhotos,
      productPhotoCaptions: finalCaptions,
      productPhotoYears: finalYears,
    };

    if (editingEntity) {
      // Update existing
      const updated = entities.map((item) =>
        item.id === editingEntity.id
          ? ({
              ...item,
              ...updatedEntityData,
              updatedAt: now,
            } as Entity)
          : item
      );
      onSaveEntities(updated);
      showToast(`Komunitas "${formEntity.name}" berhasil diperbarui!`);
    } else {
      // Create new
      const newEnt: Entity = {
        id: `ent-${Date.now()}`,
        name: formEntity.name || 'Komunitas Baru',
        category: formEntity.category || 'Pusat Hub',
        description: formEntity.description || '',
        image: formEntity.image || IMAGE_PRESETS[0].url,
        ctaUrl: formEntity.ctaUrl || '#',
        ctaWording: formEntity.ctaWording || 'Kunjungi Tautan',
        instagram: formEntity.instagram || '',
        mediaUrl: formEntity.mediaUrl || '',
        contact: formEntity.contact || '',
        schedule: formEntity.schedule || '',
        address: formEntity.address || '',
        infoNotes: formEntity.infoNotes || '',
        isFeatured: formEntity.isFeatured || false,
        cardType: formEntity.cardType || 'standard',
        productPhotos: finalPhotos,
        productPhotoCaptions: finalCaptions,
        productPhotoYears: finalYears,
        createdAt: now,
        updatedAt: now,
      };
      onSaveEntities([newEnt, ...entities]);
      showToast(`Komunitas "${newEnt.name}" berhasil ditambahkan!`);

      // If current user is entity_admin, automatically append permission for this new entity
      if (!isSuperAdmin && currentUser) {
        const updatedUser: User = {
          ...currentUser,
          allowedEntityIds: Array.from(new Set([...(currentUser.allowedEntityIds || []), newEnt.id])),
        };
        const updatedUsersList = users.map((u) => (u.id === currentUser.id ? updatedUser : u));
        onSaveUsers(updatedUsersList);
      }
    }

    setEditingEntity(null);
    setIsCreatingNewEntity(false);
  };

  const handleDeleteEntity = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus komunitas "${name}"?`)) {
      const filtered = entities.filter((item) => item.id !== id);
      onSaveEntities(filtered);
      showToast(`Komunitas "${name}" berhasil dihapus.`);
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

  // ANNOUNCEMENT CRUD & REORDER HANDLERS
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
        date: formAnn.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        ctaUrl: formAnn.ctaUrl || '',
        ctaWording: formAnn.ctaWording || 'Info Selengkapnya',
        isImportant: formAnn.isImportant || false,
        image: formAnn.image || '',
        order: announcements.length,
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

  const handleMoveAnnouncement = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= announcements.length) return;

    const updated = [...announcements];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    onSaveAnnouncements(updated);
    showToast('Urutan pengumuman berhasil diperbarui!');
  };

  const handleAnnDragStart = (index: number) => {
    setDraggedAnnIndex(index);
  };

  const handleAnnDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleAnnDrop = (dropIndex: number) => {
    if (draggedAnnIndex === null || draggedAnnIndex === dropIndex) return;

    const updated = [...announcements];
    const [removed] = updated.splice(draggedAnnIndex, 1);
    updated.splice(dropIndex, 0, removed);

    setDraggedAnnIndex(null);
    onSaveAnnouncements(updated);
    showToast('Urutan pengumuman berhasil disesuaikan!');
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
    if (confirm('RESET DATA: Apakah Anda ingin mengembalikan seluruh data ke 13 Komunitas Awal dari PDF? Seluruh perubahan lokal akan ditimpa.')) {
      const res = resetToDefaults();
      onSaveEntities(res.entities);
      onSaveAnnouncements(res.announcements);
      showToast('Data berhasil di-reset ke 13 Komunitas Awal PDF!');
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

  // USER MANAGEMENT HANDLERS
  const handleStartNewUser = () => {
    setEditingUser(null);
    setIsCreatingUser(true);
    setFormUser({
      name: '',
      username: '',
      password: 'Bjp' + Math.floor(100 + Math.random() * 900) + '!',
      role: 'entity_admin',
      allowedEntityIds: [],
    });
    setShowFormPassword(true);
    setEntitySearchFilter('');
  };

  const handleStartEditUser = (u: User) => {
    setEditingUser(u);
    setIsCreatingUser(false);
    setFormUser({
      name: u.name,
      username: u.username,
      password: u.password,
      role: u.role,
      allowedEntityIds: u.allowedEntityIds || [],
    });
    setShowFormPassword(true);
    setEntitySearchFilter('');
  };

  const handleSaveUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUser.name.trim() || !formUser.username.trim() || !formUser.password.trim()) {
      alert('Nama lengkap, username, dan password wajib diisi!');
      return;
    }

    const cleanUsername = formUser.username.trim().toLowerCase();
    const isDuplicate = users.some(
      (u) => u.id !== editingUser?.id && u.username.toLowerCase() === cleanUsername
    );

    if (isDuplicate) {
      alert(`Username "@${cleanUsername}" sudah digunakan oleh akun lain. Silakan gunakan username lain.`);
      return;
    }

    const finalAllowedIds =
      formUser.role === 'super_admin' ? ['*'] : formUser.allowedEntityIds;

    const now = new Date().toISOString();

    if (editingUser) {
      const updatedList = users.map((u) =>
        u.id === editingUser.id
          ? {
              ...u,
              name: formUser.name.trim(),
              username: cleanUsername,
              password: formUser.password,
              role: formUser.role,
              allowedEntityIds: finalAllowedIds,
            }
          : u
      );
      onSaveUsers(updatedList);
      showToast(`Akun pengurus "@${cleanUsername}" berhasil diperbarui!`);
    } else {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: formUser.name.trim(),
        username: cleanUsername,
        password: formUser.password,
        role: formUser.role,
        allowedEntityIds: finalAllowedIds,
        createdAt: now,
      };
      onSaveUsers([newUser, ...users]);
      showToast(`Akun pengurus baru "@${cleanUsername}" berhasil dibuat!`);
    }

    setEditingUser(null);
    setIsCreatingUser(false);
  };

  const handleDeleteUser = (userId: string, targetUsername: string) => {
    if (userId === currentUser?.id) {
      alert('Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif.');
      return;
    }
    if (targetUsername === 'admin') {
      alert('Akun Super Admin bawaan sistem (@admin) tidak dapat dihapus.');
      return;
    }
    if (confirm(`Apakah Anda yakin ingin menghapus akun pengurus "@${targetUsername}"?`)) {
      const updated = users.filter((u) => u.id !== userId);
      onSaveUsers(updated);
      showToast(`Akun "@${targetUsername}" berhasil dihapus.`);
    }
  };

  const toggleEntityPermissionInForm = (entityId: string) => {
    if (formUser.allowedEntityIds.includes(entityId)) {
      setFormUser({
        ...formUser,
        allowedEntityIds: formUser.allowedEntityIds.filter((id) => id !== entityId),
      });
    } else {
      setFormUser({
        ...formUser,
        allowedEntityIds: [...formUser.allowedEntityIds, entityId],
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/80 backdrop-blur-md animate-fade-in">
      <div className="bg-stone-50 rounded-2xl w-full max-w-5xl h-[92vh] flex flex-col shadow-lg border border-stone-300 overflow-hidden relative">

        {/* Toast Notification */}
        {notification && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-800 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-lg border border-emerald-600 flex items-center gap-2 animate-bounce">
            <Check className="w-4 h-4 text-emerald-300" />
            <span>{notification}</span>
          </div>
        )}

        {/* Header Bar */}
        <div className="bg-stone-900 text-white p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <img
              src={BJP_LOGO_URL}
              alt="BJP.hub"
              className="w-10 h-10 rounded-md object-cover border border-amber-400/50 shadow-xs shrink-0"
            />
            <div>
              <h2 className="font-bold text-base sm:text-lg tracking-tight">
                CMS Pengurus Komplek Bintara Jaya Permai (RW 11)
              </h2>
              {currentUser && (
                <div className="flex items-center gap-2 mt-0.5 text-xs text-stone-300 flex-wrap">
                  <span className="font-semibold text-amber-300 flex items-center gap-1">
                    <UserIcon className="w-3.5 h-3.5 text-amber-400" />
                    {currentUser.name} (@{currentUser.username})
                  </span>
                  <span className="text-stone-500">•</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] sm:text-[11px] ${
                    isSuperAdmin ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-blue-950 text-blue-300 border border-blue-800'
                  }`}>
                    {isSuperAdmin ? 'Super Admin (Akses Penuh)' : `Admin Komunitas (${allowedEntitiesInCMS.length} Komunitas)`}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleExport}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold border border-stone-700 transition-colors"
              title="Download Backup File JSON Data"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Backup JSON</span>
            </button>

            {currentUser && (
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/80 hover:bg-red-900 text-red-200 rounded-lg text-xs font-semibold border border-red-800/80 transition-colors"
                title="Keluar dari Akun CMS"
              >
                <LogOut className="w-3.5 h-3.5 text-red-300" />
                <span>Keluar</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors"
              title="Tutup CMS"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div ref={navTabsRef} className="bg-white border-b border-stone-200 px-4 pt-3 flex items-center gap-2 overflow-x-auto no-scrollbar cursor-grab select-none">
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
            <span>
              Kelola Komunitas Kegiatan ({isSuperAdmin ? entities.length : `${allowedEntitiesInCMS.length}/${entities.length}`})
            </span>
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
            onClick={() => {
              setActiveTab('settings');
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-700" />
            <span>Logo Web & Tab Navbar</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('security');
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Shield className="w-4 h-4 text-emerald-700" />
            <span>Jadwal Keamanan</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('rtrw');
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'rtrw'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <MapPin className="w-4 h-4 text-emerald-700" />
            <span>Informasi RT/RW</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('documents');
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'documents'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>Layanan Surat Online</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('polling');
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'polling'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Vote className="w-4 h-4 text-emerald-700" />
            <span>Polling & Aspirasi</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('videos');
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'videos'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Youtube className="w-4 h-4 text-red-600" />
            <span>Video Kegiatan</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('photos');
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'photos'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-emerald-700" />
            <span>Foto Kegiatan</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('banksampah');
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'banksampah'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Recycle className="w-4 h-4 text-emerald-700" />
            <span>Bank Sampah KMS</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('dkmmasjid');
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'dkmmasjid'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Church className="w-4 h-4 text-emerald-700" />
            <span>DKM Masjid</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('users');
              setEditingUser(null);
              setIsCreatingUser(false);
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-700" />
            <span>Manajemen Akun ({users.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('supabase');
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'supabase'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-700" />
            <span>Integrasi Supabase DB</span>
            {isSupabaseConfigured() ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Supabase Terhubung"></span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-400" title="Supabase Belum Dikonfigurasi"></span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('backup');
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'backup'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>Backup & Restore Data JSON</span>
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
                    <span>Kembali ke Daftar Komunitas</span>
                  </button>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* FORM INPUTS (LEFT) */}
                    <form onSubmit={handleSaveEntity} className="lg:col-span-7 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                        <h3 className="font-bold text-stone-900 text-base">
                          {editingEntity ? `Edit: ${editingEntity.name}` : 'Tambah Komunitas / Unit Baru'}
                        </h3>
                        <span className="text-xs text-stone-400">Semua field mudah disesuaikan</span>
                      </div>

                      {/* Title */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-stone-700">1. Nama Komunitas / Unit Kegiatan *</label>
                          <CharCounter value={formEntity.name} max={CARD_TITLE_MAX_LENGTH} />
                        </div>
                        <input
                          type="text"
                          required
                          maxLength={CARD_TITLE_MAX_LENGTH}
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
                      </div>

                      {/* Image Picker with Presets */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-700 flex flex-wrap items-center justify-between gap-1">
                          <span>3. URL Foto / Gambar Utama Banner</span>
                          <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Rekomendasi HD: 1200 x 675 px (Rasio 16:9)
                          </span>
                        </label>
                        <input
                          type="text"
                          value={formEntity.image || ''}
                          onChange={(e) => setFormEntity({ ...formEntity, image: e.target.value })}
                          placeholder="https://drive.google.com/file/d/.../view atau https://images.unsplash.com/..."
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                        />

                        {/* Main Image Preview */}
                        {formEntity.image && (
                          <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-stone-200 shadow-2xs">
                            <div className="w-16 h-12 bg-stone-100 rounded-lg overflow-hidden border border-stone-200 flex-shrink-0">
                              <img
                                src={formatImageUrl(formEntity.image)}
                                alt="Preview Gambar Utama"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80';
                                }}
                              />
                            </div>
                            <div className="text-[11px] text-stone-600">
                              <span className="font-semibold block text-stone-800">Preview Gambar Utama</span>
                              {formEntity.image.includes('drive.google.com') ? (
                                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                                  ✓ Google Drive Link Terdeteksi (Konversi Otomatis Active)
                                </span>
                              ) : (
                                <span>URL Gambar Siap Tampil</span>
                              )}
                            </div>
                          </div>
                        )}

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
                                className={`text-[10px] py-2 px-1.5 rounded-lg border text-left truncate transition-all ${
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
                          placeholder="Jelaskan mengenai komunitas kegiatan ini, fungsi utama, dan jadwal warga..."
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

                      {/* Extra Meta (4 Optional Fields: Jam Buka, Telepon, Alamat, Info Lainnya) */}
                      <div className="border-t border-stone-200 pt-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                            Informasi Tambahan (Semua Field Opsional)
                          </h4>
                          <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md border border-stone-200">
                            Opsional
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Jam Buka / Operasional */}
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Jam Buka / Operasional (Opsional)</span>
                            </label>
                            <input
                              type="text"
                              value={formEntity.schedule || ''}
                              onChange={(e) => setFormEntity({ ...formEntity, schedule: e.target.value })}
                              placeholder="Contoh: Senin - Sabtu (08.00 - 17.00 WIB)"
                              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                            />
                          </div>

                          {/* Telepon / No. HP / Kontak */}
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Telepon / Kontak WA (Opsional)</span>
                            </label>
                            <input
                              type="text"
                              value={formEntity.contact || ''}
                              onChange={(e) => setFormEntity({ ...formEntity, contact: e.target.value })}
                              placeholder="Contoh: 0812-3456-7890"
                              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                            />
                          </div>

                          {/* Alamat Lokasi */}
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Alamat Lokasi (Opsional)</span>
                            </label>
                            <input
                              type="text"
                              value={formEntity.address || ''}
                              onChange={(e) => setFormEntity({ ...formEntity, address: e.target.value })}
                              placeholder="Contoh: Jl. Utama Komplek Bintara Jaya Permai Blok A No. 12"
                              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                            />
                          </div>

                          {/* Catatan / Info Lainnya */}
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                              <Info className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Info Lainnya / Catatan (Opsional)</span>
                            </label>
                            <input
                              type="text"
                              value={formEntity.infoNotes || ''}
                              onChange={(e) => setFormEntity({ ...formEntity, infoNotes: e.target.value })}
                              placeholder="Contoh: Melayani pengantaran area RW 11 & sekitar"
                              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Photo Album Card Type Toggle */}
                      <div className="border-t border-stone-200 pt-4">
                        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-emerald-700" />
                            <div>
                              <h4 className="text-xs font-bold text-stone-800">
                                Tampilkan sebagai Kartu Album Foto (Carousel)
                              </h4>
                              <p className="text-[11px] text-stone-500">
                                Kartu di grid akan menampilkan carousel foto otomatis memakai foto pada bagian "Foto Produk & Galeri Usaha" di bawah ini.
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setFormEntity({
                                ...formEntity,
                                cardType: formEntity.cardType === 'photo_album' ? 'standard' : 'photo_album',
                              })
                            }
                            className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                              formEntity.cardType === 'photo_album' ? 'bg-emerald-600' : 'bg-stone-300'
                            }`}
                          >
                            <span
                              className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                                formEntity.cardType === 'photo_album' ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Product / Gallery Photos Section with Toggle & 5 Fields */}
                      <div className="border-t border-stone-200 pt-4 space-y-3">
                        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                            <div className="flex items-center gap-2">
                              <ImageIcon className="w-4 h-4 text-emerald-700" />
                              <div>
                                <h4 className="text-xs font-bold text-stone-800">
                                  Foto Produk & Galeri Usaha (Maksimal 5 Gambar)
                                </h4>
                                <p className="text-[11px] text-stone-500">
                                  Mendukung URL gambar langsung atau link publik Google Drive.
                                </p>
                              </div>
                            </div>

                            {/* Toggle Switch ON/OFF */}
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-semibold ${isProductPhotosEnabled ? 'text-emerald-700' : 'text-stone-400'}`}>
                                {isProductPhotosEnabled ? 'Aktif' : 'Nonaktif'}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const next = !isProductPhotosEnabled;
                                  setIsProductPhotosEnabled(next);
                                  setPhotoError(null);
                                }}
                                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                                  isProductPhotosEnabled ? 'bg-emerald-600' : 'bg-stone-300'
                                }`}
                              >
                                <span
                                  className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                                    isProductPhotosEnabled ? 'translate-x-4' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                            </div>
                          </div>

                          {/* Error Banner */}
                          {photoError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 p-2.5 rounded-lg text-xs font-semibold flex items-center gap-2">
                              <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
                              <span>{photoError}</span>
                            </div>
                          )}

                          {isProductPhotosEnabled ? (
                            <div className="space-y-3 pt-1">
                              <p className="text-[11px] text-amber-800 bg-amber-50/80 border border-amber-200 p-2.5 rounded-lg flex items-start gap-1.5 font-medium">
                                <span>⚠️</span>
                                <span>
                                  Karena fitur Foto Produk diaktifkan, Anda <strong>wajib mengisi Gambar 1</strong>. Gambar 2 s/d 5 bersifat opsional.
                                </span>
                              </p>

                              {/* 5 Photo Input Slots with Captions & Year */}
                              {[
                                { label: 'Gambar 1', value: photoSlot1, onChange: setPhotoSlot1, caption: photoCaption1, onCaptionChange: setPhotoCaption1, year: photoYear1, onYearChange: setPhotoYear1, isRequired: true },
                                { label: 'Gambar 2', value: photoSlot2, onChange: setPhotoSlot2, caption: photoCaption2, onCaptionChange: setPhotoCaption2, year: photoYear2, onYearChange: setPhotoYear2, isRequired: false },
                                { label: 'Gambar 3', value: photoSlot3, onChange: setPhotoSlot3, caption: photoCaption3, onCaptionChange: setPhotoCaption3, year: photoYear3, onYearChange: setPhotoYear3, isRequired: false },
                                { label: 'Gambar 4', value: photoSlot4, onChange: setPhotoSlot4, caption: photoCaption4, onCaptionChange: setPhotoCaption4, year: photoYear4, onYearChange: setPhotoYear4, isRequired: false },
                                { label: 'Gambar 5', value: photoSlot5, onChange: setPhotoSlot5, caption: photoCaption5, onCaptionChange: setPhotoCaption5, year: photoYear5, onYearChange: setPhotoYear5, isRequired: false },
                              ].map((slot, idx) => (
                                <div key={idx} className="bg-white p-3 rounded-xl border border-stone-200 space-y-2">
                                  <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                                    <span className="flex items-center gap-1.5">
                                      <span>{slot.label}</span>
                                      {slot.isRequired ? (
                                        <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-semibold">* Wajib Input</span>
                                      ) : (
                                        <span className="text-[10px] text-stone-400 font-normal">(Opsional)</span>
                                      )}
                                    </span>
                                    {slot.value && slot.value.includes('drive.google.com') && (
                                      <span className="text-[10px] text-emerald-700 font-medium">✓ Google Drive Link</span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={slot.value}
                                      onChange={(e) => {
                                        slot.onChange(e.target.value);
                                        if (photoError) setPhotoError(null);
                                      }}
                                      placeholder={`URL ${slot.label} (contoh: https://drive.google.com/file/d/.../view)`}
                                      className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                                    />

                                    {slot.value && (
                                      <div className="w-12 h-10 bg-stone-100 rounded-lg overflow-hidden border border-stone-200 flex-shrink-0">
                                        <img
                                          src={formatImageUrl(slot.value)}
                                          alt={`Preview ${slot.label}`}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                              'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80';
                                          }}
                                        />
                                      </div>
                                    )}
                                  </div>

                                  {/* Optional Caption & Year Fields */}
                                  <div className="pt-1 flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={slot.caption}
                                      onChange={(e) => slot.onCaptionChange(e.target.value)}
                                      placeholder={`Keterangan / Deskripsi ${slot.label} (Opsional, contoh: Paket Hemat Nasi Kebuli Spesial)`}
                                      className="flex-1 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                                    />
                                    <input
                                      type="number"
                                      value={slot.year}
                                      onChange={(e) => slot.onYearChange(e.target.value)}
                                      placeholder="Tahun"
                                      min={2000}
                                      max={2100}
                                      className="w-20 shrink-0 px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-stone-400 italic">
                              Fitur foto produk saat ini nonaktif. Aktifkan toggle di atas jika Anda ingin menginput galeri foto produk untuk komunitas ini.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Submit Actions */}
                      <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingEntity(null);
                            setIsCreatingNewEntity(false);
                          }}
                          className="px-4 py-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-sm font-semibold rounded-lg transition-colors"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          Simpan
                        </button>
                      </div>
                    </form>

                    {/* LIVE PREVIEW (RIGHT) */}
                    <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3 lg:sticky lg:top-0">
                      <div className="flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-wider border-b border-stone-100 pb-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Pratinjau Kartu (Live Preview)</span>
                      </div>

                      {/* Mock Card */}
                      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden space-y-3">
                        <div className="relative h-40 bg-stone-100">
                          <img
                            src={formatImageUrl(formEntity.image) || IMAGE_PRESETS[0].url}
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
                            {formEntity.name || 'Nama Komunitas Kegiatan'}
                          </div>
                        </div>

                        <div className="p-3 space-y-2">
                          <p className="text-stone-600 text-xs line-clamp-3">
                            {(formEntity.description || '').replace(/<[^>]*>?/gm, '') || 'Deskripsi komunitas...'}
                          </p>

                          {/* Live Product Photos Gallery Preview */}
                          {isProductPhotosEnabled && photoSlot1 && (
                            <div className="pt-2 border-t border-stone-100 space-y-1.5">
                              <div className="text-[10px] font-bold text-stone-700 flex items-center gap-1">
                                <ImageIcon className="w-3 h-3 text-emerald-700" />
                                <span>Pratinjau Foto Produk & Captions:</span>
                              </div>
                              <div className="grid grid-cols-2 gap-1.5">
                                {[
                                  { url: photoSlot1, caption: photoCaption1 },
                                  { url: photoSlot2, caption: photoCaption2 },
                                  { url: photoSlot3, caption: photoCaption3 },
                                  { url: photoSlot4, caption: photoCaption4 },
                                  { url: photoSlot5, caption: photoCaption5 },
                                ].filter(p => Boolean(p.url)).map((p, idx) => (
                                  <div key={idx} className="bg-stone-50 rounded-lg overflow-hidden border border-stone-200">
                                    <div className="aspect-square bg-stone-100">
                                      <img
                                        src={formatImageUrl(p.url)}
                                        alt={p.caption || `Foto ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    {p.caption && (
                                      <p className="p-1 text-[9px] text-stone-700 font-medium line-clamp-2 bg-white border-t border-stone-100 leading-tight">
                                        {p.caption}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

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
                        💡 <strong>Tips Pengurus:</strong> Setelah selesai menambah atau mengubah komunitas, jangan lupa klik <strong>"Simpan Komunitas Ini"</strong>. Anda dapat mengunduh backup JSON di tab Backup agar data tetap aman saat dipublish ke Vercel!
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* ENTITIES LIST BY SECTION / CATEGORY */
                <div className="space-y-6">
                  {/* Access Restriction Notice Banner if Entity Admin */}
                  {!isSuperAdmin && currentUser && (
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-blue-900 shadow-2xs">
                      <Shield className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold text-blue-950 block text-sm">
                          Mode Akses Terbatas (@{currentUser.username})
                        </strong>
                        <p className="mt-0.5 leading-relaxed text-blue-800">
                          Akun Anda terdaftar sebagai <strong>Admin Komunitas</strong>. Anda memiliki wewenang khusus untuk mengedit <strong>{allowedEntitiesInCMS.length} komunitas</strong> berikut. Jika Anda menambah card baru, hak akses akan otomatis diberikan kepada Anda.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                    <div>
                      <h3 className="font-bold text-stone-900 text-base">
                        Kelola Komunitas & Card Per Section ({isSuperAdmin ? `${entities.length} Card Total` : `${allowedEntitiesInCMS.length} Dari ${entities.length} Card Dikelola`})
                      </h3>
                      <p className="text-xs text-stone-500">Anda dapat menambah card baru di setiap section atau mengedit card yang memiliki hak akses.</p>
                    </div>

                    <button
                      onClick={() => handleStartNewEntity()}
                      className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Card Baru</span>
                    </button>
                  </div>

                  {/* Grouped by Section Category */}
                  {CATEGORY_PRESETS.map((cat) => {
                    const sectionEntities = allowedEntitiesInCMS.filter(
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
                                        title="Salin Komunitas Ini"
                                      >
                                        <Copy className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteEntity(item.id, item.name)}
                                        className="p-1 hover:bg-red-50 text-red-600 rounded-md"
                                        title="Hapus Komunitas"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <img
                                      src={formatImageUrl(item.image)}
                                      alt={item.name}
                                      className="w-12 h-12 rounded-xl object-cover border border-stone-200 flex-shrink-0 bg-white"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                          'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80';
                                      }}
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
                                    className="flex items-center gap-1 bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-200 hover:border-emerald-300 transition-colors"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Edit</span>
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
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-stone-700">Judul Pengumuman *</label>
                      <CharCounter value={formAnn.title} max={CARD_TITLE_MAX_LENGTH} />
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={CARD_TITLE_MAX_LENGTH}
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

                  {/* Banner Image URL & Dimension Note */}
                  <div className="space-y-1.5 pt-1 border-t border-stone-100">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-stone-700">URL Gambar Banner Pengumuman (Opsional)</label>
                      {formAnn.image && formAnn.image.includes('drive.google.com') && (
                        <span className="text-[10px] text-emerald-700 font-medium font-sans">✓ Google Drive Link</span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={formAnn.image || ''}
                      onChange={(e) => setFormAnn({ ...formAnn, image: e.target.value })}
                      placeholder="Contoh: https://drive.google.com/file/d/.../view atau https://..."
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 font-mono"
                    />
                    <p className="text-[11px] text-stone-500 font-medium leading-relaxed">
                      💡 <strong>Rekomendasi Ukuran Banner:</strong> 1200 x 600 px (Rasio 2:1 atau 16:9) agar gambar terlihat tajam, presisi, dan tidak terpotong.
                    </p>

                    {formAnn.image && (
                      <div className="mt-2 rounded-xl overflow-hidden border border-stone-200 aspect-[2/1] bg-stone-100 relative max-h-44">
                        <img
                          src={formatImageUrl(formAnn.image)}
                          alt="Preview Banner Pengumuman"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                        <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-md backdrop-blur-xs">
                          Preview Banner (1200 x 600 px)
                        </div>
                      </div>
                    )}
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
                      className="px-4 py-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-sm font-semibold rounded-lg transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Simpan
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                    <div>
                      <h3 className="font-bold text-stone-900 text-base">Kelola & Urutkan Pengumuman Warga ({announcements.length})</h3>
                      <p className="text-xs text-stone-500">Tarik ikon pegangan (Drag & Drop) atau gunakan tombol panah untuk mengubah urutan posisi pengumuman.</p>
                    </div>
                    <button
                      onClick={() => setIsCreatingAnn(true)}
                      className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Pengumuman Baru</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {announcements.map((ann, idx) => (
                      <div
                        key={ann.id}
                        draggable
                        onDragStart={() => handleAnnDragStart(idx)}
                        onDragOver={handleAnnDragOver}
                        onDrop={() => handleAnnDrop(idx)}
                        className={`bg-white p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                          draggedAnnIndex === idx
                            ? 'border-emerald-500 bg-emerald-50/40 shadow-lg scale-[1.01]'
                            : 'border-stone-200 hover:border-stone-300 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-start sm:items-center gap-3 w-full sm:w-auto flex-1">
                          {/* Drag Handle & Position Index */}
                          <div className="flex flex-col sm:flex-row items-center gap-1.5 shrink-0 text-stone-400">
                            <div
                              className="p-1 hover:bg-stone-100 rounded cursor-grab active:cursor-grabbing text-stone-400 hover:text-stone-700"
                              title="Tarik untuk mengubah urutan (Drag and Drop)"
                            >
                              <GripVertical className="w-5 h-5" />
                            </div>

                            {/* Up / Down Move Buttons */}
                            <div className="flex flex-col gap-0.5">
                              <button
                                onClick={() => handleMoveAnnouncement(idx, 'up')}
                                disabled={idx === 0}
                                className={`p-0.5 rounded hover:bg-stone-100 ${
                                  idx === 0 ? 'text-stone-200 cursor-not-allowed' : 'text-stone-600 hover:text-stone-900'
                                }`}
                                title="Pindah Ke Atas"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleMoveAnnouncement(idx, 'down')}
                                disabled={idx === announcements.length - 1}
                                className={`p-0.5 rounded hover:bg-stone-100 ${
                                  idx === announcements.length - 1 ? 'text-stone-200 cursor-not-allowed' : 'text-stone-600 hover:text-stone-900'
                                }`}
                                title="Pindah Ke Bawah"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <span className="text-[10px] font-bold bg-stone-100 text-stone-600 w-5 h-5 rounded-full flex items-center justify-center">
                              {idx + 1}
                            </span>
                          </div>

                          {/* Optional Banner Thumbnail */}
                          {ann.image && (
                            <div className="w-16 h-12 rounded-lg overflow-hidden border border-stone-200 shrink-0 bg-stone-100">
                              <img
                                src={formatImageUrl(ann.image)}
                                alt={ann.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          {/* Announcement Info */}
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="bg-stone-100 text-stone-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                {ann.category}
                              </span>
                              {ann.isImportant && (
                                <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                  Penting
                                </span>
                              )}
                              <span className="text-stone-400 text-xs">{ann.date}</span>
                            </div>
                            <h4 className="font-bold text-stone-900 text-sm leading-snug">{ann.title}</h4>
                            <p className="text-stone-600 text-xs line-clamp-1">{ann.content}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto justify-end">
                          <button
                            onClick={() => {
                              setEditingAnn(ann);
                              setFormAnn(ann);
                            }}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-stone-700 hover:bg-stone-100 rounded-lg text-xs font-semibold border border-stone-200 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteAnnouncement(ann.id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold border border-red-200 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SITE SETTINGS (Logo Web & Tab Navbar) */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl mx-auto pb-6">
              {/* Header Box */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-stone-900 text-base sm:text-lg">
                      Pengaturan Logo Website & Navbar
                    </h3>
                    <p className="text-xs text-stone-500">
                      Kelola idkomunitas visual logo web, Favicon, OG Image, serta posisi dan nama tab navigasi navbar.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 1: Upload Logo Website */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-emerald-700" />
                    <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                      1. Upload Logo Website (Header, Footer, Favicon & OG Meta)
                    </h4>
                  </div>
                  <span className="text-xs bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
                    Satu Logo untuk Semua
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  Logo yang diunggah/diatur di sini akan otomatis diterapkan pada <strong>Header Navbar</strong>, <strong>Footer Website</strong>, <strong>Hero Banner</strong>, <strong>Favicon Tab Browser</strong>, serta <strong>Open Graph (OG Image)</strong> saat link website dibagikan ke WhatsApp / media sosial.
                </p>

                {/* Recommendation Banner */}
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-950">
                  <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold text-emerald-900 block">Rekomendasi Format & Ukuran Logo HD:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px] text-emerald-850">
                      <li><strong>Dimensi Ideal:</strong> <code className="bg-emerald-100 px-1 py-0.2 rounded font-mono font-bold">512 x 512 px</code> atau <code className="bg-emerald-100 px-1 py-0.2 rounded font-mono font-bold">1024 x 1024 px</code> (Rasio 1:1 Persegi).</li>
                      <li><strong>Format File:</strong> PNG Transparan (tanpa background) atau SVG / JPG kualitas tinggi.</li>
                      <li><strong>Tips HD:</strong> Logo resolusi tinggi otomatis akan tampil tajam di seluruh layar Retina, HP, dan Desktop.</li>
                    </ul>
                  </div>
                </div>

                {/* Logo Upload / URL Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {/* Form Controls */}
                  <div className="space-y-4">
                    {/* Option A: Upload File */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-800 block">
                        Upload Gambar dari Komputer:
                      </label>
                      <label className="flex items-center justify-center gap-2 p-3 bg-stone-50 border-2 border-dashed border-stone-300 hover:border-emerald-600 rounded-xl cursor-pointer transition-colors text-xs font-semibold text-stone-700">
                        <Upload className="w-4 h-4 text-emerald-600" />
                        <span>Pilih File Gambar Logo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (evt) => {
                                if (evt.target?.result) {
                                  setTempLogoUrl(evt.target.result as string);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>

                    <div className="relative flex py-1 items-center">
                      <div className="flex-grow border-t border-stone-200"></div>
                      <span className="flex-shrink mx-3 text-[10px] font-bold text-stone-400 uppercase">atau masukan URL</span>
                      <div className="flex-grow border-t border-stone-200"></div>
                    </div>

                    {/* Option B: Direct URL Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-800 block">
                        Tautan URL Gambar / Logo Website:
                      </label>
                      <input
                        type="text"
                        value={tempLogoUrl}
                        onChange={(e) => setTempLogoUrl(e.target.value)}
                        placeholder="https://... / data:image/..."
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                      />
                    </div>

                    {/* Judul Website / Homepage Title */}
                    <div className="space-y-1.5 pt-2 border-t border-stone-200">
                      <label className="text-xs font-bold text-stone-800 block">
                        Judul Utama Website (Home Page Title):
                      </label>
                      <input
                        type="text"
                        value={tempSiteTitle}
                        onChange={(e) => setTempSiteTitle(e.target.value)}
                        placeholder="BJP.hub Bintara Jaya Permai"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    {/* Deskripsi Website / Homepage Description */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-800 block">
                        Deskripsi Penjelasan Homepage:
                      </label>
                      <textarea
                        rows={2}
                        value={tempSiteDescription}
                        onChange={(e) => setTempSiteDescription(e.target.value)}
                        placeholder="Portal Resmi Ekosistem & Kegiatan Warga Komplek Bintara Jaya Permai (RW 11)"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none"
                      />
                    </div>

                    {/* Reset Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setTempLogoUrl(BJP_LOGO_URL);
                        setTempSiteTitle('BJP.hub Bintara Jaya Permai');
                        setTempSiteDescription('Portal Resmi Ekosistem & Kegiatan Warga Komplek Bintara Jaya Permai (RW 11)');
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg border border-stone-200 font-medium transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
                      <span>Kembalikan ke Idkomunitas Default</span>
                    </button>
                  </div>

                  {/* Preview Box */}
                  <div className="bg-stone-900 p-5 rounded-2xl text-white space-y-4 border border-stone-800 shadow-inner">
                    <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" /> Pratinjau Tampilan Logo
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30 font-medium">
                        Live Preview
                      </span>
                    </div>

                    <div className="flex items-center gap-4 bg-stone-800/80 p-3 rounded-xl border border-stone-700">
                      <img
                        src={tempLogoUrl || BJP_LOGO_URL}
                        alt="Pratinjau Logo"
                        className="w-14 h-14 rounded-lg object-cover border border-amber-400/50 shadow-md bg-stone-900"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = BJP_LOGO_URL;
                        }}
                      />
                      <div>
                        <h5 className="font-extrabold text-white text-sm">BJP.hub</h5>
                        <p className="text-[11px] text-stone-400">RW 11 Bintara Jaya Permai</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-[11px] text-stone-300 pt-1">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Favicon Tab Browser</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Header Navbar & Footer Web</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Open Graph Image (WhatsApp Share Preview)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Reposisi & Rename Tab Navbar */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-emerald-700" />
                    <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                      2. Reposisi & Rename Tab Navigasi Navbar
                    </h4>
                  </div>
                  <span className="text-xs bg-amber-50 text-amber-800 font-semibold px-2.5 py-1 rounded-full border border-amber-200">
                    Atur Urutan & Nama Tab
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  Gunakan tombol panah ke atas/bawah untuk <strong>mengatur posisi urutan (reposisi)</strong> dan ubah teks input untuk <strong>mengganti nama (rename)</strong> tab navigasi yang tampil di navbar bagian atas website.
                </p>

                <div className="space-y-3">
                  {[...tempNavbarTabs]
                    .sort((a, b) => a.order - b.order)
                    .map((tab, idx, arr) => (
                      <div
                        key={tab.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-stone-50 rounded-xl border border-stone-200"
                      >
                        {/* Order Buttons */}
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                if (idx === 0) return;
                                const newTabs = [...arr];
                                const tempOrder = newTabs[idx].order;
                                newTabs[idx].order = newTabs[idx - 1].order;
                                newTabs[idx - 1].order = tempOrder;
                                setTempNavbarTabs(newTabs);
                              }}
                              className="p-1 bg-white hover:bg-stone-200 disabled:opacity-30 border border-stone-200 rounded text-stone-700"
                              title="Pindahkan Ke Atas / Lebih Kiri"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === arr.length - 1}
                              onClick={() => {
                                if (idx === arr.length - 1) return;
                                const newTabs = [...arr];
                                const tempOrder = newTabs[idx].order;
                                newTabs[idx].order = newTabs[idx + 1].order;
                                newTabs[idx + 1].order = tempOrder;
                                setTempNavbarTabs(newTabs);
                              }}
                              className="p-1 bg-white hover:bg-stone-200 disabled:opacity-30 border border-stone-200 rounded text-stone-700"
                              title="Pindahkan Ke Bawah / Lebih Kanan"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-800 text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>

                          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                            {tab.id === 'entities' ? 'Tab Komunitas' : 'Tab Pengumuman'}
                          </span>
                        </div>

                        {/* Label Edit Field */}
                        <div className="flex-1 space-y-1">
                          <label className="text-[11px] font-bold text-stone-700 block">
                            Nama Label Tab (Rename):
                          </label>
                          <input
                            type="text"
                            value={tab.label}
                            onChange={(e) => {
                              const newLabel = e.target.value;
                              setTempNavbarTabs(
                                tempNavbarTabs.map((t) =>
                                  t.id === tab.id ? { ...t, label: newLabel } : t
                                )
                              );
                            }}
                            className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                          />
                        </div>

                        {/* Active Toggle */}
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={tab.enabled}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                setTempNavbarTabs(
                                  tempNavbarTabs.map((t) =>
                                    t.id === tab.id ? { ...t, enabled: isChecked } : t
                                  )
                                );
                              }}
                              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                            />
                            <span>Tampilkan Tab</span>
                          </label>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Navbar Live Mockup Preview */}
                <div className="p-4 bg-stone-100 rounded-xl border border-stone-200 space-y-2">
                  <span className="text-xs font-bold text-stone-700 block">
                    Pratinjau Hasil Tampilan Tab Navbar Utama:
                  </span>
                  <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-stone-300 shadow-2xs">
                    {[...tempNavbarTabs]
                      .filter((t) => t.enabled)
                      .sort((a, b) => a.order - b.order)
                      .map((t, index) => (
                        <div
                          key={t.id}
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 ${
                            index === 0
                              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {t.id === 'entities' ? (
                            <LayoutGrid className="w-3.5 h-3.5 text-emerald-700" />
                          ) : (
                            <Megaphone className="w-3.5 h-3.5 text-emerald-700" />
                          )}
                          <span>{t.label}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Section 3: Kelola Logo, Nama Tab & Deskripsi Header per Komunitas / Kategori */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-emerald-700" />
                    <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                      3. Edit Logo Header, Nama Komunitas & Deskripsi per Kategori
                    </h4>
                  </div>
                  <span className="text-xs bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
                    Header & Tab Filter Landing Page
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  Atur logo khusus, ubah nama komunitas (label tab filter navbar), dan sesuaikan deskripsi header yang tampil di atas halaman landing page untuk tiap kategori komunitas.
                </p>

                {/* Recommendation Banner */}
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-950">
                  <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold text-emerald-900 block">Rekomendasi Logo Kategori / Komunitas:</strong>
                    <span className="text-[11px] text-emerald-850 block mt-0.5">
                      Gunakan gambar <strong>Rasio 1:1 (Persegi)</strong> dengan ukuran ideal <strong>512 x 512 px</strong> (PNG Transparan / JPG HD). Logo akan tampil besar, bersih, dan HD di Header Kategori dan Carousel.
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {tempCategoryConfigs.map((catConfig) => (
                    <div
                      key={catConfig.id}
                      className="p-4 sm:p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-4 shadow-2xs"
                    >
                      <div className="flex items-center justify-between border-b border-stone-200/80 pb-2.5">
                        <span className="text-xs font-bold text-stone-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                          Kategori: <strong className="text-emerald-800">{catConfig.name}</strong>
                          <span className="text-[10px] text-stone-400 font-mono font-normal">({catConfig.id})</span>
                        </span>
                        {catConfig.id === 'Sentra Usaha BJP' && (
                          <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full font-bold">
                            Sentra Usaha Warga
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Logo Upload Box */}
                        <div className="space-y-2 md:col-span-2 bg-white p-3.5 rounded-xl border border-stone-200">
                          <label className="text-xs font-bold text-stone-800 block">
                            Logo Header Kategori:
                          </label>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            {catConfig.logoUrl ? (
                              <img
                                src={formatImageUrl(catConfig.logoUrl)}
                                alt={catConfig.name}
                                className="w-14 h-14 rounded-xl object-contain bg-stone-50 border border-stone-300 p-1 shadow-2xs shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-xl bg-stone-100 text-stone-400 flex items-center justify-center shrink-0 border border-dashed border-stone-300">
                                <ImageIcon className="w-6 h-6" />
                              </div>
                            )}

                            <div className="flex-1 space-y-2 w-full">
                              <div className="flex flex-wrap items-center gap-2">
                                <input
                                  type="text"
                                  value={catConfig.logoUrl || ''}
                                  onChange={(e) => {
                                    const newUrl = e.target.value;
                                    setTempCategoryConfigs(
                                      tempCategoryConfigs.map((c) =>
                                        c.id === catConfig.id ? { ...c, logoUrl: newUrl } : c
                                      )
                                    );
                                  }}
                                  placeholder="Tautan URL Gambar (https://... / /images/...)"
                                  className="w-full sm:flex-1 sm:min-w-[220px] px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                                />

                                <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-medium transition-colors shrink-0">
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>Upload Logo</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (ev) => {
                                          const result = ev.target?.result as string;
                                          if (result) {
                                            setTempCategoryConfigs(
                                              tempCategoryConfigs.map((c) =>
                                                c.id === catConfig.id ? { ...c, logoUrl: result } : c
                                              )
                                            );
                                          }
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                                </label>

                                {catConfig.id === 'Sentra Usaha BJP' && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setTempCategoryConfigs(
                                        tempCategoryConfigs.map((c) =>
                                          c.id === catConfig.id ? { ...c, logoUrl: '/images/sentra_usaha_logo.jpg' } : c
                                        )
                                      );
                                    }}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-lg text-xs font-medium transition-colors"
                                  >
                                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                                    <span>Logo Sentra Usaha Official</span>
                                  </button>
                                )}

                                {catConfig.logoUrl && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setTempCategoryConfigs(
                                        tempCategoryConfigs.map((c) =>
                                          c.id === catConfig.id ? { ...c, logoUrl: '' } : c
                                        )
                                      );
                                    }}
                                    className="px-2.5 py-1.5 bg-stone-200 hover:bg-red-100 hover:text-red-700 text-stone-700 rounded-lg text-xs font-medium transition-colors"
                                  >
                                    Hapus
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Nama Kategori / Rename Tab */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-stone-700 block">
                              Nama Kategori (Judul & Tab Navbar):
                            </label>
                            <CharCounter value={catConfig.name} max={CARD_TITLE_MAX_LENGTH} />
                          </div>
                          <input
                            type="text"
                            maxLength={CARD_TITLE_MAX_LENGTH}
                            value={catConfig.name}
                            onChange={(e) => {
                              const newName = e.target.value;
                              setTempCategoryConfigs(
                                tempCategoryConfigs.map((c) =>
                                  c.id === catConfig.id ? { ...c, name: newName } : c
                                )
                              );
                            }}
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                          />
                        </div>

                        {/* Deskripsi Header */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-stone-700 block">
                              Deskripsi Penjelasan Header:
                            </label>
                            <CharCounter value={catConfig.description} max={CARD_DESCRIPTION_MAX_LENGTH} />
                          </div>
                          <input
                            type="text"
                            maxLength={CARD_DESCRIPTION_MAX_LENGTH}
                            value={catConfig.description}
                            onChange={(e) => {
                              const newDesc = e.target.value;
                              setTempCategoryConfigs(
                                tempCategoryConfigs.map((c) =>
                                  c.id === catConfig.id ? { ...c, description: newDesc } : c
                                )
                              );
                            }}
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                          />
                        </div>

                        {/* Layout Type Selector */}
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-xs font-bold text-stone-700 block">
                            Tampilan Halaman Kategori:
                          </label>
                          <select
                            value={catConfig.layoutType || 'default'}
                            onChange={(e) => {
                              const newLayout = e.target.value as CategoryHeaderConfig['layoutType'];
                              setTempCategoryConfigs(
                                tempCategoryConfigs.map((c) =>
                                  c.id === catConfig.id ? { ...c, layoutType: newLayout } : c
                                )
                              );
                            }}
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                          >
                            <option value="default">🗂️ Default (Grid Kartu Komunitas)</option>
                            <option value="photo_album">📷 Album Foto (Carousel per Kartu)</option>
                            <option value="single_page">📄 Halaman Konten Tunggal</option>
                          </select>
                        </div>

                        {/* Single Page fields (only when layoutType === 'single_page') */}
                        {catConfig.layoutType === 'single_page' && (
                          <div className="md:col-span-2 space-y-3 bg-white p-3.5 rounded-xl border border-stone-200">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-stone-700 block">
                                URL Gambar Hero Halaman Tunggal:
                              </label>
                              <input
                                type="text"
                                value={catConfig.singlePageHeroImage || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setTempCategoryConfigs(
                                    tempCategoryConfigs.map((c) =>
                                      c.id === catConfig.id ? { ...c, singlePageHeroImage: val } : c
                                    )
                                  );
                                }}
                                placeholder="https://... / /images/..."
                                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-stone-700 block">
                                Konten Halaman (HTML diperbolehkan):
                              </label>
                              <textarea
                                rows={5}
                                value={catConfig.singlePageContent || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setTempCategoryConfigs(
                                    tempCategoryConfigs.map((c) =>
                                      c.id === catConfig.id ? { ...c, singlePageContent: val } : c
                                    )
                                  );
                                }}
                                placeholder="<p>Tulis konten halaman di sini...</p>"
                                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: Media Partner & Komunitas */}
              <MediaPartnersCMS siteSettings={siteSettings} onSaveSiteSettings={onSaveSiteSettings} />

              {/* Save All Settings Button */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Simpan Perubahan Branding, Navbar & Header Komunitas</h4>
                  <p className="text-xs text-stone-500">
                    Klik tombol di samping untuk menerapkan seluruh logo, susunan tab navbar, dan header komunitas secara langsung.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSaveSiteSettings({
                      ...siteSettings,
                      logoUrl: tempLogoUrl,
                      siteTitle: tempSiteTitle,
                      siteDescription: tempSiteDescription,
                      navbarTabs: tempNavbarTabs,
                      categoryConfigs: tempCategoryConfigs,
                    });
                    showToast('Pengaturan logo, judul website, tab navbar, & header komunitas berhasil disimpan!');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold text-sm transition-colors shrink-0"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Pengaturan</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: JADWAL SECURITY */}
          {activeTab === 'security' && (
            <div className="max-w-5xl mx-auto pb-6">
              <SecurityScheduleCMS
                siteSettings={siteSettings}
                onSaveSiteSettings={onSaveSiteSettings}
              />
            </div>
          )}

          {/* TAB: INFORMASI RT/RW */}
          {activeTab === 'rtrw' && (
            <RtRwCMS siteSettings={siteSettings} onSaveSiteSettings={onSaveSiteSettings} />
          )}

          {/* TAB: LAYANAN SURAT ONLINE */}
          {activeTab === 'documents' && (
            <DocumentTemplatesCMS siteSettings={siteSettings} onSaveSiteSettings={onSaveSiteSettings} />
          )}

          {/* TAB: POLLING & ASPIRASI */}
          {activeTab === 'polling' && (
            <div className="max-w-5xl mx-auto pb-6">
              <PollingCMS siteSettings={siteSettings} onSaveSiteSettings={onSaveSiteSettings} />
            </div>
          )}

          {/* TAB: VIDEO KEGIATAN */}
          {activeTab === 'videos' && (
            <VideoCMS siteSettings={siteSettings} onSaveSiteSettings={onSaveSiteSettings} />
          )}

          {/* TAB: FOTO KEGIATAN */}
          {activeTab === 'photos' && (
            <PhotoCMS siteSettings={siteSettings} onSaveSiteSettings={onSaveSiteSettings} />
          )}

          {/* TAB: BANK SAMPAH KMS */}
          {activeTab === 'banksampah' && (
            <BankSampahCMS siteSettings={siteSettings} onSaveSiteSettings={onSaveSiteSettings} />
          )}

          {activeTab === 'dkmmasjid' && (
            <DkmMasjidCMS siteSettings={siteSettings} onSaveSiteSettings={onSaveSiteSettings} />
          )}

          {/* TAB: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-6 max-w-5xl mx-auto pb-6">
              {/* IF CREATING OR EDITING USER */}
              {isCreatingUser || editingUser ? (
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
                        {editingUser ? <Edit3 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-stone-900 text-base sm:text-lg">
                          {editingUser ? `Edit Akun Pengurus: @${editingUser.username}` : 'Buat Akun Pengurus Baru'}
                        </h3>
                        <p className="text-xs text-stone-500">
                          Tentukan username, password, peran pengurus, dan komunitas spesifik yang boleh dikelola.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingUser(null);
                        setIsCreatingUser(false);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Kembali ke Daftar Akun</span>
                    </button>
                  </div>

                  <form onSubmit={handleSaveUserSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name / Penanggung Jawab */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-800">
                          Nama Lengkap / Penanggung Jawab <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formUser.name}
                          onChange={(e) => setFormUser({ ...formUser, name: e.target.value })}
                          placeholder="Contoh: Pengurus Masjid Al-Aqwam, Ibu Sri (Warung Bu Muncak)"
                          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                        />
                      </div>

                      {/* Username */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-800">
                          Username Login <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">@</span>
                          <input
                            type="text"
                            required
                            value={formUser.username}
                            onChange={(e) => setFormUser({ ...formUser, username: e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, '') })}
                            placeholder="admin_masjid"
                            className="w-full pl-8 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white font-mono"
                          />
                        </div>
                        <p className="text-[10px] text-stone-500">Gunakan huruf kecil, angka, atau garis bawah (contoh: <code>admin_posyandu</code>).</p>
                      </div>

                      {/* Password */}
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-stone-800">
                          Password Login <span className="text-red-500">*</span>
                        </label>
                        <div className="relative max-w-md">
                          <input
                            type={showFormPassword ? 'text' : 'password'}
                            required
                            value={formUser.password}
                            onChange={(e) => setFormUser({ ...formUser, password: e.target.value })}
                            placeholder="Password login..."
                            className="w-full pl-3.5 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setShowFormPassword(!showFormPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                            title={showFormPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                          >
                            {showFormPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-3 pt-2 border-t border-stone-100">
                      <label className="text-xs font-bold text-stone-800 block">
                        Peran & Level Hak Akses <span className="text-red-500">*</span>
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Option 1: Entity Admin */}
                        <div
                          onClick={() => setFormUser({ ...formUser, role: 'entity_admin' })}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                            formUser.role === 'entity_admin'
                              ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                              : 'border-stone-200 hover:border-stone-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <Shield className={`w-5 h-5 ${formUser.role === 'entity_admin' ? 'text-blue-700' : 'text-stone-400'}`} />
                            <strong className="text-sm font-bold text-stone-900">Admin Komunitas (Akses Terbatas)</strong>
                          </div>
                          <p className="text-xs text-stone-600 leading-relaxed">
                            Hanya dapat melihat dan mengedit komunitas yang Anda pilihkan di bawah ini. Sangat disarankan untuk pengurus unit kegiatan / UMKM tertentu.
                          </p>
                        </div>

                        {/* Option 2: Super Admin */}
                        <div
                          onClick={() => setFormUser({ ...formUser, role: 'super_admin' })}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                            formUser.role === 'super_admin'
                              ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                              : 'border-stone-200 hover:border-stone-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <ShieldCheck className={`w-5 h-5 ${formUser.role === 'super_admin' ? 'text-emerald-700' : 'text-stone-400'}`} />
                            <strong className="text-sm font-bold text-stone-900">Super Admin (Akses Penuh)</strong>
                          </div>
                          <p className="text-xs text-stone-600 leading-relaxed">
                            Dapat mengedit seluruh komunitas, mengelola pengumuman, mengubah logo & judul website, serta membuat/menghapus akun pengurus lain.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Entity Permissions Selector (Only if role === 'entity_admin') */}
                    {formUser.role === 'entity_admin' && (
                      <div className="space-y-3 pt-2 border-t border-stone-100">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <div>
                            <label className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                              <span>Pilih Komunitas yang Boleh Dikelola Akun Ini:</span>
                              <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                                {formUser.allowedEntityIds.length} Dipilih
                              </span>
                            </label>
                            <p className="text-[11px] text-stone-500">Centang komunitas yang diizinkan untuk diakses & diedit oleh pengguna ini.</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setFormUser({ ...formUser, allowedEntityIds: entities.map((e) => e.id) })}
                              className="text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                            >
                              Pilih Semua ({entities.length})
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormUser({ ...formUser, allowedEntityIds: [] })}
                              className="text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 border border-stone-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                            >
                              Batalkan Semua
                            </button>
                          </div>
                        </div>

                        {/* Search Filter for Entities list */}
                        <div className="relative max-w-sm">
                          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                          <input
                            type="text"
                            value={entitySearchFilter}
                            onChange={(e) => setEntitySearchFilter(e.target.value)}
                            placeholder="Cari nama komunitas..."
                            className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                          />
                        </div>

                        {/* Scrollable Entities Checkbox Grid */}
                        <div className="max-h-72 overflow-y-auto border border-stone-200 rounded-xl p-3 bg-stone-50/50 space-y-2">
                          {entities
                            .filter((e) => e.name.toLowerCase().includes(entitySearchFilter.toLowerCase()) || e.category.toLowerCase().includes(entitySearchFilter.toLowerCase()))
                            .map((e) => {
                              const isChecked = formUser.allowedEntityIds.includes(e.id);
                              return (
                                <div
                                  key={e.id}
                                  onClick={() => toggleEntityPermissionInForm(e.id)}
                                  className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                    isChecked
                                      ? 'bg-blue-50/80 border-blue-300 text-blue-950 font-semibold shadow-2xs'
                                      : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`p-1 rounded-md ${isChecked ? 'text-blue-700' : 'text-stone-300'}`}>
                                      {isChecked ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                                    </div>
                                    <img
                                      src={formatImageUrl(e.image)}
                                      alt={e.name}
                                      className="w-8 h-8 rounded-lg object-cover border border-stone-200 shrink-0"
                                    />
                                    <div>
                                      <h5 className="text-xs font-bold text-stone-900">{e.name}</h5>
                                      <span className="text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded font-normal">
                                        {e.category}
                                      </span>
                                    </div>
                                  </div>

                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    isChecked ? 'bg-blue-100 text-blue-800' : 'bg-stone-100 text-stone-400'
                                  }`}>
                                    {isChecked ? 'Diizinkan' : 'Dilarang'}
                                  </span>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}

                    {/* Submit Actions */}
                    <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingUser(null);
                          setIsCreatingUser(false);
                        }}
                        className="px-4 py-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-sm font-semibold rounded-lg transition-colors"
                      >
                        Batal
                      </button>

                      <button
                        type="submit"
                        className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        {editingUser ? 'Simpan Perubahan' : 'Buat Akun'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* USER LIST VIEW */
                <div className="space-y-6">
                  {/* Top Header Card */}
                  <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-extrabold text-stone-900 text-base sm:text-lg flex items-center gap-2">
                        <Users className="w-5 h-5 text-emerald-700" />
                        <span>Manajemen Akun Pengurus & Hak Akses ({users.length})</span>
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Kelola akun login pengurus, password, dan tentukan komunitas mana saja yang boleh dikelola oleh tiap akun.
                      </p>
                    </div>

                    {isSuperAdmin && (
                      <button
                        onClick={handleStartNewUser}
                        className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors shrink-0"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Tambah Akun Baru</span>
                      </button>
                    )}
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      placeholder="Cari pengurus berdasarkan nama atau @username..."
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-2xs"
                    />
                  </div>

                  {/* Users Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {users
                      .filter(
                        (u) =>
                          u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                          u.username.toLowerCase().includes(userSearchQuery.toLowerCase())
                      )
                      .map((u) => {
                        const isSuper = u.role === 'super_admin';
                        const allowedEntities = entities.filter(
                          (e) => u.allowedEntityIds?.includes('*') || u.allowedEntityIds?.includes(e.id)
                        );
                        const isSelf = u.id === currentUser?.id;

                        return (
                          <div
                            key={u.id}
                            className={`p-5 rounded-2xl border transition-all space-y-4 bg-white ${
                              isSelf ? 'border-emerald-300 ring-2 ring-emerald-600/20 shadow-sm' : 'border-stone-200 shadow-2xs'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                                  isSuper ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {isSuper ? <ShieldCheck className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <h4 className="font-bold text-stone-900 text-sm sm:text-base">{u.name}</h4>
                                    {isSelf && (
                                      <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-300">
                                        Akun Anda Saat Ini
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs font-mono font-bold text-stone-500">@{u.username}</p>
                                </div>
                              </div>

                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase border shrink-0 ${
                                isSuper
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : 'bg-blue-50 text-blue-800 border-blue-200'
                              }`}>
                                {isSuper ? 'Super Admin' : 'Admin Komunitas'}
                              </span>
                            </div>

                            {/* Password Box */}
                            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center justify-between text-xs font-mono">
                              <span className="text-stone-500 font-sans font-medium text-[11px]">Password:</span>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-stone-900">
                                  {visiblePasswordUserId === u.id ? u.password : '••••••••'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setVisiblePasswordUserId(visiblePasswordUserId === u.id ? null : u.id)}
                                  className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                                  title={visiblePasswordUserId === u.id ? 'Sembunyikan' : 'Lihat Password'}
                                >
                                  {visiblePasswordUserId === u.id ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>

                            {/* Hak Akses Komunitas List */}
                            <div className="space-y-1.5">
                              <span className="text-[11px] font-bold text-stone-600 block">Hak Akses Pengelolaan:</span>
                              {isSuper || u.allowedEntityIds?.includes('*') ? (
                                <div className="bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                                  <span>Bebas Kelola Semua Komunitas ({entities.length} Komunitas)</span>
                                </div>
                              ) : allowedEntities.length === 0 ? (
                                <div className="bg-amber-50 text-amber-900 border border-amber-200 text-xs px-3 py-1.5 rounded-xl">
                                  Belum diberikan akses komunitas manapun.
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <span className="text-[10px] text-blue-800 bg-blue-50 px-2 py-0.5 rounded font-bold border border-blue-200">
                                    Diberikan Akses Ke {allowedEntities.length} Komunitas Spesifik:
                                  </span>
                                  <div className="flex flex-wrap gap-1 pt-1 max-h-24 overflow-y-auto">
                                    {allowedEntities.map((ent) => (
                                      <span key={ent.id} className="text-[11px] bg-stone-100 text-stone-800 font-medium px-2 py-0.5 rounded-md border border-stone-200">
                                        {ent.name}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            {isSuperAdmin && (
                              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleStartEditUser(u)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-stone-600" />
                                  <span>Edit Akun</span>
                                </button>

                                {u.username !== 'admin' && !isSelf && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteUser(u.id, u.username)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-red-200"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                                    <span>Hapus</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: INTEGRASI SUPABASE DATABASE */}
          {activeTab === 'supabase' && (
            <div className="space-y-6 max-w-4xl mx-auto pb-6">
              {/* Header Box */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl shrink-0">
                      <Database className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-stone-900 text-base sm:text-lg flex items-center gap-2">
                        <span>Integrasi Supabase Cloud Database</span>
                      </h3>
                      <p className="text-xs text-stone-500">
                        Simpan credentials akun pengurus, komunitas kegiatan, pengumuman, dan konfigurasi portal secara real-time di cloud database Supabase.
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isSupabaseConfigured() ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full text-xs font-bold shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Supabase Dikonfigurasi</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-300 rounded-full text-xs font-bold shadow-2xs">
                        <XCircle className="w-4 h-4 text-amber-600" />
                        <span>Supabase Belum Dikonfigurasi</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status & Quick Action Card */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <h4 className="font-bold text-stone-900 text-sm sm:text-base border-b border-stone-100 pb-2 flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-700" />
                  <span>Status Koneksi & Sinkronisasi Data</span>
                </h4>

                <p className="text-xs text-stone-600 leading-relaxed">
                  Gunakan kontrol di bawah ini untuk menguji koneksi ke Supabase atau melakukan sinkronisasi data antara penyimpanan lokal dan Supabase.
                </p>

                {/* Test Result Banner */}
                {supabaseTestResult && (
                  <div
                    className={`p-4 rounded-xl border text-xs font-medium space-y-1 ${
                      supabaseTestResult.success
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-red-50 border-red-300 text-red-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm">
                      {supabaseTestResult.success ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-700 shrink-0" />
                      )}
                      <span>{supabaseTestResult.success ? 'Koneksi Berhasil!' : 'Koneksi Gagal'}</span>
                    </div>
                    <p className="pl-6 text-stone-700">{supabaseTestResult.message}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleTestSupabase}
                    disabled={supabaseTesting}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-300 rounded-lg font-semibold text-xs transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 text-stone-700 ${supabaseTesting ? 'animate-spin' : ''}`} />
                    <span>{supabaseTesting ? 'Menguji...' : 'Uji Koneksi Supabase'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePushToSupabase}
                    disabled={supabaseSyncing || !isSupabaseConfigured()}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold text-xs transition-colors disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4 text-emerald-300" />
                    <span>{supabaseSyncing ? 'Mengirim...' : 'Upload Data Lokal ke Supabase'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePullFromSupabase}
                    disabled={supabaseSyncing || !isSupabaseConfigured()}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold text-xs transition-colors disabled:opacity-50"
                  >
                    <Download className="w-4 h-4 text-blue-200" />
                    <span>{supabaseSyncing ? 'Mengunduh...' : 'Tarik Data dari Supabase'}</span>
                  </button>
                </div>
              </div>

              {/* Panduan Langkah Demi Langkah Integrasi */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h4 className="font-bold text-stone-900 text-sm sm:text-base flex items-center gap-2">
                    <Code className="w-4 h-4 text-emerald-700" />
                    <span>Panduan Integrasi Supabase (Step-by-Step)</span>
                  </h4>
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-emerald-800 font-bold hover:underline"
                  >
                    <span>Buka Supabase Dashboard</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-stone-900">
                      <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                      <span>Buat Project Supabase Gratis</span>
                    </div>
                    <p className="text-stone-600 leading-relaxed">
                      Daftar akun gratis di <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-800 font-bold underline">supabase.com</a> dan buat project baru bernama <code>bjp-hub-db</code>.
                    </p>
                  </div>

                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-stone-900">
                      <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                      <span>Salin Project URL & API Key</span>
                    </div>
                    <p className="text-stone-600 leading-relaxed">
                      Buka menu <strong>Project Settings -&gt; API</strong> di Supabase. Salin <strong>Project URL</strong> dan <strong>anon / public API key</strong> Anda.
                    </p>
                  </div>

                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-stone-900">
                      <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[10px] flex items-center justify-center font-bold">3</span>
                      <span>Atur Environment Variable</span>
                    </div>
                    <p className="text-stone-600 leading-relaxed">
                      Tambahkan kunci berikut di pengaturan environment AI Studio / file <code>.env</code>:
                    </p>
                    <div className="p-2 bg-stone-900 text-emerald-400 font-mono text-[11px] rounded-lg">
                      VITE_SUPABASE_URL=https://xyz.supabase.co<br />
                      VITE_SUPABASE_ANON_KEY=eyJhbGci...
                    </div>
                  </div>

                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-stone-900">
                      <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[10px] flex items-center justify-center font-bold">4</span>
                      <span>Jalankan Skrip Tabel SQL</span>
                    </div>
                    <p className="text-stone-600 leading-relaxed">
                      Buka menu <strong>SQL Editor</strong> di Supabase Dashboard, lalu jalankan skrip SQL otomatis di bawah ini untuk membuat seluruh tabel yang dibutuhkan.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Skrip SQL Setup */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-emerald-700" />
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                        Skrip SQL Editor Supabase
                      </h4>
                      <p className="text-xs text-stone-500">
                        Salin dan jalankan skrip ini di SQL Editor Supabase untuk membuat tabel <code>bjp_users</code>, <code>bjp_entities</code>, <code>bjp_announcements</code>, dan <code>bjp_site_settings</code>.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopySqlScript}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    {copiedSql ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-emerald-300" />
                        <span>Salin Skrip SQL</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="relative rounded-xl overflow-hidden bg-stone-900 border border-stone-800">
                  <pre className="p-4 text-emerald-400 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-72 no-scrollbar">
                    {SUPABASE_SQL_SETUP_SCRIPT}
                  </pre>
                </div>
              </div>

              {/* Card Keamanan Password & Environment Variable */}
              <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-2">
                <div className="flex items-center gap-2 font-extrabold text-sm text-emerald-950">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  <span>Jaminan Keamanan: Bebas Hardcode Credentials</span>
                </div>
                <p className="text-emerald-800 leading-relaxed">
                  Aplikasi ini <strong>tidak pernah menyimpan kata sandi secara hardcode di dalam kode JavaScript</strong>. Seluruh credential akun pengurus disimpan secara aman di dalam tabel database (Supabase <code>bjp_users</code> atau enkripsi local storage) dan dapat dikonfigurasi secara fleksibel melalui variabel lingkungan <code>VITE_INITIAL_ADMIN_PASSWORD</code>.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: BACKUP & RESTORE DATA JSON */}
          {activeTab === 'backup' && (
            <div className="space-y-6 max-w-4xl mx-auto pb-6">
              {/* Header Box */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
                    <Download className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-stone-900 text-base sm:text-lg">
                      Backup & Restore Data JSON Website
                    </h3>
                    <p className="text-xs text-stone-500">
                      Cadangkan seluruh data Komunitas Kegiatan, Pengumuman, dan Pengaturan ke file JSON atau pulihkan data dari file cadangan sebelumnya.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card 1: Ekspor / Download JSON */}
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        1. Ekspor Data
                      </span>
                      <span className="text-[11px] font-semibold text-stone-500">
                        Format .JSON
                      </span>
                    </div>

                    <h4 className="font-extrabold text-stone-900 text-base">
                      Unduh Salinan Cadangan (Backup Data)
                    </h4>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      Ekspor seluruh <strong>{entities.length} Komunitas Kegiatan</strong> dan <strong>{announcements.length} Pengumuman</strong> beserta seluruh foto, jam buka, kontak, dan alamat ke satu file <code>.json</code>.
                    </p>

                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1">
                      <div className="flex justify-between font-medium">
                        <span>Total Komunitas:</span>
                        <span className="font-bold text-stone-900">{entities.length} Item</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Total Pengumuman & Agenda:</span>
                        <span className="font-bold text-stone-900">{announcements.length} Item</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleExport}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold text-sm shadow-sm transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Backup Data (.json)</span>
                  </button>
                </div>

                {/* Card 2: Impor / Upload JSON */}
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                        2. Impor / Restore Data
                      </span>
                      <span className="text-[11px] font-semibold text-stone-500">
                        Unggah File .JSON
                      </span>
                    </div>

                    <h4 className="font-extrabold text-stone-900 text-base">
                      Pulihkan Data dari File Cadangan
                    </h4>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      Pilih file <code>.json</code> hasil ekspor sebelumnya dari perangkat Anda untuk memulihkan seluruh data komunitas dan pengumuman secara otomatis.
                    </p>

                    <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-blue-900 leading-relaxed">
                      💡 File JSON yang diimpor akan langsung memperbarui daftar komunitas dan pengumuman tanpa menghilangkan konfigurasi penting.
                    </div>
                  </div>

                  <label className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold text-sm shadow-sm transition-colors cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Pilih File Backup JSON & Import</span>
                    <input
                      type="file"
                      accept=".json,application/json"
                      onChange={handleImportFile}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Card 3: Reset Total ke Default Awal PDF */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-amber-600" />
                    <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                      3. Reset Data Ke Setelan Standar Awal (13 Komunitas Resmi PDF)
                    </h4>
                  </div>
                  <span className="text-xs bg-amber-50 text-amber-800 font-semibold px-2.5 py-1 rounded-full border border-amber-200">
                    Opsi Pemulihan Awal
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  Gunakan opsi ini jika Anda ingin mengembalikan seluruh data ke <strong>13 Komunitas Resmi Awal</strong> dari dokumen PDF Bintara Jaya Permai (RW 11). Perubahan lokal yang belum di-backup akan ditimpa.
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 font-medium">
                    ⚠️ Memerlukan konfirmasi keamanan sebelum proses reset dijalankan.
                  </span>

                  <button
                    type="button"
                    onClick={handleResetData}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-lg font-semibold text-xs transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 text-amber-700" />
                    <span>Reset Data Ke 13 Komunitas Awal</span>
                  </button>
                </div>
              </div>

              {/* Section 4: Panduan Lengkap & Instruksi Backup */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                  <HelpCircle className="w-5 h-5 text-emerald-700" />
                  <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                    Petunjuk Lengkap & Instruksi Keamanan Data Admin
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-700">
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                    <h5 className="font-bold text-stone-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                      Cara Melakukan Backup Data
                    </h5>
                    <p className="text-stone-600 leading-relaxed">
                      Klik tombol <strong>"Download Backup Data (.json)"</strong>. File bernama <code>bjp-hub-data-TANGGAL.json</code> akan tersimpan di folder Unduhan komputer/HP Anda.
                    </p>
                  </div>

                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                    <h5 className="font-bold text-stone-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                      Cara Memulihkan (Restore) Data
                    </h5>
                    <p className="text-stone-600 leading-relaxed">
                      Klik <strong>"Pilih File Backup JSON & Import"</strong>, lalu pilih file <code>.json</code> cadangan yang ingin dipulihkan. Data akan langsung terbarui di website secara otomatis.
                    </p>
                  </div>

                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                    <h5 className="font-bold text-stone-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[10px] flex items-center justify-center font-bold">3</span>
                      Memindahkan Data ke Perangkat Lain
                    </h5>
                    <p className="text-stone-600 leading-relaxed">
                      Kirim file JSON cadangan via WhatsApp / Email ke pengurus lain. Pengurus lain dapat langsung mengimpor file tersebut melalui CMS di HP/komputer mereka.
                    </p>
                  </div>

                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                    <h5 className="font-bold text-stone-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[10px] flex items-center justify-center font-bold">4</span>
                      Rekomendasi Jadwal Backup
                    </h5>
                    <p className="text-stone-600 leading-relaxed">
                      Lakukan ekspor data JSON secara berkala setelah Anda menambah atau mengedit komunitas UMKM, jadwal operasional, atau pengumuman warga baru.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
