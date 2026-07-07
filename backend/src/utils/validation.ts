import { CRMRecord, CRMRecordSchema, CRMStatus, DataSource } from '../types/crm';

/**
 * Validates a single CRM record and applies business rules:
 * 1. Must contain at least an email or a mobile number. If both are missing, it's skipped.
 * 2. Parses and validates against the CRM Zod schema.
 * 3. Sanitizes fields like email and mobile to make sure they conform.
 */
export interface ValidationResult {
  isValid: boolean;
  record: CRMRecord | null;
  errorReason?: string;
}

export function validateCRMRecord(record: any): ValidationResult {
  try {
    if (!record) {
      return { isValid: false, record: null, errorReason: 'Empty record object received' };
    }

    // Rule: If record contains neither email nor mobile, skip record
    const email = typeof record.email === 'string' ? record.email.trim() : '';
    const mobile = typeof record.mobile_without_country_code === 'string' ? record.mobile_without_country_code.trim() : '';

    if (!email && !mobile) {
      return {
        isValid: false,
        record: null,
        errorReason: 'Record contains neither email nor mobile number'
      };
    }

    // Helper to clean up email and mobile fields in case AI returned arrays or lists
    let cleanEmail = email;
    let cleanMobile = mobile;
    let extraNotes = '';

    // Handle multiple emails: If multiple emails exist, use first email, store remaining inside crm_note
    if (email.includes(',')) {
      const emailList = email.split(',').map(e => e.trim()).filter(Boolean);
      if (emailList.length > 0) {
        cleanEmail = emailList[0];
        if (emailList.length > 1) {
          extraNotes += ` [Alternative Emails: ${emailList.slice(1).join(', ')}]`;
        }
      }
    }

    // Handle multiple phone numbers: If multiple phone numbers exist, use first phone, store remaining inside crm_note
    if (mobile.includes(',')) {
      const mobileList = mobile.split(',').map(m => m.trim()).filter(Boolean);
      if (mobileList.length > 0) {
        cleanMobile = mobileList[0];
        if (mobileList.length > 1) {
          extraNotes += ` [Alternative Phones: ${mobileList.slice(1).join(', ')}]`;
        }
      }
    }

    // Append extra notes to crm_note if any
    let crmNote = record.crm_note || '';
    if (extraNotes) {
      crmNote = crmNote ? `${crmNote}${extraNotes}` : extraNotes.trim();
    }

    // Validate CRM Status
    const allowedStatuses: CRMStatus[] = ['GOOD_LEAD_FOLLOW_UP', 'DID_NOT_CONNECT', 'BAD_LEAD', 'SALE_DONE'];
    let crmStatus: CRMStatus | undefined = undefined;
    if (record.crm_status && allowedStatuses.includes(record.crm_status as CRMStatus)) {
      crmStatus = record.crm_status as CRMStatus;
    } else if (record.crm_status) {
      // Fallback if AI returned something else
      crmNote = crmNote ? `${crmNote} [Original Status: ${record.crm_status}]` : `[Original Status: ${record.crm_status}]`;
      crmStatus = 'GOOD_LEAD_FOLLOW_UP'; // default fallback
    }

    // Validate Data Source
    const allowedDataSources: DataSource[] = ['leads_on_demand', 'meridian_tower', 'eden_park', 'varah_swamy', 'sarjapur_plots'];
    let dataSource: DataSource | undefined = undefined;
    if (record.data_source && allowedDataSources.includes(record.data_source as DataSource)) {
      dataSource = record.data_source as DataSource;
    } else if (record.data_source) {
      crmNote = crmNote ? `${crmNote} [Original Data Source: ${record.data_source}]` : `[Original Data Source: ${record.data_source}]`;
      // default fallback could be none or first one
    }

    // Construct cleaned object
    const cleanedRecord: any = {
      created_at: record.created_at || new Date().toISOString(),
      name: record.name || 'Unknown Lead',
      email: cleanEmail || null,
      country_code: record.country_code || null,
      mobile_without_country_code: cleanMobile || null,
      company: record.company || null,
      city: record.city || null,
      state: record.state || null,
      country: record.country || null,
      lead_owner: record.lead_owner || null,
      crm_status: crmStatus || null,
      crm_note: crmNote || null,
      data_source: dataSource || null,
      possession_time: record.possession_time || null,
      description: record.description || null,
    };

    // Perform validation using Zod
    const result = CRMRecordSchema.safeParse(cleanedRecord);

    if (!result.success) {
      const errorMsg = result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      return {
        isValid: false,
        record: null,
        errorReason: `Zod Validation Error: ${errorMsg}`
      };
    }

    return {
      isValid: true,
      record: result.data
    };
  } catch (err: any) {
    return {
      isValid: false,
      record: null,
      errorReason: `Unexpected validation error: ${err.message || err}`
    };
  }
}
