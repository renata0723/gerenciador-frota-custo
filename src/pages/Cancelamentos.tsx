
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { getCancelamentos, getCancelamentosPorTipo } from '@/services/cancelamentoService';
import { CancelamentoDocumento } from '@/types/canhoto';
import { formatDate } from '@/utils/formatters';
import { FileDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import FormularioCancelamento from '@/components/contratos/FormularioCancelamento';
import { toast } from 'sonner';

const Cancelamentos = () => {
  const [activeTab, setActiveTab] = useState("todos");
  const [cancelamentos, setCancelamentos] = useState<CancelamentoDocumento[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelamentoDialogOpen, setCancelamentoDialogOpen] = useState(false);

  const carregarCancelamentos = async (tipo: string = 'todos') => {
    setLoading(true);
    try {
      let data;
      if (tipo === 'todos') {
        data = await getCancelamentos();
      } else {
        data = await getCancelamentosPorTipo(tipo as 'Contrato' | 'CT-e' | 'Manifesto');
      }
      setCancelamentos(data);
    } catch (error) {
      console.error('Erro ao carregar cancelamentos:', error);
      toast.error('Erro ao carregar os cancelamentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarCancelamentos(activeTab);
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleCancelamentoRealizado = () => {
    setCancelamentoDialogOpen(false);
    carregarCancelamentos(activeTab);
  };

  const exportarCancelamentos = () => {
    if (cancelamentos.length === 0) {
      toast.error('Não há dados para exportar');
      return;
    }

    // Criar CSV
    const header = ['Tipo', 'Número', 'Data Cancelamento', 'Motivo', 'Responsável', 'Observações'].join(',');
    const rows = cancelamentos.map(c => {
      return [
        c.tipo_documento,
        c.numero_documento,
        new Date(c.data_cancelamento).toLocaleString('pt-BR'),
        c.motivo,
        c.responsavel,
        c.observacoes || ''
      ].join(',');
    });
    
    const csv = [header, ...rows].join('\n');
    
    // Criar arquivo e download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cancelamentos_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Cancelamentos" 
        description="Histórico de documentos cancelados"
      />
      
      <div className="flex justify-between mb-6">
        <Button 
          variant="outline"
          className="flex items-center gap-2"
          onClick={exportarCancelamentos}
        >
          <FileDown size={18} />
          Exportar CSV
        </Button>
        
        <Dialog open={cancelamentoDialogOpen} onOpenChange={setCancelamentoDialogOpen}>
          <DialogTrigger asChild>
            <Button>Novo Cancelamento</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Novo Cancelamento</DialogTitle>
            </DialogHeader>
            <FormularioCancelamento 
              onCancelamentoRealizado={handleCancelamentoRealizado}
              onCancel={() => setCancelamentoDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="Contrato">Contratos</TabsTrigger>
          <TabsTrigger value="CT-e">CT-e</TabsTrigger>
          <TabsTrigger value="Manifesto">Manifestos</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              {activeTab === "todos" ? "Todos os Cancelamentos" : `Cancelamentos de ${activeTab}`}
            </h2>
            
            {loading ? (
              <div className="py-8 text-center">Carregando...</div>
            ) : cancelamentos.length === 0 ? (
              <div className="py-8 text-center">Nenhum cancelamento encontrado</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motivo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsável</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cancelamentos.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {item.tipo_documento}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {item.numero_documento}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {formatDate(item.data_cancelamento)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {item.motivo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {item.responsavel}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {item.observacoes || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Cancelamentos;
