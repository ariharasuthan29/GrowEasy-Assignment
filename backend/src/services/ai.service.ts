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
      const friendlyError = AIService.formatAIError(error);
      // If the entire batch fails (e.g. API limit, invalid response format, etc.),
      // treat all records in this batch as skipped.
      for (const record of records) {
        skipped.push({
          record,
          reason: friendlyError
        });
      }
    }

    return { imported, skipped };
  }

  /**
   * Formats raw API error responses into clean, user-friendly strings.
   */
  private static formatAIError(error: any): string {
    const errMsg = typeof error === 'string' ? error : error.message || JSON.stringify(error);
    
    if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('insufficient_quota')) {
      return 'AI service rate limit reached. The Gemini API free quota has been exhausted. Please wait a few minutes and try again, or use a new API key/project with available quota.';
    }
    
    if (errMsg.includes('401') || errMsg.includes('invalid_api_key') || errMsg.includes('Incorrect API key')) {
      return 'Incorrect or invalid API key provided. Please verify your credentials in the environment configuration.';
    }
    
    if (errMsg.includes('404')) {
      return 'AI service endpoint not found (404). Please verify your model names and SDK configuration.';
    }
    
    return `AI mapping engine encountered an error: ${error.message || errMsg}`;
  }
}
