
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { usePermissoes } from '@/hooks/usePermissoes';
import NewPageLayout from '@/components/layout/NewPageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import {
  CreditCard,
  DollarSign,
  Download,
  Plus,
  Search,
  Truck,
  User,
  Calendar,
  FileText,
  CheckCircle,
  Building,
  Banknote,
} from 'lucide-react';
import { gerarRelatorioSaldoPagar } from '@/utils/pdfGenerator';
import ContratosMultiSelect, { ContratoItem } from '@/components/saldo-pagar/ContratosMultiSelect';

const SaldoPagar = () => {
  const [saldos, setSaldos] = useState<any[]>([]);
  const [parceiros, setParceiros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalBaixaAberto, setModalBaixaAberto] = useState(false);
  const [modalNovoSaldoAberto, setModalNovoSaldoAberto] = useState(false);
  const [parceiroSelecionado, setParceiroSelecionado] = useState('');
  const [dataPagamento, setDataPagamento] = useState<Date | undefined>(new Date());
  const [bancoPagamento, setBancoPagamento] = useState('');
  const [busca, setBusca] = useState('');
  const [saldoAtual, setSaldoAtual] = useState<any>(null);
  const [valorPago, setValorPago] = useState('');
  const [contratosDisponiveis, setContratosDisponiveis] = useState<ContratoItem[]>([]);
  const [valorTotalContratos, setValorTotalContratos] = useState(0);
  
  const { podeVisualizar, podeEditar } = usePermissoes('saldo-pagar');

  useEffect(() => {
    if (podeVisualizar) {
      carregarDados();
    }
  }, [podeVisualizar]);
  
  useEffect(() => {
    calcularValorTotal();
  }, [contratosDisponiveis]);

  const carregarDados = async () => {
    setLoading(true);
    try {
      // Carregar saldos a pagar
      const { data: saldosData, error: saldosError } = await supabase
        .from('Saldo a pagar')
        .select('*')
        .order('id', { ascending: false });

      if (saldosError) throw saldosError;
      setSaldos(saldosData || []);

      // Carregar proprietários como parceiros
      const { data: proprietariosData, error: proprietariosError } = await supabase
        .from('Proprietarios')
        .select('nome, documento, dados_bancarios');

      if (proprietariosError) throw proprietariosError;
      setParceiros(proprietariosData || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Não foi possível carregar os dados');
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirBaixa = (saldo: any) => {
    setSaldoAtual(saldo);
    setValorPago(saldo.saldo_restante?.toString() || saldo.valor_total?.toString() || '');
    setDataPagamento(new Date());
    setBancoPagamento('');
    setModalBaixaAberto(true);
  };
  
  const handleAbrirNovoSaldo = () => {
    setParceiroSelecionado('');
    setContratosDisponiveis([]);
    setValorTotalContratos(0);
    setModalNovoSaldoAberto(true);
    carregarContratos('');
  };

  const handleConfirmarBaixa = async () => {
    if (!saldoAtual || !valorPago || !dataPagamento || !bancoPagamento) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const valorPagoNum = parseFloat(valorPago);
      
      const { error } = await supabase
        .from('Saldo a pagar')
        .update({
          valor_pago: valorPagoNum,
          data_pagamento: dataPagamento.toISOString().split('T')[0],
          banco_pagamento: bancoPagamento,
          saldo_restante: saldoAtual.valor_total - valorPagoNum
        })
        .eq('id', saldoAtual.id);

      if (error) throw error;

      toast.success('Pagamento registrado com sucesso');
      setModalBaixaAberto(false);
      carregarDados();
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      toast.error('Não foi possível registrar o pagamento');
    }
  };

  const handleSelecionarParceiro = (parceiroNome: string) => {
    setParceiroSelecionado(parceiroNome);
    carregarContratos(parceiroNome);
  };

  const carregarContratos = async (parceiro: string) => {
    if (!parceiro) {
      setContratosDisponiveis([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('Contratos')
        .select('*')
        .eq('proprietario', parceiro)
        .eq('status_contrato', 'Concluído')
        .not('id', 'in', `(${saldos.map(s => s.contratos_associados).filter(Boolean).join(',')})`);

      if (error) throw error;

      const contratosFormatados: ContratoItem[] = (data || []).map(contrato => ({
        id: String(contrato.id),
        cliente_destino: contrato.cliente_destino,
        valor_frete: contrato.valor_frete,
        status_contrato: contrato.status_contrato,
        selecionado: false
      }));

      setContratosDisponiveis(contratosFormatados);
    } catch (error) {
      console.error('Erro ao carregar contratos:', error);
      toast.error('Não foi possível carregar os contratos do parceiro');
    }
  };

  const handleToggleContrato = (contratoId: string) => {
    setContratosDisponiveis(prev => 
      prev.map(contrato => 
        contrato.id === contratoId 
          ? { ...contrato, selecionado: !contrato.selecionado }
          : contrato
      )
    );
  };
  
  const calcularValorTotal = () => {
    const total = contratosDisponiveis
      .filter(c => c.selecionado)
      .reduce((sum, contrato) => sum + contrato.valor_frete, 0);
    
    setValorTotalContratos(total);
  };

  const handleLimparSelecao = () => {
    setContratosDisponiveis(prev => 
      prev.map(contrato => ({ ...contrato, selecionado: false }))
    );
  };

  const handleSalvarNovoSaldo = async () => {
    if (!parceiroSelecionado) {
      toast.error('Selecione um parceiro');
      return;
    }

    const contratosSelecionados = contratosDisponiveis.filter(c => c.selecionado);
    if (contratosSelecionados.length === 0) {
      toast.error('Selecione pelo menos um contrato');
      return;
    }

    try {
      const parceiro = parceiros.find(p => p.nome === parceiroSelecionado);
      
      const novoSaldo = {
        parceiro: parceiroSelecionado,
        contratos_associados: contratosSelecionados.map(c => c.id).join(','),
        valor_total: valorTotalContratos,
        valor_pago: 0,
        saldo_restante: valorTotalContratos,
        vencimento: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
        dados_bancarios: parceiro?.dados_bancarios || ''
      };

      const { error } = await supabase
        .from('Saldo a pagar')
        .insert(novoSaldo);

      if (error) throw error;

      toast.success('Saldo a pagar registrado com sucesso');
      setModalNovoSaldoAberto(false);
      carregarDados();
    } catch (error) {
      console.error('Erro ao registrar saldo a pagar:', error);
      toast.error('Não foi possível registrar o saldo a pagar');
    }
  };

  const filtrarSaldos = () => {
    if (!busca) return saldos;
    
    const termoBusca = busca.toLowerCase();
    return saldos.filter(saldo => 
      saldo.parceiro.toLowerCase().includes(termoBusca) ||
      saldo.contratos_associados?.toLowerCase().includes(termoBusca) ||
      (saldo.banco_pagamento && saldo.banco_pagamento.toLowerCase().includes(termoBusca))
    );
  };

  const exportarPDF = () => {
    try {
      const dadosParaExportar = filtrarSaldos();
      gerarRelatorioSaldoPagar(dadosParaExportar);
      toast.success('Relatório gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar o relatório');
    }
  };

  if (!podeVisualizar) {
    return (
      <NewPageLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <FileText className="h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Acesso Restrito</h2>
          <p className="text-gray-600 text-center max-w-md">
            Você não tem permissão para visualizar este módulo. Entre em contato com o administrador.
          </p>
        </div>
      </NewPageLayout>
    );
  }

  return (
    <NewPageLayout>
      <PageHeader 
        title="Saldo a Pagar" 
        description="Gerencie os pagamentos a parceiros e motoristas"
        icon={<CreditCard size={26} className="text-green-500" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Saldo a Pagar' }
        ]}
        actions={
          podeEditar ? (
            <Button onClick={handleAbrirNovoSaldo}>
              <Plus size={16} className="mr-2" />
              Novo Saldo a Pagar
            </Button>
          ) : null
        }
      />

      <div className="mt-6 space-y-6">
        {/* Filtros e exportação */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por parceiro ou contrato..."
              className="pl-9"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={exportarPDF}
          >
            <Download size={16} />
            Exportar
          </Button>
        </div>

        {/* Lista de saldos a pagar */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Saldos a Pagar</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : filtrarSaldos().length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <DollarSign size={48} className="text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum saldo a pagar encontrado</h3>
                <p className="text-gray-500 max-w-md mb-4">
                  Não há saldos a pagar registrados que correspondam aos critérios de busca.
                </p>
                {podeEditar && (
                  <Button onClick={handleAbrirNovoSaldo}>
                    <Plus size={16} className="mr-2" />
                    Registrar Saldo a Pagar
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filtrarSaldos().map((saldo) => {
                  const valorRestante = saldo.valor_total - (saldo.valor_pago || 0);
                  const isPago = valorRestante <= 0;
                  
                  return (
                    <div 
                      key={saldo.id} 
                      className={`border rounded-lg p-4 ${isPago ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <User className="h-5 w-5 text-blue-500 mr-2" />
                            <h3 className="font-medium text-lg">{saldo.parceiro}</h3>
                            {isPago && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Pago
                              </span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 text-gray-400 mr-1.5" />
                              <span className="text-gray-500">Contratos: </span>
                              <span className="ml-1 font-medium">{saldo.contratos_associados || 'N/A'}</span>
                            </div>
                            
                            {saldo.vencimento && (
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 text-gray-400 mr-1.5" />
                                <span className="text-gray-500">Vencimento: </span>
                                <span className="ml-1 font-medium">{formatDate(saldo.vencimento)}</span>
                              </div>
                            )}
                            
                            {saldo.data_pagamento && (
                              <div className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-1.5" />
                                <span className="text-gray-500">Pago em: </span>
                                <span className="ml-1 font-medium">{formatDate(saldo.data_pagamento)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                            <div className="flex flex-col">
                              <span className="text-gray-500">Valor Total</span>
                              <span className="font-bold">{formatCurrency(saldo.valor_total)}</span>
                            </div>
                            
                            <div className="flex flex-col">
                              <span className="text-gray-500">Valor Pago</span>
                              <span className="font-bold text-green-600">
                                {formatCurrency(saldo.valor_pago || 0)}
                              </span>
                            </div>
                            
                            <div className="flex flex-col">
                              <span className="text-gray-500">Restante</span>
                              <span className={`font-bold ${isPago ? 'text-green-600' : 'text-amber-600'}`}>
                                {formatCurrency(valorRestante)}
                              </span>
                            </div>
                          </div>
                          
                          {podeEditar && !isPago && (
                            <Button 
                              variant="outline" 
                              className="whitespace-nowrap min-w-[120px]"
                              onClick={() => handleAbrirBaixa(saldo)}
                            >
                              Registrar Pagamento
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de Baixa de Pagamento */}
      <Dialog open={modalBaixaAberto} onOpenChange={setModalBaixaAberto}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Registrar Pagamento</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {saldoAtual && (
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md border border-gray-200">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="font-medium">{saldoAtual.parceiro}</span>
                  </div>
                  <span className="font-bold">{formatCurrency(saldoAtual.valor_total)}</span>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="valor-pago">Valor a ser pago</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="valor-pago"
                        placeholder="0,00"
                        type="number"
                        className="pl-9"
                        value={valorPago}
                        onChange={(e) => setValorPago(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="data-pagamento">Data do Pagamento</Label>
                    <DatePicker
                      date={dataPagamento}
                      setDate={setDataPagamento}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="banco-pagamento">Banco do Pagamento</Label>
                    <Select value={bancoPagamento} onValueChange={setBancoPagamento}>
                      <SelectTrigger id="banco-pagamento">
                        <SelectValue placeholder="Selecione o banco" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Banco do Brasil">Banco do Brasil</SelectItem>
                        <SelectItem value="Bradesco">Bradesco</SelectItem>
                        <SelectItem value="Caixa Econômica">Caixa Econômica</SelectItem>
                        <SelectItem value="Itaú">Itaú</SelectItem>
                        <SelectItem value="Santander">Santander</SelectItem>
                        <SelectItem value="Nubank">Nubank</SelectItem>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Sicoob">Sicoob</SelectItem>
                        <SelectItem value="Outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalBaixaAberto(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmarBaixa}>
              Confirmar Pagamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Novo Saldo a Pagar */}
      <Dialog open={modalNovoSaldoAberto} onOpenChange={setModalNovoSaldoAberto}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Novo Saldo a Pagar</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="parceiro">Selecione o Parceiro</Label>
              <Select value={parceiroSelecionado} onValueChange={handleSelecionarParceiro}>
                <SelectTrigger id="parceiro">
                  <SelectValue placeholder="Selecione um parceiro" />
                </SelectTrigger>
                <SelectContent>
                  {parceiros.map((parceiro) => (
                    <SelectItem key={parceiro.nome} value={parceiro.nome}>
                      {parceiro.nome} {parceiro.documento ? `(${parceiro.documento})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {parceiroSelecionado && (
              <ContratosMultiSelect
                contratos={contratosDisponiveis}
                onContratoToggle={handleToggleContrato}
                valorTotal={valorTotalContratos}
                onLimparSelecao={handleLimparSelecao}
              />
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalNovoSaldoAberto(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvarNovoSaldo} disabled={contratosDisponiveis.filter(c => c.selecionado).length === 0}>
              Salvar Saldo a Pagar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </NewPageLayout>
  );
};

export default SaldoPagar;
