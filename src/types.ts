export type UserRole = 'super_admin' | 'entity_admin';

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: UserRole;
  allowedEntityIds: string[]; // ['*'] for all entities or specific array of entity IDs
  createdAt: string;
}

export interface SocialItem {
  enabled: boolean;
  url: string;
}

export interface EntitySocials {
  tiktok?: SocialItem;
  facebook?: SocialItem;
  instagram?: SocialItem;
  whatsapp?: SocialItem;
}

export interface Entity {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  ctaUrl: string;
  ctaWording: string;
  instagram?: string;
  mediaUrl?: string;
  contact?: string;
  schedule?: string;
  address?: string;
  infoNotes?: string;
  isFeatured?: boolean;
  socials?: EntitySocials;
  productPhotos?: string[];
  productPhotoCaptions?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NavbarTabConfig {
  id: 'entities' | 'announcements' | string;
  label: string;
  enabled: boolean;
  order: number;
}

export interface CategoryHeaderConfig {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
}

export interface SecuritySchedule {
  date: string; // YYYY-MM-DD format
  guards: string; // Nama petugas
}

export interface SiteSettings {
  logoUrl: string;
  siteTitle?: string;
  siteDescription?: string;
  navbarTabs: NavbarTabConfig[];
  categoryConfigs?: CategoryHeaderConfig[];
  securitySchedules?: SecuritySchedule[];
}

export interface Announcement {
  id: string;
  title: string;
  category: string;
  date: string;
  content: string;
  author: string;
  ctaUrl?: string;
  ctaWording?: string;
  isImportant?: boolean;
  image?: string;
  order?: number;
}

export type CategoryType =
  | 'Semua'
  | 'Pusat Hub'
  | 'Pemerintahan'
  | 'Keagamaan'
  | 'Ekonomi / UMKM'
  | 'Lingkungan'
  | 'Kesejahteraan Keluarga'
  | 'Kesehatan'
  | 'Kepemudaan'
  | 'Olahraga';
