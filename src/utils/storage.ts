import { Entity, Announcement } from '../types';
import { INITIAL_ENTITIES, INITIAL_ANNOUNCEMENTS } from '../data/initialData';

const STORAGE_KEY_ENTITIES = 'bjp_hub_entities_v1';
const STORAGE_KEY_ANNOUNCEMENTS = 'bjp_hub_announcements_v1';

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
          productPhotos:
            e.productPhotos && e.productPhotos.length > 0
              ? e.productPhotos
              : initMatch.productPhotos,
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
