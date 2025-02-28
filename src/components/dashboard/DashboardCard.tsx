
import React from 'react';
import { cn } from '@/lib/utils';
import { logOperation } from '@/utils/logOperations';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  children,
  className,
  action,
}) => {
  const handleCardClick = () => {
    logOperation('Card Interaction', `Interação com card: ${title}`, false);
  };

  return (
    <div 
      className={cn(
        "bg-white dark:bg-sistema-dark rounded-xl shadow-card border border-gray-100 dark:border-gray-800 overflow-hidden card-transition",
        className
      )}
      onClick={handleCardClick}
    >
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h3>
        {action && (
          <div className="ml-4">
            {action}
          </div>
        )}
      </div>
      
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;
