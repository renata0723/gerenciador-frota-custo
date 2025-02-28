
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} />
        
        <main 
          className={cn(
            "flex-1 overflow-auto transition-all duration-300 transform",
            sidebarOpen ? 'lg:ml-64' : 'ml-0'
          )}
        >
          <div className="container mx-auto px-4 py-6 max-w-7xl transition-all">
            <div className="page-transition">
              {children}
            </div>
          </div>
        </main>
      </div>
      
      {/* Overlay para fechamento do menu em dispositivos móveis */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 z-10 bg-black/50 lg:hidden animate-fade-in"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default PageLayout;
