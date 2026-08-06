import React, { useState, useEffect } from 'react';
import {
  Entity,
  Announcement,
  SiteSettings,
  NavbarTabConfig,
  CategoryHeaderConfig,
  User,
  UserRole,
  DocumentTemplate,
  PollingPageConfig,
  PollingSection,
  PageLayoutType,
  RunningTextConfig,
  RtRwPageConfig,
  RtDetailItem,
  RtRwValueItem,
  SocialFeedItem,
  MediaPartnerItem,
} from '../types';
import {
  X, Plus, Edit3, Trash2, Copy, Download, Upload, RefreshCw, Check,
  Image as ImageIcon, Sparkles, LayoutGrid, Megaphone, HelpCircle,
  Bold, Italic, List, Heading, ExternalLink, ShieldAlert, ArrowLeft,
  GripVertical, ArrowUp, ArrowDown, MapPin, Info, Globe, Sliders, Palette, Eye, EyeOff,
  Users, UserPlus, ShieldCheck, Shield, Lock, LogOut, CheckSquare, Square, Search, User as UserIcon,
  Database, Server, CheckCircle2, XCircle, Terminal, Code, FileText, Vote, Images, Layout, Layers, UploadCloud,
  ChevronDown, ChevronUp, Building, Phone, Calendar, Video, Youtube, Instagram
} from 'lucide-react';
import { exportDataAsJSON, importDataFromJSON, resetToDefaults, DEFAULT_CATEGORY_CONFIGS, DEFAULT_RTRW_CONFIG, DEFAULT_SITE_SETTINGS } from '../utils/storage';
import { formatImageUrl } from '../utils/imageUrl';
import { BJP_LOGO_URL } from '../assets/logo';
import { InstagramIcon, FacebookIcon, TikTokIcon, WhatsAppIcon, SocialBadges } from './SocialIcons';
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

// Collapsible Card helper component for CMS main sections & cards
interface CollapsibleCardProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

