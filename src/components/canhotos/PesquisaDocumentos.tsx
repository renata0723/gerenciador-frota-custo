import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Search, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export interface CanhotoPendente {
  id?: number;
  contrato_id: string;
  numero_cte: string;
  numero_manifesto: string;
  numero_nota_fiscal: string;
  cliente: string;
  motorista: string;
  proprietario_veiculo: string;
  data_entrega_cliente: string;
  data_recebimento_canhoto: string | null;
  status: string;
  responsavel_recebimento?: string;
  data_programada_pagamento?: string;
  saldo_a_pagar?: number;
}

export interface PesquisaDocumentosProps {
  onResultadoEncontrado: (resultado: CanhotoPendente) => void;
}

const PesquisaDocumentos: React.FC<PesquisaDocumentosProps> = ({ onResultadoEncontrado }) => {
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [encontrado, setEncontrado] = useState<CanhotoPendente | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const handlePesquisar = () => {
    // Simulação de busca no "banco de dados" (localStorage)
    const resultados = localStorage.getItem('canhotos');
    
    if (resultados) {
      const canhotos: CanhotoPendente[] = JSON.parse(resultados);
      const resultado = canhotos.find(
        (c) =>
          c.contrato_id === termoPesquisa ||
          c.numero_cte === termoPesquisa ||
          c.numero_manifesto === termoPesquisa ||
          c.numero_nota_fiscal === termoPesquisa
      );

      if (resultado) {
        setEncontrado(resultado);
        setErro(null);
        onResultadoEncontrado(resultado);
        toast.success(`Canhoto encontrado: ${resultado.cliente}`);
      } else {
        setEncontrado(null);
        setErro('Nenhum canhoto encontrado com este documento.');
        onResultadoEncontrado({} as CanhotoPendente);
        toast.error('Nenhum canhoto encontrado com este documento.');
      }
    } else {
      setEncontrado(null);
      setErro('Nenhum canhoto cadastrado.');
      onResultadoEncontrado({} as CanhotoPendente);
      toast.error('Nenhum canhoto cadastrado.');
    }
  };

  return (
    <Card className="w-full">
      <div className="p-4 space-y-4">
        <h3 className="text-lg font-semibold">Pesquisar Documento</h3>
        <div className="space-y-2">
          <Label htmlFor="pesquisa">
            Número do Contrato, CTE, Manifesto ou Nota Fiscal
          </Label>
          <div className="flex space-x-2">
            <Input
              id="pesquisa"
              placeholder="Digite o número do documento"
              value={termoPesquisa}
              onChange={(e) => setTermoPesquisa(e.target.value)}
            />
            <Button onClick={handlePesquisar}>
              <Search className="mr-2 h-4 w-4" />
              Pesquisar
            </Button>
          </div>
        </div>
        {erro && (
          <div className="flex items-center space-x-2 text-red-500">
            <AlertTriangle className="h-4 w-4" />
            <span>{erro}</span>
          </div>
        )}
        {encontrado && (
          <div className="border rounded-md p-4">
            <h4 className="text-md font-semibold">
              Resultado da Pesquisa:
            </h4>
            <p>Cliente: {encontrado.cliente}</p>
            <p>Nota Fiscal: {encontrado.numero_nota_fiscal}</p>
            <p>Status: {encontrado.status}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PesquisaDocumentos;
