import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import KanbanBoard from './components/KanbanBoard';
import FollowUpSchedule from './components/FollowUpSchedule';
import ClientRetention from './components/ClientRetention';
import ProposalCalculator from './components/ProposalCalculator';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import StaffManagement from './components/StaffManagement';
import LeadModal from './components/LeadModal';
import SupabaseModal from './components/SupabaseModal';
import AuthModal from './components/AuthModal';
import { INITIAL_LEADS, INITIAL_STAFF } from './data/initialData';
import { 
  fetchLeadsFromSupabase, 
  saveLeadToSupabase, 
  deleteLeadFromSupabase, 
  subscribeToSupabaseLeads,
  fetchStaffFromSupabase,
  saveStaffToSupabase,
  deleteStaffFromSupabase,
  clearAllLeadsInSupabase,
  getSupabaseConfig 
} from './lib/supabase';

export default function App() {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Theme state ('dark' or 'light')
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('kolabiz_theme') || 'dark';
  });

  // Current Logged-in User Session
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('kolabiz_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Staff members state
  const [staff, setStaff] = useState(() => {
    const saved = localStorage.getItem('kolabiz_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  // Leads state with fallback to initialData
  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem('kolabiz_erp_leads');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_LEADS;
      }
    }
    return INITIAL_LEADS;
  });

  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync dark class on <html>
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('kolabiz_theme', theme);
  }, [theme]);

  // Load data from Supabase on mount and subscribe to Realtime updates
  const loadSupabaseData = async () => {
    const dbLeads = await fetchLeadsFromSupabase();
    if (dbLeads) {
      setLeads(dbLeads);
      localStorage.setItem('kolabiz_erp_leads', JSON.stringify(dbLeads));
      showToast('⚡ Live Supabase leads synchronized!');
    }

    const dbStaff = await fetchStaffFromSupabase();
    if (dbStaff && dbStaff.length > 0) {
      setStaff(dbStaff);
      localStorage.setItem('kolabiz_staff', JSON.stringify(dbStaff));
    }
  };

  useEffect(() => {
    loadSupabaseData();

    // Realtime subscription
    const unsubscribe = subscribeToSupabaseLeads((realtimeLeads) => {
      if (realtimeLeads) {
        setLeads(realtimeLeads);
        localStorage.setItem('kolabiz_erp_leads', JSON.stringify(realtimeLeads));
      }
    });

    return () => unsubscribe();
  }, []);

  // Save to LocalStorage whenever leads or staff update locally
  useEffect(() => {
    localStorage.setItem('kolabiz_erp_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('kolabiz_staff', JSON.stringify(staff));
  }, [staff]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLoginSuccess = (userObj) => {
    setCurrentUser(userObj);
    localStorage.setItem('kolabiz_user', JSON.stringify(userObj));
    showToast(`Welcome! Signed in as ${userObj.name}`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('kolabiz_user');
    showToast('Signed out of session.');
  };

  const handleAddStaff = async (newMember) => {
    const updated = [...staff, newMember];
    setStaff(updated);
    showToast(`Added staff member ${newMember.name}`);

    const config = getSupabaseConfig();
    if (config.isConfigured) {
      await saveStaffToSupabase(newMember);
    }
  };

  const handleDeleteStaff = async (id) => {
    const member = staff.find(s => s.id === id);
    const updated = staff.filter(s => s.id !== id);
    setStaff(updated);
    showToast(`Removed staff member ${member ? member.name : ''}`);

    const config = getSupabaseConfig();
    if (config.isConfigured) {
      await deleteStaffFromSupabase(id);
    }
  };

  const handleClearDemoData = async () => {
    setLeads([]);
    localStorage.setItem('kolabiz_erp_leads', JSON.stringify([]));
    showToast('Cleared all demo leads. Ready for real production data entry!');

    const config = getSupabaseConfig();
    if (config.isConfigured) {
      await clearAllLeadsInSupabase();
    }
  };

  const handleSaveLead = async (leadData) => {
    let updatedLeads;
    let targetLead;

    if (leadData.id) {
      // Edit existing
      targetLead = leadData;
      updatedLeads = leads.map(l => (l.id === leadData.id ? leadData : l));
      showToast(`Updated lead for ${leadData.clientName}`);
    } else {
      // Create new
      targetLead = {
        ...leadData,
        id: 'erp-' + Date.now()
      };
      updatedLeads = [targetLead, ...leads];
      showToast(`Created new lead for ${leadData.clientName}`);
    }

    setLeads(updatedLeads);

    // Save to Supabase DB if configured
    const config = getSupabaseConfig();
    if (config.isConfigured) {
      await saveLeadToSupabase(targetLead);
    }
  };

  const handleDeleteLead = async (id) => {
    const target = leads.find(l => l.id === id);
    const updated = leads.filter(l => l.id !== id);
    setLeads(updated);
    showToast(`Deleted lead ${target ? target.clientName : ''}`);

    const config = getSupabaseConfig();
    if (config.isConfigured) {
      await deleteLeadFromSupabase(id);
    }
  };

  const handleUpdateStage = async (id, newStage) => {
    const updated = leads.map(l => {
      if (l.id === id) {
        return { ...l, stage: newStage };
      }
      return l;
    });
    setLeads(updated);
    
    const target = updated.find(l => l.id === id);
    if (target) {
      showToast(`Updated stage for ${target.clientName}`);
      const config = getSupabaseConfig();
      if (config.isConfigured) {
        await saveLeadToSupabase(target);
      }
    }
  };

  const handleUpdateClientHealth = async (id, newHealth) => {
    const updated = leads.map(l => {
      if (l.id === id) {
        return { ...l, clientHealth: newHealth };
      }
      return l;
    });
    setLeads(updated);
    
    const target = updated.find(l => l.id === id);
    if (target) {
      showToast(`Updated health status for ${target.clientName}`);
      const config = getSupabaseConfig();
      if (config.isConfigured) {
        await saveLeadToSupabase(target);
      }
    }
  };

  const handleOpenAddModalWithQuote = (quoteData) => {
    setSelectedLead(null);
    setIsModalOpen(true);
    setActiveTab('pipeline');
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans flex flex-col">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        leads={leads}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenAddModal={() => {
          setSelectedLead(null);
          setIsModalOpen(true);
        }}
      />

      {/* Main Tab Content */}
      <main className="flex-1">
        {activeTab === 'pipeline' && (
          <KanbanBoard
            leads={leads}
            searchQuery={searchQuery}
            onSelectLead={(lead) => {
              setSelectedLead(lead);
              setIsModalOpen(true);
            }}
            onUpdateStage={handleUpdateStage}
            onOpenAddModal={() => {
              setSelectedLead(null);
              setIsModalOpen(true);
            }}
          />
        )}

        {activeTab === 'followups' && (
          <FollowUpSchedule
            leads={leads}
            onSelectLead={(lead) => {
              setSelectedLead(lead);
              setIsModalOpen(true);
            }}
          />
        )}

        {activeTab === 'retention' && (
          <ClientRetention
            leads={leads}
            onSelectLead={(lead) => {
              setSelectedLead(lead);
              setIsModalOpen(true);
            }}
            onUpdateClientHealth={handleUpdateClientHealth}
          />
        )}

        {activeTab === 'proposal' && (
          <ProposalCalculator
            onOpenAddModalWithQuote={handleOpenAddModalWithQuote}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            leads={leads}
          />
        )}

        {activeTab === 'staff' && (
          <StaffManagement
            staff={staff}
            onAddStaff={handleAddStaff}
            onDeleteStaff={handleDeleteStaff}
            onClearDemoData={handleClearDemoData}
            currentUser={currentUser}
          />
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-3 bg-primary text-primary-foreground font-medium text-xs rounded-lg shadow-xl border border-border animate-fade-in flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Lead Management Modal */}
      <LeadModal
        lead={selectedLead}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLead(null);
        }}
        onSave={handleSaveLead}
        onDelete={handleDeleteLead}
        staff={staff}
        currentUser={currentUser}
      />

      {/* Supabase Connection Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onConfigSaved={() => {
          loadSupabaseData();
        }}
      />

      {/* Admin Auth Login Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}
