
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FormularioDadosContrato from './FormularioDadosContrato';
import FormularioDocumentosRegistros from './FormularioDocumentosRegistros';
import FormularioCancelamento from './FormularioCancelamento';
import FormularioObservacoes from './FormularioObservacoes';
import FormularioRejeicaoContrato from './FormularioRejeicaoContrato';
import FormularioFreteContratado from './FormularioFreteContratado';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Check } from 'lucide-react';
import ContratoLoading from './ContratoLoading';
import { toast } from 'sonner';

interface ContratoFormTabsProps {
  contrato: any;
  loading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSave: (dados: any) => void;
  onCancel: () => void;
  isAdminView?: boolean;
  readOnly?: boolean;
}

const ContratoFormTabs: React.FC<ContratoFormTabsProps> = ({
  contrato,
  loading,
  activeTab,
  setActiveTab,
  onSave,
  onCancel,
  isAdminView = false,
  readOnly = false
}) => {
  const [formError, setFormError] = useState<string | null>(null);

  const handleSave = (dados: any) => {
    setFormError(null);
    try {
      onSave(dados);
    } catch (error) {
      console.error('Erro ao salvar contrato:', error);
      setFormError('Ocorreu um erro ao salvar o contrato. Tente novamente.');
      toast.error('Ocorreu um erro ao salvar o contrato. Tente novamente.');
    }
  };

  const renderContent = () => {
    if (loading) {
      return <ContratoLoading />;
    }

    if (formError) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Erro ao processar formulário</p>
                <p className="text-sm">{formError}</p>
                <Button 
                  variant="outline" 
                  className="mt-2 border-red-300 text-red-600 hover:bg-red-50"
                  onClick={() => setFormError(null)}
                >
                  Tentar novamente
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="dados" disabled={readOnly && activeTab !== 'dados'}>
            Dados do Contrato
          </TabsTrigger>
          <TabsTrigger value="documentos" disabled={readOnly && activeTab !== 'documentos'}>
            Documentos
          </TabsTrigger>
          <TabsTrigger value="frete" disabled={readOnly && activeTab !== 'frete'}>
            Frete Terceiro
          </TabsTrigger>
          <TabsTrigger value="observacoes" disabled={readOnly && activeTab !== 'observacoes'}>
            Observações
          </TabsTrigger>
          {isAdminView && (
            <TabsTrigger value="rejeicao" disabled={readOnly && activeTab !== 'rejeicao'}>
              Rejeição
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="dados">
          <FormularioDadosContrato 
            contrato={contrato} 
            onSave={handleSave} 
            onCancel={onCancel}
            readOnly={readOnly}
          />
        </TabsContent>

        <TabsContent value="documentos">
          <FormularioDocumentosRegistros 
            contrato={contrato} 
            onSave={handleSave} 
            onBack={() => setActiveTab('dados')}
            readOnly={readOnly}
          />
        </TabsContent>

        <TabsContent value="frete">
          <FormularioFreteContratado 
            contrato={contrato} 
            onSave={handleSave} 
            onBack={() => setActiveTab('documentos')}
          />
        </TabsContent>

        <TabsContent value="observacoes">
          <FormularioObservacoes 
            contrato={contrato} 
            onSave={handleSave} 
            onBack={() => setActiveTab('frete')}
            readOnly={readOnly}
          />
        </TabsContent>

        {isAdminView && (
          <TabsContent value="rejeicao">
            <FormularioRejeicaoContrato 
              contrato={contrato}
              onSave={handleSave}
              onBack={() => setActiveTab('observacoes')}
            />
          </TabsContent>
        )}
      </Tabs>
    );
  };

  return renderContent();
};

export default ContratoFormTabs;
