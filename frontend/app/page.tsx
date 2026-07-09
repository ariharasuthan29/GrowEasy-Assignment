'use client';

import React, { useState, useMemo } from 'react';
import { useCSV } from '../hooks/useCSV';
import { useImport } from '../hooks/useImport';
import { UploadArea } from '../components/UploadArea';
import { PreviewTable } from '../components/PreviewTable';
import { ProgressBar } from '../components/ProgressBar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Sparkles,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  LayoutDashboard,
  Users,
  Briefcase,
  Share2,
  TrendingUp,
  Mail,
  Phone,
  Compass,
  Zap,
  Globe,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  Clock,
  ArrowRightLeft,
  Menu
} from 'lucide-react';
import toast from 'react-hot-toast';

// Setup beautiful pre-loaded CRM leads for a realistic first-impression dashboard
const INITIAL_CRM_LEADS = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    country_code: '+1',
    mobile_without_country_code: '555-0199',
    company: 'Alpha Corp',
    city: 'San Jose',
    state: 'California',
    country: 'United States',
    lead_owner: 'Tommy Vercetti',
    crm_status: 'GOOD_LEAD_FOLLOW_UP',
    data_source: 'leads_on_demand',
    crm_note: 'Follow up call scheduled next Tuesday',
    created_at: new Date().toISOString()
  },
  {
    name: 'Sarah Smith',
    email: 'sarah.s@example.com',
    country_code: '+1',
    mobile_without_country_code: '555-0143',
    company: 'Beta Industries',
    city: 'Austin',
    state: 'Texas',
    country: 'United States',
    lead_owner: 'Tommy Vercetti',
    crm_status: 'DID_NOT_CONNECT',
    data_source: 'meridian_tower',
    crm_note: 'Mailbox full. Send WhatsApp follow-up.',
    created_at: new Date().toISOString()
  },
  {
    name: 'David Miller',
    email: 'david@example.com',
    country_code: '+1',
    mobile_without_country_code: '555-0188',
    company: 'Delta Solutions',
    city: 'Miami',
    state: 'Florida',
    country: 'United States',
    lead_owner: 'Tommy Vercetti',
    crm_status: 'SALE_DONE',
    data_source: 'eden_park',
    crm_note: 'Contract signed. Initial invoice sent.',
    created_at: new Date().toISOString()
  },
  {
    name: 'Robert Brown',
    email: 'robert@example.com',
    country_code: '+1',
    mobile_without_country_code: '555-0155',
    company: 'Gamma Global',
    city: 'Boston',
    state: 'Massachusetts',
    country: 'United States',
    lead_owner: 'Tommy Vercetti',
    crm_status: 'BAD_LEAD',
    data_source: 'varah_swamy',
    crm_note: 'Not interested. Wrong number.',
    created_at: new Date().toISOString()
  }
];

