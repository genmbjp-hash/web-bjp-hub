import React from 'react';
import { Coffee, ArrowLeft, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Container } from '../components/ui/Container';

interface PodjokSantaiPageProps {
  onBack?: () => void;
}

export const PodjokSantaiPage: React.FC<PodjokSantaiPageProps> = ({ onBack }) => {
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
          Ruang Santai Warga
        </span>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl shrink-0">
            <Coffee className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">Podjok Santai BJP</h1>
        </div>
        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
          Ruang obrolan santai dan cerita warga Komplek Bintara Jaya Permai (RW 11).
        </p>
      </Card>

      {/* Empty State */}
      <Card padding="none" className="p-12 text-center space-y-3">
        <Sparkles className="w-10 h-10 text-stone-300 mx-auto" />
        <h3 className="font-bold text-stone-700">Konten Sedang Disiapkan</h3>
        <p className="text-stone-500 text-xs max-w-sm mx-auto">
          Halaman Podjok Santai BJP akan segera diisi oleh pengurus RW 11 melalui menu CMS.
        </p>
      </Card>
    </Container>
  );
};
