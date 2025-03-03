
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface PageHeaderProps {
  title: string;
  description?: string;
  backButton?: boolean;
  backLink?: string;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  backButton = false,
  backLink,
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
        
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      
      {children && <div className="flex items-center justify-between">{children}</div>}
    </div>
  );
};

export default PageHeader;
