import React, { useState } from 'react';
import { Entity, Announcement } from '../types';
import { formatImageUrl } from '../utils/imageUrl';
import { setEntityMetaTags, setAnnouncementMetaTags, stripHtml, getAbsoluteImageUrl } from '../utils/meta';
import { X, Share2, Check, Copy, MessageCircle, ExternalLink, Sparkles } from 'lucide-react';

interface ShareModalProps {
  item: Entity | Announcement | null;
  type: 'entity' | 'announcement';
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ item, type, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const isEntity = type === 'entity';
  const entity = isEntity ? (item as Entity) : null;
  const ann = !isEntity ? (item as Announcement) : null;

  const title = isEntity ? (entity?.name || '') : (ann?.title || '');
  const category = isEntity ? (entity?.category || '') : (ann?.category || '');
  const rawDescription = isEntity ? (entity?.description || '') : (ann?.content || '');
  const cleanDesc = stripHtml(rawDescription);
  const snippet = cleanDesc.length > 150 ? cleanDesc.slice(0, 150) + '...' : cleanDesc;

  const rawImage = isEntity
    ? (entity?.image || entity?.productPhotos?.[0] || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80')
    : (ann?.image || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80');

  const thumbnail = getAbsoluteImageUrl(rawImage);
  const shareParamKey = isEntity ? 'entity' : 'announcement';
  const shareUrl = `${window.location.origin}${window.location.pathname}?${shareParamKey}=${item.id}`;

  // Dynamically set Meta Tags (OG, WhatsApp, Twitter) when share modal is opened
  if (isEntity) {
    setEntityMetaTags(entity!);
  } else {
    setAnnouncementMetaTags(ann!);
  }

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // fallback
    }
  };

  const handleWhatsAppShare = () => {
    const waText = `📌 *${title}*\nKategori: ${category}\n\n${snippet}\n\nLihat selengkapnya di BJP HUB:\n${shareUrl}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} - BJP HUB RW 11`,
          text: snippet,
          url: shareUrl,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div
      className="fixed inset-0 z-60 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-stone-200 space-y-5 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">Bagikan ke Warga & WhatsApp</h3>
              <p className="text-stone-500 text-xs">Preview WhatsApp OG Metadata Otomatis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-stone-100 text-stone-500 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live OG Link Preview Box */}
        <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200/90 space-y-2.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Pratinjau Link (WhatsApp / OG Preview)</span>
          </div>

          <div className="bg-white rounded-xl overflow-hidden border border-stone-200 shadow-2xs space-y-2">
            <div className="relative aspect-[2/1] bg-stone-100">
              <img
                src={thumbnail}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <span className="absolute top-2 left-2 bg-emerald-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                {category}
              </span>
            </div>

            <div className="p-3 space-y-1">
              <h4 className="font-bold text-stone-900 text-sm leading-snug line-clamp-1">{title}</h4>
              <p className="text-stone-600 text-xs line-clamp-2 leading-relaxed">{snippet}</p>
              <div className="pt-1 text-[10px] text-stone-400 font-mono truncate">
                {shareUrl}
              </div>
            </div>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="space-y-2.5">
          {/* WhatsApp Direct Button */}
          <button
            onClick={handleWhatsAppShare}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.99]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Bagikan Langsung ke WhatsApp</span>
          </button>

          {/* Copy Link Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 font-mono focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition-colors shrink-0 ${
                copied
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-stone-800 hover:bg-stone-900 text-white'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Link'}</span>
            </button>
          </div>

          {Boolean(navigator.share) && (
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-1.5 text-stone-600 hover:text-stone-900 font-semibold text-xs py-2 hover:bg-stone-100 rounded-xl transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Gunakan Fitur Share Bawaan HP / Browser</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
