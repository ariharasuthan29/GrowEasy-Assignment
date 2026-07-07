import Papa from 'papaparse';
import { ParsedCSV, CSVRow } from '../types/csv';

/**
 * Parses a CSV file locally in the browser using PapaParse.
 * Generates headers and rows for UI previewing.
 */
export const parseCSVLocally = (file: File): Promise<ParsedCSV> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: (header) => {
        // Clean BOM and white spaces from headers
        return header.replace(/^\uFEFF/, '').trim();
      },
      complete: (results) => {
        const headers = results.meta.fields || [];
        const data = (results.data as CSVRow[]).map(row => {
          const cleanedRow: CSVRow = {};
          Object.keys(row).forEach(key => {
            cleanedRow[key] = typeof row[key] === 'string' ? row[key].trim() : row[key];
          });
          return cleanedRow;
        });

        resolve({
          headers,
          data
        });
      },
      error: (error) => {
        reject(new Error(`Failed to parse CSV file: ${error.message}`));
      }
    });
  });
};
