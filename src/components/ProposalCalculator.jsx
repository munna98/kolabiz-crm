import React, { useState } from 'react';
import { 
  Calculator, 
  CheckSquare, 
  Square, 
  Copy, 
  Check, 
  Plus, 
  Sparkles, 
  Clock 
} from 'lucide-react';
import { SERVICE_MODULES } from '../data/initialData';

export default function ProposalCalculator({ onOpenAddModalWithQuote }) {
  const [selectedModuleIds, setSelectedModuleIds] = useState([
    'm1', 'm2', 'm3', 'm7', 'm8'
  ]);

  const [discountPercent, setDiscountPercent] = useState(10);
  const [clientName, setClientName] = useState('New Enterprise ERP Prospect');
  const [copied, setCopied] = useState(false);

  const toggleModule = (id) => {
    if (selectedModuleIds.includes(id)) {
      setSelectedModuleIds(selectedModuleIds.filter(mId => mId !== id));
    } else {
      setSelectedModuleIds([...selectedModuleIds, id]);
    }
  };

  const selectedModules = SERVICE_MODULES.filter(m => selectedModuleIds.includes(m.id));
  
  const rawTotal = selectedModules.reduce((sum, m) => sum + m.baseCost, 0);
  const discountAmount = (rawTotal * discountPercent) / 100;
  const finalTotal = rawTotal - discountAmount;

  const totalWeeks = selectedModules.reduce((sum, m) => sum + m.durationWeeks, 0);

  const generateProposalText = () => {
    let text = `====================================\n`;
    text += `KOLABIZ ERP ENTERPRISE SOLUTION PROPOSAL\n`;
    text += `Client: ${clientName}\n`;
    text += `Date: ${new Date().toLocaleDateString()}\n`;
    text += `====================================\n\n`;
    text += `SELECTED KOLABIZ ERP MODULES & SCOPE:\n`;

    selectedModules.forEach((m, idx) => {
      text += `${idx + 1}. ${m.name} (${m.category})\n`;
      text += `   - Module Investment: ₹${m.baseCost.toLocaleString('en-IN')}\n`;
      if (m.durationWeeks > 0) {
        text += `   - Implementation Timeline: ~${m.durationWeeks} Weeks\n`;
      }
    });

    text += `\n------------------------------------\n`;
    text += `ERP Modules Subtotal: ₹${rawTotal.toLocaleString('en-IN')}\n`;
    if (discountPercent > 0) {
      text += `Strategic Enterprise Discount (${discountPercent}%): -₹${discountAmount.toLocaleString('en-IN')}\n`;
    }
    text += `TOTAL YEAR-1 INVESTMENT: ₹${finalTotal.toLocaleString('en-IN')}\n`;
    text += `ESTIMATED ERP GO-LIVE TIMELINE: ~${totalWeeks} Weeks\n`;
    text += `------------------------------------\n\n`;
    text += `Included: Unlimited User Access, Data Migration, Staff Training, & 24/7 SLA Support.\n`;
    text += `Prepared by Kolabiz Enterprise Solutions.`;

    return text;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateProposalText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateLeadFromQuote = () => {
    if (onOpenAddModalWithQuote) {
      onOpenAddModalWithQuote({
        clientName: clientName,
        title: `Kolabiz ERP Package (${selectedModules.length} Modules)`,
        value: Math.round(finalTotal),
        notes: generateProposalText()
      });
    }
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-border">
        <div>
          <h2 className="text-xl font-bold font-sans text-foreground flex items-center gap-2">
            <Calculator className="w-6 h-6 text-primary" />
            <span>Interactive Kolabiz ERP Proposal & Scope Calculator</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Build Kolabiz ERP package quotes in Indian Rupees (INR) with module selection and timeline estimates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Module Selection */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-card text-card-foreground p-4 rounded-lg border border-border space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">1. Select Kolabiz ERP Modules</h3>
              <span className="text-xs text-primary font-bold">{selectedModules.length} Modules Selected</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SERVICE_MODULES.map(m => {
                const isSelected = selectedModuleIds.includes(m.id);

                return (
                  <div
                    key={m.id}
                    onClick={() => toggleModule(m.id)}
                    className={`p-3 rounded-md border transition-all cursor-pointer flex items-start space-x-3 ${
                      isSelected
                        ? 'bg-accent text-accent-foreground border-ring shadow-sm'
                        : 'bg-card border-border text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-primary" />
                      ) : (
                        <Square className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">{m.name}</span>
                      </div>
                      <span className="text-[10px] text-primary font-semibold block">{m.category}</span>
                      
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-border text-[11px]">
                        <span className="font-bold text-foreground font-mono">₹{m.baseCost.toLocaleString('en-IN')}</span>
                        {m.durationWeeks > 0 && (
                          <span className="text-muted-foreground text-[10px] flex items-center gap-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            {m.durationWeeks} wks
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Adjusters */}
          <div className="bg-card text-card-foreground p-4 rounded-lg border border-border space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground">2. Commercial Adjusters</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Client / Enterprise Name
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Strategic Discount (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={discountPercent}
                  onChange={e => setDiscountPercent(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-xs text-primary font-bold focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quote Preview */}
        <div className="lg:col-span-5 bg-card text-card-foreground p-5 rounded-lg border border-border space-y-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Kolabiz ERP Proposal Quote</span>
            </h3>
            <span className="text-xs text-primary font-mono font-bold">
              ₹{finalTotal.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-4 rounded-md bg-muted/40 border border-border space-y-2 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>ERP Modules ({selectedModules.length} selected):</span>
              <span className="font-mono text-foreground">₹{rawTotal.toLocaleString('en-IN')}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-amber-500 font-medium">
                <span>Enterprise Discount ({discountPercent}%):</span>
                <span className="font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="pt-2 border-t border-border flex justify-between text-sm font-bold">
              <span className="text-foreground">Total Investment:</span>
              <span className="text-primary font-mono text-base">₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-muted-foreground pt-1">
              <span>Target Go-Live Timeline:</span>
              <span className="font-bold text-foreground">~{totalWeeks} Weeks</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Formatted Client Quotation Text:
            </label>
            <textarea
              readOnly
              rows={9}
              value={generateProposalText()}
              className="w-full p-3 bg-input border border-border rounded-md text-xs font-mono text-foreground leading-relaxed focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs rounded-md shadow cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'ERP Proposal Copied!' : 'Copy Proposal Text'}</span>
            </button>

            <button
              onClick={handleCreateLeadFromQuote}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium text-xs rounded-md border border-border cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Convert Quote into Kolabiz ERP Deal</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
