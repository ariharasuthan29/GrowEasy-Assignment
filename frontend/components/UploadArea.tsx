import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileSpreadsheet, X, AlertCircle } from 'lucide-react';

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

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-300 ${
            isDragActive
              ? 'border-indigo-500 bg-indigo-950/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
              : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-4">
            
            {/* Upload Icon Container */}
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/80 border border-slate-700/50 transition-all duration-300 ${
              isDragActive ? 'scale-110 bg-indigo-500/10 border-indigo-400/50' : 'group-hover:scale-105 group-hover:bg-slate-800 group-hover:border-slate-600'
            }`}>
              <UploadCloud className={`h-8 w-8 text-slate-400 transition-colors duration-300 ${
                isDragActive ? 'text-indigo-400' : 'group-hover:text-slate-300'
              }`} />
            </div>

            {/* Instruction Texts */}
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-200">
                {isDragActive ? 'Drop your CSV file here' : 'Drag & drop your CSV file here'}
              </p>
              <p className="text-xs text-slate-400">
                or click to browse your local directory
              </p>
            </div>

            {/* Limit Details */}
            <span className="rounded-full border border-slate-800 bg-slate-950/60 px-3 py-1 text-[10px] text-slate-500">
              Only valid .csv files up to 10MB
            </span>

          </div>

          {/* Invalid File Rejections */}
          {fileRejections.length > 0 && (
            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-rose-400 animate-pulse">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Please upload a valid CSV (.csv) file under 10MB.</span>
            </div>
          )}

        </div>
      ) : (
        /* File Details View */
        <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200 truncate max-w-[200px] sm:max-w-md">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-400">
                {getFileSizeString(selectedFile.size)}
              </p>
            </div>
          </div>

          <button
            onClick={onClear}
            disabled={isProcessing}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Remove File"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};
