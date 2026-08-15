/**
 * Centralized constants for the BJP.hub application.
 * Eliminates duplicated magic strings across utils, components, and server.
 */

// -----------------------------------------------------------------------------
// Fallback Images
// -----------------------------------------------------------------------------
export const FALLBACK_IMAGE_URL =
  'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80';

export const FALLBACK_ENTITY_IMAGE_URL =
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80';

// -----------------------------------------------------------------------------
// Default SEO / Site Metadata
// -----------------------------------------------------------------------------
export const DEFAULT_SITE_TITLE = 'Portal BJP.hub - Bintara Jaya Permai (RW 11)';

export const DEFAULT_SITE_DESCRIPTION =
  'Website Portal Informasi Kegiatan & Komunitas Warga Komplek Bintara Jaya Permai (RW 11) Bekasi';

export const DEFAULT_OG_SITE_NAME = 'BJP.hub RW 11';

// -----------------------------------------------------------------------------
// LocalStorage Keys
// -----------------------------------------------------------------------------
export const STORAGE_KEYS = {
  ENTITIES: 'bjp_hub_entities_v1',
  ANNOUNCEMENTS: 'bjp_hub_announcements_v1',
  SITE_SETTINGS: 'bjp_hub_site_settings_v1',
  USERS: 'bjp_hub_users_v1',
  LOGGED_IN_USER: 'bjp_hub_logged_in_user_v1',
} as const;

// -----------------------------------------------------------------------------
// Category Legacy Mapping
// -----------------------------------------------------------------------------
export const CATEGORY_LEGACY_MAP: Record<string, string> = {
  'Ekonomi / UMKM': 'Sentra Usaha BJP',
  'Ekonomi/UMKM': 'Sentra Usaha BJP',
};

export const DEFAULT_PORT = 8080;

// -----------------------------------------------------------------------------
// Card Text Limits (keeps titles & descriptions consistent across all cards)
// -----------------------------------------------------------------------------
export const CARD_TITLE_MAX_LENGTH = 20;
export const CARD_DESCRIPTION_MAX_LENGTH = 60;
