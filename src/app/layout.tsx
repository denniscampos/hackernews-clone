import { Navbar } from '@/components/navbar';
import './globals.css';
import { Inter } from 'next/font/google';
import { navItems } from '@/config/nav-items';
import { getCurrentUser } from '@/lib/session';
import Providers from '@/components/Providers';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Hacker News',
  description: 'Hacker News clone built with Next.js',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  return (
    <html lang="en">
      <body className={`max-w-6xl mx-auto my-0 ${inter.className}`}>
        <Navbar items={navItems} user={user} />
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
