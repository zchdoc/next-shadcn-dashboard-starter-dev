import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

// Using a subset of Google fonts to minimize network requests
const fontInter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

// Define CSS variables for other fonts
const fontSans = { variable: '--font-sans' };
const fontMono = { variable: '--font-mono' };

// Export font variables for use in layout
export const fontVariables = cn(fontInter.variable, 'font-sans');
