import { useState, useCallback } from 'react';
import { CSVRow, ParsedCSV } from '../types/csv';
import { parseCSVLocally } from '../utils/csvParser';
import toast from 'react-hot-toast';

export const useCSV = () => {
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [data, setData] = useState<CSVRow[]>([]);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const parseFile = useCallback(async (selectedFile: File) => {
    setIsParsing(true);
    setError(null);
    setFile(selectedFile);

    try {
      const parsed: ParsedCSV = await parseCSVLocally(selectedFile);
      if (parsed.data.length === 0) {
        throw new Error('The uploaded CSV file contains no data rows.');
      }
      setHeaders(parsed.headers);
      setData(parsed.data);
      toast.success(`Successfully parsed ${parsed.data.length} rows locally!`);
    } catch (err: any) {
      const errMsg = err.message || 'Failed to parse CSV';
      setError(errMsg);
      setFile(null);
      setHeaders([]);
      setData([]);
      toast.error(errMsg);
    } finally {
      setIsParsing(false);
    }
  }, []);

  const resetCSV = useCallback(() => {
    setFile(null);
    setHeaders([]);
    setData([]);
    setError(null);
  }, []);

  return {
    file,
    headers,
    data,
    isParsing,
    error,
    parseFile,
    resetCSV
  };
};
export type UseCSVReturn = ReturnType<typeof useCSV>;
