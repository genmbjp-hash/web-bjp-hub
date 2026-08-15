import React, { useState } from 'react';
import { Shield, Menu, X, LayoutGrid, Megaphone, Home, Settings } from 'lucide-react';
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
  const location = useLocation();

  const displayLogo = logoUrl ? formatImageUrl(logoUrl) : BJP_LOGO_URL;

  const activeNavbarTabs = (
    navbarTabs && navbarTabs.length > 0
      ? [...navbarTabs].filter((t) => t.enabled).sort((a, b) => a.order - b.order)
      : [
          { id: 'entities', label: 'Komunitas Kegiatan', enabled: true, order: 0 },
          { id: 'announcements', label: 'Pengumuman & Agenda', enabled: true, order: 1 },
        ]
  ) as NavbarTabConfig[];

  const NAV_ITEMS = [
    { id: 'home', path: '/', label: 'Beranda', icon: Home },
    ...activeNavbarTabs.map((tab) => ({
      id: tab.id,
      path: tab.id === 'entities' ? '/komunitas' : '/pengumuman',
      label: tab.label,
      icon: tab.id === 'entities' ? LayoutGrid : Megaphone,
    })),
  ];

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
            {NAV_ITEMS.map(({ id, path, label, icon: Icon }) => {
              const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
              return (
                <Link
                  key={id}
                  to={path}
                  className={`relative flex items-center gap-1.5 h-full text-xs font-bold transition-colors ${
                    isActive
                      ? 'text-emerald-700'
                      : 'text-stone-700 hover:text-stone-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                  {/* Active Indicator Line */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 rounded-t-lg" />
                  )}
                </Link>
              );
            })}
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
