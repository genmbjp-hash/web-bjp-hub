import React, { useState } from 'react';
import { CategoryHeaderConfig, Entity } from '../types';
import { Share2, Check, ArrowLeft, Copy } from 'lucide-react';
import { formatImageUrl } from '../utils/imageUrl';

interface CategoryPageHeaderProps {
  catConfig: CategoryHeaderConfig;
  entities?: Entity[];
  onBackToHome: () => void;
}

export const CategoryPageHeader: React.FC<CategoryPageHeaderProps> = ({
  catConfig,
  entities = [],
  onBackToHome,
}) => {
  const [copied, setCopied] = useState(false);

  // Find fallback entity image if catConfig.logoUrl is empty
  const searchKeys = [catConfig.name, catConfig.id].filter(Boolean) as string[];
  const matchingEntity = entities.find((e) => {
    const eCat = e.category.toLowerCase();
    return searchKeys.some((k) => eCat.includes(k.toLowerCase()) || k.toLowerCase().includes(eCat));
  });

  const rawLogo = catConfig.logoUrl || matchingEntity?.image;
  const logo = rawLogo ? formatImageUrl(rawLogo) : null;

  const handleShareCategory = async () => {
    const categoryUrl = `${window.location.origin}${window.location.pathname}?category=${encodeURIComponent(
      catConfig.name
    )}`;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(categoryUrl);
      } else {
        const input = document.createElement('input');
        input.value = categoryUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="bg-white p-5 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4 mb-8">
      {/* Top Bar: Re-positioned Back Button */}
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-emerald-50 hover:text-emerald-950 text-stone-700 font-bold text-xs border border-stone-200/80 transition-all cursor-pointer active:scale-95 shadow-2xs"
          title="Kembali ke Home Page"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-800" />
          <span>Kembali ke Home Page</span>
        </button>

        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80">
          Halaman Komunitas Resmi
        </span>
      </div>

      {/* Main Content: HD Logo & Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        
        {/* Left: HD Logo & Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 flex-1">
          {logo ? (
            <img
              src={logo}
              alt={catConfig.name}
              className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-2xl sm:rounded-3xl object-contain bg-white border-2 border-stone-200/90 p-2 shadow-md shrink-0"
              onError={(e) => {
                const parent = (e.target as HTMLImageElement).parentElement;
                (e.target as HTMLImageElement).style.display = 'none';
                if (parent && !parent.querySelector('.fallback-badge')) {
                  const fallback = document.createElement('div');
                  fallback.className = 'fallback-badge w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-2xl sm:rounded-3xl bg-emerald-800 text-white flex items-center justify-center font-black text-2xl sm:text-3xl shrink-0 shadow-md border-2 border-emerald-900';
                  fallback.innerText = catConfig.name.charAt(0).toUpperCase();
                  parent.insertBefore(fallback, e.target as HTMLImageElement);
                }
              }}
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-2xl sm:rounded-3xl bg-emerald-800 text-white flex items-center justify-center font-black text-2xl sm:text-3xl shrink-0 shadow-md border-2 border-emerald-900">
              {catConfig.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="space-y-1 flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight leading-tight">
              {catConfig.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
              {catConfig.description || `Halaman lengkap daftar unit kegiatan warga dalam kategori ${catConfig.name}`}
            </p>
          </div>
        </div>

        {/* Right: Seamless CTA Share Category Page */}
        <div className="w-full sm:w-auto flex items-center gap-2 shrink-0 border-t sm:border-t-0 border-stone-100 pt-3 sm:pt-0">
          <button
            onClick={handleShareCategory}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm shadow-2xs transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-800 text-white border border-emerald-900 font-bold'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300 stroke-[3]" />
                <span>Tautan Komunitas Disalin!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-emerald-700" />
                <span>Bagikan Halaman Ini</span>
                <Copy className="w-3.5 h-3.5 text-stone-400" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
