import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef
} from '@tanstack/react-table';
import { CSVRow } from '../types/csv';
import { FileText } from 'lucide-react';

interface PreviewTableProps {
  headers: string[];
  data: CSVRow[];
}

export const PreviewTable: React.FC<PreviewTableProps> = ({ headers, data }) => {
  // Preview first 50 rows for viewport safety
  const previewData = useMemo(() => data.slice(0, 50), [data]);

  const columns = useMemo<ColumnDef<CSVRow>[]>(() => {
    return headers.map((header) => ({
      id: header,
      accessorKey: header,
      header: () => (
        <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
          {header}
        </span>
      ),
      cell: (info) => {
        const val = info.getValue() as string;
        return (
          <span className="text-xs text-slate-600 font-medium block truncate max-w-[150px]" title={val}>
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
    <div className="w-full space-y-2 animate-fade-in">
      
      {/* Short details badge */}
      <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 text-xs text-slate-500 w-fit">
        <FileText className="h-4 w-4 text-[#FF7A45]" />
        <span>
          Showing first {previewData.length} of {data.length} records.
        </span>
      </div>

      {/* Table Container */}
      <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="max-h-[250px] overflow-y-auto overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse text-left">
            
            {/* Locked Sticky Header */}
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 border-r border-slate-100 last:border-r-0 whitespace-nowrap bg-slate-50"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            {/* Content Body */}
            <tbody className="divide-y divide-slate-100">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-2.5 border-r border-slate-100 last:border-r-0 whitespace-nowrap align-middle"
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
