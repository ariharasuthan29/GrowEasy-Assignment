# GrowEasy CRM AI-Powered CSV Importer https://groweasy-crm-ai-importer.vercel.app/

A production-ready full-stack web application that allows users to upload CSV files with arbitrary formats (Facebook exports, Google Ads sheets, manually created sheets), intelligently maps and extracts fields using Generative AI according to the GrowEasy CRM schema, and provides a real-time migration summary.

---

## Key Features
- 🚀 **Zero-Mapping Config**: Users do not need to select mapping fields manually. Our custom prompt engineering guides the LLM to intelligently map columns (e.g. mapping "Customer Name", "Full Name", or "Lead Name" -> `name`).
- ⚡ **Real-Time Streaming**: Employs a custom Event Stream decoder (`fetch` + `ReadableStream`) to push batch progress updates from the Express backend in real time.
- 🔄 **Robust Batch Processing & Retries**: Process lead lists in batches of 20. Failures in one batch do not block the migration of subsequent batches. Implements exponential backoff retry.
- 🛠️ **Semantic Rules Enforcer**:
  - Automatically isolates multiple email/phone numbers, parsing the primary one and appending the remaining contacts to the CRM note.
  - Skips rows lacking both emails and phone numbers.
  - Constrains options for `crm_status` and `data_source` using Zod validation.
- 🎨 **Space Dark Theme & Smooth CSS**: Designed with glassmorphism, responsive scrollable tables powered by `@tanstack/react-table`, custom scrollbars, and toast status updates.
- 🐳 **Docker-Ready**: Configured for instant deployment with `docker-compose`.

---

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Local Parsing**: PapaParse (local client previews)
- **Grid Layout**: TanStack React Table v8
- **Drag & Drop**: React Dropzone
- **HTTP Client**: Native Streams & Axios
- **Toasts**: React Hot Toast
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js & Express (TypeScript)
- **File Uploads**: Multer
- **CSV Parser**: csv-parser
- **AI Integrator**: OpenAI SDK (supports native OpenAI keys and Google Gemini API keys)
- **Validation**: Zod (schema verification)

---

## Folder Structure

```
GrowEasy-Assignment/
├── frontend/             # Next.js 15 Client
│   ├── app/              # Layout, Global CSS, Page Entry
│   ├── components/       # UploadArea, PreviewTable, ResultTable, ProgressBar, Spinner, Navbar
│   ├── hooks/            # useCSV, useImport Custom Hooks
│   ├── services/         # API HTTP Stream Client
│   ├── types/            # CSV and CRM Types
│   ├── utils/            # PapaParse browser util
│   └── package.json
│
├── backend/              # Express API Server
│   ├── src/
│   │   ├── config/       # OpenAI Client config
│   │   ├── controllers/  # Batch processing controller
│   │   ├── middleware/   # Multer storage, errorHandler
│   │   ├── routes/       # API import router
│   │   ├── services/     # AI service, CSV parser service, Prompt builders
│   │   ├── types/        # Zod validation and types
│   │   ├── utils/        # Batch splitter, retry backoff, Zod record schema
│   │   └── index.ts      # Server bootstrap
│   ├── uploads/          # Temporary Multer storage
│   └── package.json
│
├── docker-compose.yml    # Multi-container Compose Config
├── .gitignore            # Git exclusion manifest
└── README.md             # Master Documentation
```

---

## Environment Variables

### Backend (`backend/.env`)
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
FRONTEND_URL=http://localhost:3000
OPENAI_API_KEY=your_openai_or_gemini_api_key
```
*Note: The AI engine automatically detects if your `OPENAI_API_KEY` starts with `AIzaSy` (Google Gemini format). If detected, it automatically routes calls through Gemini's OpenAI compatibility endpoint using the `gemini-1.5-flash` model, meaning you can use either key seamlessly!*

### Frontend (`frontend/.env.local`)
Create a `.env.local` file in the `frontend/` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Getting Started

### Method 1: Docker (Recommended)
Launch the entire ecosystem with a single command:
```bash
docker-compose up --build
```
The Frontend client will run at `http://localhost:3000` and the Backend server at `http://localhost:5000`.

### Method 2: Manual Local Startup

#### 1. Start Backend API
```bash
cd backend
npm install
npm run dev
```

#### 2. Start Frontend App
```bash
cd ../frontend
npm install
npm run dev
```
Open `http://localhost:3000` to interact with the application.

---

## API Documentation

### POST `/api/import`
Accepts a CSV sheet, runs batch mapping, and returns migration report.

- **Request Body**: `multipart/form-data`
  - `file`: CSV file (required)
- **Query Parameter**:
  - `stream`: Set to `true` to stream progress updates via Server-Sent Events.

#### Sample SSE Progress Packet:
```json
data: {
  "type": "progress",
  "batchIndex": 2,
  "totalBatches": 5,
  "importedCount": 17,
  "skippedCount": 3,
  "currentProgress": 40
}
```

---

## Verification & Manual Testing
We support mapping several CSV variations:
1. **Facebook Leads Sheet**: Columns like `Full Name`, `email`, `Phone Number` are mapped automatically.
2. **Google Ads Sheet**: Columns like `User Name`, `mail_address`, `contact_no` are handled.
3. **Invalid Lead Sheets**: A sheet missing both email and phone numbers will gracefully skip rows, listing the validation failure details inside the final results panel.

---

## License
Distributed under the MIT License.
