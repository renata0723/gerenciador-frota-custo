
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Calendar, 
  CreditCard, 
  DollarSign, 
  FileText, 
  Printer, 
  Search, 
  UserCheck, 
  FileDown 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { gerarRelatorioSaldoPagar } from '@/utils/pdfGenerator';

interface SaldoPagarItem {
  id?: number;
  parceiro?: string;
  contratos_associados?: string;
  valor_total?: number;
  valor_pago?: number;
  saldo_restante?: number;
  vencimento?: string | Date;
  data_pagamento?: string | Date;
  banco_pagamento?: string;
  dados_bancarios?: string;
}

interface ContratoItem {
  id: string;
  cliente_destino: string;
  valor_frete: number;
  status_contrato: string;
  selecionado?: boolean;
}

const SaldoPagar = () => {
  const [saldosPagar, setSaldosPagar] = useState<SaldoPagarItem[]>([]);
  const [contratosSelecionados, setContratosSelecionados] = useState<ContratoItem[]>([]);
  const [contratosDisponiveis, setContratosDisponiveis] = useState<ContratoItem[]>([]);
  const [valorTotalSelecionado, setValorTotalSelecionado] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [dialogPagamentoAberto, setDialogPagamentoAberto] = useState(false);
  const [saldoSelecionado, setSaldoSelecionado] = useState<SaldoPagarItem | null>(null);
  const [filtro, setFiltro] = useState('');
  const [proprietarioSelecionado, setProprietarioSelecionado] = useState('');
  const [proprietarios, setProprietarios] = useState<string[]>([]);
  const [bancos, setBancos] = useState([
    'Banco do Brasil',
    'Itaú',
    'Bradesco',
    'Caixa Econômica Federal',
    'Santander',
    'Nubank',
    'Inter',
    'Sicoob',
    'C6 Bank',
    'Original',
    'PicPay',
    'Outro'
  ]);
  
  const [novoPagamento, setNovoPagamento] = useState({
    valor: 0,
    data: new Date().toISOString().split('T')[0],
    banco: '',
    observacao: ''
  });

  useEffect(() => {
    carregarSaldosPagar();
    carregarProprietarios();
  }, []);

  const carregarSaldosPagar = async () => {
    setCarregando(true);
    try {
      const { data, error } = await supabase
        .from('Saldo a pagar')
        .select('*')
        .order('vencimento', { ascending: true });

      if (error) throw error;

      // Calcular o saldo restante para cada item
      const saldosCalculados = data.map(item => ({
        ...item,
        saldo_restante: (parseFloat(item.valor_total) || 0) - (parseFloat(item.valor_pago) || 0)
      }));

      setSaldosPagar(saldosCalculados);
    } catch (error) {
      console.error('Erro ao carregar saldos a pagar:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setCarregando(false);
    }
  };

  const carregarProprietarios = async () => {
    try {
      const { data, error } = await supabase
        .from('Proprietarios')
        .select('nome')
        .order('nome');

      if (error) throw error;

      setProprietarios(data.map(p => p.nome));
    } catch (error) {
      console.error('Erro ao carregar proprietários:', error);
    }
  };

  const carregarContratosPorProprietario = async (proprietario: string) => {
    try {
      const { data, error } = await supabase
        .from('Contratos')
        .select('id, cliente_destino, valor_frete, status_contrato')
        .eq('proprietario', proprietario)
        .eq('tipo_frota', 'terceiro')
        .order('id');

      if (error) throw error;

      const contratosComSelecao = data.map(contrato => ({
        ...contrato,
        selecionado: false
      }));

      setContratosDisponiveis(contratosComSelecao);
    } catch (error) {
      console.error('Erro ao carregar contratos:', error);
      toast.error('Erro ao carregar contratos');
    }
  };

  const handleNovoSaldo = () => {
    setProprietarioSelecionado('');
    setContratosSelecionados([]);
    setContratosDisponiveis([]);
    setValorTotalSelecionado(0);
    setDialogAberto(true);
  };

  const handleProprietarioChange = (valor: string) => {
    setProprietarioSelecionado(valor);
    carregarContratosPorProprietario(valor);
  };

  const handleSelecionarContrato = (id: string, checked: boolean) => {
    const novosContratos = contratosDisponiveis.map(contrato => 
      contrato.id === id 
        ? { ...contrato, selecionado: checked } 
        : contrato
    );
    
    setContratosDisponiveis(novosContratos);
    
    // Atualizar a lista de contratos selecionados
    const selecionados = novosContratos.filter(c => c.selecionado);
    setContratosSelecionados(selecionados);
    
    // Calcular o total
    const novoTotal = selecionados.reduce((total, contrato) => total + (contrato.valor_frete || 0), 0);
    setValorTotalSelecionado(novoTotal);
  };

  const handleSalvarSaldo = async () => {
    if (!proprietarioSelecionado) {
      toast.error('Selecione um proprietário');
      return;
    }

    if (contratosSelecionados.length === 0) {
      toast.error('Selecione pelo menos um contrato');
      return;
    }

    try {
      // IDs dos contratos selecionados
      const idsContratos = contratosSelecionados.map(c => c.id).join(', ');
      
      // Valor total dos contratos selecionados
      const valorTotal = contratosSelecionados.reduce(
        (total, contrato) => total + (contrato.valor_frete || 0), 0
      );

      // Inserir no banco de dados
      const { data, error } = await supabase
        .from('Saldo a pagar')
        .insert({
          parceiro: proprietarioSelecionado,
          contratos_associados: idsContratos,
          valor_total: valorTotal,
          vencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 dias a partir de hoje
          valor_pago: 0
        })
        .select();

      if (error) throw error;

      toast.success('Saldo a pagar registrado com sucesso!');
      setDialogAberto(false);
      carregarSaldosPagar();
    } catch (error) {
      console.error('Erro ao salvar saldo a pagar:', error);
      toast.error('Erro ao registrar saldo a pagar');
    }
  };

  const handleRegistrarPagamento = (saldo: SaldoPagarItem) => {
    setSaldoSelecionado(saldo);
    setNovoPagamento({
      valor: parseFloat((saldo.saldo_restante || 0).toFixed(2)),
      data: new Date().toISOString().split('T')[0],
      banco: '',
      observacao: ''
    });
    setDialogPagamentoAberto(true);
  };

  const handleSalvarPagamento = async () => {
    if (!saldoSelecionado) return;

    if (!novoPagamento.valor) {
      toast.error('Informe o valor do pagamento');
      return;
    }

    if (!novoPagamento.banco) {
      toast.error('Selecione o banco de pagamento');
      return;
    }

    try {
      // Calcular o novo valor pago (o que já estava + o valor atual)
      const valorPagoAnterior = parseFloat(saldoSelecionado.valor_pago?.toString() || '0');
      const novoValorPago = valorPagoAnterior + novoPagamento.valor;
      
      // Atualizar o registro no banco de dados
      const { error } = await supabase
        .from('Saldo a pagar')
        .update({
          valor_pago: novoValorPago,
          data_pagamento: novoPagamento.data,
          banco_pagamento: novoPagamento.banco
        })
        .eq('id', saldoSelecionado.id);

      if (error) throw error;

      toast.success('Pagamento registrado com sucesso!');
      setDialogPagamentoAberto(false);
      carregarSaldosPagar();
      
      // Registrar na contabilidade como saída de caixa
      try {
        await supabase
          .from('Lancamentos_Contabeis')
          .insert({
            data_lancamento: novoPagamento.data,
            data_competencia: novoPagamento.data,
            conta_debito: '2.1.1.01', // Exemplo: Fornecedores
            conta_credito: '1.1.1.01', // Exemplo: Caixa
            valor: novoPagamento.valor,
            historico: `Pagamento ao parceiro ${saldoSelecionado.parceiro} - Contratos: ${saldoSelecionado.contratos_associados}`,
            documento_referencia: `Contratos ${saldoSelecionado.contratos_associados}`,
            tipo_documento: 'PAG'
          });
        
        toast.success('Lançamento contábil de pagamento registrado automaticamente');
      } catch (error) {
        console.error('Erro ao registrar lançamento contábil:', error);
        toast.error('Erro ao registrar lançamento contábil');
      }
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      toast.error('Erro ao registrar pagamento');
    }
  };

  const handleGerarRelatorio = () => {
    gerarRelatorioSaldoPagar(saldosPagar);
    toast.success('Relatório de saldos a pagar gerado com sucesso!');
  };

  const saldosFiltrados = saldosPagar.filter(saldo => {
    const termoBusca = filtro.toLowerCase();
    return (
      (saldo.parceiro && saldo.parceiro.toLowerCase().includes(termoBusca)) ||
      (saldo.contratos_associados && saldo.contratos_associados.toLowerCase().includes(termoBusca)) ||
      (saldo.banco_pagamento && saldo.banco_pagamento.toLowerCase().includes(termoBusca))
    );
  });

  return (
    <PageLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saldo a Pagar</h1>
          <p className="text-gray-500">Gerencie os saldos a pagar aos parceiros</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleGerarRelatorio} className="flex items-center gap-2">
            <FileDown className="h-4 w-4" />
            Exportar Relatório
          </Button>
          <Button onClick={handleNovoSaldo}>
            <DollarSign className="mr-2 h-4 w-4" />
            Novo Saldo a Pagar
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por parceiro, contrato ou banco..."
              className="pl-10"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="todos">
        <TabsList className="mb-6">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
          <TabsTrigger value="pagos">Pagos</TabsTrigger>
        </TabsList>

        <TabsContent value="todos">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-blue-500" />
                Todos os Saldos a Pagar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parceiro</TableHead>
                      <TableHead>Contratos</TableHead>
                      <TableHead className="text-right">Valor Total</TableHead>
                      <TableHead className="text-right">Valor Pago</TableHead>
                      <TableHead className="text-right">Saldo Restante</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Pagamento</TableHead>
                      <TableHead>Banco</TableHead>
                      <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {carregando ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-4">
                          Carregando...
                        </TableCell>
                      </TableRow>
                    ) : saldosFiltrados.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-4">
                          Nenhum saldo a pagar encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      saldosFiltrados.map((saldo, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{saldo.parceiro}</TableCell>
                          <TableCell>
                            <span className="text-sm truncate max-w-xs block">
                              {saldo.contratos_associados}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(saldo.valor_total)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(saldo.valor_pago)}</TableCell>
                          <TableCell className="text-right font-medium">
                            <span className={
                              parseFloat((saldo.valor_total || 0) - (saldo.valor_pago || 0) + '') > 0 
                                ? "text-red-600" 
                                : "text-green-600"
                            }>
                              {formatCurrency(saldo.saldo_restante)}
                            </span>
                          </TableCell>
                          <TableCell>{formatDate(saldo.vencimento)}</TableCell>
                          <TableCell>{saldo.data_pagamento ? formatDate(saldo.data_pagamento) : '-'}</TableCell>
                          <TableCell>{saldo.banco_pagamento || '-'}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleRegistrarPagamento(saldo)}
                                disabled={(saldo.saldo_restante || 0) <= 0}
                              >
                                <CreditCard className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pendentes">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-yellow-500" />
                Saldos Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parceiro</TableHead>
                      <TableHead>Contratos</TableHead>
                      <TableHead className="text-right">Valor Total</TableHead>
                      <TableHead className="text-right">Valor Pago</TableHead>
                      <TableHead className="text-right">Saldo Restante</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {carregando ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          Carregando...
                        </TableCell>
                      </TableRow>
                    ) : (
                      saldosFiltrados
                        .filter(saldo => (parseFloat((saldo.valor_total || 0) - (saldo.valor_pago || 0) + '') > 0))
                        .map((saldo, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{saldo.parceiro}</TableCell>
                            <TableCell>
                              <span className="text-sm truncate max-w-xs block">
                                {saldo.contratos_associados}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(saldo.valor_total)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(saldo.valor_pago)}</TableCell>
                            <TableCell className="text-right font-medium text-red-600">
                              {formatCurrency(saldo.saldo_restante)}
                            </TableCell>
                            <TableCell>{formatDate(saldo.vencimento)}</TableCell>
                            <TableCell className="text-center">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleRegistrarPagamento(saldo)}
                              >
                                <CreditCard className="h-4 w-4 mr-2" />
                                Pagar
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pagos">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-green-500" />
                Saldos Pagos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parceiro</TableHead>
                      <TableHead>Contratos</TableHead>
                      <TableHead className="text-right">Valor Total</TableHead>
                      <TableHead>Data Pagamento</TableHead>
                      <TableHead>Banco</TableHead>
                      <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {carregando ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          Carregando...
                        </TableCell>
                      </TableRow>
                    ) : (
                      saldosFiltrados
                        .filter(saldo => (parseFloat((saldo.valor_total || 0) - (saldo.valor_pago || 0) + '') <= 0) && saldo.data_pagamento)
                        .map((saldo, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{saldo.parceiro}</TableCell>
                            <TableCell>
                              <span className="text-sm truncate max-w-xs block">
                                {saldo.contratos_associados}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(saldo.valor_total)}</TableCell>
                            <TableCell>{formatDate(saldo.data_pagamento)}</TableCell>
                            <TableCell>{saldo.banco_pagamento || '-'}</TableCell>
                            <TableCell className="text-center">
                              <Button variant="outline" size="sm">
                                <Printer className="h-4 w-4 mr-2" />
                                Comprovante
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para Novo Saldo a Pagar */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5" />
              Novo Saldo a Pagar
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="proprietario">Proprietário</Label>
              <Select
                value={proprietarioSelecionado}
                onValueChange={handleProprietarioChange}
              >
                <SelectTrigger id="proprietario">
                  <SelectValue placeholder="Selecione o proprietário" />
                </SelectTrigger>
                <SelectContent>
                  {proprietarios.map((prop) => (
                    <SelectItem key={prop} value={prop}>
                      {prop}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {contratosDisponiveis.length > 0 && (
              <div className="space-y-2">
                <Label>Contratos Disponíveis</Label>
                <Card className="p-2 max-h-60 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Sel.</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contratosDisponiveis.map((contrato) => (
                        <TableRow key={contrato.id}>
                          <TableCell>
                            <Checkbox 
                              checked={contrato.selecionado}
                              onCheckedChange={(checked) => 
                                handleSelecionarContrato(contrato.id, checked === true)
                              }
                            />
                          </TableCell>
                          <TableCell>{contrato.id}</TableCell>
                          <TableCell>{contrato.cliente_destino}</TableCell>
                          <TableCell className="text-right">{formatCurrency(contrato.valor_frete)}</TableCell>
                          <TableCell>{contrato.status_contrato}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            )}
            
            {contratosSelecionados.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Total Selecionado:</Label>
                  <span className="font-bold text-blue-700">{formatCurrency(valorTotalSelecionado)}</span>
                </div>
                <div className="flex justify-between">
                  <Label>Contratos Selecionados:</Label>
                  <span className="font-medium">{contratosSelecionados.length}</span>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDialogAberto(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSalvarSaldo}
              disabled={contratosSelecionados.length === 0}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Registrar Pagamento */}
      <Dialog open={dialogPagamentoAberto} onOpenChange={setDialogPagamentoAberto}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Registrar Pagamento
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {saldoSelecionado && (
              <>
                <div className="flex justify-between border-b pb-2 mb-4">
                  <span className="font-medium">Parceiro:</span>
                  <span>{saldoSelecionado.parceiro}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-sm text-gray-500">Valor Total</Label>
                    <p className="font-medium">{formatCurrency(saldoSelecionado.valor_total)}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Saldo a Pagar</Label>
                    <p className="font-medium text-red-600">{formatCurrency(saldoSelecionado.saldo_restante)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="valor">Valor do Pagamento</Label>
                    <Input
                      id="valor"
                      type="number"
                      step="0.01"
                      value={novoPagamento.valor}
                      onChange={(e) => setNovoPagamento({
                        ...novoPagamento,
                        valor: parseFloat(e.target.value)
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="data">Data do Pagamento</Label>
                    <Input
                      id="data"
                      type="date"
                      value={novoPagamento.data}
                      onChange={(e) => setNovoPagamento({
                        ...novoPagamento,
                        data: e.target.value
                      })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="banco">Banco</Label>
                  <Select
                    value={novoPagamento.banco}
                    onValueChange={(valor) => setNovoPagamento({
                      ...novoPagamento,
                      banco: valor
                    })}
                  >
                    <SelectTrigger id="banco">
                      <SelectValue placeholder="Selecione o banco" />
                    </SelectTrigger>
                    <SelectContent>
                      {bancos.map((banco) => (
                        <SelectItem key={banco} value={banco}>
                          {banco}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="observacao">Observação</Label>
                  <Input
                    id="observacao"
                    placeholder="Observações sobre o pagamento (opcional)"
                    value={novoPagamento.observacao}
                    onChange={(e) => setNovoPagamento({
                      ...novoPagamento,
                      observacao: e.target.value
                    })}
                  />
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDialogPagamentoAberto(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleSalvarPagamento}>
              Confirmar Pagamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default SaldoPagar;
