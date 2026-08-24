import React from 'react';
import { ArrowLeft, Store, ExternalLink, CheckCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Container } from '../components/ui/Container';

interface PendaftaranSentraUsahaPageProps {
  onBack?: () => void;
}

const REGISTRATION_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSf8oBUR2-bwBs2WLBP-I0W9wmIjaExW_PMdLn0fpzOo1dJ65g/viewform';

const formatEmbedUrl = (rawUrl: string) => {
  if (!rawUrl.includes('embedded=true')) {
    return rawUrl.includes('?') ? `${rawUrl}&embedded=true` : `${rawUrl}?embedded=true`;
  }
  return rawUrl;
};

export const PendaftaranSentraUsahaPage: React.FC<PendaftaranSentraUsahaPageProps> = ({ onBack }) => {
  return (
    <Container className="py-8 space-y-6">
      {/* Global Back Button */}
      {onBack && (
        <div className="flex justify-start">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs border border-stone-200 shadow-sm transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
            title="Kembali ke Beranda"
          >
            <ArrowLeft className="w-4 h-4 text-stone-500" />
            <span>Kembali ke Beranda</span>
          </button>
        </div>
      )}

      {/* Page Header */}
      <Card radius="3xl" padding="none" className="p-6 sm:p-8 space-y-3">
        <span className="inline-block text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80">
          Sentra Usaha BJP
        </span>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl shrink-0">
            <Store className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">Pendaftaran Sentra Usaha</h1>
        </div>
        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
          Daftarkan UMKM atau usaha warga Anda untuk bergabung dalam Sentra Usaha BJP (RW 11). Isi formulir pendaftaran di bawah ini.
        </p>
      </Card>

      {/* Form Card */}
      <Card radius="3xl" padding="none" className="shadow-md overflow-hidden">
        <div className="p-5 sm:p-6 bg-gradient-to-b from-stone-50 to-white border-b border-stone-100 flex items-center justify-between gap-3">
          <h2 className="text-sm sm:text-base font-bold text-stone-900">Formulir Pendaftaran UMKM</h2>
          <a
            href={REGISTRATION_FORM_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-900 hover:underline shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40 rounded"
          >
            <span>Buka Layar Penuh</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="relative bg-stone-50 border-b border-stone-100">
          <iframe
            src={formatEmbedUrl(REGISTRATION_FORM_URL)}
            title="Formulir Pendaftaran Sentra Usaha"
            className="w-full h-[900px] border-0"
            loading="lazy"
          >
            Memuat formulir...
          </iframe>
        </div>

        <div className="p-4 bg-stone-50 text-center text-xs text-stone-500 font-medium flex items-center justify-center gap-1.5">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Data pendaftaran tersimpan langsung pada database panitia Sentra Usaha RW 11.</span>
        </div>
      </Card>
    </Container>
  );
};
