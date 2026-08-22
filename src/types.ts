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

export type CardType = 'standard' | 'photo_album';

export interface PhotoAlbumItem {
  id: string;
  url: string;
  caption?: string;
  enabled: boolean;
}

export interface Entity {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  ctaUrl: string;
  ctaWording: string;
  cardType?: CardType; // 'standard' | 'photo_album'
  albumPhotos?: PhotoAlbumItem[]; // Max 10 photos
  instagram?: string;
  mediaUrl?: string; // Shown as the "Portal Website" link on the entity detail page
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
  id: 'entities' | 'announcements' | 'document_service' | 'polling' | 'rtrw' | string;
  label: string;
  enabled: boolean;
  order: number;
}

export interface PollingSection {
  id: string;
  enabled: boolean;
  title: string;
  description?: string;
  formUrl: string;
}

export interface PollingPageConfig {
  enabled: boolean;
  pageTitle: string;
  pageDescription?: string;
  section1: PollingSection;
  section2: PollingSection;
}

export type PageLayoutType = 'default' | 'photo_album' | 'single_page';

export interface CategoryHeaderConfig {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  layoutType?: PageLayoutType; // 'default' | 'photo_album' | 'single_page'
  singlePageHeroImage?: string;
  singlePageContent?: string;
}

export interface MediaPartnerItem {
  id: string;
  name: string;
  logoUrl?: string;
  instagramUrl?: string;
  instagramEnabled?: boolean;
  youtubeUrl?: string;
  youtubeEnabled?: boolean;
  enabled: boolean;
  order: number;
}

export interface FeaturedVideoItem {
  id: string;
  title: string;
  youtubeUrl: string;
  enabled: boolean;
  order: number;
}

export interface DocumentTemplate {
  id: string;
  title: string;
  code: string;
  description: string;
  category: string;
  templateBody: string;
  fileUrl?: string; // Data URL or URL to uploaded document template file (.docx, .pdf, etc)
  fileName?: string; // Original name of uploaded template file
  enabled: boolean;
}

export interface RtDetailItem {
  id: string;
  rtNumber: string; // e.g. "01"
  rwNumber: string; // e.g. "11"
  chairmanName: string; // e.g. "Bpk. H. Bambang Sugiarto"
  kkCount: string; // e.g. "48 KK"
  coverageArea: string; // e.g. "Blok A1 — A15"
  workSchedule: string; // e.g. "Minggu Ke-1 Setiap Bulan"
  featuredProgram: string; // e.g. "Penghijauan Taman RT & Bank Sampah Mandiri"
  contactPhone: string; // e.g. "0812-1111-2201"
  enabled: boolean;
}

export interface RtRwValueItem {
  title: string;
  description: string;
}

export type RtRwCardType = 'pdf' | 'image' | 'text';

export interface RtRwContentCard {
  id: string;
  type: RtRwCardType;
  title: string;
  description?: string;
  categoryBadge?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  ctaText?: string;
  imageUrl?: string;
  imageCaption?: string;
  textContent?: string;
  author?: string;
  date?: string;
  enabled: boolean;
  order: number;
}

export interface RtRwPageConfig {
  enabled: boolean;
  pageTitle: string;
  pageDescription: string;
  heroImage: string;
  visionTitle: string;
  visionHeading: string;
  visionText: string;
  missions: string[];
  values: RtRwValueItem[];
  rtListTitle: string;
  rtListDescription: string;
  rts: RtDetailItem[];
  extraSectionTitle?: string;
  extraSectionDescription?: string;
  extraCards?: RtRwContentCard[];
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
  mediaPartners?: MediaPartnerItem[];
  featuredVideos?: FeaturedVideoItem[];
  documentTemplates?: DocumentTemplate[];
  pollingConfig?: PollingPageConfig;
  rtRwConfig?: RtRwPageConfig;
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
