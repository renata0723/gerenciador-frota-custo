import React, { useState, useEffect } from 'react';
import NewPageLayout from '@/components/layout/NewPageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Banknote, Calendar, DollarSign, Download, Edit2, Filter, Loader2, Search, Trash, UserCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { SaldoPagarItem } from '@/types/contabilidade';
import { supabase } from '@/integrations/supabase/client';

const SaldoPagar = () => {
  const [saldos, setSaldos] = useState<SaldoPagarItem[]>([]);
  const [filteredSaldos, setFilteredSaldos] = useState<SaldoPagarItem[]>([]);
  const [selectedContratos, setSelectedContratos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [editingSaldo, setEditingSaldo] = useState<SaldoPagarItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pagandoSaldo, setPagandoSaldo] = useState<SaldoPagarItem | null>(null);
  const [isPagamentoDialogOpen, setIsPagamentoDialogOpen] = useState(false);
  const [bancoSelecionado, setBancoSelecionado] = useState('');
  const [observacoesPagamento, setObservacoesPagamento] = useState('');

  const bancos = [
    { id: 'banco-brasil', nome: 'Banco do Brasil' },
    { id: 'caixa', nome: 'Caixa Econômica Federal' },
    { id: 'bradesco', nome: 'Bradesco' },
    { id: 'itau', nome: 'Itaú' },
    { id: 'santander', nome: 'Santander' },
    { id: 'nubank', nome: 'Nubank' },
    { id: 'inter', nome: 'Banco Inter' },
  ];

  useEffect(() => {
    carregarSaldos();
  }, []);

  useEffect(() => {
    filtrarSaldos();
  }, [saldos, searchTerm, statusFilter]);

  const carregarSaldos = async () => {
    setLoading(true);
    try {
      const dadosExemplo: SaldoPagarItem[] = [
        {
          id: 1,
          parceiro: 'Fornecedor A',
          valor_total: 1500,
          valor_pago: 500,
          saldo_restante: 1000,
          vencimento: '2024-05-10',
          status: 'pendente',
          observacoes: 'Pagamento parcial realizado'
        },
        {
          id: 2,
          parceiro: 'Fornecedor B',
          valor_total: 2500,
          valor_pago: 2500,
          saldo_restante: 0,
          vencimento: '2024-05-15',
          status: 'concluido',
          data_pagamento: '2024-05-15',
          banco_pagamento: 'Banco do Brasil',
          observacoes: 'Pagamento total'
        },
        {
          id: 3,
          parceiro: 'Fornecedor C',
          valor_total: 800,
          valor_pago: 0,
          saldo_restante: 800,
          vencimento: '2024-05-20',
          status: 'pendente'
        },
        {
          id: 4,
          parceiro: '',
          valor_total: 0,
          saldo_restante: 0,
          vencimento: '',
          status: 'pendente'
        },
        {
          id: 5,
          parceiro: '',
          valor_total: 0,
          saldo_restante: 0,
          vencimento: '',
          status: 'pendente'
        },
        {
          id: 6,
          parceiro: '',
          valor_total: 0,
          saldo_restante: 0,
          vencimento: '',
          status: 'pendente'
        },
        {
          id: 7,
          parceiro: '',
          valor_total: 0,
          saldo_restante: 0,
          vencimento: '',
          status: 'pendente'
        }
      ];
      
      setSaldos(dadosExemplo);
    } catch (error) {
      console.error('Erro ao carregar saldos a pagar:', error);
      toast.error('Erro ao carregar os saldos a pagar');
    } finally {
      setLoading(false);
    }
  };

  const filtrarSaldos = () => {
    let filtrados = [...saldos];
    
    if (searchTerm) {
      filtrados = filtrados.filter(saldo => 
        saldo.parceiro?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'todos') {
      filtrados = filtrados.filter(saldo => saldo.status === statusFilter);
    }
    
    setFilteredSaldos(filtrados);
  };

  const handleEditar = (saldo: SaldoPagarItem) => {
    setEditingSaldo(saldo);
    setIsDialogOpen(true);
  };

  const handleExcluir = (id: number) => {
    const confirmed = window.confirm('Tem certeza que deseja excluir este saldo a pagar?');
    if (confirmed) {
      setSaldos(saldos.filter(s => s.id !== id));
      toast.success('Saldo a pagar excluído com sucesso!');
    }
  };

  const handleRegistrarPagamento = (saldo: SaldoPagarItem) => {
    setPagandoSaldo(saldo);
    setBancoSelecionado('');
    setObservacoesPagamento('');
    setIsPagamentoDialogOpen(true);
  };

  const handleConfirmarPagamento = () => {
    if (!bancoSelecionado) {
      toast.error('Selecione o banco de pagamento');
      return;
    }
    
    const bancoPagamento = bancos.find(b => b.id === bancoSelecionado)?.nome || bancoSelecionado;
    
    setSaldos(saldos.map(s => {
      if (s.id === pagandoSaldo?.id) {
        return {
          ...s,
          status: 'concluido',
          data_pagamento: format(new Date(), 'yyyy-MM-dd'),
          banco_pagamento: bancoPagamento,
          valor_pago: s.valor_total,
          saldo_restante: 0,
          observacoes: observacoesPagamento || s.observacoes
        };
      }
      return s;
    }));
    
    setIsPagamentoDialogOpen(false);
    toast.success('Pagamento registrado com sucesso!');
  };

  const handleSelectContrato = (contratoId: string) => {
    setSelectedContratos(prev => {
      if (prev.includes(contratoId)) {
        return prev.filter(id => id !== contratoId);
      }
      return [...prev, contratoId];
    });
  };

  const calcularTotalSelecionado = () => {
    return selectedContratos.reduce((total, contratoId) => {
      const saldo = saldos.find(s => s.id?.toString() === contratoId);
      return total + (saldo?.saldo_restante || 0);
    }, 0);
  };

  const handleRegistrarPagamentoMultiplo = () => {
    if (!selectedContratos.length) {
      toast.error('Selecione pelo menos um contrato para pagamento');
      return;
    }

    setPagandoSaldo({
      id: 0,
      parceiro: saldos.find(s => s.id?.toString() === selectedContratos[0])?.parceiro || '',
      valor_total: calcularTotalSelecionado(),
      saldo_restante: calcularTotalSelecionado(),
      vencimento: new Date().toISOString().split('T')[0],
      contratos_associados: selectedContratos.join(',')
    });
    setIsPagamentoDialogOpen(true);
  };

  const formatarValor = (valor?: number) => {
    if (valor === undefined || valor === null) return 'R$ 0,00';
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
  };

  const formatarData = (dataString?: string) => {
    if (!dataString) return '';
    try {
      return format(parseISO(dataString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (e) {
      return dataString;
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    switch (status) {
      case 'pendente':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendente</Badge>;
      case 'concluido':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Pago</Badge>;
      case 'cancelado':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <NewPageLayout>
      <PageHeader 
        title="Saldo a Pagar" 
        description="Gerencie os saldos a pagar aos parceiros"
        icon={<DollarSign className="h-6 w-6 text-green-600" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Saldo a Pagar' }
        ]}
      />
      
      <Card className="mt-6">
        <CardHeader className="pb-0">
          <CardTitle>Lista de Saldos a Pagar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full sm:w-auto flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <Input
                type="text"
                className="pl-10"
                placeholder="Buscar por parceiro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pendente">Pendentes</SelectItem>
                  <SelectItem value="concluido">Pagos</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="gap-1 w-full sm:w-auto">
                <Filter size={16} className="mr-1" />
                Filtrar
              </Button>
              
              <Button variant="outline" className="gap-1 w-full sm:w-auto">
                <Download size={16} className="mr-1" />
                Exportar
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      Selecionar
                    </TableHead>
                    <TableHead>Parceiro</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Valor Pago</TableHead>
                    <TableHead>Saldo Restante</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSaldos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        Nenhum saldo a pagar encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSaldos.map((saldo) => (
                      <TableRow key={saldo.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedContratos.includes(saldo.id?.toString() || '')}
                            onCheckedChange={() => handleSelectContrato(saldo.id?.toString() || '')}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{saldo.parceiro || '-'}</TableCell>
                        <TableCell>{formatarValor(saldo.valor_total)}</TableCell>
                        <TableCell>{formatarValor(saldo.valor_pago)}</TableCell>
                        <TableCell>{formatarValor(saldo.saldo_restante)}</TableCell>
                        <TableCell>{formatarData(saldo.vencimento)}</TableCell>
                        <TableCell>{getStatusBadge(saldo.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {saldo.status === 'pendente' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleRegistrarPagamento(saldo)}
                              >
                                <Banknote className="h-4 w-4" />
                                <span className="sr-only">Pagar</span>
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-8 px-2"
                              onClick={() => handleEditar(saldo)}
                            >
                              <Edit2 className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleExcluir(saldo.id!)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end mb-4">
        {selectedContratos.length > 0 && (
          <Button 
            onClick={handleRegistrarPagamentoMultiplo}
            className="gap-2"
          >
            <Banknote className="h-4 w-4" />
            Pagar Selecionados ({selectedContratos.length})
          </Button>
        )}
      </div>

      <Dialog open={isPagamentoDialogOpen} onOpenChange={setIsPagamentoDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5 text-green-600" />
              Registrar Pagamento
            </DialogTitle>
            <DialogDescription>
              Preencha as informações do pagamento para {pagandoSaldo?.parceiro}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor Total</Label>
                <div className="p-2 border rounded-md bg-gray-50">
                  {formatarValor(pagandoSaldo?.valor_total)}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Data do Pagamento</Label>
                <div className="p-2 border rounded-md bg-gray-50 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  {format(new Date(), 'dd/MM/yyyy', { locale: ptBR })}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="banco">Banco de Pagamento</Label>
              <Select value={bancoSelecionado} onValueChange={setBancoSelecionado}>
                <SelectTrigger id="banco">
                  <SelectValue placeholder="Selecione o banco" />
                </SelectTrigger>
                <SelectContent>
                  {bancos.map((banco) => (
                    <SelectItem key={banco.id} value={banco.id}>
                      {banco.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações (opcional)</Label>
              <Input
                id="observacoes"
                placeholder="Digite observações sobre o pagamento"
                value={observacoesPagamento}
                onChange={(e) => setObservacoesPagamento(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPagamentoDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              className="gap-2" 
              onClick={handleConfirmarPagamento}
            >
              <UserCheck className="h-4 w-4" />
              Confirmar Pagamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </NewPageLayout>
  );
};

export default SaldoPagar;
