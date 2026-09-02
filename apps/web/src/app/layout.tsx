import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { getDictionary } from '@/features/i18n/dictionaries';
import { I18nProvider } from '@/features/i18n/i18n-provider';
import { getRequestLocale } from '@/features/i18n/server';
import { ThemeProvider } from '@/features/theme/theme-provider';
import { ThemeScript } from '@/features/theme/theme-script';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'BuscoHuella',
  description:
    'Plataforma colaborativa para ayudar a encontrar mascotas perdidas y comunicar avistamientos.',
  icons: {
    icon: '/brand/logo.png',
    apple: '/brand/logo.png',
  },
};

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    {
      media: '(prefers-color-scheme: light)',
      color: '#ffffff',
    },
    {
      media: '(prefers-color-scheme: dark)',
      color: '#111513',
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      data-theme="light"
      data-theme-preference="light"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-full flex-col">
        <I18nProvider
          locale={locale}
          dictionary={dictionary}
        >
          <ThemeProvider>{children}</ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
