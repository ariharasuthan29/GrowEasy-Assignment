import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProgressBarProps {
  progress: number;
  currentBatch: number;
  totalBatches: number;
  isImporting: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  currentBatch,
  totalBatches,
  isImporting
}) => {
  if (!isImporting) return null;

  return (
    <div className="w-full space-y-2.5 animate-fade-in bg-slate-900/60 p-5 rounded-2xl border border-slate-800 backdrop-blur-sm">
      
      {/* Top Details */}
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <Loader2 className="h-4.5 w-4.5 text-indigo-400 animate-spin" />
          <span>Processing CRM Records...</span>
        </div>
        <span className="text-slate-400 font-mono">
          Batch {currentBatch} of {totalBatches} ({progress}%)
        </span>
      </div>

      {/* Progress Track */}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-950 border border-slate-800/80">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-600 shadow-[0_0_8px_rgba(99,102,241,0.5)] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
        
        {/* Shine highlight animation overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-full animate-pulse-slow" />
      </div>

      {/* Helper text */}
      <p className="text-[11px] text-slate-400">
        Integrating raw rows through the AI mapping engine. Failed batches are automatically retried. Please do not close this window.
      </p>

    </div>
  );
};
