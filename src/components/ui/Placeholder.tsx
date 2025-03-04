
import React from 'react';
import { FileText, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './button';

interface PlaceholderProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}

const Placeholder: React.FC<PlaceholderProps> = ({
  title,
  description,
  icon = <FileText size={48} className="text-gray-300" />,
  buttonText,
  onButtonClick,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 rounded-lg border border-dashed border-gray-300 bg-gray-50 text-center ${className}`}>
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-4 max-w-md">{description}</p>
      {buttonText && onButtonClick && (
        <Button onClick={onButtonClick} className="mt-2">
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export const ErrorPlaceholder: React.FC<{
  message: string;
  retryAction?: () => void;
  className?: string;
}> = ({ message, retryAction, className = '' }) => {
  return (
    <Placeholder
      title="Ocorreu um erro"
      description={message}
      icon={<AlertTriangle size={48} className="text-red-500" />}
      buttonText={retryAction ? "Tentar novamente" : undefined}
      onButtonClick={retryAction}
      className={className}
    />
  );
};

export const LoadingPlaceholder: React.FC<{
  message?: string;
  className?: string;
}> = ({ message = "Carregando dados...", className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 rounded-lg bg-gray-50 text-center ${className}`}>
      <RefreshCw size={36} className="text-blue-500 animate-spin mb-4" />
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  );
};

export default Placeholder;
