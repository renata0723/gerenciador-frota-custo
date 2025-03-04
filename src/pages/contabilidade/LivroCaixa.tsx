
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, FileText, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

import { getLivroCaixa, criarLivroCaixaItem, getPlanoContas } from '@/services/contabilidadeService';
import { LivroCaixaItem, TipoMovimento, ContaContabil } from '@/types/contabilidade';
import { formatarValorMonetario } from '@/utils/formatters';

const LivroCaixa = () => {
  const navigate = useNavigate();
  const [movimentos, setMovimentos] = useState<LivroCaixaItem[]>([]);
  const [contas, setContas] = useState<ContaContabil[]>([]);
  const [loading, setLoading] = useState(true);
  const [saldoAtual, setSaldoAtual] = useState(0);
  
  // Estado para novo movimento
  const [novoMovimento, setNovoMovimento] = useState<LivroCaixaItem>({
    data_movimento: format(new Date(), 'yyyy-MM-dd'),
    descricao: '',
    tipo: 'entrada',
    valor: 0,
    saldo: 0,
    status: 'ativo'
  });
  
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        
        // Carrega movimentos e contas
        const [movimentosData, contasData] = await Promise.all([
          getLivroCaixa(),
          getPlanoContas()
        ]);
        
        // Ordena movimentos por data (mais recentes primeiro)
        const movimentosOrdenados = [...movimentosData].sort((a, b) => {
          const dataA = new Date(a.data_movimento).getTime();
          const dataB = new Date(b.data_movimento).getTime();
          return dataB - dataA;
        });
        
        setMovimentos(movimentosOrdenados);
        setContas(contasData);
        
        // Calcula saldo atual (último movimento)
        if (movimentosOrdenados.length > 0) {
          setSaldoAtual(movimentosOrdenados[0].saldo);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    carregarDados();
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setNovoMovimento(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };
  
  const handleSelectChange = (field: string, value: string) => {
    if (field === 'tipo') {
      setNovoMovimento(prev => ({
        ...prev,
        [field]: value as TipoMovimento
      }));
    } else {
      setNovoMovimento(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  
  const calcularNovoSaldo = (tipo: TipoMovimento, valor: number): number => {
    return tipo === 'entrada' ? saldoAtual + valor : saldoAtual - valor;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!novoMovimento.descricao || !novoMovimento.valor || novoMovimento.valor <= 0) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    // Calcula novo saldo
    const novoSaldo = calcularNovoSaldo(novoMovimento.tipo, novoMovimento.valor);
    
    try {
      const movimentoFinal = {
        ...novoMovimento,
        saldo: novoSaldo
      };
      
      const response = await criarLivroCaixaItem(movimentoFinal);
      
      if (response) {
        toast.success('Movimento registrado com sucesso.');
        
        // Atualiza a lista de movimentos e o saldo
        setMovimentos(prev => [response, ...prev]);
        setSaldoAtual(novoSaldo);
        
        // Limpa o formulário
        setNovoMovimento({
          data_movimento: format(new Date(), 'yyyy-MM-dd'),
          descricao: '',
          tipo: 'entrada',
          valor: 0,
          saldo: 0,
          status: 'ativo'
        });
      } else {
        toast.error('Erro ao registrar movimento. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao salvar movimento:', error);
      toast.error('Erro ao salvar movimento. Tente novamente mais tarde.');
    }
  };
  
  const formatarData = (dataString: string) => {
    try {
      return format(parseISO(dataString), 'dd/MM/yyyy');
    } catch (error) {
      return dataString;
    }
  };
  
  return (
    <PageLayout>
      <PageHeader 
        title="Livro Caixa" 
        description="Controle de movimentações financeiras"
        actions={
          <Button variant="ghost" onClick={() => navigate('/contabilidade')}>
            Voltar
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-6 bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-600">Saldo Atual</h3>
              <p className="text-2xl font-bold">{formatarValorMonetario(saldoAtual)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-600">Total de Entradas</h3>
              <p className="text-2xl font-bold">
                {formatarValorMonetario(
                  movimentos
                    .filter(m => m.tipo === 'entrada')
                    .reduce((acc, curr) => acc + curr.valor, 0)
                )}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <ArrowUpRight className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-red-600">Total de Saídas</h3>
              <p className="text-2xl font-bold">
                {formatarValorMonetario(
                  movimentos
                    .filter(m => m.tipo === 'saida')
                    .reduce((acc, curr) => acc + curr.valor, 0)
                )}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <ArrowDownRight className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>
      
      <Tabs defaultValue="listar" className="mt-6">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="listar">Movimentos</TabsTrigger>
          <TabsTrigger value="novo">Novo Movimento</TabsTrigger>
        </TabsList>
        
        <TabsContent value="listar">
          <Card className="p-6">
            {loading ? (
              <p className="text-center py-4">Carregando movimentos...</p>
            ) : movimentos.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Nenhum movimento registrado</h3>
                <p className="mt-1 text-gray-500">Clique em "Novo Movimento" para adicionar.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="text-right">Saldo</TableHead>
                      <TableHead>Referência</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movimentos.map((movimento, index) => (
                      <TableRow key={movimento.id || index}>
                        <TableCell>{formatarData(movimento.data_movimento)}</TableCell>
                        <TableCell>{movimento.descricao}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            movimento.tipo === 'entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {movimento.tipo === 'entrada' ? (
                              <>
                                <ArrowUpRight className="mr-1 h-3 w-3" />
                                Entrada
                              </>
                            ) : (
                              <>
                                <ArrowDownRight className="mr-1 h-3 w-3" />
                                Saída
                              </>
                            )}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          <span className={movimento.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}>
                            {movimento.tipo === 'entrada' ? '+' : '-'} {formatarValorMonetario(movimento.valor)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatarValorMonetario(movimento.saldo)}
                        </TableCell>
                        <TableCell>{movimento.documento_referencia || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="novo">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="data_movimento">Data do Movimento</Label>
                  <Input
                    id="data_movimento"
                    name="data_movimento"
                    type="date"
                    value={novoMovimento.data_movimento}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="tipo">Tipo de Movimento</Label>
                  <Select 
                    value={novoMovimento.tipo}
                    onValueChange={(value) => handleSelectChange('tipo', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entrada">Entrada</SelectItem>
                      <SelectItem value="saida">Saída</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  name="descricao"
                  value={novoMovimento.descricao}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="valor">Valor (R$)</Label>
                  <Input
                    id="valor"
                    name="valor"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={novoMovimento.valor}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="documento_referencia">Documento de Referência (opcional)</Label>
                  <Input
                    id="documento_referencia"
                    name="documento_referencia"
                    value={novoMovimento.documento_referencia || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Resumo do Movimento</h3>
                  <span className={`text-lg font-bold ${novoMovimento.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                    {novoMovimento.tipo === 'entrada' ? '+' : '-'} {formatarValorMonetario(novoMovimento.valor)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Saldo Atual:</p>
                  <span className="font-medium">{formatarValorMonetario(saldoAtual)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Novo Saldo:</p>
                  <span className="font-bold text-blue-600">
                    {formatarValorMonetario(calcularNovoSaldo(novoMovimento.tipo, novoMovimento.valor))}
                  </span>
                </div>
              </div>
              
              <Button type="submit" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Registrar Movimento
              </Button>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default LivroCaixa;
