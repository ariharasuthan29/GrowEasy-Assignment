import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

// We initialize the client only if apiKey is present, or defer initialization.
// If apiKey is missing, we'll return a helpful message when an import starts.
export const getOpenAIClient = (): OpenAI => {
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    throw new Error('OPENAI_API_KEY is not set in environment variables.');
  }
  
  return new OpenAI({
    apiKey: apiKey,
  });
};
