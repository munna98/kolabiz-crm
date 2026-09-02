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

export const INITIAL_LEADS = [
  {
    id: 'erp-101',
    clientName: 'Apex Manufacturing Industries',
    contactPerson: 'Marcus Vance (VP Operations)',
    email: 'marcus.vance@apexmfg.com',
    phone: '+91 98765 43210',
    product: 'Kolabiz ERP',
    title: 'Manufacturing & Inventory MRP Suite',
    value: 850000,
    stage: 'proposal',
    leadScore: 'Hot',
    source: 'Website',
    lastContactDate: '2026-08-30',
    nextFollowUp: '2026-09-02',
    assignedTo: 'Alex Rivers',
    notes: 'Prospect tested Kolabiz ERP MRP sandbox. Wants data migration from legacy SAP and custom barcode scanner integration.',
    activities: [
      { id: 'a1', type: 'Demo', date: '2026-08-30', summary: 'Live Kolabiz ERP Manufacturing Demo with VP Operations Marcus Vance.', author: 'Alex Rivers' },
      { id: 'a2', type: 'Email', date: '2026-08-28', summary: 'Sent license quote & implementation rollout timeline.', author: 'Alex Rivers' }
    ],
    clientHealth: 'Green',
    onboardingStage: 'Data Migration',
    supportRenewalDate: '2027-09-01',
    deploymentType: 'On-Premise'
  },
  {
    id: 'erp-102',
    clientName: 'HealthFlow Retail Chain & Logistics',
    contactPerson: 'Elena Rostova (Head of IT)',
    email: 'elena@healthflow.io',
    phone: '+91 98123 45678',
    product: 'Kolabiz ERP',
    title: 'Multi-Store POS & Central Warehouse Sync (45 Outlets)',
    value: 1250000,
    stage: 'negotiation',
    leadScore: 'Hot',
    source: 'Customer Referral',
    lastContactDate: '2026-08-27',
    nextFollowUp: '2026-09-01',
    assignedTo: 'Priya Sharma',
    notes: 'Legal reviewing annual cloud SLA retainer & multi-outlet POS offline sync guarantees.',
    activities: [
      { id: 'a3', type: 'Meeting', date: '2026-08-27', summary: 'Final commercial negotiation. Approved ₹12.5 Lakhs for 45 outlets + 1 year SLA.', author: 'Priya Sharma' }
    ],
    clientHealth: 'Green',
    onboardingStage: 'Contract Execution',
    supportRenewalDate: '2027-08-15',
    deploymentType: 'Hybrid Cloud'
  },
  {
    id: 'erp-103',
    clientName: 'OmniLogistics Supply Chain Ltd',
    contactPerson: 'David Miller (CFO)',
    email: 'dmiller@omnilogistics.co',
    phone: '+91 97654 32109',
    product: 'Kolabiz ERP',
    title: 'Financials & Automated HRMS Suite',
    value: 650000,
    stage: 'discovery',
    leadScore: 'Warm',
    source: 'Field Visit',
    lastContactDate: '2026-08-25',
    nextFollowUp: '2026-09-03',
    assignedTo: 'David Chen',
    notes: 'Currently using QuickBooks & Excel spreadsheets. Seeking integrated ERP accounting, automated payroll, and multi-currency reporting.',
    activities: [
      { id: 'a4', type: 'Call', date: '2026-08-25', summary: 'Discovery call completed. Requirements: General Ledger, Payroll, Tax compliance.', author: 'David Chen' }
    ],
    clientHealth: 'Amber',
    onboardingStage: 'Discovery',
    supportRenewalDate: '2027-07-20',
    deploymentType: 'On-Premise'
  },
  {
    id: 'erp-104',
    clientName: 'NovaEdu Multi-Campus Academy',
    contactPerson: 'Dr. Aris Thorne (CEO)',
    email: 'aris@novaedu.org',
    phone: '+91 99887 76655',
    product: 'Kolabiz ERP',
    title: 'Campus Management & Fee Billing Module',
    value: 450000,
    stage: 'inbound',
    leadScore: 'Hot',
    source: 'Instagram',
    lastContactDate: '2026-09-01',
    nextFollowUp: '2026-09-02',
    assignedTo: 'Alex Rivers',
    notes: 'Submitted web inquiry requesting Kolabiz ERP demo for student fee billing & staff HR payroll.',
    activities: [
      { id: 'a5', type: 'Email', date: '2026-09-01', summary: 'Sent automated ERP feature brochure & sandbox access credentials.', author: 'System' }
    ],
    clientHealth: 'Green',
    onboardingStage: 'Kickoff',
    supportRenewalDate: '2027-09-01',
    deploymentType: 'Cloud SaaS'
  },
  {
    id: 'erp-105',
    clientName: 'Veloce Commerce Global',
    contactPerson: 'Samantha Wright (Director)',
    email: 'sam@velocecommerce.com',
    phone: '+91 98989 89898',
    product: 'Kolabiz ERP',
    title: 'E-Commerce Sync & Warehouse Automation',
    value: 780000,
    stage: 'closed_won',
    leadScore: 'Hot',
    source: 'Event',
    lastContactDate: '2026-08-15',
    nextFollowUp: '2026-09-15',
    assignedTo: 'Priya Sharma',
    notes: 'Contract signed! Phase 1 Data Migration & Staff Training in progress.',
    activities: [
      { id: 'a6', type: 'Meeting', date: '2026-08-15', summary: 'Kolabiz ERP Implementation Kickoff meeting with head accountant & inventory leads.', author: 'Priya Sharma' }
    ],
    clientHealth: 'Green',
    onboardingStage: 'Staff Training',
    supportRenewalDate: '2027-08-15',
    deploymentType: 'On-Premise'
  },
  {
    id: 'erp-106',
    clientName: 'BioHealth Diagnostic Labs',
    contactPerson: 'Kevin Patel (COO)',
    email: 'kevin@biohealthlabs.net',
    phone: '+91 91234 56789',
    product: 'Kolabiz ERP',
    title: 'Core Financials & Procurement SLA',
    value: 520000,
    stage: 'closed_won',
    leadScore: 'Warm',
    source: 'Other Referral',
    lastContactDate: '2026-07-20',
    nextFollowUp: '2026-09-01',
    assignedTo: 'David Chen',
    notes: 'Kolabiz ERP went live in June. Need to follow up for annual cloud license renewal & HRMS module addon.',
    activities: [
      { id: 'a7', type: 'Call', date: '2026-07-20', summary: 'Go-Live signoff call. Client confirmed 100% accounting reconciliation success.', author: 'David Chen' }
    ],
    clientHealth: 'Amber',
    onboardingStage: 'Live & SLA Support',
    supportRenewalDate: '2026-09-15',
    deploymentType: 'On-Premise'
  },
  {
    id: 'erp-107',
    clientName: 'PropertyPulse Real Estate',
    contactPerson: 'Rachel Green (Co-Founder)',
    email: 'rachel@propertypulse.app',
    phone: '+91 97777 66666',
    product: 'Other',
    title: 'Property Billing & Tenant Portal Integration',
    value: 300000,
    stage: 'closed_lost',
    leadScore: 'Cold',
    source: 'Field Visit',
    lastContactDate: '2026-08-10',
    nextFollowUp: '2026-10-01',
    assignedTo: 'Alex Rivers',
    notes: 'Lost deal to cheap legacy desktop software.',
    lostReason: 'Budget constraints - opted for temporary legacy software',
    activities: [
      { id: 'a8', type: 'Email', date: '2026-08-10', summary: 'Received email stating budget freeze for Q3.', author: 'Alex Rivers' }
    ],
    clientHealth: 'Red',
    onboardingStage: 'Kickoff',
    supportRenewalDate: 'N/A',
    deploymentType: 'Cloud SaaS'
  }
];

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
