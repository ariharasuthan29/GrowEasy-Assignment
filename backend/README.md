# GrowEasy CRM CSV Importer Backend

This is the Express & TypeScript backend service for the AI-Powered CSV Importer. It parses arbitrary CSV files, processes records in batches of 20, maps fields to the GrowEasy CRM schema using AI (OpenAI or Gemini compatibility API), validates results using Zod, and returns progress streams or final import summaries.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express (with TypeScript)
- **CSV Parser**: `csv-parser`
- **File Upload**: Multer
- **AI Integration**: OpenAI SDK (supporting both OpenAI and Gemini keys via auto-detect)
- **Validation**: Zod

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration
Create a `.env` file in the `backend/` root directory (a template `.env` is already provided):
```env
PORT=5000
FRONTEND_URL=http://localhost:3000
OPENAI_API_KEY=your-actual-api-key
```

*Note: The backend automatically detects Google Gemini API keys (starting with `AIzaSy`). If a Gemini key is passed, the backend automatically targets Gemini's OpenAI-compatible base URL and runs using the `gemini-1.5-flash` model.*

### Scripts
- **Development Mode**: Runs the server with auto-reloads.
  ```bash
  npm run dev
  ```
- **Production Build**: Compiles TypeScript files into `dist/`.
  ```bash
  npm run build
  ```
- **Start Production Server**: Runs compiled JavaScript files.
  ```bash
  npm start
  ```

## API Documentation

### POST `/api/import`
Uploads and processes a CSV file to map to the CRM schema.

- **Headers**:
  - `Content-Type: multipart/form-data`
  - `Accept: text/event-stream` (optional, for streaming progress)
- **Body Parameters**:
  - `file`: The `.csv` file.
- **Query Parameters**:
  - `stream=true` (optional, alternative to Accept header to stream progress)

- **Response Forms**:
  - **Standard JSON Response (no stream)**:
    ```json
    {
      "success": true,
      "data": {
        "totalImported": 18,
        "totalSkipped": 2,
        "importedRecords": [...],
        "skippedRecords": [...]
      }
    }
    ```
  - **Stream Response (Server-Sent Events)**:
    Streams chunks of JSON separated by newlines, culminating in a `done` event.
