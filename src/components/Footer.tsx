import React from 'react';
import { Heart, Globe, Shield, Instagram, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onOpenCMS: () => void;
  isCMSActive: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCMS, isCMSActive }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Info */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-bold text-base flex items-center justify-center">
                BJP
              </div>
              <div>
                <h3 className="font-bold text-white text-base">BJP HUB - Bintara Jaya Permai</h3>
                <p className="text-xs text-stone-400">Pengurus RW 11 Kelurahan Bintara Jaya</p>
              </div>
            </div>

            <p className="text-stone-400 text-xs leading-relaxed max-w-md">
              Pusat ekosistem dan informasi terpadu yang menyatukan seluruh unit keagamaan, pemerintahan RT/RW, UMKM, lingkungan, kesehatan, kepemudaan, dan olahraga warga komplek Bintara Jaya Permai.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://www.instagram.com/bintarajayapermai.ofc/"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg transition-colors inline-flex items-center gap-1.5 text-xs font-medium"
              >
                <Instagram className="w-4 h-4 text-pink-400" />
                <span>Instagram RW 11</span>
              </a>

              <a
                href="https://sites.google.com/view/bjp-hub/home"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg transition-colors inline-flex items-center gap-1.5 text-xs font-medium"
              >
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>Google Sites BJP HUB</span>
                <ArrowUpRight className="w-3 h-3 text-stone-500" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-stone-400">
              Akses Pengurus
            </h4>
            <p className="text-xs text-stone-400">
              Pengurus dapat mengedit daftar entitas dan pengumuman dengan menekan tombol CMS.
            </p>

            <button
              onClick={onOpenCMS}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-2xs mt-1 ${
                isCMSActive
                  ? 'bg-amber-500 hover:bg-amber-600 text-stone-950'
                  : 'bg-emerald-800 hover:bg-emerald-700 text-white border border-emerald-700/60'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span>Akses CMS</span>
            </button>
          </div>

          {/* Column 3: Hosting & Vercel Info */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-stone-400">
              Publish & Vercel
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Siap di-publish ke Vercel atau Google Sites. Seluruh data dapat di-export/import dengan format file JSON sederhana.
            </p>
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
