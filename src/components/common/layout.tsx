import React from 'react';
import { useGlobalCtx } from '@/contexts/global_context';
import Sidebar from '@/components/common/sidebar';

interface ILayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<ILayoutProps> = ({ children, className = '' }) => {
  const { isSidebarOpen } = useGlobalCtx();

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-surface-neutral-background">
      <Sidebar />
      <div
        className={`${isSidebarOpen ? 'ml-220px' : 'ml-50px'} ${className} transition-all duration-300 ease-in-out`}
      >
        {children}
      </div>
    </main>
  );
};

export default Layout;
