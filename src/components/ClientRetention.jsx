import React from 'react';
import { 
  HeartHandshake, 
  ShieldCheck 
} from 'lucide-react';
import { formatDateMMDDYYYY } from '../data/initialData';

export default function ClientRetention({ leads, onSelectLead, onUpdateClientHealth }) {
  const closedWonClients = leads.filter(l => l.stage === 'closed_won');

  const healthyCount = closedWonClients.filter(c => c.clientHealth === 'Green').length;
  const amberCount = closedWonClients.filter(c => c.clientHealth === 'Amber').length;
  const redCount = closedWonClients.filter(c => c.clientHealth === 'Red').length;

  const totalContractValue = closedWonClients.reduce((sum, c) => sum + (c.value || 0), 0);

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-border">
        <div>
          <h2 className="text-xl font-bold font-sans text-foreground flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-primary" />
            <span>Kolabiz ERP Post-Sale Client Retention & SLA Hub</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Monitor Kolabiz ERP accounts, data migration milestones, and annual cloud SLA renewals.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="px-3 py-1.5 rounded-md bg-primary/10 border border-primary/30 text-primary font-bold font-mono">
            Won ERP Portfolio: ₹{totalContractValue.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card text-card-foreground p-4 rounded-lg border border-border flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-muted-foreground font-semibold uppercase">Green (Healthy Accounts)</span>
            <div className="text-2xl font-bold font-sans text-foreground mt-1">{healthyCount} Accounts</div>
            <p className="text-[10px] text-muted-foreground mt-1">ERP active • Operations running</p>
          </div>
          <div className="w-9 h-9 rounded-md bg-secondary flex items-center justify-center font-bold text-base">
            🟢
          </div>
        </div>

        <div className="bg-card text-card-foreground p-4 rounded-lg border border-amber-500/30 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-amber-500 font-semibold uppercase">Amber (Attention Needed)</span>
            <div className="text-2xl font-bold font-sans text-foreground mt-1">{amberCount} Accounts</div>
            <p className="text-[10px] text-muted-foreground mt-1">Annual SLA renewal or training needed</p>
          </div>
          <div className="w-9 h-9 rounded-md bg-amber-500/15 flex items-center justify-center font-bold text-base">
            🟡
          </div>
        </div>

        <div className="bg-card text-card-foreground p-4 rounded-lg border border-destructive/30 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-destructive font-semibold uppercase">Red (Churn Risk)</span>
            <div className="text-2xl font-bold font-sans text-foreground mt-1">{redCount} Accounts</div>
            <p className="text-[10px] text-muted-foreground mt-1">Immediate ERP consultant escalation</p>
          </div>
          <div className="w-9 h-9 rounded-md bg-destructive/15 flex items-center justify-center font-bold text-base">
            🔴
          </div>
        </div>
      </div>

      {/* Roster Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>Active Kolabiz ERP Client Accounts ({closedWonClients.length})</span>
        </h3>

        {closedWonClients.length === 0 ? (
          <div className="bg-card p-8 rounded-lg text-center border border-border text-muted-foreground text-xs">
            No closed won ERP clients yet. Move leads to "Closed Won" on the Kanban pipeline!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {closedWonClients.map((client) => {
              const isAmber = client.clientHealth === 'Amber';
              const isRed = client.clientHealth === 'Red';

              return (
                <div 
                  key={client.id}
                  className={`bg-card text-card-foreground p-5 rounded-lg border shadow-sm transition-all ${
                    isRed ? 'border-destructive/40' :
                    isAmber ? 'border-amber-500/40' :
                    'border-border'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-foreground">{client.clientName}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          client.clientHealth === 'Green' ? 'bg-secondary text-secondary-foreground border border-border' :
                          client.clientHealth === 'Amber' ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30' :
                          'bg-destructive/15 text-destructive border border-destructive/30'
                        }`}>
                          Health: {client.clientHealth || 'Green'}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{client.title}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-primary font-mono">
                        ₹{(client.value || 0).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-muted-foreground block">Contract Value</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-md bg-muted/30 text-xs border border-border">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">ERP Rollout Phase:</span>
                      <span className="font-bold text-primary">{client.onboardingStage || 'Data Migration'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Annual Renewal Date:</span>
                      <span className="font-bold text-foreground font-mono">{formatDateMMDDYYYY(client.supportRenewalDate || '2027-08-15')}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                    <span>Contact: <strong className="text-foreground">{client.contactPerson}</strong></span>
                    <span>Rep: <strong className="text-foreground">{client.assignedTo}</strong></span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] text-muted-foreground">Health Status:</span>
                      <button
                        onClick={() => onUpdateClientHealth(client.id, 'Green')}
                        className="px-2 py-0.5 text-[10px] rounded bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border cursor-pointer"
                      >
                        Green
                      </button>
                      <button
                        onClick={() => onUpdateClientHealth(client.id, 'Amber')}
                        className="px-2 py-0.5 text-[10px] rounded bg-amber-500/15 text-amber-500 hover:bg-amber-500/30 border border-amber-500/30 cursor-pointer"
                      >
                        Amber
                      </button>
                      <button
                        onClick={() => onUpdateClientHealth(client.id, 'Red')}
                        className="px-2 py-0.5 text-[10px] rounded bg-destructive/15 text-destructive hover:bg-destructive/30 border border-destructive/30 cursor-pointer"
                      >
                        Red
                      </button>
                    </div>

                    <button
                      onClick={() => onSelectLead(client)}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      View Account &rarr;
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
