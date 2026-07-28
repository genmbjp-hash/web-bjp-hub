import { Entity, Announcement } from '../types';
import { BJP_LOGO_URL } from '../assets/logo';

export const INITIAL_ENTITIES: Entity[] = [
  {
    id: 'ent-1',
    name: 'BJP HUB (Pusat Ekosistem)',
    category: 'Pusat Hub',
    description: `Titik tumpu utama (center hub) yang berfungsi sebagai pusat informasi, kolaborasi, dan koordinasi seluruh aktivitas warga. Mengintegrasikan berbagai elemen agar berjalan selaras, inklusif, dan memberikan manfaat maksimal bagi seluruh warga Komplek Bintara Jaya Permai (RW 11).

<p><strong>Fungsi Utama:</strong></p>
<ul>
  <li>Pusat informasi resmi dan pengumuman komplek</li>
  <li>Kordinasi kegiatan antar lembaga dan komunitas warga</li>
  <li>Layanan bantuan warga dan aspirasi online</li>
</ul>`,
    image: BJP_LOGO_URL,
    ctaUrl: 'https://bit.ly/bjp-hub',
    ctaWording: 'Kunjungi Portal BJP HUB',
    instagram: 'https://www.instagram.com/bintarajayapermai.ofc/',
    mediaUrl: 'https://bit.ly/bjp-hub',
    contact: '0812-3456-7890 (Sekretariat RW 11)',
    schedule: 'Setiap Hari (24 Jam Online)',
    isFeatured: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-2',
    name: 'RT RW 11 Bintara Jaya',
    category: 'Administratif / Pemerintahan',
    description: `Struktur kepengurusan administratif dan pemerintahan terkecil. Berfungsi sebagai payung hukum, pelindung kegiatan, menjaga ketertiban, keamanan, dan menjembatani program pemerintah dengan warga setempat.

<p><strong>Layanan Warga:</strong></p>
<ul>
  <li>Pengurusan surat pengantar dan administrasi kependudukan</li>
  <li>Koordinasi keamanan (Siskamling) & kebersihan lingkungan</li>
  <li>Musyawarah warga dan penyaluran aspirasi</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80',
    ctaUrl: 'https://www.instagram.com/bintarajayapermai.ofc/',
    ctaWording: 'Instagram Pengurus RW 11',
    instagram: 'https://www.instagram.com/bintarajayapermai.ofc/',
    contact: '0811-9876-5432 (Pengurus RW)',
    schedule: 'Senin - Sabtu: 08.00 - 17.00 WIB',
    isFeatured: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-3',
    name: 'DKM Al Aqwam',
    category: 'Keagamaan',
    description: `Dewan Kemakmuran Masjid (DKM) sebagai pusat kegiatan spiritual, keagamaan, dan sosial warga muslim. Mengurus ibadah rutin, kajian keagamaan, pendidikan agama anak (TPA), hingga pengelolaan ZISWAF (Zakat, Infaq, Shadaqah, dan Waqaf).

<p><strong>Program Utama:</strong></p>
<ul>
  <li>Sholat Berjamaah 5 Waktu & Sholat Jumat</li>
  <li>Kajian Rutin Mingguan & Bulanan</li>
  <li>TPA & Rumah Tahfidz untuk Anak-Anak Komplek</li>
  <li>Penyaluran Bantuan Sosial & ZISWAF Warga</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1590076175571-4b5459efb08c?auto=format&fit=crop&w=600&q=80',
    ctaUrl: 'https://www.instagram.com/masjid.alaqwam/',
    ctaWording: 'Info Kegiatan Masjid Al Aqwam',
    instagram: 'https://www.instagram.com/masjid.alaqwam/',
    contact: '0813-1122-3344 (Pengurus DKM)',
    schedule: 'Buka Setiap Hari untuk Sholat & Kajian',
    isFeatured: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-4',
    name: 'SENTRA USAHA (UMKM Hub BJP)',
    category: 'Sentra Usaha BJP',
    description: `Wadah inkubasi dan penggerak ekonomi mikro warga komplek Bintara Jaya Permai (RW 11). Memberdayakan pelaku usaha kecil rumahan dengan ruang promosi digital, penyelenggaraan bazar berkala, pelatihan pengembangan bisnis, serta perluasan jaringan pasar antar warga.

<p><strong>Fasilitas & Layanan UMKM:</strong></p>
<ul>
  <li>Katalog Produk & Kuliner Rumahan Warga Komplek</li>
  <li>Penyelenggaraan Bazar Kuliner Setiap Hari Minggu Pagi</li>
  <li>Inkubasi Branding, Kemasan, & Pemasaran Digital</li>
  <li>Gerakan Beli & Bela Produk Tetangga Komplek</li>
</ul>`,
    image: 'https://drive.google.com/file/d/1Z4dIQiY_G7kGn8eSa4tXW1stMHiedMd7/view?usp=drive_link',
    ctaUrl: 'https://instagram.com/bintarajayapermai.ofc',
    ctaWording: 'Kunjungi Katalog UMKM',
    mediaUrl: 'https://bintarajayapermai.com',
    contact: '0815-5544-3322 (Koordinator UMKM RW 11)',
    schedule: 'Bazar Rutin: Setiap Minggu Pagi (06.30 - 10.00 WIB)',
    isFeatured: true,
    socials: {
      instagram: { enabled: true, url: 'https://www.instagram.com/bintarajayapermai.ofc/' },
      facebook: { enabled: true, url: 'https://facebook.com/bintarajayapermai' },
      tiktok: { enabled: true, url: 'https://www.tiktok.com/@bintarajayapermai' },
      whatsapp: { enabled: true, url: '081555443322' },
    },
    productPhotos: [
      'https://drive.google.com/file/d/1G7GNW4_QVeMN8XyXpBuxkUJkgw6ftFKN/view?usp=drive_link',
      'https://drive.google.com/file/d/19utLAw0z97DG287tQiSx6F0Yp18EUGLX/view?usp=drive_link',
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-umkm-1',
    name: 'Dapur Selera Nusantara (UMKM Kuliner BJP)',
    category: 'Sentra Usaha BJP',
    description: `Usaha kuliner rumahan unggulan milik warga Bintara Jaya Permai (Blok B). Menyajikan aneka masakan tradisional khas Nusantara, tumpeng mini, catering harian, serta kudapan tradisional berkualitas tanpa bahan pengawet.

<p><strong>Menu & Layanan Unggulan:</strong></p>
<ul>
  <li>Nasi Liwet & Nasi Kuning Tumpeng Mini</li>
  <li>Catering Harian & Pesanan Acara Komplek</li>
  <li>Aneka Jajanan Pasar & Kue Basah Tradisional</li>
  <li>Pengiriman Bebas Ongkir Khusus Area Komplek BJP</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    ctaUrl: 'https://wa.me/6281234567890',
    ctaWording: 'Pesan via WhatsApp',
    mediaUrl: 'https://bintarajayapermai.com',
    contact: '0812-3456-7890 (Ibu Retno - Blok B3 No. 12)',
    schedule: 'Buka Setiap Hari: 07.00 - 19.00 WIB',
    isFeatured: true,
    socials: {
      instagram: { enabled: true, url: 'https://www.instagram.com/bintarajayapermai.ofc/' },
      facebook: { enabled: true, url: 'https://facebook.com/bintarajayapermai' },
      tiktok: { enabled: true, url: 'https://www.tiktok.com/@bintarajayapermai' },
      whatsapp: { enabled: true, url: '081234567890' },
    },
    productPhotos: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-5',
    name: 'Bank Sampah KMS (Karya Muda Sejahtera)',
    category: 'Lingkungan',
    description: `Pusat kepedulian lingkungan warga BJP. Mengedukasi dan memfasilitasi pemilahan sampah dari rumah tangga. Mengonversi sampah anorganik menjadi tabungan bernilai ekonomis dan aktif mengurangi volume sampah komplek ke TPA.

<p><strong>Layanan Bank Sampah:</strong></p>
<ul>
  <li>Penerimaan Sampah Plastik, Kertas, Logam, & Jelantah</li>
  <li>Pencatatan Buku Tabungan Sampah Warga</li>
  <li>Edukasi Pengolahan Kompos & Daur Ulang</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
    ctaUrl: 'https://sites.google.com/view/bsu-kamu sejahtera/home?authuser=0',
    ctaWording: 'Portal Bank Sampah KMS',
    instagram: 'https://www.instagram.com/kamu.sejahtera',
    mediaUrl: 'https://sites.google.com/view/bsu-kamu sejahtera/home?authuser=0',
    contact: '0812-9988-7766 (Admin Bank Sampah)',
    schedule: 'Setiap Sabtu Ke-2 & Ke-4 (08.00 - 11.00 WIB)',
    isFeatured: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-6',
    name: 'PKK RW 11 Bintara Jaya',
    category: 'Kesejahteraan Keluarga',
    description: `Wadah pergerakan dan pemberdayaan ibu-ibu warga komplek. Berfokus pada edukasi ketahanan keluarga, peningkatan keterampilan perempuan, program ketahanan pangan keluarga (kebun toga dan hidroponik), serta kegiatan sosial kemasyarakatan.

<p><strong>Program Kerja:</strong></p>
<ul>
  <li>Pelatihan Keterampilan & Tata Boga Ibu-ibu</li>
  <li>Pengelolaan Kebun Toga & Hydroponik Komplek</li>
  <li>Pertemuan Bulanan Rutin Arisan & POKJA PKK</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
    ctaUrl: '#',
    ctaWording: 'Daftar Program Ibu PKK',
    contact: '0813-7788-9900 (Ketua PKK RW 11)',
    schedule: 'Pertemuan Rutin: Minggu Ke-2 Setiap Bulan',
    isFeatured: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-7',
    name: 'POSYANDU & POSBINDU',
    category: 'Kesehatan',
    description: `Pusat pelayanan kesehatan dasar bagi seluruh warga Bintara Jaya Permai. Memfasilitasi pemantauan tumbuh kembang balita, pemberian imunisasi, pelayanan ibu hamil, hingga Posbindu untuk pemeriksaan berkala & skrining kesehatan lansia.

<p><strong>Layanan Rutin:</strong></p>
<ul>
  <li>Penimbangan & Penilaian Gizi Balita</li>
  <li>Pemberian Bantuan Makanan Tambahan (PMT)</li>
  <li>Cek Tekanan Darah, Gula Darah, & Kolesterol Lansia</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
    ctaUrl: '#',
    ctaWording: 'Jadwal Pemeriksaan Posyandu',
    contact: '0812-4455-6677 (Kader Kesehatan)',
    schedule: 'Posyandu Balita: Selasa Ke-1 | Posbindu: Sabtu Ke-3',
    isFeatured: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-8',
    name: 'GenM BJP',
    category: 'Kepemudaan',
    description: `Hub pergerakan anak muda (Gen Z dan Milenial) Komplek BJP. Berfokus pada kegiatan kreatif, regenerasi kepemimpinan muda, digitalisasi komunitas, penyelenggaraan kompetisi esport & olahraga, serta acara kepemudaan yang inovatif.

<p><strong>Fungsi & Layanan:</strong></p>
<ul>
  <li>Penyelenggaraan Event Pemuda & Agustusan</li>
  <li>Pengelolaan Layanan Booking GOR & Lapangan Olahraga BJP</li>
  <li>Kreativitas Konten Digital & Komunitas Pemuda</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
    ctaUrl: 'https://sites.google.com/view/bookinggorbjp/home',
    ctaWording: 'Booking Lapangan & GOR BJP',
    mediaUrl: 'https://sites.google.com/view/bookinggorbjp/home',
    contact: '0819-0011-2233 (Ketua Pemuda GenM)',
    schedule: 'Kumpul Pemuda: Sabtu Malam (Basecamp GOR)',
    isFeatured: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-9',
    name: 'PTM Permai (Persatuan Tenis Meja)',
    category: 'Olahraga',
    description: `Komunitas pingpong yang mewadahi minat dan bakat tenis meja warga komplek. Berfokus pada kesehatan fisik, kelincahan, dan menjadi ajang keakraban santai bapak-bapak, pemuda, serta pemudi di waktu luang.

<p><strong>Kegiatan:</strong></p>
<ul>
  <li>Latihan Rutin Pingpong Malam Hari</li>
  <li>Turnamen Tenis Meja Internal Antar RT</li>
  <li>Silaturahmi Santai & Kebugaran Refleks</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=600&q=80',
    ctaUrl: '#',
    ctaWording: 'Gabung Main Pingpong',
    contact: '0812-3344-5566 (Koordinator PTM)',
    schedule: 'Selasa, Kamis, & Sabtu Malam (20.00 WIB)',
    isFeatured: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-10',
    name: 'Badminton Club BJP',
    category: 'Olahraga',
    description: `Komunitas pecinta olahraga bulutangkis komplek. Wadah silaturahmi dan kebugaran fisik warga, menyelenggarakan jadwal main rutin, latihan bersama, hingga turnamen antar warga dan persahabatan antar komplek tetangga.

<p><strong>Fasilitas & Kegiatan:</strong></p>
<ul>
  <li>Jadwal Main Rutin Lapangan Badminton BJP</li>
  <li>Turnamen Bulutangkis Antar Blok</li>
  <li>Sewa Lapangan & Penyediaan Kok Bersama</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80',
    ctaUrl: 'https://www.instagram.com/bjpbadmintonclub/',
    ctaWording: 'Instagram Badminton Club',
    instagram: 'https://www.instagram.com/bjpbadmintonclub/',
    contact: '0817-6655-4433 (Kapten Badminton)',
    schedule: 'Rabu & Minggu Malam (19.30 WIB)',
    isFeatured: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-11',
    name: 'Padel Club BJP',
    category: 'Olahraga',
    description: `Komunitas olahraga padel tennis modern di komplek. Mengakomodasi warga dengan minat gaya hidup aktif dan olahraga raket alternatif yang menyenangkan. Menjadi wadah jejaring (networking) dan keakraban antar warga muda dan eksekutif.

<p><strong>Fungsi Komunitas:</strong></p>
<ul>
  <li>Main Bareng (Mabar) Padel Tennis</li>
  <li>Sesi Pengenalan & Coaching Clinic Padel Bagi Pemula</li>
  <li>Network & Social Gathering Warga Komplek</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=600&q=80',
    ctaUrl: 'https://www.instagram.com/bjp.padelclub/',
    ctaWording: 'Instagram Padel Club',
    instagram: 'https://www.instagram.com/bjp.padelclub/',
    contact: '0818-8877-6655 (Admin Padel)',
    schedule: 'Sabtu & Minggu Pagi (07.00 WIB)',
    isFeatured: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-12',
    name: 'Senam Sehat BJP',
    category: 'Olahraga',
    description: `Komunitas kebugaran massal (didominasi ibu-ibu, terbuka untuk seluruh warga). Mengadakan senam pagi/sore secara berkala (aerobik, senam jantung sehat, senam poco-poco) sebagai sarana kebugaran, refreshing, dan silaturahmi.

<p><strong>Jadwal & Link Media:</strong></p>
<ul>
  <li>Panduan Gerakan & Dokumentasi di YouTube Channel Respati Diah</li>
  <li>Senam Aerobik & Senam Jantung Sehat Bersama Instruktur</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    ctaUrl: 'https://www.youtube.com/@respatidiah8070',
    ctaWording: 'Tonton Video Senam YouTube',
    mediaUrl: 'https://www.youtube.com/@respatidiah8070',
    contact: '0812-7766-5544 (Koordinator Senam)',
    schedule: 'Setiap Hari Minggu Pagi (06.30 WIB di Lapangan Utama)',
    isFeatured: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-13',
    name: 'Jalan Sehat Komplek',
    category: 'Olahraga',
    description: `Komunitas dan kegiatan rekreasional olahraga ringan untuk seluruh usia. Fokus pada kesehatan kardio ringan sembari mengelilingi komplek Bintara Jaya Permai, menjadi sarana bonding hangat antar tetangga lintas generasi.

<p><strong>Manfaat Kegiatan:</strong></p>
<ul>
  <li>Rute Keliling Komplek 2.5 KM yang Aman & Asri</li>
  <li>Refreshing Pagi Hari Bersama Keluarga & Tetangga</li>
  <li>Sarana Silaturahmi Lintas Blok & Usia</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=80',
    ctaUrl: '#',
    ctaWording: 'Jadwal Jalan Sehat Rutin',
    contact: '0813-2211-0099 (Panitia Jalan Sehat)',
    schedule: 'Setiap Minggu Pagi (06.00 WIB Start Pos RW 11)',
    isFeatured: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Bazar Kuliner & UMKM Warga Komplek Minggu Ini',
    category: 'Sentra Usaha BJP',
    date: '27 Juli 2026',
    content: 'Diundang seluruh warga Komplek Bintara Jaya Permai (RW 11) untuk meramaikan Bazar Kuliner & Festival UMKM Warga di Lapangan Utama RW 11. Tersedia aneka makanan khas Nusantara, jajanan tradisional, kerajinan tangan, dan doorprize menarik!',
    author: 'Sentra Usaha BJP',
    ctaUrl: 'https://bit.ly/bjp-hub',
    ctaWording: 'Daftar Stand UMKM',
    isImportant: true,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'ann-2',
    title: 'Jadwal Pelayanan Posyandu Balita & Posbindu Lansia',
    category: 'Kesehatan',
    date: '1 Agustus 2026',
    content: 'Pelayanan Posyandu Balita akan diadakan hari Selasa jam 08.00 WIB. Mohon ibu-ibu membawa buku KIA balita. Dilanjutkan dengan Posbindu lansia pada Sabtu berikutnya.',
    author: 'Kader Posyandu RW 11',
    ctaUrl: '#',
    ctaWording: 'Lihat Detail Persyaratan',
    isImportant: false
  },
  {
    id: 'ann-3',
    title: 'Pendaftaran Turnamen Badminton Antar Blok 2026',
    category: 'Olahraga',
    date: '10 Agustus 2026',
    content: 'Badminton Club BJP membuka pendaftaran Turnamen Badminton Ganda Putra & Campuran Antar Blok. Pendaftaran gratis khusus warga RW 11!',
    author: 'Badminton Club BJP',
    ctaUrl: 'https://www.instagram.com/bjpbadmintonclub/',
    ctaWording: 'Daftar Tim Sekarang',
    isImportant: true
  }
];
