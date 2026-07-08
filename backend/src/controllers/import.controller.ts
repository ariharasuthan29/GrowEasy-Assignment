import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import { CSVService } from '../services/csv.service';
import { AIService } from '../services/ai.service';
import { chunkArray, retryWithBackoff } from '../utils/batch';
import { CRMRecord, ImportSummaryResponse } from '../types/crm';

export class ImportController {
  /**
   * Handles importing a CSV file.
   * Supports streaming progress back to the client using Server-Sent Events (SSE) or chunked JSON
   * if the client requests it via headers or query parameters (?stream=true).
   */
  public static async importCSV(req: Request, res: Response, next: NextFunction): Promise<void> {
    const file = req.file;
    if (!file) {
      res.status(400).json({ success: false, error: 'No CSV file uploaded' });
      return;
    }

    const filePath = file.path;
    const shouldStream = req.query.stream === 'true' || req.headers.accept === 'text/event-stream';

    try {
      // 1. Parse CSV
      const { headers, records } = await CSVService.parseCSV(filePath);
      
      // Delete file immediately after parsing to avoid storage build-up
      try {
        fs.unlinkSync(filePath);
      } catch (unlinkErr) {
        console.error('Failed to delete temporary CSV file:', unlinkErr);
      }

      if (records.length === 0) {
        res.status(400).json({ success: false, error: 'The uploaded CSV file is empty.' });
        return;
      }

      // 2. Split into batches of 20
      const batchSize = 20;
      const batches = chunkArray(records, batchSize);
      const totalBatches = batches.length;

      let totalImported = 0;
      let totalSkipped = 0;
      const importedRecords: CRMRecord[] = [];
      const skippedRecords: { record: any; reason: string }[] = [];
      let batchesProcessed = 0;
      let batchesFailed = 0;

      // Configure headers for streaming if requested
      if (shouldStream) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        // Disable compression for real-time streaming
        res.setHeader('X-Accel-Buffering', 'no');
        
        // Write initial progress
        res.write(`data: ${JSON.stringify({ type: 'start', totalBatches, totalRecords: records.length })}\n\n`);
      }

      // 3. Process batches
      for (let i = 0; i < totalBatches; i++) {
        const batchRecords = batches[i];
        
        try {
          // Throttle requests if using Google Gemini (Free tier has a 15 RPM rate limit)
          const apiKey = process.env.OPENAI_API_KEY || '';
          const isGemini = apiKey.startsWith('AIzaSy') || apiKey.startsWith('AQ') || (!apiKey.startsWith('sk-') && apiKey !== 'your_openai_api_key_here' && apiKey.length > 10);
          if (isGemini && i > 0) {
            // 4.2 seconds delay prevents exceeding 14 requests per minute
            await new Promise(resolve => setTimeout(resolve, 4200));
          }

          // Send batch to AI with retry mechanism (up to 3 retries, starting with 1000ms delay)
          const result = await retryWithBackoff(async () => {
            return await AIService.mapBatchToCRM(headers, batchRecords);
          }, 3, 1000);

          totalImported += result.imported.length;
          totalSkipped += result.skipped.length;
          importedRecords.push(...result.imported);
          skippedRecords.push(...result.skipped);
          batchesProcessed++;

          if (shouldStream) {
            res.write(`data: ${JSON.stringify({
              type: 'progress',
              batchIndex: i + 1,
              totalBatches,
              importedCount: result.imported.length,
              skippedCount: result.skipped.length,
              currentProgress: Math.round(((i + 1) / totalBatches) * 100)
            })}\n\n`);
          }
        } catch (batchErr: any) {
          console.error(`Batch ${i + 1} failed permanently:`, batchErr);
          batchesFailed++;
          totalSkipped += batchRecords.length;
          const failReason = `Batch processing failed: ${batchErr.message || batchErr}`;
          
          for (const rec of batchRecords) {
            skippedRecords.push({ record: rec, reason: failReason });
          }

          if (shouldStream) {
            res.write(`data: ${JSON.stringify({
              type: 'progress',
              batchIndex: i + 1,
              totalBatches,
              importedCount: 0,
              skippedCount: batchRecords.length,
              currentProgress: Math.round(((i + 1) / totalBatches) * 100),
              error: failReason
            })}\n\n`);
          }
        }
      }

      // 4. Return final response
      const summary: ImportSummaryResponse = {
        totalImported,
        totalSkipped,
        importedRecords,
        skippedRecords,
        batchesProcessed,
        batchesFailed
      };

      if (shouldStream) {
        res.write(`data: ${JSON.stringify({ type: 'done', summary })}\n\n`);
        res.end();
      } else {
        res.status(200).json({
          success: true,
          data: summary
        });
      }

    } catch (err: any) {
      // Clean up file if it still exists
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (_) {}
      }

      if (shouldStream) {
        res.write(`data: ${JSON.stringify({ type: 'error', error: err.message || err })}\n\n`);
        res.end();
      } else {
        next(err);
      }
    }
  }
}
