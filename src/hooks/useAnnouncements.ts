import { useState, useCallback } from 'react';
import { Announcement } from '../types';
import { getAnnouncements, saveAnnouncements } from '../utils/storage';

/**
 * Hook untuk mengelola state Announcements.
 * Mengisolasi semua logika baca/tulis pengumuman dari komponen induk.
 */
export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => getAnnouncements());

  const handleSaveAnnouncements = useCallback((updated: Announcement[]) => {
    setAnnouncements(updated);
    saveAnnouncements(updated);
  }, []);

  return {
    announcements,
    setAnnouncements,
    saveAnnouncements: handleSaveAnnouncements,
  };
}
