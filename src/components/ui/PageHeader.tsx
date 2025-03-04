
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface PageHeaderProps {
  title: string;
  description?: string;
  backButton?: boolean;
  backLink?: string;
  icon?: React.ReactNode;
  breadcrumbs?: Array<{label: string; href?: string}>;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  backButton = false,
  backLink,
  icon,
  breadcrumbs,
  actions,
  children
}) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (backLink) {
      navigate(backLink);
    } else {
      navigate(-1);
    }
  };
  
  return (
    <div className="flex flex-col space-y-2 mb-6">
      {breadcrumbs && (
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="mx-1">/</span>}
              {item.href ? (
                <button onClick={() => navigate(item.href)} className="hover:text-blue-500">
                  {item.label}
                </button>
              ) : (
                <span>{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
      
      <div className="flex items-center space-x-4">
        {backButton && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 p-0 mr-2 hover:bg-transparent"
            onClick={handleBack}
          >
            <ChevronLeft className="h-5 w-5" />
            Voltar
          </Button>
        )}
        
        <div className="flex items-center gap-2">
          {icon && <div className="text-blue-500">{icon}</div>}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
      </div>
      
      {actions && <div className="flex items-center justify-end mt-2">{actions}</div>}
      
      {children && <div className="flex items-center justify-between">{children}</div>}
    </div>
  );
};

export default PageHeader;
