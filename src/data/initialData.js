export const KAZ_PRODUCTS = [
  'Kolabiz ERP',
  'Other'
];

export const LEAD_SOURCES = [
  'Website',
  'Instagram',
  'Customer Referral',
  'Other Referral',
  'Event',
  'Field Visit'
];

export const INITIAL_STAGES = [
  { id: 'inbound', name: 'Inbound Inquiries', color: '#3b82f6', bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
  { id: 'discovery', name: 'ERP Scope & Discovery', color: '#8b5cf6', bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400' },
  { id: 'proposal', name: 'ERP Demo & Sandbox', color: '#06b6d4', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400' },
  { id: 'negotiation', name: 'Contract & License Terms', color: '#f59e0b', bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
  { id: 'closed_won', name: 'Closed Won (Onboarding)', color: '#10b981', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
  { id: 'closed_lost', name: 'Closed Lost', color: '#ef4444', bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' }
];

export const INITIAL_STAFF = [
  { id: 'stf-admin', name: 'Kolabiz Admin', email: 'kolabizerp@gmail.com', role: 'System Administrator', phone: '+91 98000 00000', status: 'Active' },
  { id: 'stf-101', name: 'Alex Rivers', email: 'alex.rivers@kolabizerp.com', role: 'Senior ERP Consultant', phone: '+91 98765 00001', status: 'Active' },
  { id: 'stf-102', name: 'Priya Sharma', email: 'priya.sharma@kolabizerp.com', role: 'Enterprise Account Executive', phone: '+91 98765 00002', status: 'Active' },
  { id: 'stf-103', name: 'David Chen', email: 'david.chen@kolabizerp.com', role: 'Technical Sales Engineer', phone: '+91 98765 00003', status: 'Active' }
];

// CLEAN PRODUCTION LEADS: Empty array ready for real data entry
export const INITIAL_LEADS = [];

// ADMIN CREDENTIALS CONFIGURATION
export const DEFAULT_ADMIN_EMAIL = 'kolabizerp@gmail.com';
export const DEFAULT_ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Kolabizerp@00916';

export const FOLLOWUP_TEMPLATES = [
  {
    id: 't1',
    title: 'Post-ERP Sandbox & Demo Sync',
    category: 'ERP Demo',
    subject: 'Kolabiz ERP Demo Recap & Next Steps - {{clientName}}',
    body: `Hi {{contactPerson}},\n\nThank you for reviewing the Kolabiz ERP interactive demo! As discussed, Kolabiz ERP will streamline operations for {{clientName}} across finance, inventory, and HR automation.\n\nAttached is our ERP Module Scope, Data Migration Plan, and investment breakdown for {{title}}.\n\nLet's schedule a 20-minute call this week with your team to review sandbox testing feedback.\n\nBest regards,\n{{assignedTo}}\nKolabiz ERP Solutions Team`
  },
  {
    id: 't2',
    title: 'Data Migration & Rollout Scope',
    category: 'ERP Scope',
    subject: 'Data Migration & ERP Implementation Timeline - {{clientName}}',
    body: `Hi {{contactPerson}},\n\nI hope your week is off to a great start! I wanted to check in regarding the Kolabiz ERP proposal for {{clientName}}.\n\nOur ERP implementation team has reserved capacity for Q4 data migration and staff onboarding. Please let me know if your team has any technical questions regarding ERP cloud hosting or legacy system imports.\n\nBest,\n{{assignedTo}}\nKolabiz ERP Team`
  },
  {
    id: 't3',
    title: 'Annual ERP License & SLA Renewal',
    category: 'ERP Retention',
    subject: 'Kolabiz ERP Annual License & SLA Health Review - {{clientName}}',
    body: `Hi {{contactPerson}},\n\nIt's been fantastic seeing {{clientName}} run smoothly on Kolabiz ERP!\n\nAs part of our annual customer success protocol, I'd like to schedule a quick SLA health review to discuss upcoming Kolabiz ERP feature updates and your support renewal.\n\nDo you have 15 minutes open this Thursday or Friday?\n\nWarm regards,\n{{assignedTo}}\nKolabiz Customer Success`
  },
  {
    id: 't4',
    title: 'ERP Module Add-On Upsell',
    category: 'ERP Upsell',
    subject: 'Expand {{clientName}} with New Kolabiz ERP Modules',
    body: `Hi {{contactPerson}},\n\nWe recently released new automated AI workflow modules and multi-warehouse POS syncing for Kolabiz ERP.\n\nSince {{clientName}} is already using Kolabiz ERP, we can activate these add-on modules with zero downtime for your existing staff.\n\nWould you like a 10-minute preview call this week?\n\nBest,\n{{assignedTo}}\nKolabiz ERP`
  }
];

export const SERVICE_MODULES = [
  { id: 'm1', category: 'ERP Core', name: 'Kolabiz ERP Core (General Ledger, Invoicing, Tax)', baseCost: 150000, durationWeeks: 2, icon: 'FileText' },
  { id: 'm2', category: 'Inventory & Supply', name: 'Inventory Management & Multi-Warehouse Tracking', baseCost: 140000, durationWeeks: 3, icon: 'Boxes' },
  { id: 'm3', category: 'HRMS & Payroll', name: 'HRMS Automation, Attendance & Payroll System', baseCost: 160000, durationWeeks: 3, icon: 'Users' },
  { id: 'm4', category: 'CRM & Sales', name: 'Kolabiz CRM, Quotation Engine & Sales Pipeline', baseCost: 120000, durationWeeks: 2, icon: 'Kanban' },
  { id: 'm5', category: 'Manufacturing & MRP', name: 'MRP Work Orders, Bill of Materials & Production', baseCost: 220000, durationWeeks: 4, icon: 'Factory' },
  { id: 'm6', category: 'Retail & POS', name: 'Multi-Store Retail POS & Offline Sync Engine', baseCost: 180000, durationWeeks: 3, icon: 'ShoppingBag' },
  { id: 'm7', category: 'Implementation', name: 'Legacy Data Migration, Configuration & Onboarding', baseCost: 100000, durationWeeks: 2, icon: 'RefreshCw' },
  { id: 'm8', category: 'SLA Retainer', name: 'Annual Kolabiz ERP Cloud SLA & 24/7 Support', baseCost: 60000, durationWeeks: 0, icon: 'ShieldCheck' }
];
