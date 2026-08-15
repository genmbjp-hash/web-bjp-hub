import React from 'react';
import { PollingPageConfig } from '../types';
import { Vote, ExternalLink, CheckCircle, HelpCircle, Home } from 'lucide-react';

interface PollingPageProps {
  config?: PollingPageConfig;
  onGoHome?: () => void;
}

export const PollingPage: React.FC<PollingPageProps> = ({ config, onGoHome }) => {
  if (!config || !config.enabled) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-8 bg-white rounded-3xl border border-stone-200 text-center space-y-4">
        <Vote className="w-12 h-12 text-stone-300 mx-auto" />
        <h2 className="text-xl font-extrabold text-stone-800">Layanan Polling Sedang Tidak Aktif</h2>
        <p className="text-stone-500 text-sm max-w-md mx-auto">
          Fitur Polling & Suara Warga saat ini sedang dinonaktifkan oleh Pengurus RW 11.
        </p>
      </div>
    );
  }

  const formatEmbedUrl = (rawUrl: string) => {
    if (!rawUrl) return '';
    let clean = rawUrl.trim();
    // If it's a google form URL without embedded=true, append it
    if (clean.includes('docs.google.com/forms') && !clean.includes('embedded=true')) {
      clean = clean.includes('?') ? `${clean}&embedded=true` : `${clean}?embedded=true`;
    }
    return clean;
  };

  const { section1, section2 } = config;

  return (
    <div className="max-w-6xl mx-auto my-8 px-4 sm:px-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-2 max-w-3xl">
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80">
            Suara & Aspirasi Warga
          </span>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 flex items-center gap-2">
            <Vote className="w-6 h-6 text-emerald-700" />
            <span>{config.pageTitle || 'Polling & Aspirasi Warga'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {config.pageDescription || 'Sampaikan suara dan aspirasi Anda untuk RW 11.'}
          </p>
        </div>

        {onGoHome && (
          <button
            onClick={onGoHome}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-emerald-50 hover:text-emerald-950 text-stone-700 font-bold text-xs border border-stone-200/80 transition-all cursor-pointer shrink-0"
            title="Kembali ke Beranda"
          >
            <Home className="w-4 h-4 text-emerald-700" />
            <span>Kembali ke Beranda</span>
          </button>
        )}
      </div>

      {/* Grid for 2 Google Form Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Section 1 */}
        {section1 && section1.enabled ? (
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-md overflow-hidden flex flex-col justify-between">
            {/* Card Header */}
            <div className="p-6 bg-gradient-to-b from-stone-50 to-white border-b border-stone-100 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-900 font-bold rounded-full text-xs">
                  Polling Section 01
                </span>
                {section1.formUrl && (
                  <a
                    href={section1.formUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-900 hover:underline"
                  >
                    <span>Buka Layar Penuh</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
              <h2 className="text-lg font-black text-stone-900 leading-snug">{section1.title}</h2>
              {section1.description && (
                <p className="text-xs text-stone-600 leading-relaxed">{section1.description}</p>
              )}
            </div>

            {/* Google Form Iframe Container */}
            <div className="relative min-h-[550px] bg-stone-50 border-b border-stone-100">
              {section1.formUrl ? (
                <iframe
                  src={formatEmbedUrl(section1.formUrl)}
                  title={section1.title}
                  className="w-full h-[580px] border-0"
                  loading="lazy"
                >
                  Memuat formulir...
                </iframe>
              ) : (
                <div className="p-12 text-center text-stone-400 space-y-2">
                  <HelpCircle className="w-10 h-10 mx-auto text-stone-300" />
                  <p className="text-xs font-semibold">URL Google Form belum dikonfigurasi di CMS.</p>
                </div>
              )}
            </div>

            {/* Footer Notice */}
            <div className="p-4 bg-stone-50 text-center text-xs text-stone-500 font-medium flex items-center justify-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Respon tersimpan langsung pada database panitia RW 11.</span>
            </div>
          </div>
        ) : (
          <div className="bg-stone-50 rounded-3xl border border-dashed border-stone-300 p-8 text-center text-stone-400 space-y-2">
            <Vote className="w-8 h-8 mx-auto opacity-40" />
            <p className="text-xs font-bold">Section Polling 1 Dinonaktifkan</p>
          </div>
        )}

        {/* Section 2 */}
        {section2 && section2.enabled ? (
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-md overflow-hidden flex flex-col justify-between">
            {/* Card Header */}
            <div className="p-6 bg-gradient-to-b from-stone-50 to-white border-b border-stone-100 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 font-bold rounded-full text-xs">
                  Polling Section 02
                </span>
                {section2.formUrl && (
                  <a
                    href={section2.formUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-900 hover:underline"
                  >
                    <span>Buka Layar Penuh</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
              <h2 className="text-lg font-black text-stone-900 leading-snug">{section2.title}</h2>
              {section2.description && (
                <p className="text-xs text-stone-600 leading-relaxed">{section2.description}</p>
              )}
            </div>

            {/* Google Form Iframe Container */}
            <div className="relative min-h-[550px] bg-stone-50 border-b border-stone-100">
              {section2.formUrl ? (
                <iframe
                  src={formatEmbedUrl(section2.formUrl)}
                  title={section2.title}
                  className="w-full h-[580px] border-0"
                  loading="lazy"
                >
                  Memuat formulir...
                </iframe>
              ) : (
                <div className="p-12 text-center text-stone-400 space-y-2">
                  <HelpCircle className="w-10 h-10 mx-auto text-stone-300" />
                  <p className="text-xs font-semibold">URL Google Form belum dikonfigurasi di CMS.</p>
                </div>
              )}
            </div>

            {/* Footer Notice */}
            <div className="p-4 bg-stone-50 text-center text-xs text-stone-500 font-medium flex items-center justify-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Respon tersimpan langsung pada database panitia RW 11.</span>
            </div>
          </div>
        ) : (
          <div className="bg-stone-50 rounded-3xl border border-dashed border-stone-300 p-8 text-center text-stone-400 space-y-2">
            <Vote className="w-8 h-8 mx-auto opacity-40" />
            <p className="text-xs font-bold">Section Polling 2 Dinonaktifkan</p>
          </div>
        )}
      </div>
    </div>
  );
};
