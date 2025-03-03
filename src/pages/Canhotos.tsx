
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CanhotoForm from '@/components/canhotos/CanhotoForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import PageHeader from '@/components/ui/PageHeader';
import { Canhoto } from '@/types/canhoto';

const Canhotos: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pendentes');
  const [canhotos, setCanhotos] = useState<Canhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCanhoto, setSelectedCanhoto] = useState<Partial<Canhoto> | null>(null);

  const loadCanhotos = async () => {
    setIsLoading(true);
    
    try {
      const status = activeTab === 'pendentes' ? 'Pendente' : 'Recebido';
      
      const { data, error } = await supabase
        .from('Canhoto')
        .select('*')
        .eq('status', status);
        
      if (error) {
        console.error('Erro ao carregar canhotos:', error);
        toast.error('Erro ao carregar dados dos canhotos');
        return;
      }
      
      setCanhotos(data || []);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Ocorreu um erro ao processar a solicitação');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCanhotos();
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleEditCanhoto = (canhoto: Canhoto) => {
    setSelectedCanhoto(canhoto);
    setIsDialogOpen(true);
  };

  const handleSaveCanhoto = async (data: Partial<Canhoto>) => {
    try {
      if (!selectedCanhoto?.id) return;
      
      const { error } = await supabase
        .from('Canhoto')
        .update({
          data_recebimento_canhoto: data.data_recebimento_canhoto,
          data_entrega_cliente: data.data_entrega_cliente,
          responsavel_recebimento: data.responsavel_recebimento,
          data_programada_pagamento: data.data_programada_pagamento,
          status: 'Recebido'
        })
        .eq('id', selectedCanhoto.id);
        
      if (error) {
        console.error('Erro ao atualizar canhoto:', error);
        toast.error('Erro ao atualizar canhoto');
        return;
      }
      
      toast.success('Canhoto atualizado com sucesso!');
      setIsDialogOpen(false);
      loadCanhotos();
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Ocorreu um erro ao processar a solicitação');
    }
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Canhotos" 
        description="Gerencie o recebimento de canhotos dos contratos"
      />
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
          <TabsTrigger value="recebidos">Recebidos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pendentes" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Canhotos Pendentes</h2>
            
            {isLoading ? (
              <p>Carregando...</p>
            ) : canhotos.length === 0 ? (
              <p>Nenhum canhoto pendente encontrado.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contrato</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motorista</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Entrega</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {canhotos.map((canhoto) => (
                      <tr key={canhoto.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{canhoto.contrato_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{canhoto.cliente}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{canhoto.motorista}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{canhoto.data_entrega_cliente}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditCanhoto(canhoto)}
                          >
                            Registrar Recebimento
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="recebidos" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Canhotos Recebidos</h2>
            
            {isLoading ? (
              <p>Carregando...</p>
            ) : canhotos.length === 0 ? (
              <p>Nenhum canhoto recebido encontrado.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contrato</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motorista</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Entrega</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Recebimento</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {canhotos.map((canhoto) => (
                      <tr key={canhoto.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{canhoto.contrato_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{canhoto.cliente}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{canhoto.motorista}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{canhoto.data_entrega_cliente}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{canhoto.data_recebimento_canhoto}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Registrar Recebimento de Canhoto</DialogTitle>
          </DialogHeader>
          {selectedCanhoto && (
            <CanhotoForm 
              dados={selectedCanhoto}
              onSubmit={handleSaveCanhoto}
              onCancel={() => setIsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Canhotos;
