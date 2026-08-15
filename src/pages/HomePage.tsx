import React from 'react';
import { Entity, Announcement, SiteSettings } from '../types';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

import { HeroBanner } from '../components/home/HeroBanner';
import { KanalSlider } from '../components/home/KanalSlider';
import { EntitySlider } from '../components/home/EntitySlider';
import { CommunityLogos } from '../components/home/CommunityLogos';
import { PengumumanSection } from '../components/home/PengumumanSection';
import { AlbumFoto } from '../components/home/AlbumFoto';
import { AlbumVideo } from '../components/home/AlbumVideo';
import { GoogleMapSection } from '../components/home/GoogleMapSection';
import { SocialMediaSection } from '../components/home/SocialMediaSection';

interface HomePageProps {
  entities: Entity[];
  announcements: Announcement[];
  siteSettings: SiteSettings;
  onSelectEntity: (entity: Entity) => void;
  onSelectCategory: (category: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  entities,
  announcements,
  siteSettings,
  onSelectEntity,
  onSelectCategory,
}) => {
  const navigate = useNavigate();

  const handleExplore = () => {
    // Scroll down to kanal slider when CTA is clicked
    document.getElementById('kanal-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSwitchToEntities = () => navigate('/komunitas');
  const handleSwitchToAnnouncements = () => navigate('/pengumuman');

  return (
    <div className="min-h-screen flex flex-col">

      {/* 1. Hero Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <HeroBanner
          siteTitle={siteSettings.siteTitle}
          siteDescription={siteSettings.siteDescription}
          onExplore={handleExplore}
        />
      </motion.div>

      {/* Section Wrapper for Kanal & Entity Slider */}
      <div className="bg-white relative border-b border-stone-200/50">

        {/* 2. Kanal Slider */}
        <motion.div
          id="kanal-section"
          className="pt-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <KanalSlider
            onSelectCategory={onSelectCategory}
            onSwitchToEntities={handleSwitchToEntities}
          />
        </motion.div>

        {/* 2.5 Community Logos */}
        <CommunityLogos />

        {/* 3. Entity Slider (Featured) */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          <EntitySlider
            entities={entities}
            onSelectEntity={onSelectEntity}
            onSwitchToEntities={handleSwitchToEntities}
          />
        </motion.div>
      </div>

      {/* 4. Pengumuman & Agenda */}
      <div className="bg-white">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <PengumumanSection
            announcements={announcements}
            onViewAll={handleSwitchToAnnouncements}
          />
        </motion.div>
      </div>

      {/* Divider */}
      <div className="h-px bg-stone-200 w-full" />

      {/* 5. Album Foto */}
      <div className="bg-stone-950">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <AlbumFoto entities={entities} />
        </motion.div>
      </div>

      {/* 6. Album Video */}
      <div className="bg-stone-950 border-t border-stone-800">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <AlbumVideo entities={entities} />
        </motion.div>
      </div>

      {/* 7. Google Map */}
      <div className="bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <GoogleMapSection />
        </motion.div>
      </div>

      {/* 8. Media Sosial */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <SocialMediaSection mediaPartners={siteSettings.mediaPartners} />
      </motion.div>

    </div>
  );
};
