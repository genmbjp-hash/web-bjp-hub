import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Entity, Announcement, SiteSettings, CategoryHeaderConfig, User } from './types';

// Components (via barrel export)
import {
  Header,
  EntityDetailModal,
  PasswordModal,
  Footer,
  ShareModal,
} from './components';

// CMSModal is large (admin-only panel) and rarely used by regular visitors,
// so it's code-split into its own chunk instead of bloating the main bundle.
const CMSModal = lazy(() =>
  import('./components/CMSModal').then((m) => ({ default: m.CMSModal }))
);

// Every route except Home ("/") is code-split into its own chunk — visitors
// only pay the download/parse cost for the page they actually open, which
// keeps the initial load light since most sessions never touch most routes.
const RtRwPage = lazy(() =>
  import('./pages/RtRwPage').then((m) => ({ default: m.RtRwPage }))
);
const LayananSuratPage = lazy(() =>
  import('./pages/LayananSuratPage').then((m) => ({ default: m.LayananSuratPage }))
);
const PollingPage = lazy(() =>
  import('./pages/PollingPage').then((m) => ({ default: m.PollingPage }))
);
const KomunitasPage = lazy(() =>
  import('./pages/KomunitasPage').then((m) => ({ default: m.KomunitasPage }))
);
const PengumumanPage = lazy(() =>
  import('./pages/PengumumanPage').then((m) => ({ default: m.PengumumanPage }))
);
const BankSampahPage = lazy(() =>
  import('./pages/BankSampahPage').then((m) => ({ default: m.BankSampahPage }))
);
const PodjokSantaiPage = lazy(() =>
  import('./pages/PodjokSantaiPage').then((m) => ({ default: m.PodjokSantaiPage }))
);
const DokumentasiPage = lazy(() =>
  import('./pages/DokumentasiPage').then((m) => ({ default: m.DokumentasiPage }))
);
const PendaftaranSentraUsahaPage = lazy(() =>
  import('./pages/PendaftaranSentraUsahaPage').then((m) => ({ default: m.PendaftaranSentraUsahaPage }))
);
const SosialKeagamaanPage = lazy(() =>
  import('./pages/SosialKeagamaanPage').then((m) => ({ default: m.SosialKeagamaanPage }))
);
const DkmMasjidPage = lazy(() =>
  import('./pages/DkmMasjidPage').then((m) => ({ default: m.DkmMasjidPage }))
);
const SportsBjpPage = lazy(() =>
  import('./pages/SportsBjpPage').then((m) => ({ default: m.SportsBjpPage }))
);
const PkkPage = lazy(() =>
  import('./pages/PkkPage').then((m) => ({ default: m.PkkPage }))
);
const PosyanduPage = lazy(() =>
  import('./pages/PosyanduPage').then((m) => ({ default: m.PosyanduPage }))
);
const FasilitasLingkunganPage = lazy(() =>
  import('./pages/FasilitasLingkunganPage').then((m) => ({ default: m.FasilitasLingkunganPage }))
);
const FasilitasLingkunganDetailPage = lazy(() =>
  import('./pages/FasilitasLingkunganDetailPage').then((m) => ({ default: m.FasilitasLingkunganDetailPage }))
);

// Custom Hooks
import { useEntities, useAnnouncements, useAuth } from './hooks';

// Utils
import { getSiteSettings, saveSiteSettings, DEFAULT_CATEGORY_CONFIGS, DEFAULT_RTRW_CONFIG } from './utils/storage';
import { setEntityMetaTags, resetMetaTags } from './utils/meta';
import { setAnnouncementMetaTags } from './utils/meta';

// Pages
import { HomePage } from './pages/HomePage';
import { RunningTeks } from './components/home/RunningTeks';

