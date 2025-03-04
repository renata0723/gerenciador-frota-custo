
import React, { useState, useEffect } from 'react';
import NewPageLayout from '@/components/layout/NewPageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Search, 
  CreditCard, 
  FilePlus, 
  DollarSign, 
  FileSearch, 
  Download, 
  Printer
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { SaldoPagar, ParceiroInfo, PagamentoSaldo } from '@/types/saldoPagar';
import SaldosPendentesTabela from '@/components/saldo-pagar/SaldosPendentesTabela';
import DadosBancariosParceiro from '@/components/saldo-pagar/DadosBancariosParceiro';
import ContratosMultiSelect from '@/components/saldo-pagar/ContratosMultiSelect';
import FormularioPagamento from '@/components/saldo-pagar/FormularioPagamento';
import { formatCurrency } from '@/utils/formatters';
import { statusSaldoPagar } from '@/utils/constants';

const SaldoPagarPage = () => {
  const [saldos, setSaldos] = useState<(SaldoPagar & { selecionado: boolean })[]>([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [filteredSaldos, setFilteredSaldos] = useState<(SaldoPagar & { selecionado: boolean })[]>([]);
  const [activeTab, setActiveTab] = useState('pendentes');
  const [loading, setLoading] = useState(true);
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
  const [modalPagamentoAberto, setModalPagamentoAberto] = useState(false);
  const [saldoSelecionado, setSaldoSelecionado] = useState<SaldoPagar | null>(null);
  const [parceiroInfo, setParceiroInfo] = useState<ParceiroInfo | null>(null);
  const [contratos, setContratos] = useState<any[]>([]);
  
  useEffect(() => {
    carregarSaldos();
  }, []);
  
  useEffect(() => {
    // Filtra saldos com base no termo de busca e aba ativa
    const filtrar = () => {
      let filtrados = [...saldos];
      
      // Aplicar filtro de texto (nome do parceiro ou número do contrato)
      if (termoBusca) {
        const termoLowerCase = termoBusca.toLowerCase();
        filtrados = filtrados.filter(saldo => 
          saldo.parceiro.toLowerCase().includes(termoLowerCase) ||
          (saldo.contratos_associados && saldo.contratos_associados.toLowerCase().includes(termoLowerCase))
        );
      }
      
      // Aplicar filtro por status
      if (activeTab === 'pendentes') {
        filtrados = filtrados.filter(saldo => 
          saldo.status !== statusSaldoPagar.PAGO && 
          saldo.status !== statusSaldoPagar.CANCELADO
        );
      } else if (activeTab === 'pagos') {
        filtrados = filtrados.filter(saldo => saldo.status === statusSaldoPagar.PAGO);
      } else if (activeTab === 'cancelados') {
        filtrados = filtrados.filter(saldo => saldo.status === statusSaldoPagar.CANCELADO);
      }
      
      setFilteredSaldos(filtrados);
    };
    
    filtrar();
  }, [saldos, termoBusca, activeTab]);
  
  const carregarSaldos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Saldo a pagar')
        .select('*')
        .order('vencimento', { ascending: true });
        
      if (error) throw error;
      
      const saldosComSelecao = (data || []).map(saldo => ({
        ...saldo,
        selecionado: false
      }));
      
      setSaldos(saldosComSelecao);
    } catch (error) {
      console.error('Erro ao carregar saldos a pagar:', error);
      toast.error('Erro ao carregar saldos a pagar');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelecaoSaldo = (id: number) => {
    setSaldos(saldos.map(saldo => 
      saldo.id === id 
        ? { ...saldo, selecionado: !saldo.selecionado }
        : saldo
    ));
  };
  
  const handlePagarSelecionados = () => {
    const saldosSelecionados = saldos.filter(s => s.selecionado);
    if (saldosSelecionados.length === 0) {
      toast.error('Selecione pelo menos um saldo para pagar');
      return;
    }
    
    setModalPagamentoAberto(true);
  };
  
  const handleVerDetalhes = async (id: number) => {
    try {
      // Buscar detalhes do saldo
      const { data: saldoData, error: saldoError } = await supabase
        .from('Saldo a pagar')
        .select('*')
        .eq('id', id)
        .single();
        
      if (saldoError) throw saldoError;
      
      setSaldoSelecionado(saldoData);
      
      // Buscar dados do parceiro (proprietário)
      const { data: parceiroData, error: parceiroError } = await supabase
        .from('Proprietarios')
        .select('*')
        .eq('nome', saldoData.parceiro)
        .single();
        
      if (!parceiroError && parceiroData) {
        setParceiroInfo({
          ...parceiroData,
          dados_bancarios: parceiroData.dados_bancarios 
            ? JSON.parse(parceiroData.dados_bancarios)
            : null
        });
      } else {
        setParceiroInfo(null);
      }
      
      // Buscar contratos associados se houver
      if (saldoData.contratos_associados) {
        const contratoIds = saldoData.contratos_associados.split(',').map(id => id.trim());
        
        if (contratoIds.length > 0) {
          const { data: contratosData, error: contratosError } = await supabase
            .from('Contratos')
            .select('id, cliente_destino, valor_frete, status_contrato')
            .in('id', contratoIds.map(id => parseInt(id)));
            
          if (!contratosError && contratosData) {
            setContratos(contratosData.map(contrato => ({
              ...contrato,
              selecionado: true
            })));
          }
        }
      }
      
      setModalDetalhesAberto(true);
    } catch (error) {
      console.error('Erro ao carregar detalhes do saldo:', error);
      toast.error('Erro ao carregar detalhes do saldo');
    }
  };
  
  const handleCancelarSaldo = async (id: number) => {
    const confirmar = window.confirm('Tem certeza que deseja cancelar este saldo a pagar?');
    if (!confirmar) return;
    
    try {
      const { error } = await supabase
        .from('Saldo a pagar')
        .update({ status: 'cancelado' })
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success('Saldo cancelado com sucesso');
      carregarSaldos();
    } catch (error) {
      console.error('Erro ao cancelar saldo:', error);
      toast.error('Erro ao cancelar saldo');
    }
  };
  
  const handlePagamentoRealizado = async (pagamento: PagamentoSaldo) => {
    try {
      const saldosSelecionados = saldos.filter(s => s.selecionado);
      
      for (const saldo of saldosSelecionados) {
        const valorPagoAnterior = saldo.valor_pago || 0;
        const novoValorPago = valorPagoAnterior + pagamento.valor_pago;
        const saldoRestante = saldo.valor_total - novoValorPago;
        
        // Determinar o status baseado no valor pago
        const novoStatus = novoValorPago >= saldo.valor_total 
          ? statusSaldoPagar.PAGO 
          : statusSaldoPagar.LIBERADO;
        
        await supabase
          .from('Saldo a pagar')
          .update({
            valor_pago: novoValorPago,
            saldo_restante: saldoRestante > 0 ? saldoRestante : 0,
            data_pagamento: pagamento.data_pagamento,
            banco_pagamento: pagamento.banco_pagamento,
            status: novoStatus
          })
          .eq('id', saldo.id);
      }
      
      toast.success(`Pagamento de ${formatCurrency(pagamento.valor_pago)} registrado com sucesso para ${saldosSelecionados.length} saldo(s)`);
      await carregarSaldos();
      
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      toast.error('Erro ao registrar pagamento');
      throw error;
    }
  };
  
  const getSaldosPagamentoSelecionados = () => {
    return saldos.filter(s => s.selecionado);
  };
  
  const handleDownloadRelatorio = async () => {
    try {
      // Implementar geração de relatório
      toast.info('Gerando relatório...');
      
      // Implementar a lógica PDF aqui...
      
      toast.success('Relatório gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório');
    }
  };
  
  return (
    <NewPageLayout>
      <PageHeader 
        title="Saldo a Pagar" 
        description="Gerenciamento de saldos a pagar para parceiros e proprietários"
        icon={<CreditCard className="h-6 w-6 text-blue-500" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Financeiro' },
          { label: 'Saldo a Pagar' }
        ]}
        actions={
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={handleDownloadRelatorio}
            >
              <Printer size={16} />
              <span>Relatório</span>
            </Button>
            <Button className="gap-2">
              <FilePlus size={16} />
              <span>Novo Lançamento</span>
            </Button>
          </div>
        }
      />
      
      <div className="mt-6 space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  className="pl-8"
                  placeholder="Buscar por parceiro ou contrato..." 
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => setActiveTab('pendentes')}
                >
                  <FileSearch size={16} />
                  <span>Filtros</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={handleDownloadRelatorio}
                >
                  <Download size={16} />
                  <span>Exportar</span>
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="pendentes" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
                <TabsTrigger value="pagos">Pagos</TabsTrigger>
                <TabsTrigger value="cancelados">Cancelados</TabsTrigger>
                <TabsTrigger value="todos">Todos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pendentes">
                <SaldosPendentesTabela 
                  saldos={filteredSaldos}
                  onSelecionarSaldo={handleSelecaoSaldo}
                  onPagarSelecionados={handlePagarSelecionados}
                  onVerDetalhes={handleVerDetalhes}
                  onCancelarSaldo={handleCancelarSaldo}
                />
              </TabsContent>
              
              <TabsContent value="pagos">
                <SaldosPendentesTabela 
                  saldos={filteredSaldos}
                  onSelecionarSaldo={handleSelecaoSaldo}
                  onPagarSelecionados={handlePagarSelecionados}
                  onVerDetalhes={handleVerDetalhes}
                  onCancelarSaldo={handleCancelarSaldo}
                />
              </TabsContent>
              
              <TabsContent value="cancelados">
                <SaldosPendentesTabela 
                  saldos={filteredSaldos}
                  onSelecionarSaldo={handleSelecaoSaldo}
                  onPagarSelecionados={handlePagarSelecionados}
                  onVerDetalhes={handleVerDetalhes}
                  onCancelarSaldo={handleCancelarSaldo}
                />
              </TabsContent>
              
              <TabsContent value="todos">
                <SaldosPendentesTabela 
                  saldos={filteredSaldos}
                  onSelecionarSaldo={handleSelecaoSaldo}
                  onPagarSelecionados={handlePagarSelecionados}
                  onVerDetalhes={handleVerDetalhes}
                  onCancelarSaldo={handleCancelarSaldo}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Modal de Detalhes do Saldo */}
      <Dialog open={modalDetalhesAberto} onOpenChange={setModalDetalhesAberto}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-blue-500" />
              Detalhes do Saldo a Pagar
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-4">
              <DadosBancariosParceiro parceiro={parceiroInfo} />
            </div>
            
            <div className="space-y-4">
              <ContratosMultiSelect 
                contratos={contratos}
                onContratoToggle={() => {}}
                valorTotal={saldoSelecionado?.valor_total || 0}
                onLimparSelecao={() => {}}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Pagamento */}
      <FormularioPagamento 
        saldos={getSaldosPagamentoSelecionados()}
        onPagamentoRealizado={handlePagamentoRealizado}
        open={modalPagamentoAberto}
        onOpenChange={setModalPagamentoAberto}
      />
    </NewPageLayout>
  );
};

export default SaldoPagarPage;
