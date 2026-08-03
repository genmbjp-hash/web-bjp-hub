import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomePageHeader } from './components/HomePageHeader';
import { CategoryPageHeader } from './components/CategoryPageHeader';
import { CategoryCarousel } from './components/CategoryCarousel';
import { CategoryFilter } from './components/CategoryFilter';
import { EntityCard } from './components/EntityCard';
import { PhotoAlbumCard } from './components/PhotoAlbumCard';
import { SinglePageView } from './components/SinglePageView';
import { RtRwView } from './components/RtRwView';
import { SocialFeedsSection } from './components/SocialFeedsSection';
import { DocumentGeneratorPage } from './components/DocumentGeneratorPage';
import { PollingPage } from './components/PollingPage';
import { EntityDetailModal } from './components/EntityDetailModal';
import { AnnouncementsList } from './components/AnnouncementsList';
import { CMSModal } from './components/CMSModal';
import { PasswordModal } from './components/PasswordModal';
import { Footer } from './components/Footer';

import { Entity, Announcement, SiteSettings, CategoryHeaderConfig, User } from './types';
import {
  getEntities, saveEntities,
  getAnnouncements, saveAnnouncements,
  getSiteSettings, saveSiteSettings,
  getUsers, saveUsers,
  getLoggedInUser, saveLoggedInUser,
  DEFAULT_CATEGORY_CONFIGS,
  DEFAULT_RTRW_CONFIG
} from './utils/storage';
import { setEntityMetaTags, setAnnouncementMetaTags, resetMetaTags } from './utils/meta';
import { ShareModal } from './components/ShareModal';
import { SearchX, Plus } from 'lucide-react';

