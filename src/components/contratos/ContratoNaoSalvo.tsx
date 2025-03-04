
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ContratoNaoSalvoProps {
  onVoltar: () => void;
}

const ContratoNaoSalvo: React.FC<ContratoNaoSalvoProps> = ({ onVoltar }) => {
  return (
    <Card>
      <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center min-h-[300px]">
        <AlertTriangle className="h-16 w-16 text-amber-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2 text-center">Contrato Não Salvo</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          Você precisa salvar os dados básicos do contrato antes de acessar esta funcionalidade.
        </p>
        <Button onClick={onVoltar} variant="default">
          Voltar para o Início
        </Button>
      </CardContent>
    </Card>
  );
};

export default ContratoNaoSalvo;
