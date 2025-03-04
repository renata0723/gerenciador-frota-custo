
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FreteInfoAlertProps {
  isTipoFrota: boolean;
}

const FreteInfoAlert: React.FC<FreteInfoAlertProps> = ({ isTipoFrota }) => {
  if (!isTipoFrota) return null;
  
  return (
    <Alert className="bg-blue-50 border-blue-200">
      <AlertDescription>
        Este contrato é do tipo <strong>Frota</strong>, portanto não há valores de frete contratado.
      </AlertDescription>
    </Alert>
  );
};

export default FreteInfoAlert;
