import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FormularioDadosContrato from './FormularioDadosContrato';
import FormularioFreteContratado from './FormularioFreteContratado';
import FormularioDocumentosRegistros from './FormularioDocumentosRegistros';
import FormularioObservacoes from './FormularioObservacoes';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const ContratoFormSchema = z.object({
  // ... esquema completo do contrato
});

type ContratoFormData = z.infer<typeof ContratoFormSchema>;

interface ContratoFormTabsProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  readOnly?: boolean;
}

const ContratoFormTabs: React.FC<ContratoFormTabsProps> = ({
  onSubmit,
  onCancel,
  initialData = {},
  readOnly = false
}) => {
  const [activeTab, setActiveTab] = useState('dados');
  const [dadosContrato, setDadosContrato] = useState(initialData?.dadosContrato || {});
  const [dadosFrete, setDadosFrete] = useState(initialData?.dadosFrete || {});
  const [dadosDocumentos, setDadosDocumentos] = useState(initialData?.dadosDocumentos || {});
  const [observacoes, setObservacoes] = useState(initialData?.observacoes || {});
  
  const { reset } = useForm<ContratoFormData>({
    resolver: zodResolver(ContratoFormSchema),
    defaultValues: {
      // ... valores padrão
    }
  });

  const handleDadosContratoSave = (dados: any) => {
    setDadosContrato(dados);
    setActiveTab('frete');
    toast.success('Dados do contrato salvos');
  };

  const handleDadosFreteContratoSave = (dados: any) => {
    setDadosFrete(dados);
    setActiveTab('documentos');
    toast.success('Dados do frete salvos');
  };

  const handleDadosDocumentosSave = (dados: any) => {
    setDadosDocumentos(dados);
    setActiveTab('observacoes');
    toast.success('Documentos registrados');
  };

  const handleObservacoesSave = (dados: any) => {
    setObservacoes(dados);
    
    // Junta todos os dados para enviar ao backend
    const formData = {
      dadosContrato,
      dadosFrete,
      dadosDocumentos,
      observacoes: dados
    };
    
    onSubmit(formData);
    toast.success('Contrato finalizado com sucesso!');
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="dados">1. Dados do Contrato</TabsTrigger>
        <TabsTrigger value="frete">2. Frete Contratado</TabsTrigger>
        <TabsTrigger value="documentos">3. Documentos</TabsTrigger>
        <TabsTrigger value="observacoes">4. Observações</TabsTrigger>
      </TabsList>

      <TabsContent value="dados" className="mt-4">
        <FormularioDadosContrato
          onSave={handleDadosContratoSave}
          onNext={() => setActiveTab('frete')}
          initialData={dadosContrato}
          readOnly={readOnly}
        />
      </TabsContent>

      <TabsContent value="frete" className="mt-4">
        <FormularioFreteContratado
          contrato={dadosContrato}
          onSave={handleDadosFreteContratoSave}
          onBack={() => setActiveTab('dados')}
          initialData={dadosFrete}
          dadosContrato={dadosContrato}
        />
      </TabsContent>

      <TabsContent value="documentos" className="mt-4">
        <FormularioDocumentosRegistros
          initialData={dadosDocumentos}
          onSalvar={handleDadosDocumentosSave}
          onVoltar={() => setActiveTab('frete')}
          readOnly={readOnly}
        />
      </TabsContent>

      <TabsContent value="observacoes" className="mt-4">
        <FormularioObservacoes
          initialData={observacoes}
          onSave={handleObservacoesSave}
          onBack={() => setActiveTab('documentos')}
          readOnly={readOnly}
        />
      </TabsContent>

      <div className="flex justify-end space-x-2 mt-4">
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={readOnly}
        >
          Cancelar
        </Button>
      </div>
    </Tabs>
  );
};

export default ContratoFormTabs;
