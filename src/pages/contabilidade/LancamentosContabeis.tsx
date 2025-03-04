
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
import { ArrowLeftRight, Plus, FileCheck } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

import { 
  listarLancamentosContabeis,
  adicionarLancamentoContabil,
  listarPlanoContas,
  listarCentrosCusto,
  getContaContabilByCodigoReduzido
} from '@/services/contabilidadeService';
import { LancamentoContabil, ContaContabil, CentroCusto } from '@/types/contabilidade';
import { formatarValorMonetario } from '@/utils/formatters';

const LancamentosContabeis = () => {
  const navigate = useNavigate();
  const [lancamentos, setLancamentos] = useState<LancamentoContabil[]>([]);
  const [contas, setContas] = useState<ContaContabil[]>([]);
  const [centrosCusto, setCentrosCusto] = useState<CentroCusto[]>([]);
  const [loading, setLoading] = useState(true);
  const [codigoReduzidoDebito, setCodigoReduzidoDebito] = useState('');
  const [codigoReduzidoCredito, setCodigoReduzidoCredito] = useState('');
  
  // Estado para o novo lançamento
  const [novoLancamento, setNovoLancamento] = useState<LancamentoContabil>({
    data_lancamento: format(new Date(), 'yyyy-MM-dd'),
    conta_debito: '',
    conta_credito: '',
    valor: 0,
    historico: '',
    data_competencia: format(new Date(), 'yyyy-MM-dd'),
    status: 'ativo',
    periodo_fiscal_fechado: false
  });
  
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        
        // Carrega todos os dados necessários
        const [lancamentosData, contasData, centrosCustoData] = await Promise.all([
          listarLancamentosContabeis(),
          listarPlanoContas(),
          listarCentrosCusto()
        ]);
        
        setLancamentos(lancamentosData);
        setContas(contasData);
        setCentrosCusto(centrosCustoData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    carregarDados();
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setNovoLancamento(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };
  
  const handleSelectChange = (field: string, value: string) => {
    setNovoLancamento(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const buscarContaPorCodigoReduzido = async (codigoReduzido: string, tipo: 'debito' | 'credito') => {
    try {
      const conta = await getContaContabilByCodigoReduzido(codigoReduzido);
      if (conta) {
        if (tipo === 'debito') {
          setNovoLancamento(prev => ({
            ...prev,
            conta_debito: conta.codigo
          }));
        } else {
          setNovoLancamento(prev => ({
            ...prev,
            conta_credito: conta.codigo
          }));
        }
        toast.success(`Conta ${conta.nome} selecionada com sucesso.`);
      } else {
        toast.error(`Código reduzido ${codigoReduzido} não encontrado.`);
      }
    } catch (error) {
      console.error('Erro ao buscar conta pelo código reduzido:', error);
      toast.error('Erro ao buscar conta. Tente novamente.');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!novoLancamento.conta_debito || !novoLancamento.conta_credito || !novoLancamento.valor || !novoLancamento.historico) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    try {
      const response = await adicionarLancamentoContabil(novoLancamento);
      
      if (response) {
        toast.success('Lançamento contábil registrado com sucesso.');
        
        // Atualiza a lista de lançamentos
        setLancamentos(prev => [response, ...prev]);
        
        // Limpa o formulário
        setNovoLancamento({
          data_lancamento: format(new Date(), 'yyyy-MM-dd'),
          conta_debito: '',
          conta_credito: '',
          valor: 0,
          historico: '',
          data_competencia: format(new Date(), 'yyyy-MM-dd'),
          status: 'ativo',
          periodo_fiscal_fechado: false
        });
        setCodigoReduzidoDebito('');
        setCodigoReduzidoCredito('');
      } else {
        toast.error('Erro ao registrar lançamento. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao salvar lançamento:', error);
      toast.error('Erro ao salvar lançamento. Tente novamente mais tarde.');
    }
  };
  
  const formatarData = (dataString: string) => {
    try {
      return format(parseISO(dataString), 'dd/MM/yyyy');
    } catch (error) {
      return dataString;
    }
  };
  
  const getNomeConta = (codigo: string) => {
    const conta = contas.find(c => c.codigo === codigo);
    return conta ? `${conta.codigo} - ${conta.nome}` : codigo;
  };
  
  return (
    <PageLayout>
      <PageHeader 
        title="Lançamentos Contábeis" 
        description="Registre e consulte todos os lançamentos contábeis"
        actions={
          <Button variant="ghost" onClick={() => navigate('/contabilidade')}>
            Voltar
          </Button>
        }
      />
      
      <Tabs defaultValue="listar" className="mt-6">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="listar">Lançamentos</TabsTrigger>
          <TabsTrigger value="novo">Novo Lançamento</TabsTrigger>
        </TabsList>
        
        <TabsContent value="listar">
          <Card className="p-6">
            {loading ? (
              <p className="text-center py-4">Carregando lançamentos...</p>
            ) : lancamentos.length === 0 ? (
              <div className="text-center py-8">
                <FileCheck className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Nenhum lançamento registrado</h3>
                <p className="mt-1 text-gray-500">Clique em "Novo Lançamento" para adicionar.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Competência</TableHead>
                      <TableHead>Histórico</TableHead>
                      <TableHead>Débito</TableHead>
                      <TableHead>Crédito</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lancamentos.map((lancamento, index) => (
                      <TableRow key={lancamento.id || index}>
                        <TableCell>{formatarData(lancamento.data_lancamento)}</TableCell>
                        <TableCell>{formatarData(lancamento.data_competencia)}</TableCell>
                        <TableCell>{lancamento.historico}</TableCell>
                        <TableCell>{getNomeConta(lancamento.conta_debito)}</TableCell>
                        <TableCell>{getNomeConta(lancamento.conta_credito)}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatarValorMonetario(lancamento.valor)}
                        </TableCell>
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
                  <Label htmlFor="data_lancamento">Data do Lançamento</Label>
                  <Input
                    id="data_lancamento"
                    name="data_lancamento"
                    type="date"
                    value={novoLancamento.data_lancamento}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="data_competencia">Data de Competência</Label>
                  <Input
                    id="data_competencia"
                    name="data_competencia"
                    type="date"
                    value={novoLancamento.data_competencia}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <Label htmlFor="codigoReduzidoDebito">Código Reduzido (Débito)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="codigoReduzidoDebito"
                      value={codigoReduzidoDebito}
                      onChange={(e) => setCodigoReduzidoDebito(e.target.value)}
                      placeholder="Ex: 11201"
                    />
                    <Button 
                      type="button" 
                      onClick={() => buscarContaPorCodigoReduzido(codigoReduzidoDebito, 'debito')}
                      variant="outline"
                    >
                      Buscar
                    </Button>
                  </div>
                  <Label htmlFor="conta_debito" className="mt-2">Conta de Débito</Label>
                  <Select 
                    value={novoLancamento.conta_debito}
                    onValueChange={(value) => handleSelectChange('conta_debito', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a conta" />
                    </SelectTrigger>
                    <SelectContent>
                      {contas.map((conta) => (
                        <SelectItem key={conta.codigo} value={conta.codigo}>
                          {conta.codigo} - {conta.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-center items-center">
                  <ArrowLeftRight className="h-8 w-8 text-blue-600" />
                </div>
                
                <div>
                  <Label htmlFor="codigoReduzidoCredito">Código Reduzido (Crédito)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="codigoReduzidoCredito"
                      value={codigoReduzidoCredito}
                      onChange={(e) => setCodigoReduzidoCredito(e.target.value)}
                      placeholder="Ex: 11201"
                    />
                    <Button 
                      type="button" 
                      onClick={() => buscarContaPorCodigoReduzido(codigoReduzidoCredito, 'credito')}
                      variant="outline"
                    >
                      Buscar
                    </Button>
                  </div>
                  <Label htmlFor="conta_credito" className="mt-2">Conta de Crédito</Label>
                  <Select 
                    value={novoLancamento.conta_credito}
                    onValueChange={(value) => handleSelectChange('conta_credito', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a conta" />
                    </SelectTrigger>
                    <SelectContent>
                      {contas.map((conta) => (
                        <SelectItem key={conta.codigo} value={conta.codigo}>
                          {conta.codigo} - {conta.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="historico">Histórico do Lançamento</Label>
                <Input
                  id="historico"
                  name="historico"
                  value={novoLancamento.historico}
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
                    value={novoLancamento.valor}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="centro_custo">Centro de Custo</Label>
                  <Select 
                    value={novoLancamento.centro_custo || ''}
                    onValueChange={(value) => handleSelectChange('centro_custo', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o centro de custo (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {centrosCusto.map((centro) => (
                        <SelectItem key={centro.codigo} value={centro.codigo}>
                          {centro.codigo} - {centro.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="documento_referencia">Documento de Referência</Label>
                  <Input
                    id="documento_referencia"
                    name="documento_referencia"
                    value={novoLancamento.documento_referencia || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="tipo_documento">Tipo de Documento</Label>
                  <Select 
                    value={novoLancamento.tipo_documento || ''}
                    onValueChange={(value) => handleSelectChange('tipo_documento', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NF">Nota Fiscal</SelectItem>
                      <SelectItem value="FAT">Fatura</SelectItem>
                      <SelectItem value="REC">Recibo</SelectItem>
                      <SelectItem value="CTR">Contrato</SelectItem>
                      <SelectItem value="OUT">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2 mt-8">
                  <input
                    type="checkbox"
                    id="periodo_fiscal_fechado"
                    checked={novoLancamento.periodo_fiscal_fechado || false}
                    onChange={() => 
                      setNovoLancamento(prev => ({
                        ...prev, 
                        periodo_fiscal_fechado: !prev.periodo_fiscal_fechado
                      }))
                    }
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <Label htmlFor="periodo_fiscal_fechado" className="text-sm">
                    Período Fiscal Fechado
                  </Label>
                </div>
              </div>
              
              <Button type="submit" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Registrar Lançamento
              </Button>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default LancamentosContabeis;
