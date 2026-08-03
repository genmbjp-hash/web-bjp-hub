import React from 'react';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';

// Coordinates for Sekretariat RW 11 Bintara Jaya Permai, Bekasi
const MAP_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.1735112834986!2d106.94609559999999!3d-6.2408491999999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698d8d1d7d1e03%3A0x60362f185ca0f18e!2sBintara%20Jaya%20Permai!5e0!3m2!1sid!2sid!4v1785668207456!5m2!1sid!2sid';

const GMAPS_LINK =
  'https://maps.app.goo.gl/8Lknw55ZAjLDoZbEA';

export const GoogleMapSection: React.FC = () => {
  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
          <div>
            <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-700" />
              Lokasi Sekretariat BJP HUB
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Komplek Bintara Jaya Permai, Bintara, Bekasi Barat, Jawa Barat 17134
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href={GMAPS_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              Buka Google Maps
            </a>
          </div>
        </div>

        {/* Map Embed */}
        <div className="rounded-3xl overflow-hidden shadow-xl border border-stone-200">
          <iframe
            src={MAP_EMBED_URL}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi Sekretariat RW 11 Bintara Jaya Permai"
            className="block"
          />
        </div>

        {/* Info Row */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Alamat', value: 'Komplek Bintara Jaya Permai, RW 11' },
            { label: 'Kelurahan / Kecamatan', value: 'Bintara, Bekasi Barat' },
            { label: 'Kota / Provinsi', value: 'Kota Bekasi, Jawa Barat 17134' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-stone-50 border border-stone-200 rounded-2xl p-4">
              <p className="text-[11px] text-stone-400 font-medium uppercase tracking-wide mb-1">{label}</p>
              <p className="text-sm font-semibold text-stone-800">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
