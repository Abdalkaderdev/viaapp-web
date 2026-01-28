import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: 'ViaApp - Grow in Faith Together',
  description: 'A discipleship app designed to help you grow in your faith through daily quiet time, Bible study, prayer, and community.',
  keywords: 'discipleship, faith, Bible study, prayer, Christian, spiritual growth',
  openGraph: {
    title: 'ViaApp - Grow in Faith Together',
    description: 'Transform your spiritual journey with daily quiet time, Bible study, and prayer tracking.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* Skip to main content link for keyboard/screen reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
