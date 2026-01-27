import React from 'react';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 font-sans">
      <Header />
      <main className="w-full flex-1 p-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
      <Footer />
    </div>
  );
}

