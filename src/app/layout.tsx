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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
