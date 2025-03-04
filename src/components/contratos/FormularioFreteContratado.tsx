
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import FreteContratadoForm from './FreteContratadoForm';
import { FormularioFreteContratadoProps } from '@/types/contrato';

const FormularioFreteContratado: React.FC<FormularioFreteContratadoProps> = ({ 
  contrato, 
  onSave, 
  onBack, 
  onNext,
  initialData,
  dadosContrato,
  readOnly = false
}) => {
  const handleSave = (data: any) => {
    onSave(data);
    if (onNext) onNext();
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-8">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Informe os valores do frete contratado para este contrato.
            </AlertDescription>
          </Alert>

          <FreteContratadoForm 
            contrato={contrato || dadosContrato} 
            onSave={handleSave}
            initialData={initialData}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FormularioFreteContratado;
