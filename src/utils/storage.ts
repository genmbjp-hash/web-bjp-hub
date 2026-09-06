import { Entity, Announcement, SiteSettings, CategoryHeaderConfig, User, RtRwPageConfig, BankSampahConfig, DkmMasjidConfig, FasilitasLingkunganConfig } from '../types';
import { INITIAL_ENTITIES, INITIAL_ANNOUNCEMENTS } from '../data/initialData';
import { BJP_LOGO_URL } from '../assets/logo';
import { updateSiteFaviconAndOgImage } from './meta';
import {
  isSupabaseConfigured,
  saveUsersToSupabase,
  saveEntitiesToSupabase,
  saveAnnouncementsToSupabase,
  saveSiteSettingsToSupabase,
} from '../lib/supabase';
import {
  STORAGE_KEYS,
  CATEGORY_LEGACY_MAP,
  DEFAULT_SITE_TITLE,
  DEFAULT_SITE_DESCRIPTION,
} from '../constants/defaults';

// Initial admin username & password loaded from environment variable or generated default
const initialAdminUsername = import.meta.env.VITE_INITIAL_ADMIN_USERNAME || 'admin';
const initialAdminPassword = import.meta.env.VITE_INITIAL_ADMIN_PASSWORD || 'Bjp01!';

export const DEFAULT_USERS: User[] = [
  {
    id: 'usr-super-admin',
    username: initialAdminUsername,
    password: initialAdminPassword,
    name: 'Super Admin BJP',
    role: 'super_admin',
    allowedEntityIds: ['*'],
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'usr-sentra-usaha',
    username: 'admin_umkm',
    password: initialAdminPassword,
    name: 'Pengurus Sentra Usaha UMKM',
    role: 'entity_admin',
    allowedEntityIds: [
      'ent-umkm-1', 'ent-umkm-2', 'ent-umkm-3', 'ent-umkm-4', 'ent-umkm-5',
      'ent-umkm-6', 'ent-umkm-7', 'ent-umkm-8', 'ent-umkm-9', 'ent-umkm-10', 'ent-4',
    ],
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

export const DEFAULT_CATEGORY_CONFIGS: CategoryHeaderConfig[] = [
  {
    id: 'Sentra Usaha BJP',
    name: 'Sentra Usaha BJP',
    description: 'Unit komunitas, UMKM, dan kegiatan usaha warga Bintara Jaya Permai (RW 11)',
    logoUrl: '/images/sentra_usaha_logo.jpg',
  },
  {
    id: 'Kuliner (Food & Beverage)',
    name: 'Kuliner (Food & Beverage)',
    description: 'UMKM makanan, minuman, dan jajanan rumahan warga Sentra Usaha BJP',
    logoUrl: '',
  },
  {
    id: 'Kebutuhan Pokok Harian',
    name: 'Kebutuhan Pokok Harian',
    description: 'UMKM sembako, kebutuhan rumah tangga, dan belanja harian warga Sentra Usaha BJP',
    logoUrl: '',
  },
  {
    id: 'Pusat Hub',
    name: 'Pusat Hub',
    description: 'Pusat kegiatan, sekretariat, dan informasi utama RW 11',
    logoUrl: '',
  },
  {
    id: 'Administratif / Pemerintahan',
    name: 'Administratif / Pemerintahan',
    description: 'Layanan administrasi RT, RW, dan pemerintahan warga',
    logoUrl: '',
  },
  {
    id: 'Keagamaan',
    name: 'Keagamaan',
    description: 'Kegiatan ibadah, tempat ibadah, dan pengajian warga',
    logoUrl: '',
  },
  {
    id: 'Lingkungan',
    name: 'Lingkungan',
    description: 'Kegiatan kebersihan, pengolahan sampah, dan pertamanan',
    logoUrl: '',
  },
  {
    id: 'Kesejahteraan Keluarga',
    name: 'Kesejahteraan Keluarga',
    description: 'Kegiatan PKK, posyandu, dan pemberdayaan keluarga',
    logoUrl: '',
  },
  {
    id: 'Kesehatan',
    name: 'Kesehatan',
    description: 'Layanan kesehatan, posyandu lansia, dan ambulans warga',
    logoUrl: '',
  },
  {
    id: 'Kepemudaan',
    name: 'Kepemudaan',
    description: 'Karang Taruna dan wadah kreativitas pemuda Bintara Jaya Permai',
    logoUrl: '',
  },
  {
    id: 'Olahraga',
    name: 'Olahraga',
    description: 'Fasilitas dan klub olahraga warga RW 11',
    logoUrl: '',
  },
];

export const DEFAULT_RTRW_CONFIG: RtRwPageConfig = {
  enabled: true,
  pageTitle: 'Informasi RT/RW 11 Bintara Jaya Permai',
  pageDescription: 'Visi misi pengurus dan data RT 01 s/d RT 09 Bintara Jaya Permai.',
  heroImage: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
  visionTitle: '🏛️ Visi & Misi Resmi RW 11',
  visionHeading: 'Visi & Misi Pengurus RW 11 Bintara Jaya Permai',
  visionText: 'Mewujudkan lingkungan RW 011 dengan prinsip TeGAR sebagai sebuah komitmen bersama. Dengan menjadi warga yang Tertib pada aturan, Guyub dalam persaudaraan, Antusias dalam berpartisipasi, dan Rukun dalam perbedaan, Perumahan Bintara Jaya Permai RW 011 akan menjadi rumah idaman yang aman, nyaman, dan membawa kebahagiaan bagi seluruh penghuninya.',
  missions: [
    'Berpartisipasi aktif dalam pelestarian lingkungan hidup dengan menciptakan lingkungan yang asri: sehat, maju, aman, rukun dan tentram.',
    'Mendukung program yang dicanangkan oleh pemerintah Kota Bekasi.',
    'Menggali semua potensi warga dan memberdayakan peran aktif warga untuk mendorong tercapainya kehidupan masyarakat yang TeGAR.',
    'Membuat sistem administrasi yang tertib & modern dengan memanfaatkan teknologi informasi terkini.',
    'Memberikan pelayanan terbaik kepada warga RW.011 dengan tulus dan ikhlas.',
  ],
  values: [
    { title: 'Tertib', description: 'Setiap warga memiliki kesadaran tinggi terhadap aturan dan norma yang berlaku, baik tertulis maupun tidak tertulis — keteraturan adalah kunci kenyamanan bersama.' },
    { title: 'Guyub', description: 'Akar budaya masyarakat Indonesia yang menjunjung tinggi kebersamaan, rasa kekeluargaan, dan saling peduli antar tetangga.' },
    { title: 'Antusias', description: 'Energi positif warga — lingkungan yang hidup adalah lingkungan yang warganya proaktif dan bersemangat, bukan sekadar penonton.' },
    { title: 'Rukun', description: 'Muara dari seluruh prinsip di atas: suasana harmonis, damai, dan minim konflik, dengan menghormati perbedaan dan mengutamakan musyawarah.' },
  ],
  rtListTitle: 'Rincian Informasi Wilayah per RT (RT 01 s/d RT 09)',
  rtListDescription: 'RW 011 terdiri dari 9 RT (masa bakti 2022-2027). Data ketua dan kontak per-RT sedang dilengkapi oleh pengurus — silakan tambahkan melalui menu CMS.',
  rts: [],
  extraSectionTitle: 'Dokumen & Informasi Resmi RT/RW',
  extraSectionDescription: 'Tata tertib warga dan struktur pengurus resmi RW 011 Bintara Jaya Permai.',
  extraCards: [
    {
      id: 'card-txt-1',
      type: 'text',
      title: 'Tata Tertib Warga RW 011',
      description: 'Ringkasan aturan bersama warga Bintara Jaya Permai.',
      categoryBadge: 'Peraturan Warga',
      textContent: '1. Warga wajib berperan aktif menjaga keamanan, kebersihan, ketertiban, dan kerukunan bersama.\n2. Mematuhi aturan lalu lintas kendaraan di pintu keluar-masuk komplek.\n3. Warga baru wajib lapor ke RT setempat; warga pindah wajib lapor sebelum keluar.\n4. Jam bertamu: hingga 22.00 WIB (hari kerja) dan 24.00 WIB (Sabtu-Minggu); tamu menginap wajib dilaporkan.\n5. Iuran kebersihan & keamanan dibayar paling lambat tanggal 5 setiap bulan.\n6. Kerja bakti wajib setiap Minggu pertama tiap bulan, pukul 08.00 WIB.\n7. Acara/hajatan wajib diberitahukan ke pengurus minimal 3 hari sebelumnya.\n8. Kegiatan di masjid memerlukan izin RW dan pengurus masjid.\n9. Dilarang keras: peredaran narkoba, penjualan minuman keras, perjudian, dan tindak asusila/kriminal di rumah.\n10. Warga wajib menjaga kerapian rumah; material bangunan tidak boleh menutup jalan umum; hewan peliharaan wajib diawasi; renovasi wajib lapor + identitas pekerja.\n11. Pelanggaran akan dikenakan teguran tertulis hingga penundaan pelayanan surat oleh RT.',
      author: 'Pengurus RW 011 Bintara Jaya Permai',
      enabled: true,
      order: 0,
    },
    {
      id: 'card-txt-2',
      type: 'text',
      title: 'Struktur Pengurus RW 011 (Periode 2022-2027)',
      description: 'Susunan pengurus resmi RW 011 Bintara Jaya Permai.',
      categoryBadge: 'Struktur Organisasi',
      textContent: 'Ketua RW 11: H. Dadang Rachmat Hidayatulloh\nSekretaris: H. Hery Suadi\nBendahara: Ari Hartanto\n\nBidang Pembangunan & Infrastruktur: Sadikin Firdaus, H. Edy Efendy Siraz\nBidang Sosial & Budaya: H. Rusdi Rifai, H. Unang Juhana\nBidang Keamanan & Ketertiban Masyarakat: Use, Engkus Kusnadi, Bambang K.\nBidang Kebersihan & Lingkungan Hidup: H. Yusuf A, H. Suherman, Darlis Dahlan\nBidang Pemuda & Olahraga: H. Asep, Karang Taruna\n\nPembina: Zaenal Arifin, S.E. (Lurah Bintara Jaya)\nPenasehat: H. Bachri Marzuki, H. FR. Ghanty Sy., H. Nazir Syafrie, H. Sadikin Marpaung',
      author: 'Sekretariat RW 011',
      enabled: true,
      order: 1,
    },
    {
      id: 'card-pdf-1',
      type: 'pdf',
      title: 'Tatib Warga RW 011 (2026)',
      description: 'Dokumen resmi Tata Tertib Warga RW 011 Bintara Jaya Permai versi 2026.',
      categoryBadge: 'Peraturan Warga',
      fileUrl: 'https://drive.google.com/file/d/1_7w3o6T4YIfi5NozmsX56zd4E-GqUGFJ/view?usp=sharing',
      fileName: 'Tata Tertib Warga RW11 BJP 2026.pdf',
      ctaText: 'Buka Dokumen Lengkap',
      enabled: true,
      order: 2,
    },
    // Pengurus & Layanan
    {
      id: 'card-txt-gov-1',
      type: 'text',
      title: 'Tupoksi RW 011',
      description: 'Tugas pokok dan fungsi pengurus RW 011.',
      categoryBadge: 'Pengurus & Layanan',
      textContent: 'RW 011 bertugas menjalankan koordinasi pemerintahan terkecil: menjembatani program pemerintah Kota Bekasi dengan warga, menjaga ketertiban & keamanan lingkungan, memfasilitasi administrasi kependudukan, serta mengoordinasikan seluruh RT dan lembaga warga (PKK, Karang Taruna, DKM, dsb) agar berjalan selaras.',
      enabled: true,
      order: 3,
    },
    {
      id: 'card-txt-gov-2',
      type: 'text',
      title: 'Pengurus RW & RT',
      description: 'Susunan pengurus RW 011 dan RT 01-09.',
      categoryBadge: 'Pengurus & Layanan',
      textContent: 'Susunan lengkap pengurus RW 011 dapat dilihat pada kartu "Struktur Pengurus RW 011" di atas. Data ketua dan kontak masing-masing RT tersedia pada bagian "Rincian Informasi Wilayah per RT".',
      enabled: true,
      order: 4,
    },
    {
      id: 'card-txt-gov-3',
      type: 'text',
      title: 'PKK & Posyandu',
      description: 'Pemberdayaan keluarga dan layanan kesehatan dasar warga.',
      categoryBadge: 'Pengurus & Layanan',
      textContent: 'PKK RW 11 dan Posyandu & Posbindu terdaftar sebagai komunitas aktif dengan program dan jadwal rutin masing-masing. Lihat detail lengkap di halaman Komunitas Kegiatan kategori "Kesejahteraan Keluarga" dan "Kesehatan".',
      enabled: true,
      order: 5,
    },
    {
      id: 'card-txt-gov-4',
      type: 'text',
      title: 'Karang Taruna & Lingkungan',
      description: 'Wadah kepemudaan dan kepedulian lingkungan warga.',
      categoryBadge: 'Pengurus & Layanan',
      textContent: 'GenM BJP mewadahi kegiatan Karang Taruna, sementara Bank Sampah KMS mengelola program kepedulian lingkungan warga. Lihat detail lengkap di halaman Komunitas Kegiatan kategori "Kepemudaan" dan "Lingkungan".',
      enabled: true,
      order: 6,
    },
    {
      id: 'card-txt-gov-5',
      type: 'text',
      title: 'Pelayanan Warga',
      description: 'Layanan administrasi & surat-menyurat warga RW 011.',
      categoryBadge: 'Pengurus & Layanan',
      textContent: 'Pengurusan surat pengantar, keterangan domisili, dan surat keterangan usaha dapat dibuat mandiri secara online melalui menu "Layanan Surat Online" pada navigasi utama situs ini.',
      enabled: true,
      order: 7,
    },
    {
      id: 'card-txt-gov-6',
      type: 'text',
      title: 'e-Open Disdukcapil',
      description: 'Layanan kependudukan online Dinas Kependudukan & Catatan Sipil.',
      categoryBadge: 'Pengurus & Layanan',
      textContent: 'Untuk pengurusan KTP, KK, akta, dan dokumen kependudukan resmi lainnya, warga dapat menghubungi Sekretariat RW 011 untuk mendapatkan tautan resmi layanan e-Open Disdukcapil Kota Bekasi terbaru.',
      enabled: true,
      order: 8,
    },
    // Fasilitas Lingkungan
    {
      id: 'card-txt-fac-1',
      type: 'text',
      title: 'Tempat Ibadah',
      description: 'Masjid Ja\'mi Al Aqwam sebagai pusat ibadah warga.',
      categoryBadge: 'Fasilitas Lingkungan',
      textContent: 'Masjid Ja\'mi Al Aqwam melayani sholat berjamaah 5 waktu, sholat Jumat, kajian rutin, dan perayaan hari besar Islam. Detail lengkap tersedia di halaman Komunitas Kegiatan kategori "Keagamaan".',
      enabled: true,
      order: 9,
    },
    {
      id: 'card-txt-fac-2',
      type: 'text',
      title: 'Gedung Sekretariat RW',
      description: 'Kantor administrasi dan koordinasi harian pengurus RW 011.',
      categoryBadge: 'Fasilitas Lingkungan',
      textContent: 'Ruang pelayanan administrasi warga, rapat koordinasi pengurus, dan penampungan aspirasi. Buka Senin-Sabtu (09.00-16.00 WIB).',
      enabled: true,
      order: 10,
    },
    {
      id: 'card-txt-fac-3',
      type: 'text',
      title: 'Gedung PKK',
      description: 'Sekretariat dan tempat kegiatan rutin PKK RW 011.',
      categoryBadge: 'Fasilitas Lingkungan',
      textContent: 'Digunakan untuk pertemuan rutin, pelatihan keterampilan, dan kegiatan POKJA PKK ibu-ibu warga komplek.',
      enabled: true,
      order: 11,
    },
    {
      id: 'card-txt-fac-4',
      type: 'text',
      title: 'Gedung Olah Raga',
      description: 'GOR BJP untuk badminton, padel, dan aktivitas indoor lainnya.',
      categoryBadge: 'Fasilitas Lingkungan',
      textContent: 'Fasilitas olahraga warga yang digunakan komunitas Badminton Club, Padel Club, dan PTM Permai. Booking lapangan dikoordinasikan oleh GenM BJP.',
      enabled: true,
      order: 12,
    },
    {
      id: 'card-txt-fac-5',
      type: 'text',
      title: 'Fasilitas Umum',
      description: 'Taman, jalan, dan saluran air lingkungan komplek.',
      categoryBadge: 'Fasilitas Lingkungan',
      textContent: 'Perawatan taman, kebersihan jalan lingkungan, dan saluran air komplek dikoordinasikan oleh Bidang Pembangunan & Infrastruktur RW 011 bersama kerja bakti rutin warga.',
      enabled: true,
      order: 13,
    },
    {
      id: 'card-txt-fac-6',
      type: 'text',
      title: 'PG & TK',
      description: 'Pendidikan anak usia dini di lingkungan komplek.',
      categoryBadge: 'Fasilitas Lingkungan',
      textContent: 'Layanan Playgroup dan Taman Kanak-Kanak yang melayani anak-anak warga Komplek Bintara Jaya Permai dan sekitarnya.',
      enabled: true,
      order: 14,
    },
    {
      id: 'card-txt-fac-7',
      type: 'text',
      title: 'Sistem Keamanan Lingkungan',
      description: 'Pos satpam & siskamling 24 jam Komplek BJP.',
      categoryBadge: 'Fasilitas Lingkungan',
      textContent: 'Patroli 24 jam keliling blok A-F, pemeriksaan tamu di portal malam, dan tanggap darurat keamanan lingkungan. Lihat detail di halaman Komunitas Kegiatan kategori "Administratif / Pemerintahan".',
      enabled: true,
      order: 15,
    },
    {
      id: 'card-pdf-2',
      type: 'pdf',
      title: 'Tata Tertib Security, SOP, dan Sistem Penggajian',
      description: 'Dokumen resmi Tata Tertib Petugas Keamanan (Security), Standar Operasional Prosedur (SOP), dan Sistem Penggajian RW 011 Bintara Jaya Permai.',
      categoryBadge: 'Peraturan Keamanan',
      fileUrl: 'https://drive.google.com/file/d/19wEYu4thWZSf-pzTy_HfGcSXc2971cZ8/view?usp=sharing',
      fileName: 'TATA TERTIB SECURITY, SOP DAN SISTEM PENGGAJIAN-FINAL-2.pdf',
      ctaText: 'Buka Dokumen Lengkap',
      enabled: true,
      order: 16,
    },
  ],
  programKerjaTitle: 'Program Kerja',
  programKerjaIntro: 'Program kerja ini dibuat sebagai agenda kegiatan dan penganggaran dalam menjalankan kepengurusan untuk mencapat tujuan TeGAR!',
  programKerjaShortTitle: 'I. Program Kerja Jangka Pendek dan Menengah',
  programKerjaShortDescription: 'Fokus pada tahun pertama sampai ketiga adalah penguatan fondasi pelayanan, perbaikan dan pembangunan infrastruktur dasar, digitalisasi informasi, pengelolaan lingkungan, serta penertiban lingkungan warga.',
  programKerjaShort: [
    {
      id: 'pk-short-1',
      title: 'Peningkatan Administrasi dan Pelayanan Publik',
      description: 'Mengoptimalkan sistem administrasi kependudukan dan meningkatkan kualitas pelayanan kepada warga secara cepat dan tepat.',
      enabled: true,
      order: 0,
    },
    {
      id: 'pk-short-2',
      title: 'Sentralisasi Media Komunikasi dan Koordinasi Komunitas (BJPhub)',
      description: 'Meluncurkan dan mengelola BJPhub sebagai wadah sentralisasi media komunikasi, pusat informasi, dan koordinasi terpadu bagi seluruh elemen dan komunitas warga di lingkungan Bintara Jaya Permai.',
      enabled: true,
      order: 1,
    },
    {
      id: 'pk-short-3',
      title: 'Pemeliharaan Sekretariat dan Inventaris',
      description: 'Melakukan perawatan gedung Sekretariat RW serta melengkapi fasilitas dan inventaris kantor untuk mendukung kelancaran operasional kepengurusan.',
      enabled: true,
      order: 2,
    },
    {
      id: 'pk-short-4',
      title: 'Peningkatan Keamanan dan Ketertiban Masyarakat (Kamtibmas)',
      description: 'Mengaktifkan kembali sistem keamanan lingkungan (Siskamling), penataan jadwal keamanan, dan menyusun tata tertib warga.',
      enabled: true,
      order: 3,
    },
    {
      id: 'pk-short-5',
      title: 'Perbaikan dan Pemeliharaan Infrastruktur Lingkungan',
      description: 'Melakukan perbaikan sarana fisik lingkungan secara komprehensif, mencakup pengaspalan/pengecoran jalan, pengadaan rambu-rambu lalu lintas, penerangan jalan umum (PJU), dan infrastruktur penunjang lainnya.',
      enabled: true,
      order: 4,
    },
    {
      id: 'pk-short-6',
      title: 'Pengelolaan Bank Sampah dan Kebersihan Lingkungan',
      description: 'Membentuk dan mengelola program Bank Sampah secara aktif untuk mewujudkan lingkungan yang bersih, sehat, sekaligus memberikan nilai tambah ekonomis bagi warga.',
      enabled: true,
      order: 5,
    },
    {
      id: 'pk-short-7',
      title: 'Optimalisasi Fasos dan Fasum',
      description: 'Mengelola, merawat, dan mengembalikan fungsi utama Fasilitas Sosial (Fasos) dan Fasilitas Umum (Fasum) agar dapat dimanfaatkan secara maksimal oleh seluruh warga.',
      enabled: true,
      order: 6,
    },
    {
      id: 'pk-short-8',
      title: 'Pengendalian Banjir dan Perawatan Saluran Induk',
      description: 'Melakukan pemeliharaan saluran induk secara berkala oleh petugas khusus dan melaksanakan kerja bakti oleh warga dalam program K3 (Keindahan, Kebersihan & Ketertiban) - Lingkungan Bersih.',
      enabled: true,
      order: 7,
    },
    {
      id: 'pk-short-9',
      title: 'Realisasi Program Hibah Pemerintah Daerah',
      description: 'Mengawal, mengelola, dan merealisasikan program bantuan atau dana hibah dari pemerintah daerah secara transparan, akuntabel, dan tepat sasaran untuk pembangunan lingkungan.',
      enabled: true,
      order: 8,
    },
    {
      id: 'pk-short-10',
      title: 'Koordinasi dan Konsolidasi Lingkungan',
      description: 'Membangun komunikasi yang solid dan rutin antara Pengurus RW, Pengurus RT, tokoh masyarakat, dan warga melalui pertemuan atau musyawarah tingkat RW.',
      enabled: true,
      order: 9,
    },
    {
      id: 'pk-short-11',
      title: 'Pemberdayaan Kepemudaan dan Olahraga',
      description: 'Membina kegiatan Karang Taruna serta memfasilitasi kegiatan olahraga untuk membangun generasi muda yang aktif, kreatif, dan positif.',
      enabled: true,
      order: 10,
    },
    {
      id: 'pk-short-12',
      title: 'Peningkatan kesehatan warga',
      description: 'Dengan peran serta Posyandu-Posbindu secara berkala 2 bulan sekali melakukan pemeriksaan kesehatan dan melaksanakan pemantauan terhadap penyakit menular dan anak-anak stunting serta rumah tidak layak huni.',
      enabled: true,
      order: 11,
    },
    {
      id: 'pk-short-13',
      title: 'Evaluasi dan Pelaporan Berkala',
      description: 'Menyelenggarakan rapat evaluasi program kerja dan menyampaikan laporan pertanggungjawaban (keuangan dan progres kegiatan) kepada warga setiap triwulan (3 bulan sekali).',
      enabled: true,
      order: 12,
    },
  ],
  programKerjaLongTitle: 'II. Program Kerja Jangka Panjang',
  programKerjaLongDescription: 'Fokus pada tahun keempat hingga kelima adalah keberlanjutan program, pematangan ekosistem digital warga, adaptasi terhadap kebutuhan lingkungan yang berkembang, serta perluasan sinergi dengan pemerintah daerah.',
  programKerjaLong: [
    {
      id: 'pk-long-1',
      title: 'Keberlanjutan dan Pengembangan Program',
      description: 'Melanjutkan dan meningkatkan skala program kerja yang dinilai berhasil (seperti Bank Sampah dan perawatan infrastruktur) berdasarkan hasil evaluasi tahun ke-1 dan ke-2.',
      enabled: true,
      order: 0,
    },
    {
      id: 'pk-long-2',
      title: 'Pengembangan Ekosistem BJPhub',
      description: 'Meningkatkan fitur dan pemanfaatan BJPhub tidak hanya sebagai media komunikasi, tetapi juga sebagai sarana pemberdayaan ekonomi warga (UMKM) dan pelayanan administrasi digital mandiri.',
      enabled: true,
      order: 1,
    },
    {
      id: 'pk-long-3',
      title: 'Penyesuaian dan Revisi Program (Dinamis)',
      description: 'Melakukan penyesuaian atau perubahan rencana kerja secara dinamis untuk menjawab isu-isu lingkungan terbaru yang mendesak di masyarakat.',
      enabled: true,
      order: 2,
    },
    {
      id: 'pk-long-4',
      title: 'Sinergi Program Pemerintah Kota (Musrenbang)',
      description: 'Mengusulkan, merancang, dan mengawal program pembangunan skala besar agar terintegrasi dengan rencana pembangunan Pemerintah Kota Bekasi, khususnya melalui jalur RAPBD dan Musyawarah Perencanaan Pembangunan (Musrenbang).',
      enabled: true,
      order: 3,
    },
    {
      id: 'pk-long-5',
      title: 'Dukungan Pelaksanaan Pemilu dan Pilkada',
      description: 'Berpartisipasi aktif dalam menjaga kondusivitas, keamanan lingkungan, dan membantu kelancaran penyelenggaraan pesta demokrasi (Pemilu dan Pilkada) di tingkat warga pada tahun yang bersangkutan.',
      enabled: true,
      order: 4,
    },
  ],
};

export const DEFAULT_BANK_SAMPAH_CONFIG: BankSampahConfig = {
  enabled: true,
  logoUrl: '/images/bank%20sampah.png',
  dashboardTitle: 'Data Setoran Nasabah',
  dashboardDescription: 'Statistik dan data nasabah Bank Sampah KMS RW 011, diperbarui berkala oleh pengurus.',
  charts: [
    {
      id: 'chart-1',
      title: 'Total Nasabah Terdaftar & Potensi',
      imageUrl: 'https://docs.google.com/spreadsheets/d/1dhGmlQOr7AC-IB6q-NhOfKGlm3FjserguiPiB7MOAK8/pubchart?oid=857108362&format=image',
      enabled: true,
      order: 0,
    },
  ],
};

export const DEFAULT_DKM_MASJID_CONFIG: DkmMasjidConfig = {
  enabled: true,
  aboutText: '',
  agenda: [],
  struktur: [],
};

export const DEFAULT_FASILITAS_LINGKUNGAN_CONFIG: FasilitasLingkunganConfig = {
  enabled: true,
  pageTitle: 'Fasilitas Lingkungan',
  pageDescription:
    'Data fasilitas umum dan sarana lingkungan warga Komplek Bintara Jaya Permai (RW 11), diperbarui berkala oleh pengurus.',
  items: [],
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  logoUrl: BJP_LOGO_URL,
  siteTitle: 'BJP.hub Bintara Jaya Permai',
  siteDescription: 'Portal Resmi Ekosistem & Kegiatan Warga Komplek Bintara Jaya Permai (RW 11)',
  navbarTabs: [
    { id: 'entities', label: 'Komunitas Kegiatan', enabled: true, order: 0 },
    { id: 'rtrw', label: 'Informasi RT/RW', enabled: true, order: 1 },
    { id: 'announcements', label: 'Pengumuman & Agenda', enabled: true, order: 2 },
    { id: 'document_service', label: 'Layanan Surat Online', enabled: true, order: 3 },
    { id: 'polling', label: 'Polling & Aspirasi Warga', enabled: true, order: 4 },
  ],
  categoryConfigs: DEFAULT_CATEGORY_CONFIGS,
  mediaPartners: [
    {
      id: 'mp-1',
      name: 'Bintarajayapermai.ofc',
      logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      instagramUrl: 'https://www.instagram.com/bintarajayapermai.ofc/',
      instagramEnabled: true,
      youtubeUrl: 'https://www.youtube.com/@bintarajayapermai',
      youtubeEnabled: true,
      enabled: true,
      order: 0,
    },
    {
      id: 'mp-2',
      name: 'Masjid.alaqwam',
      logoUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=200&auto=format&fit=crop&q=80',
      instagramUrl: 'https://www.instagram.com/masjid.alaqwam/',
      instagramEnabled: true,
      youtubeUrl: 'https://www.youtube.com/@masjid.alaqwam',
      youtubeEnabled: true,
      enabled: true,
      order: 1,
    },
    {
      id: 'mp-3',
      name: 'Kamu.sejahtera',
      logoUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=200&auto=format&fit=crop&q=80',
      instagramUrl: 'https://www.instagram.com/kamu.sejahtera/',
      instagramEnabled: true,
      youtubeUrl: '',
      youtubeEnabled: false,
      enabled: true,
      order: 2,
    },
    {
      id: 'mp-4',
      name: 'Rapermata.alaqwam',
      logoUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=200&auto=format&fit=crop&q=80',
      instagramUrl: 'https://www.instagram.com/rapermata.alaqwam/',
      instagramEnabled: true,
      youtubeUrl: '',
      youtubeEnabled: false,
      enabled: true,
      order: 3,
    },
    {
      id: 'mp-5',
      name: 'Bjpladiesclub',
      logoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      instagramUrl: 'https://www.instagram.com/bjpladiesclub/',
      instagramEnabled: true,
      youtubeUrl: '',
      youtubeEnabled: false,
      enabled: true,
      order: 4,
    },
    {
      id: 'mp-6',
      name: 'Bjpbadmintonclub',
      logoUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=200&auto=format&fit=crop&q=80',
      instagramUrl: 'https://www.instagram.com/bjpbadmintonclub/',
      instagramEnabled: true,
      youtubeUrl: '',
      youtubeEnabled: false,
      enabled: true,
      order: 5,
    },
    {
      id: 'mp-7',
      name: 'Bjppadelclub',
      logoUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=200&auto=format&fit=crop&q=80',
      instagramUrl: 'https://www.instagram.com/bjp.padelclub/',
      instagramEnabled: true,
      youtubeUrl: '',
      youtubeEnabled: false,
      enabled: true,
      order: 6,
    },
  ],
  featuredVideos: [],
  featuredPhotos: [],
  documentTemplates: [
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
  ],
  pollingConfig: {
    enabled: true,
    pageTitle: 'Polling & Suara Aspirasi Warga RW 11',
    pageDescription: 'Sampaikan suara dan aspirasi Anda untuk RW 11.',
    section1: {
      id: 'sec-1',
      enabled: true,
      title: 'Survei Evaluasi & Aspirasi Fasilitas Lingkungan',
      description: 'Silakan isi formulir survei evaluasi kebersihan, keamanan, dan fasilitas bersama RW 11 Bintara Jaya Permai.',
      formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc_sample1/viewform?embedded=true',
    },
    section2: {
      id: 'sec-2',
      enabled: true,
      title: 'Polling Usulan Kegiatan Bazar & Fest Sentra UMKM',
      description: 'Sampaikan ide, saran produk, dan voting jadwal kegiatan bazar/fest bulanan warga Bintara Jaya Permai.',
      formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc_sample2/viewform?embedded=true',
    },
  },
  rtRwConfig: DEFAULT_RTRW_CONFIG,
  bankSampahConfig: DEFAULT_BANK_SAMPAH_CONFIG,
  dkmMasjidConfig: DEFAULT_DKM_MASJID_CONFIG,
  fasilitasLingkunganConfig: DEFAULT_FASILITAS_LINGKUNGAN_CONFIG,
};

// ---------------------------------------------------------------------------
// Helper: normalize legacy category names using centralized map
// ---------------------------------------------------------------------------
function normalizeCategoryName(category: string): string {
  return CATEGORY_LEGACY_MAP[category] ?? category;
}

// ---------------------------------------------------------------------------
// Helper: merge a seed/default list with what's saved in localStorage.
//
// A plain `Array.isArray(saved) ? saved : defaults` check (used before this
// helper existed) means that once a visitor's browser has ANY saved value
// for a list, new items added to the defaults later in code never reach
// them again — the saved array wins outright. This merges by id instead: an
// admin's edits to an existing default item are kept, brand-new default
// items (added in a later update) still show up, and any custom items the
// admin added themselves (ids not found in defaults) are preserved too.
// ---------------------------------------------------------------------------
function mergeListById<T extends { id: string }>(defaults: T[], saved: unknown): T[] {
  if (!Array.isArray(saved)) return defaults;
  const savedMap = new Map(saved.map((item: T) => [item.id, item]));
  const merged = defaults.map((def) => savedMap.get(def.id) || def);
  const defaultIds = new Set(defaults.map((d) => d.id));
  const customItems = saved.filter((item: T) => !defaultIds.has(item.id));
  return [...merged, ...customItems];
}

// ---------------------------------------------------------------------------
// Site Settings
// ---------------------------------------------------------------------------
export function getSiteSettings(): SiteSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SITE_SETTINGS);
    if (data) {
      const parsed = JSON.parse(data);
      const savedCategoryConfigs: CategoryHeaderConfig[] = Array.isArray(parsed.categoryConfigs)
        ? parsed.categoryConfigs
        : [];
      const mergedCategoryConfigs = DEFAULT_CATEGORY_CONFIGS.map((def) => {
        const found = savedCategoryConfigs.find((c) => c.id === def.id || c.name === def.id);
        if (found) {
          return {
            ...def,
            ...found,
            logoUrl:
              def.id === 'Sentra Usaha BJP' && !found.logoUrl ? def.logoUrl : found.logoUrl || '',
          };
        }
        return def;
      });

      // Ensure navbarTabs includes rtrw, document_service, and polling if missing
      // (site settings saved before these features existed)
      const loadedNavbarTabs = Array.isArray(parsed.navbarTabs) && parsed.navbarTabs.length > 0
        ? [...parsed.navbarTabs]
        : [...DEFAULT_SITE_SETTINGS.navbarTabs];

      if (!loadedNavbarTabs.some((t: any) => t.id === 'rtrw')) {
        loadedNavbarTabs.push({ id: 'rtrw', label: 'Informasi RT/RW', enabled: true, order: loadedNavbarTabs.length });
      }
      if (!loadedNavbarTabs.some((t: any) => t.id === 'document_service')) {
        loadedNavbarTabs.push({ id: 'document_service', label: 'Layanan Surat Online', enabled: true, order: loadedNavbarTabs.length });
      }
      if (!loadedNavbarTabs.some((t: any) => t.id === 'polling')) {
        loadedNavbarTabs.push({ id: 'polling', label: 'Polling & Aspirasi Warga', enabled: true, order: loadedNavbarTabs.length });
      }

      return {
        logoUrl: parsed.logoUrl || BJP_LOGO_URL,
        siteTitle: parsed.siteTitle || DEFAULT_SITE_SETTINGS.siteTitle,
        siteDescription: parsed.siteDescription || DEFAULT_SITE_SETTINGS.siteDescription,
        navbarTabs: loadedNavbarTabs,
        categoryConfigs: mergedCategoryConfigs,
        securitySchedules: Array.isArray(parsed.securitySchedules) ? parsed.securitySchedules : [],
        mediaPartners: mergeListById(DEFAULT_SITE_SETTINGS.mediaPartners!, parsed.mediaPartners),
        featuredVideos: mergeListById(DEFAULT_SITE_SETTINGS.featuredVideos!, parsed.featuredVideos),
        featuredPhotos: mergeListById(DEFAULT_SITE_SETTINGS.featuredPhotos!, parsed.featuredPhotos),
        documentTemplates: mergeListById(DEFAULT_SITE_SETTINGS.documentTemplates!, parsed.documentTemplates),
        pollingConfig: parsed.pollingConfig || DEFAULT_SITE_SETTINGS.pollingConfig,
        rtRwConfig: parsed.rtRwConfig
          ? {
              ...DEFAULT_RTRW_CONFIG,
              ...parsed.rtRwConfig,
              extraCards: mergeListById(DEFAULT_RTRW_CONFIG.extraCards!, parsed.rtRwConfig.extraCards),
              programKerjaShort: mergeListById(DEFAULT_RTRW_CONFIG.programKerjaShort!, parsed.rtRwConfig.programKerjaShort),
              programKerjaLong: mergeListById(DEFAULT_RTRW_CONFIG.programKerjaLong!, parsed.rtRwConfig.programKerjaLong),
            }
          : DEFAULT_RTRW_CONFIG,
        bankSampahConfig: parsed.bankSampahConfig
          ? {
              ...DEFAULT_BANK_SAMPAH_CONFIG,
              ...parsed.bankSampahConfig,
              charts: mergeListById(DEFAULT_BANK_SAMPAH_CONFIG.charts, parsed.bankSampahConfig.charts),
            }
          : DEFAULT_BANK_SAMPAH_CONFIG,
        dkmMasjidConfig: parsed.dkmMasjidConfig
          ? {
              ...DEFAULT_DKM_MASJID_CONFIG,
              ...parsed.dkmMasjidConfig,
              agenda: mergeListById(DEFAULT_DKM_MASJID_CONFIG.agenda, parsed.dkmMasjidConfig.agenda),
              struktur: mergeListById(DEFAULT_DKM_MASJID_CONFIG.struktur, parsed.dkmMasjidConfig.struktur),
            }
          : DEFAULT_DKM_MASJID_CONFIG,
        fasilitasLingkunganConfig: parsed.fasilitasLingkunganConfig
          ? {
              ...DEFAULT_FASILITAS_LINGKUNGAN_CONFIG,
              ...parsed.fasilitasLingkunganConfig,
              items: mergeListById(
                DEFAULT_FASILITAS_LINGKUNGAN_CONFIG.items,
                parsed.fasilitasLingkunganConfig.items
              ),
            }
          : DEFAULT_FASILITAS_LINGKUNGAN_CONFIG,
      };
    }
  } catch (err) {
    console.error('Failed to load site settings', err);
  }
  return DEFAULT_SITE_SETTINGS;
}

