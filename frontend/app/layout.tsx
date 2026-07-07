import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '../components/Navbar';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'GrowEasy CRM | AI-Powered CSV Importer',
  description: 'Intelligently map arbitrary CSV sheets to the GrowEasy CRM schema using AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${inter.variable} antialiased bg-slate-950 min-h-screen flex flex-col`}>
        {/* Navbar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1">
          {children}
        </main>

        {/* Global Toast Controller */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0f172a', // slate-900
              color: '#e2e8f0',      // slate-200
              border: '1px solid #1e293b' // slate-800
            },
            success: {
              iconTheme: {
                primary: '#10b981', // emerald-500
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#f43f5e', // rose-500
                secondary: '#ffffff',
              },
            },
          }}
        />

        {/* Footer */}
        <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            &copy; {new Date().getFullYear()} GrowEasy CRM. All rights reserved. Powered by Advanced AI Data Mapping.
          </div>
        </footer>
      </body>
    </html>
  );
}
