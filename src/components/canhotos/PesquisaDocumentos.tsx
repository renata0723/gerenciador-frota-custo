
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CanhotoPendente } from '@/types/canhoto';

interface PesquisaDocumentosProps {
  onResultadoEncontrado: (canhoto: CanhotoPendente) => void;
}

const PesquisaDocumentos: React.FC<PesquisaDocumentosProps> = ({ 
  onResultadoEncontrado 
}) => {
  const [numeroContrato, setNumeroContrato] = useState('');
  const [numeroCte, setNumeroCte] = useState('');
  const [numeroManifesto, setNumeroManifesto] = useState('');
  const [numeroNotaFiscal, setNumeroNotaFiscal] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!numeroContrato && !numeroCte && !numeroManifesto && !numeroNotaFiscal) {
      toast.error('Informe pelo menos um critério de busca');
      return;
    }
    
    setCarregando(true);
    
    try {
      let query = supabase.from('Contratos').select('*');
      
      if (numeroContrato) {
        query = query.eq('id', numeroContrato);
      }
      
      if (numeroManifesto) {
        query = query.eq('numero_manifesto', numeroManifesto);
      }
      
      if (numeroCte) {
        query = query.eq('numero_cte', numeroCte);
      }
      
      if (numeroNotaFiscal) {
        query = query.eq('numero_nota_fiscal', numeroNotaFiscal);
      }
      
      const { data, error } = await query.limit(1);
      
      if (error) {
        console.error('Erro ao buscar documentos:', error);
        toast.error('Erro ao buscar documentos');
        return;
      }
      
      if (!data || data.length === 0) {
        toast.error('Nenhum documento encontrado com os critérios informados');
        return;
      }
      
      const contrato = data[0];
      
      // Buscar informações adicionais se necessário
      const canhotoPendente: CanhotoPendente = {
        contrato_id: contrato.id,
        cliente: contrato.cliente_destino || 'Cliente não informado',
        motorista: contrato.motorista || 'Motorista não informado',
        data_entrega: contrato.data_entrega
      };
      
      onResultadoEncontrado(canhotoPendente);
      toast.success('Documento encontrado!');
      
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Ocorreu um erro ao processar a solicitação');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <form onSubmit={handleBuscar} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="numeroContrato">Número do Contrato</Label>
          <Input
            id="numeroContrato"
            placeholder="Digite o número do contrato"
            value={numeroContrato}
            onChange={(e) => setNumeroContrato(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="numeroManifesto">Número do Manifesto</Label>
          <Input
            id="numeroManifesto"
            placeholder="Digite o número do manifesto"
            value={numeroManifesto}
            onChange={(e) => setNumeroManifesto(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="numeroCte">Número do CT-e</Label>
          <Input
            id="numeroCte"
            placeholder="Digite o número do CT-e"
            value={numeroCte}
            onChange={(e) => setNumeroCte(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="numeroNotaFiscal">Número da Nota Fiscal</Label>
          <Input
            id="numeroNotaFiscal"
            placeholder="Digite o número da nota fiscal"
            value={numeroNotaFiscal}
            onChange={(e) => setNumeroNotaFiscal(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          className="flex gap-2 items-center" 
          disabled={carregando}
        >
          <Search size={16} />
          {carregando ? 'Buscando...' : 'Buscar Documento'}
        </Button>
      </div>
    </form>
  );
};

export default PesquisaDocumentos;
