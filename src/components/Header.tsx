import React, { useState } from 'react';
import { Search, Shield, Menu, X, LayoutGrid, Megaphone, HelpCircle, FileText, Vote } from 'lucide-react';
import { BJP_LOGO_URL } from '../assets/logo';
import { NavbarTabConfig, RunningTextConfig } from '../types';
import { formatImageUrl } from '../utils/imageUrl';
import { RunningTextTicker } from './RunningTextTicker';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeTab: 'entities' | 'announcements' | 'document_service' | string;
  onTabChange: (tab: 'entities' | 'announcements' | 'document_service' | string) => void;
  onOpenCMS: () => void;
  isCMSActive: boolean;
  totalEntitiesCount: number;
  logoUrl?: string;
  navbarTabs?: NavbarTabConfig[];
  runningTextConfig?: RunningTextConfig;
}

export const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  activeTab,
  onTabChange,
  onOpenCMS,
  isCMSActive,
  totalEntitiesCount,
  logoUrl,
  navbarTabs,
  runningTextConfig,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const displayLogo = logoUrl ? formatImageUrl(logoUrl) : BJP_LOGO_URL;

  // Active enabled tabs sorted by order
  const activeNavbarTabs = (
    navbarTabs && navbarTabs.length > 0
      ? [...navbarTabs].filter((t) => t.enabled).sort((a, b) => a.order - b.order)
      : [
          { id: 'entities', label: 'Entitas Kegiatan', enabled: true, order: 0 },
          { id: 'announcements', label: 'Pengumuman & Agenda', enabled: true, order: 1 },
          { id: 'document_service', label: 'Layanan Surat Online', enabled: true, order: 2 },
        ]
  ) as NavbarTabConfig[];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Running Text Ticker */}
      <RunningTextTicker config={runningTextConfig} />

      {/* Top Banner Notice */}
      <div className="bg-emerald-800 text-emerald-50 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
        <span>Portal Resmi Ekosistem & Kegiatan Warga Komplek Bintara Jaya Permai (RW 11)</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('entities')}>
            <img
              src={displayLogo}
              alt="BJP HUB Logo"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-contain bg-white p-1 border border-amber-300/90 shadow-xs shrink-0 hover:scale-105 transition-transform"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-stone-900 text-base sm:text-lg leading-tight tracking-tight">
                  BJP<span className="text-emerald-700">.hub</span>
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                  RW 11
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">Bintara Jaya Permai</p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <div className="hidden md:flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200/80">
            {activeNavbarTabs.map((tab) => {
              const isEntities = tab.id === 'entities';
              const isDoc = tab.id === 'document_service';
              const isPolling = tab.id === 'polling';
              const Icon = isEntities ? LayoutGrid : isDoc ? FileText : isPolling ? Vote : Megaphone;
              const isSelected = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-emerald-900 shadow-xs border border-stone-200/60 font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-600" />
                  <span>{tab.label}</span>
                  {isEntities && (
                    <span className="bg-stone-200/70 text-stone-700 text-xs px-1.5 py-0.2 rounded-full">
                      {totalEntitiesCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Search Bar */}
          <div className="flex-1 max-w-xs relative hidden lg:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Cari entitas..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-stone-100/80 border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs bg-stone-200/50 rounded-full w-4 h-4 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>

          {/* Right Action: Small CMS Button & Mobile Menu */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCMS}
              className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold transition-all shadow-2xs ${
                isCMSActive
                  ? 'bg-amber-500 hover:bg-amber-600 text-stone-950 border border-amber-600'
                  : 'bg-emerald-800/90 hover:bg-emerald-900 text-white border border-emerald-700/60'
              }`}
              title="Akses CMS Pengurus"
            >
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span>CMS</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white p-4 space-y-3">
          {/* Mobile Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Cari entitas..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-100 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Mobile Tab Links */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            {activeNavbarTabs.map((tab) => {
              const isEntities = tab.id === 'entities';
              const Icon = isEntities ? LayoutGrid : Megaphone;
              const isSelected = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id as 'entities' | 'announcements');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-semibold ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>
                    {tab.label} {isEntities ? `(${totalEntitiesCount})` : ''}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
