import { ImportSummary, ProgressUpdate } from '../types/crm';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Uploads a CSV file and streams progress updates in real-time.
 * Uses native fetch and ReadableStream to parse the SSE (Server-Sent Events) chunks.
 */
export const importCSVStream = async (
  file: File,
  onProgress: (progress: ProgressUpdate) => void
): Promise<ImportSummary> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/import?stream=true`, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'text/event-stream'
    }
  });

  if (!response.ok) {
    const text = await response.text();
    let errorMessage = 'Failed to upload CSV file';
    try {
      const errorJson = JSON.parse(text);
      errorMessage = errorJson.error || errorMessage;
    } catch (_) {
      errorMessage = text || errorMessage;
    }
    throw new Error(errorMessage);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  if (!reader) {
    throw new Error('Response body stream is not available');
  }

  let buffer = '';
  let finalSummary: ImportSummary | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    
    // Split buffer by lines
    const lines = buffer.split('\n');
    
    // Save last incomplete line back to buffer
    buffer = lines.pop() || '';

    for (const line of lines) {
      const cleanedLine = line.trim();
      if (!cleanedLine) continue;

      if (cleanedLine.startsWith('data: ')) {
        const jsonStr = cleanedLine.slice(6);
        try {
          const parsed = JSON.parse(jsonStr) as ProgressUpdate;
          onProgress(parsed);
          
          if (parsed.type === 'done' && parsed.summary) {
            finalSummary = parsed.summary;
          } else if (parsed.type === 'error' && parsed.error) {
            throw new Error(parsed.error);
          }
        } catch (e: any) {
          if (e instanceof SyntaxError) {
            console.error('Failed to parse SSE JSON chunk:', jsonStr);
          } else {
            throw e;
          }
        }
      }
    }
  }

  // Handle any remaining content in the buffer
  if (buffer.trim().startsWith('data: ')) {
    const jsonStr = buffer.trim().slice(6);
    try {
      const parsed = JSON.parse(jsonStr) as ProgressUpdate;
      onProgress(parsed);
      if (parsed.type === 'done' && parsed.summary) {
        finalSummary = parsed.summary;
      } else if (parsed.type === 'error' && parsed.error) {
        throw new Error(parsed.error);
      }
    } catch (_) {}
  }

  if (!finalSummary) {
    throw new Error('Import process ended without returning a final summary.');
  }

  return finalSummary;
};
