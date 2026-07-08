import { ai } from '../config/gemini';
import { PromptService } from './prompt.service';
import { CRMRecord } from '../types/crm';
import { validateCRMRecord } from '../utils/validation';

export class AIService {
  /**
   * Maps a batch of raw records to CRM schema using the official Google Gemini SDK.
   */
  public static async mapBatchToCRM(
    headers: string[],
    records: any[]
  ): Promise<{ imported: CRMRecord[]; skipped: { record: any; reason: string }[] }> {
    const imported: CRMRecord[] = [];
    const skipped: { record: any; reason: string }[] = [];

    try {
      const systemPrompt = PromptService.buildSystemPrompt();
      const userPrompt = PromptService.buildUserPrompt(headers, records);

      // Call the official Gemini SDK
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${systemPrompt}\n\n${userPrompt}`,
        config: {
          responseMimeType: 'application/json',
          temperature: 0, // Enforce deterministic response mapping
        }
      });

      const responseText = response.text || '';
      if (!responseText) {
        throw new Error('Empty response received from Gemini AI model.');
      }

      // Parse Gemini response
      let parsedResponse: any;
      try {
        parsedResponse = JSON.parse(responseText);
      } catch (parseErr: any) {
        throw new Error(`Failed to parse AI response as JSON: ${parseErr.message}. Response: ${responseText}`);
      }

      // The AI response might return an array directly, or an object containing an array (e.g. { "records": [...] })
      let recordsToValidate: any[] = [];
      if (Array.isArray(parsedResponse)) {
        recordsToValidate = parsedResponse;
      } else if (parsedResponse && typeof parsedResponse === 'object') {
        const keys = Object.keys(parsedResponse);
        if (keys.length === 1 && Array.isArray(parsedResponse[keys[0]])) {
          recordsToValidate = parsedResponse[keys[0]];
        } else if (Array.isArray(parsedResponse.records)) {
          recordsToValidate = parsedResponse.records;
        } else if (Array.isArray(parsedResponse.data)) {
          recordsToValidate = parsedResponse.data;
        } else {
          // It might be a single object, wrap it
          recordsToValidate = [parsedResponse];
        }
      }

      // Validate each record in the batch
      for (let i = 0; i < records.length; i++) {
        const originalRecord = records[i];
        
        // Find mapped record by matching index
        const mappedRecord = recordsToValidate[i] || null;

        if (!mappedRecord) {
          skipped.push({
            record: originalRecord,
            reason: 'Gemini mapping did not return a corresponding record for this row.'
          });
          continue;
        }

        const validation = validateCRMRecord(mappedRecord);
        if (validation.isValid && validation.record) {
          imported.push(validation.record);
        } else {
          skipped.push({
            record: originalRecord,
            reason: validation.errorReason || 'Validation failed'
          });
        }
      }

    } catch (error: any) {
      console.error('Gemini Service mapping error:', error);
      // If the entire batch fails (e.g. API limit, invalid response format, etc.),
      // treat all records in this batch as skipped.
      for (const record of records) {
        skipped.push({
          record,
          reason: `Gemini Batch Processing Failure: ${error.message || error}`
        });
      }
    }

    return { imported, skipped };
  }
}
