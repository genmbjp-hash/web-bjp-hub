import React from 'react';
import { RtRwPageConfig } from '../types';
import { MapPin, Users, Phone, Calendar, Sparkles, Building, ChevronLeft, MessageCircle, ShieldCheck } from 'lucide-react';

interface RtRwViewProps {
  config: RtRwPageConfig;
  onBack?: () => void;
  onOpenCMS?: () => void;
}

export const RtRwView: React.FC<RtRwViewProps> = ({ config, onBack, onOpenCMS }) => {
  if (!config || !config.enabled) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <Building className="w-12 h-12 text-stone-400 mx-auto" />
        <h3 className="text-xl font-bold text-stone-800">Halaman Informasi RT/RW Nonaktif</h3>
        <p className="text-sm text-stone-500">Halaman ini sedang ditutup atau belum diaktifkan oleh pengurus.</p>
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition-colors"
          >
            Kembali ke Beranda
          </button>
        )}
      </div>
    );
  }

  const activeRts = config.rts ? config.rts.filter((r) => r.enabled) : [];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Navigation Bar / Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white shadow-xl border border-stone-800">
        <div className="absolute inset-0">
          <img
            src={config.heroImage || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80'}
            alt={config.pageTitle}
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl backdrop-blur-md border border-white/20 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
            )}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold border border-emerald-500/30 backdrop-blur-md">
              <Building className="w-3.5 h-3.5 text-amber-300" />
              <span>Pemerintahan & Kewilayahan RW 11</span>
            </div>
          </div>

          <div className="max-w-3xl space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              {config.pageTitle}
            </h1>
            <p className="text-stone-300 text-xs sm:text-base leading-relaxed">
              {config.pageDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Visi & Misi Card */}
      <div className="bg-gradient-to-br from-emerald-900 via-stone-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-emerald-700/50 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-bold border border-amber-400/30">
            <span>{config.visionTitle || '🏛️ Visi & Misi Resmi RW 11'}</span>
          </div>
          <span className="text-[11px] text-emerald-300 font-mono">Bintara Jaya Permai (RW 11)</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            {config.visionHeading || 'Visi & Misi Pengurus RW 11 Bintara Jaya Permai'}
          </h2>
          <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-medium italic bg-emerald-950/60 p-4 rounded-2xl border border-emerald-800/60">
            "{config.visionText}"
          </p>
        </div>

        <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Misi Utama */}
          <div className="bg-black/30 p-5 rounded-2xl border border-emerald-500/20 space-y-3">
            <h3 className="font-bold text-emerald-300 text-sm sm:text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Misi Utama Kepengurusan</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-200">
              {config.missions && config.missions.length > 0 ? (
                config.missions.map((m, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                    <span>{m}</span>
                  </li>
                ))
              ) : (
                <li className="text-stone-400 text-xs">Belum ada misi yang ditambahkan.</li>
              )}
            </ul>
          </div>

          {/* Nilai-Nilai Utama */}
          <div className="bg-black/30 p-5 rounded-2xl border border-emerald-500/20 space-y-3">
            <h3 className="font-bold text-amber-300 text-sm sm:text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Nilai-Nilai Utama Warga</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-200">
              {config.values && config.values.length > 0 ? (
                config.values.map((v, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                    <div>
                      <strong className="text-amber-200">{v.title}:</strong> {v.description}
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-stone-400 text-xs">Belum ada nilai-nilai utama yang ditambahkan.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Rincian Wilayah RT Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
              <MapPin className="w-6 h-6 text-emerald-700" />
              <span>{config.rtListTitle || 'Rincian Informasi Wilayah per RT'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              {config.rtListDescription || 'Daftar ketua RT, cakupan wilayah blok, jumlah KK, dan program unggulan.'}
            </p>
          </div>
          <span className="self-start sm:self-auto text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full border border-emerald-200">
            Total {activeRts.length} Wilayah RT Aktif
          </span>
        </div>

        {/* RT Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeRts.map((rt) => {
            const cleanPhone = rt.contactPhone ? rt.contactPhone.replace(/[^0-9]/g, '') : '';
            const waPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;

            return (
              <div
                key={rt.id}
                className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-all space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-emerald-800 text-white text-xs font-extrabold rounded-lg shadow-2xs">
                      RT {rt.rtNumber} / RW {rt.rwNumber}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 bg-stone-100 text-stone-700 rounded-full border border-stone-200">
                      {rt.kkCount}
                    </span>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Ketua RT</div>
                    <h4 className="font-extrabold text-stone-900 text-base leading-snug">
                      {rt.chairmanName}
                    </h4>
                  </div>

                  <div className="text-xs space-y-2 text-stone-700 bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-stone-900">Cakupan Wilayah:</strong> {rt.coverageArea}
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-stone-900">Jadwal Kerja Bakti:</strong> {rt.workSchedule}
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-stone-900">Program Unggulan:</strong> {rt.featuredProgram}
                      </div>
                    </div>
                  </div>
                </div>

                {rt.contactPhone && (
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-stone-500 font-medium truncate flex items-center gap-1">
                      <Phone className="w-3 h-3 text-stone-400 shrink-0" />
                      <span>{rt.contactPhone}</span>
                    </span>
                    <a
                      href={`https://wa.me/${waPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs shrink-0"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-200" />
                      <span>Hubungi RT</span>
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
