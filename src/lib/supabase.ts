import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User, Entity, Announcement, SiteSettings } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.trim() !== '' &&
    supabaseAnonKey.trim() !== '' &&
    !supabaseUrl.includes('your-supabase-url')
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// SQL Script template to set up Supabase tables
export const SUPABASE_SQL_SETUP_SCRIPT = `-- SQL SETUP UNTUK DATABASE SUPABASE BJP HUB
-- Jalankan skrip ini di Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)

-- 1. Tabel Pengguna (bjp_users)
CREATE TABLE IF NOT EXISTS public.bjp_users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'entity_admin',
  allowed_entity_ids JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Entitas & Card Kegiatan (bjp_entities)
CREATE TABLE IF NOT EXISTS public.bjp_entities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  image TEXT,
  cta_url TEXT,
  cta_wording TEXT,
  instagram TEXT,
  media_url TEXT,
  contact TEXT,
  schedule TEXT,
  address TEXT,
  info_notes TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  socials JSONB DEFAULT '{}'::jsonb,
  product_photos JSONB DEFAULT '[]'::jsonb,
  product_photo_captions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabel Pengumuman & Agenda (bjp_announcements)
CREATE TABLE IF NOT EXISTS public.bjp_announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  date TEXT NOT NULL,
  author TEXT DEFAULT 'Pengurus RW 11',
  cta_url TEXT,
  cta_wording TEXT,
  is_important BOOLEAN DEFAULT FALSE,
  image TEXT,
  "order" INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabel Pengaturan Website (bjp_site_settings)
CREATE TABLE IF NOT EXISTS public.bjp_site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Nonaktifkan RLS untuk kemudahan akses API Key Anonim
ALTER TABLE public.bjp_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bjp_entities DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bjp_announcements DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bjp_site_settings DISABLE ROW LEVEL SECURITY;
`;

