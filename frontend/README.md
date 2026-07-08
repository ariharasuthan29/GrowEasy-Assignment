# GrowEasy CRM CSV Importer Frontend

This is the Next.js 15 & TypeScript frontend client for the AI-Powered CSV Importer. It allows users to upload custom CSV sheets, parses and previews them locally, and streams real-time migration progress mapping them to the GrowEasy CRM schema.

---

## 🌐 Connected Endpoints

- **Backend API (Render)**: `https://groweasy-assignment-liie.onrender.com`
- **Frontend Client (Vercel)**: Fully prepared for deployment.

---

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Local Parsing**: `PapaParse`
- **UI Tables**: `@tanstack/react-table` (TanStack Table v8)
- **Drag & Drop**: `react-dropzone`
- **Icons**: `lucide-react`
- **Notifications**: `react-hot-toast`

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration
For local development, copy `.env.example` into a new `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```
For production, set the `NEXT_PUBLIC_API_URL` environment variable inside your Vercel Dashboard to:
```env
NEXT_PUBLIC_API_URL=https://groweasy-assignment-liie.onrender.com
```

### Scripts
- **Development Mode**: Starts the local dev server at `http://localhost:3000`.
  ```bash
  npm run dev
  ```
- **Production Build**: Compiles and optimizes Next.js client.
  ```bash
  npm run build
  ```
- **Start Production Server**: Runs the compiled bundle.
  ```bash
  npm start
  ```
- **Lint**: Runs ESLint checks.
  ```bash
  npm run lint
  ```

---

## 🚀 Vercel Production Deployment Instructions

Deploy **ONLY** the `frontend` folder to Vercel:

1. Import your project repository into Vercel.
2. Under **Project Settings > General**, set the **Root Directory** field to **`frontend`** (or browse and select the `frontend` directory).
3. Under **Environment Variables**, add:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://groweasy-assignment-liie.onrender.com`
4. Click **Deploy**.

Vercel will successfully compile the frontend Next.js monorepo and link it directly to your Render API server.
