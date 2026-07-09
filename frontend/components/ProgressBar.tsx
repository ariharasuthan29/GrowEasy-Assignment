import React from 'react';
import { Loader2, Timer, Milestone, Sparkles } from 'lucide-react';

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

  // Calculate statistics for the GrowEasy UI
  const recordsPerBatch = 100; // estimated batch size average
  const totalRowsEstimate = totalBatches * recordsPerBatch;
  const processedRows = Math.min(currentBatch * recordsPerBatch, totalRowsEstimate);
  const remainingRows = Math.max(totalRowsEstimate - processedRows, 0);

  // Estimate ETA: Each batch takes ~4.5s (due to our 4.2s Gemini free tier sleep throttle!)
  const remainingBatches = Math.max(totalBatches - currentBatch, 0);
  const etaSeconds = remainingBatches * 5; 
  const etaString = etaSeconds > 60 
    ? `${Math.floor(etaSeconds / 60)}m ${etaSeconds % 60}s` 
    : `${etaSeconds}s`;

  return (
    <div className="w-full space-y-4 animate-fade-in bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
      
      {/* Dynamic Status Details */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 text-[#FF7A45] animate-spin" />
          <div>
            <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              Processing CRM Records
              <span className="inline-flex items-center gap-1 text-[10px] bg-orange-50 text-[#FF7A45] px-2 py-0.5 rounded-full border border-orange-100">
                <Sparkles className="h-3 w-3" />
                AI Mapping Active
              </span>
            </h4>
            <p className="text-xs text-slate-400">Integrating CSV rows into system schemas</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
          <Timer className="h-4 w-4 text-slate-400" />
          <span>ETA: {currentBatch === totalBatches ? 'Finishing...' : etaString}</span>
        </div>
      </div>

      {/* Progress Track and Percentage */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
          <span>Migration Progress</span>
          <span className="font-mono text-[#FF7A45] font-bold">{progress}%</span>
        </div>
        <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-[#FF7A45] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Metadata metrics footer (Rows processed, Batch count, Remaining rows) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2 text-center">
        <div className="bg-slate-50 p-2 sm:p-3 rounded-xl border border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Current Batch</p>
          <p className="text-xs sm:text-sm font-bold text-slate-700 font-mono mt-0.5">{currentBatch} <span className="text-slate-400 text-[10px] sm:text-xs font-normal">/ {totalBatches}</span></p>
        </div>
        <div className="bg-slate-50 p-2 sm:p-3 rounded-xl border border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Processed Rows</p>
          <p className="text-xs sm:text-sm font-bold text-slate-700 font-mono mt-0.5">~{processedRows}</p>
        </div>
        <div className="bg-slate-50 p-2 sm:p-3 rounded-xl border border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Remaining Rows</p>
          <p className="text-xs sm:text-sm font-bold text-slate-700 font-mono mt-0.5">~{remainingRows}</p>
        </div>
      </div>

    </div>
  );
};