export function saveSiteSettings(settings: SiteSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SITE_SETTINGS, JSON.stringify(settings));
    updateSiteFaviconAndOgImage(settings.logoUrl);
    if (isSupabaseConfigured()) {
      saveSiteSettingsToSupabase(settings).catch((err) =>
        console.error('Supabase sync error:', err)
      );
    }
  } catch (err) {
    console.error('Failed to save site settings', err);
  }
}

// ---------------------------------------------------------------------------
// Entities
// ---------------------------------------------------------------------------
export function getEntities(): Entity[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ENTITIES);
    let list: Entity[] = INITIAL_ENTITIES;
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
        // Merge any new seed entities that may have been added after last save
        INITIAL_ENTITIES.forEach((initE) => {
          if (!list.some((item) => item.id === initE.id)) {
            list.push(initE);
          }
        });
      }
    }
    return list.map((e) => {
      const normalizedCategory = normalizeCategoryName(e.category);
      const initMatch = INITIAL_ENTITIES.find((i) => i.id === e.id);
      if (initMatch) {
        return {
          ...e,
          category: normalizedCategory,
          image: e.id === 'ent-4' || e.id === 'ent-3' ? initMatch.image : e.image,
          productPhotos:
            e.id === 'ent-4' || !e.productPhotos || e.productPhotos.length === 0
              ? initMatch.productPhotos
              : e.productPhotos,
          socials: e.socials || initMatch.socials,
        };
      }
      return { ...e, category: normalizedCategory };
    });
  } catch (err) {
    console.error('Failed to load entities from storage', err);
    return INITIAL_ENTITIES;
  }
}

