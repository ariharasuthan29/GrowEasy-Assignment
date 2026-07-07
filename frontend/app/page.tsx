'use client';

import React from 'react';
import { useCSV } from '../hooks/useCSV';
import { useImport } from '../hooks/useImport';
import { UploadArea } from '../components/UploadArea';
import { PreviewTable } from '../components/PreviewTable';
import { ResultTable } from '../components/ResultTable';
import { ProgressBar } from '../components/ProgressBar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  Sparkles, 
  ArrowRight, 
  RefreshCw, 
  CheckCircle, 
  XOctagon, 
  FileCheck,
  Zap,
  HelpCircle
} from 'lucide-react';

export default function Home() {
  const {
    file,
    headers,
    data,
    isParsing,
    error: parseError,
    parseFile,
    resetCSV
  } = useCSV();

  const {
    isImporting,
    progress,
    batchProgress,
    summary,
    error: importError,
    startImport,
    resetImport
  } = useImport();

  const handleFileSelected = (selectedFile: File) => {
    resetImport();
    parseFile(selectedFile);
  };

  const handleConfirmImport = async () => {
    if (!file) return;
    await startImport(file);
  };

  const handleReset = () => {
    resetCSV();
    resetImport();
  };

  // State checks for cleaner rendering
  const showUpload = !file && !isImporting && !summary;
  const showPreview = file && !isImporting && !summary;
  const showProgress = isImporting;
  const showResults = summary && !isImporting;

  return (
    <div className="relative min-h-[calc(100vh-8rem)] px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Decorative top ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 h-64 w-[600px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Header Section */}
      <div className="space-y-2 text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex flex-col sm:flex-row sm:items-center gap-2">
          <span>AI-Powered CSV Importer</span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 px-2.5 py-0.5 rounded-full mt-1 sm:mt-0 w-fit self-center">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            Zero-Mapping Engine
          </span>
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl">
          Upload Facebook Lead Exports, Google Ads files, custom excel sheets or agency reports. 
          Our AI scans and maps raw columns into the GrowEasy CRM schema instantly.
        </p>
      </div>

      {/* Step 1: File Upload */}
      {showUpload && (
        <div className="space-y-6">
          <div className="bg-slate-900/20 border border-slate-900 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-sm">
            <h3 className="text-md font-semibold text-slate-200 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">1</span>
              Select and Upload CSV Sheet
            </h3>
            <UploadArea
              onFileSelected={handleFileSelected}
              selectedFile={file}
              onClear={handleReset}
              isProcessing={isParsing || isImporting}
            />
          </div>

          {/* Quick Guide Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="border border-slate-900 bg-slate-900/10 rounded-2xl p-5 space-y-2">
              <Zap className="h-5 w-5 text-indigo-400" />
              <h4 className="text-sm font-semibold text-slate-200">Semantic AI Mapping</h4>
              <p className="text-xs text-slate-400">Headers like "Full Name", "Lead Name", "Cust_Name" map automatically to the CRM name field.</p>
            </div>
            <div className="border border-slate-900 bg-slate-900/10 rounded-2xl p-5 space-y-2">
              <FileCheck className="h-5 w-5 text-emerald-400" />
              <h4 className="text-sm font-semibold text-slate-200">Format Cleanup</h4>
              <p className="text-xs text-slate-400">Intelligently splits multiple emails/phones. Filters out duplicates and stores them in lead notes.</p>
            </div>
            <div className="border border-slate-900 bg-slate-900/10 rounded-2xl p-5 space-y-2">
              <HelpCircle className="h-5 w-5 text-purple-400" />
              <h4 className="text-sm font-semibold text-slate-200">Validation Safeguards</h4>
              <p className="text-xs text-slate-400">Ensures correct CRM status (e.g. GOOD_LEAD_FOLLOW_UP). Auto-skips rows missing contact details.</p>
            </div>
          </div>
        </div>
      )}

      {/* Parsing state loading spinner */}
      {isParsing && (
        <div className="rounded-3xl border border-slate-900 bg-slate-900/20 py-16">
          <LoadingSpinner message="Parsing CSV headers and rows locally..." size="md" />
        </div>
      )}

      {/* Step 2: File Loaded and Preview */}
      {showPreview && (
        <div className="space-y-6">
          <div className="bg-slate-900/20 border border-slate-900 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-md font-semibold text-slate-200 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">2</span>
                Verify and Import Mappings
              </h3>
              <button
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors w-fit"
              >
                <RefreshCw className="h-3 w-3" /> Change File
              </button>
            </div>

            {/* File metadata info */}
            <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-300">
                Loaded File: <strong className="text-slate-100">{file?.name}</strong> ({data.length} total rows detected)
              </div>
            </div>

            {/* Preview table element */}
            <PreviewTable headers={headers} data={data} />

            {/* Confirm Actions */}
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-2">
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950 text-slate-300 font-medium text-sm transition-all"
              >
                Cancel Import
              </button>
              <button
                onClick={handleConfirmImport}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 flex items-center justify-center gap-2"
              >
                <span>Confirm and Import Leads</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Importing / Processing State */}
      {showProgress && (
        <div className="space-y-6">
          <ProgressBar
            progress={progress}
            currentBatch={batchProgress.current}
            totalBatches={batchProgress.total}
            isImporting={isImporting}
          />
        </div>
      )}

      {/* Step 4: Import Complete Results Summary */}
      {showResults && summary && (
        <div className="space-y-6">
          
          {/* Summary Dashboard Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Stat 1: Total Processed */}
            <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 space-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-16 w-16 bg-slate-800/10 rounded-bl-3xl flex items-center justify-center text-slate-700 font-bold text-2xl">#</div>
              <p className="text-xs text-slate-400 font-medium">Total Rows Evaluated</p>
              <p className="text-3xl font-extrabold text-slate-100 font-mono">
                {summary.totalImported + summary.totalSkipped}
              </p>
            </div>

            {/* Stat 2: Imported */}
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-5 space-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-16 w-16 bg-emerald-500/5 rounded-bl-3xl flex items-center justify-center text-emerald-400/10">
                <CheckCircle className="h-8 w-8" />
              </div>
              <p className="text-xs text-emerald-400 font-medium">Imported CRM Records</p>
              <p className="text-3xl font-extrabold text-emerald-400 font-mono">
                {summary.totalImported}
              </p>
            </div>

            {/* Stat 3: Skipped */}
            <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-5 space-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-16 w-16 bg-rose-500/5 rounded-bl-3xl flex items-center justify-center text-rose-400/10">
                <XOctagon className="h-8 w-8" />
              </div>
              <p className="text-xs text-rose-400 font-medium">Skipped Rows</p>
              <p className="text-3xl font-extrabold text-rose-400 font-mono">
                {summary.totalSkipped}
              </p>
            </div>
          </div>

          {/* Results Table Panel */}
          <div className="bg-slate-900/20 border border-slate-900 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-md font-semibold text-slate-200">
                Import Report & Details
              </h3>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-medium text-xs hover:border-slate-700 transition-all w-fit"
              >
                Import Another File
              </button>
            </div>

            <ResultTable
              importedRecords={summary.importedRecords}
              skippedRecords={summary.skippedRecords}
            />
          </div>

        </div>
      )}

      {/* Global Error Banner */}
      {(parseError || importError) && !isImporting && (
        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 flex items-start gap-3 text-sm animate-fade-in">
          <XOctagon className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Import Operation Failed</p>
            <p className="text-xs text-rose-400/80">{parseError || importError}</p>
            <button 
              onClick={handleReset}
              className="mt-2 text-xs font-semibold underline text-rose-300 hover:text-rose-200"
            >
              Reset Session
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
