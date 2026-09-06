import React, { useState } from 'react';
import { ShieldAlert, X, KeyRound, User as UserIcon, Eye, EyeOff, Sparkles, LogIn } from 'lucide-react';
import { BJP_LOGO_URL } from '../assets/logo';
import { User } from '../types';
import { formatImageUrl } from '../utils/imageUrl';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  logoUrl?: string;
  users: User[];
}

export const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  logoUrl,
  users,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const displayLogo = logoUrl ? formatImageUrl(logoUrl) : BJP_LOGO_URL;

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.trim().toLowerCase();
    const foundUser = users.find(
      (u) => u.username.toLowerCase() === cleanUsername && u.password === password
    );

    if (foundUser) {
      setErrorMsg('');
      setUsername('');
      setPassword('');
      onSuccess(foundUser);
    } else {
      setErrorMsg('Username atau password tidak ditemukan. Silakan periksa kembali.');
    }
  };

  const handleQuickFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-lg border border-stone-200 relative space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="flex items-center gap-3.5 border-b border-stone-100 pb-4">
          <img
            src={displayLogo}
            alt="BJP HUB"
            className="w-12 h-12 rounded-2xl object-contain bg-white border border-amber-300 shadow-2xs p-1"
          />
          <div>
            <h3 className="font-bold text-stone-900 text-base sm:text-lg tracking-tight">
              Login CMS Pengurus
            </h3>
            <p className="text-xs text-stone-500">
              Masuk dengan akun pengurus sesuai wewenang komunitas
            </p>
          </div>
        </div>

        {/* Quick Demo Credentials Info Box */}
        <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-3 text-xs space-y-2">
          <div className="flex items-center gap-1.5 text-stone-700 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Akun Default Bawaan Sistem:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickFill('admin', 'Bjp01!')}
              className="text-left p-2 rounded-xl bg-white border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all cursor-pointer group"
            >
              <div className="font-bold text-stone-900 group-hover:text-emerald-900">1. Super Admin</div>
              <div className="text-stone-500">
                User: <code className="font-mono text-emerald-800">admin</code>
              </div>
              <div className="text-stone-500">
                Pass: <code className="font-mono text-emerald-800">Bjp01!</code>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('admin_umkm', 'Bjp01!')}
              className="text-left p-2 rounded-xl bg-white border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all cursor-pointer group"
            >
              <div className="font-bold text-stone-900 group-hover:text-emerald-900">2. Admin UMKM</div>
              <div className="text-stone-500">
                User: <code className="font-mono text-emerald-800">admin_umkm</code>
              </div>
              <div className="text-stone-500">
                Pass: <code className="font-mono text-emerald-800">Bjp01!</code>
              </div>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Username Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5 text-stone-500" />
              <span>Username</span>
            </label>
            <input
              type="text"
              autoFocus
              required
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Masukan username..."
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all font-medium"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-stone-500" />
              <span>Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Masukan password..."
                className="w-full pl-3.5 pr-10 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 rounded-md"
                title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium animate-fade-in">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-stone-600 hover:text-stone-900 text-xs font-semibold rounded-xl hover:bg-stone-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk Sekarang</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
