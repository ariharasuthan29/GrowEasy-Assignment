export interface CSVRow {
  [key: string]: string;
}

export interface ParsedCSV {
  headers: string[];
  data: CSVRow[];
}
