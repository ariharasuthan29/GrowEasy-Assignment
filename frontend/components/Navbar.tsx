import React from 'react';
import { Database, FileSpreadsheet, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-lg shadow-indigo-500/20">
            <FileSpreadsheet className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              GrowEasy <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent font-medium">CSV AI Importer</span>
            </h1>
            <p className="text-xs text-slate-400">Intelligent CRM Data Mapping</p>
          </div>
        </div>

        {/* Action / Badges */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
            AI-Engine Active
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs text-slate-300">
            <Database className="h-3.5 w-3.5 text-slate-400" />
            CRM v2.0
          </div>
        </div>

      </div>
    </header>
  );
};
