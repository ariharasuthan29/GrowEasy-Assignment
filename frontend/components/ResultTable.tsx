import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef
} from '@tanstack/react-table';
import { CRMRecord, SkippedRecord } from '../types/crm';
import { CheckCircle2, XCircle, AlertTriangle, Eye, Trash2, Edit } from 'lucide-react';

interface ResultTableProps {
  importedRecords: CRMRecord[];
  skippedRecords: SkippedRecord[];
}

export const ResultTable: React.FC<ResultTableProps> = ({
  importedRecords,
  skippedRecords
}) => {
  const [activeTab, setActiveTab] = useState<'imported' | 'skipped'>('imported');

  // Columns for Imported records
  const importedColumns = useMemo<ColumnDef<CRMRecord>[]>(() => [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: (info) => <span className="font-semibold text-slate-700">{info.getValue() as string || 'Unknown'}</span>
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: (info) => <span className="text-slate-600 text-xs">{info.getValue() as string || '-'}</span>
    },
    {
      accessorKey: 'mobile_without_country_code',
      header: 'Mobile',
      cell: (info) => {
        const row = info.row.original;
        const code = row.country_code || '';
        const phone = info.getValue() as string || '';
        return <span className="text-slate-600 text-xs">{phone ? `${code} ${phone}`.trim() : '-'}</span>;
      }
    },
    {
      accessorKey: 'crm_status',
      header: 'CRM Status',
      cell: (info) => {
        const status = info.getValue() as string;
        let badgeColor = 'bg-slate-50 text-slate-600 border-slate-200';
        if (status === 'GOOD_LEAD_FOLLOW_UP') {
          badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        } else if (status === 'DID_NOT_CONNECT') {
          badgeColor = 'bg-orange-50 text-orange-700 border-orange-200';
        } else if (status === 'BAD_LEAD') {
          badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
        } else if (status === 'SALE_DONE') {
          badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
        }

        return (
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badgeColor}`}>
            {status || 'Unknown'}
          </span>
        );
      }
    },
    {
      accessorKey: 'data_source',
      header: 'Source',
      cell: (info) => <span className="text-slate-500 text-xs font-medium">{info.getValue() as string || '-'}</span>
    },
    {
      accessorKey: 'crm_note',
      header: 'Notes / Extras',
      cell: (info) => (
        <span className="text-slate-500 text-xs truncate max-w-[200px] block" title={info.getValue() as string}>
          {info.getValue() as string || '-'}
        </span>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: () => (
        <div className="flex items-center gap-2">
          <button className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors" title="View">
            <Eye className="h-3.5 w-3.5" />
          </button>
          <button className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors" title="Edit">
            <Edit className="h-3.5 w-3.5" />
          </button>
          <button className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors" title="Delete">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )
    }
  ], []);

  // Columns for Skipped records
  const skippedColumns = useMemo<ColumnDef<SkippedRecord>[]>(() => [
    {
      id: 'index',
      header: '#',
      cell: (info) => <span className="text-slate-400 font-mono text-xs">{info.row.index + 1}</span>,
      size: 50
    },
    {
      accessorKey: 'reason',
      header: 'Reason for Skipping',
      cell: (info) => (
        <div className="flex items-start gap-1.5 text-rose-600 font-medium text-xs py-1">
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
          <pre className="text-[10px] font-mono text-slate-600 max-w-[400px] overflow-x-auto bg-slate-50 p-2 rounded border border-slate-200">
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
      
      {/* Tab Selectors */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('imported')}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold transition-all duration-200 ${
            activeTab === 'imported'
              ? 'border-[#FF7A45] text-[#FF7A45]'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <CheckCircle2 className={`h-4.5 w-4.5 ${activeTab === 'imported' ? 'text-[#FF7A45]' : 'text-slate-400'}`} />
          Imported Leads
          <span className={`ml-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
            activeTab === 'imported' ? 'bg-orange-50 text-[#FF7A45]' : 'bg-slate-100 text-slate-500'
          }`}>
            {importedRecords.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('skipped')}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold transition-all duration-200 ${
            activeTab === 'skipped'
              ? 'border-rose-500 text-rose-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <XCircle className={`h-4.5 w-4.5 ${activeTab === 'skipped' ? 'text-rose-500' : 'text-slate-400'}`} />
          Skipped Rows
          <span className={`ml-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
            activeTab === 'skipped' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'
          }`}>
            {skippedRecords.length}
          </span>
        </button>
      </div>

      {/* Grid view sheets */}
      {activeTab === 'imported' ? (
        importedRecords.length > 0 ? (
          <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="max-h-[380px] overflow-y-auto overflow-x-auto custom-scrollbar">
              <table className="w-full border-collapse text-left">
                <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 shadow-sm z-10">
                  {importedTable.getHeaderGroups().map(hg => (
                    <tr key={hg.id}>
                      {hg.headers.map(header => (
                        <th key={header.id} className="px-4 py-3 text-xs font-semibold tracking-wider text-slate-500 uppercase bg-slate-50">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {importedTable.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
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
          <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-400">
            <CheckCircle2 className="h-10 w-10 text-slate-300 mb-2" />
            <p className="text-sm font-medium">No leads imported in this run.</p>
          </div>
        )
      ) : (
        skippedRecords.length > 0 ? (
          <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="max-h-[380px] overflow-y-auto overflow-x-auto custom-scrollbar">
              <table className="w-full border-collapse text-left">
                <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 shadow-sm z-10">
                  {skippedTable.getHeaderGroups().map(hg => (
                    <tr key={hg.id}>
                      {hg.headers.map(header => (
                        <th key={header.id} className="px-4 py-3 text-xs font-semibold tracking-wider text-slate-500 uppercase bg-slate-50">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {skippedTable.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
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
          <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-400">
            <CheckCircle2 className="h-10 w-10 text-emerald-500/50 mb-2" />
            <p className="text-sm font-medium">All records successfully processed.</p>
          </div>
        )
      )}

    </div>
  );
};
