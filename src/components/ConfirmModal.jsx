import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Are you sure?', 
  message = 'This action cannot be undone.', 
  confirmText = 'Delete', 
  cancelText = 'Cancel',
  isDestructive = true 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-md bg-popover text-popover-foreground rounded-lg p-6 shadow-2xl border border-border flex flex-col my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center space-x-2.5">
            <div className={`w-8 h-8 rounded-md flex items-center justify-center font-bold ${
              isDestructive ? 'bg-destructive/15 text-destructive border border-destructive/30' : 'bg-primary/15 text-primary'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold font-sans text-foreground">
              {title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message */}
        <div className="py-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-border flex items-center justify-end space-x-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs font-medium rounded-md cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex items-center space-x-1.5 px-4 py-1.5 text-xs font-bold rounded-md shadow cursor-pointer ${
              isDestructive 
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' 
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {isDestructive && <Trash2 className="w-3.5 h-3.5" />}
            <span>{confirmText}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
