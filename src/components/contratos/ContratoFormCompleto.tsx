
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import FormularioDadosContrato, { DadosContratoFormData } from '@/components/contratos/FormularioDadosContrato';
import FormularioDocumentosRegistros from '@/components/contratos/FormularioDocumentosRegistros';
import { FormularioFreteContratado } from '@/components/contratos/FormularioFreteContratado';
import FormularioObservacoes from '@/components/contratos/FormularioObservacoes';
import FormularioCancelamento from '@/components/contratos/FormularioCancelamento';
import FormularioRejeicaoContrato from '@/components/contratos/FormularioRejeicaoContrato';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { logOperation } from '@/utils/logOperations';
import { Button } from '@/components/ui/button';
import { AlertTriangle, FileText } from 'lucide-react';

interface ContratoFormCompletoProps {
  contratoId?: string;
  onContratoSalvo?: (data: any) => void;
}

const ContratoFormCompleto: React.FC<ContratoFormCompletoProps> = ({ 
  contratoId,
  onContratoSalvo
}) => {
  const [activeTab, setActiveTab] = useState("dados");
  const [dadosContrato, setDadosContrato] = useState<DadosContratoFormData | null>(null);
  const [dadosFrete, setDadosFrete] = useState<any | null>(null);
  const [dadosDocumentos, setDadosDocumentos] = useState<any | null>(null);
  const [dadosObservacoes, setDadosObservacoes] = useState<any | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [contrato, setContrato] = useState<any>(null);
  const navigate = useNavigate();
  
  // Carregar dados do contrato se estiver editando
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
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setContrato(data);
        
        // Preencher o formulário com os dados do contrato
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
          motorista: data.motorista || '',
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
  
  // Funções para salvar os dados dos formulários
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
  
  const handleSaveFreightData = async (data: any) => {
    console.log("Dados do frete salvos:", data);
    setDadosFrete(data);
    
    // Se for frete terceirizado e a opção de gerar saldo a pagar estiver marcada
    if (dadosContrato?.tipo === 'terceiro' && data.gerarSaldoPagar && data.saldoPagar > 0) {
      // Formatar a data de vencimento
      const dataVencimentoFormatada = data.dataVencimento ? 
        format(data.dataVencimento, 'yyyy-MM-dd') : null;
        
      // Verificar se a data de vencimento foi definida
      if (!dataVencimentoFormatada) {
        toast.error("Data de vencimento é obrigatória para gerar saldo a pagar");
        return;
      }
      
      // Gerar entrada no saldo a pagar
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
        // Inserir no saldo a pagar
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
  
  const handleSaveObservacoesData = async (data: any) => {
    console.log("Observações salvas:", data);
    setDadosObservacoes(data);
    
    // Aqui você poderia chamar uma função para salvar todos os dados coletados
    await handleSaveAllData();
    
    toast.success("Observações registradas com sucesso!");
  };
  
  const handleSaveAllData = async () => {
    // Aqui você enviaria todos os dados para o servidor
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
      // Gravar na tabela de Contratos
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
        valor_carga: dadosDocumentos?.valorTotalCarga || null
      };
      
      let operation;
      if (contratoId) {
        // Atualizar contrato existente
        const { error } = await supabase
          .from('Contratos')
          .update(contratoData)
          .eq('id', contratoId);
          
        if (error) throw error;
        operation = 'atualizado';
      } else {
        // Criar novo contrato
        const { error } = await supabase
          .from('Contratos')
          .insert(contratoData);
          
        if (error) throw error;
        operation = 'criado';
      }
      
      // Registrar a operação no log
      logOperation('Contratos', `Contrato ${operation}`, `ID: ${dadosContrato.idContrato}, Tipo: ${dadosContrato.tipo}`);
      
      // Criar entrada na tabela de Canhoto para futuro recebimento
      if (dadosDocumentos?.numeroManifesto || dadosDocumentos?.numeroCTe || dadosDocumentos?.notasFiscais?.length) {
        // Pegar a primeira nota fiscal
        const primeiraNotaFiscal = dadosDocumentos?.notasFiscais?.[0]?.numero || null;
        
        // Verificar se já existe um canhoto para este contrato
        const { data: canhotoExistente } = await supabase
          .from('Canhoto')
          .select('*')
          .eq('contrato_id', dadosContrato.idContrato)
          .maybeSingle();
          
        if (canhotoExistente) {
          // Atualizar canhoto existente
          const { error: canhotoError } = await supabase
            .from('Canhoto')
            .update({
              cliente: dadosContrato.clienteDestino,
              motorista: dadosContrato.motorista,
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
          // Criar novo canhoto
          const { error: canhotoError } = await supabase
            .from('Canhoto')
            .insert({
              cliente: dadosContrato.clienteDestino,
              contrato_id: dadosContrato.idContrato,
              motorista: dadosContrato.motorista,
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
      
      // Lançamento contábil automatizado (se houver valor de frete)
      if (dadosFrete?.valorFreteContratado && dadosFrete.contabilizarFrete) {
        try {
          // Criar lançamento contábil de receita de frete
          const { error: lancamentoError } = await supabase
            .from('Lancamentos_Contabeis')
            .insert({
              data_lancamento: new Date().toISOString().split('T')[0],
              data_competencia: new Date().toISOString().split('T')[0],
              conta_debito: '1.1.1.01', // Caixa (exemplo)
              conta_credito: '3.1.1.01', // Receita de fretes (exemplo)
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
      
      // Chamar a função de callback se existir, passando os dados completos
      if (onContratoSalvo) {
        // Montar um objeto com todos os dados para exibição do recibo
        const contratoData = {
          ...dadosContrato,
          ...dadosFrete,
          ...dadosDocumentos,
          ...dadosObservacoes
        };
        onContratoSalvo(contratoData);
      } else {
        // Redirecionar para a lista de contratos se não houver callback
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

  return (
    <Card className="w-full">
      {carregando ? (
        <div className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-blue-700 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados do contrato...</p>
        </div>
      ) : (
        <Tabs defaultValue="dados" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dados">Dados do Contrato</TabsTrigger>
            <TabsTrigger value="documentos">Documentos e Registros</TabsTrigger>
            <TabsTrigger value="frete">Frete Contratado</TabsTrigger>
            <TabsTrigger value="observacoes">Observações</TabsTrigger>
            <TabsTrigger value="cancelamento">Cancelamento</TabsTrigger>
            <TabsTrigger value="rejeicao">Rejeição</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dados" className="p-4 space-y-4">
            <FormularioDadosContrato 
              onSubmit={handleSaveContractData} 
              onNext={() => setActiveTab("documentos")}
              initialData={dadosContrato || undefined}
            />
          </TabsContent>
          
          <TabsContent value="documentos" className="p-4 space-y-4">
            <FormularioDocumentosRegistros 
              onSubmit={handleSaveDocumentosData}
              onBack={() => setActiveTab("dados")}
              onNext={() => setActiveTab("frete")}
              initialData={dadosDocumentos || undefined}
            />
          </TabsContent>
          
          <TabsContent value="frete" className="p-4 space-y-4">
            <FormularioFreteContratado 
              onSubmit={handleSaveFreightData} 
              onBack={() => setActiveTab("documentos")}
              onNext={() => setActiveTab("observacoes")}
              initialData={dadosFrete || undefined}
              dadosContrato={dadosContrato} // Passando os dados do contrato para o formulário de frete
            />
          </TabsContent>
          
          <TabsContent value="observacoes" className="p-4 space-y-4">
            <FormularioObservacoes 
              onSubmit={handleSaveObservacoesData}
              onBack={() => setActiveTab("frete")}
              initialData={dadosObservacoes || undefined}
            />
          </TabsContent>
          
          <TabsContent value="cancelamento" className="p-4 space-y-4">
            {contratoId ? (
              <FormularioCancelamento
                tipoDocumento="Contrato"
                numeroDocumento={contratoId}
                onBack={() => setActiveTab("observacoes")}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-12">
                <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">Contrato ainda não salvo</h3>
                <p className="text-muted-foreground text-center mb-4">É necessário salvar o contrato antes de poder cancelá-lo.</p>
                <Button variant="outline" onClick={() => setActiveTab("dados")}>
                  Voltar para dados do contrato
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="rejeicao" className="p-4 space-y-4">
            {contratoId ? (
              <FormularioRejeicaoContrato
                contratoId={contratoId}
                onBack={() => setActiveTab("observacoes")}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-12">
                <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">Contrato ainda não salvo</h3>
                <p className="text-muted-foreground text-center mb-4">É necessário salvar o contrato antes de poder rejeitá-lo.</p>
                <Button variant="outline" onClick={() => setActiveTab("dados")}>
                  Voltar para dados do contrato
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </Card>
  );
};

export default ContratoFormCompleto;
