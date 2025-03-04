
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export interface VeiculosErrorProps {
  message: string;
  onRetry: () => Promise<void>;
}

const VeiculosError: React.FC<VeiculosErrorProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-red-50">
      <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-medium text-red-800 mb-2">Erro ao carregar dados</h3>
      <p className="text-red-600 mb-4 text-center">{message}</p>
      <Button onClick={onRetry} variant="secondary">Tentar novamente</Button>
    </div>
  );
};

export default VeiculosError;
