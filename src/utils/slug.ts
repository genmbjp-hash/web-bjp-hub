/**
 * Slug helpers untuk segmen URL halaman detail (mis. "Tempat Ibadah" ->
 * "tempat-ibadah"). Dipakai CMS Fasilitas Lingkungan saat membuat / mengubah
 * item, dan sebagai fallback saat membaca data lama yang belum punya slug.
 */

export function slugify(input: string): string {
  return (input || '')
    .toString()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // buang diakritik gabungan
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // spasi & simbol -> '-'
    .replace(/^-+|-+$/g, ''); // trim '-' di ujung
}

/**
 * Kembalikan slug dari `base` yang belum ada di `taken`. Bila bentrok,
 * tambahkan sufiks "-2", "-3", dst. `base` boleh berupa nama mentah — akan
 * di-slugify lebih dulu.
 */
export function uniqueSlug(base: string, taken: string[]): string {
  const root = slugify(base) || 'fasilitas';
  const used = new Set(taken.filter(Boolean));
  if (!used.has(root)) return root;
  let n = 2;
  while (used.has(`${root}-${n}`)) n += 1;
  return `${root}-${n}`;
}
