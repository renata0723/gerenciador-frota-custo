
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FormularioDadosContrato, { DadosContratoFormData } from '@/components/contratos/FormularioDadosContrato';
import FormularioDocumentosRegistros from '@/components/contratos/FormularioDocumentosRegistros';
import { FormularioFreteContratado } from '@/components/contratos/FormularioFreteContratado';
import FormularioObservacoes from '@/components/contratos/FormularioObservacoes';
import FormularioRejeicaoContrato from '@/components/contratos/FormularioRejeicaoContrato';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ThumbsDown } from 'lucide-react';

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
  
  const handleSaveRejectionData = (data: any) => {
    console.log("Dados de rejeição salvos:", data);
    toast.success("Contrato rejeitado com sucesso!");
    navigate('/contratos');
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dados">Dados do Contrato</TabsTrigger>
          <TabsTrigger value="documentos">Documentos e Registros</TabsTrigger>
          <TabsTrigger value="frete">Frete Contratado</TabsTrigger>
          <TabsTrigger value="observacoes">Observações</TabsTrigger>
          <TabsTrigger value="rejeicao">
            <ThumbsDown className="h-4 w-4 mr-2" />
            Rejeição
          </TabsTrigger>
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
          />
        </TabsContent>
        
        <TabsContent value="observacoes" className="p-4 space-y-4">
          <FormularioObservacoes 
            onSubmit={handleSaveObservacoesData}
            onBack={() => setActiveTab("frete")}
            initialData={dadosObservacoes || undefined}
          />
        </TabsContent>
        
        <TabsContent value="rejeicao" className="p-4 space-y-4">
          <FormularioRejeicaoContrato onSave={handleSaveRejectionData} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ContratoFormCompleto;
