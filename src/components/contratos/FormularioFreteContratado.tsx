
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dadosValidos) {
      return;
    }

    onSave({
      ...contrato,
      valor_frete_contratado: valorFreteContratado,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-8">
            <Alert>
              <InfoCircle className="h-4 w-4" />
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
              <Button type="submit" disabled={!dadosValidos}>
                Salvar e Continuar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default FormularioFreteContratado;
