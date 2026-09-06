import { FasilitasLingkunganItem } from '../types';
import { slugify } from './slug';

/**
 * Lengkapi field turunan pada item Fasilitas Lingkungan yang mungkin belum ada
 * di data lama (disimpan sebelum halaman detail dibuat): `slug` dari nama, dan
 * `summary` dari `description` legacy. Dipakai di sisi baca (halaman daftar,
 * halaman detail, dan CMS saat load) sehingga tidak perlu migrasi tulis.
 *
 * `index` dipakai agar slug tetap unik walau beberapa item lama bernama sama.
 */
export function normalizeFasilitasItem(
  item: FasilitasLingkunganItem,
  index = 0
): FasilitasLingkunganItem {
  const slug = item.slug?.trim() || slugify(item.name) || `fasilitas-${index + 1}`;
  const summary = item.summary?.trim() || item.description?.trim() || '';
  return { ...item, slug, summary };
}

export function normalizeFasilitasItems(
  items: FasilitasLingkunganItem[] = []
): FasilitasLingkunganItem[] {
  const seen = new Map<string, number>();
  return items.map((item, i) => {
    const normalized = normalizeFasilitasItem(item, i);
    // Pastikan slug unik walau data lama menghasilkan slug yang sama.
    const count = seen.get(normalized.slug) ?? 0;
    seen.set(normalized.slug, count + 1);
    return count === 0 ? normalized : { ...normalized, slug: `${normalized.slug}-${count + 1}` };
  });
}
