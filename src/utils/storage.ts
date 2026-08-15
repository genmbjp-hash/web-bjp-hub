import { Entity, Announcement, SiteSettings, CategoryHeaderConfig, User, RtRwPageConfig } from '../types';
import { INITIAL_ENTITIES, INITIAL_ANNOUNCEMENTS } from '../data/initialData';
import { BJP_LOGO_URL } from '../assets/logo';
import { updateSiteFaviconAndOgImage } from './meta';
import {
  isSupabaseConfigured,
  saveUsersToSupabase,
  saveEntitiesToSupabase,
  saveAnnouncementsToSupabase,
  saveSiteSettingsToSupabase,
} from '../lib/supabase';
import {
  STORAGE_KEYS,
  CATEGORY_LEGACY_MAP,
  DEFAULT_SITE_TITLE,
  DEFAULT_SITE_DESCRIPTION,
} from '../constants/defaults';

// Initial admin username & password loaded from environment variable or generated default
const initialAdminUsername = import.meta.env.VITE_INITIAL_ADMIN_USERNAME || 'admin';
const initialAdminPassword = import.meta.env.VITE_INITIAL_ADMIN_PASSWORD || 'Bjp01!';

export const DEFAULT_USERS: User[] = [
  {
    id: 'usr-super-admin',
    username: initialAdminUsername,
    password: initialAdminPassword,
    name: 'Super Admin BJP',
    role: 'super_admin',
    allowedEntityIds: ['*'],
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'usr-sentra-usaha',
    username: 'admin_umkm',
    password: initialAdminPassword,
    name: 'Pengurus Sentra Usaha UMKM',
    role: 'entity_admin',
    allowedEntityIds: [
      'ent-umkm-1', 'ent-umkm-2', 'ent-umkm-3', 'ent-umkm-4', 'ent-umkm-5',
      'ent-umkm-6', 'ent-umkm-7', 'ent-umkm-8', 'ent-umkm-9', 'ent-umkm-10', 'ent-4',
    ],
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

export const DEFAULT_CATEGORY_CONFIGS: CategoryHeaderConfig[] = [
  {
    id: 'Galeri Warga',
    name: 'Galeri Warga',
    description: 'Dokumentasi foto kegiatan warga, gotong royong, acara peringatan, dan momen kebersamaan Bintara Jaya Permai (RW 11)',
    logoUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
    layoutType: 'photo_album',
  },
  {
    id: 'Sentra Usaha BJP',
    name: 'Sentra Usaha BJP',
    description: 'Unit komunitas, UMKM, dan kegiatan usaha warga Bintara Jaya Permai (RW 11)',
    logoUrl: '/images/sentra_usaha_logo.jpg',
  },
  {
    id: 'Pusat Hub',
    name: 'Pusat Hub',
    description: 'Pusat kegiatan, sekretariat, dan informasi utama RW 11',
    logoUrl: '',
  },
  {
    id: 'Administratif / Pemerintahan',
    name: 'Administratif / Pemerintahan',
    description: 'Layanan administrasi RT, RW, dan pemerintahan warga',
    logoUrl: '',
  },
  {
    id: 'Keagamaan',
    name: 'Keagamaan',
    description: 'Kegiatan ibadah, tempat ibadah, dan pengajian warga',
    logoUrl: '',
  },
  {
    id: 'Lingkungan',
    name: 'Lingkungan',
    description: 'Kegiatan kebersihan, pengolahan sampah, dan pertamanan',
    logoUrl: '',
  },
  {
    id: 'Kesejahteraan Keluarga',
    name: 'Kesejahteraan Keluarga',
    description: 'Kegiatan PKK, posyandu, dan pemberdayaan keluarga',
    logoUrl: '',
  },
  {
    id: 'Kesehatan',
    name: 'Kesehatan',
    description: 'Layanan kesehatan, posyandu lansia, dan ambulans warga',
    logoUrl: '',
  },
  {
    id: 'Kepemudaan',
    name: 'Kepemudaan',
    description: 'Karang Taruna dan wadah kreativitas pemuda Bintara Jaya Permai',
    logoUrl: '',
  },
  {
    id: 'Olahraga',
    name: 'Olahraga',
    description: 'Fasilitas dan klub olahraga warga RW 11',
    logoUrl: '',
  },
];

export const DEFAULT_RTRW_CONFIG: RtRwPageConfig = {
  enabled: true,
  pageTitle: 'Informasi RT/RW 11 Bintara Jaya Permai',
  pageDescription: 'Visi misi pengurus dan data RT 01 s/d RT 09 Bintara Jaya Permai.',
  heroImage: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
  visionTitle: '🏛️ Visi & Misi Resmi RW 11',
  visionHeading: 'Visi & Misi Pengurus RW 11 Bintara Jaya Permai',
  visionText: 'Mewujudkan lingkungan RW 011 dengan prinsip TeGAR sebagai sebuah komitmen bersama. Dengan menjadi warga yang Tertib pada aturan, Guyub dalam persaudaraan, Antusias dalam berpartisipasi, dan Rukun dalam perbedaan, Perumahan Bintara Jaya Permai RW 011 akan menjadi rumah idaman yang aman, nyaman, dan membawa kebahagiaan bagi seluruh penghuninya.',
  missions: [
    'Berpartisipasi aktif dalam pelestarian lingkungan hidup dengan menciptakan lingkungan yang asri: sehat, maju, aman, rukun dan tentram.',
    'Mendukung program yang dicanangkan oleh pemerintah Kota Bekasi.',
    'Menggali semua potensi warga dan memberdayakan peran aktif warga untuk mendorong tercapainya kehidupan masyarakat yang TeGAR.',
    'Membuat sistem administrasi yang tertib & modern dengan memanfaatkan teknologi informasi terkini.',
    'Memberikan pelayanan terbaik kepada warga RW.011 dengan tulus dan ikhlas.',
  ],
  values: [
    { title: 'Tertib', description: 'Setiap warga memiliki kesadaran tinggi terhadap aturan dan norma yang berlaku, baik tertulis maupun tidak tertulis — keteraturan adalah kunci kenyamanan bersama.' },
    { title: 'Guyub', description: 'Akar budaya masyarakat Indonesia yang menjunjung tinggi kebersamaan, rasa kekeluargaan, dan saling peduli antar tetangga.' },
    { title: 'Antusias', description: 'Energi positif warga — lingkungan yang hidup adalah lingkungan yang warganya proaktif dan bersemangat, bukan sekadar penonton.' },
    { title: 'Rukun', description: 'Muara dari seluruh prinsip di atas: suasana harmonis, damai, dan minim konflik, dengan menghormati perbedaan dan mengutamakan musyawarah.' },
  ],
  rtListTitle: 'Rincian Informasi Wilayah per RT (RT 01 s/d RT 09)',
  rtListDescription: 'RW 011 terdiri dari 9 RT (masa bakti 2022-2027). Data ketua dan kontak per-RT sedang dilengkapi oleh pengurus — silakan tambahkan melalui menu CMS.',
  rts: [],
  extraSectionTitle: 'Dokumen & Informasi Resmi RT/RW',
  extraSectionDescription: 'Tata tertib warga dan struktur pengurus resmi RW 011 Bintara Jaya Permai.',
  extraCards: [
    {
      id: 'card-txt-1',
      type: 'text',
      title: 'Tata Tertib Warga RW 011',
      description: 'Ringkasan aturan bersama warga Bintara Jaya Permai.',
      categoryBadge: 'Peraturan Warga',
      textContent: '1. Warga wajib berperan aktif menjaga keamanan, kebersihan, ketertiban, dan kerukunan bersama.\n2. Mematuhi aturan lalu lintas kendaraan di pintu keluar-masuk komplek.\n3. Warga baru wajib lapor ke RT setempat; warga pindah wajib lapor sebelum keluar.\n4. Jam bertamu: hingga 22.00 WIB (hari kerja) dan 24.00 WIB (Sabtu-Minggu); tamu menginap wajib dilaporkan.\n5. Iuran kebersihan & keamanan dibayar paling lambat tanggal 5 setiap bulan.\n6. Kerja bakti wajib setiap Minggu pertama tiap bulan, pukul 08.00 WIB.\n7. Acara/hajatan wajib diberitahukan ke pengurus minimal 3 hari sebelumnya.\n8. Kegiatan di masjid memerlukan izin RW dan pengurus masjid.\n9. Dilarang keras: peredaran narkoba, penjualan minuman keras, perjudian, dan tindak asusila/kriminal di rumah.\n10. Warga wajib menjaga kerapian rumah; material bangunan tidak boleh menutup jalan umum; hewan peliharaan wajib diawasi; renovasi wajib lapor + identitas pekerja.\n11. Pelanggaran akan dikenakan teguran tertulis hingga penundaan pelayanan surat oleh RT.',
      author: 'Pengurus RW 011 Bintara Jaya Permai',
      enabled: true,
      order: 0,
    },
    {
      id: 'card-txt-2',
      type: 'text',
      title: 'Struktur Pengurus RW 011 (Periode 2022-2027)',
      description: 'Susunan pengurus resmi RW 011 Bintara Jaya Permai.',
      categoryBadge: 'Struktur Organisasi',
      textContent: 'Ketua RW 11: H. Dadang Rachmat Hidayatulloh\nSekretaris: H. Hery Suadi\nBendahara: Ari Hartanto\n\nBidang Pembangunan & Infrastruktur: Sadikin Firdaus, H. Edy Efendy Siraz\nBidang Sosial & Budaya: H. Rusdi Rifai, H. Unang Juhana\nBidang Keamanan & Ketertiban Masyarakat: Use, Engkus Kusnadi, Bambang K.\nBidang Kebersihan & Lingkungan Hidup: H. Yusuf A, H. Suherman, Darlis Dahlan\nBidang Pemuda & Olahraga: H. Asep, Karang Taruna\n\nPembina: Zaenal Arifin, S.E. (Lurah Bintara Jaya)\nPenasehat: H. Bachri Marzuki, H. FR. Ghanty Sy., H. Nazir Syafrie, H. Sadikin Marpaung',
      author: 'Sekretariat RW 011',
      enabled: true,
      order: 1,
    },
    {
      id: 'card-pdf-1',
      type: 'pdf',
      title: 'Tatib Warga RW 011 (2026)',
      description: 'Dokumen resmi Tata Tertib Warga RW 011 Bintara Jaya Permai versi 2026.',
      categoryBadge: 'Peraturan Warga',
      fileUrl: 'https://drive.google.com/file/d/1GLF1PYdr3Fy903pRUVLtyJSxouEgughb/view?usp=sharing',
      fileName: 'Tatib Warga RW11 BJP 2026.pdf',
      ctaText: 'Buka Dokumen Lengkap',
      enabled: true,
      order: 2,
    },
  ],
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  logoUrl: BJP_LOGO_URL,
  siteTitle: 'BJP.hub Bintara Jaya Permai',
  siteDescription: 'Portal Resmi Ekosistem & Kegiatan Warga Komplek Bintara Jaya Permai (RW 11)',
  navbarTabs: [
    { id: 'entities', label: 'Komunitas Kegiatan', enabled: true, order: 0 },
    { id: 'rtrw', label: 'Informasi RT/RW', enabled: true, order: 1 },
    { id: 'announcements', label: 'Pengumuman & Agenda', enabled: true, order: 2 },
    { id: 'document_service', label: 'Layanan Surat Online', enabled: true, order: 3 },
    { id: 'polling', label: 'Polling & Aspirasi Warga', enabled: true, order: 4 },
  ],
  categoryConfigs: DEFAULT_CATEGORY_CONFIGS,
  mediaPartners: [
    {
      id: 'mp-1',
      name: 'Bintarajayapermai.ofc',
      logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      instagramUrl: 'https://www.instagram.com/bintarajayapermai.ofc/',
      instagramEnabled: true,
      youtubeUrl: 'https://www.youtube.com/@bintarajayapermai',
      youtubeEnabled: true,
      enabled: true,
      order: 0,
    },
    {
      id: 'mp-2',
      name: 'Masjid.alaqwam',
      logoUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=200&auto=format&fit=crop&q=80',
      instagramUrl: 'https://www.instagram.com/masjid.alaqwam/',
      instagramEnabled: true,
      youtubeUrl: 'https://www.youtube.com/@masjid.alaqwam',
      youtubeEnabled: true,
      enabled: true,
      order: 1,
    },
    {
      id: 'mp-3',
      name: 'Kamu.sejahtera',
      logoUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=200&auto=format&fit=crop&q=80',
      instagramUrl: 'https://www.instagram.com/kamu.sejahtera/',
      instagramEnabled: true,
      youtubeUrl: '',
      youtubeEnabled: false,
      enabled: true,
      order: 2,
    },
    {
      id: 'mp-4',
      name: 'Rapermata.alaqwam',
      logoUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=200&auto=format&fit=crop&q=80',
      instagramUrl: 'https://www.instagram.com/rapermata.alaqwam/',
      instagramEnabled: true,
      youtubeUrl: '',
      youtubeEnabled: false,
      enabled: true,
      order: 3,
    },
    {
      id: 'mp-5',
      name: 'Bjpladiesclub',
      logoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      instagramUrl: 'https://www.instagram.com/bjpladiesclub/',
      instagramEnabled: true,
      youtubeUrl: '',
      youtubeEnabled: false,
      enabled: true,
      order: 4,
    },
  ],
  documentTemplates: [
    {
      id: 'tmpl-1',
      title: 'Surat Pengantar RT / RW 11',
      code: 'SURAT_PENGANTAR_RTRW',
      category: 'Pemerintahan / Kependudukan',
      description: 'Surat pengantar resmi warga untuk pengurusan KTP, Kartu Keluarga, atau Akta di Kantor Kelurahan Bintara Jaya.',
      enabled: true,
      templateBody: 'Bahwa nama tersebut di atas adalah benar-benar warga yang bertempat tinggal dan berdomisili di Komplek Bintara Jaya Permai RW 11. Surat pengantar ini diterbitkan untuk keperluan pengurusan administrasi kependudukan.',
    },
    {
      id: 'tmpl-2',
      title: 'Surat Keterangan Domisili Tempat Tinggal',
      code: 'SURAT_KET_DOMISILI',
      category: 'Kependudukan',
      description: 'Surat keterangan domisili bagi warga menetap di Komplek Bintara Jaya Permai.',
      enabled: true,
      templateBody: 'Menerangkan dengan sebenarnya bahwa warga yang bersangkutan adalah penduduk yang menetap dan berdomisili di lingkungan RW 11 Bintara Jaya Permai.',
    },
    {
      id: 'tmpl-3',
      title: 'Surat Keterangan Kegiatan Usaha (SKU) Sentra UMKM',
      code: 'SURAT_KET_USAHA',
      category: 'Sentra Usaha / Ekonomi',
      description: 'Surat keterangan resmi kegiatan usaha / UMKM warga Bintara Jaya Permai.',
      enabled: true,
      templateBody: 'Menerangkan bahwa nama tersebut memiliki dan menjalankan kegiatan usaha UMKM di wilayah Komplek Bintara Jaya Permai (RW 11) dan terdaftar aktif dalam Sentra Usaha BJP HUB.',
    },
  ],
  pollingConfig: {
    enabled: true,
    pageTitle: 'Polling & Suara Aspirasi Warga RW 11',
    pageDescription: 'Sampaikan suara dan aspirasi Anda untuk RW 11.',
    section1: {
      id: 'sec-1',
      enabled: true,
      title: 'Survei Evaluasi & Aspirasi Fasilitas Lingkungan',
      description: 'Silakan isi formulir survei evaluasi kebersihan, keamanan, dan fasilitas bersama RW 11 Bintara Jaya Permai.',
      formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc_sample1/viewform?embedded=true',
    },
    section2: {
      id: 'sec-2',
      enabled: true,
      title: 'Polling Usulan Kegiatan Bazar & Fest Sentra UMKM',
      description: 'Sampaikan ide, saran produk, dan voting jadwal kegiatan bazar/fest bulanan warga Bintara Jaya Permai.',
      formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc_sample2/viewform?embedded=true',
    },
  },
  rtRwConfig: DEFAULT_RTRW_CONFIG,
};

// ---------------------------------------------------------------------------
// Helper: normalize legacy category names using centralized map
// ---------------------------------------------------------------------------
function normalizeCategoryName(category: string): string {
  return CATEGORY_LEGACY_MAP[category] ?? category;
}

// ---------------------------------------------------------------------------
// Site Settings
// ---------------------------------------------------------------------------
export function getSiteSettings(): SiteSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SITE_SETTINGS);
    if (data) {
      const parsed = JSON.parse(data);
      const savedCategoryConfigs: CategoryHeaderConfig[] = Array.isArray(parsed.categoryConfigs)
        ? parsed.categoryConfigs
        : [];
      const mergedCategoryConfigs = DEFAULT_CATEGORY_CONFIGS.map((def) => {
        const found = savedCategoryConfigs.find((c) => c.id === def.id || c.name === def.id);
        if (found) {
          return {
            ...def,
            ...found,
            logoUrl:
              def.id === 'Sentra Usaha BJP' && !found.logoUrl ? def.logoUrl : found.logoUrl || '',
          };
        }
        return def;
      });

      // Ensure navbarTabs includes rtrw, document_service, and polling if missing
      // (site settings saved before these features existed)
      const loadedNavbarTabs = Array.isArray(parsed.navbarTabs) && parsed.navbarTabs.length > 0
        ? [...parsed.navbarTabs]
        : [...DEFAULT_SITE_SETTINGS.navbarTabs];

      if (!loadedNavbarTabs.some((t: any) => t.id === 'rtrw')) {
        loadedNavbarTabs.push({ id: 'rtrw', label: 'Informasi RT/RW', enabled: true, order: loadedNavbarTabs.length });
      }
      if (!loadedNavbarTabs.some((t: any) => t.id === 'document_service')) {
        loadedNavbarTabs.push({ id: 'document_service', label: 'Layanan Surat Online', enabled: true, order: loadedNavbarTabs.length });
      }
      if (!loadedNavbarTabs.some((t: any) => t.id === 'polling')) {
        loadedNavbarTabs.push({ id: 'polling', label: 'Polling & Aspirasi Warga', enabled: true, order: loadedNavbarTabs.length });
      }

      return {
        logoUrl: parsed.logoUrl || BJP_LOGO_URL,
        siteTitle: parsed.siteTitle || DEFAULT_SITE_SETTINGS.siteTitle,
        siteDescription: parsed.siteDescription || DEFAULT_SITE_SETTINGS.siteDescription,
        navbarTabs: loadedNavbarTabs,
        categoryConfigs: mergedCategoryConfigs,
        securitySchedules: Array.isArray(parsed.securitySchedules) ? parsed.securitySchedules : [],
        mediaPartners: Array.isArray(parsed.mediaPartners) ? parsed.mediaPartners : DEFAULT_SITE_SETTINGS.mediaPartners,
        documentTemplates: Array.isArray(parsed.documentTemplates)
          ? parsed.documentTemplates
          : DEFAULT_SITE_SETTINGS.documentTemplates,
        pollingConfig: parsed.pollingConfig || DEFAULT_SITE_SETTINGS.pollingConfig,
        rtRwConfig: parsed.rtRwConfig
          ? {
              ...DEFAULT_RTRW_CONFIG,
              ...parsed.rtRwConfig,
              extraCards: Array.isArray(parsed.rtRwConfig.extraCards)
                ? parsed.rtRwConfig.extraCards
                : DEFAULT_RTRW_CONFIG.extraCards,
            }
          : DEFAULT_RTRW_CONFIG,
      };
    }
  } catch (err) {
    console.error('Failed to load site settings', err);
  }
  return DEFAULT_SITE_SETTINGS;
}

