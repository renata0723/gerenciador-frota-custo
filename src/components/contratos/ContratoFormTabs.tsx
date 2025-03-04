
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FormularioDadosContrato from './FormularioDadosContrato';
import FormularioDocumentosRegistros, { DocumentosRegistrosData } from './FormularioDocumentosRegistros';
import FormularioFreteContratado from './FormularioFreteContratado';
import FormularioObservacoes, { ObservacoesData } from './FormularioObservacoes';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { DadosContratoFormData } from './dadosContrato/types';

interface ContratoFormTabsProps {
  onSalvarCompleto: () => void;
  contratoId?: string;
  initialData?: any;
  readOnly?: boolean;
}

interface DocumentosFormData extends DocumentosRegistrosData {
  numeroManifesto: string;
  numeroCTe: string;
  notasFiscais: string;
}

interface TabCompleteState {
  dados: boolean;
  documentos: boolean;
  frete: boolean;
  observacoes: boolean;
}

const ContratoFormTabs: React.FC<ContratoFormTabsProps> = ({
  onSalvarCompleto,
  contratoId,
  initialData,
  readOnly = false
}) => {
  const [activeTab, setActiveTab] = useState("dados");
  const [dadosContrato, setDadosContrato] = useState<DadosContratoFormData | null>(null);
  const [documentosRegistros, setDocumentosRegistros] = useState<DocumentosFormData | null>(null);
  const [freteContratado, setFreteContratado] = useState<any>(null);
  const [observacoes, setObservacoes] = useState<ObservacoesData | null>(null);
  const [tabsCompleted, setTabsCompleted] = useState<TabCompleteState>({
    dados: false,
    documentos: false,
    frete: false,
    observacoes: false
  });
  
  const handleDadosContratoSubmit = async (data: DadosContratoFormData) => {
    setDadosContrato(data);
    setTabsCompleted(prev => ({ ...prev, dados: true }));
    
    try {
      if (!contratoId) {
        // Criar novo contrato
        const { data: newContract, error } = await supabase
          .from('Contratos')
          .insert({
            id_contrato: data.idContrato,
            data_saida: data.dataSaida,
            cidade_origem: data.cidadeOrigem,
            estado_origem: data.estadoOrigem,
            cidade_destino: data.cidadeDestino,
            estado_destino: data.estadoDestino,
            cliente_destino: data.clienteDestino,
            tipo_frete: data.tipo,
            placa_cavalo: data.placaCavalo,
            placa_carreta: data.placaCarreta,
            motorista: data.motorista,
            proprietario: data.proprietario,
            status_contrato: 'Em Andamento'
          })
          .select();
          
        if (error) throw error;
        
        // Atualizar o ID do contrato para uso nas próximas etapas
        if (newContract && newContract.length > 0) {
          toast.success("Dados do contrato salvos com sucesso!");
          // Avançar para a próxima aba
          setActiveTab("documentos");
        }
      } else {
        // Atualizar contrato existente
        const { error } = await supabase
          .from('Contratos')
          .update({
            id_contrato: data.idContrato,
            data_saida: data.dataSaida,
            cidade_origem: data.cidadeOrigem,
            estado_origem: data.estadoOrigem,
            cidade_destino: data.cidadeDestino,
            estado_destino: data.estadoDestino,
            cliente_destino: data.clienteDestino,
            tipo_frete: data.tipo,
            placa_cavalo: data.placaCavalo,
            placa_carreta: data.placaCarreta,
            motorista: data.motorista,
            proprietario: data.proprietario
          })
          .eq('id', contratoId);
          
        if (error) throw error;
        
        toast.success("Dados do contrato atualizados com sucesso!");
        // Avançar para a próxima aba
        setActiveTab("documentos");
      }
    } catch (error) {
      console.error("Erro ao salvar dados do contrato:", error);
      toast.error("Erro ao salvar dados do contrato");
    }
  };
  
  const handleDocumentosRegistrosSubmit = async (data: DocumentosRegistrosData) => {
    setDocumentosRegistros(data as DocumentosFormData);
    setTabsCompleted(prev => ({ ...prev, documentos: true }));
    
    try {
      // Salvar documentos e registros
      const { error } = await supabase
        .from('Documentos_Contrato')
        .upsert({
          contrato_id: contratoId,
          manifesto: data.manifesto,
          cte: data.cte,
          valor_frete: data.valorFrete,
          valor_carga: data.valorCarga
        });
        
      if (error) throw error;
      
      toast.success("Documentos e registros salvos com sucesso!");
      // Avançar para a próxima aba
      setActiveTab("frete");
    } catch (error) {
      console.error("Erro ao salvar documentos e registros:", error);
      toast.error("Erro ao salvar documentos e registros");
    }
  };
  
  const handleFreteContratadoSubmit = async (data: any) => {
    setFreteContratado(data);
    setTabsCompleted(prev => ({ ...prev, frete: true }));
    
    try {
      // Salvar frete contratado
      const { error } = await supabase
        .from('Frete_Contratado')
        .upsert({
          contrato_id: contratoId,
          valor_frete_contratado: data.valorFreteContratado,
          valor_adiantamento: data.valorAdiantamento,
          valor_pedagio: data.valorPedagio,
          saldo_pagar: data.saldoPagar,
          data_adiantamento: data.dataAdiantamento || null,
          metodo_pagamento_adiantamento: data.metodoPagamentoAdiantamento || null,
          banco_pagamento_adiantamento: data.bancoPagamentoAdiantamento || null
        });
        
      if (error) throw error;
      
      toast.success("Frete contratado salvo com sucesso!");
      // Avançar para a próxima aba
      setActiveTab("observacoes");
    } catch (error) {
      console.error("Erro ao salvar frete contratado:", error);
      toast.error("Erro ao salvar frete contratado");
    }
  };
  
  const handleObservacoesSubmit = async (data: ObservacoesData) => {
    setObservacoes(data);
    setTabsCompleted(prev => ({ ...prev, observacoes: true }));
    
    try {
      // Salvar observações
      const { error } = await supabase
        .from('Contratos')
        .update({
          operador_entrega: data.operadorEntrega,
          data_entrega: data.dataEntrega,
          observacoes: data.observacoes || null,
          status_contrato: 'Concluído'
        })
        .eq('id', contratoId);
        
      if (error) throw error;
      
      toast.success("Contrato finalizado com sucesso!");
      // Chamar função de conclusão
      onSalvarCompleto();
    } catch (error) {
      console.error("Erro ao finalizar contrato:", error);
      toast.error("Erro ao finalizar contrato");
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b">
            <TabsTrigger value="dados" className={`${tabsCompleted.dados ? 'font-bold' : ''}`}>
              Dados do Contrato
            </TabsTrigger>
            <TabsTrigger 
              value="documentos" 
              className={`${tabsCompleted.documentos ? 'font-bold' : ''}`}
              disabled={!tabsCompleted.dados && !initialData}
            >
              Documentos e Registros
            </TabsTrigger>
            <TabsTrigger 
              value="frete" 
              className={`${tabsCompleted.frete ? 'font-bold' : ''}`}
              disabled={!tabsCompleted.documentos && !initialData}
            >
              Frete Contratado
            </TabsTrigger>
            <TabsTrigger 
              value="observacoes" 
              className={`${tabsCompleted.observacoes ? 'font-bold' : ''}`}
              disabled={!tabsCompleted.frete && !initialData}
            >
              Observações
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dados" className="p-4">
            <FormularioDadosContrato 
              initialData={initialData?.dadosContrato || dadosContrato}
              onSave={handleDadosContratoSubmit}
              onNext={() => setActiveTab("documentos")}
              readOnly={readOnly}
            />
          </TabsContent>
          
          <TabsContent value="documentos" className="p-4">
            <FormularioDocumentosRegistros 
              initialData={initialData?.documentosRegistros || documentosRegistros}
              onSave={handleDocumentosRegistrosSubmit}
              onBack={() => setActiveTab("dados")}
              readOnly={readOnly}
            />
          </TabsContent>
          
          <TabsContent value="frete" className="p-4">
            <FormularioFreteContratado 
              initialData={initialData?.freteContratado || freteContratado}
              onSave={handleFreteContratadoSubmit}
              onBack={() => setActiveTab("documentos")}
              onNext={() => setActiveTab("observacoes")}
              contrato={contratoId ? { id: contratoId } : undefined}
            />
          </TabsContent>
          
          <TabsContent value="observacoes" className="p-4">
            <FormularioObservacoes 
              initialData={initialData?.observacoes || observacoes}
              onSubmit={handleObservacoesSubmit}
              onBack={() => setActiveTab("frete")}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContratoFormTabs;
