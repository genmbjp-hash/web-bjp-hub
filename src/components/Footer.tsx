import React from 'react';
import { Heart, MapPin } from 'lucide-react';
import { BJP_LOGO_URL } from '../assets/logo';
import { formatImageUrl } from '../utils/imageUrl';
import { Container } from './ui/Container';

interface FooterProps {
  logoUrl?: string;
}

export const Footer: React.FC<FooterProps> = ({ logoUrl }) => {
  const displayLogo = logoUrl ? formatImageUrl(logoUrl) : BJP_LOGO_URL;

  return (
    <footer className="bg-stone-950 text-stone-400 border-t border-stone-800">
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

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
      </Container>
    </footer>
  );
};
