import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { QueryProvider } from '@/providers/query-provider';
import ThemeProvider from '@/providers/theme-provider';
import { TooltipProvider } from '@repo/ui/components/ui/tooltip';
import { Toaster } from '@repo/ui/components/ui/sonner';
import { cn } from '@/lib/utils';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

// 定义 metadata
export const metadata: Metadata = {
  title: 'Openomy - Open-Source Economy Driven by Community',
  description:
    'Redefining GitHub projects with blockchain and AI. Openomy recognizes the value of code collaboration, where contributors build, offer feedback, refine features, and engage with the community.',
  keywords: [
    'open-source economy',
    'blockchain',
    'AI',
    'GitHub projects',
    'code collaboration',
    'developer community',
    'open-source value',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('antialiased', geist.className)}>
        <ThemeProvider>
          <TooltipProvider delayDuration={100} skipDelayDuration={200}>
            <QueryProvider>{children}</QueryProvider>
          </TooltipProvider>
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
