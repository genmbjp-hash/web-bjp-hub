import { Entity, Announcement, SiteSettings, CategoryHeaderConfig, User } from '../types';
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

const STORAGE_KEY_ENTITIES = 'bjp_hub_entities_v1';
const STORAGE_KEY_ANNOUNCEMENTS = 'bjp_hub_announcements_v1';
const STORAGE_KEY_SITE_SETTINGS = 'bjp_hub_site_settings_v1';
const STORAGE_KEY_USERS = 'bjp_hub_users_v1';
const STORAGE_KEY_LOGGED_IN_USER = 'bjp_hub_logged_in_user_v1';

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
    allowedEntityIds: ['ent-umkm-1', 'ent-umkm-2', 'ent-4'],
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
    id: 'Informasi RT/RW',
    name: 'Informasi RT/RW',
    description: 'Struktur Organisasi, Visi Misi Pengurus RW 11, serta Breakdown Rincian Informasi RT 01 s/d RT 07 Bintara Jaya Permai',
    logoUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
    layoutType: 'single_page',
    singlePageHeroImage: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
    singlePageContent: `<div class="space-y-8 text-stone-800">
  <div class="bg-gradient-to-br from-emerald-900 to-stone-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-emerald-700/40 space-y-4">
    <div class="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-bold border border-amber-400/30">
      <span>🏛️ Visi & Misi Resmi RW 11</span>
    </div>
    <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
      Visi & Misi Pengurus RW 11 Bintara Jaya Permai
    </h2>
    <p class="text-sm sm:text-base text-stone-200 leading-relaxed font-medium">
      "Mewujudkan Lingkungan RW 11 Komplek Bintara Jaya Permai yang Aman, Asri, Religius, Harmonis, dan Inovatif Berbasis Pelayanan Digital & Gotong Royong Warga."
    </p>

    <div class="pt-4 border-t border-emerald-800/80 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-stone-200">
      <div class="bg-black/30 p-4 rounded-2xl border border-emerald-500/20 space-y-2">
        <h3 class="font-bold text-emerald-300 text-sm flex items-center gap-2">
          <span>🎯 Misi Utama Kepengurusan</span>
        </h3>
        <ul class="space-y-2 list-disc list-inside text-stone-300">
          <li>Meningkatkan pelayanan administrasi kependudukan cepat, transparan, dan terintegrasi digital.</li>
          <li>Menjaga ketertiban & keamanan lingkungan melalui Siskamling terpadu dan CCTV 24 jam.</li>
          <li>Mengembangkan Sentra Usaha UMKM BJP untuk kemandirian ekonomi warga rumahan.</li>
          <li>Menggalakkan kerja bakti berkala dan pengelolaan sampah mandiri berbasis lingkungan asri.</li>
        </ul>
      </div>

      <div class="bg-black/30 p-4 rounded-2xl border border-emerald-500/20 space-y-2">
        <h3 class="font-bold text-amber-300 text-sm flex items-center gap-2">
          <span>🌟 Nilai-Nilai Utama Warga</span>
        </h3>
        <ul class="space-y-2 list-disc list-inside text-stone-300">
          <li><strong>Gotong Royong:</strong> Kebersamaan dalam membangun fasilitas dan kebersihan komplek.</li>
          <li><strong>Transparansi:</strong> Pengelolaan keuangan dan informasi pengumuman secara terbuka.</li>
          <li><strong>Inklusif:</strong> Merangkul seluruh komponen usia dari anak-anak, remaja, hingga lansia.</li>
          <li><strong>Inovatif:</strong> Digitalisasi layanan surat online mandiri dan portal informasi terpadu.</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="space-y-4">
    <div class="flex items-center justify-between border-b border-stone-200 pb-3">
      <div>
        <h3 class="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
          <span>Rincian Informasi Wilayah per RT (RT 01 s/d RT 07)</span>
        </h3>
        <p class="text-xs text-stone-500">
          Daftar ketua RT, cakupan wilayah blok, jumlah KK, dan program unggulan masing-masing RT di RW 11.
        </p>
      </div>
      <span class="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-900 rounded-lg">
        Total 7 Wilayah RT
      </span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all space-y-3">
        <div class="flex items-center justify-between">
          <span class="px-3 py-1 bg-emerald-800 text-white text-xs font-bold rounded-lg">RT 01 / RW 11</span>
          <span class="text-xs font-semibold text-stone-500">48 KK</span>
        </div>
        <h4 class="font-bold text-stone-900 text-base">Ketua RT: Bpk. H. Bambang Sugiarto</h4>
        <div class="text-xs space-y-1.5 text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100">
          <p><strong>Cakupan Wilayah:</strong> Blok A1 — A15</p>
          <p><strong>Jadwal Kerja Bakti:</strong> Minggu Ke-1 Setiap Bulan</p>
          <p><strong>Program Unggulan:</strong> Penghijauan Taman RT & Bank Sampah Mandiri</p>
          <p><strong>Kontak RT:</strong> 0812-1111-2201</p>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all space-y-3">
        <div class="flex items-center justify-between">
          <span class="px-3 py-1 bg-emerald-800 text-white text-xs font-bold rounded-lg">RT 02 / RW 11</span>
          <span class="text-xs font-semibold text-stone-500">52 KK</span>
        </div>
        <h4 class="font-bold text-stone-900 text-base">Ketua RT: Bpk. Drs. Suherman</h4>
        <div class="text-xs space-y-1.5 text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100">
          <p><strong>Cakupan Wilayah:</strong> Blok B1 — B20</p>
          <p><strong>Jadwal Kerja Bakti:</strong> Minggu Ke-2 Setiap Bulan</p>
          <p><strong>Program Unggulan:</strong> Pos Ronda Digital & CCTV Terpadu</p>
          <p><strong>Kontak RT:</strong> 0812-1111-2202</p>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all space-y-3">
        <div class="flex items-center justify-between">
          <span class="px-3 py-1 bg-emerald-800 text-white text-xs font-bold rounded-lg">RT 03 / RW 11</span>
          <span class="text-xs font-semibold text-stone-500">45 KK</span>
        </div>
        <h4 class="font-bold text-stone-900 text-base">Ketua RT: Bpk. Ahmad Fauzi, S.E.</h4>
        <div class="text-xs space-y-1.5 text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100">
          <p><strong>Cakupan Wilayah:</strong> Blok C1 — C18</p>
          <p><strong>Jadwal Kerja Bakti:</strong> Minggu Ke-3 Setiap Bulan</p>
          <p><strong>Program Unggulan:</strong> Pembinaan Olahraga Remaja & Bulutangkis</p>
          <p><strong>Kontak RT:</strong> 0812-1111-2203</p>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all space-y-3">
        <div class="flex items-center justify-between">
          <span class="px-3 py-1 bg-emerald-800 text-white text-xs font-bold rounded-lg">RT 04 / RW 11</span>
          <span class="text-xs font-semibold text-stone-500">50 KK</span>
        </div>
        <h4 class="font-bold text-stone-900 text-base">Ketua RT: Bpk. Ir. Rahmat Hidayat</h4>
        <div class="text-xs space-y-1.5 text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100">
          <p><strong>Cakupan Wilayah:</strong> Blok D1 — D22</p>
          <p><strong>Jadwal Kerja Bakti:</strong> Minggu Ke-1 Setiap Bulan</p>
          <p><strong>Program Unggulan:</strong> Taman Tanaman Obat (TOGA) & Komposting</p>
          <p><strong>Kontak RT:</strong> 0812-1111-2204</p>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all space-y-3">
        <div class="flex items-center justify-between">
          <span class="px-3 py-1 bg-emerald-800 text-white text-xs font-bold rounded-lg">RT 05 / RW 11</span>
          <span class="text-xs font-semibold text-stone-500">42 KK</span>
        </div>
        <h4 class="font-bold text-stone-900 text-base">Ketua RT: Bpk. Hendra Gunawan</h4>
        <div class="text-xs space-y-1.5 text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100">
          <p><strong>Cakupan Wilayah:</strong> Blok E1 — E16</p>
          <p><strong>Jadwal Kerja Bakti:</strong> Minggu Ke-2 Setiap Bulan</p>
          <p><strong>Program Unggulan:</strong> Sentra Usaha UMKM Kuliner Warga</p>
          <p><strong>Kontak RT:</strong> 0812-1111-2205</p>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all space-y-3">
        <div class="flex items-center justify-between">
          <span class="px-3 py-1 bg-emerald-800 text-white text-xs font-bold rounded-lg">RT 06 / RW 11</span>
          <span class="text-xs font-semibold text-stone-500">46 KK</span>
        </div>
        <h4 class="font-bold text-stone-900 text-base">Ketua RT: Bpk. Dr. Agus Triyono</h4>
        <div class="text-xs space-y-1.5 text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100">
          <p><strong>Cakupan Wilayah:</strong> Blok F1 — F20</p>
          <p><strong>Jadwal Kerja Bakti:</strong> Minggu Ke-3 Setiap Bulan</p>
          <p><strong>Program Unggulan:</strong> Pengajian Rutin Keliling & TPA Anak</p>
          <p><strong>Kontak RT:</strong> 0812-1111-2206</p>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all space-y-3 md:col-span-2 lg:col-span-1">
        <div class="flex items-center justify-between">
          <span class="px-3 py-1 bg-emerald-800 text-white text-xs font-bold rounded-lg">RT 07 / RW 11</span>
          <span class="text-xs font-semibold text-stone-500">40 KK</span>
        </div>
        <h4 class="font-bold text-stone-900 text-base">Ketua RT: Bpk. M. Yasin, S.T.</h4>
        <div class="text-xs space-y-1.5 text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100">
          <p><strong>Cakupan Wilayah:</strong> Blok G1 — G18</p>
          <p><strong>Jadwal Kerja Bakti:</strong> Minggu Ke-4 Setiap Bulan</p>
          <p><strong>Program Unggulan:</strong> Posyandu Lansia & Pembinaan Karang Taruna</p>
          <p><strong>Kontak RT:</strong> 0812-1111-2207</p>
        </div>
      </div>
    </div>
  </div>
</div>`,
  },
  {
    id: 'Sentra Usaha BJP',
    name: 'Sentra Usaha BJP',
    description: 'Unit entitas, UMKM, dan kegiatan usaha warga Bintara Jaya Permai (RW 11)',
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

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  logoUrl: BJP_LOGO_URL,
  siteTitle: 'BJP HUB Bintara Jaya Permai',
  siteDescription: 'Portal Resmi Ekosistem & Kegiatan Warga Komplek Bintara Jaya Permai (RW 11)',
  navbarTabs: [
    { id: 'entities', label: 'Entitas Kegiatan', enabled: true, order: 0 },
    { id: 'announcements', label: 'Pengumuman & Agenda', enabled: true, order: 1 },
    { id: 'document_service', label: 'Layanan Surat Online', enabled: true, order: 2 },
    { id: 'polling', label: 'Polling & Aspirasi Warga', enabled: true, order: 3 },
  ],
  categoryConfigs: DEFAULT_CATEGORY_CONFIGS,
  runningText: {
    enabled: true,
    text: '📢 SELAMAT DATANG DI PORTAL BJP HUB RW 11 — Informasi Resmi Kegiatan Warga, Sentra UMKM, Agenda RW, & Layanan Surat Menyurat Online Mandiri!',
  },
  socialFeeds: [
    {
      id: 'feed-1',
      title: 'Profil & Kegiatan Gotong Royong Warga Bintara Jaya Permai RW 11',
      description: 'Cuplikan video dokumentasi kebersamaan warga dan kegiatan kebersihan lingkungan di Komplek Bintara Jaya Permai.',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      platform: 'youtube',
      enabled: true,
      order: 0,
    },
    {
      id: 'feed-2',
      title: 'Dokumentasi Bazar & Fest Sentra Usaha UMKM BJP HUB',
      description: 'Reels liputan promosi produk kuliner dan kerajinan warga binaan Sentra UMKM Bintara Jaya Permai.',
      url: 'https://www.instagram.com/reel/C3_sample',
      platform: 'instagram',
      enabled: true,
      order: 1,
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
    pageDescription: 'Partisipasi aktif warga Komplek Bintara Jaya Permai melalui jajak pendapat, polling prioritas pembangunan, dan permohonan aspirasi resmi.',
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
};

export function getSiteSettings(): SiteSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEY_SITE_SETTINGS);
    if (data) {
      const parsed = JSON.parse(data);
      const savedCategoryConfigs: CategoryHeaderConfig[] = Array.isArray(parsed.categoryConfigs) ? parsed.categoryConfigs : [];
      const mergedCategoryConfigs = DEFAULT_CATEGORY_CONFIGS.map((def) => {
        const found = savedCategoryConfigs.find((c) => c.id === def.id || c.name === def.id);
        if (found) {
          return {
            ...def,
            ...found,
            logoUrl: (def.id === 'Sentra Usaha BJP' && !found.logoUrl) ? def.logoUrl : (found.logoUrl || ''),
          };
        }
        return def;
      });

      // Ensure navbarTabs includes document_service and polling if missing
      let loadedNavbarTabs = Array.isArray(parsed.navbarTabs) && parsed.navbarTabs.length > 0
        ? parsed.navbarTabs
        : DEFAULT_SITE_SETTINGS.navbarTabs;

      if (!loadedNavbarTabs.some((t: any) => t.id === 'document_service')) {
        loadedNavbarTabs.push({ id: 'document_service', label: 'Layanan Surat Online', enabled: true, order: 2 });
      }
      if (!loadedNavbarTabs.some((t: any) => t.id === 'polling')) {
        loadedNavbarTabs.push({ id: 'polling', label: 'Polling & Aspirasi', enabled: true, order: 3 });
      }

      return {
        logoUrl: parsed.logoUrl || BJP_LOGO_URL,
        siteTitle: parsed.siteTitle || DEFAULT_SITE_SETTINGS.siteTitle,
        siteDescription: parsed.siteDescription || DEFAULT_SITE_SETTINGS.siteDescription,
        navbarTabs: loadedNavbarTabs,
        categoryConfigs: mergedCategoryConfigs,
        runningText: parsed.runningText || DEFAULT_SITE_SETTINGS.runningText,
        socialFeeds: Array.isArray(parsed.socialFeeds) ? parsed.socialFeeds : DEFAULT_SITE_SETTINGS.socialFeeds,
        documentTemplates: Array.isArray(parsed.documentTemplates) ? parsed.documentTemplates : DEFAULT_SITE_SETTINGS.documentTemplates,
        pollingConfig: parsed.pollingConfig || DEFAULT_SITE_SETTINGS.pollingConfig,
      };
    }
  } catch (err) {
    console.error('Failed to load site settings', err);
  }
  return DEFAULT_SITE_SETTINGS;
}