export function saveSiteSettings(settings: SiteSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SITE_SETTINGS, JSON.stringify(settings));
    updateSiteFaviconAndOgImage(settings.logoUrl);
    if (isSupabaseConfigured()) {
      saveSiteSettingsToSupabase(settings).catch((err) =>
        console.error('Supabase sync error:', err)
      );
    }
  } catch (err) {
    console.error('Failed to save site settings', err);
  }
}

// ---------------------------------------------------------------------------
// Entities
// ---------------------------------------------------------------------------
export function getEntities(): Entity[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ENTITIES);
    let list: Entity[] = INITIAL_ENTITIES;
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
        // Merge any new seed entities that may have been added after last save
        INITIAL_ENTITIES.forEach((initE) => {
          if (!list.some((item) => item.id === initE.id)) {
            list.push(initE);
          }
        });
      }
    }
    return list.map((e) => {
      const normalizedCategory = normalizeCategoryName(e.category);
      const initMatch = INITIAL_ENTITIES.find((i) => i.id === e.id);
      if (initMatch) {
        return {
          ...e,
          category: normalizedCategory,
          image: e.id === 'ent-4' ? initMatch.image : e.image,
          productPhotos:
            e.id === 'ent-4' || !e.productPhotos || e.productPhotos.length === 0
              ? initMatch.productPhotos
              : e.productPhotos,
          socials: e.socials || initMatch.socials,
        };
      }
      return { ...e, category: normalizedCategory };
    });
  } catch (err) {
    console.error('Failed to load entities from storage', err);
    return INITIAL_ENTITIES;
  }
}

