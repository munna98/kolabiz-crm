import React, { useState } from 'react';
import { 
  Calculator, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Send, 
  Plus, 
  IndianRupee,
  ShieldCheck,
  Package
} from 'lucide-react';
import { SERVICE_MODULES } from '../data/initialData';

export default function ProposalCalculator({ onOpenAddModalWithQuote }) {
  const [selectedModuleIds, setSelectedModuleIds] = useState(['m1', 'm2', 'm4', 'm7']);
  const [discountPercent, setDiscountPercent] = useState(10);
  const [deploymentModel, setDeploymentModel] = useState('On-Premise');
  const [copiedQuote, setCopiedQuote] = useState(false);

  const selectedModules = SERVICE_MODULES.filter(m => selectedModuleIds.includes(m.id));

  const subtotal = selectedModules.reduce((sum, m) => sum + m.baseCost, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalTotal = subtotal - discountAmount;
  const estimatedWeeks = selectedModules.reduce((sum, m) => sum + m.durationWeeks, 0);

  const toggleModule = (id) => {
    setSelectedModuleIds(prev => 
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  const handleCopyProposal = () => {
    const text = `=====================================\nKOLABIZ ERP SOLUTION PROPOSAL\n=====================================\nModules Selected:\n${selectedModules.map(m => ` • ${m.name} (₹${m.baseCost.toLocaleString('en-IN')})`).join('\n')}\n\nDeployment Model: ${deploymentModel}\nSubtotal: ₹${subtotal.toLocaleString('en-IN')}\nDiscount Applied (${discountPercent}%): -₹${discountAmount.toLocaleString('en-IN')}\n-------------------------------------\nTOTAL INVESTMENT: ₹${finalTotal.toLocaleString('en-IN')}\nEstimated Implementation: ~${estimatedWeeks} Weeks\n=====================================`;
    
    navigator.clipboard.writeText(text);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 3000);
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-border">
        <div>
          <h2 className="text-xl font-bold font-sans text-foreground flex items-center gap-2">
            <Calculator className="w-6 h-6 text-primary" />
            <span>Kolabiz ERP Interactive Proposal & Quotation Engine</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Configure custom ERP modules, apply enterprise discounts, and generate instant formal proposals for prospective clients.
          </p>
        </div>

        <button
          onClick={handleCopyProposal}
          className="flex items-center space-x-1.5 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium text-xs rounded-md border border-border shadow-sm transition-all cursor-pointer w-fit"
        >
          {copiedQuote ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <FileText className="w-4 h-4 text-primary" />}
          <span>{copiedQuote ? 'Proposal Copied!' : 'Copy Formal Proposal'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Module Selection Panel */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            <span>Select Kolabiz ERP Modules & Deployment Scope</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SERVICE_MODULES.map((module) => {
              const isSelected = selectedModuleIds.includes(module.id);
              return (
                <div
                  key={module.id}
                  onClick={() => toggleModule(module.id)}
                  className={`p-4 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-primary/10 border-primary shadow-sm' 
                      : 'bg-card text-card-foreground border-border hover:border-muted-foreground'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-secondary text-secondary-foreground uppercase">
                        {module.category}
                      </span>
                      <h4 className="text-xs font-bold text-foreground mt-1.5">{module.name}</h4>
                    </div>

                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                      isSelected ? 'bg-primary text-primary-foreground border-primary' : 'border-muted-foreground'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-border/50 flex items-center justify-between text-xs">
                    <span className="font-bold text-primary font-mono">
                      ₹{module.baseCost.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {module.durationWeeks > 0 ? `~${module.durationWeeks} weeks rollout` : 'SLA Continuous'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Quotation Summary Card */}
        <div className="space-y-6">
          <div className="bg-card text-card-foreground p-6 rounded-lg border border-border shadow-xl space-y-6 sticky top-24">
            
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-bold text-foreground">ERP Quote Breakdown</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/15 text-primary border border-primary/20">
                Live Calculator
              </span>
            </div>

            {/* Deployment Model Picker */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Deployment Model
              </label>
              <select
                value={deploymentModel}
                onChange={e => setDeploymentModel(e.target.value)}
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-xs text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="On-Premise">🖥️ On-Premise Enterprise</option>
                <option value="Cloud SaaS">☁️ Cloud SaaS</option>
                <option value="Hybrid Cloud">🌐 Hybrid Cloud</option>
              </select>
            </div>

            {/* Discount Percentage Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-muted-foreground">Enterprise Discount:</span>
                <span className="font-bold text-primary font-mono">{discountPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="5"
                value={discountPercent}
                onChange={e => setDiscountPercent(Number(e.target.value))}
                className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>0% (Standard)</span>
                <span>15% (Enterprise)</span>
                <span>30% (Max Partner)</span>
              </div>
            </div>

            {/* Financial Calculations */}
            <div className="space-y-2 pt-3 border-t border-border text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Modules Selected ({selectedModules.length}):</span>
                <span className="font-mono text-foreground">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount ({discountPercent}%):</span>
                  <span className="font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-muted-foreground">
                <span>Est. Rollout Timeline:</span>
                <span className="font-medium text-foreground">~{estimatedWeeks} Weeks</span>
              </div>

              <div className="pt-3 border-t border-border flex justify-between items-baseline">
                <span className="text-sm font-bold text-foreground">Total Investment:</span>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-primary font-mono block">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-muted-foreground">Excl. taxes</span>
                </div>
              </div>
            </div>

            {/* Convert Quote Action Button */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => onOpenAddModalWithQuote({
                  title: `Kolabiz ERP (${selectedModules.length} Modules)`,
                  value: finalTotal,
                  deploymentType: deploymentModel,
                  notes: `Quoted Modules: ${selectedModules.map(m => m.name).join(', ')}`
                })}
                className="w-full py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs rounded-md shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Convert Quote into Kolabiz ERP Lead</span>
              </button>

              <p className="text-[10px] text-muted-foreground text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>Instant conversion to active sales pipeline</span>
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
