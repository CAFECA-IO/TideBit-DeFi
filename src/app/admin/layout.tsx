import React from 'react';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';
import AdminSidebar from '@/components/admin/sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 font-sans">
      <Header />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="w-full flex-1 overflow-x-hidden p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
      <Footer />
    </div>

  );
}

