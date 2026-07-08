import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileSpreadsheet, X, AlertCircle, FileCheck, Download } from 'lucide-react';

interface UploadAreaProps {
  onFileSelected: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  isProcessing: boolean;
}

export const UploadArea: React.FC<UploadAreaProps> = ({
  onFileSelected,
  selectedFile,
  onClear,
  isProcessing
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelected(acceptedFiles[0]);
    }
  }, [onFileSelected]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    maxFiles: 1,
    disabled: isProcessing
  });

  const getFileSizeString = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Triggers downloading the pre-written sample_leads.csv from root
  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/sample_leads.csv';
    link.setAttribute('download', 'sample_leads.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full space-y-4">
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center transition-all duration-300 ${
            isDragActive
              ? 'border-[#FF7A45] bg-orange-50/20'
              : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-4">
            
            {/* Upload icon container */}
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-slate-100 shadow-sm transition-all duration-300 ${
              isDragActive ? 'scale-110 text-[#FF7A45]' : 'group-hover:scale-105'
            }`}>
              <UploadCloud className={`h-7 w-7 text-slate-400 transition-colors duration-300 ${
                isDragActive ? 'text-[#FF7A45]' : 'group-hover:text-slate-600'
              }`} />
            </div>

            {/* Instruction text */}
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-700">
                Drop your CSV file here
              </p>
              <p className="text-xs text-slate-400">
                or <span className="text-[#FF7A45] hover:text-[#E86833] underline font-medium">browse local files</span>
              </p>
            </div>

            {/* Support footer */}
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-medium text-slate-500">
              Supported file: CSV (Max size 10MB)
            </span>

          </div>

          {/* Rejections warning */}
          {fileRejections.length > 0 && (
            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-rose-500 animate-pulse">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Please upload a valid CSV file.</span>
            </div>
          )}

        </div>
      ) : (
        /* File loaded display state */
        <div className="flex items-center justify-between rounded-2xl border border-[#22C55E]/20 bg-[#22C55E]/5 p-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white border border-emerald-100 text-[#22C55E] shadow-sm">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 truncate max-w-[220px] sm:max-w-md">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-400">
                {getFileSizeString(selectedFile.size)}
              </p>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            disabled={isProcessing}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-100 bg-white text-slate-400 hover:text-rose-500 hover:border-rose-100 shadow-sm transition-all disabled:opacity-50"
            title="Remove File"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Template download link button (GrowEasy Style) */}
      {!selectedFile && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-[#22C55E]/5 hover:bg-[#22C55E]/10 text-[#22C55E] px-5 py-2.5 text-xs font-semibold shadow-sm transition-colors duration-200"
          >
            <Download className="h-3.5 w-3.5" />
            Download Sample CSV Template
          </button>
        </div>
      )}
    </div>
  );
};
