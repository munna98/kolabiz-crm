-- =======================================================
-- KOLABIZ ERP GROWTHENGINE - SUPABASE DATABASE SCHEMA
-- Execute this SQL in your Supabase SQL Editor
-- =======================================================

-- 1. Create LEADS table
CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    product TEXT DEFAULT 'Kolabiz ERP',
    title TEXT,
    value NUMERIC DEFAULT 15000,
    stage TEXT DEFAULT 'inbound',
    lead_score TEXT DEFAULT 'Warm',
    source TEXT DEFAULT 'Website',
    last_contact_date DATE DEFAULT CURRENT_DATE,
    next_follow_up DATE,
    assigned_to TEXT DEFAULT 'Alex Rivers',
    notes TEXT,
    client_health TEXT DEFAULT 'Green',
    onboarding_stage TEXT DEFAULT 'Data Migration',
    support_renewal_date DATE,
    deployment_type TEXT DEFAULT 'On-Premise',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create ACTIVITIES table
CREATE TABLE IF NOT EXISTS public.activities (
    id TEXT PRIMARY KEY,
    lead_id TEXT REFERENCES public.leads(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    summary TEXT NOT NULL,
    author TEXT DEFAULT 'Sales Agent',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create STAFF table
CREATE TABLE IF NOT EXISTS public.staff (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'Sales Representative',
    phone TEXT,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Enable Row Level Security (RLS) and allow public access for demo
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read and write access on leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read and write access on activities" ON public.activities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read and write access on staff" ON public.staff FOR ALL USING (true) WITH CHECK (true);

-- 5. Enable Supabase Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activities;
ALTER PUBLICATION supabase_realtime ADD TABLE public.staff;

-- 6. Seed Default Admin & Initial Staff
INSERT INTO public.staff (id, name, email, role, phone, status)
VALUES 
('stf-admin', 'Kolabiz Admin', 'kolabizerp@gmail.com', 'System Administrator', '+91 98000 00000', 'Active'),
('stf-101', 'Alex Rivers', 'alex.rivers@kolabizerp.com', 'Senior ERP Consultant', '+91 98765 00001', 'Active'),
('stf-102', 'Priya Sharma', 'priya.sharma@kolabizerp.com', 'Enterprise Account Executive', '+91 98765 00002', 'Active'),
('stf-103', 'David Chen', 'david.chen@kolabizerp.com', 'Technical Sales Engineer', '+91 98765 00003', 'Active')
ON CONFLICT (id) DO NOTHING;
