import React from 'react';
import { RunningTextConfig } from '../types';
import { Volume2, ExternalLink } from 'lucide-react';

interface RunningTextTickerProps {
  config?: RunningTextConfig;
}

export const RunningTextTicker: React.FC<RunningTextTickerProps> = ({ config }) => {
  if (!config || !config.enabled || !config.text) {
    return null;
  }

  return (
    <div className="bg-emerald-900 text-emerald-100 border-b border-emerald-800 text-xs py-2 px-3 overflow-hidden select-none relative z-30 shadow-2xs flex items-center gap-3">
      {/* Badge Indicator */}
      <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-400 text-stone-950 font-extrabold rounded-md shrink-0 text-[10px] tracking-wide shadow-2xs uppercase">
        <Volume2 className="w-3.5 h-3.5 text-stone-950 animate-bounce" />
        <span>INFO RW 11</span>
      </div>

      {/* Ticker Container */}
      <div className="flex-1 overflow-hidden relative group">
        <div className="whitespace-nowrap inline-block animate-marquee group-hover:[animation-play-state:paused] font-medium tracking-wide">
          <span className="mx-4">{config.text}</span>
          {config.linkUrl && (
            <a
              href={config.linkUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-amber-300 underline font-bold hover:text-amber-200 ml-2"
            >
              <span>{config.linkText || 'Selengkapnya'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
          {/* Duplicate text for seamless looping */}
          <span className="mx-12 opacity-60">•</span>
          <span className="mx-4">{config.text}</span>
          {config.linkUrl && (
            <a
              href={config.linkUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-amber-300 underline font-bold hover:text-amber-200 ml-2"
            >
              <span>{config.linkText || 'Selengkapnya'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