export function saveEntities(entities: Entity[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ENTITIES, JSON.stringify(entities));
    if (isSupabaseConfigured()) {
      saveEntitiesToSupabase(entities).catch((err) =>
        console.error('Supabase sync error:', err)
      );
    }
  } catch (err) {
    console.error('Failed to save entities to storage', err);
  }
}

// ---------------------------------------------------------------------------
// Announcements
// ---------------------------------------------------------------------------
export function getAnnouncements(): Announcement[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    let list: Announcement[] = INITIAL_ANNOUNCEMENTS;
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
      }
    }
    return list.map((a) => ({
      ...a,
      category: normalizeCategoryName(a.category),
    }));
  } catch (err) {
    console.error('Failed to load announcements from storage', err);
    return INITIAL_ANNOUNCEMENTS;
  }
}

export function saveAnnouncements(announcements: Announcement[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
    if (isSupabaseConfigured()) {
      saveAnnouncementsToSupabase(announcements).catch((err) =>
        console.error('Supabase sync error:', err)
      );
    }
  } catch (err) {
    console.error('Failed to save announcements to storage', err);
  }
}

// ---------------------------------------------------------------------------
// Helpers: Reset & Import/Export
// ---------------------------------------------------------------------------
export function resetToDefaults(): { entities: Entity[]; announcements: Announcement[] } {
  saveEntities(INITIAL_ENTITIES);
  saveAnnouncements(INITIAL_ANNOUNCEMENTS);
  return { entities: INITIAL_ENTITIES, announcements: INITIAL_ANNOUNCEMENTS };
}

