import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef
} from '@tanstack/react-table';
import { CSVRow } from '../types/csv';
import { Table, Eye, Info } from 'lucide-react';

interface PreviewTableProps {
  headers: string[];
  data: CSVRow[];
}

export const PreviewTable: React.FC<PreviewTableProps> = ({ headers, data }) => {
  // Take first 50 rows for preview performance
  const previewData = useMemo(() => data.slice(0, 50), [data]);

  // Dynamically build columns based on CSV headers
  const columns = useMemo<ColumnDef<CSVRow>[]>(() => {
    return headers.map((header) => ({
      id: header,
      accessorKey: header,
      header: () => (
        <span className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
          {header}
        </span>
      ),
      cell: (info) => {
        const val = info.getValue() as string;
        return (
          <span className="text-sm text-slate-300 block truncate max-w-[200px]" title={val}>
            {val !== undefined && val !== null ? val : '-'}
          </span>
        );
      }
    }));
  }, [headers]);

  const table = useReactTable({
    data: previewData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full space-y-3 animate-fade-in">
      
      {/* Table Title and Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/30 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 text-slate-200">
          <Eye className="h-4 w-4 text-indigo-400" />
          <span className="font-semibold text-sm">Local CSV Preview</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Info className="h-3.5 w-3.5" />
          <span>
            Showing first {previewData.length} of {data.length} records. Confirm details below.
          </span>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950/40 backdrop-blur-sm shadow-xl">
        <div className="max-h-[350px] overflow-y-auto overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse text-left">
            
            {/* Sticky Header */}
            <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 shadow-md z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 border-r border-slate-800/50 last:border-r-0 whitespace-nowrap"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-800/50">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-900/30 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 border-r border-slate-800/40 last:border-r-0 whitespace-nowrap align-middle"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
};
