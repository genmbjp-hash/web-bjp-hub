import React from 'react';
import { CategoryHeaderConfig } from '../types';
import { formatImageUrl } from '../utils/imageUrl';
import { FileText, Sparkles, Building, Info, ShieldCheck } from 'lucide-react';

interface SinglePageViewProps {
  categoryConfig?: CategoryHeaderConfig;
  title?: string;
  description?: string;
  heroImageUrl?: string;
  contentHtml?: string;
}

export const SinglePageView: React.FC<SinglePageViewProps> = ({
  categoryConfig,
  title,
  description,
  heroImageUrl,
  contentHtml,
}) => {
  const pageTitle = title || categoryConfig?.name || 'Informasi Halaman';
  const pageDesc = description || categoryConfig?.description || '';
  const defaultHero = 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80';
  const heroImage = heroImageUrl
    ? formatImageUrl(heroImageUrl)
    : categoryConfig?.singlePageHeroImage
    ? formatImageUrl(categoryConfig.singlePageHeroImage)
    : categoryConfig?.logoUrl
    ? formatImageUrl(categoryConfig.logoUrl)
    : defaultHero;

  const content = contentHtml || categoryConfig?.singlePageContent || `
<h3 class="text-xl font-extrabold text-stone-900 mb-3">Selamat Datang di Halaman Resmi ${pageTitle}</h3>
<p class="text-stone-700 leading-relaxed mb-4">
  ${pageDesc}
</p>
<p class="text-stone-700 leading-relaxed mb-4">
  Halaman ini difungsikan khusus sebagai pusat informasi tunggal, panduan layanan, serta pengumuman resmi dari unit ${pageTitle} Komplek Bintara Jaya Permai (RW 11).
</p>
<div class="bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded-r-xl my-6">
  <h4 class="font-bold text-emerald-900 text-sm mb-1">Informasi Penting Warga:</h4>
  <p class="text-xs text-emerald-800">
    Untuk layanan administrasi, jadwal piket pengurus, atau permohonan surat keterangan, silakan hubungi Sekretariat RW 11 atau akses menu Layanan Surat Online.
  </p>
</div>
`;

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-md overflow-hidden max-w-5xl mx-auto my-8">
      {/* Hero Image Section */}
      <div className="relative h-64 sm:h-80 md:h-96 w-full bg-stone-900 overflow-hidden">
        <img
          src={heroImage}
          alt={pageTitle}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = defaultHero;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-amber-400 text-stone-950 text-xs font-black rounded-full uppercase tracking-wider shadow-xs">
              Single Page Template
            </span>
            <span className="text-xs text-stone-300 font-medium">BJP HUB RW 11</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{pageTitle}</h1>
          <p className="text-stone-200 text-xs sm:text-base max-w-3xl mt-2 leading-relaxed">
            {pageDesc}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 sm:p-10 space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full w-fit border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Informasi & Konten Resmi</span>
        </div>

        {/* Formatted Content Output */}
        <div
          className="prose prose-emerald max-w-none text-stone-800 text-sm sm:text-base leading-relaxed space-y-4 font-normal"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};