export function saveSiteSettings(settings: SiteSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SITE_SETTINGS, JSON.stringify(settings));
    updateSiteFaviconAndOgImage(settings.logoUrl);
    if (isSupabaseConfigured()) {
      saveSiteSettingsToSupabase(settings).catch((err) => console.error('Supabase sync error:', err));
    }
  } catch (err) {
    console.error('Failed to save site settings', err);
  }
}

export function getEntities(): Entity[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_ENTITIES);
    let list: Entity[] = INITIAL_ENTITIES;
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
        // Ensure any new initial entities (like ent-umkm-1) are merged if missing
        INITIAL_ENTITIES.forEach((initE) => {
          if (!list.some((item) => item.id === initE.id)) {
            list.push(initE);
          }
        });
      }
    }
    return list.map((e) => {
      const mappedCat =
        e.category === 'Ekonomi / UMKM' || e.category === 'Ekonomi/UMKM'
          ? 'Sentra Usaha BJP'
          : e.category;

      const initMatch = INITIAL_ENTITIES.find((i) => i.id === e.id);
      if (initMatch) {
        return {
          ...e,
          category: mappedCat,
          image: e.id === 'ent-4' ? initMatch.image : e.image,
          productPhotos:
            e.id === 'ent-4' || !e.productPhotos || e.productPhotos.length === 0
              ? initMatch.productPhotos
              : e.productPhotos,
          socials: e.socials || initMatch.socials,
        };
      }

      return {
        ...e,
        category: mappedCat,
      };
    });
  } catch (err) {
    console.error('Failed to load entities from storage', err);
    return INITIAL_ENTITIES;
  }
}

