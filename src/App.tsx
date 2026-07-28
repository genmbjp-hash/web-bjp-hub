import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryFilter } from './components/CategoryFilter';
import { EntityCard } from './components/EntityCard';
import { EntityDetailModal } from './components/EntityDetailModal';
import { AnnouncementsList } from './components/AnnouncementsList';
import { CMSModal } from './components/CMSModal';
import { PasswordModal } from './components/PasswordModal';
import { Footer } from './components/Footer';

import { Entity, Announcement, SiteSettings } from './types';
import { getEntities, saveEntities, getAnnouncements, saveAnnouncements, getSiteSettings, saveSiteSettings } from './utils/storage';
import { setEntityMetaTags, setAnnouncementMetaTags, resetMetaTags } from './utils/meta';
import { ShareModal } from './components/ShareModal';
import { SearchX, Plus } from 'lucide-react';

const CATEGORIES = [
  'Semua',
  'Sentra Usaha BJP',
  'Pusat Hub',
  'Administratif / Pemerintahan',
  'Keagamaan',
  'Lingkungan',
  'Kesejahteraan Keluarga',
  'Kesehatan',
  'Kepemudaan',
  'Olahraga',
];

const SECTION_CATEGORIES = [
  'Sentra Usaha BJP',
  'Pusat Hub',
  'Administratif / Pemerintahan',
  'Keagamaan',
  'Lingkungan',
  'Kesejahteraan Keluarga',
  'Kesehatan',
  'Kepemudaan',
  'Olahraga',
];

