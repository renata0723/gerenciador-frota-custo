
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

const PageHeader = ({ title, description, icon, breadcrumbs, actions }: PageHeaderProps) => {
  return (
    <div className="mb-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <ChevronRight className="mx-2" size={14} />}
              {item.href ? (
                <Link 
                  to={item.href} 
                  className="hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span>{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 mb-2">
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
      
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export default PageHeader;
