
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Truck } from 'lucide-react';
import FreteContratadoForm from './FreteContratadoForm';

export interface FormularioFreteContratadoProps {
  onSave: (data: any) => void;
  onBack: () => void;
  onNext?: () => void;
  initialData?: any;
  dadosContrato?: any;
  contrato?: any;
}

const FormularioFreteContratado: React.FC<FormularioFreteContratadoProps> = ({ 
  contrato, 
  onSave, 
  onBack, 
  onNext,
  initialData,
  dadosContrato 
}) => {
  const [valorFreteContratado, setValorFreteContratado] = useState(contrato?.valorFreteContratado || 0);
  const [dadosValidos, setDadosValidos] = useState(false);

  useEffect(() => {
    // Verificar se os dados são válidos
    setDadosValidos(!!valorFreteContratado);
  }, [valorFreteContratado]);

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
