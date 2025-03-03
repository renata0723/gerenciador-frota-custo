
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/ui/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import FormularioRejeicaoContrato from '@/components/contratos/FormularioRejeicaoContrato';
import { ThumbsDown, FileDown, Plus, Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

const Contratos = () => {
  const [rejeicaoDialogOpen, setRejeicaoDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("em-andamento");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Verifica se há um parâmetro de ID na URL (vindo da página de busca)
    const params = new URLSearchParams(location.search);
    const contratoId = params.get('id');
    
    if (contratoId) {
      // Se houver um ID, simula a abertura de um contrato específico
      toast.info(`Visualizando contrato #${contratoId}`);
      // Poderia direcionar para a página de edição
      navigate(`/contratos/editar/${contratoId}`);
    }
  }, [location, navigate]);

  const handleSaveRejection = (data: any) => {
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
          <Button variant="outline" className="flex items-center gap-2">
            <FileDown size={18} />
            Exportar
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <ThumbsDown size={18} />
            Histórico de Rejeições
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => navigate('/buscar-contrato')}
          >
            <Search size={18} />
            Buscar por Número
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={rejeicaoDialogOpen} onOpenChange={setRejeicaoDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <ThumbsDown size={18} className="mr-2" />
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
          
          <Button 
            onClick={() => navigate('/contratos/novo')} 
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            Novo Contrato
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="em-andamento">Em Andamento</TabsTrigger>
          <TabsTrigger value="concluidos">Concluídos</TabsTrigger>
          <TabsTrigger value="aguardando-canhoto">Aguardando Canhoto</TabsTrigger>
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
      </Tabs>
    </PageLayout>
  );
};

export default Contratos;
