
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, FileDown, Plus, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formataMoeda, formataData } from '@/utils/constants';
import { SaldoPagarItem } from '@/types/contabilidade';
import { toast } from 'sonner';
import { limparSaldoAPagar } from '@/services/contabilidadeService';

const SaldoPagar = () => {
  const [saldoPagarItems, setSaldoPagarItems] = useState<SaldoPagarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pendentes');

  const fetchSaldoPagar = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Saldo a pagar')
        .select('*');
      
      if (error) throw error;
      
      // Convertemos os dados para o formato SaldoPagarItem
      const saldoItems: SaldoPagarItem[] = data.map(item => ({
        id: item.id,
        parceiro: item.parceiro || '',
        contratos_associados: item.contratos_associados || '',
        valor_total: item.valor_total || 0,
        valor_pago: item.valor_pago || 0,
        saldo_restante: item.valor_total - (item.valor_pago || 0),
        data_pagamento: item.data_pagamento,
        status: item.valor_pago === item.valor_total ? 'Pago' : 
               (item.valor_pago && item.valor_pago > 0) ? 'Parcial' : 'Pendente',
        banco_pagamento: item.banco_pagamento,
        dados_bancarios: item.dados_bancarios,
        vencimento: item.vencimento
      }));
      
      setSaldoPagarItems(saldoItems);
    } catch (error) {
      console.error('Erro ao carregar saldo a pagar:', error);
      toast.error('Erro ao carregar dados de saldo a pagar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaldoPagar();
  }, []);

  const clearSaldoPagar = async () => {
    if (confirm('Tem certeza que deseja limpar todos os registros de Saldo a Pagar? Esta ação não pode ser desfeita.')) {
      try {
        setLoading(true);
        const success = await limparSaldoAPagar();
        if (success) {
          toast.success('Todos os registros de Saldo a Pagar foram removidos com sucesso');
          setSaldoPagarItems([]);
        } else {
          toast.error('Erro ao limpar registros de Saldo a Pagar');
        }
      } catch (error) {
        console.error('Erro ao limpar saldo a pagar:', error);
        toast.error('Erro ao limpar registros');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <PageLayout>
      <div className="w-full">
        <PageHeader
          title="Saldo a Pagar"
          description="Gestão de pagamentos pendentes a parceiros"
        />
        
        <div className="flex justify-between mb-6">
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <FileDown size={18} />
              Exportar
            </Button>
            <Button 
              variant="destructive" 
              className="flex items-center gap-2"
              onClick={clearSaldoPagar}
              disabled={loading || saldoPagarItems.length === 0}
            >
              Limpar Todos os Registros
            </Button>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={18} />
                Novo Saldo a Pagar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Novo Saldo a Pagar</DialogTitle>
              </DialogHeader>
              {/* Formulário para adicionar novo saldo a pagar */}
              <div>
                <p>Formulário para adicionar saldo a pagar será implementado aqui</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
            <TabsTrigger value="parciais">Pagamentos Parciais</TabsTrigger>
            <TabsTrigger value="pagos">Pagos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pendentes" className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow w-full">
              <h2 className="text-xl font-semibold mb-4">Saldos Pendentes</h2>
              
              {loading ? (
                <p className="text-center py-4">Carregando...</p>
              ) : saldoPagarItems.filter(item => item.status === 'Pendente').length === 0 ? (
                <p className="text-center py-4">Nenhum saldo pendente encontrado</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parceiro</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contratos Associados</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimento</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {saldoPagarItems
                        .filter(item => item.status === 'Pendente')
                        .map((item) => (
                          <tr key={`${item.id}`}>
                            <td className="px-6 py-4 whitespace-nowrap">{item.parceiro}</td>
                            <td className="px-6 py-4">{item.contratos_associados}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{formataMoeda(item.valor_total)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item.vencimento ? formataData(item.vencimento) : 'Não definido'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm" className="flex items-center gap-1">
                                  <Clock size={14} />
                                  Programar
                                </Button>
                                <Button variant="outline" size="sm" className="flex items-center gap-1">
                                  <Calendar size={14} />
                                  Pagar
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="parciais" className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Pagamentos Parciais</h2>
              
              {loading ? (
                <p className="text-center py-4">Carregando...</p>
              ) : saldoPagarItems.filter(item => item.status === 'Parcial').length === 0 ? (
                <p className="text-center py-4">Nenhum pagamento parcial encontrado</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parceiro</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contratos</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Pago</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo Restante</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {saldoPagarItems
                        .filter(item => item.status === 'Parcial')
                        .map((item) => (
                          <tr key={`${item.id}`}>
                            <td className="px-6 py-4 whitespace-nowrap">{item.parceiro}</td>
                            <td className="px-6 py-4">{item.contratos_associados}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{formataMoeda(item.valor_total)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{formataMoeda(item.valor_pago || 0)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{formataMoeda(item.saldo_restante || 0)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Button variant="outline" size="sm" className="flex items-center gap-1">
                                <Calendar size={14} />
                                Finalizar
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
          
          <TabsContent value="pagos" className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Pagamentos Concluídos</h2>
              
              {loading ? (
                <p className="text-center py-4">Carregando...</p>
              ) : saldoPagarItems.filter(item => item.status === 'Pago').length === 0 ? (
                <p className="text-center py-4">Nenhum pagamento concluído encontrado</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parceiro</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contratos</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Pagamento</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Banco</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {saldoPagarItems
                        .filter(item => item.status === 'Pago')
                        .map((item) => (
                          <tr key={`${item.id}`}>
                            <td className="px-6 py-4 whitespace-nowrap">{item.parceiro}</td>
                            <td className="px-6 py-4">{item.contratos_associados}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{formataMoeda(item.valor_total)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item.data_pagamento ? formataData(item.data_pagamento) : 'Não definido'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.banco_pagamento || 'Não definido'}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Pendente</CardTitle>
            <CardDescription>Valor total a ser pago</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formataMoeda(
                saldoPagarItems
                  .filter(item => item.status !== 'Pago')
                  .reduce((acc, item) => acc + (item.saldo_restante || 0), 0)
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pagamentos Pendentes</CardTitle>
            <CardDescription>Quantidade de parceiros a pagar</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {saldoPagarItems.filter(item => item.status !== 'Pago').length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Pago (Mês)</CardTitle>
            <CardDescription>Valor pago no mês corrente</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formataMoeda(
                saldoPagarItems
                  .filter(item => {
                    if (!item.data_pagamento || item.status !== 'Pago') return false;
                    const dataAtual = new Date();
                    const dataPagamento = new Date(item.data_pagamento);
                    return dataPagamento.getMonth() === dataAtual.getMonth() && 
                           dataPagamento.getFullYear() === dataAtual.getFullYear();
                  })
                  .reduce((acc, item) => acc + item.valor_total, 0)
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default SaldoPagar;