export function saveEntities(entities: Entity[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ENTITIES, JSON.stringify(entities));
    if (isSupabaseConfigured()) {
      saveEntitiesToSupabase(entities).catch((err) =>
        console.error('Supabase sync error:', err)
      );
    }
  } catch (err) {
    console.error('Failed to save entities to storage', err);
  }
}

// ---------------------------------------------------------------------------
// Announcements
// ---------------------------------------------------------------------------
export function getAnnouncements(): Announcement[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    let list: Announcement[] = INITIAL_ANNOUNCEMENTS;
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
      }
    }
    return list.map((a) => ({
      ...a,
      category: normalizeCategoryName(a.category),
    }));
  } catch (err) {
    console.error('Failed to load announcements from storage', err);
    return INITIAL_ANNOUNCEMENTS;
  }
}

export function saveAnnouncements(announcements: Announcement[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
    if (isSupabaseConfigured()) {
      saveAnnouncementsToSupabase(announcements).catch((err) =>
        console.error('Supabase sync error:', err)
      );
    }
  } catch (err) {
    console.error('Failed to save announcements to storage', err);
  }
}

// ---------------------------------------------------------------------------
// Helpers: Reset & Import/Export
// ---------------------------------------------------------------------------
export function resetToDefaults(): { entities: Entity[]; announcements: Announcement[] } {
  saveEntities(INITIAL_ENTITIES);
  saveAnnouncements(INITIAL_ANNOUNCEMENTS);
  return { entities: INITIAL_ENTITIES, announcements: INITIAL_ANNOUNCEMENTS };
}

