import React, { useState } from 'react';
import { 
  Kanban, 
  Clock, 
  HeartHandshake, 
  Calculator, 
  BarChart3, 
  Plus, 
  Search, 
  Sparkles, 
  AlertCircle,
  TrendingUp,
  IndianRupee,
  Sun,
  Moon,
  Database,
  Users,
  UserCheck,
  LogIn,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { getSupabaseConfig } from '../lib/supabase';
import ConfirmModal from './ConfirmModal';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  leads, 
  onOpenAddModal, 
  searchQuery, 
  setSearchQuery,
  theme,
  onToggleTheme,
  onOpenSupabaseModal,
  currentUser,
  onOpenAuthModal,
  onLogout
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isConfirmingLogout, setIsConfirmingLogout] = useState(false);
  const supabaseConfig = getSupabaseConfig();

  const activeLeads = leads.filter(l => l.stage !== 'closed_won' && l.stage !== 'closed_lost');
  const pipelineValue = activeLeads.reduce((sum, l) => sum + (l.value || 0), 0);
  
  const todayStr = new Date().toISOString().split('T')[0];
  const overdueFollowups = activeLeads.filter(l => l.nextFollowUp && l.nextFollowUp < todayStr);
  
  const closedWonClients = leads.filter(l => l.stage === 'closed_won');
  const atRiskClients = closedWonClients.filter(l => l.clientHealth === 'Amber' || l.clientHealth === 'Red');

  const navItems = [
    { id: 'pipeline', label: 'ERP Lead Pipeline', icon: Kanban, badge: activeLeads.length },
    { id: 'followups', label: 'ERP Follow-Up Engine', icon: Clock, badge: overdueFollowups.length, badgeUrgent: overdueFollowups.length > 0 },
    { id: 'retention', label: 'Client SLA & Retention', icon: HeartHandshake, badge: atRiskClients.length, badgeWarning: atRiskClients.length > 0 },
    { id: 'proposal', label: 'ERP Proposal Calculator', icon: Calculator },
    { id: 'analytics', label: 'Sales Intelligence', icon: BarChart3 },
    { id: 'staff', label: 'Team Members', icon: Users },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            {/* Top Row Logo & Mobile Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold shadow">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-lg font-bold font-sans tracking-tight text-foreground">
                      KOLABIZ <span className="text-primary">ERP GrowthEngine</span>
                    </h1>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border">
                      v3.0 Live
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Kolabiz ERP Sales Pipeline & Client Retention</p>
                </div>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md bg-secondary text-secondary-foreground border border-border cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Metric Badges & Database Status */}
            <div className="hidden md:flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
              
              {/* Supabase Status Button */}
              <button
                onClick={onOpenSupabaseModal}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all border cursor-pointer ${
                  supabaseConfig.isConfigured
                    ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/25'
                    : 'bg-amber-500/15 text-amber-600 border-amber-500/30 hover:bg-amber-500/25'
                }`}
                title="Click to configure Supabase Database credentials"
              >
                <Database className="w-3.5 h-3.5" />
                <span>{supabaseConfig.isConfigured ? '⚡ Supabase Live' : '💾 Local Mode'}</span>
              </button>

              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-secondary/60 border border-border text-xs">
                <IndianRupee className="w-3.5 h-3.5 text-primary" />
                <span className="text-muted-foreground">ERP Pipeline:</span>
                <span className="font-bold text-foreground font-mono">₹{pipelineValue.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-secondary/60 border border-border text-xs">
                <TrendingUp className="w-3.5 h-3.5 text-primary" />
                <span className="text-muted-foreground">Active Leads:</span>
                <span className="font-bold text-foreground">{activeLeads.length}</span>
              </div>

              {overdueFollowups.length > 0 ? (
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-destructive/15 border border-destructive/30 text-xs animate-pulse-subtle">
                  <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                  <span className="text-destructive font-medium">Overdue:</span>
                  <span className="font-bold text-destructive">{overdueFollowups.length}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-secondary/60 border border-border text-xs">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span className="text-muted-foreground">SLA Clean</span>
                </div>
              )}
            </div>

            {/* Search, Auth, Theme Toggle, & Add Lead Button */}
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 md:w-48">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search ERP leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-input border border-border rounded-md text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
              </div>

              {/* Auth Button */}
              {currentUser ? (
                <button
                  onClick={() => setIsConfirmingLogout(true)}
                  title={`Logged in as ${currentUser.name}. Click to log out.`}
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer shrink-0"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
                  <LogOut className="w-3 h-3 ml-1 text-muted-foreground" />
                </button>
              ) : (
                <button
                  onClick={onOpenAuthModal}
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border text-xs font-medium transition-all cursor-pointer shrink-0"
                  title="Staff & Admin Sign In"
                >
                  <LogIn className="w-3.5 h-3.5 text-primary" />
                  <span className="hidden sm:inline">Staff Sign In</span>
                </button>
              )}

              <button
                onClick={onToggleTheme}
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                className="p-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border transition-colors cursor-pointer shrink-0"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700" />
                )}
              </button>
              
              <button
                onClick={onOpenAddModal}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-xs rounded-md shadow transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Lead</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>

          </div>

          {/* Navigation Tabs (Desktop & Mobile Drawer) */}
          <nav className={`md:flex items-center space-x-1 mt-3 pt-2 border-t border-border overflow-x-auto ${mobileMenuOpen ? 'flex flex-col space-y-1 space-x-0' : 'hidden md:flex'}`}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 px-3.5 py-2 md:py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap cursor-pointer w-full md:w-auto justify-between md:justify-start ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                      item.badgeUrgent 
                        ? 'bg-destructive text-destructive-foreground' 
                        : item.badgeWarning
                        ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Styled Confirmation Custom Modal for Logout */}
      <ConfirmModal
        isOpen={isConfirmingLogout}
        onClose={() => setIsConfirmingLogout(false)}
        onConfirm={() => {
          onLogout();
          setIsConfirmingLogout(false);
        }}
        title="Sign Out of Session"
        message={`Are you sure you want to sign out of your staff session, ${currentUser?.name}?`}
        confirmText="Sign Out"
        cancelText="Cancel"
        isDestructive={false}
      />
    </>
  );
}
