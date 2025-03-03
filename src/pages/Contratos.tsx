import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/ui/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContratoFormTabs from '@/components/contratos/ContratoFormTabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FormularioRejeicaoContrato } from '@/components/contratos/FormularioRejeicaoContrato';
import { ThumbsDown } from 'lucide-react';

const Contratos = () => {
  const [rejeicaoDialogOpen, setRejeicaoDialogOpen] = useState(false);

  const handleSaveRejection = (data) => {
    console.log('Contrato rejeitado:', data);
    // Implementar lógica para salvar a rejeição
    setRejeicaoDialogOpen(false);
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Contratos" 
        description="Gerenciamento de contratos de transporte"
      />
      
      <div className="flex justify-between mb-6">
        <div className="flex gap-2">
          <Button variant="outline">Exportar</Button>
          <Button variant="outline" className="flex items-center gap-2">
            <ThumbsDown size={18} />
            Histórico de Rejeições
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={rejeicaoDialogOpen} onOpenChange={setRejeicaoDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="rejected">
                <ThumbsDown size={18} />
                Rejeitar Contrato
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Rejeitar Contrato</DialogTitle>
              </DialogHeader>
              <FormularioRejeicaoContrato onSave={handleSaveRejection} />
            </DialogContent>
          </Dialog>
          
          <Button>
            + Novo Contrato
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="em-andamento" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="em-andamento">Em Andamento</TabsTrigger>
          <TabsTrigger value="concluidos">Concluídos</TabsTrigger>
          <TabsTrigger value="aguardando-canhoto">Aguardando Canhoto</TabsTrigger>
          <TabsTrigger value="novo">Novo Contrato</TabsTrigger>
        </TabsList>
        
        <TabsContent value="em-andamento" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Contratos em Andamento</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Saída</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motorista</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destino</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Frete</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Dados serão carregados aqui */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan={8}>Nenhum registro encontrado</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="concluidos">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Contratos Concluídos</h2>
            {/* Tabela de contratos concluídos */}
          </div>
        </TabsContent>
        
        <TabsContent value="aguardando-canhoto">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Contratos Aguardando Canhoto</h2>
            {/* Tabela de contratos aguardando canhoto */}
          </div>
        </TabsContent>
        
        <TabsContent value="novo">
          <ContratoFormTabs />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Contratos;
