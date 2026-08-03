import React from 'react';
import { motion } from 'motion/react';

const LOGOS = [
  { name: 'PKK RW 11', src: '/images/pkk_rw11.png' },
  { name: 'Posyandu', src: '/images/posyandu.png' },
  { name: 'DKM Masjid', src: '/images/dkm_masjid.png' },
  { name: 'GenM BJP', src: '/images/genm_bjp.png' },
  { name: 'Bank Sampah', src: '/images/bank%20sampah.png' },
  { name: 'PTM Permai', src: '/images/ptm_permai.png' },
  { name: 'Badminton Club', src: '/images/badminton_club.png' },
  { name: 'Senam Sehat', src: '/images/senam_sehat.png' },
  { name: 'Sentra Usaha', src: '/images/sentra_usaha.png' },
  { name: 'Padel Club', src: '/images/padel_club.png' },
];

export const CommunityLogos: React.FC = () => {
  return (
    <section className="bg-white py-12 border-b border-stone-200/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center mb-10"
        >
          <img
            src="/images/logo_rw_011.png"
            alt="RW 011 Logo"
            className="h-28 sm:h-36 md:h-40 object-contain drop-shadow-md mb-4"
          />
          <h2 className="text-xl sm:text-2xl font-black text-stone-800">
            Sinergi Komunitas & Lembaga RW 11
          </h2>
          <p className="text-sm text-stone-500 mt-2 max-w-lg mx-auto">
            Didukung penuh oleh berbagai lembaga dan komunitas penggerak kemajuan warga Bintara Jaya Permai.
          </p>
        </motion.div>

        {/* Other Logos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="flex flex-wrap justify-center items-center gap-10 sm:gap-14 md:gap-16"
        >
          {LOGOS.map((logo, idx) => (
            <div key={idx} className="group flex flex-col items-center justify-center">
              <img
                src={logo.src}
                alt={logo.name}
                className="h-16 sm:h-20 md:h-24 object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
                title={logo.name}
              />
              <span className="mt-3 text-[10px] sm:text-xs font-semibold text-stone-600 group-hover:text-emerald-700 transition-colors">
                {logo.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
