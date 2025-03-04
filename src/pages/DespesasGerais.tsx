
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, FileDown, Filter, DollarSign } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { formataMoeda } from '@/utils/constants';
import NovaDespesaForm from '@/components/despesas/NovaDespesaForm';
import { Despesa, TipoDespesa } from '@/types/despesa';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContaContabil } from '@/types/contabilidade';
import { contabilizarDespesa, getContasDespesa } from '@/services/contabilidadeService';

const DespesasGerais = () => {
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [contabilizacaoOpen, setContabilizacaoOpen] = useState(false);
  const [contasSelecionadas, setContasSelecionadas] = useState<Record<number, string>>({});
  const [despesaSelecionada, setDespesaSelecionada] = useState<Despesa | null>(null);
  const [contasContabeis, setContasContabeis] = useState<ContaContabil[]>([]);

  const fetchDespesas = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Despesas Gerais')
        .select('*');
      
      if (error) throw error;
      setDespesas(data || []);
    } catch (error) {
      console.error('Erro ao carregar despesas:', error);
      toast.error('Erro ao carregar despesas.');
    } finally {
      setLoading(false);
    }
  };

  const fetchContasContabeis = async () => {
    try {
      const contas = await getContasDespesa();
      setContasContabeis(contas);
    } catch (error) {
      console.error('Erro ao carregar contas contábeis:', error);
      toast.error('Erro ao carregar contas contábeis.');
    }
  };

  useEffect(() => {
    fetchDespesas();
    fetchContasContabeis();
  }, []);

  const handleDespesaAdicionada = () => {
    setFormOpen(false);
    fetchDespesas();
    toast.success('Despesa adicionada com sucesso!');
  };

  const abrirContabilizacao = (despesa: Despesa) => {
    setDespesaSelecionada(despesa);
    setContabilizacaoOpen(true);
  };

  const handleContabilizar = async () => {
    if (!despesaSelecionada || !contasSelecionadas[despesaSelecionada.id || 0]) {
      toast.error('Selecione uma conta contábil');
      return;
    }

    try {
      const sucesso = await contabilizarDespesa(
        despesaSelecionada.id || 0, 
        contasSelecionadas[despesaSelecionada.id || 0]
      );
      
      if (sucesso) {
        toast.success('Despesa contabilizada com sucesso!');
        setContabilizacaoOpen(false);
        fetchDespesas();
      } else {
        toast.error('Erro ao contabilizar despesa');
      }
    } catch (error) {
      console.error('Erro ao contabilizar despesa:', error);
      toast.error('Erro ao contabilizar despesa');
    }
  };

  const handleSelectConta = (conta: string) => {
    if (despesaSelecionada) {
      setContasSelecionadas({
        ...contasSelecionadas,
        [despesaSelecionada.id || 0]: conta
      });
    }
  };

  return (
    <PageLayout>
      <PageHeader
        title="Despesas Gerais"
        description="Gerencie todas as despesas da operação"
      />

      <div className="flex justify-between mb-6">
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <FileDown size={18} />
            Exportar
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={18} />
            Filtros
          </Button>
        </div>

        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={18} />
              Nova Despesa
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Nova Despesa</DialogTitle>
            </DialogHeader>
            <NovaDespesaForm onDespesaAdicionada={handleDespesaAdicionada} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="todas" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="viagem">Despesas de Viagem</TabsTrigger>
          <TabsTrigger value="administrativas">Despesas Administrativas</TabsTrigger>
        </TabsList>

        <TabsContent value="todas" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Todas as Despesas</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contabilizada</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center">Carregando...</td>
                    </tr>
                  ) : despesas.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center">Nenhuma despesa registrada</td>
                    </tr>
                  ) : (
                    despesas.map((despesa) => (
                      <tr key={despesa.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{format(new Date(despesa.data_despesa), 'dd/MM/yyyy')}</td>
                        <td className="px-6 py-4 whitespace-nowrap capitalize">{despesa.tipo_despesa}</td>
                        <td className="px-6 py-4">{despesa.descricao_detalhada}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{formataMoeda(despesa.valor_despesa)}</td>
                        <td className="px-6 py-4 whitespace-nowrap capitalize">{despesa.categoria || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {despesa.contabilizado ? (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Sim
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Não
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {!despesa.contabilizado && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => abrirContabilizacao(despesa)}
                              className="flex items-center gap-1"
                            >
                              <DollarSign size={14} />
                              Contabilizar
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="viagem">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Despesas de Viagem</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contabilizada</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center">Carregando...</td>
                    </tr>
                  ) : despesas.filter(d => d.categoria === 'viagem').length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center">Nenhuma despesa de viagem registrada</td>
                    </tr>
                  ) : (
                    despesas
                      .filter(d => d.categoria === 'viagem')
                      .map((despesa) => (
                        <tr key={despesa.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{format(new Date(despesa.data_despesa), 'dd/MM/yyyy')}</td>
                          <td className="px-6 py-4 whitespace-nowrap capitalize">{despesa.tipo_despesa}</td>
                          <td className="px-6 py-4">{despesa.descricao_detalhada}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{formataMoeda(despesa.valor_despesa)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {despesa.contabilizado ? (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Sim
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Não
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {!despesa.contabilizado && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => abrirContabilizacao(despesa)}
                                className="flex items-center gap-1"
                              >
                                <DollarSign size={14} />
                                Contabilizar
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="administrativas">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Despesas Administrativas</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contabilizada</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center">Carregando...</td>
                    </tr>
                  ) : despesas.filter(d => d.categoria === 'administrativa').length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center">Nenhuma despesa administrativa registrada</td>
                    </tr>
                  ) : (
                    despesas
                      .filter(d => d.categoria === 'administrativa')
                      .map((despesa) => (
                        <tr key={despesa.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{format(new Date(despesa.data_despesa), 'dd/MM/yyyy')}</td>
                          <td className="px-6 py-4 whitespace-nowrap capitalize">{despesa.tipo_despesa}</td>
                          <td className="px-6 py-4">{despesa.descricao_detalhada}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{formataMoeda(despesa.valor_despesa)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {despesa.contabilizado ? (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Sim
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Não
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {!despesa.contabilizado && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => abrirContabilizacao(despesa)}
                                className="flex items-center gap-1"
                              >
                                <DollarSign size={14} />
                                Contabilizar
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog para contabilização */}
      <Dialog open={contabilizacaoOpen} onOpenChange={setContabilizacaoOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Contabilizar Despesa</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 gap-4 items-center">
              <span className="text-sm font-medium col-span-1">Descrição:</span>
              <span className="col-span-3">{despesaSelecionada?.descricao_detalhada}</span>
            </div>
            
            <div className="grid grid-cols-4 gap-4 items-center">
              <span className="text-sm font-medium col-span-1">Valor:</span>
              <span className="col-span-3">{despesaSelecionada ? formataMoeda(despesaSelecionada.valor_despesa) : '-'}</span>
            </div>
            
            <div className="grid grid-cols-4 gap-4 items-center">
              <span className="text-sm font-medium col-span-1">Tipo:</span>
              <span className="col-span-3 capitalize">{despesaSelecionada?.tipo_despesa}</span>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Conta Contábil</label>
              <Select onValueChange={handleSelectConta}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a conta contábil" />
                </SelectTrigger>
                <SelectContent>
                  {contasContabeis.map(conta => (
                    <SelectItem key={conta.codigo} value={conta.codigo}>
                      {conta.codigo_reduzido} - {conta.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setContabilizacaoOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleContabilizar}>
              Contabilizar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default DespesasGerais;
