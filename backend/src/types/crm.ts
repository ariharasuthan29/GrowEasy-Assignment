import { z } from 'zod';

export const CRMStatusSchema = z.enum([
  'GOOD_LEAD_FOLLOW_UP',
  'DID_NOT_CONNECT',
  'BAD_LEAD',
  'SALE_DONE'
]);

export type CRMStatus = z.infer<typeof CRMStatusSchema>;

export const DataSourceSchema = z.enum([
  'leads_on_demand',
  'meridian_tower',
  'eden_park',
  'varah_swamy',
  'sarjapur_plots'
]);

export type DataSource = z.infer<typeof DataSourceSchema>;

export const CRMRecordSchema = z.object({
  created_at: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  country_code: z.string().optional().nullable(),
  mobile_without_country_code: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  lead_owner: z.string().optional().nullable(),
  crm_status: CRMStatusSchema.optional().nullable(),
  crm_note: z.string().optional().nullable(),
  data_source: DataSourceSchema.optional().nullable(),
  possession_time: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export type CRMRecord = z.infer<typeof CRMRecordSchema>;

export interface ProcessedBatchResult {
  batchIndex: number;
  imported: CRMRecord[];
  skipped: {
    record: any;
    reason: string;
  }[];
  success: boolean;
  error?: string;
}

export interface ImportSummaryResponse {
  totalImported: number;
  totalSkipped: number;
  importedRecords: CRMRecord[];
  skippedRecords: {
    record: any;
    reason: string;
  }[];
  batchesProcessed: number;
  batchesFailed: number;
}
