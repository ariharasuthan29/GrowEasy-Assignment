import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'GrowEasy CRM Dashboard | Lead CSV Manager',
  description: 'AI-Powered CRM Import Mapping Platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${inter.variable} antialiased bg-[#F8F9FB] text-slate-800 min-h-screen flex flex-col`}>
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {children}
        </div>

        {/* Global Toast Controller */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#1e293b',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)'
            },
            success: {
              iconTheme: {
                primary: '#22C55E', // GrowEasy Green
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444', // Red
                secondary: '#ffffff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
