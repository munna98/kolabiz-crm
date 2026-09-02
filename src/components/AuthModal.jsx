import React, { useState } from 'react';
import { ShieldCheck, X, Lock, Mail, LogIn } from 'lucide-react';
import { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD } from '../data/initialData';
import { verifyStaffLoginInSupabase, getSupabaseConfig } from '../lib/supabase';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const inputEmail = email.trim().toLowerCase();
    const config = getSupabaseConfig();

    // 1. Try Supabase Staff table login if connected
    if (config.isConfigured) {
      const dbUser = await verifyStaffLoginInSupabase(inputEmail, password);
      if (dbUser) {
        onLoginSuccess(dbUser);
        setLoading(false);
        onClose();
        return;
      }
    }

    // 2. Default Local Admin Fallback Check
    if (inputEmail === DEFAULT_ADMIN_EMAIL.toLowerCase() && password === DEFAULT_ADMIN_PASSWORD) {
      onLoginSuccess({
        id: 'stf-admin',
        name: 'Kolabiz Admin',
        email: DEFAULT_ADMIN_EMAIL,
        role: 'System Administrator',
        isAdmin: true
      });
      setLoading(false);
      onClose();
    } else {
      setLoading(false);
      setErrorMsg('Invalid credentials. Please enter your registered staff email and password.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-popover text-popover-foreground rounded-lg p-6 shadow-2xl border border-border flex flex-col my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold shadow">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-sans text-foreground">
                Kolabiz ERP Staff & Admin Portal
              </h3>
              <p className="text-xs text-muted-foreground">Sign in with your staff email & password</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          
          {errorMsg && (
            <div className="p-3 rounded-md bg-destructive/15 border border-destructive/30 text-xs text-destructive font-medium">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-primary" /> Staff Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. alex.rivers@kolabizerp.com"
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-primary" /> Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs font-medium rounded-md cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-1.5 px-5 py-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs rounded-md shadow cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Verifying...' : 'Sign In'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