const CollapsibleCard: React.FC<CollapsibleCardProps> = ({
  title,
  subtitle,
  icon,
  badge,
  defaultOpen = true,
  children,
  className = '',
  headerAction,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden transition-all ${className}`}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-stone-50/90 hover:bg-stone-100/90 flex items-center justify-between cursor-pointer select-none transition-colors border-b border-stone-200/70"
      >
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          {icon && <div className="text-emerald-800 shrink-0">{icon}</div>}
          <div className="truncate text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-stone-900">{title}</span>
              {badge}
            </div>
            {subtitle && <p className="text-[11px] text-stone-500 font-normal truncate mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {headerAction && <div onClick={(e) => e.stopPropagation()}>{headerAction}</div>}
          <div className="p-1 px-2 rounded-lg text-stone-600 hover:text-stone-900 bg-stone-200/50 hover:bg-stone-200 transition-colors flex items-center gap-1 text-[11px] font-bold">
            <span>{isOpen ? 'Tutup' : 'Buka'}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-emerald-800" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-600" />}
          </div>
        </div>
      </div>
      {isOpen && <div className="p-4 sm:p-5">{children}</div>}
    </div>
  );
};

// Preset Images for board members without photo links
const IMAGE_PRESETS = [
  { label: 'Logo BJP HUB Resmi', url: BJP_LOGO_URL },
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
  'Galeri Warga',
  'Informasi RT/RW',
  'Administratif / Pemerintahan',
  'Keagamaan',
  'Lingkungan',
  'Kesejahteraan Keluarga',
  'Kesehatan',
  'Kepemudaan',
  'Olahraga',
];

// Layout Live Preview Box Component for Entity Page Layout Selection
const LayoutPreviewCard: React.FC<{ catConfig: CategoryHeaderConfig }> = ({ catConfig }) => {
  const layout = catConfig.layoutType || 'default';

  return (
    <div className="mt-3 p-4 bg-stone-900 text-white rounded-2xl border border-stone-800 space-y-3">
      <div className="flex items-center justify-between border-b border-stone-800 pb-2 flex-wrap gap-2">
        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
          <Eye className="w-3.5 h-3.5" />
          Preview Tampilan Layar Pengunjung ({catConfig.name || 'Halaman Entitas'})
        </span>
        <span className="text-[10px] bg-stone-800 text-stone-300 font-mono px-2 py-0.5 rounded border border-stone-700">
          Format Layout: {layout === 'single_page' ? 'Single Page Artikel' : layout === 'photo_album' ? 'Photo Album Gallery' : 'Default Card Grid'}
        </span>
      </div>

      {layout === 'default' && (
        <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 space-y-2">
          <div className="text-[11px] text-stone-400 font-medium">Pratinjau Format Card Grid Standar:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-stone-900 p-3 rounded-xl border border-stone-800 space-y-2">
              <div className="h-20 bg-stone-800 rounded-lg overflow-hidden relative">
                <img
                  src={catConfig.logoUrl ? formatImageUrl(catConfig.logoUrl) : 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&q=80'}
                  alt=""
                  className="w-full h-full object-cover opacity-80"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&q=80';
                  }}
                />
                <span className="absolute top-1.5 left-1.5 bg-emerald-700 text-white text-[9px] px-2 py-0.5 rounded font-bold">
                  {catConfig.name}
                </span>
              </div>
              <div className="text-xs font-bold text-white">Contoh Unit Kegiatan 1</div>
              <div className="text-[10px] text-stone-400 line-clamp-2">Deskripsi rincian kegiatan, jadwal, dan kontak unit.</div>
              <div className="text-[10px] bg-emerald-800 text-white px-2.5 py-1 rounded-lg text-center font-bold">Buka Rincian</div>
            </div>

            <div className="bg-stone-900 p-3 rounded-xl border border-stone-800 space-y-2 opacity-75 hidden sm:block">
              <div className="h-20 bg-stone-800 rounded-lg flex items-center justify-center text-stone-600 text-xs">
                Gambar Unit 2
              </div>
              <div className="text-xs font-bold text-stone-300">Contoh Unit Kegiatan 2</div>
              <div className="text-[10px] text-stone-500 line-clamp-2">Informasi kegiatan warga Bintara Jaya Permai.</div>
              <div className="text-[10px] bg-stone-800 text-stone-400 px-2.5 py-1 rounded-lg text-center font-bold">Buka Rincian</div>
            </div>
          </div>
        </div>
      )}

      {layout === 'photo_album' && (
        <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 space-y-2">
          <div className="text-[11px] text-stone-400 font-medium">Pratinjau Format Gallery Carousel Slide Foto:</div>
          <div className="relative h-32 bg-stone-900 rounded-xl overflow-hidden border border-stone-800 flex items-center justify-center">
            <img
              src={catConfig.logoUrl ? formatImageUrl(catConfig.logoUrl) : 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80'}
              alt=""
              className="w-full h-full object-cover opacity-75"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-3 flex flex-col justify-between">
              <span className="self-end text-[9px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full">
                Slide 1 dari 5 Foto
              </span>
              <div>
                <div className="text-xs font-bold text-white">Album Dokumentasi {catConfig.name}</div>
                <div className="text-[10px] text-stone-300">Galeri foto kegiatan warga, acara bazar, & dokumentasi resmi.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {layout === 'single_page' && (
        <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 space-y-2">
          <div className="text-[11px] text-stone-400 font-medium">Pratinjau Format Hero Banner & Single Article:</div>
          <div className="relative h-28 bg-stone-900 rounded-xl overflow-hidden border border-stone-800 mb-2">
            <img
              src={catConfig.singlePageHeroImage ? formatImageUrl(catConfig.singlePageHeroImage) : 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1000&q=80'}
              alt=""
              className="w-full h-full object-cover opacity-60"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1000&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-3 flex flex-col justify-end">
              <span className="text-[9px] text-purple-300 font-bold uppercase tracking-wide">Halaman Single Page</span>
              <div className="text-xs font-black text-white">{catConfig.name}</div>
            </div>
          </div>
          <div className="p-3 bg-stone-900 rounded-lg text-[11px] text-stone-300 space-y-1.5 max-h-28 overflow-y-auto">
            {catConfig.singlePageContent ? (
              <div dangerouslySetInnerHTML={{ __html: catConfig.singlePageContent }} />
            ) : (
              <div className="text-stone-500 italic">Konten artikel rich text belum diisi. Tuliskan teks di editor di atas untuk melihat hasilnya.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

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
  const [activeTab, setActiveTab] = useState<'entities' | 'entity_pages' | 'announcements' | 'settings' | 'rtrw' | 'documents' | 'polling' | 'users' | 'supabase' | 'backup'>('entities');
  
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
        alert('Berhasil mengunggah seluruh data (Pengguna, Entitas, Pengumuman, Settings) ke Supabase!');
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

  // Local state for album photos in entity form
  const [tempAlbumPhotos, setTempAlbumPhotos] = useState<Array<{ id: string; url: string; caption: string }>>([]);

  // Local state for Site Settings (Branding & Navbar Tabs)
  const [tempLogoUrl, setTempLogoUrl] = useState<string>(siteSettings?.logoUrl || BJP_LOGO_URL);
  const [tempSiteTitle, setTempSiteTitle] = useState<string>(siteSettings?.siteTitle || 'BJP HUB Bintara Jaya Permai');
  const [tempSiteDescription, setTempSiteDescription] = useState<string>(siteSettings?.siteDescription || 'Portal Resmi Ekosistem & Kegiatan Warga Komplek Bintara Jaya Permai (RW 11)');
  const [tempNavbarTabs, setTempNavbarTabs] = useState<NavbarTabConfig[]>(
    siteSettings?.navbarTabs || [
      { id: 'entities', label: 'Entitas Kegiatan', enabled: true, order: 0 },
      { id: 'announcements', label: 'Pengumuman & Agenda', enabled: true, order: 1 },
      { id: 'document_service', label: 'Layanan Surat Online', enabled: true, order: 2 },
      { id: 'polling', label: 'Polling & Aspirasi', enabled: true, order: 3 },
    ]
  );
  const [tempCategoryConfigs, setTempCategoryConfigs] = useState<CategoryHeaderConfig[]>(
    siteSettings?.categoryConfigs || DEFAULT_CATEGORY_CONFIGS
  );

  // Social Feeds Config State
  const [tempSocialFeeds, setTempSocialFeeds] = useState<SocialFeedItem[]>(
    siteSettings?.socialFeeds || DEFAULT_SITE_SETTINGS.socialFeeds
  );

  // Selected Feed Section in CMS: 'terbaru' | 'album_foto' | 'album_video'
  const [cmsFeedSection, setCmsFeedSection] = useState<'terbaru' | 'album_foto' | 'album_video'>('terbaru');

  // Media Partners Config State
  const [tempMediaPartners, setTempMediaPartners] = useState<MediaPartnerItem[]>(
    siteSettings?.mediaPartners || DEFAULT_SITE_SETTINGS.mediaPartners || []
  );

  // Running Text Config State
  const [tempRunningText, setTempRunningText] = useState<RunningTextConfig>(
    siteSettings?.runningText || {
      enabled: true,
      text: '📢 SELAMAT DATANG DI PORTAL BJP HUB RW 11 — Informasi Resmi Kegiatan Warga, Sentra UMKM, Agenda RW, & Layanan Surat Menyurat Online Mandiri!',
    }
  );

  // Accordion Section State for Navigasi & Branding Tab
  const [expandedSiteSection, setExpandedSiteSection] = useState<number | null>(1);

  // Document Templates State
  const [tempDocumentTemplates, setTempDocumentTemplates] = useState<DocumentTemplate[]>(
    siteSettings?.documentTemplates || []
  );
  const [editingDocTemplate, setEditingDocTemplate] = useState<DocumentTemplate | null>(null);
  const [isCreatingDocTemplate, setIsCreatingDocTemplate] = useState<boolean>(false);
  const [docTemplateMode, setDocTemplateMode] = useState<'upload' | 'template'>('upload');
  const [formDocTemplate, setFormDocTemplate] = useState<Partial<DocumentTemplate>>({
    title: '',
    code: '',
    category: 'Pemerintahan / Kependudukan',
    description: '',
    templateBody: '',
    enabled: true,
  });

  // Polling Page Config State
  const [tempPollingConfig, setTempPollingConfig] = useState<PollingPageConfig>(
    siteSettings?.pollingConfig || {
      enabled: true,
      pageTitle: 'Polling & Suara Aspirasi Warga RW 11',
      pageDescription: 'Partisipasi aktif warga Komplek Bintara Jaya Permai melalui jajak pendapat dan permohonan aspirasi resmi.',
      section1: {
        id: 'sec-1',
        enabled: true,
        title: 'Survei Evaluasi & Aspirasi Fasilitas Lingkungan',
        description: 'Silakan isi formulir survei evaluasi kebersihan, keamanan, dan fasilitas bersama RW 11.',
        formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc_sample1/viewform?embedded=true',
      },
      section2: {
        id: 'sec-2',
        enabled: true,
        title: 'Polling Usulan Kegiatan Bazar & Fest Sentra UMKM',
        description: 'Sampaikan ide, saran, dan voting kegiatan bazar/fest bulanan warga Bintara Jaya Permai.',
        formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc_sample2/viewform?embedded=true',
      },
    }
  );

  // RT/RW Page Config State
  const [tempRtRwConfig, setTempRtRwConfig] = useState<RtRwPageConfig>(
    siteSettings?.rtRwConfig || DEFAULT_RTRW_CONFIG
  );

  // Category / Page Config CRUD State
  const [editingCategoryConfig, setEditingCategoryConfig] = useState<CategoryHeaderConfig | null>(null);
  const [isCreatingCategoryConfig, setIsCreatingCategoryConfig] = useState<boolean>(false);
  const [formCategoryConfig, setFormCategoryConfig] = useState<Partial<CategoryHeaderConfig>>({
    name: '',
    description: '',
    logoUrl: '',
    layoutType: 'default',
    singlePageHeroImage: '',
    singlePageContent: '',
  });

  useEffect(() => {
    if (siteSettings) {
      setTempLogoUrl(siteSettings.logoUrl || BJP_LOGO_URL);
      setTempSiteTitle(siteSettings.siteTitle || 'BJP HUB Bintara Jaya Permai');
      setTempSiteDescription(siteSettings.siteDescription || 'Portal Resmi Ekosistem & Kegiatan Warga Komplek Bintara Jaya Permai (RW 11)');
      setTempNavbarTabs(
        siteSettings.navbarTabs || [
          { id: 'entities', label: 'Entitas Kegiatan', enabled: true, order: 0 },
          { id: 'announcements', label: 'Pengumuman & Agenda', enabled: true, order: 1 },
          { id: 'document_service', label: 'Layanan Surat Online', enabled: true, order: 2 },
          { id: 'polling', label: 'Polling & Aspirasi', enabled: true, order: 3 },
        ]
      );
      setTempCategoryConfigs(siteSettings.categoryConfigs || DEFAULT_CATEGORY_CONFIGS);
      if (siteSettings.runningText) {
        setTempRunningText(siteSettings.runningText);
      }
      if (siteSettings.documentTemplates) {
        setTempDocumentTemplates(siteSettings.documentTemplates);
      }
      if (siteSettings.pollingConfig) {
        setTempPollingConfig(siteSettings.pollingConfig);
      }
      if (siteSettings.rtRwConfig) {
        setTempRtRwConfig(siteSettings.rtRwConfig);
      }
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
  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

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
    setIsProductPhotosEnabled(false);
    setPhotoSlot1(''); setPhotoCaption1('');
    setPhotoSlot2(''); setPhotoCaption2('');
    setPhotoSlot3(''); setPhotoCaption3('');
    setPhotoSlot4(''); setPhotoCaption4('');
    setPhotoSlot5(''); setPhotoCaption5('');
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
      setIsProductPhotosEnabled(photos.length > 0);
      setPhotoSlot1(photos[0] || ''); setPhotoCaption1(captions[0] || '');
      setPhotoSlot2(photos[1] || ''); setPhotoCaption2(captions[1] || '');
      setPhotoSlot3(photos[2] || ''); setPhotoCaption3(captions[2] || '');
      setPhotoSlot4(photos[3] || ''); setPhotoCaption4(captions[3] || '');
      setPhotoSlot5(photos[4] || ''); setPhotoCaption5(captions[4] || '');
      setPhotoError(null);

      setIsCreatingNewEntity(false);
      setActiveTab('entities');
    } else if (initialCategoryForNewEntity) {
      handleStartNewEntity(initialCategoryForNewEntity);
      setActiveTab('entities');
    }
  }, [editingEntityInit, initialCategoryForNewEntity]);

  if (!isOpen) return null;

  const handleStartEditEntity = (ent: Entity) => {
    setEditingEntity(ent);
    setIsCreatingNewEntity(false);
    const socials = ent.socials || {
      instagram: { enabled: !!ent.instagram, url: ent.instagram || '' },
      facebook: { enabled: false, url: '' },
      tiktok: { enabled: false, url: '' },
      whatsapp: { enabled: false, url: '' },
    };
    setFormEntity({ ...ent, cardType: ent.cardType || 'standard', socials });

    const photos = ent.productPhotos || [];
    const captions = ent.productPhotoCaptions || [];
    setIsProductPhotosEnabled(photos.length > 0);
    setPhotoSlot1(photos[0] || ''); setPhotoCaption1(captions[0] || '');
    setPhotoSlot2(photos[1] || ''); setPhotoCaption2(captions[1] || '');
    setPhotoSlot3(photos[2] || ''); setPhotoCaption3(captions[2] || '');
    setPhotoSlot4(photos[3] || ''); setPhotoCaption4(captions[4] || '');
    setPhotoSlot5(photos[4] || ''); setPhotoCaption5(captions[4] || '');
    setPhotoError(null);

    const existingAlbumPhotos = ent.albumPhotos || (photos.length > 0 ? photos.map((url, idx) => ({
      id: `ph-${idx}`,
      url,
      caption: captions[idx] || '',
      enabled: true,
    })) : []);

    if (existingAlbumPhotos.length > 0) {
      setTempAlbumPhotos(existingAlbumPhotos.map((p, idx) => ({ id: p.id || `ph-${idx}`, url: p.url, caption: p.caption || '' })));
    } else {
      setTempAlbumPhotos([{ id: 'ph-0', url: ent.image || '', caption: '' }]);
    }
  };

  const handleSaveEntity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEntity.name?.trim()) {
      alert('Nama entitas wajib diisi!');
      return;
    }

    // Validate Product Photos if Toggle is ON
    let finalPhotos: string[] = [];
    let finalCaptions: string[] = [];
    if (isProductPhotosEnabled) {
      if (!photoSlot1.trim()) {
        setPhotoError('Mohon isi minimal Gambar 1 (URL Gambar / Google Drive) karena fitur Foto Produk diaktifkan!');
        return;
      }
      const rawPairs = [
        { url: photoSlot1.trim(), caption: photoCaption1.trim() },
        { url: photoSlot2.trim(), caption: photoCaption2.trim() },
        { url: photoSlot3.trim(), caption: photoCaption3.trim() },
        { url: photoSlot4.trim(), caption: photoCaption4.trim() },
        { url: photoSlot5.trim(), caption: photoCaption5.trim() },
      ].filter((p) => Boolean(p.url));

      finalPhotos = rawPairs.map((p) => p.url);
      finalCaptions = rawPairs.map((p) => p.caption);
    }
    setPhotoError(null);

    // Validate Photo Album Photos if cardType === 'photo_album'
    let finalAlbumPhotos: any[] = [];
    if (formEntity.cardType === 'photo_album') {
      const validPhotos = tempAlbumPhotos.filter((p) => p.url.trim().length > 0).slice(0, 10);
      if (validPhotos.length === 0) {
        alert('Mohon masukkan minimal 1 foto untuk Format Photo Album!');
        return;
      }
      finalAlbumPhotos = validPhotos.map((p, idx) => ({
        id: p.id || `ph-${idx}`,
        url: p.url.trim(),
        caption: p.caption?.trim() || '',
        enabled: true,
      }));
    }

    const now = new Date().toISOString();
    const mainBannerImage = formEntity.cardType === 'photo_album' && finalAlbumPhotos.length > 0
      ? finalAlbumPhotos[0].url
      : (formEntity.image || IMAGE_PRESETS[0].url);

    const updatedEntityData = {
      ...formEntity,
      cardType: formEntity.cardType || 'standard',
      albumPhotos: finalAlbumPhotos,
      productPhotos: finalPhotos,
      productPhotoCaptions: finalCaptions,
      image: mainBannerImage,
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
      showToast(`Entitas "${formEntity.name}" berhasil diperbarui!`);
    } else {
      // Create new
      const newEnt: Entity = {
        id: `ent-${Date.now()}`,
        name: formEntity.name || 'Entitas Baru',
        category: formEntity.category || 'Pusat Hub',
        description: formEntity.description || '',
        image: mainBannerImage,
        cardType: formEntity.cardType || 'standard',
        albumPhotos: finalAlbumPhotos,
        ctaUrl: formEntity.ctaUrl || '#',
        ctaWording: formEntity.ctaWording || 'Kunjungi Tautan',
        instagram: formEntity.instagram || '',
        mediaUrl: formEntity.mediaUrl || '',
        contact: formEntity.contact || '',
        schedule: formEntity.schedule || '',
        address: formEntity.address || '',
        infoNotes: formEntity.infoNotes || '',
        isFeatured: formEntity.isFeatured || false,
        productPhotos: finalPhotos,
        productPhotoCaptions: finalCaptions,
        createdAt: now,
        updatedAt: now,
      };
      onSaveEntities([newEnt, ...entities]);
      showToast(`Entitas "${newEnt.name}" berhasil ditambahkan!`);

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
      <div className="bg-stone-50 rounded-2xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl border border-stone-300 overflow-hidden relative">

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
              alt="BJP HUB"
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
                    {isSuperAdmin ? 'Super Admin (Akses Penuh)' : `Admin Entitas (${allowedEntitiesInCMS.length} Entitas)`}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleExport}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-semibold border border-stone-700 transition-colors cursor-pointer"
              title="Download Backup File JSON Data"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Backup JSON</span>
            </button>

            {currentUser && (
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/80 hover:bg-red-900 text-red-200 rounded-xl text-xs font-bold border border-red-800/80 transition-colors cursor-pointer"
                title="Keluar dari Akun CMS"
              >
                <LogOut className="w-3.5 h-3.5 text-red-300" />
                <span>Keluar</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-xl transition-colors cursor-pointer"
              title="Tutup CMS"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
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
            <span>
              Data Unit Entitas ({isSuperAdmin ? entities.length : `${allowedEntitiesInCMS.length}/${entities.length}`})
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('entity_pages');
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'entity_pages'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-700" />
            <span>Kelola Halaman & Layout Entitas ({tempCategoryConfigs.length})</span>
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
            <span>Pengumuman & Running Text ({announcements.length})</span>
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
            <span>Navigasi & Branding Site</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('documents');
              setEditingDocTemplate(null);
              setIsCreatingDocTemplate(false);
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'documents'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>Template Dokumen ({tempDocumentTemplates.length})</span>
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
            <span>Polling & Google Form</span>
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
            <Building className="w-4 h-4 text-emerald-700" />
            <span>Pengaturan RT/RW ({tempRtRwConfig.rts ? tempRtRwConfig.rts.length : 0})</span>
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
                      </div>

                      {/* Card Format Selector (Default Standard vs Photo Album Carousel) */}
                      <div className="space-y-2 bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200/80">
                        <label className="text-xs font-bold text-emerald-950 flex items-center justify-between">
                          <span>3. Pilih Format Tampilan Card Entitas *</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold border border-emerald-300">
                            {formEntity.cardType === 'photo_album' ? '📷 Format Album Foto (Carousel)' : '🎴 Format Default Standard'}
                          </span>
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <button
                            type="button"
                            onClick={() => setFormEntity({ ...formEntity, cardType: 'standard' })}
                            className={`p-3 rounded-xl text-left border text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                              formEntity.cardType !== 'photo_album'
                                ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                            }`}
                          >
                            <LayoutGrid className="w-4 h-4 shrink-0" />
                            <div>
                              <div className="font-bold">Default Standard</div>
                              <div className="text-[10px] opacity-80 font-normal">Gambar banner, deskripsi, info & CTA</div>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setFormEntity({ ...formEntity, cardType: 'photo_album' });
                              if (tempAlbumPhotos.length === 0) {
                                setTempAlbumPhotos([{ id: 'ph-0', url: formEntity.image || IMAGE_PRESETS[0].url, caption: '' }]);
                              }
                            }}
                            className={`p-3 rounded-xl text-left border text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                              formEntity.cardType === 'photo_album'
                                ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                            }`}
                          >
                            <Images className="w-4 h-4 shrink-0 text-amber-300" />
                            <div>
                              <div className="font-bold">Photo Album (Carousel)</div>
                              <div className="text-[10px] opacity-80 font-normal">Carousel foto (max 10), caption & enlarge</div>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Photo Album Manager Section (Shown if cardType === 'photo_album') */}
                      {formEntity.cardType === 'photo_album' && (
                        <div className="bg-white p-4 rounded-2xl border-2 border-emerald-500/50 space-y-3 shadow-xs">
                          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                            <div className="flex items-center gap-2">
                              <Images className="w-4 h-4 text-emerald-700" />
                              <h4 className="text-xs font-bold text-stone-900">
                                Kelola Foto Album Carousel ({tempAlbumPhotos.length}/10 Foto)
                              </h4>
                            </div>
                            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              Maksimal 10 Foto per Card
                            </span>
                          </div>

                          <p className="text-[11px] text-stone-500">
                            Setiap foto di dalam album memiliki judul/keterangan foto (caption). Pengunjung dapat menggeser foto carousel dan mengklik foto untuk memperbesar tampilan (enlarge).
                          </p>

                          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                            {tempAlbumPhotos.map((photo, index) => (
                              <div key={photo.id || index} className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2 relative">
                                <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[10px] flex items-center justify-center font-extrabold">
                                      {index + 1}
                                    </span>
                                    <span>Foto Album #{index + 1}</span>
                                  </span>
                                  {tempAlbumPhotos.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => setTempAlbumPhotos(tempAlbumPhotos.filter((_, i) => i !== index))}
                                      className="text-red-600 hover:text-red-700 text-[11px] flex items-center gap-1 font-semibold cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                                    </button>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                                  <div className="sm:col-span-8 space-y-2">
                                    <div>
                                      <label className="text-[10px] font-bold text-stone-600 block mb-0.5">
                                        URL Foto / Link Gambar *
                                      </label>
                                      <input
                                        type="text"
                                        value={photo.url}
                                        onChange={(e) => {
                                          const updated = [...tempAlbumPhotos];
                                          updated[index].url = e.target.value;
                                          setTempAlbumPhotos(updated);
                                        }}
                                        placeholder="https://images.unsplash.com/... atau link Google Drive"
                                        className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-mono"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold text-stone-600 block mb-0.5">
                                        Caption / Teks Keterangan Foto
                                      </label>
                                      <input
                                        type="text"
                                        value={photo.caption}
                                        onChange={(e) => {
                                          const updated = [...tempAlbumPhotos];
                                          updated[index].caption = e.target.value;
                                          setTempAlbumPhotos(updated);
                                        }}
                                        placeholder="Contoh: Gotong royong pembersihan saluran air"
                                        className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs"
                                      />
                                    </div>
                                  </div>

                                  <div className="sm:col-span-4 h-24 bg-stone-200 rounded-lg overflow-hidden border border-stone-300 relative flex items-center justify-center">
                                    {photo.url ? (
                                      <img
                                        src={formatImageUrl(photo.url)}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80';
                                        }}
                                      />
                                    ) : (
                                      <span className="text-[10px] text-stone-400 font-medium">Belum ada foto</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {tempAlbumPhotos.length < 10 && (
                            <button
                              type="button"
                              onClick={() => {
                                setTempAlbumPhotos([
                                  ...tempAlbumPhotos,
                                  { id: `ph-${Date.now()}`, url: '', caption: '' }
                                ]);
                              }}
                              className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Tambah Foto Album (+{10 - tempAlbumPhotos.length} Sisa Slot)</span>
                            </button>
                          )}
                        </div>
                      )}

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

                              {/* 5 Photo Input Slots with Captions */}
                              {[
                                { label: 'Gambar 1', value: photoSlot1, onChange: setPhotoSlot1, caption: photoCaption1, onCaptionChange: setPhotoCaption1, isRequired: true },
                                { label: 'Gambar 2', value: photoSlot2, onChange: setPhotoSlot2, caption: photoCaption2, onCaptionChange: setPhotoCaption2, isRequired: false },
                                { label: 'Gambar 3', value: photoSlot3, onChange: setPhotoSlot3, caption: photoCaption3, onCaptionChange: setPhotoCaption3, isRequired: false },
                                { label: 'Gambar 4', value: photoSlot4, onChange: setPhotoSlot4, caption: photoCaption4, onCaptionChange: setPhotoCaption4, isRequired: false },
                                { label: 'Gambar 5', value: photoSlot5, onChange: setPhotoSlot5, caption: photoCaption5, onCaptionChange: setPhotoCaption5, isRequired: false },
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

                                  {/* Optional Caption Text Field */}
                                  <div className="pt-1">
                                    <input
                                      type="text"
                                      value={slot.caption}
                                      onChange={(e) => slot.onCaptionChange(e.target.value)}
                                      placeholder={`Keterangan / Deskripsi ${slot.label} (Opsional, contoh: Paket Hemat Nasi Kebuli Spesial)`}
                                      className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-stone-400 italic">
                              Fitur foto produk saat ini nonaktif. Aktifkan toggle di atas jika Anda ingin menginput galeri foto produk untuk entitas ini.
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
                            {formEntity.name || 'Nama Entitas Kegiatan'}
                          </div>
                        </div>

                        <div className="p-3 space-y-2">
                          <p className="text-stone-600 text-xs line-clamp-3">
                            {(formEntity.description || '').replace(/<[^>]*>?/gm, '') || 'Deskripsi entitas...'}
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
                        💡 <strong>Tips Pengurus:</strong> Setelah selesai menambah atau mengubah entitas, jangan lupa klik <strong>"Simpan Entitas Ini"</strong>. Anda dapat mengunduh backup JSON di tab Backup agar data tetap aman saat dipublish ke Vercel!
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
                          Akun Anda terdaftar sebagai <strong>Admin Entitas</strong>. Anda memiliki wewenang khusus untuk mengedit <strong>{allowedEntitiesInCMS.length} entitas</strong> berikut. Jika Anda menambah card baru, hak akses akan otomatis diberikan kepada Anda.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                    <div>
                      <h3 className="font-bold text-stone-900 text-base">
                        Kelola Entitas & Card Per Section ({isSuperAdmin ? `${entities.length} Card Total` : `${allowedEntitiesInCMS.length} Dari ${entities.length} Card Dikelola`})
                      </h3>
                      <p className="text-xs text-stone-500">Anda dapat menambah card baru di setiap section atau mengedit card yang memiliki hak akses.</p>
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
                    const sectionEntities = allowedEntitiesInCMS.filter(
                      (item) =>
                        item.category.toLowerCase().includes(cat.toLowerCase()) ||
                        cat.toLowerCase().includes(item.category.toLowerCase())
                    );

                    return (
                      <CollapsibleCard
                        key={cat}
                        title={cat}
                        subtitle={`Daftar card entitas di kategori ${cat}`}
                        badge={
                          <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            {sectionEntities.length} Card
                          </span>
                        }
                        icon={<LayoutGrid className="w-4 h-4 text-emerald-700" />}
                        defaultOpen={true}
                        headerAction={
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartNewEntity(cat);
                            }}
                            className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>+ Tambah Card</span>
                          </button>
                        }
                      >
                        {/* Cards Grid for this Section */}
                        {sectionEntities.length === 0 ? (
                          <div className="p-4 rounded-xl border border-dashed border-stone-200 text-center bg-stone-50/50 space-y-2">
                            <p className="text-xs text-stone-400 italic">Belum ada card di section "{cat}".</p>
                            <button
                              onClick={() => handleStartNewEntity(cat)}
                              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
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
                                        className="p-1 hover:bg-stone-200 text-stone-500 rounded-md cursor-pointer"
                                        title="Salin Entitas Ini"
                                      >
                                        <Copy className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteEntity(item.id, item.name)}
                                        className="p-1 hover:bg-red-50 text-red-600 rounded-md cursor-pointer"
                                        title="Hapus Entitas"
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
                                    className="flex items-center gap-1 bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-stone-200 hover:border-emerald-300 transition-colors cursor-pointer"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Edit Detail</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CollapsibleCard>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB: KELOLA HALAMAN & LAYOUT ENTITAS */}
          {activeTab === 'entity_pages' && (
            <div className="space-y-6 max-w-5xl mx-auto pb-6">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-emerald-700" />
                    <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                      Kelola Halaman Kategori Entitas & Opsi Layout
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newId = `Entitas Baru ${tempCategoryConfigs.length + 1}`;
                      setTempCategoryConfigs([
                        ...tempCategoryConfigs,
                        {
                          id: newId,
                          name: newId,
                          description: 'Deskripsi halaman entitas baru...',
                          logoUrl: '',
                          layoutType: 'default',
                        },
                      ]);
                      showToast('Entitas/Halaman baru telah ditambahkan. Silakan atur konfigurasi layout!');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Entitas / Page Baru</span>
                  </button>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  Di menu ini, Anda dapat menambahkan halaman entitas baru, mengunggah logo header kategori, dan memilih format layout halaman: <strong>Default Existing</strong> (format card grid), <strong>Photo Album</strong> (format album foto carousel), atau <strong>Single Page</strong> (halaman tunggal artikel hero image & rich text editor). Setiap pilihan layout langsung memiliki <strong>Preview Tampilan Live</strong>!
                </p>

                {/* Recommendation Banner */}
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-950">
                  <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold text-emerald-900 block">Rekomendasi Logo & Content Layout:</strong>
                    <span className="text-[11px] text-emerald-850 block mt-0.5">
                      Gunakan logo persegi HD (512x512px). Jika memilih tipe <strong>Single Page</strong>, pengunjung akan langsung melihat artikel / hero image utuh tanpa opsi pembuatan card.
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  {tempCategoryConfigs.map((catConfig) => (
                    <CollapsibleCard
                      key={catConfig.id}
                      title={
                        <span>
                          Halaman / Entitas: <strong className="text-emerald-800">{catConfig.name}</strong>
                        </span>
                      }
                      subtitle={`ID: ${catConfig.id}`}
                      badge={
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          catConfig.layoutType === 'single_page'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : catConfig.layoutType === 'photo_album'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          Layout: {catConfig.layoutType === 'single_page' ? 'Single Page' : catConfig.layoutType === 'photo_album' ? 'Photo Album' : 'Default Card'}
                        </span>
                      }
                      icon={<Layers className="w-4 h-4 text-emerald-700" />}
                      defaultOpen={true}
                      headerAction={
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Apakah Anda yakin ingin menghapus entitas "${catConfig.name}"?`)) {
                              setTempCategoryConfigs(tempCategoryConfigs.filter((c) => c.id !== catConfig.id));
                              showToast(`Entitas "${catConfig.name}" dihapus dari daftar halaman.`);
                            }
                          }}
                          className="p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Entitas"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      }
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Option Layout Selector */}
                        <div className="space-y-2 md:col-span-2 bg-white p-3.5 rounded-xl border border-stone-200">
                          <label className="text-xs font-bold text-stone-800 block">
                            Pilih Format Layout Halaman Entitas Ini:
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                setTempCategoryConfigs(
                                  tempCategoryConfigs.map((c) =>
                                    c.id === catConfig.id ? { ...c, layoutType: 'default' } : c
                                  )
                                );
                              }}
                              className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                                (catConfig.layoutType || 'default') === 'default'
                                  ? 'border-emerald-600 bg-emerald-50/60 shadow-2xs'
                                  : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Layout className="w-4 h-4 text-emerald-700" />
                                <span className="font-bold text-xs text-stone-900">1. Default Existing</span>
                              </div>
                              <p className="text-[11px] text-stone-500 leading-tight">
                                Menggunakan format daftar card standar (seperti kegiatan / UMKM existing).
                              </p>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setTempCategoryConfigs(
                                  tempCategoryConfigs.map((c) =>
                                    c.id === catConfig.id ? { ...c, layoutType: 'photo_album' } : c
                                  )
                                );
                              }}
                              className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                                catConfig.layoutType === 'photo_album'
                                  ? 'border-blue-600 bg-blue-50/60 shadow-2xs'
                                  : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Images className="w-4 h-4 text-blue-700" />
                                <span className="font-bold text-xs text-stone-900">2. Photo Album</span>
                              </div>
                              <p className="text-[11px] text-stone-500 leading-tight">
                                Tipe album foto galeri kegiatan (carousel slide, max 10 foto & caption).
                              </p>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setTempCategoryConfigs(
                                  tempCategoryConfigs.map((c) =>
                                    c.id === catConfig.id ? { ...c, layoutType: 'single_page' } : c
                                  )
                                );
                              }}
                              className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                                catConfig.layoutType === 'single_page'
                                  ? 'border-purple-600 bg-purple-50/60 shadow-2xs'
                                  : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <FileText className="w-4 h-4 text-purple-700" />
                                <span className="font-bold text-xs text-stone-900">3. Single Page</span>
                              </div>
                              <p className="text-[11px] text-stone-500 leading-tight">
                                Halaman tunggal langsung berisi Hero Image & Rich Text (tanpa opsi card).
                              </p>
                            </button>
                          </div>
                        </div>

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
                              <div className="w-14 h-14 rounded-xl bg-stone-100 border border-dashed border-stone-300 flex items-center justify-center shrink-0">
                                <ImageIcon className="w-5 h-5 text-stone-400" />
                              </div>
                            )}

                            <div className="flex-1 w-full space-y-2">
                              <input
                                type="text"
                                value={catConfig.logoUrl || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setTempCategoryConfigs(
                                    tempCategoryConfigs.map((c) =>
                                      c.id === catConfig.id ? { ...c, logoUrl: val } : c
                                    )
                                  );
                                }}
                                placeholder="URL Gambar / Google Drive Logo..."
                                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                              />
                              <div className="flex items-center gap-2">
                                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-medium border border-stone-300 transition-colors">
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
                                        reader.onload = (evt) => {
                                          const res = evt.target?.result as string;
                                          setTempCategoryConfigs(
                                            tempCategoryConfigs.map((c) =>
                                              c.id === catConfig.id ? { ...c, logoUrl: res } : c
                                            )
                                          );
                                          showToast('Logo berhasil diunggah!');
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                                </label>
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
                                    className="px-2.5 py-1 bg-stone-200 hover:bg-red-100 hover:text-red-700 text-stone-700 rounded-lg text-xs font-medium transition-colors"
                                  >
                                    Hapus Logo
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Nama Kategori / Rename Tab */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-stone-700 block">
                            Nama Entitas / Page:
                          </label>
                          <input
                            type="text"
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
                          <label className="text-xs font-bold text-stone-700 block">
                            Deskripsi Penjelasan Header:
                          </label>
                          <input
                            type="text"
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

                        {/* IF LAYOUT TYPE === 'single_page' -> Rich Text & Hero Image Config */}
                        {catConfig.layoutType === 'single_page' && (
                          <div className="space-y-3 md:col-span-2 bg-purple-50/50 p-4 rounded-xl border border-purple-200">
                            <div className="flex items-center justify-between border-b border-purple-200 pb-2">
                              <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 text-purple-700" />
                                Pengaturan Konten Single Page ({catConfig.name})
                              </span>
                              <span className="text-[10px] bg-purple-200 text-purple-900 px-2 py-0.5 rounded font-bold">
                                Hero Image + Rich Text
                              </span>
                            </div>

                            {/* Hero Image Field */}
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-stone-800 block">
                                URL Gambar Hero Banner Single Page:
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
                                placeholder="https://images.unsplash.com/... atau /images/..."
                                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                              />
                            </div>

                            {/* Quick Preset Template Buttons */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-stone-800 block">
                                Isikan Draf Konten Cepat (Preset Template):
                              </label>
                              <div className="flex flex-wrap items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const preset = `<h3>Visi & Misi Pengurus RW 11 Bintara Jaya Permai</h3>
<p>Menjadi kawasan permukiman yang aman, bersih, harmonis, religius, serta responsif berbasis teknologi digital dan gotong royong warga.</p>
<h4>Program Unggulan:</h4>
<ul>
  <li>Sistem Informasi & Layanan Digital Warga</li>
  <li>Pengelolaan Lingkungan & Bank Sampah Mandiri</li>
  <li>Keamanan Terpadu 24 Jam & CCTV Lingkungan</li>
  <li>Pembinaan UMKM Warga & Sentra Usaha</li>
</ul>`;
                                    setTempCategoryConfigs(
                                      tempCategoryConfigs.map((c) =>
                                        c.id === catConfig.id ? { ...c, singlePageContent: preset } : c
                                      )
                                    );
                                  }}
                                  className="px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-900 text-[11px] font-medium rounded-lg border border-purple-300 transition-colors"
                                >
                                  + Preset Visi Misi
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const preset = `<h3>Panduan Layanan Administrasi & Fasilitas Bersama</h3>
<p>Pengurus RW 11 menyediakan pelayanan administrasi kependudukan dan penyewaan fasilitas warga dengan ketentuan sebagai berikut:</p>
<h4>Jam Pelayanan Sekretariat:</h4>
<p>Senin - Sabtu: Pukul 09.00 - 17.00 WIB (Sekretariat RW 11)</p>
<h4>Persyaratan Pengurusan Surat Pengantar:</h4>
<ul>
  <li>Membawa FC KTP & Kartu Keluarga (KK)</li>
  <li>Bukti Lunas Iuran Pemeliharaan Lingkungan (IPL)</li>
  <li>Mengisi formulir permohonan online melalui portal BJP HUB</li>
</ul>`;
                                    setTempCategoryConfigs(
                                      tempCategoryConfigs.map((c) =>
                                        c.id === catConfig.id ? { ...c, singlePageContent: preset } : c
                                      )
                                    );
                                  }}
                                  className="px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-900 text-[11px] font-medium rounded-lg border border-purple-300 transition-colors"
                                >
                                  + Preset Panduan Layanan
                                </button>
                              </div>
                            </div>

                            {/* Rich Text Editor Field */}
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-stone-800 block">
                                Editor Isian Konten / Rich Text (HTML / Text Format):
                              </label>
                              <textarea
                                rows={6}
                                value={catConfig.singlePageContent || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setTempCategoryConfigs(
                                    tempCategoryConfigs.map((c) =>
                                      c.id === catConfig.id ? { ...c, singlePageContent: val } : c
                                    )
                                  );
                                }}
                                placeholder="Tuliskan isi artikel lengkap, deskripsi profil, atau panduan informasi warga di sini..."
                                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                              />
                            </div>
                          </div>
                        )}

                        {/* LIVE PREVIEW CARD FOR CHOSEN LAYOUT */}
                        <div className="md:col-span-2">
                          <LayoutPreviewCard catConfig={catConfig} />
                        </div>
                      </div>
                    </CollapsibleCard>
                  ))}
                </div>

                {/* Save Button */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">Simpan Konfigurasi Halaman & Layout Entitas</h4>
                    <p className="text-xs text-stone-500">
                      Klik simpan untuk menerapkan seluruh daftar entitas, logo kategori, dan pilihan layout halaman.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSaveSiteSettings({
                        ...siteSettings,
                        categoryConfigs: tempCategoryConfigs,
                      });
                      showToast('Konfigurasi halaman dan layout entitas berhasil disimpan!');
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-md transition-all shrink-0 cursor-pointer"
                  >
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Simpan Layout Entitas</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ANNOUNCEMENTS & RUNNING TEXT MANAGER */}
          {activeTab === 'announcements' && (
            <div className="space-y-6 max-w-5xl mx-auto pb-6">
              {/* HEADER SECTION: RUNNING TEXT CONFIGURATION */}
              <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-stone-900 text-white p-5 rounded-2xl shadow-md border border-emerald-700/50 space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-700/60 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                    <h3 className="font-extrabold text-sm sm:text-base">Pengaturan Running Text (Teks Berjalan Website)</h3>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer bg-emerald-800/80 px-3.5 py-1.5 rounded-xl border border-emerald-600/80 hover:bg-emerald-700 transition-colors">
                    <input
                      type="checkbox"
                      checked={tempRunningText.enabled}
                      onChange={(e) => setTempRunningText({ ...tempRunningText, enabled: e.target.checked })}
                      className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-400 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-emerald-100">
                      {tempRunningText.enabled ? 'Status: Running Text AKTIF' : 'Status: Running Text NONAKTIF'}
                    </span>
                  </label>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-emerald-200 block">
                      1. Isi Kalimat Pesan Running Text:
                    </label>
                    <input
                      type="text"
                      value={tempRunningText.text}
                      onChange={(e) => setTempRunningText({ ...tempRunningText, text: e.target.value })}
                      placeholder="📢 Tuliskan kalimat informasi singkat yang akan berjalan di header website..."
                      className="w-full px-3.5 py-2 bg-emerald-950/80 border border-emerald-600 rounded-xl text-xs sm:text-sm text-white placeholder:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-amber-400 font-sans"
                    />
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
                    <div className="text-[11px] text-emerald-200 overflow-hidden max-w-xl">
                      <strong>Tampilan Preview:</strong>{' '}
                      <span className="font-mono text-amber-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 inline-block truncate max-w-md">
                        {tempRunningText.enabled ? tempRunningText.text : '(Running text dinonaktifkan)'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onSaveSiteSettings({
                          ...siteSettings,
                          runningText: tempRunningText,
                        });
                        showToast('Pengaturan running text berhasil disimpan!');
                      }}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black rounded-xl text-xs transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Simpan Running Text</span>
                    </button>
                  </div>
                </div>
              </div>

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
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                    <div>
                      <h3 className="font-bold text-stone-900 text-base">Kelola & Urutkan Pengumuman Warga ({announcements.length})</h3>
                      <p className="text-xs text-stone-500">Tarik ikon pegangan (Drag & Drop) atau gunakan tombol panah untuk mengubah urutan posisi pengumuman.</p>
                    </div>
                    <button
                      onClick={() => setIsCreatingAnn(true)}
                      className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Buat Pengumuman Baru</span>
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
                      Kelola identitas visual logo web, Favicon, OG Image, serta posisi dan nama tab navigasi navbar.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 1: Upload Logo Website */}
              <div className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs ${
                expandedSiteSection === 1 ? 'border-emerald-500/80 ring-1 ring-emerald-500/20' : 'border-stone-200 hover:border-stone-300'
              }`}>
                <div
                  onClick={() => setExpandedSiteSection(expandedSiteSection === 1 ? null : 1)}
                  className="w-full p-4 sm:p-5 bg-white hover:bg-stone-50/80 flex items-center justify-between cursor-pointer select-none transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl transition-colors ${expandedSiteSection === 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'}`}>
                      <Palette className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-stone-900 text-sm sm:text-base">
                          1. Upload Logo Website & Identitas Web
                        </h4>
                        <span className="text-[11px] bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200 hidden sm:inline-block">
                          Satu Logo untuk Semua
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Kelola logo website, judul homepage, deskripsi, dan pratinjau favicon.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      expandedSiteSection === 1 ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}>
                      <span>{expandedSiteSection === 1 ? 'Tutup' : 'Buka & Atur'}</span>
                      {expandedSiteSection === 1 ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4 text-stone-600" />}
                    </div>
                  </div>
                </div>

                {expandedSiteSection === 1 && (
                  <div className="p-4 sm:p-6 pt-2 border-t border-stone-100 space-y-5">
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
                            placeholder="BJP HUB Bintara Jaya Permai"
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
                            setTempSiteTitle('BJP HUB Bintara Jaya Permai');
                            setTempSiteDescription('Portal Resmi Ekosistem & Kegiatan Warga Komplek Bintara Jaya Permai (RW 11)');
                          }}
                          className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg border border-stone-200 font-medium transition-colors cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
                          <span>Kembalikan ke Identitas Default</span>
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
                )}
              </div>

              {/* Section 2: Reposisi & Rename Tab Navbar */}
              <div className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs ${
                expandedSiteSection === 2 ? 'border-amber-500/80 ring-1 ring-amber-500/20' : 'border-stone-200 hover:border-stone-300'
              }`}>
                <div
                  onClick={() => setExpandedSiteSection(expandedSiteSection === 2 ? null : 2)}
                  className="w-full p-4 sm:p-5 bg-white hover:bg-stone-50/80 flex items-center justify-between cursor-pointer select-none transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl transition-colors ${expandedSiteSection === 2 ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-600'}`}>
                      <Sliders className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-stone-900 text-sm sm:text-base">
                          2. Reposisi & Rename Tab Navigasi Navbar
                        </h4>
                        <span className="text-[11px] bg-amber-50 text-amber-800 font-semibold px-2.5 py-0.5 rounded-full border border-amber-200 hidden sm:inline-block">
                          {tempNavbarTabs.filter((t) => t.enabled).length} Tab Aktif
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Atur posisi urutan (reposisi) dan ubah nama label (rename) tab navbar.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      expandedSiteSection === 2 ? 'bg-amber-800 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}>
                      <span>{expandedSiteSection === 2 ? 'Tutup' : 'Buka & Atur'}</span>
                      {expandedSiteSection === 2 ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4 text-stone-600" />}
                    </div>
                  </div>
                </div>

                {expandedSiteSection === 2 && (
                  <div className="p-4 sm:p-6 pt-2 border-t border-stone-100 space-y-5">
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
                                {tab.id === 'entities' ? 'Tab Entitas' : 'Tab Pengumuman'}
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
                      <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-stone-300 shadow-2xs overflow-x-auto">
                        {[...tempNavbarTabs]
                          .filter((t) => t.enabled)
                          .sort((a, b) => a.order - b.order)
                          .map((t, index) => (
                            <div
                              key={t.id}
                              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 shrink-0 ${
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
                )}
              </div>

              {/* Section 3: Kelola Logo, Nama Tab, Layout & Single Page Content per Entitas / Kategori */}
              <div className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs ${
                expandedSiteSection === 3 ? 'border-emerald-500/80 ring-1 ring-emerald-500/20' : 'border-stone-200 hover:border-stone-300'
              }`}>
                <div
                  onClick={() => setExpandedSiteSection(expandedSiteSection === 3 ? null : 3)}
                  className="w-full p-4 sm:p-5 bg-white hover:bg-stone-50/80 flex items-center justify-between cursor-pointer select-none transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl transition-colors ${expandedSiteSection === 3 ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'}`}>
                      <LayoutGrid className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-stone-900 text-sm sm:text-base">
                          3. Kelola Entitas Baru & Opsi Layout Halaman
                        </h4>
                        <span className="text-[11px] bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200 hidden sm:inline-block">
                          {tempCategoryConfigs.length} Entitas Terdaftar
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Tambah entitas/halaman baru, atur logo, serta pilih format layout (Default Card, Photo Album, Single Page).
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      expandedSiteSection === 3 ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}>
                      <span>{expandedSiteSection === 3 ? 'Tutup' : 'Buka & Atur'}</span>
                      {expandedSiteSection === 3 ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4 text-stone-600" />}
                    </div>
                  </div>
                </div>

                {expandedSiteSection === 3 && (
                  <div className="p-4 sm:p-6 pt-2 border-t border-stone-100 space-y-5">
                    <div className="flex justify-between items-center pb-2">
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Pilih opsi layout untuk setiap halaman entitas: <strong>Default Existing</strong> (format card biasa), <strong>Photo Album</strong> (format album foto carousel), atau <strong>Single Page</strong> (halaman tunggal dengan hero image & rich text editor).
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          const newId = `Entitas Baru ${tempCategoryConfigs.length + 1}`;
                          setTempCategoryConfigs([
                            ...tempCategoryConfigs,
                            {
                              id: newId,
                              name: newId,
                              description: 'Deskripsi halaman entitas baru...',
                              logoUrl: '',
                              layoutType: 'default',
                            },
                          ]);
                          showToast('Entitas/Halaman baru telah ditambahkan. Silakan atur konfigurasi layout!');
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Entitas Baru</span>
                      </button>
                    </div>

                    {/* Recommendation Banner */}
                    <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-950">
                      <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold text-emerald-900 block">Rekomendasi Logo & Content Layout:</strong>
                        <span className="text-[11px] text-emerald-850 block mt-0.5">
                          Gunakan logo persegi HD (512x512px). Jika memilih tipe <strong>Single Page</strong>, pengunjung akan langsung melihat artikel / hero image utuh tanpa opsi pembuatan card.
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
                              Halaman / Entitas: <strong className="text-emerald-800">{catConfig.name}</strong>
                              <span className="text-[10px] text-stone-400 font-mono font-normal">({catConfig.id})</span>
                            </span>

                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                catConfig.layoutType === 'single_page'
                                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                  : catConfig.layoutType === 'photo_album'
                                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}>
                                Layout: {catConfig.layoutType === 'single_page' ? 'Single Page' : catConfig.layoutType === 'photo_album' ? 'Photo Album' : 'Default Card'}
                              </span>

                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Apakah Anda yakin ingin menghapus entitas "${catConfig.name}"?`)) {
                                    setTempCategoryConfigs(tempCategoryConfigs.filter((c) => c.id !== catConfig.id));
                                    showToast(`Entitas "${catConfig.name}" dihapus dari navigasi.`);
                                  }
                                }}
                                className="p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Hapus Entitas"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Option Layout Selector */}
                            <div className="space-y-2 md:col-span-2 bg-white p-3.5 rounded-xl border border-stone-200">
                              <label className="text-xs font-bold text-stone-800 block">
                                Pilih Format Layout Halaman Entitas Ini:
                              </label>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTempCategoryConfigs(
                                      tempCategoryConfigs.map((c) =>
                                        c.id === catConfig.id ? { ...c, layoutType: 'default' } : c
                                      )
                                    );
                                  }}
                                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                                    (catConfig.layoutType || 'default') === 'default'
                                      ? 'border-emerald-600 bg-emerald-50/60 shadow-2xs'
                                      : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <Layout className="w-4 h-4 text-emerald-700" />
                                    <span className="font-bold text-xs text-stone-900">1. Default Existing</span>
                                  </div>
                                  <p className="text-[11px] text-stone-500 leading-tight">
                                    Menggunakan format daftar card standar (seperti kegiatan / UMKM existing).
                                  </p>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setTempCategoryConfigs(
                                      tempCategoryConfigs.map((c) =>
                                        c.id === catConfig.id ? { ...c, layoutType: 'photo_album' } : c
                                      )
                                    );
                                  }}
                                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                                    catConfig.layoutType === 'photo_album'
                                      ? 'border-blue-600 bg-blue-50/60 shadow-2xs'
                                      : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <Images className="w-4 h-4 text-blue-700" />
                                    <span className="font-bold text-xs text-stone-900">2. Photo Album</span>
                                  </div>
                                  <p className="text-[11px] text-stone-500 leading-tight">
                                    Tipe album foto galeri kegiatan (carousel slide, max 10 foto & caption).
                                  </p>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setTempCategoryConfigs(
                                      tempCategoryConfigs.map((c) =>
                                        c.id === catConfig.id ? { ...c, layoutType: 'single_page' } : c
                                      )
                                    );
                                  }}
                                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                                    catConfig.layoutType === 'single_page'
                                      ? 'border-purple-600 bg-purple-50/60 shadow-2xs'
                                      : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <FileText className="w-4 h-4 text-purple-700" />
                                    <span className="font-bold text-xs text-stone-900">3. Single Page</span>
                                  </div>
                                  <p className="text-[11px] text-stone-500 leading-tight">
                                    Halaman tunggal langsung berisi Hero Image & Rich Text (tanpa opsi card).
                                  </p>
                                </button>
                              </div>
                            </div>

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
                                      className="flex-1 min-w-[220px] px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
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
                                        Hapus Logo
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Nama Kategori / Rename Tab */}
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-stone-700 block">
                                Nama Entitas / Page:
                              </label>
                              <input
                                type="text"
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
                              <label className="text-xs font-bold text-stone-700 block">
                                Deskripsi Penjelasan Header:
                              </label>
                              <input
                                type="text"
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

                            {/* IF LAYOUT TYPE === 'single_page' -> Rich Text & Hero Image Config */}
                            {catConfig.layoutType === 'single_page' && (
                              <div className="space-y-3 md:col-span-2 bg-purple-50/50 p-4 rounded-xl border border-purple-200">
                                <div className="flex items-center justify-between border-b border-purple-200 pb-2">
                                  <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                                    <Sparkles className="w-4 h-4 text-purple-700" />
                                    Pengaturan Konten Single Page ({catConfig.name})
                                  </span>
                                  <span className="text-[10px] bg-purple-200 text-purple-900 px-2 py-0.5 rounded font-bold">
                                    Hero Image + Rich Text
                                  </span>
                                </div>

                                {/* Hero Image Field */}
                                <div className="space-y-1">
                                  <label className="text-xs font-bold text-stone-800 block">
                                    URL Gambar Hero Banner Single Page:
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
                                    placeholder="https://images.unsplash.com/... atau /images/..."
                                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                  />
                                </div>

                                {/* Quick Preset Template Buttons */}
                                <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-stone-800 block">
                                    Isikan Draf Konten Cepat (Preset Template):
                                  </label>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const preset = `<h3>Visi & Misi Pengurus RW 11 Bintara Jaya Permai</h3>
<p>Menjadi kawasan permukiman yang aman, bersih, harmonis, religius, serta responsif berbasis teknologi digital dan gotong royong warga.</p>
<h4>Program Unggulan:</h4>
<ul>
  <li>Sistem Informasi & Layanan Digital Warga</li>
  <li>Pengelolaan Lingkungan & Bank Sampah Mandiri</li>
  <li>Keamanan Terpadu 24 Jam & CCTV Lingkungan</li>
  <li>Pembinaan UMKM Warga & Sentra Usaha</li>
</ul>`;
                                        setTempCategoryConfigs(
                                          tempCategoryConfigs.map((c) =>
                                            c.id === catConfig.id ? { ...c, singlePageContent: preset } : c
                                          )
                                        );
                                      }}
                                      className="px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-900 text-[11px] font-medium rounded-lg border border-purple-300 transition-colors"
                                    >
                                      + Preset Visi Misi
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        const preset = `<h3>Panduan Layanan Administrasi & Fasilitas Bersama</h3>
<p>Pengurus RW 11 menyediakan pelayanan administrasi kependudukan dan penyewaan fasilitas warga dengan ketentuan sebagai berikut:</p>
<h4>Jam Pelayanan Sekretariat:</h4>
<p>Senin - Sabtu: Pukul 09.00 - 17.00 WIB (Sekretariat RW 11)</p>
<h4>Persyaratan Pengurusan Surat Pengantar:</h4>
<ul>
  <li>Membawa FC KTP & Kartu Keluarga (KK)</li>
  <li>Bukti Lunas Iuran Pemeliharaan Lingkungan (IPL)</li>
  <li>Mengisi formulir permohonan online melalui portal BJP HUB</li>
</ul>`;
                                        setTempCategoryConfigs(
                                          tempCategoryConfigs.map((c) =>
                                            c.id === catConfig.id ? { ...c, singlePageContent: preset } : c
                                          )
                                        );
                                      }}
                                      className="px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-900 text-[11px] font-medium rounded-lg border border-purple-300 transition-colors"
                                    >
                                      + Preset Panduan Layanan
                                    </button>
                                  </div>
                                </div>

                                {/* Rich Text Editor Field */}
                                <div className="space-y-1">
                                  <label className="text-xs font-bold text-stone-800 block">
                                    Editor Isian Konten / Rich Text (HTML / Text Format):
                                  </label>
                                  <textarea
                                    rows={6}
                                    value={catConfig.singlePageContent || ''}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setTempCategoryConfigs(
                                        tempCategoryConfigs.map((c) =>
                                          c.id === catConfig.id ? { ...c, singlePageContent: val } : c
                                        )
                                      );
                                    }}
                                    placeholder="Tuliskan isi artikel lengkap, deskripsi profil, atau panduan informasi warga di sini..."
                                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Section 4: Pengaturan 3 Section Media Feeds & Dokumentasi (Slide Terbaru, Album Foto, Album Video) */}
              <div className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs ${
                expandedSiteSection === 4 ? 'border-emerald-500/80 ring-1 ring-emerald-500/20' : 'border-stone-200 hover:border-stone-300'
              }`}>
                <div
                  onClick={() => setExpandedSiteSection(expandedSiteSection === 4 ? null : 4)}
                  className="w-full p-4 sm:p-5 bg-white hover:bg-stone-50/80 flex items-center justify-between cursor-pointer select-none transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl transition-colors ${expandedSiteSection === 4 ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'}`}>
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-stone-900 text-sm sm:text-base">
                          4. Pengaturan Media Feeds (3 Section: Slide Terbaru, Album Foto, Album Video)
                        </h4>
                        <span className="text-[11px] bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200 hidden sm:inline-block">
                          {tempSocialFeeds.length} Total Feeds
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Atur URL Embed, Judul, Deskripsi, dan Toggle On/Off untuk galeri feeds.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      expandedSiteSection === 4 ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}>
                      <span>{expandedSiteSection === 4 ? 'Tutup' : 'Buka & Atur'}</span>
                      {expandedSiteSection === 4 ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4 text-stone-600" />}
                    </div>
                  </div>
                </div>

                {expandedSiteSection === 4 && (
                  <div className="p-4 sm:p-6 pt-2 border-t border-stone-100 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                      <p className="text-xs text-stone-600">
                        Atur URL Embed, Judul, Deskripsi, dan Toggle On/Off untuk masing-masing 3 section galeri feeds @bintarajayapermai.ofc.
                      </p>
                      {tempSocialFeeds.filter(f => (cmsFeedSection === 'terbaru' ? (!f.section || f.section === 'terbaru') : f.section === cmsFeedSection)).length < 5 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newFeed: SocialFeedItem = {
                              id: `feed-${Date.now()}`,
                              title: 'Konten Feeds Baru',
                              description: 'Deskripsi informasi terkini...',
                              url: 'https://www.instagram.com/bintarajayapermai.ofc/',
                              platform: 'instagram',
                              section: cmsFeedSection,
                              enabled: true,
                              order: tempSocialFeeds.length,
                            };
                            setTempSocialFeeds([...tempSocialFeeds, newFeed]);
                          }}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah Konten ({tempSocialFeeds.filter(f => (cmsFeedSection === 'terbaru' ? (!f.section || f.section === 'terbaru') : f.section === cmsFeedSection)).length}/5)</span>
                        </button>
                      )}
                    </div>

                    {/* Sub-Section Selector Tabs */}
                    <div className="flex flex-wrap items-center gap-2 p-1.5 bg-stone-100 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setCmsFeedSection('terbaru')}
                        className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                          cmsFeedSection === 'terbaru'
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Slide Konten Terbaru</span>
                        <span className="px-1.5 py-0.2 bg-black/20 rounded text-[10px]">
                          {tempSocialFeeds.filter(f => !f.section || f.section === 'terbaru').length}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCmsFeedSection('album_foto')}
                        className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                          cmsFeedSection === 'album_foto'
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
                        }`}
                      >
                        <Images className="w-3.5 h-3.5" />
                        <span>Album Foto BJP</span>
                        <span className="px-1.5 py-0.2 bg-black/20 rounded text-[10px]">
                          {tempSocialFeeds.filter(f => f.section === 'album_foto').length}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCmsFeedSection('album_video')}
                        className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                          cmsFeedSection === 'album_video'
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
                        }`}
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Album Video BJP</span>
                        <span className="px-1.5 py-0.2 bg-black/20 rounded text-[10px]">
                          {tempSocialFeeds.filter(f => f.section === 'album_video').length}
                        </span>
                      </button>
                    </div>

                    {/* Feeds Items for Selected Sub-Section */}
                    <div className="space-y-4">
                      {tempSocialFeeds
                        .filter(f => (cmsFeedSection === 'terbaru' ? (!f.section || f.section === 'terbaru') : f.section === cmsFeedSection))
                        .map((feed, idx) => (
                          <div
                            key={feed.id}
                            className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3.5 relative"
                          >
                            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-stone-900 text-amber-300 font-extrabold text-xs flex items-center justify-center">
                                  #{idx + 1}
                                </span>
                                <span className="text-xs font-bold text-stone-800">
                                  {feed.title || `Konten #${idx + 1}`}
                                </span>
                              </div>

                              <div className="flex items-center gap-3">
                                {/* Toggle On/Off */}
                                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-700">
                                  <input
                                    type="checkbox"
                                    checked={feed.enabled}
                                    onChange={(e) => {
                                      const isChecked = e.target.checked;
                                      setTempSocialFeeds(
                                        tempSocialFeeds.map((item) =>
                                          item.id === feed.id ? { ...item, enabled: isChecked } : item
                                        )
                                      );
                                    }}
                                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                                  />
                                  <span className={feed.enabled ? 'text-emerald-700 font-extrabold' : 'text-stone-400'}>
                                    {feed.enabled ? 'Aktif' : 'Nonaktif'}
                                  </span>
                                </label>

                                {/* Delete Item */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTempSocialFeeds(tempSocialFeeds.filter((item) => item.id !== feed.id));
                                  }}
                                  className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  title="Hapus Konten Ini"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                              {/* Field 1: Embed URL */}
                              <div className="space-y-1">
                                <label className="font-bold text-stone-700 block">
                                  URL Tautan (Embed / YouTube / Instagram):
                                </label>
                                <input
                                  type="text"
                                  value={feed.url}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    let newPlatform: 'youtube' | 'instagram' | 'tiktok' | 'other' = 'other';
                                    if (val.includes('youtube.com') || val.includes('youtu.be')) newPlatform = 'youtube';
                                    else if (val.includes('instagram.com')) newPlatform = 'instagram';
                                    else if (val.includes('tiktok.com')) newPlatform = 'tiktok';

                                    setTempSocialFeeds(
                                      tempSocialFeeds.map((item) =>
                                        item.id === feed.id ? { ...item, url: val, platform: newPlatform } : item
                                      )
                                    );
                                  }}
                                  placeholder="https://www.youtube.com/watch?v=... atau https://www.instagram.com/p/..."
                                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                                />
                              </div>

                              {/* Field 2: Judul Konten */}
                              <div className="space-y-1">
                                <label className="font-bold text-stone-700 block">Judul Konten Feeds:</label>
                                <input
                                  type="text"
                                  value={feed.title}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setTempSocialFeeds(
                                      tempSocialFeeds.map((item) =>
                                        item.id === feed.id ? { ...item, title: val } : item
                                      )
                                    );
                                  }}
                                  placeholder="Judul tayangan feeds..."
                                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl font-bold text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                                />
                              </div>

                              {/* Field 3: Deskripsi Teks */}
                              <div className="md:col-span-2 space-y-1">
                                <label className="font-bold text-stone-700 block">Deskripsi Penjelasan Konten:</label>
                                <textarea
                                  rows={2}
                                  value={feed.description}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setTempSocialFeeds(
                                      tempSocialFeeds.map((item) =>
                                        item.id === feed.id ? { ...item, description: val } : item
                                      )
                                    );
                                  }}
                                  placeholder="Tuliskan deskripsi ringkas tayangan..."
                                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none resize-none"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Section 5: Pengaturan Media Partner & Komunitas (Slider Logo & Sosmed) */}
              <div className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs ${
                expandedSiteSection === 5 ? 'border-amber-500/80 ring-1 ring-amber-500/20' : 'border-stone-200 hover:border-stone-300'
              }`}>
                <div
                  onClick={() => setExpandedSiteSection(expandedSiteSection === 5 ? null : 5)}
                  className="w-full p-4 sm:p-5 bg-white hover:bg-stone-50/80 flex items-center justify-between cursor-pointer select-none transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl transition-colors ${expandedSiteSection === 5 ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-600'}`}>
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-stone-900 text-sm sm:text-base">
                          5. Pengaturan Media Partner
                        </h4>
                        <span className="text-[11px] bg-amber-50 text-amber-800 font-semibold px-2.5 py-0.5 rounded-full border border-amber-200 hidden sm:inline-block">
                          {tempMediaPartners.filter((p) => p.enabled).length} Partner Aktif
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Atur logo, nama media partner, serta toggle & URL Instagram dan YouTube.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      expandedSiteSection === 5 ? 'bg-amber-800 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}>
                      <span>{expandedSiteSection === 5 ? 'Tutup' : 'Buka & Atur'}</span>
                      {expandedSiteSection === 5 ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4 text-stone-600" />}
                    </div>
                  </div>
                </div>

                {expandedSiteSection === 5 && (
                  <div className="p-4 sm:p-6 pt-2 border-t border-stone-100 space-y-5">
                    <div className="flex justify-between items-center pb-1">
                      <p className="text-xs text-stone-600">
                        Atur logo, nama media partner/komunitas, serta toggle & URL Instagram dan YouTube.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          const newPartner: MediaPartnerItem = {
                            id: `mp-${Date.now()}`,
                            name: 'Nama Partner Baru',
                            logoUrl: '',
                            instagramUrl: 'https://www.instagram.com/',
                            instagramEnabled: true,
                            youtubeUrl: '',
                            youtubeEnabled: false,
                            enabled: true,
                            order: tempMediaPartners.length,
                          };
                          setTempMediaPartners([...tempMediaPartners, newPartner]);
                        }}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Media Partner</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {tempMediaPartners.map((partner, pIdx) => (
                        <div
                          key={partner.id}
                          className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3.5 relative"
                        >
                          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-extrabold text-xs flex items-center justify-center">
                                #{pIdx + 1}
                              </span>
                              <span className="text-xs font-bold text-stone-900">
                                {partner.name || `Partner #${pIdx + 1}`}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-700">
                                <input
                                  type="checkbox"
                                  checked={partner.enabled}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    setTempMediaPartners(
                                      tempMediaPartners.map((p) =>
                                        p.id === partner.id ? { ...p, enabled: isChecked } : p
                                      )
                                    );
                                  }}
                                  className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 cursor-pointer"
                                />
                                <span className={partner.enabled ? 'text-amber-700 font-extrabold' : 'text-stone-400'}>
                                  {partner.enabled ? 'Aktif' : 'Nonaktif'}
                                </span>
                              </label>

                              <button
                                type="button"
                                onClick={() => {
                                  setTempMediaPartners(tempMediaPartners.filter((p) => p.id !== partner.id));
                                }}
                                className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Hapus Partner Ini"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            {/* Nama Partner */}
                            <div className="space-y-1">
                              <label className="font-bold text-stone-700 block">Nama Partner / Komunitas:</label>
                              <input
                                type="text"
                                value={partner.name}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setTempMediaPartners(
                                    tempMediaPartners.map((p) =>
                                      p.id === partner.id ? { ...p, name: val } : p
                                    )
                                  );
                                }}
                                placeholder="Contoh: Bintarajayapermai.ofc"
                                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl font-bold text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                              />
                            </div>

                            {/* URL Logo */}
                            <div className="space-y-1">
                              <label className="font-bold text-stone-700 block">URL Logo / Foto Partner:</label>
                              <input
                                type="text"
                                value={partner.logoUrl || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setTempMediaPartners(
                                    tempMediaPartners.map((p) =>
                                      p.id === partner.id ? { ...p, logoUrl: val } : p
                                    )
                                  );
                                }}
                                placeholder="https://... atau upload gambar"
                                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                              />
                            </div>

                            {/* Instagram Link Toggle & URL */}
                            <div className="space-y-1.5 bg-white p-2.5 rounded-xl border border-stone-200">
                              <div className="flex items-center justify-between">
                                <label className="font-bold text-stone-800 flex items-center gap-1.5">
                                  <Instagram className="w-3.5 h-3.5 text-pink-500" />
                                  <span>Instagram URL</span>
                                </label>
                                <input
                                  type="checkbox"
                                  checked={partner.instagramEnabled ?? true}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    setTempMediaPartners(
                                      tempMediaPartners.map((p) =>
                                        p.id === partner.id ? { ...p, instagramEnabled: isChecked } : p
                                      )
                                    );
                                  }}
                                  className="w-3.5 h-3.5 text-pink-600 rounded cursor-pointer"
                                />
                              </div>
                              <input
                                type="text"
                                value={partner.instagramUrl || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setTempMediaPartners(
                                    tempMediaPartners.map((p) =>
                                      p.id === partner.id ? { ...p, instagramUrl: val } : p
                                    )
                                  );
                                }}
                                placeholder="https://www.instagram.com/..."
                                className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono focus:outline-none"
                              />
                            </div>

                            {/* YouTube Link Toggle & URL */}
                            <div className="space-y-1.5 bg-white p-2.5 rounded-xl border border-stone-200">
                              <div className="flex items-center justify-between">
                                <label className="font-bold text-stone-800 flex items-center gap-1.5">
                                  <Youtube className="w-3.5 h-3.5 text-red-500" />
                                  <span>YouTube URL</span>
                                </label>
                                <input
                                  type="checkbox"
                                  checked={partner.youtubeEnabled ?? false}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    setTempMediaPartners(
                                      tempMediaPartners.map((p) =>
                                        p.id === partner.id ? { ...p, youtubeEnabled: isChecked } : p
                                      )
                                    );
                                  }}
                                  className="w-3.5 h-3.5 text-red-600 rounded cursor-pointer"
                                />
                              </div>
                              <input
                                type="text"
                                value={partner.youtubeUrl || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setTempMediaPartners(
                                    tempMediaPartners.map((p) =>
                                      p.id === partner.id ? { ...p, youtubeUrl: val } : p
                                    )
                                  );
                                }}
                                placeholder="https://www.youtube.com/@..."
                                className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Save All Settings Button */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Simpan Perubahan Navigasi, Branding & Media</h4>
                  <p className="text-xs text-stone-500">
                    Klik tombol di samping untuk menerapkan seluruh konfigurasi logo, susunan tab navbar, layout entitas, 3 section media feeds, dan media partner secara langsung.
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
                      documentTemplates: tempDocumentTemplates,
                      pollingConfig: tempPollingConfig,
                      socialFeeds: tempSocialFeeds,
                      mediaPartners: tempMediaPartners,
                    });
                    showToast('Pengaturan navigasi, branding, layout, media feeds, dan media partner berhasil disimpan!');
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-md transition-all shrink-0 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Pengaturan</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: DOWNLOAD DOKUMEN / TEMPLATE SURAT */}
          {activeTab === 'documents' && (
            <div className="space-y-6 max-w-5xl mx-auto pb-6">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                  <div>
                    <h3 className="font-extrabold text-stone-900 text-base sm:text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5 text-emerald-700" />
                      Pengaturan Template Dokumen & Surat Menyurat
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Kelola daftar template surat resmi (RT/RW) yang dapat diunduh atau digenerate otomatis oleh warga.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingDocTemplate(null);
                      setIsCreatingDocTemplate(true);
                      setDocTemplateMode('upload');
                      setFormDocTemplate({
                        title: '',
                        code: `SURAT_${Date.now()}`,
                        category: 'Pemerintahan / Kependudukan',
                        description: 'Surat pengantar resmi pengurus RW 11 Bintara Jaya Permai.',
                        templateBody: `SURAT PENGANTAR RT/RW
Nomor: [NOMOR_SURAT]

Yang bertanda tangan di bawah ini Pengurus RW 11 Bintara Jaya Permai menerangkan bahwa:
Nama: [NAMA_WARGA]
NIK: [NIK]
Alamat: [ALAMAT]

Adalah benar warga Bintara Jaya Permai yang memerlukan surat untuk keperluan: [KEBUTUHAN].`,
                        enabled: true,
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Template Dokumen</span>
                  </button>
                </div>

                {/* FORM CREATE / EDIT DOCUMENT TEMPLATE */}
                {(isCreatingDocTemplate || editingDocTemplate) && (
                  <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-4">
                    <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                      <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-emerald-700" />
                        {editingDocTemplate ? `Edit Template: ${editingDocTemplate.title}` : 'Buat Template Dokumen Baru'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingDocTemplate(null);
                          setIsCreatingDocTemplate(false);
                        }}
                        className="text-xs text-stone-500 hover:text-stone-800 font-semibold"
                      >
                        Batal
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-800">Nama Dokumen:</label>
                        <input
                          type="text"
                          required
                          value={formDocTemplate.title || ''}
                          onChange={(e) => setFormDocTemplate({ ...formDocTemplate, title: e.target.value })}
                          placeholder="Contoh: Surat Pengantar RT/RW, Surat Keterangan Domisili"
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-800">Kode Dokumen:</label>
                        <input
                          type="text"
                          required
                          value={formDocTemplate.code || ''}
                          onChange={(e) => setFormDocTemplate({ ...formDocTemplate, code: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                          placeholder="SURAT_PENGANTAR_RTRW"
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-800">Kategori Dokumen:</label>
                        <input
                          type="text"
                          value={formDocTemplate.category || ''}
                          onChange={(e) => setFormDocTemplate({ ...formDocTemplate, category: e.target.value })}
                          placeholder="Kependudukan / Usaha / UMKM"
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-800">Status Aktif:</label>
                        <label className="flex items-center gap-2 pt-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formDocTemplate.enabled !== false}
                            onChange={(e) => setFormDocTemplate({ ...formDocTemplate, enabled: e.target.checked })}
                            className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                          />
                          <span className="text-xs font-semibold text-stone-800">Tampilkan Dokumen Ini di Layanan Unduh</span>
                        </label>
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-bold text-stone-800">Deskripsi Singkat Dokumen:</label>
                        <input
                          type="text"
                          value={formDocTemplate.description || ''}
                          onChange={(e) => setFormDocTemplate({ ...formDocTemplate, description: e.target.value })}
                          placeholder="Penjelasan fungsi dan persyaratan kelengkapan berkas..."
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>

                      {/* Radio Button Selector: Upload File vs Buat Template */}
                      <div className="space-y-2 sm:col-span-2 bg-stone-100/90 p-4 rounded-2xl border border-stone-200 shadow-2xs">
                        <label className="text-xs font-bold text-stone-900 block">
                          Pilihan Jenis Pengaturan Template Dokumen *
                        </label>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-1">
                          <label
                            onClick={() => setDocTemplateMode('upload')}
                            className={`flex-1 w-full flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                              docTemplateMode === 'upload'
                                ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                                : 'bg-white text-stone-800 border-stone-300 hover:bg-stone-50'
                            }`}
                          >
                            <input
                              type="radio"
                              name="docTemplateModeRadio"
                              value="upload"
                              checked={docTemplateMode === 'upload'}
                              onChange={() => setDocTemplateMode('upload')}
                              className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                            />
                            <div className="flex items-center gap-2">
                              <UploadCloud className={`w-4 h-4 ${docTemplateMode === 'upload' ? 'text-amber-300' : 'text-emerald-700'}`} />
                              <div>
                                <div className="text-xs font-bold">Upload File Berkas</div>
                                <div className={`text-[10px] ${docTemplateMode === 'upload' ? 'text-emerald-100' : 'text-stone-500'}`}>
                                  Unggah file master (.docx, .pdf, .zip, atau link cloud)
                                </div>
                              </div>
                            </div>
                          </label>

                          <label
                            onClick={() => setDocTemplateMode('template')}
                            className={`flex-1 w-full flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                              docTemplateMode === 'template'
                                ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                                : 'bg-white text-stone-800 border-stone-300 hover:bg-stone-50'
                            }`}
                          >
                            <input
                              type="radio"
                              name="docTemplateModeRadio"
                              value="template"
                              checked={docTemplateMode === 'template'}
                              onChange={() => setDocTemplateMode('template')}
                              className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                            />
                            <div className="flex items-center gap-2">
                              <FileText className={`w-4 h-4 ${docTemplateMode === 'template' ? 'text-amber-300' : 'text-emerald-700'}`} />
                              <div>
                                <div className="text-xs font-bold">Buat Template (Rich Text Editor)</div>
                                <div className={`text-[10px] ${docTemplateMode === 'template' ? 'text-emerald-100' : 'text-stone-500'}`}>
                                  Susun draf format surat dengan tag variabel otomatis
                                </div>
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* CONDITIONAL CONTENT: UPLOAD FILE SECTION */}
                      {docTemplateMode === 'upload' && (
                        <div className="space-y-3 sm:col-span-2 bg-white p-4 rounded-2xl border-2 border-emerald-500/40 shadow-2xs">
                          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                            <label className="text-xs font-bold text-stone-900 flex items-center gap-2">
                              <UploadCloud className="w-4 h-4 text-emerald-700" />
                              <span>Upload File Template Asli (Word .docx / PDF / Gambar / ZIP) *</span>
                            </label>
                            <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                              Maksimal 15MB
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-1">
                            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs shrink-0">
                              <UploadCloud className="w-4 h-4 text-amber-300" />
                              <span>Pilih & Upload File Berkas</span>
                              <input
                                type="file"
                                accept=".docx,.doc,.pdf,.png,.jpg,.jpeg,.zip"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    if (file.size > 15 * 1024 * 1024) {
                                      alert('Ukuran file maksimal 15MB!');
                                      return;
                                    }
                                    const reader = new FileReader();
                                    reader.onload = (evt) => {
                                      const res = evt.target?.result as string;
                                      setFormDocTemplate({
                                        ...formDocTemplate,
                                        fileUrl: res,
                                        fileName: file.name,
                                      });
                                      showToast(`File "${file.name}" berhasil diunggah!`);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>

                            <div className="flex-1 w-full space-y-1">
                              <input
                                type="text"
                                value={formDocTemplate.fileUrl || ''}
                                onChange={(e) => setFormDocTemplate({ ...formDocTemplate, fileUrl: e.target.value })}
                                placeholder="Atau masukkan URL Tautan Direct Download File (Google Drive / Cloud)..."
                                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                              />
                            </div>
                          </div>

                          {formDocTemplate.fileUrl && (
                            <div className="mt-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                              <span className="font-semibold text-emerald-950 flex items-center gap-2 truncate">
                                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                                <span>
                                  File Terpasang: <strong className="text-emerald-900 font-mono">{formDocTemplate.fileName || 'Template_Dokumen'}</strong>
                                </span>
                              </span>
                              <button
                                type="button"
                                onClick={() => setFormDocTemplate({ ...formDocTemplate, fileUrl: '', fileName: '' })}
                                className="text-[11px] text-red-600 hover:text-red-800 font-bold px-2.5 py-1 rounded-lg hover:bg-red-50 transition-colors"
                              >
                                Hapus File
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* CONDITIONAL CONTENT: BUAT TEMPLATE (RICH TEXT EDITOR) */}
                      {docTemplateMode === 'template' && (
                        <div className="space-y-3 sm:col-span-2 bg-white p-4 rounded-2xl border-2 border-emerald-500/40 shadow-2xs">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2">
                            <label className="text-xs font-bold text-stone-900 flex items-center gap-2">
                              <Edit3 className="w-4 h-4 text-emerald-700" />
                              <span>Rich Text Editor — Format Template Isian Surat *</span>
                            </label>
                            <span className="text-[10px] text-stone-500 font-medium">
                              Gunakan tag variabel di bawah untuk melengkapi data pemohon secara otomatis
                            </span>
                          </div>

                          {/* Rich Text Editor Toolbar & Quick Variable Tag Insertion */}
                          <div className="space-y-2 bg-stone-50 p-3 rounded-xl border border-stone-200">
                            <div className="text-[11px] font-bold text-stone-700 flex items-center gap-1.5">
                              <span>Sisipkan Tag Variabel Otomatis:</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {[
                                { tag: '[NAMA_WARGA]', label: '+ Nama Warga' },
                                { tag: '[NIK]', label: '+ NIK' },
                                { tag: '[ALAMAT]', label: '+ Alamat' },
                                { tag: '[NOMOR_SURAT]', label: '+ Nomor Surat' },
                                { tag: '[KEBUTUHAN]', label: '+ Keperluan' },
                                { tag: '[TANGGAL_SURAT]', label: '+ Tanggal Surat' },
                                { tag: '[RT_RW]', label: '+ Wilayah RT/RW' },
                              ].map((item) => (
                                <button
                                  key={item.tag}
                                  type="button"
                                  onClick={() => {
                                    setFormDocTemplate({
                                      ...formDocTemplate,
                                      templateBody: (formDocTemplate.templateBody || '') + ` ${item.tag}`,
                                    });
                                  }}
                                  className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-900 rounded-lg text-[11px] font-bold border border-emerald-200 shadow-2xs transition-colors cursor-pointer"
                                >
                                  {item.label}
                                </button>
                              ))}
                            </div>

                            {/* Formatting Helpers */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-stone-200/60 text-[11px]">
                              <span className="text-stone-500 font-semibold mr-1">Format Teks:</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setFormDocTemplate({
                                    ...formDocTemplate,
                                    templateBody: (formDocTemplate.templateBody || '') + ' **Teks Tebal**',
                                  });
                                }}
                                className="px-2 py-0.5 bg-white hover:bg-stone-100 rounded border border-stone-200 font-bold"
                              >
                                B (Bold)
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setFormDocTemplate({
                                    ...formDocTemplate,
                                    templateBody: (formDocTemplate.templateBody || '') + ' *Teks Miring*',
                                  });
                                }}
                                className="px-2 py-0.5 bg-white hover:bg-stone-100 rounded border border-stone-200 italic font-bold"
                              >
                                I (Italic)
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setFormDocTemplate({
                                    ...formDocTemplate,
                                    templateBody: (formDocTemplate.templateBody || '') + '\n- Poin baris pertama\n- Poin baris kedua',
                                  });
                                }}
                                className="px-2 py-0.5 bg-white hover:bg-stone-100 rounded border border-stone-200 font-bold"
                              >
                                Bullet List
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setFormDocTemplate({
                                    ...formDocTemplate,
                                    templateBody: (formDocTemplate.templateBody || '') + '\n----------------------------------------\n',
                                  });
                                }}
                                className="px-2 py-0.5 bg-white hover:bg-stone-100 rounded border border-stone-200 font-bold"
                              >
                                Garis Pemisah
                              </button>
                            </div>
                          </div>

                          <textarea
                            rows={8}
                            value={formDocTemplate.templateBody || ''}
                            onChange={(e) => setFormDocTemplate({ ...formDocTemplate, templateBody: e.target.value })}
                            placeholder="Tuliskan isi draf format surat resmi di sini..."
                            className="w-full px-3.5 py-3 bg-white border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 leading-relaxed shadow-2xs"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingDocTemplate(null);
                          setIsCreatingDocTemplate(false);
                        }}
                        className="px-4 py-2 bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold hover:bg-stone-300 transition-colors"
                      >
                        Batal
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (!formDocTemplate.title) {
                            alert('Mohon isi nama dokumen!');
                            return;
                          }
                          const newDocItem: DocumentTemplate = {
                            id: editingDocTemplate ? editingDocTemplate.id : `doc-${Date.now()}`,
                            title: formDocTemplate.title || 'Dokumen Surat',
                            code: formDocTemplate.code || `DOC_${Date.now()}`,
                            category: formDocTemplate.category || 'Umum',
                            description: formDocTemplate.description || '',
                            templateBody: formDocTemplate.templateBody || '',
                            fileUrl: formDocTemplate.fileUrl || '',
                            fileName: formDocTemplate.fileName || '',
                            enabled: formDocTemplate.enabled !== false,
                          };

                          let updatedDocs: DocumentTemplate[];
                          if (editingDocTemplate) {
                            updatedDocs = tempDocumentTemplates.map((d) => (d.id === editingDocTemplate.id ? newDocItem : d));
                          } else {
                            updatedDocs = [newDocItem, ...tempDocumentTemplates];
                          }

                          setTempDocumentTemplates(updatedDocs);
                          onSaveSiteSettings({
                            ...siteSettings,
                            documentTemplates: updatedDocs,
                          });
                          setEditingDocTemplate(null);
                          setIsCreatingDocTemplate(false);
                          showToast(`Template dokumen "${newDocItem.title}" berhasil disimpan!`);
                        }}
                        className="px-5 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold hover:bg-emerald-900 transition-colors"
                      >
                        Simpan Template Dokumen
                      </button>
                    </div>
                  </div>
                )}

                {/* LIST OF DOCUMENT TEMPLATES */}
                <div className="space-y-3">
                  {tempDocumentTemplates.length === 0 ? (
                    <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-stone-500 text-xs">
                      Belum ada template dokumen. Klik tombol <strong>"Tambah Template Dokumen"</strong> di atas.
                    </div>
                  ) : (
                    tempDocumentTemplates.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900 text-sm">{doc.title}</span>
                            <span className="text-[10px] bg-stone-200 text-stone-800 px-2 py-0.5 rounded font-mono font-bold">
                              {doc.code}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${doc.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'}`}>
                              {doc.enabled ? 'Aktif' : 'Non-aktif'}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600">{doc.description}</p>
                          <span className="text-[11px] text-emerald-800 font-medium">Kategori: {doc.category}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = tempDocumentTemplates.map((d) => (d.id === doc.id ? { ...d, enabled: !d.enabled } : d));
                              setTempDocumentTemplates(updated);
                              onSaveSiteSettings({ ...siteSettings, documentTemplates: updated });
                            }}
                            className="px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold text-stone-800 hover:bg-stone-100"
                          >
                            {doc.enabled ? 'Nonaktifkan' : 'Aktifkan'}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingDocTemplate(doc);
                              setIsCreatingDocTemplate(false);
                              setDocTemplateMode(doc.fileUrl ? 'upload' : 'template');
                              setFormDocTemplate(doc);
                            }}
                            className="p-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg border border-emerald-200"
                            title="Edit Template"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Hapus template dokumen "${doc.title}"?`)) {
                                const updated = tempDocumentTemplates.filter((d) => d.id !== doc.id);
                                setTempDocumentTemplates(updated);
                                onSaveSiteSettings({ ...siteSettings, documentTemplates: updated });
                                showToast(`Template "${doc.title}" dihapus.`);
                              }
                            }}
                            className="p-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg border border-red-200"
                            title="Hapus Template"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: POLLING & GOOGLE FORM CONFIG */}
          {activeTab === 'polling' && (
            <div className="space-y-6 max-w-5xl mx-auto pb-6">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div>
                    <h3 className="font-extrabold text-stone-900 text-base sm:text-lg flex items-center gap-2">
                      <Vote className="w-5 h-5 text-emerald-700" />
                      Pengaturan Halaman Polling & Google Form
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Kelola 2 section iframe Google Form, judul, deskripsi, serta tautan survei opini warga RW 11.
                    </p>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                    <input
                      type="checkbox"
                      checked={tempPollingConfig.enabled}
                      onChange={(e) => setTempPollingConfig({ ...tempPollingConfig, enabled: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span className="text-xs font-bold text-emerald-950">Aktifkan Halaman Polling</span>
                  </label>
                </div>

                {/* Page Title & Description */}
                <div className="grid grid-cols-1 gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-800 block">Judul Halaman Polling Utama:</label>
                    <input
                      type="text"
                      value={tempPollingConfig.pageTitle}
                      onChange={(e) => setTempPollingConfig({ ...tempPollingConfig, pageTitle: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-800 block">Deskripsi Penjelasan Halaman Polling:</label>
                    <input
                      type="text"
                      value={tempPollingConfig.pageDescription}
                      onChange={(e) => setTempPollingConfig({ ...tempPollingConfig, pageDescription: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                {/* SECTION 1 CONFIG */}
                <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
                    <span className="font-bold text-stone-900 text-xs sm:text-sm flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                      Section 1: Google Form Iframe Pertama
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tempPollingConfig.section1.enabled}
                        onChange={(e) =>
                          setTempPollingConfig({
                            ...tempPollingConfig,
                            section1: { ...tempPollingConfig.section1, enabled: e.target.checked },
                          })
                        }
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span className="text-xs font-semibold text-stone-700">Tampilkan Section 1</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-800">Judul Section 1:</label>
                      <input
                        type="text"
                        value={tempPollingConfig.section1.title}
                        onChange={(e) =>
                          setTempPollingConfig({
                            ...tempPollingConfig,
                            section1: { ...tempPollingConfig.section1, title: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-800">Deskripsi Section 1:</label>
                      <input
                        type="text"
                        value={tempPollingConfig.section1.description}
                        onChange={(e) =>
                          setTempPollingConfig({
                            ...tempPollingConfig,
                            section1: { ...tempPollingConfig.section1, description: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-800">URL Field Google Form Iframe (Section 1):</label>
                      <input
                        type="text"
                        value={tempPollingConfig.section1.formUrl}
                        onChange={(e) =>
                          setTempPollingConfig({
                            ...tempPollingConfig,
                            section1: { ...tempPollingConfig.section1, formUrl: e.target.value },
                          })
                        }
                        placeholder="https://docs.google.com/forms/d/e/.../viewform?embedded=true"
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2 CONFIG */}
                <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
                    <span className="font-bold text-stone-900 text-xs sm:text-sm flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                      Section 2: Google Form Iframe Kedua
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tempPollingConfig.section2.enabled}
                        onChange={(e) =>
                          setTempPollingConfig({
                            ...tempPollingConfig,
                            section2: { ...tempPollingConfig.section2, enabled: e.target.checked },
                          })
                        }
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span className="text-xs font-semibold text-stone-700">Tampilkan Section 2</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-800">Judul Section 2:</label>
                      <input
                        type="text"
                        value={tempPollingConfig.section2.title}
                        onChange={(e) =>
                          setTempPollingConfig({
                            ...tempPollingConfig,
                            section2: { ...tempPollingConfig.section2, title: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-800">Deskripsi Section 2:</label>
                      <input
                        type="text"
                        value={tempPollingConfig.section2.description}
                        onChange={(e) =>
                          setTempPollingConfig({
                            ...tempPollingConfig,
                            section2: { ...tempPollingConfig.section2, description: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-800">URL Field Google Form Iframe (Section 2):</label>
                      <input
                        type="text"
                        value={tempPollingConfig.section2.formUrl}
                        onChange={(e) =>
                          setTempPollingConfig({
                            ...tempPollingConfig,
                            section2: { ...tempPollingConfig.section2, formUrl: e.target.value },
                          })
                        }
                        placeholder="https://docs.google.com/forms/d/e/.../viewform?embedded=true"
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>
                </div>

                {/* SAVE BUTTON POLLING */}
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onSaveSiteSettings({
                        ...siteSettings,
                        pollingConfig: tempPollingConfig,
                      });
                      showToast('Pengaturan halaman polling & Google Form berhasil disimpan!');
                    }}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Simpan Pengaturan Polling</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PENGATURAN RT/RW CONFIG */}
          {activeTab === 'rtrw' && (
            <div className="space-y-6 max-w-5xl mx-auto pb-6">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                  <div>
                    <h3 className="font-extrabold text-stone-900 text-base sm:text-lg flex items-center gap-2">
                      <Building className="w-5 h-5 text-emerald-700" />
                      <span>Pengaturan Kelola Halaman Informasi RT/RW</span>
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Kelola Visi Misi RW 11, Banner Hero, serta Rincian Informasi Ketua RT, Wilayah, & Program Unggulan.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                      <input
                        type="checkbox"
                        checked={tempRtRwConfig.enabled}
                        onChange={(e) => setTempRtRwConfig({ ...tempRtRwConfig, enabled: e.target.checked })}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span className="text-xs font-bold text-emerald-950">Aktifkan Halaman RT/RW</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        onSaveSiteSettings({
                          ...siteSettings,
                          rtRwConfig: tempRtRwConfig,
                        });
                        showToast('Pengaturan halaman Informasi RT/RW berhasil disimpan!');
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                    >
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Simpan Perubahan</span>
                    </button>
                  </div>
                </div>

                {/* CARD 1: HEADER & HERO BANNER */}
                <CollapsibleCard
                  title="1. Header & Banner Hero Halaman RT/RW"
                  subtitle="Judul, deskripsi penjelasan, dan latar gambar hero banner halaman RT/RW"
                  icon={<Building className="w-4 h-4 text-emerald-700" />}
                  defaultOpen={true}
                >
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-800">Judul Utama Halaman RT/RW:</label>
                      <input
                        type="text"
                        value={tempRtRwConfig.pageTitle || ''}
                        onChange={(e) => setTempRtRwConfig({ ...tempRtRwConfig, pageTitle: e.target.value })}
                        placeholder="Contoh: Informasi RT/RW 11 Bintara Jaya Permai"
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-800">Deskripsi Penjelasan Sub-Header:</label>
                      <textarea
                        rows={2}
                        value={tempRtRwConfig.pageDescription || ''}
                        onChange={(e) => setTempRtRwConfig({ ...tempRtRwConfig, pageDescription: e.target.value })}
                        placeholder="Deskripsi singkat struktur organisasi..."
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-800">URL Gambar Banner Hero:</label>
                      <input
                        type="text"
                        value={tempRtRwConfig.heroImage || ''}
                        onChange={(e) => setTempRtRwConfig({ ...tempRtRwConfig, heroImage: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>
                </CollapsibleCard>

                {/* CARD 2: VISI & MISI RW 11 */}
                <CollapsibleCard
                  title="2. Pengaturan Visi, Misi, & Nilai-Nilai Utama RW 11"
                  subtitle="Konten visi kepengurusan, poin-poin misi, dan nilai gotong royong warga"
                  icon={<Sparkles className="w-4 h-4 text-amber-600" />}
                  defaultOpen={true}
                >
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-800">Label Badge Seksi Visi:</label>
                        <input
                          type="text"
                          value={tempRtRwConfig.visionTitle || ''}
                          onChange={(e) => setTempRtRwConfig({ ...tempRtRwConfig, visionTitle: e.target.value })}
                          placeholder="🏛️ Visi & Misi Resmi RW 11"
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-800">Judul Banner Visi & Misi:</label>
                        <input
                          type="text"
                          value={tempRtRwConfig.visionHeading || ''}
                          onChange={(e) => setTempRtRwConfig({ ...tempRtRwConfig, visionHeading: e.target.value })}
                          placeholder="Visi & Misi Pengurus RW 11 Bintara Jaya Permai"
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-800">Pernyataan Teks Visi Utama RW 11:</label>
                      <textarea
                        rows={2}
                        value={tempRtRwConfig.visionText || ''}
                        onChange={(e) => setTempRtRwConfig({ ...tempRtRwConfig, visionText: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
                      />
                    </div>

                    {/* Misi List */}
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>Daftar Poin Misi Utama ({tempRtRwConfig.missions ? tempRtRwConfig.missions.length : 0})</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...(tempRtRwConfig.missions || [])];
                            updated.push('Misi baru kepengurusan RW 11...');
                            setTempRtRwConfig({ ...tempRtRwConfig, missions: updated });
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-lg border border-emerald-300 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah Misi</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(tempRtRwConfig.missions || []).map((misi, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-emerald-800 text-white text-[10px] font-extrabold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <input
                              type="text"
                              value={misi}
                              onChange={(e) => {
                                const updated = [...(tempRtRwConfig.missions || [])];
                                updated[idx] = e.target.value;
                                setTempRtRwConfig({ ...tempRtRwConfig, missions: updated });
                              }}
                              className="flex-1 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (tempRtRwConfig.missions || []).filter((_, i) => i !== idx);
                                setTempRtRwConfig({ ...tempRtRwConfig, missions: updated });
                              }}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Hapus Misi Ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Nilai-Nilai Utama List */}
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Daftar Nilai-Nilai Utama Warga ({tempRtRwConfig.values ? tempRtRwConfig.values.length : 0})</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...(tempRtRwConfig.values || [])];
                            updated.push({ title: 'Nilai Baru', description: 'Penjelasan nilai utama...' });
                            setTempRtRwConfig({ ...tempRtRwConfig, values: updated });
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-lg border border-emerald-300 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah Nilai</span>
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {(tempRtRwConfig.values || []).map((val, idx) => (
                          <div key={idx} className="p-3 bg-white rounded-xl border border-stone-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-stone-800">Nilai #{idx + 1}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = (tempRtRwConfig.values || []).filter((_, i) => i !== idx);
                                  setTempRtRwConfig({ ...tempRtRwConfig, values: updated });
                                }}
                                className="text-xs text-red-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Hapus
                              </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <input
                                type="text"
                                placeholder="Judul Nilai (e.g. Gotong Royong)"
                                value={val.title}
                                onChange={(e) => {
                                  const updated = [...(tempRtRwConfig.values || [])];
                                  updated[idx] = { ...updated[idx], title: e.target.value };
                                  setTempRtRwConfig({ ...tempRtRwConfig, values: updated });
                                }}
                                className="px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold text-stone-900"
                              />
                              <input
                                type="text"
                                placeholder="Penjelasan deskripsi nilai..."
                                value={val.description}
                                onChange={(e) => {
                                  const updated = [...(tempRtRwConfig.values || [])];
                                  updated[idx] = { ...updated[idx], description: e.target.value };
                                  setTempRtRwConfig({ ...tempRtRwConfig, values: updated });
                                }}
                                className="sm:col-span-2 px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-800"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CollapsibleCard>

                {/* CARD 3: RINCIAN WILAYAH RT 01 S/D RT 07 */}
                <CollapsibleCard
                  title="3. Kelola Rincian Data RT (RT 01 s/d RT 07)"
                  subtitle="Ketua RT, cakupan blok, jumlah KK, jadwal kerja bakti, & program unggulan per RT"
                  icon={<MapPin className="w-4 h-4 text-emerald-700" />}
                  badge={
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {tempRtRwConfig.rts ? tempRtRwConfig.rts.length : 0} RT Terdaftar
                    </span>
                  }
                  defaultOpen={true}
                >
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-800">Judul Seksi Daftar RT:</label>
                        <input
                          type="text"
                          value={tempRtRwConfig.rtListTitle || ''}
                          onChange={(e) => setTempRtRwConfig({ ...tempRtRwConfig, rtListTitle: e.target.value })}
                          placeholder="Rincian Informasi Wilayah per RT"
                          className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-bold text-stone-900"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-800">Deskripsi Seksi Daftar RT:</label>
                        <input
                          type="text"
                          value={tempRtRwConfig.rtListDescription || ''}
                          onChange={(e) => setTempRtRwConfig({ ...tempRtRwConfig, rtListDescription: e.target.value })}
                          placeholder="Daftar ketua RT, cakupan wilayah..."
                          className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-800"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                        Daftar Unit RT (Klik Kartu RT Untuk Expand / Collapse)
                      </h4>

                      <button
                        type="button"
                        onClick={() => {
                          const nextNum = (tempRtRwConfig.rts?.length || 0) + 1;
                          const formattedNum = nextNum < 10 ? `0${nextNum}` : `${nextNum}`;
                          const newRt: RtDetailItem = {
                            id: `rt-${Date.now()}`,
                            rtNumber: formattedNum,
                            rwNumber: '11',
                            chairmanName: 'Bpk. Nama Ketua RT',
                            kkCount: '50 KK',
                            coverageArea: 'Blok ...',
                            workSchedule: 'Minggu Ke-1',
                            featuredProgram: 'Program Unggulan RT',
                            contactPhone: '0812-0000-0000',
                            enabled: true,
                          };
                          setTempRtRwConfig({
                            ...tempRtRwConfig,
                            rts: [...(tempRtRwConfig.rts || []), newRt],
                          });
                        }}
                        className="inline-flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-2xs transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-emerald-300" />
                        <span>+ Tambah Unit RT Baru</span>
                      </button>
                    </div>

                    {/* RT Cards Collapsible Stack */}
                    <div className="space-y-3">
                      {(tempRtRwConfig.rts || []).map((rtItem, index) => (
                        <CollapsibleCard
                          key={rtItem.id || index}
                          title={`RT ${rtItem.rtNumber} / RW ${rtItem.rwNumber} — ${rtItem.chairmanName}`}
                          subtitle={`Cakupan: ${rtItem.coverageArea} • ${rtItem.kkCount}`}
                          badge={
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                rtItem.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                              }`}
                            >
                              {rtItem.enabled ? 'Aktif' : 'Nonaktif'}
                            </span>
                          }
                          defaultOpen={index === 0}
                          headerAction={
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Hapus data RT ${rtItem.rtNumber}?`)) {
                                  const updated = (tempRtRwConfig.rts || []).filter((_, i) => i !== index);
                                  setTempRtRwConfig({ ...tempRtRwConfig, rts: updated });
                                }
                              }}
                              className="p-1 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                              title="Hapus RT Ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          }
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-stone-700 block">Nomor RT:</label>
                              <input
                                type="text"
                                value={rtItem.rtNumber}
                                onChange={(e) => {
                                  const updated = [...(tempRtRwConfig.rts || [])];
                                  updated[index].rtNumber = e.target.value;
                                  setTempRtRwConfig({ ...tempRtRwConfig, rts: updated });
                                }}
                                className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold text-stone-900"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-stone-700 block">Nomor RW:</label>
                              <input
                                type="text"
                                value={rtItem.rwNumber}
                                onChange={(e) => {
                                  const updated = [...(tempRtRwConfig.rts || [])];
                                  updated[index].rwNumber = e.target.value;
                                  setTempRtRwConfig({ ...tempRtRwConfig, rts: updated });
                                }}
                                className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-stone-700 block">Nama Ketua RT:</label>
                              <input
                                type="text"
                                value={rtItem.chairmanName}
                                onChange={(e) => {
                                  const updated = [...(tempRtRwConfig.rts || [])];
                                  updated[index].chairmanName = e.target.value;
                                  setTempRtRwConfig({ ...tempRtRwConfig, rts: updated });
                                }}
                                className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold text-stone-900"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-stone-700 block">Jumlah KK:</label>
                              <input
                                type="text"
                                value={rtItem.kkCount}
                                onChange={(e) => {
                                  const updated = [...(tempRtRwConfig.rts || [])];
                                  updated[index].kkCount = e.target.value;
                                  setTempRtRwConfig({ ...tempRtRwConfig, rts: updated });
                                }}
                                className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-stone-700 block">Cakupan Wilayah / Blok:</label>
                              <input
                                type="text"
                                value={rtItem.coverageArea}
                                onChange={(e) => {
                                  const updated = [...(tempRtRwConfig.rts || [])];
                                  updated[index].coverageArea = e.target.value;
                                  setTempRtRwConfig({ ...tempRtRwConfig, rts: updated });
                                }}
                                className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-stone-700 block">Jadwal Kerja Bakti:</label>
                              <input
                                type="text"
                                value={rtItem.workSchedule}
                                onChange={(e) => {
                                  const updated = [...(tempRtRwConfig.rts || [])];
                                  updated[index].workSchedule = e.target.value;
                                  setTempRtRwConfig({ ...tempRtRwConfig, rts: updated });
                                }}
                                className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900"
                              />
                            </div>

                            <div className="space-y-1 sm:col-span-2">
                              <label className="text-[11px] font-bold text-stone-700 block">Program Unggulan RT:</label>
                              <input
                                type="text"
                                value={rtItem.featuredProgram}
                                onChange={(e) => {
                                  const updated = [...(tempRtRwConfig.rts || [])];
                                  updated[index].featuredProgram = e.target.value;
                                  setTempRtRwConfig({ ...tempRtRwConfig, rts: updated });
                                }}
                                className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 font-medium"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-stone-700 block">No. Kontak WA Ketua RT:</label>
                              <input
                                type="text"
                                value={rtItem.contactPhone || ''}
                                onChange={(e) => {
                                  const updated = [...(tempRtRwConfig.rts || [])];
                                  updated[index].contactPhone = e.target.value;
                                  setTempRtRwConfig({ ...tempRtRwConfig, rts: updated });
                                }}
                                placeholder="0812-xxxx-xxxx"
                                className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono text-stone-900"
                              />
                            </div>

                            <div className="sm:col-span-3 flex items-center justify-between pt-2 border-t border-stone-100">
                              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-800">
                                <input
                                  type="checkbox"
                                  checked={rtItem.enabled}
                                  onChange={(e) => {
                                    const updated = [...(tempRtRwConfig.rts || [])];
                                    updated[index].enabled = e.target.checked;
                                    setTempRtRwConfig({ ...tempRtRwConfig, rts: updated });
                                  }}
                                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                                />
                                <span>Tampilkan RT Ini di Halaman Depan</span>
                              </label>
                            </div>
                          </div>
                        </CollapsibleCard>
                      ))}
                    </div>
                  </div>
                </CollapsibleCard>

                {/* BOTTOM SAVE BUTTON */}
                <div className="flex justify-end pt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => {
                      onSaveSiteSettings({
                        ...siteSettings,
                        rtRwConfig: tempRtRwConfig,
                      });
                      showToast('Pengaturan halaman Informasi RT/RW berhasil disimpan!');
                    }}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Simpan Pengaturan RT/RW</span>
                  </button>
                </div>
              </div>
            </div>
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
                          Tentukan username, password, peran pengurus, dan entitas spesifik yang boleh dikelola.
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
                            <strong className="text-sm font-bold text-stone-900">Admin Entitas (Akses Terbatas)</strong>
                          </div>
                          <p className="text-xs text-stone-600 leading-relaxed">
                            Hanya dapat melihat dan mengedit entitas yang Anda pilihkan di bawah ini. Sangat disarankan untuk pengurus unit kegiatan / UMKM tertentu.
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
                            Dapat mengedit seluruh entitas, mengelola pengumuman, mengubah logo & judul website, serta membuat/menghapus akun pengurus lain.
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
                              <span>Pilih Entitas yang Boleh Dikelola Akun Ini:</span>
                              <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                                {formUser.allowedEntityIds.length} Dipilih
                              </span>
                            </label>
                            <p className="text-[11px] text-stone-500">Centang entitas yang diizinkan untuk diakses & diedit oleh pengguna ini.</p>
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
                            placeholder="Cari nama entitas..."
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
                        className="px-4 py-2.5 text-stone-600 hover:text-stone-900 text-xs font-semibold rounded-xl border border-stone-200 transition-colors cursor-pointer"
                      >
                        Batal
                      </button>

                      <button
                        type="submit"
                        className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
                      >
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>{editingUser ? 'Simpan Perubahan Akun' : 'Buat Akun Pengurus'}</span>
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
                        Kelola akun login pengurus, password, dan tentukan entitas mana saja yang boleh dikelola oleh tiap akun.
                      </p>
                    </div>

                    {isSuperAdmin && (
                      <button
                        onClick={handleStartNewUser}
                        className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>+ Tambah Akun Pengurus</span>
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
                                {isSuper ? 'Super Admin' : 'Admin Entitas'}
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

                            {/* Hak Akses Entitas List */}
                            <div className="space-y-1.5">
                              <span className="text-[11px] font-bold text-stone-600 block">Hak Akses Pengelolaan:</span>
                              {isSuper || u.allowedEntityIds?.includes('*') ? (
                                <div className="bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                                  <span>Bebas Kelola Semua Entitas ({entities.length} Entitas)</span>
                                </div>
                              ) : allowedEntities.length === 0 ? (
                                <div className="bg-amber-50 text-amber-900 border border-amber-200 text-xs px-3 py-1.5 rounded-xl">
                                  Belum diberikan akses entitas manapun.
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <span className="text-[10px] text-blue-800 bg-blue-50 px-2 py-0.5 rounded font-bold border border-blue-200">
                                    Diberikan Akses Ke {allowedEntities.length} Entitas Spesifik:
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
                        Simpan credentials akun pengurus, entitas kegiatan, pengumuman, dan konfigurasi portal secara real-time di cloud database Supabase.
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
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-300 rounded-xl font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 text-stone-700 ${supabaseTesting ? 'animate-spin' : ''}`} />
                    <span>{supabaseTesting ? 'Menguji...' : 'Uji Koneksi Supabase'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePushToSupabase}
                    disabled={supabaseSyncing || !isSupabaseConfigured()}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4 text-emerald-300" />
                    <span>{supabaseSyncing ? 'Mengirim...' : 'Upload Data Lokal ke Supabase'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePullFromSupabase}
                    disabled={supabaseSyncing || !isSupabaseConfigured()}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer disabled:opacity-50"
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
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
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
                      Cadangkan seluruh data Entitas Kegiatan, Pengumuman, dan Pengaturan ke file JSON atau pulihkan data dari file cadangan sebelumnya.
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
                      Ekspor seluruh <strong>{entities.length} Entitas Kegiatan</strong> dan <strong>{announcements.length} Pengumuman</strong> beserta seluruh foto, jam buka, kontak, dan alamat ke satu file <code>.json</code>.
                    </p>

                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1">
                      <div className="flex justify-between font-medium">
                        <span>Total Entitas:</span>
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
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-emerald-300" />
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
                      Pilih file <code>.json</code> hasil ekspor sebelumnya dari perangkat Anda untuk memulihkan seluruh data entitas dan pengumuman secara otomatis.
                    </p>

                    <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-blue-900 leading-relaxed">
                      💡 File JSON yang diimpor akan langsung memperbarui daftar entitas dan pengumuman tanpa menghilangkan konfigurasi penting.
                    </div>
                  </div>

                  <label className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer">
                    <Upload className="w-4 h-4 text-blue-200" />
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
                      3. Reset Data Ke Setelan Standar Awal (13 Entitas Resmi PDF)
                    </h4>
                  </div>
                  <span className="text-xs bg-amber-50 text-amber-800 font-semibold px-2.5 py-1 rounded-full border border-amber-200">
                    Opsi Pemulihan Awal
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  Gunakan opsi ini jika Anda ingin mengembalikan seluruh data ke <strong>13 Entitas Resmi Awal</strong> dari dokumen PDF Bintara Jaya Permai (RW 11). Perubahan lokal yang belum di-backup akan ditimpa.
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 font-medium">
                    ⚠️ Memerlukan konfirmasi keamanan sebelum proses reset dijalankan.
                  </span>

                  <button
                    type="button"
                    onClick={handleResetData}
                    className="flex items-center gap-2 px-4 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-xl font-bold text-xs transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4 text-amber-700" />
                    <span>Reset Data Ke 13 Entitas Awal</span>
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
                      Lakukan ekspor data JSON secara berkala setelah Anda menambah atau mengedit entitas UMKM, jadwal operasional, atau pengumuman warga baru.
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
