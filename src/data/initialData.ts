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
  },
  {
    id: 'ent-hub-2',
    name: 'Sekretariat RW 11 BJP',
    category: 'Pusat Hub',
    description: `Kantor pusat administrasi dan koordinasi harian pengurus RW 11 Bintara Jaya Permai. Menjadi ruang pelayanan surat-menurut, rapat koordinasi pengurus, serta penampungan aspirasi warga.
<p><strong>Fasilitas:</strong></p>
<ul>
  <li>Ruang Rapat & Pertemuan Pengurus</li>
  <li>Layanan Administrasi Kependudukan</li>
  <li>Pusat Layanan Aspirasi & Pengaduan Warga</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    ctaUrl: 'https://bit.ly/bjp-hub',
    ctaWording: 'Hubungi Sekretariat',
    contact: '0812-1122-3344 (Sekretaris RW 11)',
    schedule: 'Senin - Sabtu (09.00 - 16.00 WIB)',
    isFeatured: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-hub-3',
    name: 'Digital Information Center BJP',
    category: 'Pusat Hub',
    description: `Pusat pengelolaan media informasi digital, pengumuman online, dan integrasi data warga komplek Bintara Jaya Permai.
<p><strong>Layanan Digital:</strong></p>
<ul>
  <li>Publikasi Pengumuman & Agenda Rutin Komplek</li>
  <li>Digitalisasi Data Entitas & Kegiatan Warga</li>
  <li>Layanan Broadcast Informasi WhatsApp Warga</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    ctaUrl: 'https://bit.ly/bjp-hub',
    ctaWording: 'Lihat Portal Informasi',
    contact: '0813-8899-0011 (Admin Digital)',
    schedule: '24 Jam Online',
    isFeatured: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-hub-4',
    name: 'Balai Kegiatan Warga BJP',
    category: 'Pusat Hub',
    description: `Gedung serbaguna fasilitas umum komplek yang digunakan untuk berbagai acara perayaan, rapat akbar warga, latihan olahraga indoor, hingga acara kebudayaan.
<p><strong>Fungsi Balai:</strong></p>
<ul>
  <li>Tempat Resepsi & Acara Syukuran Warga</li>
  <li>Musyawarah Akbar & Pemilihan Pengurus RT/RW</li>
  <li>Ruang Latihan Kesenian & Kegiatan Komunitas</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80',
    ctaUrl: 'https://bit.ly/bjp-hub',
    ctaWording: 'Reservasi Balai Warga',
    contact: '0812-7788-9900 (Pengelola Balai)',
    schedule: 'Senin - Minggu (08.00 - 22.00 WIB)',
    isFeatured: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-adm-2',
    name: 'Pos Keamanan & Siskamling RW 11',
    category: 'Administratif / Pemerintahan',
    description: `Sistem pengamanan lingkungan terpadu yang dijaga oleh tim satpam profesional dan kegiatan rondor siskamling warga demi menjaga ketertiban 24 jam di Komplek BJP.
<p><strong>Layanan Keamanan:</strong></p>
<ul>
  <li>Patroli 24 Jam Keliling Blok A - F</li>
  <li>Pemeriksaan Tamu Khusus & Portal Malam</li>
  <li>Tanggap Darurat Keamanan Lingkungan</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80',
    ctaUrl: 'tel:081198765432',
    ctaWording: 'Hubungi Pos Keamanan',
    contact: '0811-9876-5432 (Pos Utama)',
    schedule: '24 Jam Non-Stop',
    isFeatured: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-adm-3',
    name: 'Layanan Kependudukan RT 01-08',
    category: 'Administratif / Pemerintahan',
    description: `Layanan pengurusan domisili, surat keterangan RT, pencatatan warga baru, dan koordinasi kebersihan rutin di tingkat lingkungan RT komplek.
<p><strong>Layanan:</strong></p>
<ul>
  <li>Surat Pengantar Pengurusan KTP/KK/Surat Keterangan</li>
  <li>Pendataan Warga Kontrak & Pemilik Baru</li>
  <li>Pengaduan Lingkungan Tingkat RT</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
    ctaUrl: 'https://www.instagram.com/bintarajayapermai.ofc/',
    ctaWording: 'Kontak Pengurus RT',
    contact: 'Hubungi Ketua RT Masing-masing',
    schedule: 'Sesuai Jam Pelayanan Ketua RT',
    isFeatured: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-adm-4',
    name: 'Forum Komunikasi RT/RW BJP',
    category: 'Administratif / Pemerintahan',
    description: `Wadah koordinasi berkala antara Pengurus RW 11 dengan seluruh Ketua RT 01 sampai RT 08 untuk membahas program pembangunan komplek dan transparansi anggaran.
<p><strong>Fokus Forum:</strong></p>
<ul>
  <li>Rapat Pembahasan Anggaran Kebersihan & Keamanan</li>
  <li>Perencanaan Perbaikan Infrastruktur Komplek</li>
  <li>Evaluasi Kinerja & Aspirasi Warga</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=600&q=80',
    ctaUrl: 'https://www.instagram.com/bintarajayapermai.ofc/',
    ctaWording: 'Hasil Musyawarah',
    contact: '0811-9876-5432 (Pengurus Forum)',
    schedule: 'Rapat Rutin: Minggu Ke-1 Setiap Bulan',
    isFeatured: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-rel-2',
    name: 'TPA / TPQ Al Aqwam',
    category: 'Keagamaan',
    description: `Taman Pendidikan Al-Qur'an untuk anak-anak warga komplek BJP. Membina generasi muda berakhlak mulia dengan pengajaran iqro, tahfidz juz amma, serta doa harian.
<p><strong>Program Pembelajaran:</strong></p>
<ul>
  <li>Bimbingan Membaca Al-Qur'an & Tajwid</li>
  <li>Hafalan Doa Harian & Surah Pendek</li>
  <li>Praktek Ibadah Sholat Subuh & Maghrib</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=600&q=80',
    ctaUrl: 'https://www.instagram.com/masjid.alaqwam/',
    ctaWording: 'Info Pendaftaran TPA',
    contact: '0813-2233-4455 (Ust. Ahmad)',
    schedule: 'Senin - Jumat (15.30 - 17.00 WIB)',
    isFeatured: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-rel-3',
    name: 'Kajian Muslimah An-Nisa BJP',
    category: 'Keagamaan',
    description: `Majlis ta'lim khusus ibu-ibu warga komplek BJP. Menyelenggarakan kajian keislaman rutin, fardhu 'ain, fiqih wanita, serta kegiatan sosial santunan anak yatim.
<p><strong>Kegiatan Utama:</strong></p>
<ul>
  <li>Kajian Tematik Fiqih & Akhlak Muslimah</li>
  <li>Tadarus Al-Qur'an Pekanan</li>
  <li>Program Bakti Sosial & Santunan Yatim</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=600&q=80',
    ctaUrl: 'https://www.instagram.com/masjid.alaqwam/',
    ctaWording: 'Info Kajian Ibu-ibu',
    contact: '0812-9900-1122 (Hj. Fatimah)',
    schedule: 'Setiap Rabu Pagi (09.00 - 11.00 WIB)',
    isFeatured: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-rel-4',
    name: 'Remaja Islam Masjid (RISMA Al Aqwam)',
    category: 'Keagamaan',
    description: `Wadah pemuda dan remaja masjid Komplek BJP dalam menggerakkan kegiatan keagamaan, peringatan hari besar Islam (PHBI), serta bakti sosial ramadhan.
<p><strong>Program Remaja:</strong></p>
<ul>
  <li>Penyelenggaraan Panitia Ramadhan & Idul Adha</li>
  <li>Kajian Remaja & Mentoring Pemuda</li>
  <li>Rihlah & Infaq Kreatif Remaja Masjid</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=600&q=80',
    ctaUrl: 'https://www.instagram.com/masjid.alaqwam/',
    ctaWording: 'Gabung Remaja Masjid',
    contact: '0815-1122-3344 (Ketua RISMA)',
    schedule: "Sabtu Malam Ba'da Isya",
    isFeatured: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-umkm-2',
    name: 'Kopi Seduh Permai (UMKM BJP)',
    category: 'Sentra Usaha BJP',
    description: `Kedai kopi rumahan kreasi warga BJP. Menyajikan racikan kopi susu gula aren segar, manual brew, serta cemilan kentang goreng & roti bakar hangat untuk teman bersantai.
<p><strong>Menu Favorit:</strong></p>
<ul>
  <li>Kopi Susu Gula Aren Permai Signature</li>
  <li>Manual Brew V60 Beans Lokal</li>
  <li>Roti Bakar Keju Coklat & Snack Box</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    ctaUrl: 'https://wa.me/6281399887766',
    ctaWording: 'Pesan Kopi via WA',
    contact: '0813-9988-7766 (Mas Bayu - Blok C1 No. 5)',
    schedule: 'Selasa - Minggu (15.00 - 22.00 WIB)',
    isFeatured: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-umkm-3',
    name: 'Batik & Craft Rumahan BJP',
    category: 'Sentra Usaha BJP',
    description: `Kerajinan kain batik tulis, ecoprint, souvenir hampers, dan tas rajut buatan tangan karya kelompok usaha wanita Bintara Jaya Permai.
<p><strong>Produk Unggulan:</strong></p>
<ul>
  <li>Kain & Pakaian Ecoprint Motif Daun Alami</li>
  <li>Tas Rajut Handmade & Dompet Etnik</li>
  <li>Hampers Souvenir Acara & Pernikahan</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1606760227091-3dd850d492a6?auto=format&fit=crop&w=800&q=80',
    ctaUrl: 'https://wa.me/6281277665544',
    ctaWording: 'Katalog Batik & Craft',
    contact: '0812-7766-5544 (Ibu Dewi - Blok D2)',
    schedule: 'Setiap Hari (08.00 - 18.00 WIB)',
    isFeatured: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-env-2',
    name: 'Komunitas Kebun Hydroponik BJP',
    category: 'Lingkungan',
    description: `Kelompok tani kota (urban farming) warga yang memproduksi sayuran segar bebas pestisida seperti selada, pakcoy, dan kangkung hidroponik di area kebun bersama RW 11.
<p><strong>Hasil Kebun:</strong></p>
<ul>
  <li>Panen Sayur Segar Hidroponik Setiap Pekan</li>
  <li>Pelatihan Sistem Hidroponik Skala Rumah Tangga</li>
  <li>Penjualan Sayur Hemat Untuk Warga Komplek</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80',
    ctaUrl: 'https://wa.me/6281233445566',
    ctaWording: 'Pesan Sayur Segar',
    contact: '0812-3344-5566 (Pak Tri - Koordinator Kebun)',
    schedule: 'Panen Rutin: Sabtu Pagi (07.00 WIB)',
    isFeatured: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-env-3',
    name: 'Tim Pengolahan Kompos Organik',
    category: 'Lingkungan',
    description: `Gerakan pemanfaatan sampah sisa dapur dan daun kering komplek menjadi pupuk kompos berkualitas tinggi untuk menyuburkan tanaman taman warga.
<p><strong>Aktivitas:</strong></p>
<ul>
  <li>Pengumpulan Sampah Dapur Organik Warga</li>
  <li>Pembuatan Kompos Metode Takakura & Biopori</li>
  <li>Pembagian Pupuk Organik Gratis Untuk Taman RT</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80',
    ctaUrl: '#',
    ctaWording: 'Info Pengolahan Kompos',
    contact: '0813-4455-6677 (Tim Kompos)',
    schedule: 'Setiap Minggu Pagi',
    isFeatured: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-env-4',
    name: 'Gerakan Reboisasi & Pertamanan BJP',
    category: 'Lingkungan',
    description: `Komunitas pencinta tanaman hijau yang menghijaukan jalur hijau, taman bermain anak, dan penanaman pohon peneduh di sekitar jalan utama Komplek BJP.
<p><strong>Program Reboisasi:</strong></p>
<ul>
  <li>Penanaman Pohon Peneduh & Tabebuya Komplek</li>
  <li>Perawatan Taman Bermain & Fasilitas Hijau RW</li>
  <li>Bibit Tanaman Gratis Untuk Penghijauan Rumah</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80',
    ctaUrl: '#',
    ctaWording: 'Ikut Kerja Bakti Taman',
    contact: '0811-2233-4455 (Koordinator Penghijauan)',
    schedule: 'Kerja Bakti: Minggu Ke-3 Setiap Bulan',
    isFeatured: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-fml-2',
    name: 'Koperasi Wanita Bina Sejahtera',
    category: 'Kesejahteraan Keluarga',
    description: `Koperasi simpan pinjam dan usaha mandiri milik ibu-ibu warga BJP untuk memperkuat ekonomi keluarga serta mendukung permodalan usaha kecil warga.
<p><strong>Layanan Koperasi:</strong></p>
<ul>
  <li>Tabungan Koperasi & Simpanan Rutin Warga</li>
  <li>Pinjaman Usaha Mikro Syariah Tanpa Riba</li>
  <li>Penyediaan Sembako Harga Terjangkau</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1556742049-0a670fc80799?auto=format&fit=crop&w=600&q=80',
    ctaUrl: '#',
    ctaWording: 'Info Koperasi Warga',
    contact: '0813-1122-3344 (Pengurus Koperasi)',
    schedule: 'Senin - Jumat (09.00 - 15.00 WIB)',
    isFeatured: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-fml-3',
    name: 'Dapur Sehat Gizi Anak & Balita',
    category: 'Kesejahteraan Keluarga',
    description: `Program pemberian makanan tambahan (PMT) pemulihan gizi balita dan penyuluhan pola makan sehat keluarga bekerja sama dengan Posyandu RW 11.
<p><strong>Program Gizi:</strong></p>
<ul>
  <li>Menu PMT Olahan Ikan & Telur Tinggi Protein</li>
  <li>Konsultasi Gizi & Cegah Stunting Pada Anak</li>
  <li>Demonstrasi Masak Sehat Ibu-ibu PKK</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80',
    ctaUrl: '#',
    ctaWording: 'Info Program Gizi',
    contact: '0812-8899-0011 (Kader Gizi)',
    schedule: 'Jadwal Bersamaan Dengan Posyandu',
    isFeatured: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-fml-4',
    name: 'Rumah Pintar & Bimbingan Belajar',
    category: 'Kesejahteraan Keluarga',
    description: `Fasilitas belajar bersama dan bimbingan pr-sekolah serta matematika dasar gratis untuk anak-anak komplek yang diasuh oleh sukarelawan ibu-ibu pengajar.
<p><strong>Program Bimbel:</strong></p>
<ul>
  <li>Bantuan Belajar Tugas Sekolah (PR) SD & SMP</li>
  <li>Taman Bacaan Anak & Perpustakaan Mini</li>
  <li>Kelas Bahasa Inggris Dasar & Sains Ceria</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80',
    ctaUrl: '#',
    ctaWording: 'Daftar Rumah Pintar',
    contact: '0815-6677-8899 (Pengelola Rumah Pintar)',
    schedule: 'Selasa & Kamis (16.00 - 17.30 WIB)',
    isFeatured: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-hlt-2',
    name: 'Layanan Ambulans Siaga Warga',
    category: 'Kesehatan',
    description: `Armada mobil ambulans siaga 24 jam milik komplek BJP yang siap melayani kebutuhan antar-jemput darurat medis warga ke RS terdekat.
<p><strong>Layanan Ambulans:</strong></p>
<ul>
  <li>Antar Jemput Pasien Emergency 24 Jam</li>
  <li>Fasilitas Tabung Oksigen & Tandu Medis</li>
  <li>Driver Siaga On-Call Khusus Warga BJP</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=600&q=80',
    ctaUrl: 'tel:081244556677',
    ctaWording: 'Call Emergency Ambulans',
    contact: '0812-4455-6677 (Call Center Medis)',
    schedule: '24 Jam Standby Darurat',
    isFeatured: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-hlt-3',
    name: 'Posyandu Lansia Budi Sehat',
    category: 'Kesehatan',
    description: `Pelayanan kesehatan khusus lansia warga komplek meliputi cek tensi, gula darah, asam urat, serta senam pencegahan osteoporosis.
<p><strong>Layanan Lansia:</strong></p>
<ul>
  <li>Skrining Kesehatan Rutin & Cek Darah Ringan</li>
  <li>Konsultasi Kesehatan & Konsumsi Obat Rutin</li>
  <li>Senam Bugar Lansia & Pembagian Vitamin</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
    ctaUrl: '#',
    ctaWording: 'Jadwal Posyandu Lansia',
    contact: '0813-7766-5544 (Kader Lansia)',
    schedule: 'Setiap Sabtu Ke-3 (08.00 - 11.00 WIB)',
    isFeatured: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-hlt-4',
    name: 'Tim P3K & Tanggap Darurat Warga',
    category: 'Kesehatan',
    description: `Kelompok relawan medis warga yang dibekali ketrampilan pertolongan pertama pada kecelakaan (P3K) dan evakuasi awal bencana di lingkungan RW 11.
<p><strong>Fungsi Tim:</strong></p>
<ul>
  <li>Pertolongan Pertama Kejadian Darurat Lingkungan</li>
  <li>Pendampingan Kesehatan Event & Olahraga Warga</li>
  <li>Penyediaan Tabung Oksigen & Alat P3K Terpadu</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
    ctaUrl: '#',
    ctaWording: 'Kontak Tim P3K',
    contact: '0812-9900-8877 (Koordinator P3K)',
    schedule: '24 Jam Siaga Bencana',
    isFeatured: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-ydh-2',
    name: 'Karang Taruna RW 11',
    category: 'Kepemudaan',
    description: `Organisasi kepemudaan resmi tingkat RW yang menjadi pilar pergerakan sosial, perlombaan kemerdekaan RI, serta kepedulian lingkungan anak muda.
<p><strong>Program Karang Taruna:</strong></p>
<ul>
  <li>Panitia Peringatan HUT RI 17 Agustus Komplek</li>
  <li>Aksi Sosial Pemuda & Donor Darah Warga</li>
  <li>Kreativitas Pemuda & Pelatihan Digital Skill</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80',
    ctaUrl: 'https://www.instagram.com/bintarajayapermai.ofc/',
    ctaWording: 'Instagram Karang Taruna',
    contact: '0819-1122-3344 (Ketua Katar)',
    schedule: 'Rapat Rutin: Minggu Ke-4 Malam',
    isFeatured: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-ydh-3',
    name: 'Esports & Gaming Community BJP',
    category: 'Kepemudaan',
    description: `Wadah komunitas gaming positif anak muda komplek untuk mengasah bakat esport Mobile Legends, PUBG Mobile, dan FIFA secara sportif.
<p><strong>Aktivitas:</strong></p>
<ul>
  <li>Turnamen Online Mobile Legends Antar RT</li>
  <li>Nobar Final Turnamen Esport Nasional</li>
  <li>Edukasi Time Management & Digital Literacy</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
    ctaUrl: 'https://www.instagram.com/bintarajayapermai.ofc/',
    ctaWording: 'Gabung Komunitas Esport',
    contact: '0818-7766-5544 (Kapten Esport)',
    schedule: 'Mabar Rutin: Jumat Malam (20.00 WIB)',
    isFeatured: false,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ent-ydh-4',
    name: 'Sanggar Seni & Musik Pemuda',
    category: 'Kepemudaan',
    description: `Kelompok minat seni musik, akustik, tari tradisional, dan teater kreasi muda-mudi komplek Bintara Jaya Permai.
<p><strong>Aktivitas Seni:</strong></p>
<ul>
  <li>Latihan Band & Akustik Malam Minggu</li>
  <li>Pengisi Acara Pentas Seni Kemerdekaan Komplek</li>
  <li>Workshop Fotografi & Videografi Smartphone</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    ctaUrl: '#',
    ctaWording: 'Gabung Sanggar Seni',
    contact: '0817-5544-3322 (Koordinator Seni)',
    schedule: 'Sabtu Sore (16.00 WIB di Balai Warga)',
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
