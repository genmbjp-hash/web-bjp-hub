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

  // If there's a security schedule for today, we prioritize it (or combine it)
  // Let's just show the security message if it exists, otherwise fall back to announcements
  let texts: string[] = [];
  let isSecurity = false;

  if (securityMessage) {
    texts = [securityMessage, securityMessage, securityMessage]; // Repeat to fill space
    isSecurity = true;
  } else {
    texts = announcements.slice(0, 5).map((a) => `📢 ${a.title}`);
  }

  if (texts.length === 0) return null;

  const marqueeText = texts.join('   •   ') + '   •   ' + texts.join('   •   ');

  return (
    <div className="bg-stone-50 border-b border-stone-200 text-stone-700 flex items-center overflow-hidden" style={{ height: '48px' }}>
      {/* Label */}
      <div className={`flex-shrink-0 flex items-center gap-2 h-full px-5 font-bold text-sm tracking-wide border-r border-stone-200/60 ${isSecurity ? 'bg-blue-50 text-blue-800' : 'bg-emerald-50 text-emerald-800'}`}>
        {isSecurity ? <ShieldCheck className="w-4 h-4" /> : <Megaphone className="w-4 h-4" />}
        <span>{isSecurity ? 'SECURITY' : 'INFO'}</span>
      </div>

      {/* Marquee container */}
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        <div
          className="whitespace-nowrap text-sm sm:text-base font-medium text-stone-600"
          style={{
            display: 'inline-block',
            animation: 'marquee 40s linear infinite',
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