export default function App() {
  // ----- Data State (via Custom Hooks) -----
  const { entities, saveEntities: handleSaveEntities } = useEntities();
  const { announcements, saveAnnouncements: handleSaveAnnouncements } = useAnnouncements();
  const { users, currentUser, isAuthenticated, login, logout, saveUsers: handleSaveUsers } = useAuth();

  // ----- UI State -----
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => getSiteSettings());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const navigate = useNavigate();
  const location = useLocation();

  // ----- Modal State -----
  const [selectedEntityForModal, setSelectedEntityForModal] = useState<Entity | null>(null);
  const [shareModalItem, setShareModalItem] = useState<{
    item: Entity | Announcement;
    type: 'entity' | 'announcement';
  } | null>(null);
  const [isCMSOpen, setIsCMSOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editingEntityForCMS, setEditingEntityForCMS] = useState<Entity | null>(null);
  const [pendingCategoryForCard, setPendingCategoryForCard] = useState<string | null>(null);

  // ----- Deep Link: Parse URL on initial mount -----
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const entityId = params.get('entity') || params.get('id');
    const annId = params.get('announcement');
    const categoryParam = params.get('category');

    if (categoryParam) setSelectedCategory(categoryParam);

    if (entityId) {
      let found = entities.find((e) => e.id === entityId);
      if (!found) {
        found = entities.find(
          (e) =>
            e.id.toLowerCase() === entityId.toLowerCase() ||
            e.id.replace('ent-', '') === entityId.replace('ent-', '')
        );
      }
      if (!found && entities.length > 0) {
        found = entities.find((e) => e.id === 'ent-4') || entities[0];
      }
      if (found) {
        setSelectedEntityForModal(found);
        navigate('/komunitas', { replace: true });
      }
    } else if (annId) {
      const foundAnn = announcements.find((a) => a.id === annId);
      if (foundAnn) {
        navigate('/pengumuman', { replace: true });
        setAnnouncementMetaTags(foundAnn);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----- Sync URL & meta tags when selected entity changes -----
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

  // ----- Handle browser Back & Forward navigation -----
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

  // ----- Site Settings Handler -----
  const handleSaveSiteSettings = (updatedSettings: SiteSettings) => {
    setSiteSettings(updatedSettings);
    saveSiteSettings(updatedSettings);
    resetMetaTags(updatedSettings.logoUrl);
  };

  // ----- CMS Access Handlers -----
  const handleOpenCMSWithAuth = (presetCat?: string) => {
    setPendingCategoryForCard(presetCat || null);
    if (isAuthenticated && currentUser) {
      setEditingEntityForCMS(null);
      setIsCMSOpen(true);
    } else {
      setIsPasswordModalOpen(true);
    }
  };

  const handleEditEntityInCMS = (ent: Entity) => {
    setEditingEntityForCMS(ent);
    setPendingCategoryForCard(null);
    if (isAuthenticated && currentUser) {
      setIsCMSOpen(true);
    } else {
      setIsPasswordModalOpen(true);
    }
  };

  const handleLoginSuccess = (user: User) => {
    login(user);
    setIsPasswordModalOpen(false);
    setIsCMSOpen(true);
  };

  const handleLogout = () => {
    logout();
    setIsCMSOpen(false);
  };

  // ----- Category & Filter Logic -----
  const categoryConfigs = siteSettings.categoryConfigs || DEFAULT_CATEGORY_CONFIGS;
  const categoryNames = ['Semua', ...categoryConfigs.map((c) => c.name)];

  const activeSectionConfigs =
    selectedCategory === 'Semua'
      ? categoryConfigs
      : categoryConfigs.filter(
          (c) => c.name === selectedCategory || c.id === selectedCategory
        );

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

  const totalFilteredCount = entities.filter((ent) => {
    const matchesSearch = ent.name.toLowerCase().includes(searchTerm.toLowerCase());

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

  // ----- Render -----
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans flex flex-col selection:bg-emerald-200 selection:text-emerald-900">
      {/* Header */}
      <Header
        onOpenCMS={() => handleOpenCMSWithAuth()}
        isCMSActive={isCMSOpen}
        totalEntitiesCount={entities.length}
        logoUrl={siteSettings.logoUrl}
        navbarTabs={siteSettings.navbarTabs}
      />

      {/* Running Teks — global, di bawah navbar */}
      <RunningTeks announcements={announcements} siteSettings={siteSettings} />

      {/* Main Container */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={
            <HomePage
              entities={entities}
              announcements={announcements}
              siteSettings={siteSettings}
              onSelectEntity={setSelectedEntityForModal}
              onSelectCategory={(cat) => { setSelectedCategory(cat); }}
              categoryConfigs={categoryConfigs}
            />
          } />

          <Route path="/komunitas" element={
            <Suspense fallback={null}>
              <KomunitasPage
                entities={entities}
                categoryNames={categoryNames}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => { setSelectedCategory(cat); }}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                categoryConfigs={categoryConfigs}
                isCMSOpen={isCMSOpen}
                onSelectEntity={setSelectedEntityForModal}
                onShareEntity={(ent) => setShareModalItem({ item: ent, type: 'entity' })}
                onEditEntity={handleEditEntityInCMS}
                onOpenCMSWithAuth={handleOpenCMSWithAuth}
              />
            </Suspense>
          } />

          <Route path="/pengumuman" element={
            <Suspense fallback={null}>
              <PengumumanPage
                announcements={announcements}
                onOpenCMS={() => handleOpenCMSWithAuth()}
                isCMSActive={isCMSOpen}
                onShare={(ann) => setShareModalItem({ item: ann, type: 'announcement' })}
                onBack={() => navigate('/')}
              />
            </Suspense>
          } />

          <Route path="/rt-rw" element={
            <Suspense fallback={null}>
              <RtRwPage
                config={siteSettings.rtRwConfig || DEFAULT_RTRW_CONFIG}
                onBack={() => navigate('/')}
              />
            </Suspense>
          } />

          <Route path="/layanan-surat" element={
            <Suspense fallback={null}>
              <LayananSuratPage
                templates={siteSettings.documentTemplates}
                onGoHome={() => navigate('/')}
              />
            </Suspense>
          } />

          <Route path="/polling" element={
            <Suspense fallback={null}>
              <PollingPage
                config={siteSettings.pollingConfig}
                onGoHome={() => navigate('/')}
              />
            </Suspense>
          } />

          <Route path="/podjok-santai" element={
            <Suspense fallback={null}>
              <PodjokSantaiPage onBack={() => navigate('/')} />
            </Suspense>
          } />

          <Route path="/dokumentasi" element={
            <Suspense fallback={null}>
              <DokumentasiPage
                entities={entities}
                featuredVideos={siteSettings.featuredVideos || []}
                featuredPhotos={siteSettings.featuredPhotos || []}
                onBack={() => navigate('/')}
              />
            </Suspense>
          } />

          <Route path="/bank-sampah" element={
            <Suspense fallback={null}>
              <BankSampahPage
                entity={entities.find((e) => e.id === 'ent-5') || entities.find((e) => e.name.toLowerCase().includes('bank sampah'))}
                config={siteSettings.bankSampahConfig}
                onBack={() => navigate('/')}
              />
            </Suspense>
          } />

          <Route path="/pendaftaran-sentra-usaha" element={
            <Suspense fallback={null}>
              <PendaftaranSentraUsahaPage onBack={() => navigate('/')} />
            </Suspense>
          } />

          <Route path="/sosial-keagamaan" element={
            <Suspense fallback={null}>
              <SosialKeagamaanPage
                entities={entities}
                onSelectEntity={setSelectedEntityForModal}
                onBack={() => navigate('/')}
              />
            </Suspense>
          } />

          <Route path="/dkm-masjid" element={
            <Suspense fallback={null}>
              <DkmMasjidPage
                entity={entities.find((e) => e.name.toLowerCase().includes('dkm masjid'))}
                config={siteSettings.dkmMasjidConfig}
                onBack={() => navigate('/sosial-keagamaan')}
              />
            </Suspense>
          } />

          <Route path="/sports-bjp" element={
            <Suspense fallback={null}>
              <SportsBjpPage
                entities={entities}
                onSelectEntity={setSelectedEntityForModal}
                onBack={() => navigate('/')}
              />
            </Suspense>
          } />

          <Route path="/pkk" element={
            <Suspense fallback={null}>
              <PkkPage
                entities={entities}
                onSelectEntity={setSelectedEntityForModal}
                onBack={() => navigate('/')}
              />
            </Suspense>
          } />

          <Route path="/posyandu" element={
            <Suspense fallback={null}>
              <PosyanduPage
                entities={entities}
                onSelectEntity={setSelectedEntityForModal}
                onBack={() => navigate('/')}
              />
            </Suspense>
          } />

          <Route path="/fasilitas-lingkungan" element={
            <Suspense fallback={null}>
              <FasilitasLingkunganPage
                config={siteSettings.fasilitasLingkunganConfig}
                onBack={() => navigate('/')}
              />
            </Suspense>
          } />

          <Route path="/fasilitas-lingkungan/:slug" element={
            <Suspense fallback={null}>
              <FasilitasLingkunganDetailPage
                config={siteSettings.fasilitasLingkunganConfig}
              />
            </Suspense>
          } />
        </Routes>
      </main>

      {/* Modals */}
      <EntityDetailModal
        entity={selectedEntityForModal}
        onClose={() => setSelectedEntityForModal(null)}
        onShare={(ent) => setShareModalItem({ item: ent, type: 'entity' })}
      />

      {shareModalItem && (
        <ShareModal
          item={shareModalItem.item}
          type={shareModalItem.type}
          onClose={() => setShareModalItem(null)}
        />
      )}

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={handleLoginSuccess}
        users={users}
        logoUrl={siteSettings.logoUrl}
      />

      {isCMSOpen && (
        <Suspense fallback={null}>
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
        </Suspense>
      )}

      {/* Footer */}
      <Footer
        logoUrl={siteSettings.logoUrl}
      />
    </div>
  );
}
