export interface CSVRawRecord {
  [key: string]: string;
}

export interface ParsedCSVData {
  headers: string[];
  records: CSVRawRecord[];
}
