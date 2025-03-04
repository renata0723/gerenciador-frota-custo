
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FolderOpen, Printer, Calendar, DollarSign, BellRing, FileText, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { SaldoPagarItem } from '@/types/contabilidade';
import { limparSaldoAPagar } from '@/services/contabilidadeService';
import { formataMoeda } from '@/utils/constants';

const SaldoPagar = () => {
  const [saldos, setSaldos] = useState<SaldoPagarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detalheSaldo, setDetalheSaldo] = useState<SaldoPagarItem | null>(null);
  const [novoValorPago, setNovoValorPago] = useState(0);
  const [dataPagamento, setDataPagamento] = useState('');
  const [bancoPagamento, setBancoPagamento] = useState('');

  const fetchSaldos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Saldo a pagar')
        .select('*');
      
      if (error) throw error;
      console.log('Saldos carregados:', data);
      setSaldos(data || []);
    } catch (error) {
      console.error('Erro ao carregar saldos:', error);
      toast.error('Erro ao carregar saldos a pagar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaldos();
  }, []);

  const handleClearAllData = async () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados de saldo a pagar? Esta ação não pode ser desfeita.')) {
      try {
        const success = await limparSaldoAPagar();
        if (success) {
          toast.success('Todos os dados de saldo a pagar foram limpos com sucesso');
          setSaldos([]);
        } else {
          toast.error('Erro ao limpar dados de saldo a pagar');
        }
      } catch (error) {
        console.error('Erro ao limpar saldos:', error);
        toast.error('Erro ao limpar dados de saldo a pagar');
      }
    }
  };

  const handleEfetuarPagamento = async () => {
    if (!detalheSaldo) return;
    
    try {
      const valorPago = detalheSaldo.valor_pago ? detalheSaldo.valor_pago + novoValorPago : novoValorPago;
      const status = valorPago >= detalheSaldo.valor_total ? 'Pago' : 'Parcial';
      
      const { error } = await supabase
        .from('Saldo a pagar')
        .update({ 
          valor_pago: valorPago, 
          data_pagamento: dataPagamento || format(new Date(), 'yyyy-MM-dd'),
          banco_pagamento: bancoPagamento,
          status
        })
        .eq('id', detalheSaldo.id);
      
      if (error) throw error;
      
      toast.success('Pagamento registrado com sucesso');
      setDialogOpen(false);
      fetchSaldos();
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      toast.error('Erro ao registrar pagamento');
    }
  };

  const abrirDetalhes = (saldo: SaldoPagarItem) => {
    setDetalheSaldo(saldo);
    setNovoValorPago(saldo.valor_total - (saldo.valor_pago || 0));
    setDataPagamento(format(new Date(), 'yyyy-MM-dd'));
    setBancoPagamento('');
    setDialogOpen(true);
  };

  const filtrarSaldos = () => {
    if (filtroStatus === 'todos') return saldos;
    return saldos.filter(saldo => saldo.status === filtroStatus);
  };

  const TotalCard = ({ title, icon, value, color }: { title: string, icon: React.ReactNode, value: string, color: string }) => (
    <Card className={`p-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-white bg-opacity-30">
          {icon}
        </div>
      </div>
    </Card>
  );

  const totalGeral = saldos.reduce((acc, saldo) => acc + saldo.valor_total, 0);
  const totalPago = saldos.reduce((acc, saldo) => acc + (saldo.valor_pago || 0), 0);
  const totalPendente = totalGeral - totalPago;

  return (
    <PageLayout>
      <PageHeader
        title="Saldo a Pagar"
        description="Gerenciamento de valores a pagar para parceiros e fornecedores"
      />

      <div className="flex justify-between mb-6">
        <div>
          <Button variant="outline" className="flex items-center gap-2 mr-2">
            <Printer size={16} />
            Imprimir Relatório
          </Button>
        </div>
        <div>
          <Button variant="destructive" onClick={handleClearAllData} className="flex items-center gap-2">
            <Trash2 size={16} />
            Limpar Todos os Dados
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <TotalCard 
          title="Total a Pagar" 
          icon={<DollarSign size={24} className="text-blue-600" />} 
          value={formataMoeda(totalGeral)}
          color="bg-blue-50"
        />
        <TotalCard 
          title="Total Já Pago" 
          icon={<FileText size={24} className="text-green-600" />} 
          value={formataMoeda(totalPago)}
          color="bg-green-50"
        />
        <TotalCard 
          title="Saldo Pendente" 
          icon={<BellRing size={24} className="text-amber-600" />} 
          value={formataMoeda(totalPendente)}
          color="bg-amber-50"
        />
      </div>

      <Tabs defaultValue="todos" className="w-full" onValueChange={setFiltroStatus}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="Pendente">Pendentes</TabsTrigger>
          <TabsTrigger value="Pago">Pagos</TabsTrigger>
        </TabsList>

        <TabsContent value={filtroStatus} className="space-y-4">
          <Card className="p-6">
            {loading ? (
              <p className="text-center py-4">Carregando...</p>
            ) : filtrarSaldos().length === 0 ? (
              <div className="text-center py-8">
                <FolderOpen className="mx-auto h-10 w-10 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  {filtroStatus === 'todos' 
                    ? 'Nenhum saldo a pagar registrado' 
                    : filtroStatus === 'Pendente' 
                      ? 'Nenhum saldo pendente' 
                      : 'Nenhum pagamento registrado'}
                </h3>
                <p className="mt-1 text-gray-500">
                  Saldos a pagar são gerados automaticamente após os registros de canhotos
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parceiro</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contratos</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Total</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Pago</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filtrarSaldos().map((saldo) => (
                      <tr key={saldo.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">{saldo.parceiro}</td>
                        <td className="px-4 py-4">{saldo.contratos_associados}</td>
                        <td className="px-4 py-4 whitespace-nowrap">{formataMoeda(saldo.valor_total)}</td>
                        <td className="px-4 py-4 whitespace-nowrap">{formataMoeda(saldo.valor_pago || 0)}</td>
                        <td className="px-4 py-4 whitespace-nowrap">{formataMoeda((saldo.valor_total || 0) - (saldo.valor_pago || 0))}</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${saldo.status === 'Pago' ? 'bg-green-100 text-green-800' : 
                              saldo.status === 'Parcial' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}
                          >
                            {saldo.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => abrirDetalhes(saldo)}
                            disabled={saldo.status === 'Pago'}
                          >
                            <DollarSign size={16} className="mr-1" />
                            {saldo.status === 'Pendente' ? 'Pagar' : 'Complementar'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Registro de Pagamento</DialogTitle>
          </DialogHeader>
          
          {detalheSaldo && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 gap-4 items-center">
                <span className="text-sm font-medium col-span-1">Parceiro:</span>
                <span className="col-span-3">{detalheSaldo.parceiro}</span>
              </div>
              
              <div className="grid grid-cols-4 gap-4 items-center">
                <span className="text-sm font-medium col-span-1">Contratos:</span>
                <span className="col-span-3">{detalheSaldo.contratos_associados}</span>
              </div>
              
              <div className="grid grid-cols-4 gap-4 items-center">
                <span className="text-sm font-medium col-span-1">Valor Total:</span>
                <span className="col-span-3">{formataMoeda(detalheSaldo.valor_total)}</span>
              </div>
              
              <div className="grid grid-cols-4 gap-4 items-center">
                <span className="text-sm font-medium col-span-1">Já Pago:</span>
                <span className="col-span-3">{formataMoeda(detalheSaldo.valor_pago || 0)}</span>
              </div>
              
              <div className="grid grid-cols-4 gap-4 items-center">
                <span className="text-sm font-medium col-span-1">Saldo:</span>
                <span className="col-span-3 font-semibold text-amber-600">
                  {formataMoeda((detalheSaldo.valor_total || 0) - (detalheSaldo.valor_pago || 0))}
                </span>
              </div>
              
              <div className="space-y-2 pt-4 border-t">
                <Label htmlFor="valorPago">Valor a ser pago</Label>
                <Input
                  id="valorPago"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={(detalheSaldo.valor_total || 0) - (detalheSaldo.valor_pago || 0)}
                  value={novoValorPago}
                  onChange={(e) => setNovoValorPago(parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataPagamento">Data do Pagamento</Label>
                  <div className="flex">
                    <Calendar className="mr-2 h-4 w-4 opacity-50" />
                    <Input
                      id="dataPagamento"
                      type="date"
                      value={dataPagamento}
                      onChange={(e) => setDataPagamento(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bancoPagamento">Banco</Label>
                  <Select
                    value={bancoPagamento}
                    onValueChange={setBancoPagamento}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o banco" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bradesco">Bradesco</SelectItem>
                      <SelectItem value="Itaú">Itaú</SelectItem>
                      <SelectItem value="Banco do Brasil">Banco do Brasil</SelectItem>
                      <SelectItem value="Caixa">Caixa Econômica</SelectItem>
                      <SelectItem value="Santander">Santander</SelectItem>
                      <SelectItem value="Nubank">Nubank</SelectItem>
                      <SelectItem value="Inter">Banco Inter</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEfetuarPagamento}>
              Registrar Pagamento
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default SaldoPagar;
