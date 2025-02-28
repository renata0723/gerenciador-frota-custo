
import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/ui/PageHeader';
import { Wallet, Search, Filter, Download, Calendar, ArrowDownCircle, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardCard from '@/components/dashboard/DashboardCard';
import { logOperation } from '@/utils/logOperations';
import { toast } from 'sonner';

// Interface para os dados de saldo a pagar
interface SaldoPagarItem {
  id: string;
  parceiro: string;
  documento: string;
  dataEmissao: string;
  dataVencimento: string;
  valorTotal: number;
  valorPago: number;
  saldoRestante: number;
  status: 'pendente' | 'parcial' | 'pago';
  contratos: string[];
  dadosBancarios?: {
    banco: string;
    agencia: string;
    conta: string;
    tipoConta: string;
    titular: string;
    cpfCnpj: string;
  };
}

// Dados iniciais para demonstração
const dadosIniciais: SaldoPagarItem[] = [
  {
    id: 'SP001',
    parceiro: 'Transportes Silva Ltda',
    documento: 'NF-87654',
    dataEmissao: '05/04/2023',
    dataVencimento: '05/05/2023',
    valorTotal: 12500.00,
    valorPago: 0,
    saldoRestante: 12500.00,
    status: 'pendente',
    contratos: ['CT-20230401', 'CT-20230405'],
    dadosBancarios: {
      banco: 'Banco do Brasil',
      agencia: '1234-5',
      conta: '12345-6',
      tipoConta: 'Corrente',
      titular: 'Transportes Silva Ltda',
      cpfCnpj: '12.345.678/0001-90'
    }
  },
  {
    id: 'SP002',
    parceiro: 'Express Transportadora',
    documento: 'NF-12345',
    dataEmissao: '10/04/2023',
    dataVencimento: '10/05/2023',
    valorTotal: 8750.00,
    valorPago: 4375.00,
    saldoRestante: 4375.00,
    status: 'parcial',
    contratos: ['CT-20230410'],
    dadosBancarios: {
      banco: 'Itaú',
      agencia: '4321-5',
      conta: '54321-6',
      tipoConta: 'Corrente',
      titular: 'Express Transportadora Ltda',
      cpfCnpj: '98.765.432/0001-10'
    }
  },
  {
    id: 'SP003',
    parceiro: 'Rodoviário Expresso',
    documento: 'NF-56789',
    dataEmissao: '15/04/2023',
    dataVencimento: '15/05/2023',
    valorTotal: 5250.00,
    valorPago: 5250.00,
    saldoRestante: 0,
    status: 'pago',
    contratos: ['CT-20230415', 'CT-20230418'],
    dadosBancarios: {
      banco: 'Bradesco',
      agencia: '7890-1',
      conta: '78901-2',
      tipoConta: 'Poupança',
      titular: 'Rodoviário Expresso S.A.',
      cpfCnpj: '45.678.901/0001-23'
    }
  },
  {
    id: 'SP004',
    parceiro: 'Transportadora Rápida',
    documento: 'NF-34567',
    dataEmissao: '20/04/2023',
    dataVencimento: '20/05/2023',
    valorTotal: 15800.00,
    valorPago: 0,
    saldoRestante: 15800.00,
    status: 'pendente',
    contratos: ['CT-20230420'],
    dadosBancarios: {
      banco: 'Santander',
      agencia: '2345-6',
      conta: '23456-7',
      tipoConta: 'Corrente',
      titular: 'Transportadora Rápida Ltda',
      cpfCnpj: '56.789.012/0001-34'
    }
  },
];

// Chave para armazenamento no localStorage
const STORAGE_KEY = 'controlfrota_saldo_pagar';

const SaldoPagar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<SaldoPagarItem[]>([]);
  const [saldoData, setSaldoData] = useState<SaldoPagarItem[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'todos' | 'pendentes' | 'pagos'>('todos');
  const [selectedItem, setSelectedItem] = useState<SaldoPagarItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      setSaldoData(JSON.parse(storedData));
    } else {
      // Se não existir dados no localStorage, usa os dados iniciais
      setSaldoData(dadosIniciais);
      // Salva os dados iniciais no localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dadosIniciais));
    }
    
    logOperation('SaldoPagar', 'Acessou página de Saldo a Pagar', false);
  }, []);
  
  // Filtrar dados com base no termo de busca e período selecionado
  useEffect(() => {
    let filtered = saldoData;
    
    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.parceiro.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.documento.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por período
    if (selectedPeriod === 'pendentes') {
      filtered = filtered.filter(item => item.status !== 'pago');
    } else if (selectedPeriod === 'pagos') {
      filtered = filtered.filter(item => item.status === 'pago');
    }
    
    setFilteredItems(filtered);
  }, [searchTerm, saldoData, selectedPeriod]);
  
  // Calcular totais
  const calcularTotais = () => {
    const totalPendente = saldoData
      .filter(item => item.status !== 'pago')
      .reduce((acc, item) => acc + item.saldoRestante, 0);
      
    const totalPago = saldoData
      .reduce((acc, item) => acc + item.valorPago, 0);
    
    return { totalPendente, totalPago };
  };
  
  const { totalPendente, totalPago } = calcularTotais();
  
  // Função para registrar pagamento
  const registrarPagamento = (id: string, valorPagamento: number, dataPagamento: string, banco: string) => {
    if (valorPagamento <= 0) {
      toast.error('O valor do pagamento deve ser maior que zero');
      return;
    }
    
    const updatedItems = saldoData.map(item => {
      if (item.id === id) {
        // Verificar se o valor do pagamento é válido
        if (valorPagamento > item.saldoRestante) {
          toast.error('O valor do pagamento não pode ser maior que o saldo restante');
          return item;
        }
        
        const novoValorPago = item.valorPago + valorPagamento;
        const novoSaldoRestante = item.valorTotal - novoValorPago;
        const novoStatus = novoSaldoRestante === 0 ? 'pago' : 'parcial';
        
        return {
          ...item,
          valorPago: novoValorPago,
          saldoRestante: novoSaldoRestante,
          status: novoStatus,
          dataPagamento,
          bancoPagamento: banco
        };
      }
      return item;
    });
    
    setSaldoData(updatedItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
    
    toast.success('Pagamento registrado com sucesso');
    setIsPaymentModalOpen(false);
    logOperation('SaldoPagar', `Registrou pagamento para ${id}`, true);
  };
  
  // Função para mostrar detalhes
  const handleShowDetails = (item: SaldoPagarItem) => {
    setSelectedItem(item);
    setIsDetailsModalOpen(true);
    logOperation('SaldoPagar', `Visualizou detalhes do parceiro ${item.parceiro}`, false);
  };
  
  // Função para mostrar modal de pagamento
  const handleShowPaymentModal = (item: SaldoPagarItem) => {
    setSelectedItem(item);
    setIsPaymentModalOpen(true);
    logOperation('SaldoPagar', `Iniciou registro de pagamento para ${item.parceiro}`, false);
  };
  
  return (
    <PageLayout>
      <PageHeader 
        title="Saldo a Pagar" 
        description="Gestão de pagamentos a parceiros e fornecedores"
        icon={<Wallet className="h-8 w-8 text-sistema-primary" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Saldo a Pagar' }
        ]}
        actions={
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center">
              <Filter size={16} className="mr-2" />
              Filtrar
            </Button>
            <Button variant="outline" className="flex items-center">
              <Download size={16} className="mr-2" />
              Exportar
            </Button>
          </div>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <DashboardCard title="Total Pendente">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            R$ {totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Valores em aberto para pagamento
          </div>
        </DashboardCard>
        
        <DashboardCard title="Total Pago">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            R$ {totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Valores já pagos aos parceiros
          </div>
        </DashboardCard>
        
        <DashboardCard title="Pagamentos do Mês">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {saldoData.filter(item => item.status === 'pago').length}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Pagamentos realizados no período
          </div>
        </DashboardCard>
      </div>
      
      <div className="bg-white dark:bg-sistema-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden mb-8">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <Input
                type="text"
                className="pl-10 w-full"
                placeholder="Buscar por parceiro ou documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant={selectedPeriod === 'todos' ? 'default' : 'outline'} 
                onClick={() => setSelectedPeriod('todos')}
                className={selectedPeriod === 'todos' ? 'bg-sistema-primary hover:bg-sistema-primary/90' : ''}
              >
                Todos
              </Button>
              <Button 
                variant={selectedPeriod === 'pendentes' ? 'default' : 'outline'} 
                onClick={() => setSelectedPeriod('pendentes')}
                className={selectedPeriod === 'pendentes' ? 'bg-sistema-primary hover:bg-sistema-primary/90' : ''}
              >
                Pendentes
              </Button>
              <Button 
                variant={selectedPeriod === 'pagos' ? 'default' : 'outline'} 
                onClick={() => setSelectedPeriod('pagos')}
                className={selectedPeriod === 'pagos' ? 'bg-sistema-primary hover:bg-sistema-primary/90' : ''}
              >
                Pagos
              </Button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
              <tr>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Parceiro</th>
                <th scope="col" className="px-6 py-3">Documento</th>
                <th scope="col" className="px-6 py-3">Data Vencimento</th>
                <th scope="col" className="px-6 py-3">Valor Total</th>
                <th scope="col" className="px-6 py-3">Valor Pago</th>
                <th scope="col" className="px-6 py-3">Saldo Restante</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.id}</td>
                    <td className="px-6 py-4">{item.parceiro}</td>
                    <td className="px-6 py-4">{item.documento}</td>
                    <td className="px-6 py-4">{item.dataVencimento}</td>
                    <td className="px-6 py-4">R$ {item.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4">R$ {item.valorPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4">R$ {item.saldoRestante.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.status === 'pago' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : item.status === 'parcial'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {item.status === 'pago' ? 'Pago' : item.status === 'parcial' ? 'Parcial' : 'Pendente'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button 
                          className="text-gray-500 hover:text-sistema-primary transition-colors duration-200" 
                          title="Ver detalhes"
                          onClick={() => handleShowDetails(item)}
                        >
                          <Search size={18} />
                        </button>
                        {item.status !== 'pago' && (
                          <button 
                            className="text-gray-500 hover:text-green-500 transition-colors duration-200" 
                            title="Registrar pagamento"
                            onClick={() => handleShowPaymentModal(item)}
                          >
                            <ArrowDownCircle size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <Wallet size={32} className="mb-2 text-gray-400" />
                      <p>Nenhum registro encontrado</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modal para visualização de detalhes (simplificado) */}
      {isDetailsModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-lg w-full">
            <div className="p-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                Detalhes do Parceiro
              </h3>
              
              <div className="grid gap-4">
                <div className="grid grid-cols-3 gap-4 items-center">
                  <span className="text-sm font-medium">Parceiro:</span>
                  <span className="col-span-2">{selectedItem.parceiro}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 items-center">
                  <span className="text-sm font-medium">Documento:</span>
                  <span className="col-span-2">{selectedItem.documento}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 items-center">
                  <span className="text-sm font-medium">Data Emissão:</span>
                  <span className="col-span-2">{selectedItem.dataEmissao}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 items-center">
                  <span className="text-sm font-medium">Vencimento:</span>
                  <span className="col-span-2">{selectedItem.dataVencimento}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 items-center">
                  <span className="text-sm font-medium">Valor Total:</span>
                  <span className="col-span-2">R$ {selectedItem.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 items-center">
                  <span className="text-sm font-medium">Saldo Restante:</span>
                  <span className="col-span-2">R$ {selectedItem.saldoRestante.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 items-center">
                  <span className="text-sm font-medium">Contratos:</span>
                  <span className="col-span-2">{selectedItem.contratos.join(', ')}</span>
                </div>
                
                {selectedItem.dadosBancarios && (
                  <>
                    <h4 className="text-md font-medium mt-4 col-span-3">Dados Bancários</h4>
                    
                    <div className="grid grid-cols-3 gap-4 items-center">
                      <span className="text-sm font-medium">Banco:</span>
                      <span className="col-span-2">{selectedItem.dadosBancarios.banco}</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 items-center">
                      <span className="text-sm font-medium">Agência:</span>
                      <span className="col-span-2">{selectedItem.dadosBancarios.agencia}</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 items-center">
                      <span className="text-sm font-medium">Conta:</span>
                      <span className="col-span-2">{selectedItem.dadosBancarios.conta} ({selectedItem.dadosBancarios.tipoConta})</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 items-center">
                      <span className="text-sm font-medium">Titular:</span>
                      <span className="col-span-2">{selectedItem.dadosBancarios.titular}</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 items-center">
                      <span className="text-sm font-medium">CPF/CNPJ:</span>
                      <span className="col-span-2">{selectedItem.dadosBancarios.cpfCnpj}</span>
                    </div>
                  </>
                )}
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setIsDetailsModalOpen(false)}>
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal para registro de pagamento (simplificado) */}
      {isPaymentModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-lg w-full">
            <div className="p-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                Registrar Pagamento
              </h3>
              
              <div className="grid gap-4">
                <div className="grid grid-cols-3 gap-4 items-center">
                  <span className="text-sm font-medium">Parceiro:</span>
                  <span className="col-span-2">{selectedItem.parceiro}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 items-center">
                  <span className="text-sm font-medium">Documento:</span>
                  <span className="col-span-2">{selectedItem.documento}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 items-center">
                  <span className="text-sm font-medium">Valor Pendente:</span>
                  <span className="col-span-2 text-red-600 dark:text-red-400">
                    R$ {selectedItem.saldoRestante.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 items-center">
                  <span className="text-sm font-medium">Valor a Pagar:</span>
                  <div className="col-span-2">
                    <Input 
                      type="number" 
                      id="valorPagamento"
                      placeholder="0,00"
                      defaultValue={selectedItem.saldoRestante.toString()}
                      max={selectedItem.saldoRestante}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 items-center">
                  <span className="text-sm font-medium">Data Pagamento:</span>
                  <div className="col-span-2">
                    <Input 
                      type="date" 
                      id="dataPagamento"
                      defaultValue={new Date().toISOString().slice(0, 10)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 items-center">
                  <span className="text-sm font-medium">Banco:</span>
                  <div className="col-span-2">
                    <select className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600">
                      <option value="Banco do Brasil">Banco do Brasil</option>
                      <option value="Itaú">Itaú</option>
                      <option value="Bradesco">Bradesco</option>
                      <option value="Santander">Santander</option>
                      <option value="Caixa">Caixa Econômica</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsPaymentModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={() => {
                    const valorPagamento = parseFloat((document.getElementById('valorPagamento') as HTMLInputElement).value);
                    const dataPagamento = (document.getElementById('dataPagamento') as HTMLInputElement).value;
                    registrarPagamento(selectedItem.id, valorPagamento, dataPagamento, 'Banco do Brasil');
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle size={16} className="mr-2" />
                  Confirmar Pagamento
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default SaldoPagar;
