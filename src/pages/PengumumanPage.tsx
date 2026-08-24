import React from 'react';
import { Announcement } from '../types';
import { AnnouncementsList } from '../components/AnnouncementsList';
import { Container } from '../components/ui/Container';

interface PengumumanPageProps {
  announcements: Announcement[];
  onOpenCMS: () => void;
  isCMSActive: boolean;
  onShare: (ann: Announcement) => void;
  onBack: () => void;
}

export const PengumumanPage: React.FC<PengumumanPageProps> = ({
  announcements,
  onOpenCMS,
  isCMSActive,
  onShare,
  onBack,
}) => (
  <Container className="py-8">
    <AnnouncementsList
      announcements={announcements}
      onOpenCMS={onOpenCMS}
      isCMSActive={isCMSActive}
      onShare={onShare}
      onBack={onBack}
    />
  </Container>
);
