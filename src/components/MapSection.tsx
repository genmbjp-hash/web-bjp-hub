import React from 'react';
import { MapPin, Navigation, Phone, ExternalLink } from 'lucide-react';

export const MapSection: React.FC = () => {
  return (
    <section className="my-8 bg-white rounded-3xl p-4 sm:p-6 shadow-md border border-stone-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-xs font-bold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>Peta Wilayah & Sekretariat RW 11</span>
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-stone-900 tracking-tight">
            Lokasi Komplek Bintara Jaya Permai
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Sekretariat RW 11, Bintara Jaya Permai, Kelurahan Bintara Jaya, Bekasi Barat, 17136
          </p>
        </div>

        <a
          href="https://maps.google.com/?q=Sekretariat+RW+11+Bintara+Jaya+Permai+Bekasi"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm shrink-0"
        >
          <Navigation className="w-4 h-4" />
          <span>Buka Petunjuk Arah</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-inner bg-stone-100">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d991.5380973945194!2d106.94495669253608!3d-6.2436387867826175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698cef8c3f3f39%3A0x710c8fbf641b2687!2sQW4W%2BH9W%2C%20RT.008%2FRW.011%2C%20Bintara%20Jaya%2C%20Bekasi%20Barat%2C%20Bekasi%2C%20West%20Java%2017136!5e0!3m2!1sen!2sid!4v1785915486182!5m2!1sen!2sid"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          title="Peta Lokasi Sekretariat RW 11 Bintara Jaya Permai"
          className="w-full h-[360px] sm:h-[420px] rounded-2xl"
        ></iframe>
      </div>

      <div className="mt-4 pt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-stone-600 bg-stone-50 p-3.5 rounded-xl border border-stone-200/80">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
          <span><strong>Alamat Sekretariat:</strong> RT.008/RW.011, Kel. Bintara Jaya, Kec. Bekasi Barat, Kota Bekasi, Jawa Barat 17136</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
          <span><strong>Telepon / Pengaduan Redaksi:</strong> <a href="tel:08128199144" className="text-emerald-700 font-bold hover:underline">08128199144</a></span>
        </div>
      </div>
    </section>
  );
};
