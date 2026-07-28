import React, { useState } from 'react';
import { Lock, ShieldAlert, X, KeyRound } from 'lucide-react';
import { BJP_LOGO_URL } from '../assets/logo';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  logoUrl?: string;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  logoUrl,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const displayLogo = logoUrl || BJP_LOGO_URL;

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Bjp01!') {
      setError(false);
      setPassword('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-stone-200 relative space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
          <img
            src={displayLogo}
            alt="BJP HUB"
            className="w-10 h-10 rounded-md object-cover border border-amber-400 shadow-xs"
          />
          <div>
            <h3 className="font-bold text-stone-900 text-base sm:text-lg">
              Akses CMS Pengurus
            </h3>
            <p className="text-xs text-stone-500">
              Masukan password pengurus untuk mengelola data
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-stone-500" />
              <span>Password Pengurus</span>
            </label>
            <input
              type="password"
              autoFocus
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(false);
              }}
              placeholder="Masukan password..."
              className={`w-full px-3.5 py-2.5 bg-stone-50 border ${
                error ? 'border-red-500 ring-1 ring-red-500' : 'border-stone-300'
              } rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all`}
            />
            {error && (
              <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium pt-1">
                <ShieldAlert className="w-4 h-4" />
                <span>Password salah! Silakan coba lagi.</span>
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-semibold rounded-xl hover:bg-stone-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              Masuk CMS
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
