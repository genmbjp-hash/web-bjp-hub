import { useState, useCallback } from 'react';
import { Entity } from '../types';
import { getEntities, saveEntities } from '../utils/storage';

/**
 * Hook untuk mengelola state Entities.
 * Mengisolasi semua logika baca/tulis entity dari komponen induk.
 */
export function useEntities() {
  const [entities, setEntities] = useState<Entity[]>(() => getEntities());

  const handleSaveEntities = useCallback((updated: Entity[]) => {
    setEntities(updated);
    saveEntities(updated);
  }, []);

  return {
    entities,
    setEntities,
    saveEntities: handleSaveEntities,
  };
}
