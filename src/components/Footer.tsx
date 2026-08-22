import React from 'react';
import { Heart, MapPin, Phone, Mail, Home, LayoutGrid, Megaphone, Building, FileText, Vote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BJP_LOGO_URL } from '../assets/logo';
import { formatImageUrl } from '../utils/imageUrl';

interface FooterProps {
  onOpenCMS?: () => void;
  isCMSActive?: boolean;
  logoUrl?: string;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCMS, isCMSActive, logoUrl }) => {
  const displayLogo = logoUrl ? formatImageUrl(logoUrl) : BJP_LOGO_URL;

  const quickLinks = [
    { path: '/', label: 'Beranda', icon: Home },
    { path: '/komunitas', label: 'Komunitas Kegiatan', icon: LayoutGrid },
    { path: '/pengumuman', label: 'Pengumuman & Agenda', icon: Megaphone },
    { path: '/rt-rw', label: 'Informasi RT/RW', icon: Building },
    { path: '/layanan-surat', label: 'Layanan Surat Online', icon: FileText },
    { path: '/polling', label: 'Polling & Aspirasi', icon: Vote },
  ];

  return (
    <footer className="bg-stone-950 text-stone-400 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <img
                src={displayLogo}
                alt="BJP.hub Logo"
                className="h-10 w-auto object-contain brightness-110"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="leading-none">
                <span className="font-black text-white text-xl tracking-tight">
                  BJP<span className="text-emerald-500">.hub</span>
                </span>
                <p className="text-[11px] text-stone-500 mt-0.5 font-medium tracking-wide">Bintara Jaya Permai RW 11</p>
              </div>
            </div>

            <p className="text-sm text-stone-400 leading-relaxed">
              Pusat ekosistem dan informasi terpadu yang menyatukan seluruh unit keagamaan, pemerintahan RT/RW, UMKM, lingkungan, kesehatan, kepemudaan, dan olahraga warga komplek Bintara Jaya Permai.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-xs text-stone-500">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Komplek Bintara Jaya Permai, Bintara, Bekasi Barat, Jawa Barat 17134</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest">Menu Navigasi</h3>
            <ul className="space-y-2">
              {quickLinks.map(({ path, label, icon: Icon }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="flex items-center gap-2 text-sm text-stone-400 hover:text-emerald-400 transition-colors group"
                  >
                    <Icon className="w-3.5 h-3.5 text-stone-600 group-hover:text-emerald-500 transition-colors shrink-0" />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info & CMS */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest">Informasi</h3>
            <div className="space-y-3 text-sm text-stone-400">
              <p className="leading-relaxed">
                Website ini dikelola oleh Pengurus RW 11 Kelurahan Bintara Jaya, Kecamatan Bekasi Barat.
              </p>
              <p className="leading-relaxed">
                Untuk pertanyaan, saran, atau penambahan informasi komunitas, silakan hubungi pengurus RW setempat.
              </p>
            </div>

            {/* CMS Access */}
            {onOpenCMS && (
              <button
                onClick={onOpenCMS}
                className={`inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl border transition-all mt-2 ${
                  isCMSActive
                    ? 'bg-amber-900/30 border-amber-700/50 text-amber-400 hover:bg-amber-900/50'
                    : 'bg-stone-800 border-stone-700 text-stone-400 hover:bg-stone-700 hover:text-white'
                }`}
              >
                <span>🔑 Akses Pengurus (CMS)</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-600 gap-3">
          <p>© {new Date().getFullYear()} BJP.hub — Komplek Bintara Jaya Permai (RW 11). All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-stone-600">
            <span>Dibuat dengan</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            <span>untuk Seluruh Warga BJP</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
