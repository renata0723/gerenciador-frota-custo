
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import FormularioDadosContrato, { DadosContratoFormData } from '@/components/contratos/FormularioDadosContrato';
import FormularioDocumentosRegistros from '@/components/contratos/FormularioDocumentosRegistros';
import { FormularioFreteContratado } from '@/components/contratos/FormularioFreteContratado';
import FormularioObservacoes from '@/components/contratos/FormularioObservacoes';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { logOperation } from '@/utils/logOperations';

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
  const navigate = useNavigate();
  
  // Carregar dados do contrato se estiver editando
  useEffect(() => {
    if (contratoId) {
      // Aqui você implementaria a lógica para carregar os dados do contrato
      toast.info(`Carregando contrato #${contratoId}`);
      // Simulação de carregamento de dados
      setTimeout(() => {
        // Dados de exemplo
        setDadosContrato({
          idContrato: contratoId, // Usando o contratoId como ID do contrato
          dataSaida: '2023-11-15',
          cidadeOrigem: 'São Paulo',
          estadoOrigem: 'SP',
          cidadeDestino: 'Rio de Janeiro',
          estadoDestino: 'RJ',
          clienteDestino: 'Empresa XYZ',
          tipo: 'frota',
          placaCavalo: 'ABC1D23',
          placaCarreta: 'XYZ9W87',
          motorista: 'João Silva',
          proprietario: 'Transportes Rápidos Ltda'
        });
      }, 1000);
    }
  }, [contratoId]);
  
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
        valorTotal: data.saldoPagar,
        contrato: dadosContrato.idContrato,
        proprietarioInfo: data.proprietarioInfo || dadosContrato.proprietarioInfo,
        dataVencimento: dataVencimentoFormatada,
        notasFiscais: dadosDocumentos?.notasFiscais?.map((nf: any) => nf.numero).join(', ') || ''
      };
      
      console.log("Gerando saldo a pagar:", saldoPagarData);
      
      try {
        // Formatar dados bancários para armazenamento
        const dadosBancariosJSON = saldoPagarData.proprietarioInfo ? 
          JSON.stringify(saldoPagarData.proprietarioInfo.dadosBancarios) : null;
          
        // Preparar informações de notas fiscais associadas
        const notasFiscaisInfo = dadosDocumentos?.notasFiscais?.length > 0 ? 
          `Notas: ${saldoPagarData.notasFiscais}` : '';
          
        // Inserir no saldo a pagar
        const { error } = await supabase
          .from('Saldo a pagar')
          .insert({
            parceiro: saldoPagarData.parceiro,
            valor_total: saldoPagarData.valorTotal,
            contratos_associados: saldoPagarData.contrato,
            dados_bancarios: dadosBancariosJSON,
            data_vencimento: dataVencimentoFormatada,
            info_adicional: notasFiscaisInfo
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
    
    const contratoCompleto = {
      dadosContrato,
      dadosDocumentos,
      dadosFrete,
      dadosObservacoes
    };
    console.log("Contrato completo para salvar:", contratoCompleto);
    
    try {
      // Gravar na tabela de Contratos
      const { error: contratoError } = await supabase
        .from('Contratos')
        .insert({
          id: parseInt(dadosContrato.idContrato) || null,
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
        });
        
      if (contratoError) {
        console.error('Erro ao salvar contrato:', contratoError);
        toast.error('Erro ao salvar contrato');
        return;
      }
      
      // Registrar a operação no log
      logOperation('Contratos', 'Novo contrato criado', `ID: ${dadosContrato.idContrato}, Tipo: ${dadosContrato.tipo}`);
      
      // Criar entrada na tabela de Canhoto para futuro recebimento
      if (dadosDocumentos?.numeroManifesto || dadosDocumentos?.numeroCTe || dadosDocumentos?.notasFiscais?.length) {
        // Pegar a primeira nota fiscal
        const primeiraNotaFiscal = dadosDocumentos?.notasFiscais?.[0]?.numero || null;
        
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
      
      toast.success("Contrato registrado com sucesso!");
      
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
    }
  };

  return (
    <Card className="w-full">
      <Tabs defaultValue="dados" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dados">Dados do Contrato</TabsTrigger>
          <TabsTrigger value="documentos">Documentos e Registros</TabsTrigger>
          <TabsTrigger value="frete">Frete Contratado</TabsTrigger>
          <TabsTrigger value="observacoes">Observações</TabsTrigger>
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
      </Tabs>
    </Card>
  );
};

export default ContratoFormCompleto;
