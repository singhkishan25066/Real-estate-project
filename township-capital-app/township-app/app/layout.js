// app/layout.js
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', weight: ['400', '500', '600'] });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', weight: ['400', '500', '600', '700'] });

export const metadata = {
  title: 'Township Capital — Rajgir & Bihta, Bihar',
  description: 'Verified plots from DNS Homes in Rajgir and Bihta, with real pricing, projected value, and a client dashboard.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="bg-cream text-[#1c1c22] font-sans">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
