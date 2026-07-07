import fs from 'fs';
import csv from 'csv-parser';
import { ParsedCSVData, CSVRawRecord } from '../types/csv';

export class CSVService {
  /**
   * Parses a CSV file path into headers and raw rows.
   */
  public static async parseCSV(filePath: string): Promise<ParsedCSVData> {
    return new Promise((resolve, reject) => {
      const headers: string[] = [];
      const records: CSVRawRecord[] = [];

      if (!fs.existsSync(filePath)) {
        return reject(new Error(`File not found at path: ${filePath}`));
      }

      fs.createReadStream(filePath)
        .pipe(csv())
        .on('headers', (headerList: string[]) => {
          // Clean headers (remove BOM character if present, trim whitespace)
          const cleanedHeaders = headerList.map(h => h.replace(/^\uFEFF/, '').trim());
          headers.push(...cleanedHeaders);
        })
        .on('data', (data: any) => {
          // Clean up row keys and values
          const cleanedRecord: CSVRawRecord = {};
          Object.keys(data).forEach(key => {
            const cleanKey = key.replace(/^\uFEFF/, '').trim();
            cleanedRecord[cleanKey] = typeof data[key] === 'string' ? data[key].trim() : data[key];
          });
          records.push(cleanedRecord);
        })
        .on('end', () => {
          resolve({
            headers,
            records
          });
        })
        .on('error', (error) => {
          reject(new Error(`CSV Parsing failed: ${error.message}`));
        });
    });
  }
}
