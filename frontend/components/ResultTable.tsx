import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef
} from '@tanstack/react-table';
import { CRMRecord, SkippedRecord } from '../types/crm';
import { CheckCircle2, XCircle, FileSpreadsheet, EyeOff, AlertTriangle } from 'lucide-react';

interface ResultTableProps {
  importedRecords: CRMRecord[];
  skippedRecords: SkippedRecord[];
}

export const ResultTable: React.FC<ResultTableProps> = ({
  importedRecords,
  skippedRecords
}) => {
  const [activeTab, setActiveTab] = useState<'imported' | 'skipped'>('imported');

  // Define Columns for Imported Records
  const importedColumns = useMemo<ColumnDef<CRMRecord>[]>(() => [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: (info) => <span className="font-semibold text-slate-200">{info.getValue() as string || 'Unknown'}</span>
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: (info) => <span className="text-slate-300">{info.getValue() as string || '-'}</span>
    },
    {
      accessorKey: 'mobile_without_country_code',
      header: 'Mobile',
      cell: (info) => {
        const row = info.row.original;
        const code = row.country_code || '';
        const phone = info.getValue() as string || '';
        return <span className="text-slate-300">{phone ? `${code} ${phone}`.trim() : '-'}</span>;
      }
    },
    {
      accessorKey: 'crm_status',
      header: 'CRM Status',
      cell: (info) => {
        const status = info.getValue() as string;
        let badgeColor = 'bg-slate-800 text-slate-400 border-slate-700';
        if (status === 'GOOD_LEAD_FOLLOW_UP') {
          badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        } else if (status === 'DID_NOT_CONNECT') {
          badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        } else if (status === 'BAD_LEAD') {
          badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
        } else if (status === 'SALE_DONE') {
          badgeColor = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
        }

        return (
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${badgeColor}`}>
            {status || 'Unknown'}
          </span>
        );
      }
    },
    {
      accessorKey: 'data_source',
      header: 'Source',
      cell: (info) => <span className="text-slate-400 text-xs">{info.getValue() as string || '-'}</span>
    },
    {
      accessorKey: 'crm_note',
      header: 'Notes / Extras',
      cell: (info) => (
        <span className="text-slate-400 text-xs truncate max-w-[250px] block" title={info.getValue() as string}>
          {info.getValue() as string || '-'}
        </span>
      )
    }
  ], []);

  // Define Columns for Skipped Records
  const skippedColumns = useMemo<ColumnDef<SkippedRecord>[]>(() => [
    {
      id: 'index',
      header: '#',
      cell: (info) => <span className="text-slate-500 font-mono text-xs">{info.row.index + 1}</span>,
      size: 50
    },
    {
      accessorKey: 'reason',
      header: 'Reason for Skipping',
      cell: (info) => (
        <div className="flex items-start gap-1.5 text-rose-400 font-medium text-xs py-1">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <span>{info.getValue() as string}</span>
        </div>
      )
    },
    {
      accessorKey: 'record',
      header: 'Raw Row Content',
      cell: (info) => {
        const raw = info.getValue() as object;
        return (
          <pre className="text-[10px] font-mono text-slate-400 max-w-[400px] overflow-x-auto bg-slate-950 p-2 rounded border border-slate-800">
            {JSON.stringify(raw, null, 2)}
          </pre>
        );
      }
    }
  ], []);

  const importedTable = useReactTable({
    data: importedRecords,
    columns: importedColumns,
    getCoreRowModel: getCoreRowModel()
  });

  const skippedTable = useReactTable({
    data: skippedRecords,
    columns: skippedColumns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className="w-full space-y-4 animate-fade-in">
      
      {/* Tabs / Selectors */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('imported')}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-medium transition-all duration-200 ${
            activeTab === 'imported'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800'
          }`}
        >
          <CheckCircle2 className={`h-4.5 w-4.5 ${activeTab === 'imported' ? 'text-indigo-400' : 'text-slate-500'}`} />
          Imported Leads
          <span className={`ml-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
            activeTab === 'imported' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'
          }`}>
            {importedRecords.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('skipped')}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-medium transition-all duration-200 ${
            activeTab === 'skipped'
              ? 'border-rose-500 text-rose-400'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800'
          }`}
        >
          <XCircle className={`h-4.5 w-4.5 ${activeTab === 'skipped' ? 'text-rose-400' : 'text-slate-500'}`} />
          Skipped Rows
          <span className={`ml-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
            activeTab === 'skipped' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'
          }`}>
            {skippedRecords.length}
          </span>
        </button>
      </div>

      {/* Content Panels */}
      {activeTab === 'imported' ? (
        importedRecords.length > 0 ? (
          <div className="w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900/10 backdrop-blur-sm shadow-xl">
            <div className="max-h-[380px] overflow-y-auto overflow-x-auto custom-scrollbar">
              <table className="w-full border-collapse text-left">
                <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 shadow z-10">
                  {importedTable.getHeaderGroups().map(hg => (
                    <tr key={hg.id}>
                      {hg.headers.map(header => (
                        <th key={header.id} className="px-4 py-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {importedTable.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-slate-900/20 transition-colors">
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-4 py-3 whitespace-nowrap align-middle">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-slate-800/50 bg-slate-900/10 text-slate-500">
            <EyeOff className="h-10 w-10 text-slate-600 mb-2" />
            <p className="text-sm font-medium">No leads were successfully imported.</p>
            <p className="text-xs text-slate-600 mt-1">Make sure your file contains emails or phone numbers.</p>
          </div>
        )
      ) : (
        skippedRecords.length > 0 ? (
          <div className="w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900/10 backdrop-blur-sm shadow-xl">
            <div className="max-h-[380px] overflow-y-auto overflow-x-auto custom-scrollbar">
              <table className="w-full border-collapse text-left">
                <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 shadow z-10">
                  {skippedTable.getHeaderGroups().map(hg => (
                    <tr key={hg.id}>
                      {hg.headers.map(header => (
                        <th key={header.id} className="px-4 py-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {skippedTable.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-slate-900/20 transition-colors">
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-4 py-3 whitespace-normal align-top">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-slate-800/50 bg-slate-900/10 text-slate-500">
            <CheckCircle2 className="h-10 w-10 text-emerald-500/50 mb-2" />
            <p className="text-sm font-medium text-slate-400">Zero records skipped!</p>
            <p className="text-xs text-slate-600 mt-1">All uploaded rows mapped to CRM records successfully.</p>
          </div>
        )
      )}

    </div>
  );
};
