import React, { useState } from 'react';
import { DocumentTemplate } from '../types';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  QrCode,
  UserCheck,
  RefreshCw,
  Copy,
  Check,
  Home,
} from 'lucide-react';

interface DocumentGeneratorPageProps {
  templates?: DocumentTemplate[];
  onGoHome?: () => void;
}

export const DocumentGeneratorPage: React.FC<DocumentGeneratorPageProps> = ({ templates = [], onGoHome }) => {
  // Available templates (fallback if empty)
  const activeTemplates = templates.filter((t) => t.enabled);

  const defaultTemplateList: DocumentTemplate[] = activeTemplates.length > 0 ? activeTemplates : [
    {
      id: 'tmpl-1',
      title: 'Surat Pengantar RT / RW 11',
      code: 'SURAT_PENGANTAR_RTRW',
      category: 'Pemerintahan / Kependudukan',
      description: 'Surat pengantar resmi warga untuk pengurusan KTP, Kartu Keluarga, atau Akta di Kantor Kelurahan Bintara Jaya.',
      enabled: true,
      templateBody: 'Bahwa nama tersebut di atas adalah benar-benar warga yang bertempat tinggal dan berdomisili di Komplek Bintara Jaya Permai RW 11. Surat pengantar ini diterbitkan untuk keperluan pengurusan administrasi kependudukan.',
    },
    {
      id: 'tmpl-2',
      title: 'Surat Keterangan Domisili Tempat Tinggal',
      code: 'SURAT_KET_DOMISILI',
      category: 'Kependudukan',
      description: 'Surat keterangan domisili bagi warga menetap di Komplek Bintara Jaya Permai.',
      enabled: true,
      templateBody: 'Menerangkan dengan sebenarnya bahwa warga yang bersangkutan adalah penduduk yang menetap dan berdomisili di lingkungan RW 11 Bintara Jaya Permai.',
    },
    {
      id: 'tmpl-3',
      title: 'Surat Keterangan Kegiatan Usaha (SKU) Sentra UMKM',
      code: 'SURAT_KET_USAHA',
      category: 'Sentra Usaha / Ekonomi',
      description: 'Surat keterangan resmi kegiatan usaha / UMKM warga Bintara Jaya Permai.',
      enabled: true,
      templateBody: 'Menerangkan bahwa nama tersebut memiliki dan menjalankan kegiatan usaha UMKM di wilayah Komplek Bintara Jaya Permai (RW 11) dan terdaftar aktif dalam Sentra Usaha BJP HUB.',
    },
  ];

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(defaultTemplateList[0]?.id || '');
  const [fullName, setFullName] = useState<string>('');
  const [nik, setNik] = useState<string>('');
  const [address, setAddress] = useState<string>('Komplek Bintara Jaya Permai Blok C / RT 03 RW 11, Bekasi');
  const [requestDate, setRequestDate] = useState<string>(
    new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  );
  const [purpose, setPurpose] = useState<string>('Pengurusan Administrasi Kependudukan / Kelurahan');
  const [phone, setPhone] = useState<string>('081234567890');

  const [generatedLetter, setGeneratedLetter] = useState<{
    letterNumber: string;
    template: DocumentTemplate;
    fullName: string;
    nik: string;
    address: string;
    requestDate: string;
    purpose: string;
    phone: string;
  } | null>(null);

  const [copied, setCopied] = useState<boolean>(false);

  const currentTemplate = defaultTemplateList.find((t) => t.id === selectedTemplateId) || defaultTemplateList[0];

  const generateLetterNumber = () => {
    const randomSeq = Math.floor(100 + Math.random() * 900);
    const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const currentMonth = romanMonths[new Date().getMonth()];
    const year = new Date().getFullYear();
    return `470/${randomSeq}/RW.11/BJP/${currentMonth}/${year}`;
  };

  const handleGenerateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !address.trim() || !purpose.trim()) {
      alert('Mohon lengkapi Nama Lengkap, Alamat, dan Keperluan Surat!');
      return;
    }

    const num = generateLetterNumber();
    setGeneratedLetter({
      letterNumber: num,
      template: currentTemplate,
      fullName,
      nik: nik || '3275010000000001',
      address,
      requestDate,
      purpose,
      phone,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    if (!generatedLetter) return;
    const text = `
PENGURUS RUKUN WARGA 11
KOMPLEK BINTARA JAYA PERMAI
KELURAHAN BINTARA JAYA, KECAMATAN BEKASI BARAT

NOMOR SURAT: ${generatedLetter.letterNumber}
JENIS SURAT: ${generatedLetter.template.title}

Nama Lengkap: ${generatedLetter.fullName}
NIK / KTP: ${generatedLetter.nik}
Alamat: ${generatedLetter.address}
Keperluan: ${generatedLetter.purpose}
Tanggal Request: ${generatedLetter.requestDate}

KETERANGAN:
${generatedLetter.template.templateBody}

Terverifikasi Sistem BJP HUB RW 11
    `;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto my-8 px-4 sm:px-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between flex-wrap gap-4 no-print">
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80">
            Layanan Warga Mandiri
          </span>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-700" />
            <span>Generator Surat Menyurat Online</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
            Buat surat keterangan resmi secara mandiri — lengkap dengan nomor surat otomatis.
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-stone-200/90 shadow-md space-y-5 no-print">
          <div className="border-b border-stone-100 pb-3">
            <h2 className="font-extrabold text-stone-900 text-base sm:text-lg flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-700" />
              <span>Formulir Permohonan Surat</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">Isi data identitas diri untuk menerbitkan dokumen.</p>
          </div>

          <form onSubmit={handleGenerateSubmit} className="space-y-4 text-xs sm:text-sm">
            {/* Template Selector */}
            <div>
              <label className="block font-bold text-stone-800 mb-1">Pilih Jenis Dokumen Surat</label>
              <select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl font-semibold text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              >
                {defaultTemplateList.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.category})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-stone-500 mt-1">{currentTemplate?.description}</p>

              {/* If uploaded template file exists, show direct file download option */}
              {currentTemplate?.fileUrl && (
                <div className="mt-2.5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileText className="w-5 h-5 text-emerald-700 shrink-0" />
                    <div className="truncate">
                      <span className="text-xs font-bold text-emerald-950 block truncate">
                        File Berkas Template Tersedia
                      </span>
                      <span className="text-[11px] text-emerald-800 font-mono truncate">
                        {currentTemplate.fileName || 'template_berkas_resmi.docx'}
                      </span>
                    </div>
                  </div>

                  <a
                    href={currentTemplate.fileUrl}
                    download={currentTemplate.fileName || `Template_${currentTemplate.code}.docx`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition-colors shrink-0 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh File</span>
                  </a>
                </div>
              )}
            </div>

            {/* Nama Lengkap */}
            <div>
              <label className="block font-bold text-stone-800 mb-1">Nama Lengkap Warga *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Budi Santoso"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl font-medium text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            {/* NIK */}
            <div>
              <label className="block font-bold text-stone-800 mb-1">Nomor NIK / KTP (Opsional)</label>
              <input
                type="text"
                placeholder="Contoh: 3275012304850002"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl font-medium text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            {/* Alamat */}
            <div>
              <label className="block font-bold text-stone-800 mb-1">Alamat Lengkap *</label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl font-medium text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            {/* Keperluan */}
            <div>
              <label className="block font-bold text-stone-800 mb-1">Keperluan Permohonan *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Syarat pembuatan E-KTP Kelurahan"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl font-medium text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            {/* Tanggal Request & WA */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-800 mb-1">Tanggal Surat</label>
                <input
                  type="text"
                  value={requestDate}
                  onChange={(e) => setRequestDate(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-medium text-stone-900"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">No. WA / Kontak</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-medium text-stone-900"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <RefreshCw className="w-4 h-4 text-amber-300" />
              <span>Generate Surat & Nomor Resmi</span>
            </button>
          </form>
        </div>

        {/* Letter Preview & Document Container */}
        <div className="lg:col-span-7 space-y-4">
          {generatedLetter ? (
            <div className="space-y-4">
              {/* Action Toolbar */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs flex items-center justify-between flex-wrap gap-2 no-print">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Surat Siap Diunduh / Dicetak</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyText}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-stone-600" />}
                    <span>{copied ? 'Tersalin' : 'Salin Teks'}</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-amber-300" />
                    <span>Cetak / Download PDF</span>
                  </button>
                </div>
              </div>

              {/* Formal Letter Paper Design */}
              <div className="bg-white p-8 sm:p-12 rounded-2xl border border-stone-300 shadow-xl space-y-6 text-stone-900 text-xs sm:text-sm font-serif relative">
                {/* Formal KOP SURAT */}
                <div className="border-b-4 border-double border-stone-950 pb-4 text-center space-y-1 font-sans">
                  <h3 className="text-base sm:text-lg font-black uppercase tracking-wide text-stone-950">
                    PENGURUS RUKUN WARGA 11
                  </h3>
                  <h4 className="text-sm sm:text-base font-bold text-emerald-900 uppercase">
                    KOMPLEK BINTARA JAYA PERMAI
                  </h4>
                  <p className="text-[11px] text-stone-600 font-medium">
                    Kelurahan Bintara Jaya, Kecamatan Bekasi Barat, Kota Bekasi, Jawa Barat 17136
                  </p>
                </div>

                {/* Document Title & Letter Number */}
                <div className="text-center space-y-1 font-sans py-2">
                  <h2 className="text-base sm:text-lg font-black uppercase underline tracking-wider text-stone-950">
                    {generatedLetter.template.title}
                  </h2>
                  <p className="text-xs font-bold text-stone-800">
                    Nomor: <span className="font-mono bg-stone-100 px-2 py-0.5 rounded border border-stone-300">{generatedLetter.letterNumber}</span>
                  </p>
                </div>

                {/* Opening Paragraph */}
                <p className="leading-relaxed">
                  Yang bertanda tangan di bawah ini Pengurus RW 11 Komplek Bintara Jaya Permai Kelurahan Bintara Jaya, Kecamatan Bekasi Barat, dengan ini menerangkan bahwa:
                </p>

                {/* Data Table */}
                <table className="w-full text-left border-collapse my-4 font-sans text-xs sm:text-sm">
                  <tbody>
                    <tr className="border-b border-stone-100">
                      <td className="py-1.5 font-bold w-36 text-stone-700">Nama Lengkap</td>
                      <td className="py-1.5 font-bold text-stone-950">: {generatedLetter.fullName}</td>
                    </tr>
                    <tr className="border-b border-stone-100">
                      <td className="py-1.5 font-bold text-stone-700">NIK / No. KTP</td>
                      <td className="py-1.5 font-mono text-stone-950">: {generatedLetter.nik}</td>
                    </tr>
                    <tr className="border-b border-stone-100">
                      <td className="py-1.5 font-bold text-stone-700">Alamat Tinggal</td>
                      <td className="py-1.5 text-stone-950">: {generatedLetter.address}</td>
                    </tr>
                    <tr className="border-b border-stone-100">
                      <td className="py-1.5 font-bold text-stone-700">Keperluan Surat</td>
                      <td className="py-1.5 font-semibold text-emerald-900">: {generatedLetter.purpose}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Body Content */}
                <p className="leading-relaxed font-sans text-stone-800">
                  {generatedLetter.template.templateBody}
                </p>

                {/* Closing */}
                <p className="leading-relaxed">
                  Demikian surat keterangan ini dibuat dengan sebenarnya agar dapat dipergunakan sebagaimana mestinya.
                </p>

                {/* Signatures & Verification */}
                <div className="pt-8 grid grid-cols-2 gap-4 font-sans text-center text-xs">
                  <div className="space-y-12">
                    <p>Pemohon Warga,</p>
                    <p className="font-bold underline uppercase text-stone-950">{generatedLetter.fullName}</p>
                  </div>

                  <div className="space-y-2">
                    <p>Bekasi, {generatedLetter.requestDate}</p>
                    <p className="font-semibold text-stone-700">Pengurus RW 11 BJP HUB</p>

                    {/* Stamp Verification Badge */}
                    <div className="my-2 p-2 bg-emerald-50 border border-emerald-300 rounded-xl inline-flex flex-col items-center gap-1 shadow-2xs">
                      <QrCode className="w-8 h-8 text-emerald-800" />
                      <span className="text-[9px] font-bold text-emerald-900">VERIFIKASI DIGITAL BJP HUB</span>
                    </div>

                    <p className="font-bold underline uppercase text-stone-950 pt-2">( Ketua RW 11 Bintara Jaya Permai )</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-extrabold text-stone-900 text-lg">Pratinjau Dokumen Surat</h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto mt-1">
                  Lengkapi formulir di sebelah kiri dan klik "Generate Surat & Nomor Resmi" untuk menerbitkan dokumen formal secara langsung.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
