import { createClient } from '@supabase/supabase-js';

// Helper to get active URL & Anon Key from env OR localStorage
export const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const localUrl = localStorage.getItem('kolabiz_supabase_url');
  const localKey = localStorage.getItem('kolabiz_supabase_anon_key');

  const url = envUrl || localUrl || '';
  const key = envKey || localKey || '';

  return { url, key, isConfigured: Boolean(url && key) };
};

// Initialize Supabase client if configured
let supabaseInstance = null;

export const getSupabaseClient = () => {
  const { url, key, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  if (!supabaseInstance) {
    supabaseInstance = createClient(url, key);
  }
  return supabaseInstance;
};

// Map DB snake_case column names to camelCase JS objects
export const mapLeadFromDB = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    clientName: row.client_name,
    contactPerson: row.contact_person,
    email: row.email,
    phone: row.phone,
    product: row.product || 'Kolabiz ERP',
    title: row.title,
    value: Number(row.value) || 0,
    stage: row.stage,
    leadScore: row.lead_score,
    source: row.source,
    lastContactDate: row.last_contact_date,
    nextFollowUp: row.next_follow_up,
    assignedTo: row.assigned_to,
    notes: row.notes,
    clientHealth: row.client_health,
    onboardingStage: row.onboarding_stage,
    supportRenewalDate: row.support_renewal_date,
    deploymentType: row.deployment_type || 'On-Premise',
    activities: row.activities ? row.activities.map(mapActivityFromDB) : []
  };
};

export const mapActivityFromDB = (act) => {
  if (!act) return null;
  return {
    id: act.id,
    type: act.type,
    date: act.date,
    summary: act.summary,
    author: act.author
  };
};

export const mapLeadToDB = (lead) => {
  return {
    id: lead.id,
    client_name: lead.clientName,
    contact_person: lead.contactPerson,
    email: lead.email,
    phone: lead.phone,
    product: lead.product || 'Kolabiz ERP',
    title: lead.title,
    value: lead.value || 0,
    stage: lead.stage,
    lead_score: lead.leadScore,
    source: lead.source,
    last_contact_date: lead.lastContactDate,
    next_follow_up: lead.nextFollowUp,
    assigned_to: lead.assignedTo,
    notes: lead.notes,
    client_health: lead.clientHealth,
    onboarding_stage: lead.onboardingStage,
    support_renewal_date: lead.supportRenewalDate,
    deployment_type: lead.deploymentType || 'On-Premise'
  };
};

export const mapActivityToDB = (act, leadId) => {
  return {
    id: act.id,
    lead_id: leadId,
    type: act.type,
    date: act.date,
    summary: act.summary,
    author: act.author
  };
};

// ----------------------------------------------------
// SUPABASE REALTIME CRUD OPERATIONS - LEADS & ACTIVITIES
// ----------------------------------------------------

export const fetchLeadsFromSupabase = async () => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data: leadsData, error: leadsErr } = await client
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (leadsErr) throw leadsErr;

    const { data: activitiesData, error: actErr } = await client
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false });

    if (actErr) console.warn('Could not fetch activities:', actErr);

    const activitiesByLead = {};
    (activitiesData || []).forEach(act => {
      if (!activitiesByLead[act.lead_id]) activitiesByLead[act.lead_id] = [];
      activitiesByLead[act.lead_id].push(mapActivityFromDB(act));
    });

    return (leadsData || []).map(row => {
      const mapped = mapLeadFromDB(row);
      mapped.activities = activitiesByLead[row.id] || [];
      return mapped;
    });
  } catch (err) {
    console.error('Error fetching from Supabase:', err);
    return null;
  }
};

export const saveLeadToSupabase = async (lead) => {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const dbLead = mapLeadToDB(lead);
    const { error: leadErr } = await client
      .from('leads')
      .upsert(dbLead, { onConflict: 'id' });

    if (leadErr) throw leadErr;

    if (lead.activities && lead.activities.length > 0) {
      const dbActivities = lead.activities.map(a => mapActivityToDB(a, lead.id));
      await client
        .from('activities')
        .upsert(dbActivities, { onConflict: 'id' });
    }

    return true;
  } catch (err) {
    console.error('Error saving lead to Supabase:', err);
    return false;
  }
};

export const deleteLeadFromSupabase = async (id) => {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('leads').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error deleting lead from Supabase:', err);
    return false;
  }
};

export const clearAllLeadsInSupabase = async () => {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('leads').delete().neq('id', '000');
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error clearing leads in Supabase:', err);
    return false;
  }
};

// ----------------------------------------------------
// SUPABASE CRUD OPERATIONS - STAFF MEMBERS
// ----------------------------------------------------

export const fetchStaffFromSupabase = async () => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('staff')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    return (data || []).map(s => ({
      id: s.id,
      name: s.name,
      email: s.email,
      role: s.role,
      phone: s.phone,
      status: s.status
    }));
  } catch (err) {
    console.error('Error fetching staff from Supabase:', err);
    return null;
  }
};

export const saveStaffToSupabase = async (member) => {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('staff')
      .upsert({
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        phone: member.phone,
        status: member.status
      }, { onConflict: 'id' });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error saving staff member:', err);
    return false;
  }
};

export const deleteStaffFromSupabase = async (id) => {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('staff').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error deleting staff from Supabase:', err);
    return false;
  }
};

// Realtime listener
export const subscribeToSupabaseLeads = (onDataChanged) => {
  const client = getSupabaseClient();
  if (!client) return () => {};

  const channel = client
    .channel('kolabiz-leads-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'leads' },
      () => {
        fetchLeadsFromSupabase().then(updated => {
          if (updated) onDataChanged(updated);
        });
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'activities' },
      () => {
        fetchLeadsFromSupabase().then(updated => {
          if (updated) onDataChanged(updated);
        });
      }
    )
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
};
