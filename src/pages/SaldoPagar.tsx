
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FileText, Download, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { logOperation } from '@/utils/logOperations';

// Define os tipos para o sistema
type TipoConta = 'corrente' | 'poupanca';

type DadosBancarios = {
  banco: string;
  agencia: string;
  conta: string;
  tipoConta: TipoConta;
  pix?: string;
};

type SaldoPagarItem = {
  id: string;
  parceiro: string;
  documento: string;
  dataEmissao: string;
  dataVencimento: string;
  valorTotal: number;
  valorPago: number;
  saldoRestante: number;
  status: 'pendente' | 'parcial' | 'pago';
  dataPagamento: string;
  bancoPagamento: string;
  contratos: string[];
  dadosBancarios?: DadosBancarios;
};

// Chave para armazenamento no localStorage
const STORAGE_KEY = 'controlfrota_saldo_pagar';

const SaldoPagar: React.FC = () => {
  const [saldoItems, setSaldoItems] = useState<SaldoPagarItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<SaldoPagarItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [isNewItemDialogOpen, setIsNewItemDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<SaldoPagarItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Novo item form state
  const [newItem, setNewItem] = useState({
    parceiro: '',
    documento: '',
    dataEmissao: '',
    dataVencimento: '',
    valorTotal: 0,
    contratos: [''],
    banco: '',
    agencia: '',
    conta: '',
    tipoConta: 'corrente' as TipoConta,
    pix: ''
  });

  // Payment form state
  const [payment, setPayment] = useState({
    valorPago: 0,
    dataPagamento: '',
    bancoPagamento: ''
  });

  // Carregar dados do localStorage ao inicializar
  useEffect(() => {
    const storedItems = localStorage.getItem(STORAGE_KEY);
    if (storedItems) {
      setSaldoItems(JSON.parse(storedItems));
    } else {
      // Dados simulados
      const dadosIniciais: SaldoPagarItem[] = [
        {
          id: 'SP-001',
          parceiro: 'Transportes Rápidos Ltda',
          documento: 'CT-12345',
          dataEmissao: '2023-10-15',
          dataVencimento: '2023-11-15',
          valorTotal: 5800.00,
          valorPago: 2000.00,
          saldoRestante: 3800.00,
          status: 'parcial',
          dataPagamento: '2023-10-20',
          bancoPagamento: 'Banco do Brasil',
          contratos: ['CONT-001', 'CONT-002'],
          dadosBancarios: {
            banco: 'Banco do Brasil',
            agencia: '1234',
            conta: '56789-0',
            tipoConta: 'corrente',
            pix: '11.222.333/0001-44'
          }
        },
        {
          id: 'SP-002',
          parceiro: 'Auto Diesel Transportadora',
          documento: 'CT-67890',
          dataEmissao: '2023-10-10',
          dataVencimento: '2023-11-10',
          valorTotal: 3200.00,
          valorPago: 3200.00,
          saldoRestante: 0,
          status: 'pago',
          dataPagamento: '2023-10-25',
          bancoPagamento: 'Itaú',
          contratos: ['CONT-003'],
          dadosBancarios: {
            banco: 'Itaú',
            agencia: '5678',
            conta: '12345-6',
            tipoConta: 'corrente'
          }
        },
        {
          id: 'SP-003',
          parceiro: 'Logística Estrada Real',
          documento: 'CT-54321',
          dataEmissao: '2023-10-20',
          dataVencimento: '2023-11-20',
          valorTotal: 7500.00,
          valorPago: 0,
          saldoRestante: 7500.00,
          status: 'pendente',
          dataPagamento: '',
          bancoPagamento: '',
          contratos: ['CONT-004', 'CONT-005', 'CONT-006'],
          dadosBancarios: {
            banco: 'Bradesco',
            agencia: '0123',
            conta: '78901-2',
            tipoConta: 'corrente',
            pix: 'contato@logisticareal.com.br'
          }
        }
      ];
      
      setSaldoItems(dadosIniciais);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dadosIniciais));
    }
  }, []);

  // Filtrar itens com base nos critérios de busca e status
  useEffect(() => {
    let filtered = [...saldoItems];
    
    // Aplicar filtro de busca
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.parceiro.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.documento.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.contratos.some(contrato => contrato.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Aplicar filtro de status
    if (filterStatus !== 'todos') {
      filtered = filtered.filter(item => item.status === filterStatus);
    }
    
    setFilteredItems(filtered);
  }, [saldoItems, searchTerm, filterStatus]);

  // Função para adicionar novo item
  const handleAddItem = () => {
    const id = `SP-${String(saldoItems.length + 1).padStart(3, '0')}`;
    
    const newSaldoItem: SaldoPagarItem = {
      id,
      parceiro: newItem.parceiro,
      documento: newItem.documento,
      dataEmissao: newItem.dataEmissao,
      dataVencimento: newItem.dataVencimento,
      valorTotal: Number(newItem.valorTotal),
      valorPago: 0,
      saldoRestante: Number(newItem.valorTotal),
      status: 'pendente',
      dataPagamento: '',
      bancoPagamento: '',
      contratos: newItem.contratos.filter(c => c.trim() !== ''),
      dadosBancarios: {
        banco: newItem.banco,
        agencia: newItem.agencia,
        conta: newItem.conta,
        tipoConta: newItem.tipoConta,
        pix: newItem.pix
      }
    };

    const updatedItems = [...saldoItems, newSaldoItem];
    setSaldoItems(updatedItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
    setIsNewItemDialogOpen(false);
    
    // Log da operação
    logOperation('Saldo a Pagar', `Adicionado novo item ${id} para ${newItem.parceiro}`);
    
    // Limpar formulário
    setNewItem({
      parceiro: '',
      documento: '',
      dataEmissao: '',
      dataVencimento: '',
      valorTotal: 0,
      contratos: [''],
      banco: '',
      agencia: '',
      conta: '',
      tipoConta: 'corrente',
      pix: ''
    });
  };

  // Registrar pagamento
  const handlePayment = () => {
    if (!currentItem) return;

    const valorPago = Number(payment.valorPago) + currentItem.valorPago;
    const saldoRestante = currentItem.valorTotal - valorPago;
    
    let status: 'pendente' | 'parcial' | 'pago';
    if (saldoRestante <= 0) {
      status = 'pago';
    } else if (valorPago > 0) {
      status = 'parcial';
    } else {
      status = 'pendente';
    }

    const updatedItem: SaldoPagarItem = {
      ...currentItem,
      valorPago,
      saldoRestante: Math.max(0, saldoRestante),
      status,
      dataPagamento: payment.dataPagamento,
      bancoPagamento: payment.bancoPagamento
    };

    const updatedItems = saldoItems.map(item => 
      item.id === currentItem.id ? updatedItem : item
    );

    setSaldoItems(updatedItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
    setIsPaymentDialogOpen(false);
    
    // Log da operação
    logOperation('Saldo a Pagar', `Registrado pagamento de R$ ${payment.valorPago.toFixed(2)} para ${currentItem.parceiro}`);
    
    // Limpar formulário
    setPayment({
      valorPago: 0,
      dataPagamento: '',
      bancoPagamento: ''
    });
  };

  // Obter os itens da página atual
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredItems.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Formatação de valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Formatação de datas
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Saldo a Pagar"
        description="Controle de valores a pagar aos parceiros"
        icon={<FileText className="h-6 w-6 text-sistema-primary" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Saldo a Pagar' }
        ]}
        actions={
          <Button onClick={() => setIsNewItemDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Novo Saldo
          </Button>
        }
      />

      <Card className="p-6">
        <Tabs defaultValue="lista" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="lista">Lista de Saldos</TabsTrigger>
            <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          </TabsList>
          
          <TabsContent value="lista" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Buscar por parceiro, documento ou contrato..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={filterStatus}
                onValueChange={(value) => setFilterStatus(value)}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="parcial">Parcial</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="md:w-auto">
                <Download className="mr-2 h-4 w-4" /> Exportar
              </Button>
            </div>
            
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50 dark:bg-gray-800">
                      <th className="px-4 py-3 text-left font-medium">ID</th>
                      <th className="px-4 py-3 text-left font-medium">Parceiro</th>
                      <th className="px-4 py-3 text-left font-medium">Documento</th>
                      <th className="px-4 py-3 text-left font-medium">Vencimento</th>
                      <th className="px-4 py-3 text-right font-medium">Valor Total</th>
                      <th className="px-4 py-3 text-right font-medium">Valor Pago</th>
                      <th className="px-4 py-3 text-right font-medium">Saldo</th>
                      <th className="px-4 py-3 text-center font-medium">Status</th>
                      <th className="px-4 py-3 text-center font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {getCurrentPageItems().length > 0 ? (
                      getCurrentPageItems().map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="px-4 py-3 text-left">{item.id}</td>
                          <td className="px-4 py-3 text-left">{item.parceiro}</td>
                          <td className="px-4 py-3 text-left">{item.documento}</td>
                          <td className="px-4 py-3 text-left">{formatDate(item.dataVencimento)}</td>
                          <td className="px-4 py-3 text-right">{formatCurrency(item.valorTotal)}</td>
                          <td className="px-4 py-3 text-right">{formatCurrency(item.valorPago)}</td>
                          <td className="px-4 py-3 text-right">{formatCurrency(item.saldoRestante)}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium
                              ${item.status === 'pago' ? 'bg-green-100 text-green-800' : 
                                item.status === 'parcial' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}`}>
                              {item.status === 'pago' ? 'Pago' : 
                               item.status === 'parcial' ? 'Parcial' : 'Pendente'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {item.status !== 'pago' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setCurrentItem(item);
                                  setIsPaymentDialogOpen(true);
                                }}
                              >
                                Pagar
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="px-4 py-6 text-center text-muted-foreground">
                          Nenhum saldo a pagar encontrado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Paginação */}
            {filteredItems.length > itemsPerPage && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-500">
                  Mostrando {Math.min(filteredItems.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(filteredItems.length, currentPage * itemsPerPage)} de {filteredItems.length} itens
                </p>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    // Lógica para mostrar 5 páginas por vez
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="relatorios" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Total Pendente</h3>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(
                    saldoItems
                      .filter(item => item.status !== 'pago')
                      .reduce((acc, item) => acc + item.saldoRestante, 0)
                  )}
                </p>
              </Card>
              
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Total Pago (Mês Atual)</h3>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(
                    saldoItems
                      .filter(item => {
                        if (!item.dataPagamento) return false;
                        const [year, month] = item.dataPagamento.split('-');
                        const now = new Date();
                        return parseInt(year) === now.getFullYear() && parseInt(month) === now.getMonth() + 1;
                      })
                      .reduce((acc, item) => acc + item.valorPago, 0)
                  )}
                </p>
              </Card>
              
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Saldos a Vencer (30 dias)</h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(
                    saldoItems
                      .filter(item => {
                        if (item.status === 'pago') return false;
                        const vencimento = new Date(item.dataVencimento);
                        const hoje = new Date();
                        const trintaDias = new Date();
                        trintaDias.setDate(hoje.getDate() + 30);
                        return vencimento >= hoje && vencimento <= trintaDias;
                      })
                      .reduce((acc, item) => acc + item.saldoRestante, 0)
                  )}
                </p>
              </Card>
            </div>
            
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Distribuição de Status</h3>
              <div className="flex items-center gap-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  {/* Barras de progresso para cada status */}
                  <div className="flex h-full rounded-full overflow-hidden">
                    {(() => {
                      const total = saldoItems.length;
                      const pendentes = saldoItems.filter(i => i.status === 'pendente').length;
                      const parciais = saldoItems.filter(i => i.status === 'parcial').length;
                      const pagos = saldoItems.filter(i => i.status === 'pago').length;
                      
                      return (
                        <>
                          <div 
                            className="bg-red-500 h-full" 
                            style={{ width: `${(pendentes / total) * 100}%` }}
                          />
                          <div 
                            className="bg-yellow-500 h-full" 
                            style={{ width: `${(parciais / total) * 100}%` }}
                          />
                          <div 
                            className="bg-green-500 h-full" 
                            style={{ width: `${(pagos / total) * 100}%` }}
                          />
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                  <span>Pendentes</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
                  <span>Parciais</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                  <span>Pagos</span>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
      
      {/* Diálogo para adicionar novo saldo a pagar */}
      <Dialog open={isNewItemDialogOpen} onOpenChange={setIsNewItemDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Saldo a Pagar</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-4">
              <h3 className="font-medium text-sm">Informações Principais</h3>
              
              <div className="space-y-2">
                <Label htmlFor="parceiro">Parceiro</Label>
                <Input 
                  id="parceiro" 
                  value={newItem.parceiro}
                  onChange={(e) => setNewItem({...newItem, parceiro: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="documento">Número do Documento</Label>
                <Input 
                  id="documento" 
                  value={newItem.documento}
                  onChange={(e) => setNewItem({...newItem, documento: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataEmissao">Data de Emissão</Label>
                  <Input 
                    id="dataEmissao" 
                    type="date"
                    value={newItem.dataEmissao}
                    onChange={(e) => setNewItem({...newItem, dataEmissao: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dataVencimento">Data de Vencimento</Label>
                  <Input 
                    id="dataVencimento" 
                    type="date"
                    value={newItem.dataVencimento}
                    onChange={(e) => setNewItem({...newItem, dataVencimento: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valorTotal">Valor Total</Label>
                <Input 
                  id="valorTotal" 
                  type="number"
                  min="0"
                  step="0.01"
                  value={newItem.valorTotal}
                  onChange={(e) => setNewItem({...newItem, valorTotal: parseFloat(e.target.value)})}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Contratos Associados</Label>
                {newItem.contratos.map((contrato, index) => (
                  <div key={index} className="flex gap-2">
                    <Input 
                      value={contrato}
                      onChange={(e) => {
                        const newContratos = [...newItem.contratos];
                        newContratos[index] = e.target.value;
                        setNewItem({...newItem, contratos: newContratos});
                      }}
                      placeholder="Número do contrato"
                    />
                    {index === newItem.contratos.length - 1 && (
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setNewItem({
                          ...newItem, 
                          contratos: [...newItem.contratos, '']
                        })}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-sm">Dados Bancários</h3>
              
              <div className="space-y-2">
                <Label htmlFor="banco">Banco</Label>
                <Input 
                  id="banco" 
                  value={newItem.banco}
                  onChange={(e) => setNewItem({...newItem, banco: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="agencia">Agência</Label>
                  <Input 
                    id="agencia" 
                    value={newItem.agencia}
                    onChange={(e) => setNewItem({...newItem, agencia: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="conta">Conta</Label>
                  <Input 
                    id="conta" 
                    value={newItem.conta}
                    onChange={(e) => setNewItem({...newItem, conta: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tipoConta">Tipo de Conta</Label>
                <Select 
                  value={newItem.tipoConta} 
                  onValueChange={(value: TipoConta) => 
                    setNewItem({
                      ...newItem, 
                      tipoConta: value
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corrente">Corrente</SelectItem>
                    <SelectItem value="poupanca">Poupança</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pix">Chave PIX</Label>
                <Input 
                  id="pix" 
                  value={newItem.pix}
                  onChange={(e) => setNewItem({...newItem, pix: e.target.value})}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsNewItemDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddItem}>
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo para registrar pagamento */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Pagamento</DialogTitle>
          </DialogHeader>
          
          {currentItem && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Parceiro:</div>
                <div>{currentItem.parceiro}</div>
                
                <div className="font-medium">Documento:</div>
                <div>{currentItem.documento}</div>
                
                <div className="font-medium">Valor Total:</div>
                <div>{formatCurrency(currentItem.valorTotal)}</div>
                
                <div className="font-medium">Valor Já Pago:</div>
                <div>{formatCurrency(currentItem.valorPago)}</div>
                
                <div className="font-medium">Saldo Restante:</div>
                <div className="font-bold text-red-600">{formatCurrency(currentItem.saldoRestante)}</div>
              </div>
              
              <div className="space-y-2 border-t pt-4">
                <Label htmlFor="valorPago">Valor a Pagar</Label>
                <Input 
                  id="valorPago" 
                  type="number"
                  min="0"
                  max={currentItem.saldoRestante}
                  step="0.01"
                  value={payment.valorPago}
                  onChange={(e) => setPayment({...payment, valorPago: parseFloat(e.target.value)})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dataPagamento">Data do Pagamento</Label>
                <Input 
                  id="dataPagamento" 
                  type="date"
                  value={payment.dataPagamento}
                  onChange={(e) => setPayment({...payment, dataPagamento: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bancoPagamento">Banco do Pagamento</Label>
                <Input 
                  id="bancoPagamento" 
                  value={payment.bancoPagamento}
                  onChange={(e) => setPayment({...payment, bancoPagamento: e.target.value})}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handlePayment}>
                  Confirmar Pagamento
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default SaldoPagar;
