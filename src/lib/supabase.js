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

// Data sanitization helpers to prevent Postgres DATE / syntax errors
const sanitizeDate = (val) => {
  if (!val || typeof val !== 'string') return null;
  const trimmed = val.trim();
  return trimmed !== '' ? trimmed : null;
};

const sanitizeString = (val) => {
  if (!val || typeof val !== 'string') return null;
  const trimmed = val.trim();
  return trimmed !== '' ? trimmed : null;
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
    location: row.location || 'Mumbai, Maharashtra',
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
    id: String(lead.id),
    client_name: lead.clientName || 'Unnamed Client',
    contact_person: lead.contactPerson || 'N/A',
    email: sanitizeString(lead.email),
    phone: sanitizeString(lead.phone),
    location: lead.location || 'Mumbai, Maharashtra',
    product: lead.product || 'Kolabiz ERP',
    title: lead.title || lead.product || 'Kolabiz ERP',
    value: Number(lead.value) || 0,
    stage: lead.stage || 'inbound',
    lead_score: lead.leadScore || 'Warm',
    source: lead.source || 'Website',
    last_contact_date: sanitizeDate(lead.lastContactDate),
    next_follow_up: sanitizeDate(lead.nextFollowUp),
    assigned_to: lead.assignedTo || 'Alex Rivers',
    notes: sanitizeString(lead.notes),
    client_health: lead.clientHealth || 'Green',
    onboarding_stage: lead.onboardingStage || 'Data Migration',
    support_renewal_date: sanitizeDate(lead.supportRenewalDate),
    deployment_type: lead.deploymentType || 'On-Premise'
  };
};

export const mapActivityToDB = (act, leadId) => {
  return {
    id: String(act.id),
    lead_id: String(leadId),
    type: act.type || 'Note',
    date: sanitizeDate(act.date) || new Date().toISOString().split('T')[0],
    summary: act.summary || '',
    author: act.author || 'Sales Agent'
  };
};

// ----------------------------------------------------
// SUPABASE REALTIME CRUD OPERATIONS - LEADS & ACTIVITIES
// ----------------------------------------------------

export const fetchLeadsFromSupabase = async () => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    let leadsData = null;

    // 1. Try ordering by created_at first
    const resWithOrder = await client
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (resWithOrder.error) {
      // Fallback: fetch without created_at ordering if column doesn't exist
      const resWithoutOrder = await client.from('leads').select('*');
      if (resWithoutOrder.error) throw resWithoutOrder.error;
      leadsData = resWithoutOrder.data;
    } else {
      leadsData = resWithOrder.data;
    }

    // 2. Fetch activities safely without breaking lead fetch if activities table has issues
    let activitiesByLead = {};
    try {
      const { data: activitiesData } = await client
        .from('activities')
        .select('*');
      
      (activitiesData || []).forEach(act => {
        if (!activitiesByLead[act.lead_id]) activitiesByLead[act.lead_id] = [];
        activitiesByLead[act.lead_id].push(mapActivityFromDB(act));
      });
    } catch (e) {
      console.warn('Activities table fetch skipped or failed:', e);
    }

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
  if (!client) return { success: false, error: 'Supabase client is not configured' };

  try {
    const dbLead = mapLeadToDB(lead);

    // 1. Upsert full lead object (without .select() to mirror staff saving & avoid RLS RETURNING restriction)
    let { error: leadErr } = await client
      .from('leads')
      .upsert(dbLead, { onConflict: 'id' });

    // 2. If a column mismatch error occurs (e.g. Postgres code 42703 for missing location/deployment_type column),
    // retry with core fields to guarantee database persistence on older schema tables.
    if (leadErr && (leadErr.code === '42703' || leadErr.message?.includes('column'))) {
      console.warn('Retrying lead upsert with core schema fields due to column mismatch:', leadErr.message);
      const coreLead = {
        id: String(lead.id),
        client_name: lead.clientName || 'Unnamed Client',
        contact_person: lead.contactPerson || 'N/A',
        email: sanitizeString(lead.email),
        phone: sanitizeString(lead.phone),
        product: lead.product || 'Kolabiz ERP',
        title: lead.title || lead.product || 'Kolabiz ERP',
        value: Number(lead.value) || 0,
        stage: lead.stage || 'inbound',
        lead_score: lead.leadScore || 'Warm',
        source: lead.source || 'Website',
        last_contact_date: sanitizeDate(lead.lastContactDate),
        next_follow_up: sanitizeDate(lead.nextFollowUp),
        assigned_to: lead.assignedTo || 'Alex Rivers',
        notes: sanitizeString(lead.notes)
      };

      const retryRes = await client
        .from('leads')
        .upsert(coreLead, { onConflict: 'id' });
      leadErr = retryRes.error;
    }

    if (leadErr) throw leadErr;

    // 3. Save activities safely if present
    if (lead.activities && lead.activities.length > 0) {
      try {
        const dbActivities = lead.activities
          .filter(a => a && a.summary)
          .map(a => mapActivityToDB(a, lead.id));

        if (dbActivities.length > 0) {
          await client
            .from('activities')
            .upsert(dbActivities, { onConflict: 'id' });
        }
      } catch (actErr) {
        console.warn('Could not save activities to Supabase:', actErr);
      }
    }

    return { success: true };
  } catch (err) {
    console.error('Error saving lead to Supabase:', err);
    return { success: false, error: err.message || 'Failed to save lead to database' };
  }
};

export const deleteLeadFromSupabase = async (id) => {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client is not configured' };

  try {
    const { error } = await client.from('leads').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Error deleting lead from Supabase:', err);
    return { success: false, error: err.message || 'Failed to delete lead from database' };
  }
};

export const clearAllLeadsInSupabase = async () => {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client is not configured' };

  try {
    const { error } = await client.from('leads').delete().neq('id', '000');
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Error clearing leads in Supabase:', err);
    return { success: false, error: err.message || 'Failed to clear leads in database' };
  }
};

export const testSupabaseConnection = async () => {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase credentials missing. Please enter Project URL & Anon Key.' };
  }

  try {
    const { count, error } = await client
      .from('leads')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    return { 
      success: true, 
      message: `Successfully connected to Supabase! Leads table verified (${count !== null ? count : 0} existing records).` 
    };
  } catch (err) {
    console.error('Supabase connection test failed:', err);
    return { 
      success: false, 
      error: err.message || 'Could not query leads table in Supabase. Check database schema.' 
    };
  }
};

// ----------------------------------------------------
// SUPABASE CRUD & AUTH OPERATIONS - STAFF MEMBERS
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
      password: s.password,
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
  if (!client) return { success: false, error: 'Supabase client is not configured' };

  try {
    const { error } = await client
      .from('staff')
      .upsert({
        id: member.id,
        name: member.name,
        email: member.email,
        password: member.password || 'Kolabizerp@00916',
        role: member.role,
        phone: member.phone,
        status: member.status
      }, { onConflict: 'id' });

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Error saving staff member:', err);
    return { success: false, error: err.message || 'Failed to save staff member to database' };
  }
};

export const deleteStaffFromSupabase = async (id) => {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase client is not configured' };

  try {
    const { error } = await client.from('staff').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Error deleting staff from Supabase:', err);
    return { success: false, error: err.message || 'Failed to delete staff member from database' };
  }
};

// Live password check against Supabase staff table
export const verifyStaffLoginInSupabase = async (email, password) => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('staff')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .eq('password', password)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      isAdmin: data.role.toLowerCase().includes('admin') || data.email === 'kolabizerp@gmail.com'
    };
  } catch (err) {
    console.error('Error verifying login in Supabase:', err);
    return null;
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
