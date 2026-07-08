import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey || apiKey === 'your_openai_api_key_here') {
  throw new Error('OPENAI_API_KEY is missing or placeholder value is found. Please set your Gemini key.');
}

// Instantiate official Gemini SDK
export const ai = new GoogleGenAI({
  apiKey,
});
