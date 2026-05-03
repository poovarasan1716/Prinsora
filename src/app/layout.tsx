import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Fraunces, DM_Sans } from 'next/font/google';
import '../styles/tailwind.css';
import { CartProvider } from '@/context/CartContext';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '900'],
  variable: '--font-fraunces',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Prinsora — Grace in Every Thread',
  description: 'Prinsora is a premium women\'s clothing brand offering curated ethnic and western wear — dresses, sarees, kurtis, and more delivered across India.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className={dmSans.className} suppressHydrationWarning>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}