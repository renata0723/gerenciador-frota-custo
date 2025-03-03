
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Download, FileDown, Plus, Filter } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface SaldoPagarItem {
  id: string;
  parceiro: string;
  contratos_associados: string;
  valor_total: number;
  valor_pago?: number;
  saldo_restante?: number;
  data_pagamento?: string;
  status: 'Pendente' | 'Parcial' | 'Pago';
  vencimento?: string;
  banco_pagamento?: string;
  documento?: string;
}

const SaldoPagar = () => {
  const [saldos, setSaldos] = useState<SaldoPagarItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    carregarSaldos();
  }, []);
  
  const carregarSaldos = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('Saldo a pagar')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Transformar os dados para o formato esperado
        const formattedData: SaldoPagarItem[] = data.map(item => ({
          id: `SP-${String(item.id).padStart(3, '0')}`,
          parceiro: item.parceiro || 'Sem nome',
          contratos_associados: item.contratos_associados || '',
          valor_total: item.valor_total || 0,
          valor_pago: item.valor_pago || 0,
          saldo_restante: (item.valor_total || 0) - (item.valor_pago || 0),
          data_pagamento: item.data_pagamento,
          status: 
            item.data_pagamento && item.valor_pago === item.valor_total 
              ? 'Pago' 
              : item.data_pagamento 
                ? 'Parcial' 
                : 'Pendente',
          banco_pagamento: item.banco_pagamento,
          documento: item.contratos_associados
        }));
        
        setSaldos(formattedData);
      }
    } catch (error) {
      console.error('Erro ao carregar saldos:', error);
      toast.error('Erro ao carregar dados de saldo a pagar');
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredSaldos = saldos.filter(item => 
    item.parceiro.toLowerCase().includes(search.toLowerCase()) ||
    item.contratos_associados?.toLowerCase().includes(search.toLowerCase()) ||
    item.documento?.toLowerCase().includes(search.toLowerCase())
  );
  
  const formatarData = (dataString?: string) => {
    if (!dataString) return '-';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };
  
  const handleNovoSaldo = () => {
    setIsDialogOpen(true);
    // Implementar lógica de criação de novo saldo
  };
  
  const exportarRelatorio = () => {
    try {
      const doc = new jsPDF();
      
      // Adicionar cabeçalho com logo e dados da empresa
      doc.setFontSize(20);
      doc.text('SSLOG Transportes LTDA', 105, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.text('CNPJ: 44.712.877/0001-80', 105, 30, { align: 'center' });
      doc.text('Rua Vagner Luis Boscardin, 7015 - Aguas Claras - Piraquara/PR', 105, 35, { align: 'center' });
      
      doc.setFontSize(16);
      doc.text('Relatório de Saldo a Pagar', 105, 50, { align: 'center' });
      doc.setFontSize(10);
      doc.text(`Data de geração: ${new Date().toLocaleDateString('pt-BR')}`, 105, 55, { align: 'center' });
      
      // Converter os dados para o formato esperado pelo autoTable
      const tableData = filteredSaldos.map(item => [
        item.id,
        item.parceiro,
        item.documento || item.contratos_associados,
        formatarData(item.vencimento),
        formatCurrency(item.valor_total),
        formatCurrency(item.valor_pago || 0),
        formatCurrency(item.saldo_restante || 0),
        item.status,
        item.banco_pagamento || '-'
      ]);
      
      // @ts-ignore - jsPDF-AutoTable é adicionado ao objeto jsPDF
      doc.autoTable({
        startY: 65,
        head: [['ID', 'Parceiro', 'Documento', 'Vencimento', 'Valor Total', 'Valor Pago', 'Saldo', 'Status', 'Banco']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [41, 80, 149], textColor: 255 }
      });
      
      // Adicionar rodapé
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Página ${i} de ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });
        doc.text(`SSLOG Transportes LTDA - Sistema de Controle de Frotas e Logística`, 105, doc.internal.pageSize.height - 5, { align: 'center' });
      }
      
      // Salvar o PDF
      doc.save('saldo-a-pagar.pdf');
      toast.success('Relatório exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      toast.error('Erro ao gerar o relatório em PDF');
    }
  };
  
  return (
    <PageLayout>
      <div className="bg-white py-6 px-8 border-b shadow-sm w-full mb-6">
        <div className="flex justify-between items-center max-w-screen-xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Saldo a Pagar</h1>
            <p className="text-gray-500 mt-1">Controle de valores a pagar aos parceiros</p>
          </div>
          
          <Button 
            onClick={handleNovoSaldo}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Novo Saldo
          </Button>
        </div>
      </div>
      
      <div className="max-w-screen-xl mx-auto">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <Tabs defaultValue="lista">
              <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
                <TabsList>
                  <TabsTrigger value="lista">Lista de Saldos</TabsTrigger>
                  <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
                </TabsList>
                
                <div className="flex gap-3 items-center">
                  <div className="relative">
                    <Input 
                      placeholder="Buscar por parceiro, documento ou contrato..." 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="min-w-[300px]"
                    />
                  </div>
                  
                  <Button 
                    variant="outline"
                    onClick={exportarRelatorio}
                    className="flex items-center gap-2"
                  >
                    <FileDown size={16} />
                    Exportar
                  </Button>
                </div>
              </div>
              
              <TabsContent value="lista">
                {isLoading ? (
                  <div className="py-20 text-center">Carregando dados...</div>
                ) : filteredSaldos.length === 0 ? (
                  <div className="py-20 text-center">
                    <h3 className="text-lg font-medium">Nenhum saldo a pagar encontrado</h3>
                    <p className="text-gray-500 mt-2">
                      {search 
                        ? "Nenhum resultado para a sua busca."
                        : "Registre um novo saldo a pagar clicando no botão 'Novo Saldo'"
                      }
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-sm font-medium text-gray-500 border-b">
                          <th className="py-3 px-4 text-left">ID</th>
                          <th className="py-3 px-4 text-left">Parceiro</th>
                          <th className="py-3 px-4 text-left">Documento</th>
                          <th className="py-3 px-4 text-left">Vencimento</th>
                          <th className="py-3 px-4 text-right">Valor Total</th>
                          <th className="py-3 px-4 text-right">Valor Pago</th>
                          <th className="py-3 px-4 text-right">Saldo</th>
                          <th className="py-3 px-4 text-center">Status</th>
                          <th className="py-3 px-4 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSaldos.map((item) => (
                          <tr key={item.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 text-left">
                              {item.id}
                            </td>
                            <td className="py-3 px-4 text-left">
                              {item.parceiro}
                            </td>
                            <td className="py-3 px-4 text-left">
                              {item.documento || item.contratos_associados}
                            </td>
                            <td className="py-3 px-4 text-left">
                              {formatarData(item.vencimento)}
                            </td>
                            <td className="py-3 px-4 text-right">
                              {formatCurrency(item.valor_total)}
                            </td>
                            <td className="py-3 px-4 text-right">
                              {formatCurrency(item.valor_pago || 0)}
                            </td>
                            <td className="py-3 px-4 text-right">
                              {formatCurrency(item.saldo_restante || 0)}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                item.status === 'Pago' 
                                  ? 'bg-green-100 text-green-800' 
                                  : item.status === 'Parcial'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button size="sm" variant="outline">
                                Detalhes
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="relatorios">
                <div className="py-10 text-center">
                  <h3 className="text-lg font-medium">Relatórios em Desenvolvimento</h3>
                  <p className="text-gray-500 mt-2">
                    Esta funcionalidade estará disponível em breve.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Dialog para Novo Saldo a Pagar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Registrar Novo Saldo a Pagar</DialogTitle>
          </DialogHeader>
          {/* Aqui será implementado o formulário de novo saldo */}
          <div className="py-6 text-center">
            <p className="text-gray-500">
              Formulário de registro de novo saldo a pagar em desenvolvimento.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default SaldoPagar;
