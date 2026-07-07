# GrowEasy CRM CSV Importer Frontend

This is the Next.js 15 & TypeScript frontend client for the AI-Powered CSV Importer. It allows users to upload custom CSV sheets, parses and previews them locally using `PapaParse` and `@tanstack/react-table`, handles Confirm imports, and streams real-time migration progress (via custom Event Stream reader) showing the successfully mapped and skipped results.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Local Parsing**: `PapaParse`
- **UI Tables**: `@tanstack/react-table` (TanStack Table v8)
- **Drag & Drop**: `react-dropzone`
- **Icons**: `lucide-react`
- **Notifications**: `react-hot-toast`

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
Create a `.env.local` file in the `frontend/` root directory (template `.env.local` is already provided):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
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
