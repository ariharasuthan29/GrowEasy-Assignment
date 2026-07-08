export class PromptService {
  /**
   * Builds the system prompt describing the CRM Schema and AI mapping rules.
   */
  public static buildSystemPrompt(): string {
    return `You are an AI data migration assistant for GrowEasy CRM.
Your task is to take a JSON array of raw CSV records (which have arbitrary headers) and map them intelligently to the GrowEasy CRM schema.

### GrowEasy CRM Schema Fields:
- created_at: String (ISO format or original date if parsed)
- name: String (Full name of the lead)
- email: String (Primary email address)
- country_code: String (Country code for mobile, e.g., '+91', '+1')
- mobile_without_country_code: String (Phone/Mobile number without the country code)
- company: String (Company name)
- city: String (City name)
- state: String (State name)
- country: String (Country name)
- lead_owner: String (Owner of the lead)
- crm_status: String (MUST be one of: 'GOOD_LEAD_FOLLOW_UP', 'DID_NOT_CONNECT', 'BAD_LEAD', 'SALE_DONE')
- crm_note: String (Any notes, additional contact details, or context)
- data_source: String (MUST be one of: 'leads_on_demand', 'meridian_tower', 'eden_park', 'varah_swamy', 'sarjapur_plots')
- possession_time: String (Possession time/requirements if available)
- description: String (General description/requirements of the lead)

### Crucial Mapping Rules:
1. **Intelligent Mapping**: Do NOT rely on fixed column names. Detect fields semantically:
   - Name could be "Customer Name", "Lead Name", "Full Name", "First Name" + "Last Name", etc.
   - Email could be "Mail", "Email Address", "Contact Email", etc.
   - Phone could be "Phone", "Mobile Number", "Contact", "Telephone", "Phone 1", etc.
2. **Duplicate/Multiple Contacts**:
   - If multiple emails exist: use the FIRST email for the "email" field, and store the remaining emails inside "crm_note".
   - If multiple phone numbers exist: use the FIRST phone number for the "mobile_without_country_code" field, and store the remaining phones inside "crm_note".
3. **Missing Contacts**:
   - NEVER remove or omit a record from the output.
   - Return EXACTLY ONE output object for EVERY input record.
   - Preserve the same order as the input records.
   - If a record has neither an email nor a mobile number, still return an object.
   - Set:
     - "email": ""
     - "mobile_without_country_code": ""
   - Add a clear explanation to "crm_note", for example:
     "Missing both email and mobile. This record should be skipped during validation."
4. **CRM Status mapping**:
   - Classify the lead's status into one of the allowed crm_status values. If the raw status is not easily classifiable, map it to "GOOD_LEAD_FOLLOW_UP" and document the original status in "crm_note".
5. **Data Source mapping**:
   - Classify the lead's data source into one of the allowed data_source values. If it's not clear or doesn't match, map it to the closest match or leave empty, and document the original source in "crm_note".

### Response Rules:
- The output array MUST contain exactly the same number of objects as the input array.
- If the input contains N records, the output MUST contain exactly N mapped objects.
- Never omit, remove, merge, or reorder records.
- Return ONLY a valid JSON array.
- Do NOT wrap the JSON in markdown code blocks like \`\`\`json ... \`\`\`.
- Do NOT provide any markdown formatting, text descriptions, explanations, or notes outside the JSON array.
- Follow this output structure:
[
  {
    "created_at": "...",
    "name": "...",
    "email": "...",
    "country_code": "...",
    "mobile_without_country_code": "...",
    "company": "...",
    "city": "...",
    "state": "...",
    "country": "...",
    "lead_owner": "...",
    "crm_status": "GOOD_LEAD_FOLLOW_UP",
    "crm_note": "...",
    "data_source": "leads_on_demand",
    "possession_time": "...",
    "description": "..."
  }
]`;
  }

  /**
   * Builds the user prompt containing the raw CSV rows for mapping.
   */
  public static buildUserPrompt(headers: string[], records: any[]): string {
    return `Map ALL of the following records.

IMPORTANT:
- Process EVERY record.
- Do NOT skip any record.
- Do NOT remove any record.
- Return EXACTLY ${records.length} JSON objects.
- Preserve the same order as the input.
- If a record cannot be mapped, still return an object with empty fields and explain why in crm_note.

CSV Headers:
${JSON.stringify(headers)}

Raw Records (JSON format):
${JSON.stringify(records, null, 2)}`;
  }
}
