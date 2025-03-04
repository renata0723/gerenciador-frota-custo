
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContratoNaoSalvoProps {
  onVoltar: () => void;
}

const ContratoNaoSalvo: React.FC<ContratoNaoSalvoProps> = ({ onVoltar }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
      <h3 className="text-lg font-medium mb-2">Contrato ainda não salvo</h3>
      <p className="text-muted-foreground text-center mb-4">É necessário salvar o contrato antes de poder realizar esta ação.</p>
      <Button variant="outline" onClick={onVoltar}>
        Voltar para dados do contrato
      </Button>
    </div>
  );
};

export default ContratoNaoSalvo;
