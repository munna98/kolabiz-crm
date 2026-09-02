import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Trash2, 
  Plus, 
  Clock, 
  Sparkles,
  Package
} from 'lucide-react';
import { INITIAL_STAGES, KAZ_PRODUCTS, LEAD_SOURCES } from '../data/initialData';
import ConfirmModal from './ConfirmModal';

export default function LeadModal({ lead, isOpen, onClose, onSave, onDelete, staff = [] }) {
  const staffNames = staff.length > 0 ? staff.map(s => s.name) : ['Alex Rivers', 'Priya Sharma', 'David Chen'];

  const [formData, setFormData] = useState({
    clientName: '',
    contactPerson: '',
    email: '',
    phone: '',
    product: KAZ_PRODUCTS[0],
    title: '',
    value: 15000,
    deploymentType: 'On-Premise',
    stage: 'inbound',
    leadScore: 'Warm',
    source: LEAD_SOURCES[0],
    lastContactDate: new Date().toISOString().split('T')[0],
    nextFollowUp: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    assignedTo: staffNames[0],
    notes: '',
    activities: [],
    clientHealth: 'Green',
    onboardingStage: 'Data Migration',
    supportRenewalDate: '2027-09-01'
  });

  const [newActivity, setNewActivity] = useState({
    type: 'Call',
    summary: ''
  });

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    if (lead) {
      setFormData({ 
        product: KAZ_PRODUCTS[0],
        deploymentType: 'On-Premise',
        source: LEAD_SOURCES[0],
        assignedTo: staffNames[0],
        ...lead 
      });
    } else {
      setFormData({
        clientName: '',
        contactPerson: '',
        email: '',
        phone: '',
        product: KAZ_PRODUCTS[0],
        title: '',
        value: 15000,
        deploymentType: 'On-Premise',
        stage: 'inbound',
        leadScore: 'Warm',
        source: LEAD_SOURCES[0],
        lastContactDate: new Date().toISOString().split('T')[0],
        nextFollowUp: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        assignedTo: staffNames[0],
        notes: '',
        activities: [],
        clientHealth: 'Green',
        onboardingStage: 'Data Migration',
        supportRenewalDate: '2027-09-01'
      });
    }
  }, [lead, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      title: formData.title.trim() || formData.product
    };
    onSave(finalData);
    onClose();
  };

  const handleAddActivity = () => {
    if (!newActivity.summary.trim()) return;

    const activityObj = {
      id: 'act-' + Date.now(),
      type: newActivity.type,
      date: new Date().toISOString().split('T')[0],
      summary: newActivity.summary,
      author: formData.assignedTo || 'Sales Agent'
    };

    setFormData(prev => ({
      ...prev,
      lastContactDate: activityObj.date,
      activities: [activityObj, ...(prev.activities || [])]
    }));

    setNewActivity({ type: 'Call', summary: '' });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
        <div className="relative w-full max-w-3xl bg-popover text-popover-foreground rounded-lg p-6 shadow-2xl border border-border max-h-[90vh] flex flex-col my-8">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold shadow">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-sans text-foreground">
                  {lead ? `Manage Deal: ${lead.clientName}` : 'Add New Deal'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {lead ? `ID: ${lead.id}` : 'Select product & enter deal parameters'}
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

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
            
            {/* Row 1: Client & Contact Person */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Client / Enterprise Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="e.g. Apex Manufacturing Industries"
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Contact Person & Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactPerson}
                  onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="e.g. Marcus Vance (VP Operations)"
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Row 2: Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="marcus@apexmfg.com"
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Phone / WhatsApp
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Row 3: Product Select & Custom Title Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-primary" />
                  Select Product *
                </label>
                <select
                  value={formData.product}
                  onChange={e => setFormData({ ...formData, product: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-xs text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {KAZ_PRODUCTS.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Deal Description / Sub-Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder={formData.product === 'Other' ? 'e.g. Custom Software Integration' : 'e.g. Manufacturing & MRP Suite'}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Contract Value (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.value}
                  onChange={e => setFormData({ ...formData, value: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-xs text-primary font-bold focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Row 4: Stage, Lead Score, Deployment Model */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Pipeline Stage
                </label>
                <select
                  value={formData.stage}
                  onChange={e => setFormData({ ...formData, stage: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {INITIAL_STAGES.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Deployment Model
                </label>
                <select
                  value={formData.deploymentType}
                  onChange={e => setFormData({ ...formData, deploymentType: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="On-Premise">🖥️ On-Premise Enterprise</option>
                  <option value="Cloud SaaS">☁️ Cloud SaaS</option>
                  <option value="Hybrid Cloud">🌐 Hybrid Cloud</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Assigned Sales Rep
                </label>
                <select
                  value={formData.assignedTo}
                  onChange={e => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {staffNames.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 5: Next Follow-Up Date & Source */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Next SLA Follow-Up Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.nextFollowUp}
                  onChange={e => setFormData({ ...formData, nextFollowUp: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Lead Source
                </label>
                <select
                  value={formData.source}
                  onChange={e => setFormData({ ...formData, source: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {LEAD_SOURCES.map(src => (
                    <option key={src} value={src}>{src}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Scope & Custom Requirements
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Detail required modules, migration requirements, custom integrations..."
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Activity Log */}
            <div className="pt-4 border-t border-border space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Interaction & Demo History</span>
              </h4>

              <div className="flex items-center space-x-2 bg-muted/40 p-2 rounded-md border border-border">
                <select
                  value={newActivity.type}
                  onChange={e => setNewActivity({ ...newActivity, type: e.target.value })}
                  className="bg-input text-xs text-foreground px-2 py-1.5 rounded border border-border focus:ring-1 focus:ring-ring"
                >
                  <option value="Call">📞 Call</option>
                  <option value="Email">✉️ Email</option>
                  <option value="Meeting">🤝 Meeting</option>
                  <option value="Demo">🖥️ Demo</option>
                  <option value="Note">📝 Note</option>
                </select>

                <input
                  type="text"
                  placeholder="Log touchpoint or demo feedback..."
                  value={newActivity.summary}
                  onChange={e => setNewActivity({ ...newActivity, summary: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddActivity())}
                  className="flex-1 px-3 py-1.5 bg-input border border-border rounded text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />

                <button
                  type="button"
                  onClick={handleAddActivity}
                  className="px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-xs rounded border border-border flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log</span>
                </button>
              </div>

              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {(formData.activities || []).length === 0 ? (
                  <p className="text-xs text-muted-foreground italic p-2 text-center">No logged touchpoints yet.</p>
                ) : (
                  formData.activities.map(act => (
                    <div key={act.id} className="p-2.5 rounded bg-card border border-border text-xs flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-primary">{act.type}</span>
                          <span className="text-[10px] text-muted-foreground">{act.date} • {act.author}</span>
                        </div>
                        <p className="text-foreground mt-0.5">{act.summary}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-border flex items-center justify-between">
              {lead ? (
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(true)}
                  className="flex items-center space-x-1.5 px-3 py-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs font-medium rounded-md shadow-sm cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Deal</span>
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
                  className="flex items-center space-x-1.5 px-5 py-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs rounded-md shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Deal</span>
                </button>
              </div>
            </div>

          </form>

        </div>
      </div>

      {/* Styled Confirmation Custom Modal for Deal Deletion */}
      <ConfirmModal
        isOpen={isConfirmingDelete}
        onClose={() => setIsConfirmingDelete(false)}
        onConfirm={() => {
          if (lead) {
            onDelete(lead.id);
            setIsConfirmingDelete(false);
            onClose();
          }
        }}
        title="Delete ERP Deal"
        message={`Are you sure you want to delete the deal for "${lead?.clientName}"? This action cannot be undone.`}
        confirmText="Delete Deal"
        cancelText="Cancel"
        isDestructive={true}
      />
    </>
  );
}
