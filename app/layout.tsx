import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';
import { validateServerEnv } from '@/lib/env';

const inter = Inter({ subsets: ['latin'] });

// Validate environment variables at build time
validateServerEnv();

export const metadata: Metadata = {
  title: 'Expense Tracker',
  description: 'Track and manage your personal expenses',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="container mx-auto px-4 py-8">{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}