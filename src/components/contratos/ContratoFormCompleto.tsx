
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import FormularioDadosContrato, { DadosContratoFormData } from '@/components/contratos/FormularioDadosContrato';
import FormularioDocumentosRegistros from '@/components/contratos/FormularioDocumentosRegistros';
import { FormularioFreteContratado } from '@/components/contratos/FormularioFreteContratado';
import FormularioObservacoes from '@/components/contratos/FormularioObservacoes';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ContratoFormCompletoProps {
  contratoId?: string;
}

const ContratoFormCompleto: React.FC<ContratoFormCompletoProps> = ({ contratoId }) => {
  const [activeTab, setActiveTab] = useState("dados");
  const [dadosContrato, setDadosContrato] = useState<DadosContratoFormData | null>(null);
  const [dadosFrete, setDadosFrete] = useState<any | null>(null);
  const [dadosDocumentos, setDadosDocumentos] = useState<any | null>(null);
  const [dadosObservacoes, setDadosObservacoes] = useState<any | null>(null);
  const navigate = useNavigate();
  
  // Carregar dados do contrato se estiver editando
  React.useEffect(() => {
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
  
  const handleSaveFreightData = (data: any) => {
    console.log("Dados do frete salvos:", data);
    setDadosFrete(data);
    
    // Se for frete terceirizado e a opção de gerar saldo a pagar estiver marcada
    if (dadosContrato?.tipo === 'terceiro' && data.gerarSaldoPagar && data.saldoPagar > 0) {
      // Gerar entrada no saldo a pagar
      const saldoPagarData = {
        parceiro: dadosContrato.proprietario,
        valorTotal: data.saldoPagar,
        contrato: dadosContrato.idContrato,
        proprietarioInfo: data.proprietarioInfo
      };
      
      console.log("Gerando saldo a pagar:", saldoPagarData);
      // Aqui você integraria com a API para salvar o saldo a pagar
      
      toast.success(`Saldo de R$ ${data.saldoPagar.toFixed(2)} gerado para o proprietário ${dadosContrato.proprietario}`);
    }
    
    toast.success("Dados do frete salvos com sucesso!");
    setActiveTab("observacoes");
  };
  
  const handleSaveObservacoesData = (data: any) => {
    console.log("Observações salvas:", data);
    setDadosObservacoes(data);
    toast.success("Observações registradas com sucesso!");
    // Aqui você poderia chamar uma função para salvar todos os dados coletados
    handleSaveAllData();
  };
  
  const handleSaveAllData = () => {
    // Aqui você enviaria todos os dados para o servidor
    const contratoCompleto = {
      dadosContrato,
      dadosDocumentos,
      dadosFrete,
      dadosObservacoes
    };
    console.log("Contrato completo para salvar:", contratoCompleto);
    toast.success("Contrato registrado com sucesso!");
    
    // Redirecionar para a lista de contratos
    setTimeout(() => {
      navigate('/contratos');
    }, 1500);
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