export function saveEntities(entities: Entity[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_ENTITIES, JSON.stringify(entities));
    if (isSupabaseConfigured()) {
      saveEntitiesToSupabase(entities).catch((err) => console.error('Supabase sync error:', err));
    }
  } catch (err) {
    console.error('Failed to save entities to storage', err);
  }
}

export function getAnnouncements(): Announcement[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_ANNOUNCEMENTS);
    let list: Announcement[] = INITIAL_ANNOUNCEMENTS;
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
      }
    }
    return list.map((a) =>
      a.category === 'Ekonomi / UMKM' || a.category === 'Ekonomi/UMKM'
        ? { ...a, category: 'Sentra Usaha BJP' }
        : a
    );
  } catch (err) {
    console.error('Failed to load announcements from storage', err);
    return INITIAL_ANNOUNCEMENTS;
  }
}

export function saveAnnouncements(announcements: Announcement[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_ANNOUNCEMENTS, JSON.stringify(announcements));
    if (isSupabaseConfigured()) {
      saveAnnouncementsToSupabase(announcements).catch((err) => console.error('Supabase sync error:', err));
    }
  } catch (err) {
    console.error('Failed to save announcements to storage', err);
  }
}

export function resetToDefaults(): { entities: Entity[]; announcements: Announcement[] } {
  saveEntities(INITIAL_ENTITIES);
  saveAnnouncements(INITIAL_ANNOUNCEMENTS);
  return { entities: INITIAL_ENTITIES, announcements: INITIAL_ANNOUNCEMENTS };
}

export function exportDataAsJSON(entities: Entity[], announcements: Announcement[]) {
  const exportPayload = {
    appName: 'BJP HUB - Bintara Jaya Permai',
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
      message: `Berhasil mengimpor ${newEntities.length} entitas dan ${newAnnouncements.length} pengumuman.`,
    };
  } catch (err) {
    return { success: false, message: 'Gagal membaca file JSON. Pastikan format file benar.' };
  }
}

export function getUsers(): User[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_USERS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure default super admin account exists in list
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
  // If empty or initial, save and return default users
  saveUsers(DEFAULT_USERS);
  return DEFAULT_USERS;
}

export function saveUsers(users: User[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    if (isSupabaseConfigured()) {
      saveUsersToSupabase(users).catch((err) => console.error('Supabase sync error:', err));
    }
  } catch (err) {
    console.error('Failed to save users to storage', err);
  }
}

export function getLoggedInUser(): User | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY_LOGGED_IN_USER);
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
      localStorage.setItem(STORAGE_KEY_LOGGED_IN_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_LOGGED_IN_USER);
    }
  } catch (err) {
    console.error('Failed to save logged in user', err);
  }
}
