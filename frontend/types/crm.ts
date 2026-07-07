export type CRMStatus = 
  | 'GOOD_LEAD_FOLLOW_UP'
  | 'DID_NOT_CONNECT'
  | 'BAD_LEAD'
  | 'SALE_DONE';

export type DataSource =
  | 'leads_on_demand'
  | 'meridian_tower'
  | 'eden_park'
  | 'varah_swamy'
  | 'sarjapur_plots';

export interface CRMRecord {
  created_at?: string | null;
  name?: string | null;
  email?: string | null;
  country_code?: string | null;
  mobile_without_country_code?: string | null;
  company?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  lead_owner?: string | null;
  crm_status?: CRMStatus | null;
  crm_note?: string | null;
  data_source?: DataSource | null;
  possession_time?: string | null;
  description?: string | null;
  [key: string]: any; // fallback for rendering flexibility
}

export interface SkippedRecord {
  record: any;
  reason: string;
}

export interface ImportSummary {
  totalImported: number;
  totalSkipped: number;
  importedRecords: CRMRecord[];
  skippedRecords: SkippedRecord[];
  batchesProcessed: number;
  batchesFailed: number;
}

export interface ProgressUpdate {
  type: 'start' | 'progress' | 'done' | 'error';
  batchIndex?: number;
  totalBatches?: number;
  importedCount?: number;
  skippedCount?: number;
  currentProgress?: number;
  summary?: ImportSummary;
  error?: string;
}
