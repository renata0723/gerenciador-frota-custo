
import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  subtitle?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  subtitle,
  className,
}) => {
  return (
    <div className={cn(
      "bg-white dark:bg-sistema-dark rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100 dark:border-gray-800 card-transition",
      className
    )}>
      <div className="flex items-center">
        <div className="rounded-lg p-3 bg-sistema-primary/10 dark:bg-sistema-primary/20">
          {icon}
        </div>
        
        <div className="ml-auto text-right">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
      </div>
      
      {(change || subtitle) && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          {change && (
            <div className="flex items-center">
              <div className={cn(
                "flex items-center text-sm font-medium",
                change.type === 'increase' && "text-green-600 dark:text-green-400",
                change.type === 'decrease' && "text-red-600 dark:text-red-400",
                change.type === 'neutral' && "text-gray-600 dark:text-gray-400"
              )}>
                {change.type === 'increase' && <ArrowUpIcon size={16} className="mr-1" />}
                {change.type === 'decrease' && <ArrowDownIcon size={16} className="mr-1" />}
                <span>{change.value}%</span>
              </div>
              
              {subtitle && (
                <p className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          
          {!change && subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
