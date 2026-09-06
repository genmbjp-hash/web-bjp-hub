import React from 'react';

/**
 * Ikon masjid bergaya garis (stroke) agar serasi dengan ikon lucide-react
 * yang dipakai di seluruh aplikasi. lucide-react belum menyediakan ikon
 * masjid, jadi komponen kecil ini dipakai sebagai gantinya — mis. untuk
 * menu "Sosial Keagamaan" di header.
 */
export const MosqueIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Garis tanah */}
    <line x1="2" y1="21" x2="22" y2="21" />
    {/* Menara kiri & kanan */}
    <path d="M4 21v-8" />
    <path d="M20 21v-8" />
    <path d="M2.5 13a1.5 1.5 0 0 1 3 0" />
    <path d="M18.5 13a1.5 1.5 0 0 1 3 0" />
    {/* Ruang utama + kubah */}
    <path d="M6 21v-6a6 6 0 0 1 12 0v6" />
    {/* Pintu lengkung */}
    <path d="M10 21v-3a2 2 0 0 1 4 0v3" />
    {/* Tiang & bulan sabit di puncak kubah */}
    <path d="M12 9V6.5" />
    <path d="M12.9 3.4a2.2 2.2 0 1 0 0 4.2 2.7 2.7 0 0 1 0-4.2z" />
  </svg>
);