export default function App() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => getSiteSettings());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [activeTab, setActiveTab] = useState<'entities' | 'announcements' | 'document_service' | string>('entities');

  const [selectedEntityForModal, setSelectedEntityForModal] = useState<Entity | null>(null);
  const [shareModalItem, setShareModalItem] = useState<{
    item: Entity | Announcement;
    type: 'entity' | 'announcement';
  } | null>(null);

  // User Management & Login Auth State
  const [users, setUsers] = useState<User[]>(() => getUsers());
  const [currentUser, setCurrentUser] = useState<User | null>(() => getLoggedInUser());
  const [isCMSOpen, setIsCMSOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAuthAuthenticated, setIsAuthAuthenticated] = useState<boolean>(() => Boolean(getLoggedInUser()));
  const [editingEntityForCMS, setEditingEntityForCMS] = useState<Entity | null>(null);
  const [pendingCategoryForCard, setPendingCategoryForCard] = useState<string | null>(null);

  // Initialize data from local storage & check URL deep link
  useEffect(() => {
    const loadedEntities = getEntities();
    const loadedAnnouncements = getAnnouncements();
    setEntities(loadedEntities);
    setAnnouncements(loadedAnnouncements);

    // Deep link check: ?entity=<id>, ?category=<name>, or ?announcement=<id>
    const params = new URLSearchParams(window.location.search);
    const entityId = params.get('entity') || params.get('id');
    const annId = params.get('announcement');
    const categoryParam = params.get('category');

    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }

    if (entityId) {
      let found = loadedEntities.find((e) => e.id === entityId);
      if (!found) {
        found = loadedEntities.find(
          (e) =>
            e.id.toLowerCase() === entityId.toLowerCase() ||
            e.id.replace('ent-', '') === entityId.replace('ent-', '')
        );
      }
      if (!found && loadedEntities.length > 0) {
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

  const handleSaveUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    saveUsers(updatedUsers);

    if (currentUser) {
      const updatedSelf = updatedUsers.find((u) => u.id === currentUser.id);
      if (updatedSelf) {
        setCurrentUser(updatedSelf);
        saveLoggedInUser(updatedSelf);
      }
    }
  };

  // CMS access handler with authentication check
  const handleOpenCMSWithAuth = (presetCat?: string) => {
    setPendingCategoryForCard(presetCat || null);
    if (isAuthAuthenticated && currentUser) {
      setEditingEntityForCMS(null);
      setIsCMSOpen(true);
    } else {
      setIsPasswordModalOpen(true);
    }
  };

  const handleEditEntityInCMS = (ent: Entity) => {
    setEditingEntityForCMS(ent);
    setPendingCategoryForCard(null);
    if (isAuthAuthenticated && currentUser) {
      setIsCMSOpen(true);
    } else {
      setIsPasswordModalOpen(true);
    }
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    saveLoggedInUser(user);
    setIsAuthAuthenticated(true);
    setIsPasswordModalOpen(false);
    setIsCMSOpen(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    saveLoggedInUser(null);
    setIsAuthAuthenticated(false);
    setIsCMSOpen(false);
  };

  // Filter sections & category configs
  const categoryConfigs = siteSettings.categoryConfigs || DEFAULT_CATEGORY_CONFIGS;
  const categoryNames = ['Semua', ...categoryConfigs.map((c) => c.name)];

  // Helper to filter entities per section config
  const getEntitiesForSectionConfig = (catConfig: CategoryHeaderConfig) => {
    return entities.filter((ent) => {
      const matchesSearch =
        ent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ent.category.toLowerCase().includes(searchTerm.toLowerCase());

      const eCat = ent.category.toLowerCase();
      const cId = catConfig.id.toLowerCase();
      const cName = catConfig.name.toLowerCase();

      const matchesCategory =
        eCat.includes(cId) ||
        eCat.includes(cName) ||
        cId.includes(eCat) ||
        cName.includes(eCat);

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
      categoryConfigs.some((c) => {
        if (c.name !== selectedCategory && c.id !== selectedCategory) return false;
        const eCat = ent.category.toLowerCase();
        return (
          eCat.includes(c.id.toLowerCase()) ||
          eCat.includes(c.name.toLowerCase()) ||
          c.id.toLowerCase().includes(eCat) ||
          c.name.toLowerCase().includes(eCat)
        );
      });

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
        runningTextConfig={siteSettings.runningText}
      />

      {/* Main Container */}
      <main className="flex-1">
        {/* View Tab 1: Entitas Kegiatan (Home Page vs Entitas Category View) */}
        {activeTab === 'entities' && (
          <div>
            {/* Category Filter Pills (Tab Semua -> Home Page) */}
            <CategoryFilter
              categories={categoryNames}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              entities={entities}
              categoryConfigs={categoryConfigs}
            />

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {/* 1. HOME PAGE VIEW (When selectedCategory is 'Semua') */}
              {selectedCategory === 'Semua' || selectedCategory === 'Home Page' ? (
                <div className="space-y-8">
                  {/* Home Page Header */}
                  <HomePageHeader
                    siteTitle={siteSettings.siteTitle}
                    siteDescription={siteSettings.siteDescription}
                    logoUrl={siteSettings.logoUrl}
                    totalEntities={entities.length}
                  />

                  {/* Homepage Feeds Embed Section (YouTube & Instagram Feeds) */}
                  <SocialFeedsSection feeds={siteSettings.socialFeeds} />

                  {/* If user typed a search term on Homepage, show matching Entity Cards */}
                  {searchTerm ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                        <div className="text-xs sm:text-sm text-stone-700 font-medium">
                          Hasil pencarian untuk kata kunci: "<strong>{searchTerm}</strong>" ({totalFilteredCount} entitas)
                        </div>
                        <button
                          onClick={() => setSearchTerm('')}
                          className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                        >
                          ✕ Clear Search
                        </button>
                      </div>

                      {totalFilteredCount === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-3 max-w-lg mx-auto shadow-xs">
                          <SearchX className="w-12 h-12 text-stone-300 mx-auto" />
                          <h3 className="text-base font-bold text-stone-800">
                            Tidak Ditemukan Entitas Kegiatan
                          </h3>
                          <p className="text-xs text-stone-500">
                            Coba kata kunci pencarian lain atau ganti filter kategori.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {entities
                            .filter((ent) => {
                              const matchesSearch =
                                ent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                ent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                ent.category.toLowerCase().includes(searchTerm.toLowerCase());
                              return matchesSearch;
                            })
                            .map((entity) => (
                              <EntityCard
                                key={entity.id}
                                entity={entity}
                                onSelect={setSelectedEntityForModal}
                                onShare={(ent) =>
                                  setShareModalItem({ item: ent, type: 'entity' })
                                }
                                onEdit={handleEditEntityInCMS}
                                isCMSActive={true}
                              />
                            ))}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              ) : (
                /* 2. PER ENTITY CATEGORY PAGE VIEW (Supports Default, Photo Album, & Single Page Layouts) */
                <div className="space-y-6">
                  {(() => {
                    const currentConfig =
                      categoryConfigs.find(
                        (c) => c.name === selectedCategory || c.id === selectedCategory
                      ) || {
                        id: selectedCategory,
                        name: selectedCategory,
                        description: `Daftar unit kegiatan dan entitas dalam ${selectedCategory}`,
                        logoUrl: '',
                        layoutType: 'default',
                      };

                    const categoryEntities = getEntitiesForSectionConfig(currentConfig);
                    const layoutType = currentConfig.layoutType || 'default';

                    return (
                      <>
                        {/* Header Per Entitas Page with Seamless Share CTA */}
                        <CategoryPageHeader
                          catConfig={currentConfig}
                          entities={entities}
                          onBackToHome={() => setSelectedCategory('Semua')}
                        />

                        {/* Search Term Bar if Active */}
                        {searchTerm && (
                          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200">
                            <span className="text-xs text-stone-600">
                              Kata kunci: "<strong>{searchTerm}</strong>" ({categoryEntities.length} ditemukan)
                            </span>
                            <button
                              onClick={() => setSearchTerm('')}
                              className="text-xs text-stone-500 hover:text-stone-900 font-bold"
                            >
                              ✕ Hapus Filter
                            </button>
                          </div>
                        )}

                        {/* Layout Switch Rendering */}
                        {currentConfig.name === 'Informasi RT/RW' || selectedCategory === 'Informasi RT/RW' ? (
                          <RtRwView
                            config={siteSettings.rtRwConfig || DEFAULT_RTRW_CONFIG}
                            onBack={() => setSelectedCategory('Semua')}
                            onOpenCMS={() => handleOpenCMSWithAuth()}
                          />
                        ) : layoutType === 'single_page' ? (
                          /* LAYOUT TYPE 3: SINGLE PAGE VIEW */
                          <SinglePageView
                            title={currentConfig.name}
                            description={currentConfig.description}
                            heroImageUrl={currentConfig.singlePageHeroImage}
                            contentHtml={currentConfig.singlePageContent}
                          />
                        ) : categoryEntities.length === 0 ? (
                          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-3 max-w-md mx-auto my-6">
                            <SearchX className="w-10 h-10 text-stone-300 mx-auto" />
                            <h3 className="text-sm font-bold text-stone-800">
                              Belum Ada Card Entitas
                            </h3>
                            <p className="text-xs text-stone-500">
                              Belum ada unit kegiatan tercatat dalam kategori "{currentConfig.name}".
                            </p>
                            <button
                              onClick={() => handleOpenCMSWithAuth(currentConfig.name)}
                              className="inline-flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                            >
                              <Plus className="w-4 h-4 text-emerald-300" />
                              <span>Tambah Entitas di {currentConfig.name}</span>
                            </button>
                          </div>
                        ) : layoutType === 'photo_album' ? (
                          /* LAYOUT TYPE 2: PHOTO ALBUM GRID */
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categoryEntities.map((entity) => (
                              <PhotoAlbumCard
                                key={entity.id}
                                entity={entity}
                                onSelect={setSelectedEntityForModal}
                                onShare={(ent) =>
                                  setShareModalItem({ item: ent, type: 'entity' })
                                }
                                onEdit={handleEditEntityInCMS}
                                isCMSActive={true}
                              />
                            ))}
                          </div>
                        ) : (
                          /* LAYOUT TYPE 1: DEFAULT EXISTING GRID */
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categoryEntities.map((entity) => (
                              <EntityCard
                                key={entity.id}
                                entity={entity}
                                onSelect={setSelectedEntityForModal}
                                onShare={(ent) =>
                                  setShareModalItem({ item: ent, type: 'entity' })
                                }
                                onEdit={handleEditEntityInCMS}
                                isCMSActive={true}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    );
                  })()}
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

        {/* View Tab 3: Layanan Surat Menyurat Online Generator */}
        {activeTab === 'document_service' && (
          <DocumentGeneratorPage templates={siteSettings.documentTemplates} />
        )}

        {/* View Tab 4: Polling & Google Form Page */}
        {activeTab === 'polling' && (
          <PollingPage config={siteSettings.pollingConfig} />
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

      {/* Password Modal / Login Modal */}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={handleLoginSuccess}
        users={users}
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
        users={users}
        onSaveUsers={handleSaveUsers}
        currentUser={currentUser}
        onLogout={handleLogout}
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

