import React from 'react';
import { Bell, Settings, Search, Menu, Sparkles } from 'lucide-react';

interface NavbarProps {
  onSidebarToggle: () => void;
  openImportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSidebarToggle, openImportModal }) => {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 shadow-sm">
      
      {/* Left side: Hamburger and Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onSidebarToggle}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700 lg:hidden transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Brand Logo inside Top Nav (for mobile viewports) */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FF7A45] text-white font-bold shadow-md shadow-orange-500/20">
            GE
          </div>
          <span className="text-md font-bold tracking-tight text-slate-800">
            GrowEasy
          </span>
        </div>

        {/* Global Search Bar (CRM layout style) */}
        <div className="relative max-w-md w-full hidden sm:block">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search leads, tasks, campaigns..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-[#FF7A45]/50 focus:bg-white focus:ring-2 focus:ring-[#FF7A45]/15 transition-all"
          />
        </div>
      </div>

      {/* Right side: Action Badges, Notifications, Settings, and Profile */}
      <div className="flex items-center gap-4">
        {/* Bulk Action Import Button */}
        <button
          onClick={openImportModal}
          className="hidden md:flex items-center gap-1.5 rounded-xl bg-[#FF7A45] hover:bg-[#E86833] text-white px-4 py-2 text-xs font-semibold shadow-md shadow-orange-500/10 transition-all duration-200 cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Import CSV
        </button>

        {/* Settings button */}
        <button className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors relative">
          <Settings className="h-5 w-5" />
        </button>

        {/* Notifications Bell */}
        <button className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#FF7A45] ring-2 ring-white" />
        </button>

        {/* Vertical divider */}
        <div className="h-6 w-px bg-slate-200" />

        {/* User profile avatar */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right hidden md:block">
            <span className="text-xs font-semibold text-slate-800">Tommy Vercetti</span>
            <span className="text-[10px] text-slate-400 font-medium">Sales Administrator</span>
          </div>
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-orange-400 to-[#FF7A45] flex items-center justify-center text-white font-semibold text-sm border-2 border-orange-500/10 shadow">
            TV
          </div>
        </div>
      </div>

    </header>
  );
};
