
import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface PageLayoutProps {
  children: React.ReactNode;
  showProjectionButton?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, showProjectionButton }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} showProjectionButton={showProjectionButton} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
