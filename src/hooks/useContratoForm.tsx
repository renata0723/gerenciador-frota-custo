import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { logOperation } from '@/utils/logOperations';
import { DadosContratoFormData } from '@/components/contratos/dadosContrato/types';

export interface ObservacoesData {
  operadorEntrega: string;
  dataEntrega: string;
  observacoes: string;
}

export interface FreteContratadoData {
  valorFreteContratado: number;
  valorAdiantamento: number;
  valorPedagio: number;
  saldoPagar: number;
  gerarSaldoPagar: boolean;
  dataVencimento?: Date;
  proprietarioInfo?: any;
  contabilizarFrete?: boolean;
}

export type ContratoFormTab = 'dados' | 'documentos' | 'frete' | 'observacoes' | 'cancelamento' | 'rejeicao';

export const useContratoForm = (contratoId?: string, onContratoSalvo?: (data: any) => void) => {
  const [activeTab, setActiveTab] = useState<ContratoFormTab>("dados");
  const [dadosContrato, setDadosContrato] = useState<DadosContratoFormData | null>(null);
  const [dadosFrete, setDadosFrete] = useState<FreteContratadoData | null>(null);
  const [dadosDocumentos, setDadosDocumentos] = useState<any | null>(null);
  const [dadosObservacoes, setDadosObservacoes] = useState<ObservacoesData | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [contrato, setContrato] = useState<any>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (contratoId) {
      carregarContrato(contratoId);
    }
  }, [contratoId]);
  
  const carregarContrato = async (id: string) => {
    setCarregando(true);
    try {
      const { data, error } = await supabase
        .from('Contratos')
        .select('*')
        .eq('id', parseInt(id))
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setContrato(data);
        
        setDadosContrato({
          idContrato: data.id.toString(),
          dataSaida: data.data_saida,
          cidadeOrigem: data.cidade_origem,
          estadoOrigem: data.cidade_origem.split('/')[1] || '',
          cidadeDestino: data.cidade_destino,
          estadoDestino: data.cidade_destino.split('/')[1] || '',
          clienteDestino: data.cliente_destino,
          tipo: data.tipo_frota as 'frota' | 'terceiro',
          placaCavalo: data.placa_cavalo,
          placaCarreta: data.placa_carreta || '',
          motorista: data.motorista_id ? data.motorista_id.toString() : '',
          proprietario: data.proprietario || ''
        });
        
        toast.info(`Contrato #${id} carregado`);
      } else {
        toast.error('Contrato não encontrado');
        navigate('/contratos');
      }
    } catch (error) {
      console.error('Erro ao carregar contrato:', error);
      toast.error('Erro ao carregar os dados do contrato');
    } finally {
      setCarregando(false);
    }
  };
  
  const handleSaveContractData = (data: DadosContratoFormData) => {
    console.log("Dados do contrato salvos:", data);
    setDadosContrato(data);
    toast.success("Dados do contrato salvos com sucesso!");
    setActiveTab("documentos");
  };
  
  const handleSaveDocumentosData = (data: any) => {
    console.log("Dados dos documentos salvos:", data);
    setDadosDocumentos(data);
    toast.success("Documentos registrados com sucesso!");
    setActiveTab("frete");
  };
  
  const handleSaveFreightData = async (data: FreteContratadoData) => {
    console.log("Dados do frete salvos:", data);
    setDadosFrete(data);
    
    if (dadosContrato?.tipo === 'terceiro' && data.gerarSaldoPagar && data.saldoPagar > 0) {
      const dataVencimentoFormatada = data.dataVencimento ? 
        format(data.dataVencimento, 'yyyy-MM-dd') : null;
        
      if (!dataVencimentoFormatada) {
        toast.error("Data de vencimento é obrigatória para gerar saldo a pagar");
        return;
      }
      
      const saldoPagarData = {
        parceiro: dadosContrato.proprietario,
        valor_total: data.saldoPagar,
        contratos_associados: dadosContrato.idContrato,
        dados_bancarios: data.proprietarioInfo?.dadosBancarios ? JSON.stringify(data.proprietarioInfo.dadosBancarios) : null,
        data_vencimento: dataVencimentoFormatada,
        info_adicional: dadosDocumentos?.notasFiscais?.map((nf: any) => nf.numero).join(', ') || ''
      };
      
      console.log("Gerando saldo a pagar:", saldoPagarData);
      
      try {
        const { error } = await supabase
          .from('Saldo a pagar')
          .insert({
            parceiro: saldoPagarData.parceiro,
            valor_total: saldoPagarData.valor_total,
            contratos_associados: saldoPagarData.contratos_associados,
            dados_bancarios: saldoPagarData.dados_bancarios,
            vencimento: dataVencimentoFormatada
          });
          
        if (error) {
          console.error('Erro ao gerar saldo a pagar:', error);
          toast.error('Erro ao gerar saldo a pagar para o proprietário');
        } else {
          toast.success(`Saldo de R$ ${data.saldoPagar.toFixed(2)} gerado para o proprietário ${dadosContrato.proprietario} com vencimento em ${format(data.dataVencimento, 'dd/MM/yyyy')}`);
        }
      } catch (error) {
        console.error('Erro ao processar saldo a pagar:', error);
        toast.error('Ocorreu um erro ao gerar o saldo a pagar');
      }
    }
    
    toast.success("Dados do frete salvos com sucesso!");
    setActiveTab("observacoes");
  };
  
  const handleSaveObservacoesData = async (data: ObservacoesData) => {
    console.log("Observações salvas:", data);
    setDadosObservacoes(data);
    
    await handleSaveAllData();
    
    toast.success("Observações registradas com sucesso!");
  };
  
  const handleSaveAllData = async () => {
    if (!dadosContrato) {
      toast.error("Dados do contrato incompletos");
      return;
    }
    
    setCarregando(true);
    
    const contratoCompleto = {
      dadosContrato,
      dadosDocumentos,
      dadosFrete,
      dadosObservacoes
    };
    console.log("Contrato completo para salvar:", contratoCompleto);
    
    try {
      const contratoData = {
        id: parseInt(dadosContrato.idContrato),
        cidade_destino: dadosContrato.cidadeDestino,
        cidade_origem: dadosContrato.cidadeOrigem,
        cliente_destino: dadosContrato.clienteDestino,
        data_saida: dadosContrato.dataSaida,
        placa_carreta: dadosContrato.placaCarreta,
        placa_cavalo: dadosContrato.placaCavalo,
        proprietario: dadosContrato.proprietario,
        status_contrato: 'Em Andamento',
        tipo_frota: dadosContrato.tipo,
        valor_frete: dadosContrato.tipo === 'terceiro' ? dadosFrete?.valorFreteContratado || null : null,
        valor_carga: dadosDocumentos?.valorTotalCarga || null,
        motorista_id: dadosContrato.motorista ? parseInt(dadosContrato.motorista) : null
      };
      
      let operation;
      if (contratoId) {
        const { error } = await supabase
          .from('Contratos')
          .update(contratoData)
          .eq('id', parseInt(contratoId));
          
        if (error) throw error;
        operation = 'atualizado';
      } else {
        const { error } = await supabase
          .from('Contratos')
          .insert(contratoData);
          
        if (error) throw error;
        operation = 'criado';
      }
      
      logOperation('Contratos', `Contrato ${operation}`, `ID: ${dadosContrato.idContrato}, Tipo: ${dadosContrato.tipo}`);
      
      if (dadosDocumentos?.numeroManifesto || dadosDocumentos?.numeroCTe || dadosDocumentos?.notasFiscais?.length) {
        const primeiraNotaFiscal = dadosDocumentos?.notasFiscais?.[0]?.numero || null;
        
        const { data: canhotoExistente } = await supabase
          .from('Canhoto')
          .select('*')
          .eq('contrato_id', dadosContrato.idContrato)
          .maybeSingle();
          
        if (canhotoExistente) {
          const { error: canhotoError } = await supabase
            .from('Canhoto')
            .update({
              cliente: dadosContrato.clienteDestino,
              motorista: dadosContrato.motorista ? dadosContrato.motorista : null,
              numero_cte: dadosDocumentos?.numeroCTe || null,
              numero_manifesto: dadosDocumentos?.numeroManifesto || null,
              numero_nota_fiscal: primeiraNotaFiscal,
              proprietario_veiculo: dadosContrato.tipo === 'terceiro' ? dadosContrato.proprietario : null,
              status: 'Pendente',
              saldo_a_pagar: dadosContrato.tipo === 'terceiro' ? (dadosFrete?.saldoPagar || 0) : null,
              data_programada_pagamento: dadosFrete?.dataVencimento ? format(dadosFrete.dataVencimento, 'yyyy-MM-dd') : null
            })
            .eq('id', canhotoExistente.id);
            
          if (canhotoError) {
            console.error('Erro ao atualizar canhoto:', canhotoError);
            toast.error('Erro ao atualizar registro de canhoto');
          }
        } else {
          const { error: canhotoError } = await supabase
            .from('Canhoto')
            .insert({
              cliente: dadosContrato.clienteDestino,
              contrato_id: dadosContrato.idContrato,
              motorista: dadosContrato.motorista ? dadosContrato.motorista : null,
              numero_cte: dadosDocumentos?.numeroCTe || null,
              numero_manifesto: dadosDocumentos?.numeroManifesto || null,
              numero_nota_fiscal: primeiraNotaFiscal,
              proprietario_veiculo: dadosContrato.tipo === 'terceiro' ? dadosContrato.proprietario : null,
              status: 'Pendente',
              saldo_a_pagar: dadosContrato.tipo === 'terceiro' ? (dadosFrete?.saldoPagar || 0) : null,
              data_programada_pagamento: dadosFrete?.dataVencimento ? format(dadosFrete.dataVencimento, 'yyyy-MM-dd') : null
            });
            
          if (canhotoError) {
            console.error('Erro ao criar entrada de canhoto:', canhotoError);
            toast.error('Erro ao criar registro de canhoto');
          }
        }
      }
      
      if (dadosFrete?.valorFreteContratado && dadosFrete.contabilizarFrete) {
        try {
          const { error: lancamentoError } = await supabase
            .from('Lancamentos_Contabeis')
            .insert({
              data_lancamento: new Date().toISOString().split('T')[0],
              data_competencia: new Date().toISOString().split('T')[0],
              conta_debito: '1.1.1.01',
              conta_credito: '3.1.1.01',
              valor: dadosFrete.valorFreteContratado,
              historico: `Receita de frete - Contrato ${dadosContrato.idContrato}`,
              documento_referencia: `CT-e ${dadosDocumentos?.numeroCTe || 'N/D'}`,
              tipo_documento: 'CTE'
            });
            
          if (lancamentoError) {
            console.error('Erro ao contabilizar receita de frete:', lancamentoError);
            toast.error('Erro ao contabilizar receita de frete');
          } else {
            toast.success('Receita de frete contabilizada automaticamente');
          }
        } catch (error) {
          console.error('Erro na contabilização automática:', error);
        }
      }
      
      toast.success(`Contrato ${operation} com sucesso!`);
      
      if (onContratoSalvo) {
        const contratoData = {
          ...dadosContrato,
          ...dadosFrete,
          ...dadosDocumentos,
          ...dadosObservacoes
        };
        onContratoSalvo(contratoData);
      } else {
        setTimeout(() => {
          navigate('/contratos');
        }, 1500);
      }
    } catch (error) {
      console.error('Erro ao salvar contrato:', error);
      toast.error('Ocorreu um erro ao salvar o contrato');
    } finally {
      setCarregando(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    dadosContrato,
    dadosFrete,
    dadosDocumentos,
    dadosObservacoes,
    carregando,
    contrato,
    handleSaveContractData,
    handleSaveDocumentosData,
    handleSaveFreightData,
    handleSaveObservacoesData,
    contratoId
  };
};
