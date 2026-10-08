import type { Metadata } from 'next';
import './globals.css';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';

export const metadata: Metadata = {
  title: 'TESSERA — The Strategy Layer for Meteora DBC',
  description:
    'Launch configs as tradable, performance-ranked financial products. A strategy marketplace and intelligence layer for Meteora Dynamic Bonding Curve.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#08090c] text-[#f1f3f9]">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
