
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/ui/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NovaDespesaForm from '@/components/despesas/NovaDespesaForm';
import { DespesaFormData, Despesa } from '@/types/despesa';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { logOperation } from '@/utils/logOperations';

const DespesasGerais = () => {
  const navigate = useNavigate();
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Filtros
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todos');
  const [filtroData, setFiltroData] = useState<string>('');
  
  useEffect(() => {
    carregarDespesas();
  }, []);
  
  const carregarDespesas = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Despesas Gerais')
        .select('*')
        .order('data_despesa', { ascending: false });
        
      if (error) {
        console.error('Erro ao carregar despesas:', error);
        toast.error('Erro ao carregar despesas');
        return;
      }
      
      setDespesas(data || []);
    } catch (error) {
      console.error('Erro ao processar dados de despesas:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveDespesa = async (data: DespesaFormData) => {
    try {
      // Transformar os dados para o formato da tabela
      const despesaData: Despesa = {
        data_despesa: data.data,
        tipo_despesa: data.tipo,
        descricao_detalhada: data.descricao,
        valor_despesa: data.valor,
        contrato_id: data.categoria === 'viagem' ? data.contrato : null,
        categoria: data.categoria,
        rateio: data.categoria === 'administrativa' ? data.rateio : false
      };
      
      const { error } = await supabase
        .from('Despesas Gerais')
        .insert(despesaData);
        
      if (error) {
        console.error('Erro ao salvar despesa:', error);
        toast.error('Erro ao salvar despesa');
        return;
      }
      
      toast.success('Despesa registrada com sucesso!');
      carregarDespesas();
      
      logOperation('Despesas Gerais', `Registrada nova despesa: ${data.descricao.substring(0, 30)}...`);
      
      // Perguntar se deseja voltar ao menu principal
      const deveVoltar = window.confirm('Despesa registrada com sucesso! Deseja voltar ao menu principal?');
      if (deveVoltar) {
        navigate('/');
      }
    } catch (error) {
      console.error('Erro ao processar:', error);
      toast.error('Ocorreu um erro ao registrar a despesa');
    }
  };
  
  const handleVoltarMenu = () => {
    navigate('/');
  };
  
  // Formatar data para exibição
  const formatarData = (dataString: string | null) => {
    if (!dataString) return 'N/A';
    try {
      return format(parseISO(dataString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return dataString;
    }
  };
  
  // Formatar valores monetários
  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  // Filtrar despesas
  const despesasFiltradas = despesas.filter(despesa => {
    // Filtro por tipo
    if (filtroTipo !== 'todos' && despesa.tipo_despesa !== filtroTipo) {
      return false;
    }
    
    // Filtro por categoria
    if (filtroCategoria !== 'todos' && despesa.categoria !== filtroCategoria) {
      return false;
    }
    
    // Filtro por data
    if (filtroData && despesa.data_despesa !== filtroData) {
      return false;
    }
    
    return true;
  });

  // Obter total das despesas filtradas
  const totalDespesas = despesasFiltradas.reduce((total, despesa) => total + (despesa.valor_despesa || 0), 0);
  
  return (
    <PageLayout>
      <div className="flex justify-between items-center">
        <PageHeader 
          title="Despesas Gerais" 
          description="Gerenciamento de despesas de viagem e outras despesas"
        />
        <Button variant="outline" onClick={handleVoltarMenu}>Voltar ao Menu Principal</Button>
      </div>
      
      <Tabs defaultValue="registros" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="registros">Registros</TabsTrigger>
          <TabsTrigger value="novo">Nova Despesa</TabsTrigger>
        </TabsList>
        
        <TabsContent value="registros" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Despesas Registradas</h2>
            
            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <Select 
                  value={filtroTipo} 
                  onValueChange={setFiltroTipo}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os tipos</SelectItem>
                    <SelectItem value="descarga">Descarga</SelectItem>
                    <SelectItem value="reentrega">Reentrega</SelectItem>
                    <SelectItem value="no-show">No-Show</SelectItem>
                    <SelectItem value="administrativa">Administrativa</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select 
                  value={filtroCategoria} 
                  onValueChange={setFiltroCategoria}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas as categorias</SelectItem>
                    <SelectItem value="viagem">Viagem</SelectItem>
                    <SelectItem value="administrativa">Administrativa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Input
                  type="date"
                  value={filtroData}
                  onChange={(e) => setFiltroData(e.target.value)}
                  placeholder="Filtrar por data"
                />
              </div>
            </div>
            
            {loading ? (
              <p className="text-center py-4">Carregando despesas...</p>
            ) : despesasFiltradas.length === 0 ? (
              <p className="text-center py-4">Nenhuma despesa encontrada.</p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Contrato</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Rateio</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {despesasFiltradas.map((despesa, index) => (
                        <TableRow key={despesa.id || index}>
                          <TableCell>{formatarData(despesa.data_despesa)}</TableCell>
                          <TableCell>
                            <Badge variant={
                              despesa.tipo_despesa === 'administrativa' ? 'secondary' :
                              despesa.tipo_despesa === 'descarga' ? 'default' :
                              despesa.tipo_despesa === 'reentrega' ? 'destructive' :
                              despesa.tipo_despesa === 'no-show' ? 'outline' : 'default'
                            }>
                              {despesa.tipo_despesa}
                            </Badge>
                          </TableCell>
                          <TableCell>{despesa.categoria || '-'}</TableCell>
                          <TableCell>{despesa.contrato_id || '-'}</TableCell>
                          <TableCell className="max-w-xs truncate">{despesa.descricao_detalhada}</TableCell>
                          <TableCell>{formatarValor(despesa.valor_despesa)}</TableCell>
                          <TableCell>{despesa.rateio ? 'Sim' : 'Não'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-4 p-4 bg-gray-50 rounded-md flex justify-between items-center">
                  <span className="font-medium">Total de despesas:</span>
                  <span className="font-bold text-lg">{formatarValor(totalDespesas)}</span>
                </div>
              </>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="novo">
          <div className="bg-white p-6 rounded-lg shadow">
            <NovaDespesaForm onSave={handleSaveDespesa} />
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default DespesasGerais;
