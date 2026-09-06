import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Entity } from '../types';
import { formatImageUrl } from '../utils/imageUrl';
import { FALLBACK_ENTITY_IMAGE_URL } from '../constants/defaults';
import { stripHtml } from '../utils/meta';
import { ArrowLeft, CalendarDays, ArrowRight, SearchX, FileText, Download, Landmark } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { EntityCard } from '../components/EntityCard';
import { Card } from '../components/ui/Card';
import { getDrivePreviewUrl, getDriveViewUrl } from '../utils/driveUrl';

const DOCUMENTS = [
  {
    id: 'doc-imb-masjid',
    title: "IMB Masjid Ja'mi Al Aqwam (2022)",
    description: 'Dokumen resmi Izin Mendirikan Bangunan (IMB) Masjid Ja\'mi Al Aqwam, diterbitkan tahun 2022.',
    fileUrl: 'https://drive.google.com/file/d/1rHcv02gUtUpINnyuc-BO7vOi370b_ltY/view?usp=sharing',
  },
];

interface SosialKeagamaanPageProps {
  entities: Entity[];
  onSelectEntity: (entity: Entity) => void;
  onBack: () => void;
}

export const SosialKeagamaanPage: React.FC<SosialKeagamaanPageProps> = ({
  entities,
  onSelectEntity,
  onBack,
}) => {
  const navigate = useNavigate();
  const keagamaanEntities = entities.filter((e) => e.category === 'Keagamaan');
  const dkmMasjid = keagamaanEntities.find((e) => e.name.toLowerCase().includes('dkm masjid'));
  const otherEntities = keagamaanEntities.filter((e) => e.id !== dkmMasjid?.id);

  return (
    <div className="pb-10">
      <Container className="pt-6 space-y-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs border border-stone-200 shadow-sm transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
        >
          <ArrowLeft className="w-4 h-4 text-stone-500" />
          <span>Kembali ke Beranda</span>
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900">Sosial Keagamaan</h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Pusat informasi unit-unit kegiatan sosial keagamaan warga Komplek Bintara Jaya Permai (RW 11).
          </p>
        </div>

        {/* DKM Masjid Highlight */}
        {dkmMasjid && (
          <div className="relative bg-stone-950 rounded-2xl overflow-hidden">
            <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <img
                src={formatImageUrl(dkmMasjid.image)}
                alt={dkmMasjid.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-white/20 shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_ENTITY_IMAGE_URL; }}
              />
              <div className="flex-1 min-w-0">
                <span className="inline-block text-[11px] font-bold text-emerald-200 bg-white/10 px-3 py-1 rounded-full border border-white/20 mb-2">
                  {dkmMasjid.category}
                </span>
                <h2 className="text-lg sm:text-xl font-black text-white">{dkmMasjid.name}</h2>
                <p className="text-stone-300 text-xs sm:text-sm mt-1 leading-relaxed line-clamp-2">
                  {stripHtml(dkmMasjid.description)}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
                <button
                  onClick={() => onSelectEntity(dkmMasjid)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-colors"
                >
                  <span>Lihat Profil</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => navigate('/dkm-masjid')}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>Agenda & Struktur Organisasi</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tentang Yayasan Al Aqwam — foto berdiri sendiri penuh lebar,
            teks di bawahnya sama sekali tidak terikat ukuran gambar */}
        <Card padding="none" className="overflow-hidden">
          <img
            src="/images/masjid_al_aqwam.jpg"
            alt="Masjid Ja'mi Al Aqwam, Bintara Jaya Permai, Bekasi"
            className="w-full h-auto block"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_ENTITY_IMAGE_URL; }}
          />

          <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <Landmark className="w-5 h-5 text-emerald-700" />
                </span>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-stone-900">Tentang Yayasan Al Aqwam</h2>
                  <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                    Yayasan Islam Al Aqwam &mdash; Bintara Jaya Permai, Bekasi
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
                <p>
                  Yayasan Islam Al Aqwam merupakan yayasan yang berkhidmat dalam bidang pendidikan,
                  Agama Islam, ekonomi, sosial, dan kaderisasi anak bangsa. Didirikan sebagai sarana
                  untuk mengelola dan mengembangkan dakwah Islam berdasarkan Al-Qur'an dan As-Sunnah
                  dengan pemahaman Ahlus Sunnah wal Jamaah di Bintara Jaya Permai khususnya dan Bekasi
                  pada umumnya.
                </p>
                <p>
                  Untuk merealisasikan maksud dan tujuan di atas, dibutuhkan suatu wadah yang diharapkan
                  mampu menampung kegiatan-kegiatan dakwah melalui jalur pendidikan Agama Islam, ekonomi,
                  dan sosial serta kaderisasi anak bangsa dalam melaksanakan kegiatan.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-800">Sejarah Singkat</h3>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  Dirintis pembangunannya sejak tahun 1987, mulai digunakan dan diserahkan kepada RW 011,
                  Bintara Jaya Permai pada tahun 1992.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-stone-50 border border-stone-100 p-4 text-center">
                    <p className="text-lg sm:text-xl font-black text-emerald-800">2.437 m²</p>
                    <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">Luas Tanah</p>
                  </div>
                  <div className="rounded-2xl bg-stone-50 border border-stone-100 p-4 text-center">
                    <p className="text-lg sm:text-xl font-black text-emerald-800">535 m²</p>
                    <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">Luas Bangunan Masjid</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-800">Legalitas Masjid</h3>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  Nama Yayasan: <strong className="text-stone-900">YAYASAN AL AQWAM</strong>, berdiri tahun 1996.
                </p>
                <div className="rounded-2xl border border-stone-200 overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <tbody>
                      {[
                        { label: 'Akte Pendirian', no: '168', date: '27 Juli 1996' },
                        { label: 'Akte Perubahan Ke I', no: '07', date: '01 September 1999' },
                        { label: 'Akte Perubahan Ke II', no: '37', date: '15 Januari 2003' },
                        { label: 'Akte Perubahan Ke III', no: '112', date: '14 Maret 2006' },
                        { label: 'Akte Perubahan Ke IV', no: '007', date: '30 Desember 2009' },
                        { label: 'Akte Perubahan Ke V', no: '24', date: '29 Nopember 2017 (Terakhir)' },
                      ].map((row, i) => (
                        <tr key={row.label} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                          <td className="py-2.5 px-4 font-bold text-stone-800">{row.label}</td>
                          <td className="py-2.5 px-4 text-stone-600">No. {row.no}</td>
                          <td className="py-2.5 px-4 text-stone-600">{row.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-2xl bg-emerald-50/60 border border-emerald-100 p-5 space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-800">Visi</h3>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  Menjadikan masyarakat yang hasan dan kompeten sesuai dengan tuntunan Al-Qur'an dan
                  Sunnah sehingga dapat memotivasi perubahan sosial, ekonomi, moral, dan akhlak menuju
                  arah kebaikan bagi umat dan masyarakat.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-800">Misi</h3>
                <ol className="space-y-2.5">
                  {[
                    'Meningkatkan kualitas keimanan dan peribadatan sesuai dengan Al-Qur\'an dan Sunnah.',
                    'Membina, mengembangkan, dan memberdayakan potensi generasi produktif sebagai generasi penerus dalam bidang Agama Islam, akhlak, moral, ekonomi, dan sosial.',
                    'Menjadi wadah media pendidikan untuk terbentuknya SDM yang mampu bersaing dalam melaksanakan nilai-nilai Islam yang berdasarkan Al-Qur\'an dan Sunnah dalam kehidupan.',
                    'Membina masyarakat melalui program-program sosial, kemanusiaan, dan keagamaan.',
                    'Memajukan dan mencerdaskan generasi muda bangsa melalui penyelenggaraan pendidikan formal dan non-formal.',
                  ].map((misi, i) => (
                    <li key={i} className="flex gap-3 text-xs sm:text-sm text-stone-700 leading-relaxed">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <span>{misi}</span>
                    </li>
                  ))}
                </ol>
              </div>
          </div>
        </Card>

        {/* Other Keagamaan Entities */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Unit Kegiatan Sosial Keagamaan Lainnya
          </h3>
          {otherEntities.length === 0 ? (
            <div className="text-center py-16 space-y-3 bg-white rounded-2xl border border-stone-200">
              <SearchX className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="font-bold text-stone-700">Belum Ada Unit Kegiatan</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {otherEntities.map((entity) => (
                <EntityCard key={entity.id} entity={entity} onSelect={onSelectEntity} />
              ))}
            </div>
          )}
        </div>

        {/* Dokumen Resmi */}
        {DOCUMENTS.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Dokumen Resmi
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {DOCUMENTS.map((doc) => {
                const drivePreviewUrl = getDrivePreviewUrl(doc.fileUrl);
                const driveViewUrl = getDriveViewUrl(doc.fileUrl);

                return (
                  <Card
                    key={doc.id}
                    padding="none"
                    interactive
                    className="p-5 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <span className="px-2.5 py-0.5 bg-red-100 text-red-800 text-[11px] font-extrabold rounded-md flex items-center gap-1 border border-red-200 w-fit">
                        <FileText className="w-3.5 h-3.5 text-red-600" />
                        <span>Dokumen PDF</span>
                      </span>

                      <div>
                        <h4 className="font-extrabold text-stone-900 text-base leading-snug">
                          {doc.title}
                        </h4>
                        {doc.description && (
                          <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                            {doc.description}
                          </p>
                        )}
                      </div>

                      {drivePreviewUrl && (
                        <iframe
                          src={drivePreviewUrl}
                          title={doc.title}
                          className="w-full h-[520px] rounded-xl border border-stone-200"
                          loading="lazy"
                        />
                      )}
                    </div>

                    {driveViewUrl && (
                      <div className="pt-2 border-t border-stone-100">
                        <a
                          href={driveViewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
                        >
                          <Download className="w-4 h-4 text-emerald-300" />
                          <span>Buka Dokumen Lengkap</span>
                        </a>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};
