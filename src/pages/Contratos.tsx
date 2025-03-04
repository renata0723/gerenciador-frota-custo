
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/ui/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import FormularioRejeicaoContrato from '@/components/contratos/FormularioRejeicaoContrato';
import FormularioCancelamento from '@/components/contratos/FormularioCancelamento';
import { ThumbsDown, FileDown, Plus, Search, Ban } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Contratos = () => {
  const [rejeicaoDialogOpen, setRejeicaoDialogOpen] = useState(false);
  const [cancelamentoDialogOpen, setCancelamentoDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("em-andamento");
  const [contratos, setContratos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    carregarContratos();
    
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

  const carregarContratos = async () => {
    try {
      setCarregando(true);
      const { data, error } = await supabase
        .from('Contratos')
        .select('*')
        .order('data_saida', { ascending: false });
        
      if (error) {
        console.error('Erro ao carregar contratos:', error);
        toast.error('Erro ao carregar contratos');
      } else {
        setContratos(data || []);
      }
    } catch (error) {
      console.error('Erro ao processar contratos:', error);
      toast.error('Ocorreu um erro ao carregar os contratos');
    } finally {
      setCarregando(false);
    }
  };

  const handleSaveRejection = (data: any) => {
    console.log('Contrato rejeitado:', data);
    // Implementar lógica para salvar a rejeição
    setRejeicaoDialogOpen(false);
    toast.success('Contrato rejeitado com sucesso');
  };

  const handleCancelamentoRealizado = () => {
    setCancelamentoDialogOpen(false);
    // Recarregar lista de contratos após cancelamento
    carregarContratos();
    toast.success("Documento cancelado com sucesso");
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
          {/* Dialog de Cancelamento de Documentos */}
          <Dialog open={cancelamentoDialogOpen} onOpenChange={setCancelamentoDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="flex items-center gap-2">
                <Ban size={18} />
                Cancelar Documento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Cancelar Documento</DialogTitle>
              </DialogHeader>
              <FormularioCancelamento 
                onCancelamentoRealizado={handleCancelamentoRealizado}
              />
            </DialogContent>
          </Dialog>
          
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
              {carregando ? (
                <p className="text-center py-4">Carregando contratos...</p>
              ) : (
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
                    {contratos.filter(c => c.status_contrato === 'Em Andamento').length > 0 ? (
                      contratos.filter(c => c.status_contrato === 'Em Andamento').map((contrato) => (
                        <tr key={contrato.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(contrato.data_saida).toLocaleDateString('pt-BR')}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contrato.placa_cavalo}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contrato.motorista || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contrato.cidade_destino}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contrato.cliente_destino}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {contrato.valor_frete ? `R$ ${parseFloat(contrato.valor_frete).toFixed(2)}` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {contrato.status_contrato}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate(`/contratos/editar/${contrato.id}`)}
                            >
                              Editar
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan={8}>Nenhum contrato em andamento encontrado</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="concluidos">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Contratos Concluídos</h2>
            <div className="overflow-x-auto">
              {carregando ? (
                <p className="text-center py-4">Carregando contratos...</p>
              ) : (
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
                    {contratos.filter(c => c.status_contrato === 'Concluído').length > 0 ? (
                      contratos.filter(c => c.status_contrato === 'Concluído').map((contrato) => (
                        <tr key={contrato.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(contrato.data_saida).toLocaleDateString('pt-BR')}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contrato.placa_cavalo}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contrato.motorista || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contrato.cidade_destino}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contrato.cliente_destino}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {contrato.valor_frete ? `R$ ${parseFloat(contrato.valor_frete).toFixed(2)}` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {contrato.status_contrato}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate(`/contratos/editar/${contrato.id}`)}
                            >
                              Visualizar
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan={8}>Nenhum contrato concluído encontrado</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="aguardando-canhoto">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Contratos Aguardando Canhoto</h2>
            <div className="overflow-x-auto">
              {carregando ? (
                <p className="text-center py-4">Carregando contratos...</p>
              ) : (
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
                    {contratos.filter(c => c.status_contrato === 'Aguardando Canhoto').length > 0 ? (
                      contratos.filter(c => c.status_contrato === 'Aguardando Canhoto').map((contrato) => (
                        <tr key={contrato.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(contrato.data_saida).toLocaleDateString('pt-BR')}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contrato.placa_cavalo}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contrato.motorista || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contrato.cidade_destino}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contrato.cliente_destino}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {contrato.valor_frete ? `R$ ${parseFloat(contrato.valor_frete).toFixed(2)}` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              {contrato.status_contrato}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate(`/canhotos?contrato_id=${contrato.id}`)}
                            >
                              Registrar Canhoto
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan={8}>Nenhum contrato aguardando canhoto encontrado</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Contratos;