export function exportDataAsJSON(entities: Entity[], announcements: Announcement[]) {
  const exportPayload = {
    appName: 'BJP.hub - Bintara Jaya Permai',
    exportedAt: new Date().toISOString(),
    entities,
    announcements,
  };
  const jsonStr = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bjp-hub-data-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importDataFromJSON(
  jsonString: string
): { success: boolean; entities?: Entity[]; announcements?: Announcement[]; message: string } {
  try {
    const parsed = JSON.parse(jsonString);
    let newEntities: Entity[] = [];
    let newAnnouncements: Announcement[] = [];

    if (Array.isArray(parsed.entities)) {
      newEntities = parsed.entities;
    } else if (Array.isArray(parsed) && parsed[0]?.name) {
      newEntities = parsed;
    }

    if (Array.isArray(parsed.announcements)) {
      newAnnouncements = parsed.announcements;
    }

    if (newEntities.length === 0 && newAnnouncements.length === 0) {
      return { success: false, message: 'Format file JSON tidak valid atau kosong.' };
    }

    if (newEntities.length > 0) saveEntities(newEntities);
    if (newAnnouncements.length > 0) saveAnnouncements(newAnnouncements);

    return {
      success: true,
      entities: newEntities.length > 0 ? newEntities : undefined,
      announcements: newAnnouncements.length > 0 ? newAnnouncements : undefined,
      message: `Berhasil mengimpor ${newEntities.length} komunitas dan ${newAnnouncements.length} pengumuman.`,
    };
  } catch {
    return { success: false, message: 'Gagal membaca file JSON. Pastikan format file benar.' };
  }
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------
export function getUsers(): User[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure the default super admin always exists in the list
        const superAdminExists = parsed.some((u: User) => u.username === 'admin');
        if (!superAdminExists) {
          parsed.unshift(DEFAULT_USERS[0]);
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load users from storage', err);
  }
  // First load — initialize with defaults
  saveUsers(DEFAULT_USERS);
  return DEFAULT_USERS;
}

export function saveUsers(users: User[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    if (isSupabaseConfigured()) {
      saveUsersToSupabase(users).catch((err) => console.error('Supabase sync error:', err));
    }
  } catch (err) {
    console.error('Failed to save users to storage', err);
  }
}

export function getLoggedInUser(): User | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LOGGED_IN_USER);
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Failed to get logged in user', err);
  }
  return null;
}

export function saveLoggedInUser(user: User | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.LOGGED_IN_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.LOGGED_IN_USER);
    }
  } catch (err) {
    console.error('Failed to save logged in user', err);
  }
}
