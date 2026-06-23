import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

export const metadata = {
  title: 'StartupForge – Build Your Dream Startup Team',
  description: 'StartupForge is the ultimate platform for startup founders to recruit top talent and for professionals to find exciting startup opportunities.',
  keywords: 'startup, team building, founders, developers, designers, collaboration',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
