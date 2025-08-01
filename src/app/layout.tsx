'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from "@/components/ui/sonner"
import Navbar from '@/components/Navbar';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Navbar />
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}