/**
 * Tes Koneksi ke Supabase
 */
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  if (!supabase) {
    return {
      success: false,
      message: 'Supabase belum dikonfigurasi. Harap isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di environment.',
    };
  }

  try {
    const { error } = await supabase.from('bjp_users').select('id').limit(1);
    if (error) {
      if (error.code === '42P01') {
        return {
          success: false,
          message: 'Terhubung ke Supabase, tetapi tabel "bjp_users" belum dibuat. Jalankan skrip SQL di Supabase SQL Editor.',
        };
      }
      return {
        success: false,
        message: `Gagal terhubung ke Supabase: ${error.message}`,
      };
    }
    return {
      success: true,
      message: 'Koneksi ke database Supabase berhasil terverifikasi!',
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Kesalahan koneksi Supabase: ${err?.message || 'Unknown error'}`,
    };
  }
}

/**
 * Sync Users dengan Supabase
 */
export async function fetchUsersFromSupabase(): Promise<User[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('bjp_users').select('*');
    if (error || !data) return null;

    return data.map((row: any) => ({
      id: row.id,
      username: row.username,
      password: row.password,
      name: row.name,
      role: row.role,
      allowedEntityIds: Array.isArray(row.allowed_entity_ids) ? row.allowed_entity_ids : [],
      createdAt: row.created_at || new Date().toISOString(),
    }));
  } catch (err) {
    console.error('Error fetching users from Supabase:', err);
    return null;
  }
}

export async function saveUsersToSupabase(users: User[]): Promise<boolean> {
  if (!supabase) return false;
  try {
    const rows = users.map((u) => ({
      id: u.id,
      username: u.username,
      password: u.password,
      name: u.name,
      role: u.role,
      allowed_entity_ids: u.allowedEntityIds || [],
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from('bjp_users').upsert(rows, { onConflict: 'id' });
    if (error) {
      console.error('Failed to save users to Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to save users to Supabase:', err);
    return false;
  }
}

/**
 * Sync Entities dengan Supabase
 */
export async function fetchEntitiesFromSupabase(): Promise<Entity[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('bjp_entities').select('*');
    if (error || !data || data.length === 0) return null;

    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      description: row.description || '',
      image: row.image || '',
      ctaUrl: row.cta_url || '',
      ctaWording: row.cta_wording || '',
      instagram: row.instagram || undefined,
      mediaUrl: row.media_url || undefined,
      contact: row.contact || undefined,
      schedule: row.schedule || undefined,
      address: row.address || undefined,
      infoNotes: row.info_notes || undefined,
      isFeatured: Boolean(row.is_featured),
      socials: row.socials || undefined,
      productPhotos: Array.isArray(row.product_photos) ? row.product_photos : [],
      productPhotoCaptions: Array.isArray(row.product_photo_captions) ? row.product_photo_captions : [],
      createdAt: row.created_at || new Date().toISOString(),
      updatedAt: row.updated_at || new Date().toISOString(),
    }));
  } catch (err) {
    console.error('Error fetching entities from Supabase:', err);
    return null;
  }
}

export async function saveEntitiesToSupabase(entities: Entity[]): Promise<boolean> {
  if (!supabase) return false;
  try {
    const rows = entities.map((e) => ({
      id: e.id,
      name: e.name,
      category: e.category,
      description: e.description || '',
      image: e.image || '',
      cta_url: e.ctaUrl || '',
      cta_wording: e.ctaWording || '',
      instagram: e.instagram || null,
      media_url: e.mediaUrl || null,
      contact: e.contact || null,
      schedule: e.schedule || null,
      address: e.address || null,
      info_notes: e.infoNotes || null,
      is_featured: Boolean(e.isFeatured),
      socials: e.socials || {},
      product_photos: e.productPhotos || [],
      product_photo_captions: e.productPhotoCaptions || [],
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from('bjp_entities').upsert(rows, { onConflict: 'id' });
    if (error) {
      console.error('Failed to save entities to Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to save entities to Supabase:', err);
    return false;
  }
}

/**
 * Sync Announcements dengan Supabase
 */
export async function fetchAnnouncementsFromSupabase(): Promise<Announcement[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('bjp_announcements').select('*');
    if (error || !data || data.length === 0) return null;

    return data.map((row: any) => ({
      id: row.id,
      title: row.title,
      category: row.category,
      date: row.date || '',
      content: row.content || '',
      author: row.author || 'Pengurus RW 11',
      ctaUrl: row.cta_url || undefined,
      ctaWording: row.cta_wording || undefined,
      isImportant: Boolean(row.is_important),
      image: row.image || undefined,
      order: row.order ?? 0,
    }));
  } catch (err) {
    console.error('Error fetching announcements from Supabase:', err);
    return null;
  }
}

export async function saveAnnouncementsToSupabase(announcements: Announcement[]): Promise<boolean> {
  if (!supabase) return false;
  try {
    const rows = announcements.map((a) => ({
      id: a.id,
      title: a.title,
      category: a.category,
      date: a.date || '',
      content: a.content || '',
      author: a.author || 'Pengurus RW 11',
      cta_url: a.ctaUrl || null,
      cta_wording: a.ctaWording || null,
      is_important: Boolean(a.isImportant),
      image: a.image || null,
      order: a.order ?? 0,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from('bjp_announcements').upsert(rows, { onConflict: 'id' });
    if (error) {
      console.error('Failed to save announcements to Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to save announcements to Supabase:', err);
    return false;
  }
}

/**
 * Sync Site Settings dengan Supabase
 */
export async function fetchSiteSettingsFromSupabase(): Promise<SiteSettings | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('bjp_site_settings').select('data').eq('id', 1).single();
    if (error || !data) return null;
    return data.data as SiteSettings;
  } catch (err) {
    console.error('Error fetching site settings from Supabase:', err);
    return null;
  }
}

export async function saveSiteSettingsToSupabase(settings: SiteSettings): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('bjp_site_settings')
      .upsert({ id: 1, data: settings, updated_at: new Date().toISOString() }, { onConflict: 'id' });
    if (error) {
      console.error('Failed to save site settings to Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to save site settings to Supabase:', err);
    return false;
  }
}
