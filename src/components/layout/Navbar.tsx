
import React from 'react';
import { Bell, Menu } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  showProjectionButton?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen, showProjectionButton }) => {
  return (
    <div className="bg-white border-b h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="text-gray-500 focus:outline-none focus:text-gray-700 dark:text-gray-400 dark:focus:text-gray-300 mr-3"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <img 
          src="/lovable-uploads/89eb445f-8719-46a7-b90b-9e5a76639ded.png" 
          alt="SSLOG Logo" 
          className="h-8 hidden md:block" 
        />
      </div>

      <div className="flex items-center space-x-4">
        {showProjectionButton && (
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Ver Projeção
          </button>
        )}
        
        <button className="relative text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          <Bell className="h-6 w-6" />
          <Badge
            className="absolute top-0 right-0 rounded-full h-4 w-4 p-0 flex items-center justify-center text-xs bg-red-500 text-white transform translate-x-1/2 -translate-y-1/2"
          >
            3
          </Badge>
        </button>

        <Avatar>
          <AvatarFallback>CF</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default Navbar;
