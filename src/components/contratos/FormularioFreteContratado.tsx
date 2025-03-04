
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import FreteContratadoForm from './FreteContratadoForm';

interface FormularioFreteContratadoProps {
  contrato: any;
  onSave: (data: any) => void;
  onBack: () => void;
}

const FormularioFreteContratado: React.FC<FormularioFreteContratadoProps> = ({ contrato, onSave, onBack }) => {
  const [valorFreteContratado, setValorFreteContratado] = useState(contrato?.valor_frete_contratado || 0);
  const [dadosValidos, setDadosValidos] = useState(false);

  useEffect(() => {
    // Verificar se os dados são válidos
    setDadosValidos(!!valorFreteContratado);
  }, [valorFreteContratado]);

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
            contrato={contrato} 
            onSave={onSave}
          />
          
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack}>
              Voltar
            </Button>
            <Button 
              type="button" 
              onClick={() => onSave({...contrato, valor_frete_contratado: valorFreteContratado})}
              disabled={!dadosValidos}
            >
              Salvar e Continuar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormularioFreteContratado;
