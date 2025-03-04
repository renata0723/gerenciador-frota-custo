
import React, { useEffect, useState } from 'react';
import NewPageLayout from '@/components/layout/NewPageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Search, DollarSign, RefreshCcw, ListFilter } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import SaldosPendentesTabela from '@/components/saldo-pagar/SaldosPendentesTabela';
import DadosBancariosParceiro from '@/components/saldo-pagar/DadosBancariosParceiro';
import FormularioPagamento from '@/components/saldo-pagar/FormularioPagamento';
import { ParceiroInfo, SaldoItem, SaldoPagar, PagamentoSaldo } from '@/types/saldoPagar';
import { statusSaldoPagar } from '@/utils/constants';

const SaldoPagarPage: React.FC = () => {
  const [saldosPendentes, setSaldosPendentes] = useState<SaldoItem[]>([]);
  const [saldosEfetuados, setSaldosEfetuados] = useState<SaldoItem[]>([]);
  const [modalPagamentoAberto, setModalPagamentoAberto] = useState(false);
  const [parceiroSelecionado, setParceiroSelecionado] = useState<ParceiroInfo>({ nome: '' });
  const [saldoSelecionado, setSaldoSelecionado] = useState<SaldoPagar | null>(null);
  const [loading, setLoading] = useState(true);
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');

  useEffect(() => {
    carregarSaldos();
  }, [filtroStatus]);

  const carregarSaldos = async () => {
    try {
      setLoading(true);
      
      let query = supabase.from('Saldo a pagar').select('*');
      
      // Aplicar filtro de status se necessário
      if (filtroStatus !== 'todos') {
        query = query.eq('status', filtroStatus);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Separar saldos pendentes e pagos
      const pendentes = data?.filter(saldo => 
        saldo.status !== statusSaldoPagar.PAGO && 
        saldo.status !== statusSaldoPagar.CANCELADO) || [];
      
      const pagos = data?.filter(saldo => 
        saldo.status === statusSaldoPagar.PAGO || 
        saldo.status === statusSaldoPagar.CANCELADO) || [];
      
      setSaldosPendentes(pendentes as SaldoItem[]);
      setSaldosEfetuados(pagos as SaldoItem[]);
    } catch (error) {
      console.error('Erro ao carregar saldos a pagar:', error);
      toast.error('Erro ao carregar dados de saldo a pagar');
    } finally {
      setLoading(false);
    }
  };

  const handleBusca = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermoBusca(e.target.value);
  };

  const buscarParceiro = async (nome: string) => {
    try {
      const { data, error } = await supabase
        .from('Proprietarios')
        .select('*')
        .eq('nome', nome)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setParceiroSelecionado({
          nome: data.nome,
          documento: data.documento,
          dadosBancarios: data.dadosBancarios
        });
      } else {
        setParceiroSelecionado({ nome });
      }
    } catch (error) {
      console.error('Erro ao buscar proprietário:', error);
    }
  };

  const abrirModalPagamento = async (saldo: SaldoItem) => {
    setSaldoSelecionado(saldo);
    await buscarParceiro(saldo.parceiro);
    setModalPagamentoAberto(true);
  };

  const registrarPagamento = async (pagamento: PagamentoSaldo) => {
    try {
      if (!saldoSelecionado) {
        toast.error('Nenhum saldo selecionado');
        return;
      }
      
      // Calcular novo saldo restante
      const valorPago = pagamento.valor;
      const saldoRestante = Number(saldoSelecionado.valor_total) - Number(saldoSelecionado.valor_pago || 0) - valorPago;
      
      // Determinar status baseado no saldo restante
      let novoStatus = statusSaldoPagar.PARCIAL;
      if (saldoRestante <= 0) {
        novoStatus = statusSaldoPagar.PAGO;
      }
      
      // Atualizar saldo a pagar
      const { error: updateError } = await supabase
        .from('Saldo a pagar')
        .update({
          valor_pago: (Number(saldoSelecionado.valor_pago || 0) + valorPago),
          saldo_restante: saldoRestante > 0 ? saldoRestante : 0,
          status: novoStatus,
          data_pagamento: pagamento.data_pagamento,
          banco_pagamento: pagamento.banco_pagamento
        })
        .eq('id', saldoSelecionado.id);
      
      if (updateError) throw updateError;
      
      // Registrar o pagamento
      const { error: insertError } = await supabase
        .from('Pagamentos_Saldo')
        .insert({
          saldo_id: saldoSelecionado.id,
          valor: valorPago,
          data_pagamento: pagamento.data_pagamento,
          metodo_pagamento: 'Transferência Bancária',
          banco_pagamento: pagamento.banco_pagamento,
          observacoes: `Pagamento de saldo para ${saldoSelecionado.parceiro}`,
          criado_em: new Date().toISOString()
        });
      
      if (insertError) throw insertError;
      
      toast.success('Pagamento registrado com sucesso!');
      setModalPagamentoAberto(false);
      carregarSaldos();
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      toast.error('Erro ao registrar pagamento');
    }
  };

  const cancelarSaldo = async (saldo: SaldoItem) => {
    try {
      const { error } = await supabase
        .from('Saldo a pagar')
        .update({
          status: statusSaldoPagar.CANCELADO
        })
        .eq('id', saldo.id);
      
      if (error) throw error;
      
      toast.success('Saldo cancelado com sucesso!');
      carregarSaldos();
    } catch (error) {
      console.error('Erro ao cancelar saldo:', error);
      toast.error('Erro ao cancelar saldo');
    }
  };

  const liberarSaldo = async (saldo: SaldoItem) => {
    try {
      const { error } = await supabase
        .from('Saldo a pagar')
        .update({
          status: statusSaldoPagar.LIBERADO
        })
        .eq('id', saldo.id);
      
      if (error) throw error;
      
      toast.success('Saldo liberado para pagamento!');
      carregarSaldos();
    } catch (error) {
      console.error('Erro ao liberar saldo:', error);
      toast.error('Erro ao liberar saldo');
    }
  };

  return (
    <NewPageLayout>
      <PageHeader
        title="Saldo a Pagar"
        description="Gestão dos saldos a pagar para parceiros"
        icon={<DollarSign className="h-6 w-6 text-blue-600" />}
      />
      
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar parceiro..."
            className="pl-8 h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            value={termoBusca}
            onChange={handleBusca}
          />
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFiltroStatus('todos')}
            className={filtroStatus === 'todos' ? 'bg-gray-100' : ''}
          >
            <ListFilter className="h-4 w-4 mr-2" />
            Todos
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFiltroStatus(statusSaldoPagar.PENDENTE)}
            className={filtroStatus === statusSaldoPagar.PENDENTE ? 'bg-gray-100' : ''}
          >
            Pendentes
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFiltroStatus(statusSaldoPagar.LIBERADO)}
            className={filtroStatus === statusSaldoPagar.LIBERADO ? 'bg-gray-100' : ''}
          >
            Liberados
          </Button>
          
          <Button variant="outline" size="sm" onClick={carregarSaldos}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="pendentes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pendentes">Saldos Pendentes</TabsTrigger>
          <TabsTrigger value="efetuados">Pagamentos Efetuados</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pendentes" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Saldos Pendentes de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <SaldosPendentesTabela
                saldos={saldosPendentes.filter(saldo => 
                  termoBusca.length === 0 || 
                  saldo.parceiro.toLowerCase().includes(termoBusca.toLowerCase())
                )}
                onPagar={abrirModalPagamento}
                onCancelar={cancelarSaldo}
                onLiberar={liberarSaldo}
                isLoading={loading}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="efetuados" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Pagamentos Efetuados</CardTitle>
            </CardHeader>
            <CardContent>
              <SaldosPendentesTabela
                saldos={saldosEfetuados.filter(saldo => 
                  termoBusca.length === 0 || 
                  saldo.parceiro.toLowerCase().includes(termoBusca.toLowerCase())
                )}
                onPagar={() => {}}
                onCancelar={() => {}}
                onLiberar={() => {}}
                isLoading={loading}
                somenteLeitura
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Modal de Pagamento */}
      <Dialog open={modalPagamentoAberto} onOpenChange={setModalPagamentoAberto}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Registrar Pagamento</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <DadosBancariosParceiro parceiro={parceiroSelecionado} />
            </div>
            
            <div>
              <FormularioPagamento
                saldo={saldoSelecionado}
                onSave={registrarPagamento}
                onCancel={() => setModalPagamentoAberto(false)}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </NewPageLayout>
  );
};

export default SaldoPagarPage;
