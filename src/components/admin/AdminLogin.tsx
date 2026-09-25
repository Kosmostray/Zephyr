import React, { useState } from 'react';
import { Lock, User, ShieldAlert, ArrowRight, ShieldCheck } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Default credentials (can be customized or placed in env)
  const ADMIN_USER = 'admin';
  const ADMIN_PASS = 'zephyr2026';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === ADMIN_USER && password.trim() === ADMIN_PASS) {
      sessionStorage.setItem('zephyr_admin_auth', 'true');
      onLoginSuccess();
    } else {
      setError('Invalid username or password. Please verify credentials.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md liquid-glass p-8 sm:p-10 rounded-3xl border border-white/15 shadow-2xl text-left relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#f0a500]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#f0a500]/15 border border-[#f0a500]/30 flex items-center justify-center text-[#f0a500]">
            <ShieldCheck size={26} />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-white tracking-wide">
              Operator Portal
            </h2>
            <p className="text-xs font-mono text-[#f0a500] uppercase tracking-wider">
              Zephyr Executive Chauffeur
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <ShieldAlert size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs uppercase font-mono tracking-wider text-white/70">
              Operator Username
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#f0a500]" size={17} />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError('');
                }}
                placeholder="admin"
                className="w-full bg-black/60 border border-white/20 focus:border-[#f0a500] rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:bg-black/80 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs uppercase font-mono tracking-wider text-white/70">
              Security Key / Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#f0a500]" size={17} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="••••••••••••"
                className="w-full bg-black/60 border border-white/20 focus:border-[#f0a500] rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:bg-black/80 transition-all"
              />
            </div>
            <p className="text-[11px] text-white/40 pt-0.5">
              Default access: <span className="font-mono text-white/70">admin</span> / <span className="font-mono text-white/70">zephyr2026</span>
            </p>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest bg-[#f0a500] hover:bg-[#d99400] text-black amber-glow transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
            >
              <span>Authenticate Session</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
