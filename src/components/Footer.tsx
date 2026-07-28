import React from 'react';
import { Heart, Instagram } from 'lucide-react';
import { BJP_LOGO_URL } from '../assets/logo';

interface FooterProps {
  onOpenCMS?: () => void;
  isCMSActive?: boolean;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Main Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={BJP_LOGO_URL}
                alt="BJP HUB Logo"
                className="w-10 h-10 rounded-md object-cover border border-amber-300/40 shadow-xs"
              />
              <div>
                <h3 className="font-bold text-white text-base">BJP HUB - Bintara Jaya Permai</h3>
                <p className="text-xs text-stone-400">Pengurus RW 11 Kelurahan Bintara Jaya</p>
              </div>
            </div>

            <p className="text-stone-400 text-xs leading-relaxed max-w-xl">
              Pusat ekosistem dan informasi terpadu yang menyatukan seluruh unit keagamaan, pemerintahan RT/RW, UMKM, lingkungan, kesehatan, kepemudaan, dan olahraga warga komplek Bintara Jaya Permai.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/bintarajayapermai.ofc/"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl transition-colors inline-flex items-center gap-2 text-xs font-medium border border-stone-700/60"
            >
              <Instagram className="w-4 h-4 text-pink-400" />
              <span>Instagram Resmi RW 11</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <p>© {new Date().getFullYear()} BJP HUB - Komplek Bintara Jaya Permai (RW 11). All rights reserved.</p>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>untuk Seluruh Warga BJP</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
