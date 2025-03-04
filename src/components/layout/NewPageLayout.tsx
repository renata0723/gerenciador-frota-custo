
import React, { useState } from 'react';
import Navbar from './Navbar';
import CollapsibleSidebar from './CollapsibleSidebar';

interface PageLayoutProps {
  children: React.ReactNode;
}

const NewPageLayout = ({ children }: PageLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onToggleSidebar={handleToggleSidebar} isSidebarOpen={sidebarOpen} />
      <CollapsibleSidebar>
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
          {children}
        </div>
      </CollapsibleSidebar>
    </div>
  );
};

export default NewPageLayout;
