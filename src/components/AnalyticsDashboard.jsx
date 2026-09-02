import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Users,
  IndianRupee
} from 'lucide-react';
import { INITIAL_STAGES } from '../data/initialData';

export default function AnalyticsDashboard({ leads }) {
  const totalDeals = leads.length;
  const closedWon = leads.filter(l => l.stage === 'closed_won');
  const closedLost = leads.filter(l => l.stage === 'closed_lost');
  
  const totalWonValue = closedWon.reduce((sum, l) => sum + (l.value || 0), 0);
  
  const winRate = (closedWon.length + closedLost.length) > 0 
    ? Math.round((closedWon.length / (closedWon.length + closedLost.length)) * 100) 
    : 0;

  const stageWeights = {
    inbound: 0.1,
    discovery: 0.25,
    proposal: 0.5,
    negotiation: 0.8,
    closed_won: 1.0,
    closed_lost: 0.0
  };

  const weightedForecast = leads.reduce((sum, l) => {
    const weight = stageWeights[l.stage] || 0;
    return sum + (l.value || 0) * weight;
  }, 0);

  const sourceMap = {};
  leads.forEach(l => {
    const src = l.source || 'Other';
    sourceMap[src] = (sourceMap[src] || 0) + 1;
  });

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-border">
        <div>
          <h2 className="text-xl font-bold font-sans text-foreground flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            <span>Sales Intelligence & Revenue Analytics (INR)</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Pipeline velocity, weighted forecasts in Indian Rupees, win rates, and lead channel conversion metrics.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-card text-card-foreground p-4 rounded-lg border border-border shadow-sm">
          <span className="text-xs text-muted-foreground font-semibold block">Closed Won Revenue</span>
          <div className="text-2xl font-bold font-mono text-primary mt-1">
            ₹{totalWonValue.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-primary" />
            {closedWon.length} Closed Deals
          </span>
        </div>

        <div className="bg-card text-card-foreground p-4 rounded-lg border border-border shadow-sm">
          <span className="text-xs text-muted-foreground font-semibold block">Weighted Revenue Forecast</span>
          <div className="text-2xl font-bold font-mono text-foreground mt-1">
            ₹{Math.round(weightedForecast).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-muted-foreground mt-1 block">
            Probability-adjusted pipeline
          </span>
        </div>

        <div className="bg-card text-card-foreground p-4 rounded-lg border border-border shadow-sm">
          <span className="text-xs text-muted-foreground font-semibold block">Closing Win Rate</span>
          <div className="text-2xl font-bold font-mono text-foreground mt-1">
            {winRate}%
          </div>
          <span className="text-[10px] text-muted-foreground mt-1 block">
            {closedWon.length} Won / {closedLost.length} Lost
          </span>
        </div>

        <div className="bg-card text-card-foreground p-4 rounded-lg border border-border shadow-sm">
          <span className="text-xs text-muted-foreground font-semibold block">Total Managed Leads</span>
          <div className="text-2xl font-bold font-mono text-foreground mt-1">
            {totalDeals}
          </div>
          <span className="text-[10px] text-muted-foreground mt-1 block">
            Across 6 pipeline stages
          </span>
        </div>

      </div>

      {/* Funnel & Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Stage Breakdown */}
        <div className="lg:col-span-7 bg-card text-card-foreground p-5 rounded-lg border border-border space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <span>Deal Stage Volume & Value Breakdown (INR)</span>
          </h3>

          <div className="space-y-3">
            {INITIAL_STAGES.map(stage => {
              const stageLeads = leads.filter(l => l.stage === stage.id);
              const stageVal = stageLeads.reduce((sum, l) => sum + (l.value || 0), 0);
              const pct = totalDeals > 0 ? Math.round((stageLeads.length / totalDeals) * 100) : 0;

              return (
                <div key={stage.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-foreground">{stage.name}</span>
                    <span className="font-mono text-muted-foreground">
                      {stageLeads.length} deals (₹{stageVal.toLocaleString('en-IN')})
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden flex">
                    <div 
                      className="h-full rounded-full bg-primary transition-all duration-500" 
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Source Breakdown */}
        <div className="lg:col-span-5 bg-card text-card-foreground p-5 rounded-lg border border-border space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span>Lead Channels & Inbound Sources</span>
          </h3>

          <div className="space-y-3">
            {Object.keys(sourceMap).map(src => {
              const count = sourceMap[src];
              const pct = totalDeals > 0 ? Math.round((count / totalDeals) * 100) : 0;

              return (
                <div key={src} className="p-3 rounded-md bg-muted/30 border border-border flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-foreground">{src}</span>
                    <span className="text-[10px] text-muted-foreground block">{count} Leads generated</span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-secondary text-secondary-foreground font-bold border border-border">
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
