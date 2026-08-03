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
    allowedEntityIds: ['ent-umkm-1', 'ent-umkm-2', 'ent-4'],
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

export const DEFAULT_CATEGORY_CONFIGS: CategoryHeaderConfig[] = [
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

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  logoUrl: BJP_LOGO_URL,
  siteTitle: 'BJP.hub Bintara Jaya Permai',
  siteDescription: 'Portal Resmi Ekosistem & Kegiatan Warga Komplek Bintara Jaya Permai (RW 11)',
  navbarTabs: [
    { id: 'entities', label: 'Komunitas Kegiatan', enabled: true, order: 0 },
    { id: 'announcements', label: 'Pengumuman & Agenda', enabled: true, order: 1 },
  ],
  categoryConfigs: DEFAULT_CATEGORY_CONFIGS,
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

      return {
        logoUrl: parsed.logoUrl || BJP_LOGO_URL,
        siteTitle: parsed.siteTitle || DEFAULT_SITE_SETTINGS.siteTitle,
        siteDescription: parsed.siteDescription || DEFAULT_SITE_SETTINGS.siteDescription,
        navbarTabs:
          Array.isArray(parsed.navbarTabs) && parsed.navbarTabs.length > 0
            ? parsed.navbarTabs
            : DEFAULT_SITE_SETTINGS.navbarTabs,
        categoryConfigs: mergedCategoryConfigs,
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
