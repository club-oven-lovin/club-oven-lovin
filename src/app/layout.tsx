import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Toaster Oven Lovin\' - Cook Smart, Eat Well, Save Money',
  description: 'Discover delicious recipes designed for college students with limited kitchens, tight budgets, and busy schedules.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} h-100 d-flex flex-column min-vh-100`}>
        <Providers>
          <Navbar />
          <main className="flex-grow-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