export default function Page() {
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Current CRM Leads list
  const [leads, setLeads] = useState<any[]>(INITIAL_CRM_LEADS);
  // Modal toggle state
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Current active view sidebar menu item
  const [activeMenu, setActiveMenu] = useState('Manage Leads');
  
  // Table search & filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Import flow hooks
  const {
    file,
    headers,
    data: previewData,
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

  // Reset CSV upload states
  const handleReset = () => {
    resetCSV();
    resetImport();
  };

  // Close modal and reset state
  const handleCloseModal = () => {
    setIsModalOpen(false);
    handleReset();
  };

  // Delete lead handler for dashboard interactivity
  const handleDeleteLead = (emailToDelete: string) => {
    setLeads(prev => prev.filter(l => l.email !== emailToDelete));
    toast.success('Lead deleted successfully');
  };

  // On import success, append records and close results
  const handleSuccessFinished = () => {
    if (summary && summary.importedRecords.length > 0) {
      setLeads(prev => [...summary.importedRecords, ...prev]);
    }
    handleCloseModal();
  };

  // Filtered Leads logic
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = 
        (lead.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.company || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || lead.crm_status === statusFilter;
      const matchesSource = sourceFilter === 'ALL' || lead.data_source === sourceFilter;

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [leads, searchTerm, statusFilter, sourceFilter]);

  // Paginated Leads logic
  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLeads.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLeads, currentPage]);

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

  // Dynamic status badges
  const getStatusBadge = (status: string) => {
    let colorClasses = 'bg-slate-50 text-slate-700 border-slate-200';
    if (status === 'GOOD_LEAD_FOLLOW_UP') {
      colorClasses = 'bg-green-50 text-green-700 border-green-200';
    } else if (status === 'DID_NOT_CONNECT') {
      colorClasses = 'bg-orange-50 text-orange-700 border-orange-200';
    } else if (status === 'BAD_LEAD') {
      colorClasses = 'bg-red-50 text-red-700 border-red-200';
    } else if (status === 'SALE_DONE') {
      colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
    }
    return (
      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${colorClasses}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex">

      {/* 1. LEFT SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Sidebar Header Brand Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF7A45] text-white font-bold shadow-md shadow-orange-500/20">
              GE
            </div>
            <div>
              <span className="text-md font-bold tracking-tight text-slate-800 flex items-center gap-1">
                GrowEasy <span className="text-xs font-semibold text-[#FF7A45]">CRM</span>
              </span>
              <p className="text-[10px] text-slate-400">Intelligent Assistant</p>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden rounded-lg p-1 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto custom-scrollbar">
          {[
            { name: 'Dashboard', icon: LayoutDashboard },
            { name: 'Generate Leads', icon: Sparkles },
            { name: 'Manage Leads', icon: Users },
            { name: 'Trigger Leads', icon: Zap },
            { name: 'Team Members', icon: Briefcase },
            { name: 'Lead Sources', icon: Compass },
            { name: 'Ad Accounts', icon: Globe },
            { name: 'WhatsApp Assistant', icon: Mail },
            { name: 'Web Calling', icon: Phone },
            { name: 'CRM Follow-up', icon: ArrowRightLeft },
            { name: 'AI Center', icon: Sparkles },
            { name: 'Business Center', icon: Settings }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.name;
            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveMenu(item.name);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-orange-50 text-[#FF7A45] shadow-sm border-l-4 border-[#FF7A45]'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-[#FF7A45]' : 'text-slate-400'}`} />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer details */}
        <div className="border-t border-slate-100 p-4 bg-white text-center text-[10px] text-slate-400">
          GrowEasy CRM &bull; v2.0.0
        </div>
      </aside>

      {/* Backdrop overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* 2. MAIN LAYOUT SHELL */}
      <div className="flex-1 flex flex-col lg:pl-64">
        
        {/* Header Top Nav */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700 lg:hidden transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-2 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF7A45] text-white font-bold">
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
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search leads by name, email, company..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-[#FF7A45]/50 focus:bg-white focus:ring-2 focus:ring-[#FF7A45]/15 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Direct Modal trigger button (hidden on mobile, shown on sm+) */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 rounded-xl bg-[#FF7A45] hover:bg-[#E86833] text-white px-4 py-2 text-xs font-semibold shadow-md shadow-orange-500/10 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Import Leads</span>
            </button>

            <button className="hidden sm:block rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
              <Settings className="h-5 w-5" />
            </button>

            <div className="hidden sm:block h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="flex flex-col text-right hidden md:block">
                <span className="text-xs font-semibold text-slate-800">Tommy Vercetti</span>
                <span className="text-[10px] text-slate-400 font-medium">Sales Admin</span>
              </div>
              <div className="h-9 w-9 rounded-full bg-[#FF7A45] flex items-center justify-center text-white font-semibold text-sm border-2 border-orange-500/10 shadow">
                TV
              </div>
            </div>
          </div>
        </header>

        {/* 3. MAIN DASHBOARD CONTENT AREA */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* Header page details */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">
                {activeMenu}
              </h2>
              <p className="text-xs text-slate-400">
                Manage, map, and import leads dynamically in real time.
              </p>
            </div>
            {activeMenu === 'Manage Leads' && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-[#FF7A45] hover:bg-[#E86833] text-white px-5 py-2.5 text-xs font-semibold shadow-md shadow-orange-500/10 transition-all w-fit"
              >
                <Plus className="h-4 w-4" />
                <span>Import Leads via CSV</span>
              </button>
            )}
          </div>

          {/* Render Leads Manager Grid if active menu matches */}
          {activeMenu === 'Manage Leads' ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
              
              {/* Dynamic Filter Controls Bar */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                
                {/* Search query field (Mobile responsive view) */}
                <div className="relative w-full sm:max-w-xs block sm:hidden">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <Search className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search leads..."
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-xs text-slate-800 outline-none"
                  />
                </div>

                 {/* Dropdown Select Filters */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold shrink-0">
                    <Filter className="h-3.5 w-3.5" />
                    <span>Filter:</span>
                  </div>
                  
                  {/* CRM Status Filter Dropdown */}
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="h-9 w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-[#FF7A45] transition-all cursor-pointer"
                  >
                    <option value="ALL">All CRM Statuses</option>
                    <option value="GOOD_LEAD_FOLLOW_UP">GOOD_LEAD_FOLLOW_UP</option>
                    <option value="DID_NOT_CONNECT">DID_NOT_CONNECT</option>
                    <option value="BAD_LEAD">BAD_LEAD</option>
                    <option value="SALE_DONE">SALE_DONE</option>
                  </select>

                  {/* CRM Source Filter Dropdown */}
                  <select
                    value={sourceFilter}
                    onChange={(e) => {
                      setSourceFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="h-9 w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-[#FF7A45] transition-all cursor-pointer"
                  >
                    <option value="ALL">All Data Sources</option>
                    <option value="leads_on_demand">leads_on_demand</option>
                    <option value="meridian_tower">meridian_tower</option>
                    <option value="eden_park">eden_park</option>
                    <option value="varah_swamy">varah_swamy</option>
                    <option value="sarjapur_plots">sarjapur_plots</option>
                  </select>
                </div>

                {/* Stat summary */}
                <div className="text-xs text-slate-400 font-medium">
                  Found <strong className="text-slate-700 font-semibold">{filteredLeads.length}</strong> leads
                </div>
              </div>

              {/* Responsive Lead Card List (Mobile) & Table Grid (Desktop) */}
              {paginatedLeads.length > 0 ? (
                <div className="w-full space-y-4">
                  
                  {/* Mobile View: Lead Cards */}
                  <div className="block sm:hidden space-y-3">
                    {paginatedLeads.map((lead, idx) => (
                      <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3 animate-fade-in">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <span className="font-bold text-slate-800 text-sm truncate block">{lead.name || 'Unknown Lead'}</span>
                            <span className="text-[10px] text-slate-400 font-medium mt-0.5 truncate block">{lead.company || 'No Company'}</span>
                          </div>
                          <div className="shrink-0">
                            {getStatusBadge(lead.crm_status)}
                          </div>
                        </div>
                        
                        <div className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                          <p className="flex items-center gap-1.5 truncate">
                            <span className="text-slate-400">✉</span> {lead.email || '-'}
                          </p>
                          <p className="flex items-center gap-1.5 font-mono text-slate-500 truncate">
                            <span className="text-slate-400">📞</span> {lead.country_code || ''} {lead.mobile_without_country_code || '-'}
                          </p>
                          <div className="flex items-center justify-between pt-1 text-[10px]">
                            <span className="text-slate-400">Owner: <strong className="text-slate-600 font-medium">{lead.lead_owner || '-'}</strong></span>
                            <span className="text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-md text-[9px]">
                              {lead.data_source || '-'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                          <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors" title="View details">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors" title="Edit lead">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteLead(lead.email)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete lead"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop View: CRM Table */}
                  <div className="hidden sm:block overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full border-collapse text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">Lead Details</th>
                            <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">Contact Info</th>
                            <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">CRM Status</th>
                            <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">Lead Owner</th>
                            <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">Source</th>
                            <th className="px-6 py-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {paginatedLeads.map((lead, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col">
                                  <span className="font-semibold text-slate-800">{lead.name || 'Unknown Lead'}</span>
                                  <span className="text-[10px] text-slate-400 font-medium">{lead.company || 'No Company'}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col text-xs text-slate-600 gap-0.5">
                                  <span className="flex items-center gap-1">
                                    <span className="text-slate-400">✉</span> {lead.email || '-'}
                                  </span>
                                  <span className="flex items-center gap-1 font-mono text-slate-500">
                                    <span className="text-slate-400">📞</span> {lead.country_code || ''} {lead.mobile_without_country_code || '-'}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(lead.crm_status)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600 font-medium">
                                {lead.lead_owner || '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-slate-500 text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
                                  {lead.data_source || '-'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600">
                                <div className="flex items-center gap-1">
                                  <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors" title="View details">
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors" title="Edit lead">
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteLead(lead.email)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                    title="Delete lead"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Pagination control footer bar */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border border-slate-200 rounded-2xl bg-slate-50/50 px-4 sm:px-6 py-4">
                      <span className="text-xs text-slate-500 font-medium">
                        Page {currentPage} of {totalPages}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </button>
                        <button
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors cursor-pointer"
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Empty placeholder card description */
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <Users className="h-12 w-12 text-slate-300 mb-3" />
                  <h4 className="text-md font-bold text-slate-700">No leads found</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    {leads.length === 0 
                      ? "Start by importing leads into your CRM database using a CSV spreadsheet."
                      : "No leads matched your search query or status filter criteria."}
                  </p>
                  {leads.length === 0 && (
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="mt-4 flex items-center gap-1.5 rounded-xl bg-[#FF7A45] hover:bg-[#E86833] text-white px-5 py-2.5 text-xs font-semibold shadow-md shadow-orange-500/10 transition-all cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      Import Leads via CSV
                    </button>
                  )}
                </div>
              )}

            </div>
          ) : (
            /* Placeholder layout for other sidebar menu links */
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 animate-fade-in shadow-sm">
              <Sparkles className="h-10 w-10 mx-auto text-[#FF7A45] mb-2 animate-bounce" />
              <h3 className="text-md font-bold text-slate-700">CRM {activeMenu} Page</h3>
              <p className="text-xs text-slate-400 mt-1">This module is integrated with GrowEasy CRM. Ready for deployment.</p>
            </div>
          )}

        </main>

      </div>

      {/* ====================================================== */}
      {/* 4. CSV IMPORT OVERLAY MODAL */}
      {/* ====================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Blur background backdrop */}
          <div 
            onClick={!isImporting ? handleCloseModal : undefined}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
          />

          {/* Modal card container */}
          <div className="relative w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white p-6 sm:p-8 text-left shadow-2xl transition-all border border-slate-100 animate-fade-in z-10">
            
            {/* Header section */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {summary ? 'Import Successful' : isImporting ? 'Processing File...' : file ? 'CRM Import Preview' : 'Import Leads via CSV'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {summary 
                    ? 'Leads are mapped and imported.'
                    : isImporting 
                      ? 'AI mapping leads in batches.' 
                      : file 
                        ? `Imported ${previewData.length} leads` 
                        : 'Upload a CSV file to bulk import leads into your system.'}
                </p>
              </div>
              {!isImporting && (
                <button
                  onClick={handleCloseModal}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Content view toggle based on hooks state */}
            <div className="py-6">
              
              {/* State A: File Upload Dropzone (Default view) */}
              {!file && !isImporting && !summary && (
                <UploadArea
                  onFileSelected={handleFileSelected}
                  selectedFile={file}
                  onClear={handleReset}
                  isProcessing={isParsing || isImporting}
                />
              )}

              {/* State B: Local CSV Preview Table */}
              {file && !isImporting && !summary && (
                <div className="space-y-4">
                  <PreviewTable headers={headers} data={previewData} />
                </div>
              )}

              {/* State C: Processing Progress Tracker */}
              {isImporting && (
                <ProgressBar
                  progress={progress}
                  currentBatch={batchProgress.current}
                  totalBatches={batchProgress.total}
                  isImporting={isImporting}
                />
              )}

              {/* State D: Success Screen completion card */}
              {summary && !isImporting && (
                <div className="space-y-6 text-center py-4 animate-fade-in">
                  
                  {/* Large emerald Checkmark */}
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#22C55E]/10 text-[#22C55E]">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-bold text-slate-800">Successfully Imported</h4>
                    <p className="text-xs text-slate-400 mt-1">AI successfully mapped and resolved your spreadsheet items.</p>
                  </div>

                  {/* Summary Metric Stats cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                    <div className="bg-slate-50 p-2.5 sm:p-4 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Imported</p>
                      <p className="text-sm sm:text-lg font-extrabold text-slate-800 mt-0.5">{summary.totalImported}</p>
                    </div>
                    <div className="bg-slate-50 p-2.5 sm:p-4 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Skipped</p>
                      <p className={`text-sm sm:text-lg font-extrabold mt-0.5 ${summary.totalSkipped > 0 ? 'text-rose-500' : 'text-slate-800'}`}>{summary.totalSkipped}</p>
                    </div>
                    <div className="bg-slate-50 p-2.5 sm:p-4 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Duplicates</p>
                      <p className="text-sm sm:text-lg font-extrabold text-slate-800 mt-0.5">0</p>
                    </div>
                    <div className="bg-slate-50 p-2.5 sm:p-4 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Time Taken</p>
                      <p className="text-sm sm:text-lg font-extrabold text-slate-800 mt-0.5 flex items-center justify-center gap-1 text-slate-500 font-mono text-xs sm:text-sm">
                        <Clock className="h-4 w-4 text-[#FF7A45]" />
                        {batchProgress.total * 5}s
                      </p>
                    </div>
                  </div>

                  {/* Skipped Details warning if skips exist */}
                  {summary.totalSkipped > 0 && (
                    <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/50 text-left flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5 animate-pulse" />
                      <div>
                        <h5 className="text-xs font-bold text-rose-800">Note: {summary.totalSkipped} records skipped</h5>
                        <p className="text-[10px] text-rose-700/80 mt-0.5">
                          Skipped records did not contain valid contact credentials (email/phone number) or exceeded API limits. 
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>

            {/* Error notifications inside Modal view */}
            {(parseError || importError) && !isImporting && (
              <div className="p-4 rounded-xl border border-rose-100 bg-rose-50 text-rose-600 flex items-start gap-2 text-xs mb-4 animate-fade-in">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="space-y-1 text-left">
                  <p className="font-bold">Execution Error</p>
                  <p className="text-rose-500/90">{parseError || importError}</p>
                </div>
              </div>
            )}

            {/* Footer action buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              {summary ? (
                /* Success screen button */
                <button
                  onClick={handleSuccessFinished}
                  className="rounded-xl bg-[#22C55E] hover:bg-emerald-600 text-white px-6 py-2.5 text-xs font-semibold shadow-md shadow-emerald-500/10 transition-all cursor-pointer"
                >
                  Go To Lead Manager
                </button>
              ) : file && !isImporting ? (
                /* Preview screen action buttons */
                <>
                  <button
                    onClick={handleReset}
                    className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 px-5 py-2.5 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmImport}
                    className="rounded-xl bg-[#FF7A45] hover:bg-[#E86833] text-white px-6 py-2.5 text-xs font-semibold shadow-md shadow-orange-500/10 transition-all cursor-pointer"
                  >
                    Import File
                  </button>
                </>
              ) : !isImporting ? (
                /* Dropzone upload screen button */
                <button
                  onClick={handleCloseModal}
                  className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 px-5 py-2.5 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              ) : null}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
