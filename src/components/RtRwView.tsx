import React, { useState } from 'react';
import { RtRwPageConfig, RtRwContentCard } from '../types';
import {
  MapPin, Users, Phone, Calendar, Sparkles, Building, ChevronLeft, MessageCircle,
  ShieldCheck, FileText, Download, Image as ImageIcon, FileCode, Info, Maximize2, X, ExternalLink, Home
} from 'lucide-react';
import { formatImageUrl } from '../utils/imageUrl';

interface RtRwViewProps {
  config: RtRwPageConfig;
  onBack?: () => void;
  onOpenCMS?: () => void;
}

export const RtRwView: React.FC<RtRwViewProps> = ({ config, onBack, onOpenCMS }) => {
  const [activeImageModal, setActiveImageModal] = useState<{ url: string; title: string; caption?: string } | null>(null);

  if (!config || !config.enabled) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <Building className="w-12 h-12 text-stone-400 mx-auto" />
        <h3 className="text-xl font-bold text-stone-800">Halaman Informasi RT/RW Nonaktif</h3>
        <p className="text-sm text-stone-500">Halaman ini sedang ditutup atau belum diaktifkan oleh pengurus.</p>
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition-colors cursor-pointer"
          >
            Kembali ke Beranda
          </button>
        )}
      </div>
    );
  }

  const activeRts = config.rts ? config.rts.filter((r) => r.enabled) : [];
  const activeExtraCards = (config.extraCards || [])
    .filter((c) => c.enabled)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

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
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800/80 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl backdrop-blur-md border border-emerald-500/40 transition-all cursor-pointer shadow-xs"
                title="Kembali ke Beranda Utama Home Page"
              >
                <Home className="w-4 h-4 text-emerald-300" />
                <span>Kembali ke Home Page</span>
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

      {/* NEW SECTION BELOW RT INFO: Custom Content Cards (PDF, Image, Text) */}
      {activeExtraCards.length > 0 && (
        <div className="space-y-5 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
                <FileText className="w-6 h-6 text-emerald-700" />
                <span>{config.extraSectionTitle || 'Dokumen, Informasional, & Galeri Resmi RT/RW'}</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                {config.extraSectionDescription || 'Akses file dokumen PDF, peta infografis gambar, dan pengumuman panduan resmi warga.'}
              </p>
            </div>
            <span className="self-start sm:self-auto text-xs font-bold px-3 py-1 bg-stone-200 text-stone-800 rounded-full border border-stone-300">
              {activeExtraCards.length} Konten Publik
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeExtraCards.map((card) => {
              if (card.type === 'pdf') {
                return (
                  <div
                    key={card.id}
                    className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 bg-red-100 text-red-800 text-[11px] font-extrabold rounded-md flex items-center gap-1 border border-red-200">
                          <FileText className="w-3.5 h-3.5 text-red-600" />
                          <span>{card.categoryBadge || 'Dokumen PDF'}</span>
                        </span>
                        {card.fileSize && (
                          <span className="text-[10px] font-mono font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                            {card.fileSize}
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="font-extrabold text-stone-900 text-base leading-snug">
                          {card.title}
                        </h4>
                        {card.description && (
                          <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                            {card.description}
                          </p>
                        )}
                      </div>

                      {card.fileName && (
                        <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 flex items-center gap-2 text-xs font-mono text-stone-700">
                          <FileCode className="w-4 h-4 text-red-600 shrink-0" />
                          <span className="truncate">{card.fileName}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-stone-100">
                      {card.fileUrl ? (
                        <a
                          href={card.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={card.fileName || 'dokumen.pdf'}
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-all shadow-2xs"
                        >
                          <Download className="w-4 h-4 text-emerald-300" />
                          <span>{card.ctaText || 'Unduh Dokumen PDF'}</span>
                        </a>
                      ) : (
                        <div className="text-xs text-stone-400 italic text-center py-1">File PDF belum diunggah</div>
                      )}
                    </div>
                  </div>
                );
              }

              if (card.type === 'image') {
                const displayImg = card.imageUrl ? formatImageUrl(card.imageUrl) : 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1000&q=80';
                return (
                  <div
                    key={card.id}
                    className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-48 bg-stone-900 overflow-hidden group">
                        <img
                          src={displayImg}
                          alt={card.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                        
                        <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-bold rounded-md border border-white/20 flex items-center gap-1">
                          <ImageIcon className="w-3 h-3 text-amber-300" />
                          <span>{card.categoryBadge || 'Galeri Foto / Denah'}</span>
                        </span>

                        <button
                          onClick={() => setActiveImageModal({ url: displayImg, title: card.title, caption: card.imageCaption || card.description })}
                          className="absolute bottom-3 right-3 p-2 bg-black/60 hover:bg-black/90 text-white rounded-xl backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                          title="Perbesar Foto Full Screen"
                        >
                          <Maximize2 className="w-4 h-4 text-emerald-300" />
                        </button>
                      </div>

                      <div className="p-5 space-y-2">
                        <h4 className="font-extrabold text-stone-900 text-base leading-snug">
                          {card.title}
                        </h4>
                        {card.description && (
                          <p className="text-xs text-stone-600 leading-relaxed">
                            {card.description}
                          </p>
                        )}
                        {card.imageCaption && (
                          <div className="text-[11px] font-medium text-stone-500 italic bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                            "{card.imageCaption}"
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <button
                        onClick={() => setActiveImageModal({ url: displayImg, title: card.title, caption: card.imageCaption || card.description })}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-all border border-stone-200 cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-stone-600" />
                        <span>Lihat Gambar Lengkap</span>
                      </button>
                    </div>
                  </div>
                );
              }

              // Text type card
              return (
                <div
                  key={card.id}
                  className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 bg-blue-100 text-blue-900 text-[11px] font-extrabold rounded-md flex items-center gap-1 border border-blue-200">
                        <Info className="w-3.5 h-3.5 text-blue-600" />
                        <span>{card.categoryBadge || 'Teks Informasi'}</span>
                      </span>
                      {card.date && (
                        <span className="text-[10px] font-semibold text-stone-500">
                          {card.date}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-extrabold text-stone-900 text-base leading-snug">
                        {card.title}
                      </h4>
                      {card.description && (
                        <p className="text-xs font-semibold text-stone-700 mt-1">
                          {card.description}
                        </p>
                      )}
                    </div>

                    {card.textContent && (
                      <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed space-y-2">
                        <p className="whitespace-pre-line">{card.textContent}</p>
                      </div>
                    )}
                  </div>

                  {card.author && (
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-medium">
                      <span>Ditulis oleh: <strong>{card.author}</strong></span>
                      <Building className="w-3.5 h-3.5 text-emerald-700" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {activeImageModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveImageModal(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-stone-900 rounded-3xl overflow-hidden border border-stone-800 text-white shadow-2xl space-y-4 p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-bold text-base sm:text-lg text-white truncate pr-4">
                {activeImageModal.title}
              </h3>
              <button
                onClick={() => setActiveImageModal(null)}
                className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[70vh] flex items-center justify-center bg-black/50 rounded-2xl overflow-hidden border border-stone-800">
              <img
                src={activeImageModal.url}
                alt={activeImageModal.title}
                className="max-h-[68vh] w-auto object-contain rounded-xl"
              />
            </div>

            {activeImageModal.caption && (
              <p className="text-xs sm:text-sm text-stone-300 text-center italic bg-stone-950/80 p-3 rounded-xl border border-stone-800">
                "{activeImageModal.caption}"
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