export function exportDataAsJSON(entities: Entity[], announcements: Announcement[]) {
  const exportPayload = {
    appName: 'BJP.hub - Bintara Jaya Permai',
    exportedAt: new Date().toISOString(),
    entities,
    announcements,
  };
  const jsonStr = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bjp-hub-data-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importDataFromJSON(
  jsonString: string
): { success: boolean; entities?: Entity[]; announcements?: Announcement[]; message: string } {
  try {
    const parsed = JSON.parse(jsonString);
    let newEntities: Entity[] = [];
    let newAnnouncements: Announcement[] = [];

    if (Array.isArray(parsed.entities)) {
      newEntities = parsed.entities;
    } else if (Array.isArray(parsed) && parsed[0]?.name) {
      newEntities = parsed;
    }

    if (Array.isArray(parsed.announcements)) {
      newAnnouncements = parsed.announcements;
    }

    if (newEntities.length === 0 && newAnnouncements.length === 0) {
      return { success: false, message: 'Format file JSON tidak valid atau kosong.' };
    }

    if (newEntities.length > 0) saveEntities(newEntities);
    if (newAnnouncements.length > 0) saveAnnouncements(newAnnouncements);

    return {
      success: true,
      entities: newEntities.length > 0 ? newEntities : undefined,
      announcements: newAnnouncements.length > 0 ? newAnnouncements : undefined,
      message: `Berhasil mengimpor ${newEntities.length} komunitas dan ${newAnnouncements.length} pengumuman.`,
    };
  } catch {
    return { success: false, message: 'Gagal membaca file JSON. Pastikan format file benar.' };
  }
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------
export function getUsers(): User[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure the default super admin always exists in the list
        const superAdminExists = parsed.some((u: User) => u.username === 'admin');
        if (!superAdminExists) {
          parsed.unshift(DEFAULT_USERS[0]);
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load users from storage', err);
  }
  // First load — initialize with defaults
  saveUsers(DEFAULT_USERS);
  return DEFAULT_USERS;
}

export function saveUsers(users: User[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    if (isSupabaseConfigured()) {
      saveUsersToSupabase(users).catch((err) => console.error('Supabase sync error:', err));
    }
  } catch (err) {
    console.error('Failed to save users to storage', err);
  }
}

export function getLoggedInUser(): User | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LOGGED_IN_USER);
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Failed to get logged in user', err);
  }
  return null;
}

export function saveLoggedInUser(user: User | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.LOGGED_IN_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.LOGGED_IN_USER);
    }
  } catch (err) {
    console.error('Failed to save logged in user', err);
  }
}
