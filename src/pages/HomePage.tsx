import React from 'react';
import { Entity, Announcement, SiteSettings, CategoryHeaderConfig } from '../types';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Section } from '../components/ui/Section';

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
  categoryConfigs: CategoryHeaderConfig[];
}

export const HomePage: React.FC<HomePageProps> = ({
  entities,
  announcements,
  siteSettings,
  onSelectEntity,
  onSelectCategory,
  categoryConfigs,
}) => {
  const navigate = useNavigate();

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
          totalEntities={entities.length}
          totalAnnouncements={announcements.length}
        />
      </motion.div>

      {/* Section Wrapper for Kanal Slider */}
      <div className="bg-white relative">

        {/* 2. Kanal Slider */}
        <Section id="kanal-section" className="pt-10">
          <KanalSlider
            categoryConfigs={categoryConfigs}
            onSelectCategory={onSelectCategory}
            onSwitchToEntities={handleSwitchToEntities}
          />
        </Section>

        {/* 2.5 Community Logos */}
        <CommunityLogos />
      </div>

      {/* 3. Album Foto */}
      <div className="bg-stone-950">
        <Section>
          <AlbumFoto entities={entities} featuredPhotos={siteSettings.featuredPhotos} />
        </Section>
      </div>

      {/* 4. Album Video (renders nothing if no video is enabled in CMS > Video Kegiatan) */}
      <Section>
        <AlbumVideo videos={siteSettings.featuredVideos || []} />
      </Section>

      {/* 5. Entity Slider (Sorotan Komunitas) */}
      <div className="bg-white relative border-b border-stone-200/50">
        <Section className="pt-10" delay={0.1}>
          <EntitySlider
            entities={entities}
            onSelectEntity={onSelectEntity}
            onSwitchToEntities={handleSwitchToEntities}
          />
        </Section>
      </div>

      {/* 6. Pengumuman & Agenda */}
      <div className="bg-white">
        <Section>
          <PengumumanSection
            announcements={announcements}
            onViewAll={handleSwitchToAnnouncements}
          />
        </Section>
      </div>

      {/* Divider */}
      <div className="h-px bg-stone-200 w-full" />

      {/* 7. Google Map */}
      <div className="bg-white">
        <Section>
          <GoogleMapSection />
        </Section>
      </div>

      {/* 8. Media Sosial */}
      <Section>
        <SocialMediaSection mediaPartners={siteSettings.mediaPartners} />
      </Section>

    </div>
  );
};
