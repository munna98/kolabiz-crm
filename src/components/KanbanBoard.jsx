import React from 'react';
import { INITIAL_STAGES, formatDateMMDDYYYY } from '../data/initialData';
import { 
  Clock, 
  User, 
  Flame,
  Zap,
  Snowflake,
  Server,
  Cloud,
  Package,
  MapPin
} from 'lucide-react';

export default function KanbanBoard({ 
  leads, 
  searchQuery, 
  onSelectLead, 
  onUpdateStage, 
  onOpenAddModal 
}) {
  const todayStr = new Date().toISOString().split('T')[0];

  const filteredLeads = leads.filter(lead => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      lead.clientName.toLowerCase().includes(q) ||
      lead.contactPerson.toLowerCase().includes(q) ||
      lead.title.toLowerCase().includes(q) ||
      (lead.location && lead.location.toLowerCase().includes(q)) ||
      (lead.product && lead.product.toLowerCase().includes(q)) ||
      lead.assignedTo.toLowerCase().includes(q) ||
      (lead.source && lead.source.toLowerCase().includes(q))
    );
  });

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Board Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span>Kolabiz License & Implementation Pipeline</span>
            <span className="text-xs font-normal text-muted-foreground">({filteredLeads.length} leads)</span>
          </h2>
          <p className="text-xs text-muted-foreground">Manage lead stages, locations, product variants, contract negotiations, and implementation readiness.</p>
        </div>

        {/* Priority Legend */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-muted-foreground">Lead Intent:</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-destructive/15 text-destructive border border-destructive/30 flex items-center gap-1">
            <Flame className="w-3 h-3 text-destructive" /> Hot
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500" /> Warm
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-secondary text-secondary-foreground border border-border flex items-center gap-1">
            <Snowflake className="w-3 h-3 text-primary" /> Cold
          </span>
        </div>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-6">
        {INITIAL_STAGES.map((stage) => {
          const stageLeads = filteredLeads.filter(l => l.stage === stage.id);
          const stageTotalValue = stageLeads.reduce((sum, l) => sum + (l.value || 0), 0);

          return (
            <div 
              key={stage.id}
              className="flex flex-col rounded-lg bg-card text-card-foreground border border-border p-3 min-w-[260px] shadow-sm"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-border">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    {stage.name}
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold">
                  {stageLeads.length}
                </span>
              </div>

              {/* Stage Value Summary */}
              <div className="text-[11px] font-medium text-muted-foreground mb-3 px-2 py-1 rounded bg-muted/50 flex items-center justify-between">
                <span>Stage Value:</span>
                <span className="font-bold text-foreground font-mono">₹{stageTotalValue.toLocaleString('en-IN')}</span>
              </div>

              {/* Cards Container */}
              <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
                {stageLeads.length === 0 ? (
                  <div className="p-4 rounded-md border border-dashed border-border text-center text-xs text-muted-foreground my-4">
                    No leads in stage
                  </div>
                ) : (
                  stageLeads.map((lead) => {
                    const isOverdue = lead.nextFollowUp && lead.nextFollowUp < todayStr;
                    const isToday = lead.nextFollowUp === todayStr;

                    return (
                      <div
                        key={lead.id}
                        onClick={() => onSelectLead(lead)}
                        className="bg-card text-card-foreground rounded-md p-3 border border-border hover:border-primary hover:shadow-md transition-all cursor-pointer group"
                      >
                        {/* Top Badges */}
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${
                            lead.leadScore === 'Hot' ? 'bg-destructive/15 text-destructive border border-destructive/30' :
                            lead.leadScore === 'Warm' ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30' :
                            'bg-secondary text-secondary-foreground border border-border'
                          }`}>
                            {lead.leadScore === 'Hot' && <Flame className="w-3 h-3 text-destructive" />}
                            {lead.leadScore === 'Warm' && <Zap className="w-3 h-3 text-amber-500" />}
                            {lead.leadScore === 'Cold' && <Snowflake className="w-3 h-3 text-primary" />}
                            {lead.leadScore}
                          </span>

                          {lead.nextFollowUp && (
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded flex items-center gap-1 ${
                              isOverdue ? 'bg-destructive text-destructive-foreground font-bold animate-pulse' :
                              isToday ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              <Clock className="w-3 h-3" />
                              {isOverdue ? 'Overdue!' : isToday ? 'Due Today' : formatDateMMDDYYYY(lead.nextFollowUp)}
                            </span>
                          )}
                        </div>

                        {/* Product Variant Badge */}
                        <div className="mb-1.5 flex items-center gap-1 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 flex items-center gap-1 w-fit">
                            <Package className="w-3 h-3" />
                            {lead.product || 'Kolabiz ERP'}
                          </span>
                        </div>

                        {/* Title & Client Name */}
                        <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {lead.clientName}
                        </h4>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 mb-2">
                          {lead.title}
                        </p>

                        {/* Location & Deployment Model Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 my-2 text-[10px]">
                          {lead.location && (
                            <span className="px-1.5 py-0.5 rounded bg-muted text-foreground font-medium flex items-center gap-1 truncate max-w-[140px]" title={lead.location}>
                              <MapPin className="w-2.5 h-2.5 text-primary shrink-0" />
                              <span className="truncate">{lead.location}</span>
                            </span>
                          )}

                          <span className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-semibold flex items-center gap-1">
                            {lead.deploymentType === 'On-Premise' ? <Server className="w-2.5 h-2.5" /> : <Cloud className="w-2.5 h-2.5" />}
                            {lead.deploymentType || 'On-Premise'}
                          </span>
                        </div>

                        {/* Contract Value & Rep */}
                        <div className="flex items-center justify-between text-xs pt-2 border-t border-border">
                          <span className="font-bold text-primary font-mono">
                            ₹{(lead.value || 0).toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <User className="w-3 h-3 text-muted-foreground" />
                            {lead.assignedTo.split(' ')[0]}
                          </span>
                        </div>

                        {/* Stage Selector */}
                        <div 
                          className="mt-2 pt-2 border-t border-border flex items-center justify-between"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <select
                            value={lead.stage}
                            onChange={(e) => onUpdateStage(lead.id, e.target.value)}
                            className="bg-input text-[10px] text-foreground border border-border rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-ring"
                          >
                            {INITIAL_STAGES.map(s => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                          </select>

                          <button
                            onClick={() => onSelectLead(lead)}
                            className="text-[10px] text-primary hover:underline font-medium"
                          >
                            Details &rarr;
                          </button>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
