
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Truck, User } from 'lucide-react';

interface FreteInfoAlertProps {
  placaCavalo?: string;
  motorista?: string;
}

const FreteInfoAlert: React.FC<FreteInfoAlertProps> = ({ placaCavalo, motorista }) => {
  return (
    <Alert className="bg-blue-50 border-blue-200">
      <AlertDescription className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <Truck className="h-4 w-4 text-blue-600" />
          <span className="font-medium">Placa:</span>
          <span>{placaCavalo || 'Não informada'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-blue-600" />
          <span className="font-medium">Motorista:</span>
          <span>{motorista || 'Não informado'}</span>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default FreteInfoAlert;
