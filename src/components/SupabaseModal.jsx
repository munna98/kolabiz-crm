import React, { useState } from 'react';
import { Database, X, Check, Save, Copy, Sparkles, ExternalLink, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getSupabaseConfig, testSupabaseConnection } from '../lib/supabase';

export default function SupabaseModal({ isOpen, onClose, onConfigSaved }) {
  const currentConfig = getSupabaseConfig();

  const [url, setUrl] = useState(currentConfig.url || '');
  const [key, setKey] = useState(currentConfig.key || '');
  const [copiedSql, setCopiedSql] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('kolabiz_supabase_url', url.trim());
    localStorage.setItem('kolabiz_supabase_anon_key', key.trim());
    onConfigSaved();
    onClose();
  };

  const handleDisconnect = () => {
    localStorage.removeItem('kolabiz_supabase_url');
    localStorage.removeItem('kolabiz_supabase_anon_key');
    setUrl('');
    setKey('');
    setTestResult(null);
    onConfigSaved();
    onClose();
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    // Save inputs to localStorage temporarily to test client
    localStorage.setItem('kolabiz_supabase_url', url.trim());
    localStorage.setItem('kolabiz_supabase_anon_key', key.trim());

    const result = await testSupabaseConnection();
    setTestResult(result);
    setIsTesting(false);
  };

  const sqlSnippet = `-- Execute in Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    email TEXT, phone TEXT, product TEXT DEFAULT 'Kolabiz ERP',
    title TEXT, value NUMERIC DEFAULT 15000, stage TEXT DEFAULT 'inbound',
    lead_score TEXT DEFAULT 'Warm', source TEXT DEFAULT 'Website',
    last_contact_date DATE DEFAULT CURRENT_DATE, next_follow_up DATE,
    assigned_to TEXT DEFAULT 'Alex Rivers', notes TEXT,
    client_health TEXT DEFAULT 'Green', onboarding_stage TEXT DEFAULT 'Data Migration',
    support_renewal_date DATE, deployment_type TEXT DEFAULT 'On-Premise',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.activities (
    id TEXT PRIMARY KEY, lead_id TEXT REFERENCES public.leads(id) ON DELETE CASCADE,
    type TEXT NOT NULL, date DATE DEFAULT CURRENT_DATE, summary TEXT NOT NULL,
    author TEXT DEFAULT 'Sales Agent',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read and write access on leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read and write access on activities" ON public.activities FOR ALL USING (true) WITH CHECK (true);
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activities;`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSnippet);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-popover text-popover-foreground rounded-lg p-6 shadow-2xl border border-border max-h-[90vh] flex flex-col my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold shadow">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-sans text-foreground flex items-center gap-2">
                <span>Connect Supabase Database</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  currentConfig.isConfigured ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                }`}>
                  {currentConfig.isConfigured ? '⚡ Connected' : '💾 Local Mode'}
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Connect your PostgreSQL Supabase database for live multi-user sync.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
          
          <div className="p-3 rounded-md bg-muted/40 border border-border text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-foreground">
              <span className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-emerald-500" /> Step 1: Execute Table Creation SQL
              </span>
              <button
                type="button"
                onClick={copySql}
                className="flex items-center space-x-1 px-2.5 py-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 text-[11px] rounded border border-border cursor-pointer"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'SQL Copied!' : 'Copy SQL Schema'}</span>
              </button>
            </div>
            <p className="text-muted-foreground">
              Open your Supabase dashboard at <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-primary hover:underline inline-flex items-center gap-0.5">supabase.com/dashboard <ExternalLink className="w-3 h-3" /></a>, go to <strong>SQL Editor</strong>, paste and run the SQL schema.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Step 2: Enter Supabase Credentials
            </h4>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Supabase Project URL (VITE_SUPABASE_URL)
              </label>
              <input
                type="url"
                required
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://xyzxyzxyz.supabase.co"
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Supabase Anon API Key (VITE_SUPABASE_ANON_KEY)
              </label>
              <input
                type="text"
                required
                value={key}
                onChange={e => setKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Connection Test Diagnostic Banner */}
          {testResult && (
            <div className={`p-3 rounded-md border text-xs flex items-start gap-2 ${
              testResult.success 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
                : 'bg-destructive/10 border-destructive/30 text-destructive'
            }`}>
              {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
              <div>
                <p className="font-bold">{testResult.success ? 'Connection Verified' : 'Database Connection Failed'}</p>
                <p className="mt-0.5">{testResult.success ? testResult.message : testResult.error}</p>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting || !url || !key}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs font-semibold rounded border border-border disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Testing DB...' : 'Test Connection'}</span>
            </button>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-border flex items-center justify-between">
            {currentConfig.isConfigured ? (
              <button
                type="button"
                onClick={handleDisconnect}
                className="px-3 py-2 bg-destructive/15 text-destructive hover:bg-destructive/25 text-xs font-medium rounded-md border border-destructive/30 cursor-pointer"
              >
                Disconnect Supabase
              </button>
            ) : <div />}

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs font-medium rounded-md cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-md shadow cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Connect & Load Real Data</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
