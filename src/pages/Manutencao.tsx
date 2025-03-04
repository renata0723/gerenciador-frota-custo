
import React, { useState, useEffect } from 'react';
import NewPageLayout from '@/components/layout/NewPageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Wrench, Plus, Calendar, CheckCircle2, Search, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';

interface ManutencaoItem {
  id: number;
  placa_veiculo: string;
  tipo_manutencao: "preventiva" | "corretiva";
  local_realizacao: "patio" | "externa";
  pecas_servicos: string;
  valor_total: number;
  data_manutencao: string;
  contabilizado?: boolean;
  conta_contabil?: string;
}

const Manutencao = () => {
  const [manutencoes, setManutencoes] = useState<ManutencaoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('todas');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para novo registro de manutenção
  const [novaManutencao, setNovaManutencao] = useState<Partial<ManutencaoItem>>({
    tipo_manutencao: "preventiva",
    local_realizacao: "patio",
    placa_veiculo: '',
    pecas_servicos: '',
    valor_total: 0,
    data_manutencao: format(new Date(), 'yyyy-MM-dd'),
    contabilizado: false
  });
  
  // Carregar dados do Supabase
  const carregarManutencoes = async () => {
    setIsLoading(true);
    
    try {
      let query = supabase.from('Manutenção').select('*');
      
      // Filtrar por tipo se não for "todas"
      if (activeTab !== 'todas') {
        query = query.eq('tipo_manutencao', activeTab);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Erro ao carregar manutenções:', error);
        toast.error('Erro ao carregar dados de manutenção');
        return;
      }
      
      // Convertendo os dados para o tipo correto
      const manutencoesConvertidas = data?.map(item => ({
        ...item,
        tipo_manutencao: item.tipo_manutencao as "preventiva" | "corretiva",
        local_realizacao: item.local_realizacao as "patio" | "externa"
      })) || [];
      
      setManutencoes(manutencoesConvertidas);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Ocorreu um erro ao processar a solicitação');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Carregar dados ao montar o componente e quando a tab ativa mudar
  useEffect(() => {
    carregarManutencoes();
  }, [activeTab]);
  
  // Função para salvar nova manutenção
  const handleSaveManutencao = async () => {
    if (!novaManutencao.placa_veiculo) {
      toast.error('Por favor, informe a placa do veículo');
      return;
    }
    
    if (!novaManutencao.data_manutencao) {
      toast.error('Por favor, informe a data da manutenção');
      return;
    }
    
    if (!novaManutencao.valor_total || novaManutencao.valor_total <= 0) {
      toast.error('Por favor, informe um valor válido para a manutenção');
      return;
    }

    if (novaManutencao.contabilizado && !novaManutencao.conta_contabil) {
      toast.error('Por favor, informe a conta contábil para contabilização');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('Manutenção')
        .insert({
          placa_veiculo: novaManutencao.placa_veiculo,
          tipo_manutencao: novaManutencao.tipo_manutencao,
          local_realizacao: novaManutencao.local_realizacao,
          pecas_servicos: novaManutencao.pecas_servicos,
          valor_total: novaManutencao.valor_total,
          data_manutencao: novaManutencao.data_manutencao,
          contabilizado: novaManutencao.contabilizado,
          conta_contabil: novaManutencao.contabilizado ? novaManutencao.conta_contabil : null
        });
      
      if (error) {
        console.error('Erro ao salvar manutenção:', error);
        toast.error('Erro ao salvar registro de manutenção');
        return;
      }

      // Se for para contabilizar, criar lançamento contábil
      if (novaManutencao.contabilizado && novaManutencao.conta_contabil) {
        const { error: contabilError } = await supabase
          .from('Lancamentos_Contabeis')
          .insert({
            data_lancamento: novaManutencao.data_manutencao,
            data_competencia: novaManutencao.data_manutencao,
            conta_debito: novaManutencao.conta_contabil,
            conta_credito: '11201', // Conta padrão de caixa/banco
            valor: novaManutencao.valor_total,
            historico: `Manutenção ${novaManutencao.tipo_manutencao} - Veículo ${novaManutencao.placa_veiculo}`,
            documento_referencia: `Manutenção ${novaManutencao.tipo_manutencao} ${novaManutencao.local_realizacao}`,
            tipo_documento: 'MANUTENCAO',
            status: 'ativo'
          });

        if (contabilError) {
          console.error('Erro ao contabilizar manutenção:', contabilError);
          toast.error('Manutenção salva, mas houve erro na contabilização');
        } else {
          toast.success('Manutenção registrada e contabilizada com sucesso!');
        }
      } else {
        toast.success('Manutenção registrada com sucesso!');
      }
      
      setDialogOpen(false);
      
      // Resetar formulário
      setNovaManutencao({
        tipo_manutencao: "preventiva",
        local_realizacao: "patio",
        placa_veiculo: '',
        pecas_servicos: '',
        valor_total: 0,
        data_manutencao: format(new Date(), 'yyyy-MM-dd'),
        contabilizado: false,
        conta_contabil: ''
      });
      
      // Recarregar dados
      carregarManutencoes();
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Ocorreu um erro ao processar a solicitação');
    }
  };

  // Função para contabilizar uma manutenção existente
  const handleContabilizar = async (manutencao: ManutencaoItem) => {
    try {
      const { error } = await supabase
        .from('Lancamentos_Contabeis')
        .insert({
          data_lancamento: manutencao.data_manutencao,
          data_competencia: manutencao.data_manutencao,
          conta_debito: manutencao.conta_contabil || '31101', // Despesa de manutenção (exemplo)
          conta_credito: '11201', // Conta padrão de caixa/banco
          valor: manutencao.valor_total,
          historico: `Manutenção ${manutencao.tipo_manutencao} - Veículo ${manutencao.placa_veiculo}`,
          documento_referencia: `Manutenção ID: ${manutencao.id}`,
          tipo_documento: 'MANUTENCAO',
          status: 'ativo'
        });

      if (error) {
        console.error('Erro ao contabilizar manutenção:', error);
        toast.error('Erro ao contabilizar manutenção');
        return;
      }

      // Atualizar status de contabilização
      const { error: updateError } = await supabase
        .from('Manutenção')
        .update({ contabilizado: true })
        .eq('id', manutencao.id);

      if (updateError) {
        console.error('Erro ao atualizar status da manutenção:', updateError);
        toast.error('Erro ao atualizar status da manutenção');
        return;
      }

      toast.success('Manutenção contabilizada com sucesso!');
      carregarManutencoes();
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Ocorreu um erro ao processar a solicitação');
    }
  };
  
  // Filtrar por termo de busca
  const manutencoesExibidas = manutencoes.filter(item =>
    item.placa_veiculo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.pecas_servicos.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Formatar valor para exibição
  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  // Formatar data para exibição
  const formatarData = (dataString: string) => {
    if (!dataString) return '';
    try {
      const [ano, mes, dia] = dataString.split('-');
      return `${dia}/${mes}/${ano}`;
    } catch (error) {
      return dataString;
    }
  };

  return (
    <NewPageLayout>
      <PageHeader
        title="Manutenção de Veículos"
        description="Registro e acompanhamento de manutenções preventivas e corretivas"
        icon={<Wrench className="h-6 w-6" />}
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Manutenção
          </Button>
        }
      />
      
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <Tabs defaultValue="todas" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <TabsList>
                <TabsTrigger value="todas">Todas</TabsTrigger>
                <TabsTrigger value="preventiva">Preventivas</TabsTrigger>
                <TabsTrigger value="corretiva">Corretivas</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Buscar por placa ou descrição..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <TabsContent value="todas" className="mt-4">
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="h-10 px-4 text-left font-medium">Data</th>
                          <th className="h-10 px-4 text-left font-medium">Placa</th>
                          <th className="h-10 px-4 text-left font-medium">Tipo</th>
                          <th className="h-10 px-4 text-left font-medium">Local</th>
                          <th className="h-10 px-4 text-left font-medium">Descrição</th>
                          <th className="h-10 px-4 text-right font-medium">Valor</th>
                          <th className="h-10 px-4 text-center font-medium">Contabilizado</th>
                          <th className="h-10 px-4 text-center font-medium">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <tr>
                            <td colSpan={8} className="h-10 px-4 text-center">Carregando...</td>
                          </tr>
                        ) : manutencoesExibidas.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="h-10 px-4 text-center">Nenhum registro encontrado</td>
                          </tr>
                        ) : (
                          manutencoesExibidas.map((item) => (
                            <tr key={item.id} className="border-b">
                              <td className="p-2 px-4">{formatarData(item.data_manutencao)}</td>
                              <td className="p-2 px-4">{item.placa_veiculo}</td>
                              <td className="p-2 px-4">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  item.tipo_manutencao === 'preventiva' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {item.tipo_manutencao === 'preventiva' ? 'Preventiva' : 'Corretiva'}
                                </span>
                              </td>
                              <td className="p-2 px-4">
                                {item.local_realizacao === 'patio' ? 'No pátio' : 'Externa'}
                              </td>
                              <td className="p-2 px-4">
                                <div className="max-w-xs truncate" title={item.pecas_servicos}>
                                  {item.pecas_servicos}
                                </div>
                              </td>
                              <td className="p-2 px-4 text-right">{formatarValor(item.valor_total)}</td>
                              <td className="p-2 px-4 text-center">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  item.contabilizado 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {item.contabilizado ? 'Sim' : 'Não'}
                                </span>
                              </td>
                              <td className="p-2 px-4 text-center">
                                {!item.contabilizado && (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => handleContabilizar(item)}
                                    className="text-xs"
                                  >
                                    <FileText className="h-3 w-3 mr-1" />
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
              </CardContent>
            </TabsContent>
            
            <TabsContent value="preventiva" className="mt-4">
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="h-10 px-4 text-left font-medium">Data</th>
                          <th className="h-10 px-4 text-left font-medium">Placa</th>
                          <th className="h-10 px-4 text-left font-medium">Local</th>
                          <th className="h-10 px-4 text-left font-medium">Descrição</th>
                          <th className="h-10 px-4 text-right font-medium">Valor</th>
                          <th className="h-10 px-4 text-center font-medium">Contabilizado</th>
                          <th className="h-10 px-4 text-center font-medium">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <tr>
                            <td colSpan={7} className="h-10 px-4 text-center">Carregando...</td>
                          </tr>
                        ) : manutencoesExibidas.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="h-10 px-4 text-center">Nenhum registro encontrado</td>
                          </tr>
                        ) : (
                          manutencoesExibidas.map((item) => (
                            <tr key={item.id} className="border-b">
                              <td className="p-2 px-4">{formatarData(item.data_manutencao)}</td>
                              <td className="p-2 px-4">{item.placa_veiculo}</td>
                              <td className="p-2 px-4">
                                {item.local_realizacao === 'patio' ? 'No pátio' : 'Externa'}
                              </td>
                              <td className="p-2 px-4">
                                <div className="max-w-xs truncate" title={item.pecas_servicos}>
                                  {item.pecas_servicos}
                                </div>
                              </td>
                              <td className="p-2 px-4 text-right">{formatarValor(item.valor_total)}</td>
                              <td className="p-2 px-4 text-center">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  item.contabilizado 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {item.contabilizado ? 'Sim' : 'Não'}
                                </span>
                              </td>
                              <td className="p-2 px-4 text-center">
                                {!item.contabilizado && (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => handleContabilizar(item)}
                                    className="text-xs"
                                  >
                                    <FileText className="h-3 w-3 mr-1" />
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
              </CardContent>
            </TabsContent>
            
            <TabsContent value="corretiva" className="mt-4">
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="h-10 px-4 text-left font-medium">Data</th>
                          <th className="h-10 px-4 text-left font-medium">Placa</th>
                          <th className="h-10 px-4 text-left font-medium">Local</th>
                          <th className="h-10 px-4 text-left font-medium">Descrição</th>
                          <th className="h-10 px-4 text-right font-medium">Valor</th>
                          <th className="h-10 px-4 text-center font-medium">Contabilizado</th>
                          <th className="h-10 px-4 text-center font-medium">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <tr>
                            <td colSpan={7} className="h-10 px-4 text-center">Carregando...</td>
                          </tr>
                        ) : manutencoesExibidas.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="h-10 px-4 text-center">Nenhum registro encontrado</td>
                          </tr>
                        ) : (
                          manutencoesExibidas.map((item) => (
                            <tr key={item.id} className="border-b">
                              <td className="p-2 px-4">{formatarData(item.data_manutencao)}</td>
                              <td className="p-2 px-4">{item.placa_veiculo}</td>
                              <td className="p-2 px-4">
                                {item.local_realizacao === 'patio' ? 'No pátio' : 'Externa'}
                              </td>
                              <td className="p-2 px-4">
                                <div className="max-w-xs truncate" title={item.pecas_servicos}>
                                  {item.pecas_servicos}
                                </div>
                              </td>
                              <td className="p-2 px-4 text-right">{formatarValor(item.valor_total)}</td>
                              <td className="p-2 px-4 text-center">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  item.contabilizado 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {item.contabilizado ? 'Sim' : 'Não'}
                                </span>
                              </td>
                              <td className="p-2 px-4 text-center">
                                {!item.contabilizado && (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => handleContabilizar(item)}
                                    className="text-xs"
                                  >
                                    <FileText className="h-3 w-3 mr-1" />
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
              </CardContent>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
      
      {/* Diálogo para nova manutenção */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Registrar Nova Manutenção</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="placa_veiculo">Placa do Veículo</Label>
                <Input 
                  id="placa_veiculo" 
                  value={novaManutencao.placa_veiculo}
                  onChange={(e) => setNovaManutencao({...novaManutencao, placa_veiculo: e.target.value})}
                  placeholder="ABC-1234"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="data_manutencao">Data da Manutenção</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {novaManutencao.data_manutencao ? (
                        format(new Date(novaManutencao.data_manutencao), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                      ) : (
                        <span>Selecione a data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={novaManutencao.data_manutencao ? new Date(novaManutencao.data_manutencao) : undefined}
                      onSelect={(date) => date && setNovaManutencao({
                        ...novaManutencao, 
                        data_manutencao: format(date, 'yyyy-MM-dd')
                      })}
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo_manutencao">Tipo de Manutenção</Label>
                <Select 
                  value={novaManutencao.tipo_manutencao} 
                  onValueChange={(value) => setNovaManutencao({
                    ...novaManutencao, 
                    tipo_manutencao: value as "preventiva" | "corretiva"
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preventiva">Preventiva</SelectItem>
                    <SelectItem value="corretiva">Corretiva</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="local_realizacao">Local da Manutenção</Label>
                <Select 
                  value={novaManutencao.local_realizacao} 
                  onValueChange={(value) => setNovaManutencao({
                    ...novaManutencao, 
                    local_realizacao: value as "patio" | "externa"
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o local" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patio">No pátio</SelectItem>
                    <SelectItem value="externa">Externa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pecas_servicos">Peças e Serviços</Label>
              <Textarea 
                id="pecas_servicos" 
                value={novaManutencao.pecas_servicos}
                onChange={(e) => setNovaManutencao({...novaManutencao, pecas_servicos: e.target.value})}
                placeholder="Descreva as peças e serviços realizados"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="valor_total">Valor Total (R$)</Label>
              <Input 
                id="valor_total" 
                type="number"
                step="0.01"
                min="0"
                value={novaManutencao.valor_total}
                onChange={(e) => setNovaManutencao({
                  ...novaManutencao, 
                  valor_total: parseFloat(e.target.value) || 0
                })}
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="contabilizar"
                checked={novaManutencao.contabilizado}
                onCheckedChange={(checked) => setNovaManutencao({
                  ...novaManutencao,
                  contabilizado: checked
                })}
              />
              <Label htmlFor="contabilizar">Contabilizar automaticamente</Label>
            </div>

            {novaManutencao.contabilizado && (
              <div className="space-y-2">
                <Label htmlFor="conta_contabil">Conta Contábil para Débito</Label>
                <Input
                  id="conta_contabil"
                  placeholder="Código da conta contábil (Ex: 31101)"
                  value={novaManutencao.conta_contabil || ''}
                  onChange={(e) => setNovaManutencao({
                    ...novaManutencao,
                    conta_contabil: e.target.value
                  })}
                />
                <p className="text-xs text-gray-500 mt-1">
                  A conta de crédito será a conta de caixa/banco padrão (11201)
                </p>
              </div>
            )}
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveManutencao}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Salvar Manutenção
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </NewPageLayout>
  );
};

export default Manutencao;
