
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { CanhotoPendente } from "@/types/canhoto";

export interface PesquisaDocumentosProps {
  onResultadoEncontrado: (resultado: CanhotoPendente) => void;
}

const PesquisaDocumentos: React.FC<PesquisaDocumentosProps> = ({ onResultadoEncontrado }) => {
  const [numeroContrato, setNumeroContrato] = useState("");
  const [numeroManifesto, setNumeroManifesto] = useState("");
  const [numeroCTe, setNumeroCTe] = useState("");
  const [numeroNotaFiscal, setNumeroNotaFiscal] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleSearch = async () => {
    setLoading(true);
    
    // Verificar se pelo menos um campo foi preenchido
    if (!numeroContrato && !numeroManifesto && !numeroCTe && !numeroNotaFiscal) {
      toast.error("Preencha pelo menos um dos campos de pesquisa");
      setLoading(false);
      return;
    }
    
    try {
      let query = supabase
        .from('Contratos')
        .select('id, cliente_destino, motorista_id');
      
      if (numeroContrato) {
        query = query.eq('id', numeroContrato);
      }

      // Buscar pelo contrato primeiro
      const { data: contratoData, error: contratoError } = await query;
      
      if (contratoError) {
        throw contratoError;
      }
      
      if (contratoData && contratoData.length > 0) {
        // Buscar nome do motorista
        const { data: motoristasData } = await supabase
          .from('Motoristas')
          .select('nome')
          .eq('id', contratoData[0].motorista_id)
          .single();
          
        const resultado: CanhotoPendente = {
          contrato_id: contratoData[0].id.toString(),
          cliente: contratoData[0].cliente_destino,
          motorista: motoristasData?.nome || 'Não identificado'
        };
        
        onResultadoEncontrado(resultado);
        return;
      }
      
      // Se não encontrou por contrato, tentar pelos outros campos
      if (numeroManifesto || numeroCTe || numeroNotaFiscal) {
        let queryCanhotos = supabase.from('Canhoto').select('*');
        
        if (numeroManifesto) {
          queryCanhotos = queryCanhotos.eq('numero_manifesto', numeroManifesto);
        }
        
        if (numeroCTe) {
          queryCanhotos = queryCanhotos.eq('numero_cte', numeroCTe);
        }
        
        if (numeroNotaFiscal) {
          queryCanhotos = queryCanhotos.eq('numero_nota_fiscal', numeroNotaFiscal);
        }
        
        const { data: canhotosData, error: canhotosError } = await queryCanhotos;
        
        if (canhotosError) {
          throw canhotosError;
        }
        
        if (canhotosData && canhotosData.length > 0) {
          // Verifique se algum documento já teve o canhoto recebido
          const canhotosRecebidos = canhotosData.filter(c => c.status === 'Recebido');
          
          if (canhotosRecebidos.length > 0) {
            toast.warning("Este documento já teve seu canhoto registrado");
            setLoading(false);
            return;
          }
          
          // Pegar o primeiro canhoto pendente
          const canhotoPendente = canhotosData[0];
          
          const resultado: CanhotoPendente = {
            contrato_id: canhotoPendente.contrato_id,
            cliente: canhotoPendente.cliente,
            motorista: canhotoPendente.motorista,
            data_entrega: canhotoPendente.data_entrega_cliente,
            numero_nota_fiscal: canhotoPendente.numero_nota_fiscal
          };
          
          onResultadoEncontrado(resultado);
          return;
        }

        // Tentar buscar pelos documentos nas Notas Fiscais
        if (numeroNotaFiscal) {
          const { data: notasData, error: notasError } = await supabase
            .from('Notas Fiscais')
            .select('*')
            .eq('numero_nota_fiscal', numeroNotaFiscal);
            
          if (notasError) {
            throw notasError;
          }
          
          if (notasData && notasData.length > 0) {
            const nota = notasData[0];
            
            const resultado: CanhotoPendente = {
              cliente: nota.cliente_destinatario,
              contrato_id: '',  // Será preenchido posteriormente
              motorista: 'A ser associado',
              data_entrega: nota.data_prevista_entrega,
              numero_nota_fiscal: nota.numero_nota_fiscal.toString()
            };
            
            onResultadoEncontrado(resultado);
            return;
          }
        }
        
        toast.error("Nenhum documento encontrado com os critérios informados");
      }
    } catch (error) {
      console.error('Erro ao pesquisar documento:', error);
      toast.error("Ocorreu um erro ao pesquisar o documento");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="numeroContrato">Número do Contrato</Label>
          <Input
            id="numeroContrato"
            placeholder="Digite o número do contrato"
            value={numeroContrato}
            onChange={(e) => setNumeroContrato(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="numeroManifesto">Número do Manifesto</Label>
          <Input
            id="numeroManifesto"
            placeholder="Digite o número do manifesto"
            value={numeroManifesto}
            onChange={(e) => setNumeroManifesto(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="numeroCTe">Número do CT-e</Label>
          <Input
            id="numeroCTe"
            placeholder="Digite o número do CT-e"
            value={numeroCTe}
            onChange={(e) => setNumeroCTe(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="numeroNotaFiscal">Número da Nota Fiscal</Label>
          <Input
            id="numeroNotaFiscal"
            placeholder="Digite o número da nota fiscal"
            value={numeroNotaFiscal}
            onChange={(e) => setNumeroNotaFiscal(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button 
          type="button" 
          onClick={handleSearch} 
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {loading ? "Pesquisando..." : "Buscar Documento"}
        </Button>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Dica:</strong> Preencha apenas um dos campos para realizar a pesquisa. O sistema irá encontrar o documento relacionado.
        </p>
      </div>
    </div>
  );
};

export default PesquisaDocumentos;
