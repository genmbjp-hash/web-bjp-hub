import React from 'react';
import { Heart } from 'lucide-react';

interface FooterProps {
  onOpenCMS?: () => void;
  isCMSActive?: boolean;
  logoUrl?: string;
}

export const Footer: React.FC<FooterProps> = () => {

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Main Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="font-bold text-white text-lg">BJP.hub - Bintara Jaya Permai</h3>
                <p className="text-sm text-stone-300">Pengurus RW 11 Kelurahan Bintara Jaya</p>
              </div>
            </div>

            <p className="text-stone-300 text-sm leading-relaxed max-w-xl">
              Pusat ekosistem dan informasi terpadu yang menyatukan seluruh unit keagamaan, pemerintahan RT/RW, UMKM, lingkungan, kesehatan, kepemudaan, dan olahraga warga komplek Bintara Jaya Permai.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-stone-700 flex flex-col sm:flex-row items-center justify-between text-sm text-stone-300 gap-3">
          <p>© {new Date().getFullYear()} BJP.hub - Komplek Bintara Jaya Permai (RW 11). All rights reserved.</p>
          <div className="flex items-center gap-1 text-stone-300">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
            <span>untuk Seluruh Warga BJP</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
