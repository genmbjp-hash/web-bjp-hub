import React from 'react';
import { Announcement, SiteSettings } from '../../types';
import { Megaphone, ShieldCheck } from 'lucide-react';

interface RunningTeksProps {
  announcements: Announcement[];
  siteSettings?: SiteSettings;
}

export const RunningTeks: React.FC<RunningTeksProps> = ({ announcements, siteSettings }) => {

  // Check for today's security schedule
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  let securityMessage = '';
  if (siteSettings?.securitySchedules) {
    const todaySchedule = siteSettings.securitySchedules.find(s => s.date === todayStr);
    if (todaySchedule && todaySchedule.guards.trim() !== '') {
      securityMessage = `🛡️ PETUGAS KEAMANAN HARI INI: ${todaySchedule.guards.toUpperCase()}`;
    }
  }

  // Combine security message with announcements — security first, then latest announcements
  const announcementTexts = announcements.slice(0, 5).map((a) => `📢 ${a.title}`);

  const allTexts: string[] = [];
  if (securityMessage) allTexts.push(securityMessage);
  allTexts.push(...announcementTexts);

  if (allTexts.length === 0) return null;

  // Determine primary label to show
  const isSecurity = Boolean(securityMessage) && announcementTexts.length === 0;
  const isMixed = Boolean(securityMessage) && announcementTexts.length > 0;

  // Duplicate for seamless loop
  const marqueeText = allTexts.join('   •   ') + '   •   ' + allTexts.join('   •   ');

  return (
    <div
      className={`border-b text-stone-700 flex items-center overflow-hidden ${
        isSecurity
          ? 'bg-blue-50 border-blue-200'
          : isMixed
          ? 'bg-stone-50 border-stone-200'
          : 'bg-stone-50 border-stone-200'
      }`}
      style={{ height: '44px' }}
    >
      {/* Label */}
      <div
        className={`flex-shrink-0 flex items-center gap-2 h-full px-4 font-bold text-xs tracking-wide border-r ${
          isSecurity
            ? 'bg-blue-100 text-blue-800 border-blue-200'
            : isMixed
            ? 'bg-gradient-to-r from-blue-50 to-emerald-50 text-emerald-800 border-stone-200'
            : 'bg-emerald-50 text-emerald-800 border-stone-200'
        }`}
      >
        {isSecurity ? (
          <ShieldCheck className="w-3.5 h-3.5" />
        ) : (
          <Megaphone className="w-3.5 h-3.5" />
        )}
        <span className="hidden sm:inline">
          {isSecurity ? 'SECURITY' : isMixed ? 'INFO' : 'INFO'}
        </span>
      </div>

      {/* Marquee container */}
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        <div
          className="whitespace-nowrap text-xs sm:text-sm font-medium text-stone-600"
          style={{
            display: 'inline-block',
            animation: 'marquee 45s linear infinite',
            paddingLeft: '100%',
          }}
        >
          {marqueeText}
        </div>
      </div>

      {/* Inline keyframes via style tag */}
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};
