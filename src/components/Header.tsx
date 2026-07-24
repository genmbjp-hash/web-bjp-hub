import React, { useState } from 'react';
import { Search, Shield, Menu, X, LayoutGrid, Megaphone, HelpCircle } from 'lucide-react';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeTab: 'entities' | 'announcements';
  onTabChange: (tab: 'entities' | 'announcements') => void;
  onOpenCMS: () => void;
  isCMSActive: boolean;
  totalEntitiesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  activeTab,
  onTabChange,
  onOpenCMS,
  isCMSActive,
  totalEntitiesCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-emerald-800 text-emerald-50 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
        <span>Portal Resmi Ekosistem & Kegiatan Warga Komplek Bintara Jaya Permai (RW 11)</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('entities')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-lg shadow-sm border border-emerald-500/20">
              BJP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-stone-900 text-base sm:text-lg leading-tight tracking-tight">
                  BJP HUB
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
            <button
              onClick={() => onTabChange('entities')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'entities'
                  ? 'bg-white text-emerald-900 shadow-xs border border-stone-200/60 font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4 text-emerald-600" />
              <span>Entitas Kegiatan</span>
              <span className="bg-stone-200/70 text-stone-700 text-xs px-1.5 py-0.2 rounded-full">
                {totalEntitiesCount}
              </span>
            </button>

            <button
              onClick={() => onTabChange('announcements')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'announcements'
                  ? 'bg-white text-emerald-900 shadow-xs border border-stone-200/60 font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Megaphone className="w-4 h-4 text-emerald-600" />
              <span>Pengumuman & Agenda</span>
            </button>
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
            <button
              onClick={() => {
                onTabChange('entities');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-semibold ${
                activeTab === 'entities'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-stone-100 text-stone-700'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Entitas ({totalEntitiesCount})</span>
            </button>

            <button
              onClick={() => {
                onTabChange('announcements');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-semibold ${
                activeTab === 'announcements'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-stone-100 text-stone-700'
              }`}
            >
              <Megaphone className="w-4 h-4" />
              <span>Pengumuman</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
