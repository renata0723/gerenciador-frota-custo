
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Download, FileDown, Plus, Filter, Calendar, DollarSign, User, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { SaldoPagarItem } from '@/types/contabilidade';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const SaldoPagar = () => {
  const [saldos, setSaldos] = useState<SaldoPagarItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Estado para novo saldo
  const [novoSaldo, setNovoSaldo] = useState({
    parceiro: '',
    contratos_associados: '',
    valor_total: 0,
    valor_pago: 0,
    vencimento: '',
    banco_pagamento: '',
    dados_bancarios: ''
  });
  
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
            item.data_pagamento && item.valor_pago >= item.valor_total
              ? 'Pago' 
              : item.data_pagamento 
                ? 'Parcial' 
                : 'Pendente',
          banco_pagamento: item.banco_pagamento,
          documento: item.contratos_associados,
          vencimento: item.vencimento,
          dados_bancarios: item.dados_bancarios
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
    try {
      return format(new Date(dataString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return dataString;
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNovoSaldo(prev => ({
      ...prev,
      [name]: name === 'valor_total' || name === 'valor_pago' ? parseFloat(value) || 0 : value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setNovoSaldo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNovoSaldo = () => {
    setNovoSaldo({
      parceiro: '',
      contratos_associados: '',
      valor_total: 0,
      valor_pago: 0,
      vencimento: '',
      banco_pagamento: '',
      dados_bancarios: ''
    });
    setIsDialogOpen(true);
  };
  
  const handleSalvarSaldo = async () => {
    try {
      // Validação básica
      if (!novoSaldo.parceiro || !novoSaldo.valor_total) {
        toast.error('Por favor, preencha todos os campos obrigatórios');
        return;
      }
      
      const { error } = await supabase
        .from('Saldo a pagar')
        .insert({
          parceiro: novoSaldo.parceiro,
          contratos_associados: novoSaldo.contratos_associados,
          valor_total: novoSaldo.valor_total,
          valor_pago: novoSaldo.valor_pago,
          vencimento: novoSaldo.vencimento,
          banco_pagamento: novoSaldo.banco_pagamento,
          dados_bancarios: novoSaldo.dados_bancarios
        });
      
      if (error) {
        throw error;
      }
      
      toast.success('Saldo a pagar registrado com sucesso!');
      setIsDialogOpen(false);
      carregarSaldos();
    } catch (error) {
      console.error('Erro ao salvar saldo:', error);
      toast.error('Erro ao registrar saldo a pagar');
    }
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
      doc.text(`Data de geração: ${format(new Date(), 'dd/MM/yyyy', { locale: ptBR })}`, 105, 55, { align: 'center' });
      
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
      const pageCount = (doc as any).internal.pages.length;
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
          <div className="flex items-center gap-4">
            <DollarSign size={32} className="text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Saldo a Pagar</h1>
              <p className="text-gray-500 mt-1">Controle de valores a pagar aos parceiros</p>
            </div>
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
          
          <div className="grid grid-cols-1 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="parceiro">Parceiro</Label>
              <Input
                id="parceiro"
                name="parceiro"
                value={novoSaldo.parceiro}
                onChange={handleInputChange}
                placeholder="Nome do parceiro"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contratos_associados">Documento/Contrato</Label>
              <Input
                id="contratos_associados"
                name="contratos_associados"
                value={novoSaldo.contratos_associados}
                onChange={handleInputChange}
                placeholder="Número do documento ou contrato"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valor_total">Valor Total</Label>
                <Input
                  id="valor_total"
                  name="valor_total"
                  type="number"
                  step="0.01"
                  value={novoSaldo.valor_total}
                  onChange={handleInputChange}
                  placeholder="0,00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valor_pago">Valor Já Pago</Label>
                <Input
                  id="valor_pago"
                  name="valor_pago"
                  type="number"
                  step="0.01"
                  value={novoSaldo.valor_pago}
                  onChange={handleInputChange}
                  placeholder="0,00"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vencimento">Data de Vencimento</Label>
              <Input
                id="vencimento"
                name="vencimento"
                type="date"
                value={novoSaldo.vencimento}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="banco_pagamento">Banco para Pagamento</Label>
              <Input
                id="banco_pagamento"
                name="banco_pagamento"
                value={novoSaldo.banco_pagamento}
                onChange={handleInputChange}
                placeholder="Banco para realizar o pagamento"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dados_bancarios">Dados Bancários do Parceiro</Label>
              <Input
                id="dados_bancarios"
                name="dados_bancarios"
                value={novoSaldo.dados_bancarios}
                onChange={handleInputChange}
                placeholder="Agência, conta, etc."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSalvarSaldo}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default SaldoPagar;
