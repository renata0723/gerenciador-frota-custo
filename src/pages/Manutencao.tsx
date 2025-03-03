
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
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
import { Wrench, Plus, Trash2, Calendar, CheckCircle2, Filter, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface ManutencaoItem {
  id: number;
  placa_veiculo: string;
  tipo_manutencao: 'preventiva' | 'corretiva';
  local_realizacao: 'patio' | 'externa';
  pecas_servicos: string;
  valor_total: number;
  data_manutencao: string;
}

const Manutencao = () => {
  const [manutencoes, setManutencoes] = useState<ManutencaoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('todas');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para novo registro de manutenção
  const [novaManutencao, setNovaManutencao] = useState<Partial<ManutencaoItem>>({
    tipo_manutencao: 'preventiva',
    local_realizacao: 'patio',
    placa_veiculo: '',
    pecas_servicos: '',
    valor_total: 0,
    data_manutencao: format(new Date(), 'yyyy-MM-dd')
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
      
      setManutencoes(data || []);
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
    
    try {
      const { error } = await supabase
        .from('Manutenção')
        .insert({
          placa_veiculo: novaManutencao.placa_veiculo,
          tipo_manutencao: novaManutencao.tipo_manutencao,
          local_realizacao: novaManutencao.local_realizacao,
          pecas_servicos: novaManutencao.pecas_servicos,
          valor_total: novaManutencao.valor_total,
          data_manutencao: novaManutencao.data_manutencao
        });
      
      if (error) {
        console.error('Erro ao salvar manutenção:', error);
        toast.error('Erro ao salvar registro de manutenção');
        return;
      }
      
      toast.success('Manutenção registrada com sucesso!');
      setDialogOpen(false);
      
      // Resetar formulário
      setNovaManutencao({
        tipo_manutencao: 'preventiva',
        local_realizacao: 'patio',
        placa_veiculo: '',
        pecas_servicos: '',
        valor_total: 0,
        data_manutencao: format(new Date(), 'yyyy-MM-dd')
      });
      
      // Recarregar dados
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
    <PageLayout>
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
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <tr>
                            <td colSpan={6} className="h-10 px-4 text-center">Carregando...</td>
                          </tr>
                        ) : manutencoesExibidas.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="h-10 px-4 text-center">Nenhum registro encontrado</td>
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
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <tr>
                            <td colSpan={5} className="h-10 px-4 text-center">Carregando...</td>
                          </tr>
                        ) : manutencoesExibidas.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="h-10 px-4 text-center">Nenhum registro encontrado</td>
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
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <tr>
                            <td colSpan={5} className="h-10 px-4 text-center">Carregando...</td>
                          </tr>
                        ) : manutencoesExibidas.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="h-10 px-4 text-center">Nenhum registro encontrado</td>
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
                  onValueChange={(value: 'preventiva' | 'corretiva') => setNovaManutencao({
                    ...novaManutencao, 
                    tipo_manutencao: value
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
                  onValueChange={(value: 'patio' | 'externa') => setNovaManutencao({
                    ...novaManutencao, 
                    local_realizacao: value
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
    </PageLayout>
  );
};

export default Manutencao;
