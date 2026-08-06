import React from 'react';
import { Heart, Instagram, MapPin, Phone, Building } from 'lucide-react';
import { BJP_LOGO_URL, BJP_LOGO_FALLBACK_SVG } from '../assets/logo';
import { formatImageUrl } from '../utils/imageUrl';

interface FooterProps {
  onOpenCMS?: () => void;
  isCMSActive?: boolean;
  logoUrl?: string;
}

export const Footer: React.FC<FooterProps> = ({ logoUrl }) => {
  const displayLogo = logoUrl ? formatImageUrl(logoUrl) : BJP_LOGO_URL;

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Main Info & Redaksi */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={displayLogo}
                alt="BJP HUB Logo"
                className="w-10 h-10 rounded-md object-cover border border-amber-300/40 shadow-xs"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== BJP_LOGO_FALLBACK_SVG) {
                    target.src = BJP_LOGO_FALLBACK_SVG;
                  }
                }}
              />
              <div>
                <h3 className="font-bold text-white text-base">BJP HUB - Bintara Jaya Permai</h3>
                <p className="text-xs text-stone-400">Pengurus RW 11 Kelurahan Bintara Jaya</p>
              </div>
            </div>

            <div className="bg-stone-950/80 p-3.5 rounded-xl border border-stone-800 space-y-1.5 max-w-2xl text-xs text-stone-300">
              <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Komplek Bintara Jaya Permai Redaksi:</span>
              </p>
              <p className="flex items-start gap-1.5 text-stone-300 leading-relaxed">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Sekretariat RW11, Bintara Jaya Permai, Kelurahan Bintara Jaya, Bekasi Barat, 17136</span>
              </p>
              <p className="flex items-center gap-1.5 text-stone-300">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Phone: <a href="tel:08128199144" className="text-emerald-300 hover:underline font-bold">08128199144</a></span>
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3 shrink-0">
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
