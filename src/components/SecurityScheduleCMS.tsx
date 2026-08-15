import React, { useState, useEffect } from 'react';
import { SiteSettings, SecuritySchedule } from '../types';
import { Shield, Plus, Trash2, Calendar, Save } from 'lucide-react';

interface SecurityScheduleCMSProps {
  siteSettings: SiteSettings;
  onSaveSiteSettings: (settings: SiteSettings) => void;
}

export const SecurityScheduleCMS: React.FC<SecurityScheduleCMSProps> = ({
  siteSettings,
  onSaveSiteSettings,
}) => {
  const [schedules, setSchedules] = useState<SecuritySchedule[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  useEffect(() => {
    setSchedules(siteSettings.securitySchedules || []);
    
    // Set default month to current month
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    setSelectedMonth(`${yyyy}-${mm}`);
  }, [siteSettings]);

  const generateDaysInMonth = (monthStr: string) => {
    if (!monthStr) return [];
    const [year, month] = monthStr.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dd = String(i).padStart(2, '0');
      const mm = String(month).padStart(2, '0');
      days.push(`${year}-${mm}-${dd}`);
    }
    return days;
  };

  const currentMonthDays = generateDaysInMonth(selectedMonth);

  const getGuardForDate = (dateStr: string) => {
    const entry = schedules.find((s) => s.date === dateStr);
    return entry ? entry.guards : '';
  };

  const handleGuardChange = (dateStr: string, value: string) => {
    const newSchedules = [...schedules];
    const existingIndex = newSchedules.findIndex((s) => s.date === dateStr);
    
    if (existingIndex >= 0) {
      if (value.trim() === '') {
        newSchedules.splice(existingIndex, 1);
      } else {
        newSchedules[existingIndex].guards = value;
      }
    } else if (value.trim() !== '') {
      newSchedules.push({ date: dateStr, guards: value });
    }
    
    setSchedules(newSchedules);
  };

  const handleSave = () => {
    onSaveSiteSettings({
      ...siteSettings,
      securitySchedules: schedules,
    });
    alert('Jadwal Keamanan berhasil disimpan!');
  };

  const todayObj = new Date();
  const currentMinMonth = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <h2 className="text-xl font-black text-stone-900">Jadwal Keamanan (Security)</h2>
            <p className="text-sm text-stone-500 font-medium mt-0.5">
              Atur petugas keamanan yang berjaga untuk ditampilkan di Running Text.
            </p>
          </div>
        </div>
        
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Jadwal</span>
        </button>
      </div>

      <div className="space-y-6 max-w-3xl">
        <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl flex items-center gap-4">
          <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-stone-500" />
            Pilih Bulan:
          </label>
          <input
            type="month"
            value={selectedMonth}
            min={currentMinMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {selectedMonth ? (
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
            <div className="grid grid-cols-[70px_1fr] sm:grid-cols-[100px_1fr] bg-stone-100 border-b border-stone-200 text-xs font-bold text-stone-600 uppercase">
              <div className="p-3 text-center border-r border-stone-200">Tanggal</div>
              <div className="p-3 pl-4">Nama Petugas Berjaga</div>
            </div>
            <div className="divide-y divide-stone-100 max-h-[500px] overflow-y-auto">
              {currentMonthDays.map((dateStr) => {
                const dateObj = new Date(dateStr);
                const dayName = dateObj.toLocaleDateString('id-ID', { weekday: 'short' });
                const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

                return (
                  <div key={dateStr} className={`grid grid-cols-[70px_1fr] sm:grid-cols-[100px_1fr] items-center hover:bg-stone-50 transition-colors ${isWeekend ? 'bg-red-50/30' : ''}`}>
                    <div className="p-3 text-center border-r border-stone-100 text-sm">
                      <span className={`font-bold ${isWeekend ? 'text-red-600' : 'text-stone-700'}`}>
                        {dateStr.split('-')[2]}
                      </span>
                      <span className="text-xs text-stone-500 block">{dayName}</span>
                    </div>
                    <div className="p-2 pl-4">
                      <input
                        type="text"
                        value={getGuardForDate(dateStr)}
                        onChange={(e) => handleGuardChange(dateStr, e.target.value)}
                        placeholder="Contoh: Pak Budi & Pak Agus"
                        className="w-full px-3 py-2 bg-transparent border-b border-stone-200 hover:border-stone-300 focus:border-emerald-500 text-sm focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-stone-500 bg-stone-50 rounded-xl border border-stone-200 border-dashed">
            Silakan pilih bulan terlebih dahulu.
          </div>
        )}
      </div>
    </div>
  );
};
