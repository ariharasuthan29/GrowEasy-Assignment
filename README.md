# GrowEasy CRM AI-Powered CSV Importer https://groweasy-crm-ai-importer.vercel.app/

A production-ready monorepo full-stack web application that allows users to upload CSV files with arbitrary formats, intelligently maps and extracts fields using Generative AI according to the GrowEasy CRM schema, and provides a real-time migration summary.

---

## 🌐 Deployed Endpoints

- **Backend (Render)**: `https://groweasy-assignment-liie.onrender.com`
- **Frontend (Vercel)**: Configured and ready to deploy the `frontend` folder directly to Vercel.

---

## Key Features
- 🚀 **Zero-Mapping Config**: Users do not need to select mapping fields manually. Custom prompt engineering guides the LLM to intelligently map columns (e.g. mapping "Customer Name", "Full Name", or "Lead Name" -> `name`).
- ⚡ **Real-Time Streaming**: Employs a custom Event Stream decoder (`fetch` + `ReadableStream`) to push batch progress updates from the Express backend in real time.
- 🔄 **Robust Batch Processing & Retries**: Process lead lists in batches dynamically (up to 200 records per batch) to bypass Gemini's 20 RPD free quota. Implements exponential backoff retry.
- 🛠 &nbsp;**Semantic Rules Enforcer**:
  - Automatically isolates multiple email/phone numbers, parsing the primary one and appending the remaining contacts to the CRM note.
  - Skips rows lacking both emails and phone numbers.
  - Constrains options for `crm_status` and `data_source` using Zod validation.
- 🎨 &nbsp;**GrowEasy Light Theme**: Premium CRM layout with collapsible sidebar, top navigation, drag-and-drop CSV modal popup, and paginated lead lists.

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
│   │   ├── config/       # Gemini Client config
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
Already deployed on Render.
```env
PORT=5000
FRONTEND_URL=https://your-vercel-domain.vercel.app
OPENAI_API_KEY=your_gemini_api_key_here
```

### Frontend (`frontend/.env.local` / Vercel Environment Variables)
For local development, copy `frontend/.env.example` into a new `.env.local` file:
```env
NEXT_PUBLIC_API_URL=https://groweasy-assignment-liie.onrender.com
```

---

## 🚀 Production Deployment Instructions

### Backend (Already Deployed)
The backend is already running on **Render**: `https://groweasy-assignment-liie.onrender.com`. No changes or redeployments are required for the backend.

### Frontend (Deploying to Vercel)
Deploy **ONLY** the `frontend` folder to Vercel. Follow these steps:

1. Import the repository in Vercel.
2. In the Vercel project configuration page, go to **Settings > General**.
3. Under the **Root Directory** field, set it to **`frontend`** (or browse and select the `frontend` directory).
4. Go to **Environment Variables** and add:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://groweasy-assignment-liie.onrender.com`
5. Click **Save** and **Deploy**.

Vercel will build the Next.js frontend application inside the `frontend/` directory and successfully link it to your deployed Render API.

---

## API Documentation

### POST `/api/import`
Accepts a CSV sheet, runs batch mapping, and returns migration report.

- **Request Body**: `multipart/form-data`
  - `file`: CSV file (required)
- **Query Parameter**:
  - `stream`: Set to `true` to stream progress updates via Server-Sent Events.

---

## Verification & Manual Testing
We support mapping several CSV variations:
1. **Facebook Leads Sheet**: Columns like `Full Name`, `email`, `Phone Number` are mapped automatically.
2. **Google Ads Sheet**: Columns like `User Name`, `mail_address`, `contact_no` are handled.
3. **Invalid Lead Sheets**: A sheet missing both email and phone numbers will gracefully skip rows, listing the validation failure details inside the final results panel.

---

## License
Distributed under the MIT License.
