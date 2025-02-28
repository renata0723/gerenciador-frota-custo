
import React from 'react';
import { cn } from '@/lib/utils';
import { logOperation } from '@/utils/logOperations';

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  subtitle,
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
        "bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden card-transition",
        className
      )}
      onClick={handleCardClick}
    >
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <div>
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
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