export default function App() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => getSiteSettings());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [activeTab, setActiveTab] = useState<'entities' | 'announcements'>('entities');

  const [selectedEntityForModal, setSelectedEntityForModal] = useState<Entity | null>(null);
  const [shareModalItem, setShareModalItem] = useState<{
    item: Entity | Announcement;
    type: 'entity' | 'announcement';
  } | null>(null);

  // CMS & Password Auth State
  const [isCMSOpen, setIsCMSOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAuthAuthenticated, setIsAuthAuthenticated] = useState(false);
  const [editingEntityForCMS, setEditingEntityForCMS] = useState<Entity | null>(null);
  const [pendingCategoryForCard, setPendingCategoryForCard] = useState<string | null>(null);

  // Initialize data from local storage & check URL deep link
  useEffect(() => {
    const loadedEntities = getEntities();
    const loadedAnnouncements = getAnnouncements();
    setEntities(loadedEntities);
    setAnnouncements(loadedAnnouncements);

    // Deep link check: ?entity=<id>, ?id=<id>, or ?announcement=<id>
    const params = new URLSearchParams(window.location.search);
    const entityId = params.get('entity') || params.get('id');
    const annId = params.get('announcement');

    if (entityId) {
      let found = loadedEntities.find((e) => e.id === entityId);
      if (!found) {
        // Fallback 1: match case-insensitive or by ID suffix (e.g. "4" or "ent-4")
        found = loadedEntities.find(
          (e) =>
            e.id.toLowerCase() === entityId.toLowerCase() ||
            e.id.replace('ent-', '') === entityId.replace('ent-', '')
        );
      }
      if (!found && loadedEntities.length > 0) {
        // Fallback 2: if entity ID not found in local storage, fallback to ent-4 or first entity
        found = loadedEntities.find((e) => e.id === 'ent-4') || loadedEntities[0];
      }
      if (found) {
        setSelectedEntityForModal(found);
      }
    } else if (annId) {
      const foundAnn = loadedAnnouncements.find((a) => a.id === annId);
      if (foundAnn) {
        setActiveTab('announcements');
        setAnnouncementMetaTags(foundAnn);
      }
    }
  }, []);

  // Sync URL query params and meta tags whenever selectedEntityForModal changes
  useEffect(() => {
    if (selectedEntityForModal) {
      setEntityMetaTags(selectedEntityForModal);

      const url = new URL(window.location.href);
      if (url.searchParams.get('entity') !== selectedEntityForModal.id) {
        url.searchParams.set('entity', selectedEntityForModal.id);
        window.history.pushState({ entityId: selectedEntityForModal.id }, '', url.toString());
      }
    } else {
      resetMetaTags(siteSettings.logoUrl);

      const url = new URL(window.location.href);
      if (url.searchParams.has('entity') || url.searchParams.has('id')) {
        url.searchParams.delete('entity');
        url.searchParams.delete('id');
        window.history.pushState({}, '', url.pathname + url.search);
      }
    }
  }, [selectedEntityForModal, siteSettings.logoUrl]);

  // Handle browser Back & Forward button navigation
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const entityId = params.get('entity') || params.get('id');
      if (entityId) {
        const found = entities.find((e) => e.id === entityId);
        if (found) {
          setSelectedEntityForModal(found);
          return;
        }
      }
      setSelectedEntityForModal(null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [entities]);

  const handleSaveEntities = (updated: Entity[]) => {
    setEntities(updated);
    saveEntities(updated);
  };

  const handleSaveAnnouncements = (updated: Announcement[]) => {
    setAnnouncements(updated);
    saveAnnouncements(updated);
  };

  const handleSaveSiteSettings = (updatedSettings: SiteSettings) => {
    setSiteSettings(updatedSettings);
    saveSiteSettings(updatedSettings);
    resetMetaTags(updatedSettings.logoUrl);
  };

  // CMS access handler with password check
  const handleOpenCMSWithAuth = (presetCat?: string) => {
    setPendingCategoryForCard(presetCat || null);
    if (isAuthAuthenticated) {
      setEditingEntityForCMS(null);
      setIsCMSOpen(true);
    } else {
      setIsPasswordModalOpen(true);
    }
  };

  const handleEditEntityInCMS = (ent: Entity) => {
    setEditingEntityForCMS(ent);
    setPendingCategoryForCard(null);
    if (isAuthAuthenticated) {
      setIsCMSOpen(true);
    } else {
      setIsPasswordModalOpen(true);
    }
  };

  const handlePasswordSuccess = () => {
    setIsAuthAuthenticated(true);
    setIsPasswordModalOpen(false);
    setIsCMSOpen(true);
  };

  // Filter sections to render
  const activeSections = selectedCategory === 'Semua'
    ? SECTION_CATEGORIES
    : [selectedCategory];

  // Helper to filter entities per section
  const getEntitiesForSection = (categoryName: string) => {
    return entities.filter((ent) => {
      const matchesSearch =
        ent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ent.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        ent.category.toLowerCase().includes(categoryName.toLowerCase()) ||
        categoryName.toLowerCase().includes(ent.category.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  };

  const totalFilteredCount = entities.filter((ent) => {
    const matchesSearch =
      ent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ent.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Semua' ||
      ent.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      selectedCategory.toLowerCase().includes(ent.category.toLowerCase());

    return matchesSearch && matchesCategory;
  }).length;

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans flex flex-col selection:bg-emerald-200 selection:text-emerald-900">
      {/* Header */}
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenCMS={() => handleOpenCMSWithAuth()}
        isCMSActive={isCMSOpen}
        totalEntitiesCount={entities.length}
        logoUrl={siteSettings.logoUrl}
        navbarTabs={siteSettings.navbarTabs}
      />

      {/* Main Container */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onOpenCMS={() => handleOpenCMSWithAuth()}
          totalEntities={entities.length}
          logoUrl={siteSettings.logoUrl}
        />

        {/* View Tab 1: Entitas Kegiatan */}
        {activeTab === 'entities' && (
          <div>
            {/* Category Filter Pills */}
            <CategoryFilter
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              entities={entities}
            />

            {/* Content Section - Grid Cards Per Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
              
              {/* Category Title Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold text-stone-900 tracking-tight leading-snug">
                    <span className="font-bold not-italic">{selectedCategory === 'Semua' ? 'Seluruh Entitas Warga' : selectedCategory}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                    {selectedCategory === 'Semua'
                      ? 'Daftar entitas dan kegiatan komplek Bintara Jaya Permai (RW 11)'
                      : `Menampilkan unit kegiatan dalam ${selectedCategory}`}
                  </p>
                </div>

                {searchTerm && (
                  <div className="flex items-center gap-2 bg-stone-200/70 text-stone-700 text-xs px-3 py-1.5 rounded-lg">
                    <span>Hasil pencarian: "<strong>{searchTerm}</strong>"</span>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-stone-500 hover:text-stone-900 font-bold"
                    >
                      ✕ Clear
                    </button>
                  </div>
                )}
              </div>

              {/* Grid of Sections */}
              {totalFilteredCount === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-3 max-w-lg mx-auto my-8 shadow-xs">
                  <SearchX className="w-12 h-12 text-stone-300 mx-auto" />
                  <h3 className="text-base font-bold text-stone-800">Tidak Ditemukan Entitas Kegiatan</h3>
                  <p className="text-xs text-stone-500">
                    Coba kata kunci pencarian lain atau ganti filter kategori.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('Semua');
                    }}
                    className="inline-flex items-center gap-1.5 bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl"
                  >
                    <span>Reset Filter</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {activeSections.map((sectionCat) => {
                    const sectionEntities = getEntitiesForSection(sectionCat);

                    // If user is searching and this section has no items, skip it
                    if (searchTerm && sectionEntities.length === 0) return null;

                    return (
                      <div
                        key={sectionCat}
                        className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/90 shadow-2xs space-y-5"
                      >
                        {/* Section Header */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                          <div>
                            <h3 className="text-base sm:text-xl font-bold text-stone-900 tracking-tight leading-snug">
                              <span>{sectionCat}</span>
                            </h3>
                            <p className="text-xs text-stone-500 mt-0.5">
                              Unit entitas & kegiatan warga dalam kategori {sectionCat}
                            </p>
                          </div>
                        </div>

                        {/* Cards Grid for this Section */}
                        {sectionEntities.length === 0 ? (
                          <div className="p-8 rounded-2xl border border-dashed border-stone-200 text-center bg-stone-50/50">
                            <p className="text-xs text-stone-400">Belum ada card di kategori "{sectionCat}".</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sectionEntities.map((entity) => (
                              <EntityCard
                                key={entity.id}
                                entity={entity}
                                onSelect={setSelectedEntityForModal}
                                onShare={(ent) => setShareModalItem({ item: ent, type: 'entity' })}
                                onEdit={handleEditEntityInCMS}
                                isCMSActive={true}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* View Tab 2: Pengumuman & Agenda Warga */}
        {activeTab === 'announcements' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AnnouncementsList
              announcements={announcements}
              onOpenCMS={() => handleOpenCMSWithAuth()}
              isCMSActive={true}
              onShare={(ann) => setShareModalItem({ item: ann, type: 'announcement' })}
            />
          </div>
        )}
      </main>

      {/* Entity Detail Modal */}
      <EntityDetailModal
        entity={selectedEntityForModal}
        onClose={() => setSelectedEntityForModal(null)}
        onShare={(ent) => setShareModalItem({ item: ent, type: 'entity' })}
      />

      {/* Share Modal */}
      {shareModalItem && (
        <ShareModal
          item={shareModalItem.item}
          type={shareModalItem.type}
          onClose={() => setShareModalItem(null)}
        />
      )}

      {/* Password Modal */}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={handlePasswordSuccess}
        logoUrl={siteSettings.logoUrl}
      />

      {/* CMS Modal */}
      <CMSModal
        isOpen={isCMSOpen}
        onClose={() => {
          setIsCMSOpen(false);
          setEditingEntityForCMS(null);
          setPendingCategoryForCard(null);
        }}
        entities={entities}
        onSaveEntities={handleSaveEntities}
        announcements={announcements}
        onSaveAnnouncements={handleSaveAnnouncements}
        siteSettings={siteSettings}
        onSaveSiteSettings={handleSaveSiteSettings}
        editingEntityInit={editingEntityForCMS}
        initialCategoryForNewEntity={pendingCategoryForCard}
      />

      {/* Footer */}
      <Footer
        onOpenCMS={() => handleOpenCMSWithAuth()}
        isCMSActive={isCMSOpen}
        logoUrl={siteSettings.logoUrl}
      />
    </div>
  );
}
