import React from 'react';
import { Entity, CategoryHeaderConfig } from '../types';
import { SearchX, Plus } from 'lucide-react';
import { CategoryFilter } from '../components/CategoryFilter';
import { EntityCard } from '../components/EntityCard';
import { PhotoAlbumCard } from '../components/PhotoAlbumCard';
import { SinglePageView } from '../components/SinglePageView';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';

interface KomunitasPageProps {
  entities: Entity[];
  categoryNames: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  categoryConfigs: CategoryHeaderConfig[];
  isCMSOpen: boolean;
  onSelectEntity: (entity: Entity) => void;
  onShareEntity: (entity: Entity) => void;
  onEditEntity: (entity: Entity) => void;
  onOpenCMSWithAuth: (presetCat?: string) => void;
}

export const KomunitasPage: React.FC<KomunitasPageProps> = ({
  entities,
  categoryNames,
  selectedCategory,
  onSelectCategory,
  searchTerm,
  onSearchChange,
  categoryConfigs,
  isCMSOpen,
  onSelectEntity,
  onShareEntity,
  onEditEntity,
  onOpenCMSWithAuth,
}) => {
  const getEntitiesForSectionConfig = (catConfig: CategoryHeaderConfig) =>
    entities.filter((ent) => {
      const matchesSearch = ent.name.toLowerCase().includes(searchTerm.toLowerCase());
      const eCat = ent.category.toLowerCase();
      const cId = catConfig.id.toLowerCase();
      const cName = catConfig.name.toLowerCase();
      const matchesCategory =
        eCat.includes(cId) || eCat.includes(cName) || cId.includes(eCat) || cName.includes(eCat);
      return matchesSearch && matchesCategory;
    });

  const currentConfig =
    selectedCategory === 'Semua'
      ? {
          id: 'Semua',
          name: 'Semua Komunitas',
          description: 'Seluruh unit kegiatan & komunitas warga BJP.hub',
          logoUrl: '',
        }
      : categoryConfigs.find((c) => c.name === selectedCategory || c.id === selectedCategory) || {
          id: selectedCategory,
          name: selectedCategory,
          description: `Daftar unit kegiatan dan komunitas dalam ${selectedCategory}`,
          logoUrl: '',
        };

  const displayedEntities =
    selectedCategory === 'Semua'
      ? entities.filter((e) => !searchTerm || e.name.toLowerCase().includes(searchTerm.toLowerCase()))
      : getEntitiesForSectionConfig(currentConfig);

  // Category-level layout override (Halaman Konten Tunggal)
  const layoutType = (currentConfig as CategoryHeaderConfig).layoutType;
  if (layoutType === 'single_page') {
    return (
      <div>
        <CategoryFilter
          categories={categoryNames}
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
        />
        <Container className="py-6">
          <SinglePageView categoryConfig={currentConfig as CategoryHeaderConfig} />
        </Container>
      </div>
    );
  }

  const isPhotoAlbumLayout = layoutType === 'photo_album';

  return (
    <div>
      <CategoryFilter
        categories={categoryNames}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
      />

      <Container className="py-6">
        <div className="space-y-5">
          {/* Page header row */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-lg font-black text-stone-900">{currentConfig.name}</h2>
              {currentConfig.description && (
                <p className="text-xs text-stone-500 mt-0.5">{currentConfig.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {searchTerm && (
                <span className="text-xs text-stone-500 bg-white border border-stone-200 px-3 py-1.5 rounded-xl">
                  "<strong>{searchTerm}</strong>" — {displayedEntities.length} hasil
                  <button
                    onClick={() => onSearchChange('')}
                    className="ml-2 text-stone-400 hover:text-stone-700 font-bold"
                  >✕</button>
                </span>
              )}
            </div>
          </div>

          {/* Entity Grid or Empty State */}
          {displayedEntities.length === 0 ? (
            <Card padding="none" className="p-12 text-center space-y-3 max-w-md mx-auto">
              <SearchX className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="text-sm font-bold text-stone-800">
                {searchTerm ? 'Tidak Ditemukan Komunitas' : 'Belum Ada Komunitas'}
              </h3>
              <p className="text-xs text-stone-500">
                {searchTerm
                  ? 'Coba kata kunci pencarian lain atau ganti filter kategori.'
                  : `Belum ada unit kegiatan tercatat dalam kategori "${currentConfig.name}".`}
              </p>
              <div className="flex items-center gap-2 justify-center flex-wrap">
                {searchTerm && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold px-4 py-2 rounded-xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
                  >
                    Hapus Pencarian
                  </button>
                )}
                <button
                  onClick={() =>
                    onOpenCMSWithAuth(currentConfig.id !== 'Semua' ? currentConfig.name : undefined)
                  }
                  className="inline-flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Tambah Komunitas</span>
                </button>
              </div>
            </Card>
          ) : isPhotoAlbumLayout ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedEntities.map((entity) => (
                <PhotoAlbumCard
                  key={entity.id}
                  entity={entity}
                  onSelect={onSelectEntity}
                  onShare={onShareEntity}
                  onEdit={onEditEntity}
                  isCMSAllowed={isCMSOpen}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {displayedEntities.map((entity) => (
                <EntityCard
                  key={entity.id}
                  entity={entity}
                  onSelect={onSelectEntity}
                  onShare={onShareEntity}
                  onEdit={onEditEntity}
                  isCMSActive={isCMSOpen}
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};
