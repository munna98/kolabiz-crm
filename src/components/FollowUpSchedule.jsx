import React, { useState } from 'react';
import { 
  Clock, 
  AlertCircle, 
  Calendar, 
  Copy, 
  Check, 
  Mail, 
  Sparkles 
} from 'lucide-react';
import { FOLLOWUP_TEMPLATES } from '../data/initialData';

export default function FollowUpSchedule({ leads, onSelectLead, onUpdateFollowUp }) {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedTemplate, setSelectedTemplate] = useState(FOLLOWUP_TEMPLATES[0]);
  const [activeLeadForTemplate, setActiveLeadForTemplate] = useState(leads[0] || null);
  const [copied, setCopied] = useState(false);

  const activeLeads = leads.filter(l => l.stage !== 'closed_won' && l.stage !== 'closed_lost');

  const overdueLeads = activeLeads.filter(l => l.nextFollowUp && l.nextFollowUp < todayStr);
  const dueTodayLeads = activeLeads.filter(l => l.nextFollowUp === todayStr);
  const upcomingLeads = activeLeads.filter(l => l.nextFollowUp && l.nextFollowUp > todayStr);

  const renderFormattedTemplate = () => {
    if (!selectedTemplate || !activeLeadForTemplate) return '';
    let text = selectedTemplate.body;
    text = text.replace(/{{clientName}}/g, activeLeadForTemplate.clientName || 'Client');
    text = text.replace(/{{contactPerson}}/g, activeLeadForTemplate.contactPerson || 'Contact');
    text = text.replace(/{{title}}/g, activeLeadForTemplate.title || 'Software Project');
    text = text.replace(/{{assignedTo}}/g, activeLeadForTemplate.assignedTo || 'Kolabiz Sales Team');
    return text;
  };

  const renderFormattedSubject = () => {
    if (!selectedTemplate || !activeLeadForTemplate) return '';
    let text = selectedTemplate.subject;
    text = text.replace(/{{clientName}}/g, activeLeadForTemplate.clientName || 'Client');
    text = text.replace(/{{title}}/g, activeLeadForTemplate.title || 'Software Project');
    return text;
  };

  const handleCopy = () => {
    const fullText = `Subject: ${renderFormattedSubject()}\n\n${renderFormattedTemplate()}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePushDate = (leadId, daysToAdd) => {
    const newDate = new Date(Date.now() + 86400000 * daysToAdd).toISOString().split('T')[0];
    onUpdateFollowUp(leadId, newDate);
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-border">
        <div>
          <h2 className="text-xl font-bold font-sans text-foreground flex items-center gap-2">
            <Clock className="w-6 h-6 text-primary" />
            <span>Follow-Up SLA & Outreach Generator</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Track overdue touchpoints and send instant personalized outreach messages to prevent lead leakage.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <div className="px-3 py-1.5 rounded-md bg-destructive/15 border border-destructive/30 text-destructive font-medium">
            Overdue: {overdueLeads.length}
          </div>
          <div className="px-3 py-1.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-500 font-medium">
            Due Today: {dueTodayLeads.length}
          </div>
          <div className="px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground font-medium border border-border">
            Upcoming: {upcomingLeads.length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Tasks Column */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Overdue */}
          {overdueLeads.length > 0 && (
            <div className="bg-card text-card-foreground p-4 rounded-lg border border-destructive/40 space-y-3 shadow-sm">
              <h3 className="text-xs font-bold text-destructive uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                <AlertCircle className="w-4 h-4" />
                <span>URGENT: OVERDUE SLA FOLLOW-UPS ({overdueLeads.length})</span>
              </h3>

              <div className="space-y-3">
                {overdueLeads.map(lead => (
                  <div key={lead.id} className="p-3 rounded-md bg-muted/30 border border-destructive/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-foreground">{lead.clientName}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-destructive text-destructive-foreground font-mono">
                          Due: {lead.nextFollowUp}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{lead.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Rep: {lead.assignedTo} • Contact: {lead.contactPerson}</p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => setActiveLeadForTemplate(lead)}
                        className="px-2.5 py-1 bg-primary/20 text-primary text-[11px] font-medium rounded hover:bg-primary/30 border border-primary/30"
                      >
                        Draft Message
                      </button>
                      <button
                        onClick={() => handlePushDate(lead.id, 2)}
                        className="px-2 py-1 bg-secondary text-secondary-foreground text-[10px] rounded hover:bg-secondary/80 border border-border"
                      >
                        +2 Days
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Due Today */}
          <div className="bg-card text-card-foreground p-4 rounded-lg border border-border space-y-3 shadow-sm">
            <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>DUE TODAY ({dueTodayLeads.length})</span>
            </h3>

            {dueTodayLeads.length === 0 ? (
              <p className="text-xs text-muted-foreground italic p-3 text-center">No follow-ups due today.</p>
            ) : (
              <div className="space-y-3">
                {dueTodayLeads.map(lead => (
                  <div key={lead.id} className="p-3 rounded-md bg-muted/30 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="font-bold text-xs text-foreground">{lead.clientName}</span>
                      <p className="text-xs text-muted-foreground line-clamp-1">{lead.title}</p>
                      <span className="text-[10px] text-muted-foreground">Contact: {lead.contactPerson}</span>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => setActiveLeadForTemplate(lead)}
                        className="px-2.5 py-1 bg-primary/20 text-primary text-[11px] font-medium rounded hover:bg-primary/30 border border-primary/30"
                      >
                        Draft Message
                      </button>
                      <button
                        onClick={() => handlePushDate(lead.id, 7)}
                        className="px-2 py-1 bg-secondary text-secondary-foreground text-[10px] rounded hover:bg-secondary/80 border border-border"
                      >
                        +7 Days
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming */}
          <div className="bg-card text-card-foreground p-4 rounded-lg border border-border space-y-3 shadow-sm">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>UPCOMING FOLLOW-UPS ({upcomingLeads.length})</span>
            </h3>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {upcomingLeads.map(lead => (
                <div key={lead.id} className="p-2.5 rounded-md bg-muted/20 border border-border flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-foreground">{lead.clientName}</span>
                    <span className="text-muted-foreground text-[11px] block">{lead.title}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] font-mono text-primary font-bold">{lead.nextFollowUp}</span>
                    <button
                      onClick={() => setActiveLeadForTemplate(lead)}
                      className="text-[10px] text-muted-foreground hover:text-primary"
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Generator Column */}
        <div className="lg:col-span-5 bg-card text-card-foreground p-5 rounded-lg border border-border space-y-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Outreach Template Generator</h3>
            </div>
            {activeLeadForTemplate && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-secondary text-secondary-foreground font-medium border border-border">
                {activeLeadForTemplate.clientName.split(' ')[0]}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Target Lead Client
            </label>
            <select
              value={activeLeadForTemplate?.id || ''}
              onChange={(e) => {
                const found = leads.find(l => l.id === e.target.value);
                if (found) setActiveLeadForTemplate(found);
              }}
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {leads.map(l => (
                <option key={l.id} value={l.id}>{l.clientName} - ({l.title})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
              Select Message Template
            </label>
            <div className="grid grid-cols-2 gap-2">
              {FOLLOWUP_TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t)}
                  className={`p-2 rounded-md text-left text-xs font-medium transition-all cursor-pointer ${
                    selectedTemplate.id === t.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-muted/50 text-muted-foreground border border-border hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <div className="font-bold">{t.title}</div>
                  <div className="text-[10px] opacity-80 mt-0.5">{t.category}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <span className="text-[11px] text-muted-foreground font-semibold uppercase">Subject Line:</span>
              <div className="p-2.5 rounded bg-input border border-border text-xs font-mono text-foreground mt-1">
                {renderFormattedSubject()}
              </div>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground font-semibold uppercase">Message Body:</span>
              <div className="p-3 rounded bg-input border border-border text-xs font-sans text-foreground mt-1 whitespace-pre-wrap leading-relaxed max-h-52 overflow-y-auto">
                {renderFormattedTemplate()}
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <a
              href={`mailto:${activeLeadForTemplate?.email || ''}?subject=${encodeURIComponent(renderFormattedSubject())}&body=${encodeURIComponent(renderFormattedTemplate())}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Open Email Client</span>
            </a>

            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs rounded-md shadow cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Template'}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
