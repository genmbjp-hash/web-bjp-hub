import { useEffect } from 'react';
import { Entity, Announcement } from '../types';
import { setEntityMetaTags, setAnnouncementMetaTags } from '../utils/meta';

interface UseDeepLinkOptions {
  entities: Entity[];
  announcements: Announcement[];
  onEntityFound: (entity: Entity) => void;
  onAnnouncementFound: (announcement: Announcement) => void;
  onCategoryFound: (category: string) => void;
}

/**
 * Hook untuk menangani URL deep link dan sinkronisasi URL dengan state.
 * Menangani: ?entity=<id>, ?announcement=<id>, ?category=<name>
 * Juga menangani tombol Back/Forward browser melalui popstate event.
 */
export function useDeepLink({
  entities,
  announcements,
  onEntityFound,
  onAnnouncementFound,
  onCategoryFound,
}: UseDeepLinkOptions) {
  // On initial mount: parse URL and set initial state from params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const entityId = params.get('entity') || params.get('id');
    const annId = params.get('announcement');
    const categoryParam = params.get('category');

    if (categoryParam) {
      onCategoryFound(categoryParam);
    }

    if (entityId) {
      let found = entities.find((e) => e.id === entityId);
      if (!found) {
        found = entities.find(
          (e) =>
            e.id.toLowerCase() === entityId.toLowerCase() ||
            e.id.replace('ent-', '') === entityId.replace('ent-', '')
        );
      }
      // Fallback to ent-4 or first entity if not found by ID
      if (!found && entities.length > 0) {
        found = entities.find((e) => e.id === 'ent-4') || entities[0];
      }
      if (found) {
        onEntityFound(found);
      }
    } else if (annId) {
      const foundAnn = announcements.find((a) => a.id === annId);
      if (foundAnn) {
        onAnnouncementFound(foundAnn);
        setAnnouncementMetaTags(foundAnn);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally runs only on mount

  // Handle browser Back & Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const entityId = params.get('entity') || params.get('id');
      if (entityId) {
        const found = entities.find((e) => e.id === entityId);
        if (found) {
          onEntityFound(found);
          return;
        }
      }
      // No entity param → close modal
      onEntityFound(null as unknown as Entity);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [entities, onEntityFound]);

  /**
   * Updates the URL and meta tags when an entity modal is opened.
   */
  const syncEntityToUrl = (entity: Entity | null, siteLogoUrl?: string) => {
    if (entity) {
      setEntityMetaTags(entity);
      const url = new URL(window.location.href);
      if (url.searchParams.get('entity') !== entity.id) {
        url.searchParams.set('entity', entity.id);
        window.history.pushState({ entityId: entity.id }, '', url.toString());
      }
    } else {
      const { resetMetaTags } = require('../utils/meta');
      resetMetaTags(siteLogoUrl);
      const url = new URL(window.location.href);
      if (url.searchParams.has('entity') || url.searchParams.has('id')) {
        url.searchParams.delete('entity');
        url.searchParams.delete('id');
        window.history.pushState({}, '', url.pathname + url.search);
      }
    }
  };

  return { syncEntityToUrl };
}
