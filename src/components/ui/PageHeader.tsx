
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  actions,
}) => {
  return (
    <div className="mb-8 animate-slide-down">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              
              return (
                <li key={index} className="inline-flex items-center">
                  {index > 0 && (
                    <ChevronRight size={16} className="mx-1 text-gray-400" />
                  )}
                  
                  {isLast || !item.href ? (
                    <span className={`inline-flex items-center text-sm ${isLast ? 'font-medium text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                      {item.label}
                    </span>
                  ) : (
                    <Link 
                      to={item.href} 
                      className="inline-flex items-center text-sm font-medium text-sistema-primary hover:text-sistema-primary-dark dark:text-sistema-primary dark:hover:text-sistema-primary-dark transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
              {description}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="mt-4 sm:mt-0 flex space-x-3 items-center">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
