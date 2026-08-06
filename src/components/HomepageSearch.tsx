import React, { useState, useMemo } from 'react';
import {
  Search,
  SearchX,
  ChevronRight,
  Layers,
  Megaphone,
  FileText,
  Video,
  Sparkles,
  X,
  Building2,
  Tag,
  ArrowRight
} from 'lucide-react';
import { Entity, Announcement, CategoryHeaderConfig, SocialFeedItem, DocumentTemplate } from '../types';
import { formatImageUrl } from '../utils/imageUrl';

interface HomepageSearchProps {
  entities: Entity[];
  announcements: Announcement[];
  categoryConfigs: CategoryHeaderConfig[];
  documentTemplates?: DocumentTemplate[];
  socialFeeds?: SocialFeedItem[];
  onSelectEntity: (entity: Entity) => void;
  onSelectCategory: (categoryName: string) => void;
  onSelectTab: (tab: string) => void;
}

export const HomepageSearch: React.FC<HomepageSearchProps> = ({
  entities,
  announcements,
  categoryConfigs,
  documentTemplates = [],
  socialFeeds = [],
  onSelectEntity,
  onSelectCategory,
  onSelectTab,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const trimmedSearch = searchTerm.trim();
  const searchLength = trimmedSearch.length;
  const isSearchValid = searchLength >= 3;

  // Perform search across all 5 content types if search length >= 3
  const searchResults = useMemo(() => {
    if (!isSearchValid) {
      return {
        entities: [],
        categories: [],
        announcements: [],
        documents: [],
        feeds: [],
        totalCount: 0,
      };
    }

    const query = trimmedSearch.toLowerCase();

    // 1. Entities
    const matchedEntities = entities.filter((ent) => {
      const name = (ent.name || '').toLowerCase();
      const desc = (ent.description || '').toLowerCase();
      const cat = (ent.category || '').toLowerCase();
      const address = (ent.address || '').toLowerCase();
      return (
        name.includes(query) ||
        desc.includes(query) ||
        cat.includes(query) ||
        address.includes(query)
      );
    });

    // 2. Categories / Halaman Entitas
    const matchedCategories = categoryConfigs.filter((catConfig) => {
      const name = (catConfig.name || '').toLowerCase();
      const desc = (catConfig.description || '').toLowerCase();
      const id = (catConfig.id || '').toLowerCase();
      return name.includes(query) || desc.includes(query) || id.includes(query);
    });

    // 3. Announcements
    const matchedAnnouncements = announcements.filter((ann) => {
      const title = (ann.title || '').toLowerCase();
      const content = (ann.content || '').toLowerCase();
      const category = (ann.category || '').toLowerCase();
      return title.includes(query) || content.includes(query) || category.includes(query);
    });

    // 4. Document Templates
    const matchedDocuments = documentTemplates.filter((doc) => {
      const title = (doc.title || '').toLowerCase();
      const desc = (doc.description || '').toLowerCase();
      return title.includes(query) || desc.includes(query);
    });

    // 5. Social Feeds / Video
    const matchedFeeds = socialFeeds.filter((feed) => {
      const title = (feed.title || '').toLowerCase();
      const desc = (feed.description || '').toLowerCase();
      return title.includes(query) || desc.includes(query);
    });

    const totalCount =
      matchedEntities.length +
      matchedCategories.length +
      matchedAnnouncements.length +
      matchedDocuments.length +
      matchedFeeds.length;

    return {
      entities: matchedEntities,
      categories: matchedCategories,
      announcements: matchedAnnouncements,
      documents: matchedDocuments,
      feeds: matchedFeeds,
      totalCount,
    };
  }, [trimmedSearch, isSearchValid, entities, categoryConfigs, announcements, documentTemplates, socialFeeds]);

  // Quick keyword preset tags for convenient testing/clicking
  const sampleKeywords = ['Sentra Usaha', 'Surat Pengantar', 'Posyandu', 'Bazar', 'Kerja Bakti'];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-md space-y-5 my-6">
      {/* Top Header Label */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
            <Search className="w-5 h-5 text-emerald-800" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-stone-900 tracking-tight">
              Pencarian Cepat Konten Home Page
            </h3>
            <p className="text-xs text-stone-500">
              Cari entitas, halaman, pengumuman, layanan surat, atau video di portal RW 11
            </p>
          </div>
        </div>

        {/* Character status pill */}
        {searchLength > 0 && (
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border transition-all ${
              isSearchValid
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}
          >
            {isSearchValid
              ? `✓ ${searchResults.totalCount} Hasil Ditemukan`
              : `${searchLength}/3 Huruf Minimal`}
          </span>
        )}
      </div>

      {/* Interactive Search Box */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none flex items-center gap-1">
          <Search className="w-5 h-5 text-emerald-700" />
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Ketik kata kunci pencarian... (contoh: UMKM, Surat, Posyandu, RT RW)"
          className="w-full pl-12 pr-24 py-3.5 bg-stone-50 hover:bg-white focus:bg-white border-2 border-stone-200 focus:border-emerald-600 rounded-2xl text-sm font-medium text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/15 transition-all shadow-2xs"
        />

        {searchTerm ? (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-stone-200 hover:bg-stone-300 text-stone-700 hover:text-stone-900 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Bersihkan</span>
          </button>
        ) : (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-stone-400 bg-stone-200/60 px-2.5 py-1 rounded-lg pointer-events-none">
            Min. 3 Huruf
          </span>
        )}
      </div>

      {/* Suggested Preset Tag Buttons if input is empty */}
      {!searchTerm && (
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Coba kata kunci:</span>
          </span>
          {sampleKeywords.map((kw) => (
            <button
              key={kw}
              type="button"
              onClick={() => setSearchTerm(kw)}
              className="text-xs bg-stone-100 hover:bg-emerald-100 text-stone-700 hover:text-emerald-900 font-semibold px-3 py-1 rounded-xl border border-stone-200 transition-colors cursor-pointer"
            >
              + {kw}
            </button>
          ))}
        </div>
      )}

      {/* Warning message if user typed 1 or 2 characters */}
      {searchLength > 0 && !isSearchValid && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>Ketik minimal <strong>3 huruf</strong> untuk menampilkan hasil pencarian yang akurat.</span>
          </div>
          <span className="text-xs font-bold bg-amber-200/80 px-2.5 py-1 rounded-lg text-amber-950 shrink-0">
            {searchLength}/3 karakter
          </span>
        </div>
      )}

      {/* Search Results Display Area */}
      {isSearchValid && (
        <div className="space-y-6 pt-2 border-t border-stone-100">
          {searchResults.totalCount === 0 ? (
            /* Empty Search Results State */
            <div className="p-8 text-center bg-stone-50/70 rounded-2xl border border-dashed border-stone-300 space-y-3">
              <SearchX className="w-10 h-10 text-stone-400 mx-auto" />
              <h4 className="font-bold text-stone-800 text-sm sm:text-base">
                Tidak Ditemukan Konten dengan Kata Kunci "{trimmedSearch}"
              </h4>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Coba gunakan kata kunci substring yang lebih umum seperti "UMKM", "Surat", "Posyandu", "Laporan", atau "RW 11".
              </p>
            </div>
          ) : (
            /* Grouped Results List */
            <div className="space-y-6">

              {/* 1. MATCHED CARDS / ENTITAS KEGIATAN */}
              {searchResults.entities.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5 uppercase tracking-wider">
                      <Building2 className="w-4 h-4 text-emerald-700" />
                      <span>Card Entitas Kegiatan ({searchResults.entities.length})</span>
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Klik untuk buka detail modal entitas
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {searchResults.entities.map((entity) => (
                      <div
                        key={entity.id}
                        onClick={() => onSelectEntity(entity)}
                        className="bg-stone-50 hover:bg-emerald-50/70 p-3.5 rounded-2xl border border-stone-200 hover:border-emerald-400 transition-all cursor-pointer group flex items-start gap-3 shadow-2xs"
                      >
                        {entity.image ? (
                          <img
                            src={formatImageUrl(entity.image)}
                            alt={entity.name}
                            className="w-14 h-14 rounded-xl object-cover shrink-0 border border-stone-200 group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-lg shrink-0 border border-emerald-200">
                            {entity.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                              {entity.category}
                            </span>
                          </div>
                          <h5 className="font-extrabold text-stone-900 text-sm truncate group-hover:text-emerald-800 transition-colors">
                            {entity.name}
                          </h5>
                          <p className="text-xs text-stone-600 line-clamp-1">
                            {entity.description}
                          </p>
                        </div>

                        <div className="p-1.5 bg-white group-hover:bg-emerald-600 group-hover:text-white rounded-xl border border-stone-200 group-hover:border-emerald-600 transition-colors shrink-0 self-center">
                          <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. MATCHED CATEGORIES / HALAMAN ENTITAS */}
              {searchResults.categories.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5 uppercase tracking-wider">
                      <Layers className="w-4 h-4 text-purple-700" />
                      <span>Halaman / Kategori Entitas ({searchResults.categories.length})</span>
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Klik untuk menuju ke halaman kategori ini
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {searchResults.categories.map((catConfig) => (
                      <div
                        key={catConfig.id}
                        onClick={() => {
                          onSelectCategory(catConfig.name);
                          onSelectTab('entities');
                        }}
                        className="bg-stone-50 hover:bg-purple-50/70 p-3.5 rounded-2xl border border-stone-200 hover:border-purple-300 transition-all cursor-pointer group flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 border border-purple-200">
                            <Layers className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h5 className="font-extrabold text-stone-900 text-sm truncate group-hover:text-purple-900">
                              Halaman: {catConfig.name}
                            </h5>
                            <p className="text-xs text-stone-500 line-clamp-1">
                              {catConfig.description || `Lihat daftar unit di ${catConfig.name}`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs font-bold text-purple-700 bg-white px-2.5 py-1 rounded-xl border border-stone-200 group-hover:border-purple-300 shrink-0">
                          <span>Buka Halaman</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. MATCHED ANNOUNCEMENTS */}
              {searchResults.announcements.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5 uppercase tracking-wider">
                      <Megaphone className="w-4 h-4 text-amber-600" />
                      <span>Pengumuman & Agenda Warga ({searchResults.announcements.length})</span>
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Klik untuk pindah ke tab Pengumuman
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {searchResults.announcements.map((ann) => (
                      <div
                        key={ann.id}
                        onClick={() => onSelectTab('announcements')}
                        className="bg-amber-50/40 hover:bg-amber-100/60 p-3.5 rounded-2xl border border-amber-200 transition-all cursor-pointer group flex items-start gap-3 shadow-2xs"
                      >
                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-300">
                          <Megaphone className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold bg-amber-200/70 text-amber-900 px-2 py-0.2 rounded-md">
                              {ann.category}
                            </span>
                            <span className="text-[10px] text-stone-400">{ann.date}</span>
                          </div>
                          <h5 className="font-extrabold text-stone-900 text-sm truncate group-hover:text-amber-900">
                            {ann.title}
                          </h5>
                          <p className="text-xs text-stone-600 line-clamp-1">
                            {ann.content}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-800 self-center shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. MATCHED DOCUMENTS / LAYANAN SURAT */}
              {searchResults.documents.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5 uppercase tracking-wider">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>Layanan Surat Online ({searchResults.documents.length})</span>
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Klik untuk buka generator surat
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {searchResults.documents.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => onSelectTab('document_service')}
                        className="bg-blue-50/40 hover:bg-blue-100/60 p-3.5 rounded-2xl border border-blue-200 transition-all cursor-pointer group flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 border border-blue-300">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h5 className="font-extrabold text-stone-900 text-sm truncate group-hover:text-blue-900">
                              {doc.title}
                            </h5>
                            <p className="text-xs text-stone-600 line-clamp-1">
                              {doc.description}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-blue-800 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. MATCHED FEEDS / VIDEO */}
              {searchResults.feeds.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5 uppercase tracking-wider">
                      <Video className="w-4 h-4 text-pink-600" />
                      <span>Dokumentasi Video Feeds ({searchResults.feeds.length})</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {searchResults.feeds.map((feed) => (
                      <div
                        key={feed.id}
                        onClick={() => {
                          const feedEl = document.getElementById('feeds-section');
                          if (feedEl) {
                            feedEl.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="bg-stone-50 hover:bg-stone-100 p-3.5 rounded-2xl border border-stone-200 transition-all cursor-pointer group flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-800 flex items-center justify-center shrink-0 border border-pink-200">
                            <Video className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h5 className="font-extrabold text-stone-900 text-sm truncate group-hover:text-pink-900">
                              {feed.title}
                            </h5>
                            <p className="text-xs text-stone-500 line-clamp-1">
                              {feed.description}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      )}
    </div>
  );
};
