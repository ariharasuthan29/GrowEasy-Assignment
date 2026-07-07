import { useState, useCallback } from 'react';
import { ImportSummary, ProgressUpdate } from '../types/crm';
import { importCSVStream } from '../services/api';
import toast from 'react-hot-toast';

export const useImport = () => {
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startImport = useCallback(async (file: File) => {
    setIsImporting(true);
    setProgress(0);
    setBatchProgress({ current: 0, total: 0 });
    setSummary(null);
    setError(null);

    const toastId = toast.loading('Initializing import session...');

    try {
      const finalSummary = await importCSVStream(file, (update: ProgressUpdate) => {
        if (update.type === 'start') {
          setBatchProgress({ current: 0, total: update.totalBatches || 0 });
          toast.loading(`Processing file... Total batches to map: ${update.totalBatches}`, { id: toastId });
        } else if (update.type === 'progress') {
          setProgress(update.currentProgress || 0);
          setBatchProgress(prev => ({
            ...prev,
            current: update.batchIndex || prev.current
          }));
          toast.loading(`Mapping batch ${update.batchIndex} of ${update.totalBatches}... (${update.currentProgress}%)`, { id: toastId });
        } else if (update.type === 'error' && update.error) {
          throw new Error(update.error);
        }
      });

      setSummary(finalSummary);
      setProgress(100);
      toast.success(`Import complete! Imported: ${finalSummary.totalImported}, Skipped: ${finalSummary.totalSkipped}`, {
        id: toastId,
        duration: 5000
      });
    } catch (err: any) {
      const errMsg = err.message || 'Import failed. Please try again.';
      setError(errMsg);
      toast.error(errMsg, { id: toastId, duration: 6000 });
    } finally {
      setIsImporting(false);
    }
  }, []);

  const resetImport = useCallback(() => {
    setIsImporting(false);
    setProgress(0);
    setBatchProgress({ current: 0, total: 0 });
    setSummary(null);
    setError(null);
  }, []);

  return {
    isImporting,
    progress,
    batchProgress,
    summary,
    error,
    startImport,
    resetImport
  };
};
export type UseImportReturn = ReturnType<typeof useImport>;
