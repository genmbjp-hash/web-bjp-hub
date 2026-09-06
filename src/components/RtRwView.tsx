import React, { useState } from 'react';
import { RtRwPageConfig } from '../types';
import {
  MapPin, Phone, Calendar, Sparkles, Building, MessageCircle,
  ShieldCheck, FileText, Download, Image as ImageIcon, FileCode, Info, Maximize2, X, Home, ArrowLeft
} from 'lucide-react';
import { formatImageUrl } from '../utils/imageUrl';
import { getDrivePreviewUrl, getDriveViewUrl } from '../utils/driveUrl';
import rtrwLogo from '../assets/images/logo_rw_011.png';
import { Card } from './ui/Card';

interface RtRwViewProps {
  config: RtRwPageConfig;
  onBack?: () => void;
}

export const RtRwView: React.FC<RtRwViewProps> = ({ config, onBack }) => {
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
            className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
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
  const pdfCards = activeExtraCards.filter((c) => c.type === 'pdf');
  const imageCards = activeExtraCards.filter((c) => c.type === 'image');
  const textCards = activeExtraCards.filter((c) => c.type === 'text');

  return (
    <div className="space-y-8 pb-12">
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
      <Card radius="3xl" padding="none" className="p-5 sm:p-8 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-stone-100 pb-3">
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80">
            Pemerintahan & Kewilayahan RW 11
          </span>
        </div>

        <div className="flex items-start gap-4 sm:gap-6">
          <img
            src={rtrwLogo}
            alt={config.pageTitle}
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain shrink-0"
          />
          <div className="space-y-1 flex-1">
            <h1 className="text-xl sm:text-3xl font-black text-stone-900 tracking-tight leading-tight">
              {config.pageTitle}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {config.pageDescription}
            </p>
          </div>
        </div>
      </Card>

      {/* Visi & Misi Card */}
      <Card radius="3xl" padding="lg" className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80">
            {config.visionTitle || 'Visi & Misi Resmi RW 11'}
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight text-stone-900 leading-tight">
            {config.visionHeading || 'Visi & Misi Pengurus RW 11 Bintara Jaya Permai'}
          </h2>
          <p className="text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-2xl border border-stone-100">
            "{config.visionText}"
          </p>
        </div>

        <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Misi Utama */}
          <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100 space-y-3">
            <h3 className="font-bold text-stone-800 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Misi Utama Kepengurusan</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-600">
              {config.missions && config.missions.length > 0 ? (
                config.missions.map((m, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold shrink-0 mt-0.5">•</span>
                    <span>{m}</span>
                  </li>
                ))
              ) : (
                <li className="text-stone-400 text-xs">Belum ada misi yang ditambahkan.</li>
              )}
            </ul>
          </div>

          {/* Nilai-Nilai Utama */}
          <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100 space-y-3">
            <h3 className="font-bold text-stone-800 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Nilai-Nilai Utama Warga</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-600">
              {config.values && config.values.length > 0 ? (
                config.values.map((v, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold shrink-0 mt-0.5">•</span>
                    <div>
                      <strong className="text-stone-800">{v.title}:</strong> {v.description}
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-stone-400 text-xs">Belum ada nilai-nilai utama yang ditambahkan.</li>
              )}
            </ul>
          </div>
        </div>
      </Card>

      {/* Program Kerja Card */}
      {((config.programKerjaShort && config.programKerjaShort.length > 0) ||
        (config.programKerjaLong && config.programKerjaLong.length > 0)) && (
        <Card radius="3xl" padding="lg" className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80">
              {config.programKerjaTitle || 'Program Kerja'}
            </span>
          </div>

          {config.programKerjaIntro && (
            <p className="text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-2xl border border-stone-100">
              {config.programKerjaIntro}
            </p>
          )}

          {/* Jangka Pendek & Menengah */}
          {config.programKerjaShort && config.programKerjaShort.filter((p) => p.enabled).length > 0 && (
            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                  {config.programKerjaShortTitle || 'Program Kerja Jangka Pendek dan Menengah'}
                </h3>
                {config.programKerjaShortDescription && (
                  <p className="text-xs sm:text-sm text-stone-500 mt-1 leading-relaxed">
                    {config.programKerjaShortDescription}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {config.programKerjaShort
                  .filter((p) => p.enabled)
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                  .map((p, idx) => (
                    <div key={p.id} className="flex items-start gap-3 bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="text-xs sm:text-sm">
                        <strong className="text-stone-900 block">{p.title}</strong>
                        <span className="text-stone-600 leading-relaxed">{p.description}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Jangka Panjang */}
          {config.programKerjaLong && config.programKerjaLong.filter((p) => p.enabled).length > 0 && (
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <div>
                <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                  {config.programKerjaLongTitle || 'Program Kerja Jangka Panjang'}
                </h3>
                {config.programKerjaLongDescription && (
                  <p className="text-xs sm:text-sm text-stone-500 mt-1 leading-relaxed">
                    {config.programKerjaLongDescription}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {config.programKerjaLong
                  .filter((p) => p.enabled)
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                  .map((p, idx) => (
                    <div key={p.id} className="flex items-start gap-3 bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-amber-600 text-white text-[11px] font-bold flex items-center justify-center mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="text-xs sm:text-sm">
                        <strong className="text-stone-900 block">{p.title}</strong>
                        <span className="text-stone-600 leading-relaxed">{p.description}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Rincian Wilayah RT Section */}
      {activeRts.length > 0 && (
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
              <Card
                key={rt.id}
                padding="none"
                interactive
                className="p-5 space-y-3.5 flex flex-col justify-between"
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
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-200" />
                      <span>Hubungi RT</span>
                    </a>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
      )}

      {/* Custom Content Cards Section (PDF, Image, Text) — split into its own
          sub-section per content type so documents, galleries, and official
          notices don't blur together in one mixed grid. */}
      {activeExtraCards.length > 0 && (
        <div className="space-y-8 pt-4">
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

          {/* Sub-section: Dokumen PDF */}
          {pdfCards.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-stone-800 flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-red-600" />
                <span>Dokumen Resmi (PDF)</span>
                <span className="text-[11px] font-bold px-2 py-0.5 bg-red-100 text-red-800 rounded-full">{pdfCards.length}</span>
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pdfCards.map((card) => {
                  const drivePreviewUrl = getDrivePreviewUrl(card.fileUrl);
                  const driveViewUrl = getDriveViewUrl(card.fileUrl);

                  return (
                    <Card
                      key={card.id}
                      padding="none"
                      interactive
                      className="p-5 flex flex-col justify-between space-y-4"
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

                        {drivePreviewUrl && (
                          <iframe
                            src={drivePreviewUrl}
                            title={card.title}
                            className="w-full h-[520px] rounded-xl border border-stone-200"
                            loading="lazy"
                          />
                        )}
                      </div>

                      <div className="pt-2 border-t border-stone-100">
                        {driveViewUrl ? (
                          <a
                            href={driveViewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-all shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
                          >
                            <Download className="w-4 h-4 text-emerald-300" />
                            <span>{card.ctaText || 'Buka Dokumen Lengkap'}</span>
                          </a>
                        ) : card.fileUrl ? (
                          <a
                            href={card.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={card.fileName || 'dokumen.pdf'}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-all shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
                          >
                            <Download className="w-4 h-4 text-emerald-300" />
                            <span>{card.ctaText || 'Unduh Dokumen PDF'}</span>
                          </a>
                        ) : (
                          <div className="text-xs text-stone-400 italic text-center py-1">File PDF belum diunggah</div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sub-section: Galeri Foto & Denah */}
          {imageCards.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-stone-800 flex items-center gap-2">
                <ImageIcon className="w-4.5 h-4.5 text-amber-600" />
                <span>Galeri Foto & Denah</span>
                <span className="text-[11px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">{imageCards.length}</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {imageCards.map((card) => {
                  const displayImg = card.imageUrl ? formatImageUrl(card.imageUrl) : 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1000&q=80';
                  return (
                    <Card
                      key={card.id}
                      padding="none"
                      interactive
                      className="overflow-hidden flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative h-48 bg-stone-900 overflow-hidden group">
                          <img
                            src={displayImg}
                            alt={card.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

                          <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-stone-900/80 text-white text-[10px] font-bold rounded-md border border-white/20 flex items-center gap-1">
                            <ImageIcon className="w-3 h-3 text-amber-300" />
                            <span>{card.categoryBadge || 'Galeri Foto / Denah'}</span>
                          </span>

                          <button
                            onClick={() => setActiveImageModal({ url: displayImg, title: card.title, caption: card.imageCaption || card.description })}
                            className="absolute bottom-3 right-3 p-2 bg-black/60 hover:bg-black/90 text-white rounded-xl border border-white/20 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
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
                          className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-all border border-stone-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
                        >
                          <Maximize2 className="w-3.5 h-3.5 text-stone-600" />
                          <span>Lihat Gambar Lengkap</span>
                        </button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sub-section: Informasi Resmi */}
          {textCards.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-stone-800 flex items-center gap-2">
                <Info className="w-4.5 h-4.5 text-blue-600" />
                <span>Informasi Resmi</span>
                <span className="text-[11px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">{textCards.length}</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {textCards.map((card) => (
                  <Card
                    key={card.id}
                    padding="none"
                    interactive
                    className="p-5 flex flex-col justify-between space-y-4"
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
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Image Lightbox Modal — frosted "glass" panel over a dimmed backdrop
          instead of a flat black box */}
      {activeImageModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveImageModal(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white/10 backdrop-blur-2xl rounded-2xl overflow-hidden border border-white/20 text-white shadow-lg space-y-4 p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-base sm:text-lg text-white truncate pr-4">
                {activeImageModal.title}
              </h3>
              <button
                onClick={() => setActiveImageModal(null)}
                className="p-1.5 bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[70vh] flex items-center justify-center bg-black/20 rounded-2xl overflow-hidden border border-white/10">
              <img
                src={activeImageModal.url}
                alt={activeImageModal.title}
                className="max-h-[68vh] w-auto object-contain rounded-xl"
              />
            </div>

            {activeImageModal.caption && (
              <p className="text-xs sm:text-sm text-stone-100 text-center italic bg-black/20 backdrop-blur-md p-3 rounded-xl border border-white/10">
                "{activeImageModal.caption}"
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
