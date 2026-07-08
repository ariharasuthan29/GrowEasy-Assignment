import { getOpenAIClient } from '../config/openai';
import { PromptService } from './prompt.service';
import { CRMRecord } from '../types/crm';
import { validateCRMRecord } from '../utils/validation';
import OpenAI from 'openai';

export class AIService {
  /**
   * Maps a batch of raw records to CRM schema using AI.
   */
  public static async mapBatchToCRM(
    headers: string[],
    records: any[]
  ): Promise<{ imported: CRMRecord[]; skipped: { record: any; reason: string }[] }> {
    const imported: CRMRecord[] = [];
    const skipped: { record: any; reason: string }[] = [];

    try {
      const apiKey = process.env.OPENAI_API_KEY || '';
      
      let client: OpenAI;
      let model = 'gpt-4o-mini';

      // Auto-detect Gemini API Key (Gemini keys start with AIzaSy or AQ, or do not start with sk-)
      const isGemini = apiKey.startsWith('AIzaSy') || apiKey.startsWith('AQ') || (!apiKey.startsWith('sk-') && apiKey !== 'your_openai_api_key_here' && apiKey.length > 10);
      if (isGemini) {
        console.log('Gemini API key detected. Using Google Gemini OpenAI-compatibility layer.');
        client = new OpenAI({
          apiKey: apiKey,
          baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/'
        });
        model = 'gemini-1.5-flash';
      } else {
        client = getOpenAIClient();
      }

      const systemPrompt = PromptService.buildSystemPrompt();
      const userPrompt = PromptService.buildUserPrompt(headers, records);

      const response = await client.chat.completions.create({
        model: model,
        temperature: 0, // Enforce deterministic response
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      });

      const responseText = response.choices[0]?.message?.content || '';
      if (!responseText) {
        throw new Error('Empty response received from AI model.');
      }

      // Parse AI response
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
        
        // Find mapped record by matching some identifying attributes, or fall back to index matching
        const mappedRecord = recordsToValidate[i] || null;

        if (!mappedRecord) {
          skipped.push({
            record: originalRecord,
            reason: 'AI mapping did not return a corresponding record for this row.'
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
      console.error('AI Service mapping error:', error);
      // If the entire batch fails (e.g. API limit, invalid response format, etc.),
      // treat all records in this batch as skipped.
      for (const record of records) {
        skipped.push({
          record,
          reason: `AI Batch Processing Failure: ${error.message || error}`
        });
      }
    }

    return { imported, skipped };
  }
}
