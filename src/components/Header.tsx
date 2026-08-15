import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, LayoutGrid, Megaphone, Home, Settings, Building, FileText, Vote, ChevronDown } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BJP_LOGO_URL } from '../assets/logo';
import { NavbarTabConfig } from '../types';
import { formatImageUrl } from '../utils/imageUrl';

interface HeaderProps {
  onOpenCMS: () => void;
  isCMSActive: boolean;
  totalEntitiesCount: number;
  logoUrl?: string;
  navbarTabs?: NavbarTabConfig[];
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCMS,
  isCMSActive,
  totalEntitiesCount,
  logoUrl,
  navbarTabs,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayLogo = logoUrl ? formatImageUrl(logoUrl) : BJP_LOGO_URL;

  const activeNavbarTabs = (
    navbarTabs && navbarTabs.length > 0
      ? [...navbarTabs].filter((t) => t.enabled).sort((a, b) => a.order - b.order)
      : [
          { id: 'entities', label: 'Komunitas Kegiatan', enabled: true, order: 0 },
          { id: 'rtrw', label: 'Informasi RT/RW', enabled: true, order: 1 },
          { id: 'announcements', label: 'Pengumuman & Agenda', enabled: true, order: 2 },
          { id: 'document_service', label: 'Layanan Surat Online', enabled: true, order: 3 },
          { id: 'polling', label: 'Polling & Aspirasi Warga', enabled: true, order: 4 },
        ]
  ) as NavbarTabConfig[];

  const TAB_ROUTE_MAP: Record<string, { path: string; icon: typeof LayoutGrid }> = {
    entities: { path: '/komunitas', icon: LayoutGrid },
    rtrw: { path: '/rt-rw', icon: Building },
    announcements: { path: '/pengumuman', icon: Megaphone },
    document_service: { path: '/layanan-surat', icon: FileText },
    polling: { path: '/polling', icon: Vote },
  };

  // Only the most-used tabs sit directly in the bar; the rest collapse into "Lainnya"
  // so the navbar doesn't get crowded as more menus are added.
  const PRIMARY_TAB_IDS = ['entities', 'announcements'];

  const allTabItems = activeNavbarTabs.map((tab) => {
    const route = TAB_ROUTE_MAP[tab.id] || { path: '/pengumuman', icon: Megaphone };
    return { id: tab.id, path: route.path, label: tab.label, icon: route.icon };
  });

  const primaryItems = [
    { id: 'home', path: '/', label: 'Beranda', icon: Home },
    ...allTabItems.filter((t) => PRIMARY_TAB_IDS.includes(t.id)),
  ];
  const moreItems = allTabItems.filter((t) => !PRIMARY_TAB_IDS.includes(t.id));
  const NAV_ITEMS = [...primaryItems, ...moreItems];

  const isItemActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
  const isMoreActive = moreItems.some((t) => isItemActive(t.path));

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4 relative">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0 group z-10"
          >
            <img
              src={displayLogo}
              alt="BJP.hub Logo"
              className="h-8 w-auto object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
            />
            <div className="leading-none hidden sm:block">
              <span className="font-black text-stone-900 text-lg tracking-tight">
                BJP<span className="text-emerald-700">.hub</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center justify-center gap-5 absolute left-1/2 -translate-x-1/2 h-full z-0">
            {primaryItems.map(({ id, path, label, icon: Icon }) => {
              const isActive = isItemActive(path);
              return (
                <Link
                  key={id}
                  to={path}
                  className={`relative flex items-center gap-1.5 h-full text-xs font-bold transition-colors ${
                    isActive ? 'text-emerald-700' : 'text-stone-700 hover:text-stone-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 rounded-t-lg" />
                  )}
                </Link>
              );
            })}

            {/* "Lainnya" dropdown groups the less-frequent tabs to keep the bar tidy */}
            {moreItems.length > 0 && (
              <div className="relative h-full" ref={moreMenuRef}>
                <button
                  onClick={() => setMoreMenuOpen((v) => !v)}
                  className={`relative flex items-center gap-1 h-full text-xs font-bold transition-colors cursor-pointer ${
                    isMoreActive ? 'text-emerald-700' : 'text-stone-700 hover:text-stone-900'
                  }`}
                >
                  <span>Lainnya</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreMenuOpen ? 'rotate-180' : ''}`} />
                  {isMoreActive && (
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 rounded-t-lg" />
                  )}
                </button>

                {moreMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl border border-stone-200 shadow-lg py-1.5 z-50">
                    {moreItems.map(({ id, path, label, icon: Icon }) => {
                      const isActive = isItemActive(path);
                      return (
                        <Link
                          key={id}
                          to={path}
                          onClick={() => setMoreMenuOpen(false)}
                          className={`flex items-center gap-2.5 px-4 py-2 text-xs font-semibold transition-colors ${
                            isActive ? 'text-emerald-700 bg-emerald-50' : 'text-stone-700 hover:bg-stone-50'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Right: CMS + Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-4 z-10">
            <button
              onClick={onOpenCMS}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
                isCMSActive
                  ? 'bg-stone-800 text-amber-400 hover:bg-stone-900 ring-1 ring-amber-400/50'
                  : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
              }`}
              title="Kelola Data Website (Pengurus)"
            >
              <Settings className={`w-3.5 h-3.5 ${isCMSActive ? 'animate-spin-slow' : ''}`} />
              <span>CMS</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-100 bg-white py-3 px-4">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map(({ id, path, label, icon: Icon }) => {
              const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
              return (
                <Link
                  key={id}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-all ${
                    isActive
                      ? 'bg-emerald-700 text-white'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
