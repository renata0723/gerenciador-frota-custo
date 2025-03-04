
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Upload, 
  Download, 
  Check, 
  X, 
  AlertCircle, 
  CreditCard, 
  FileSpreadsheet, 
  SearchIcon
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { formatarValorMonetario } from '@/utils/formatters';

interface TransacaoBancaria {
  id: number;
  data: string;
  descricao: string;
  valor: number;
  tipo: 'credito' | 'debito';
  conciliado: boolean;
  documento: string;
}

const ConciliacaoBancaria = () => {
  const navigate = useNavigate();
  const [bancoSelecionado, setBancoSelecionado] = useState('');
  const [periodoInicio, setPeriodoInicio] = useState('');
  const [periodoFim, setPeriodoFim] = useState('');
  const [transacoes, setTransacoes] = useState<TransacaoBancaria[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Dados de demonstração
  const bancos = [
    { id: 'banco1', nome: 'Banco do Brasil' },
    { id: 'banco2', nome: 'Itaú' },
    { id: 'banco3', nome: 'Bradesco' },
    { id: 'banco4', nome: 'Santander' },
    { id: 'banco5', nome: 'Caixa Econômica' },
  ];
  
  const transacoesDemo: TransacaoBancaria[] = [
    { id: 1, data: '2024-03-01', descricao: 'Transferência Recebida', valor: 15000, tipo: 'credito', conciliado: true, documento: 'TED123456' },
    { id: 2, data: '2024-03-02', descricao: 'Pagamento Fornecedor', valor: 3500, tipo: 'debito', conciliado: true, documento: 'BOL789012' },
    { id: 3, data: '2024-03-05', descricao: 'Recebimento Cliente', valor: 8000, tipo: 'credito', conciliado: false, documento: 'NF345678' },
    { id: 4, data: '2024-03-08', descricao: 'Pagamento Combustível', valor: 4200, tipo: 'debito', conciliado: false, documento: 'FAT567890' },
    { id: 5, data: '2024-03-10', descricao: 'Pagamento Manutenção', valor: 2800, tipo: 'debito', conciliado: false, documento: 'OS234567' },
    { id: 6, data: '2024-03-15', descricao: 'Transferência Recebida', valor: 12000, tipo: 'credito', conciliado: true, documento: 'TED789012' },
    { id: 7, data: '2024-03-20', descricao: 'Pagamento Salários', valor: 18000, tipo: 'debito', conciliado: true, documento: 'FOL123456' },
  ];

  const handleCarregarTransacoes = () => {
    setLoading(true);
    
    // Simulando carregamento de dados
    setTimeout(() => {
      setTransacoes(transacoesDemo);
      setLoading(false);
      toast.success('Transações bancárias carregadas com sucesso!');
    }, 1500);
  };
  
  const handleConciliarTransacao = (id: number) => {
    setTransacoes(prev => 
      prev.map(transacao => 
        transacao.id === id 
          ? { ...transacao, conciliado: !transacao.conciliado } 
          : transacao
      )
    );
  };
  
  const handleImportarExtrato = () => {
    toast.success('Funcionalidade de importação em desenvolvimento.');
  };
  
  const handleConciliarTodas = () => {
    setLoading(true);
    
    // Simulando processamento
    setTimeout(() => {
      setTransacoes(prev => 
        prev.map(transacao => ({ ...transacao, conciliado: true }))
      );
      setLoading(false);
      toast.success('Todas as transações foram conciliadas com sucesso!');
    }, 1000);
  };

  return (
    <PageLayout>
      <PageHeader
        title="Conciliação Bancária"
        description="Conciliação de transações bancárias com lançamentos contábeis"
        icon={<CreditCard size={24} />}
        actions={
          <Button variant="outline" onClick={() => navigate('/contabilidade')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        }
      />

      <div className="grid grid-cols-1 mt-6 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Parâmetros da Conciliação</CardTitle>
            <CardDescription>
              Selecione o banco e o período para realizar a conciliação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="banco">Banco</Label>
                <Select value={bancoSelecionado} onValueChange={setBancoSelecionado}>
                  <SelectTrigger id="banco">
                    <SelectValue placeholder="Selecione o banco" />
                  </SelectTrigger>
                  <SelectContent>
                    {bancos.map(banco => (
                      <SelectItem key={banco.id} value={banco.id}>
                        {banco.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="periodo-inicio">Data Inicial</Label>
                <Input
                  id="periodo-inicio"
                  type="date"
                  value={periodoInicio}
                  onChange={(e) => setPeriodoInicio(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="periodo-fim">Data Final</Label>
                <Input
                  id="periodo-fim"
                  type="date"
                  value={periodoFim}
                  onChange={(e) => setPeriodoFim(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end pt-0">
            <Button 
              variant="outline" 
              onClick={handleImportarExtrato}
            >
              <Upload className="mr-2 h-4 w-4" /> Importar Extrato
            </Button>
            <Button 
              onClick={handleCarregarTransacoes}
              disabled={loading || !bancoSelecionado}
              className="bg-sistema-primary hover:bg-sistema-primary-dark"
            >
              <SearchIcon className="mr-2 h-4 w-4" /> 
              {loading ? 'Carregando...' : 'Carregar Transações'}
            </Button>
          </CardFooter>
        </Card>
        
        {transacoes.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Transações Bancárias</CardTitle>
                  <CardDescription>
                    Concilie as transações com os lançamentos contábeis
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleConciliarTodas}>
                    <Check className="mr-2 h-4 w-4" /> Conciliar Todas
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" /> Exportar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pendentes" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
                  <TabsTrigger value="conciliadas">Conciliadas</TabsTrigger>
                  <TabsTrigger value="todas">Todas</TabsTrigger>
                </TabsList>
                
                <TabsContent value="pendentes" className="pt-4">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Conciliado</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead>Documento</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transacoes.filter(t => !t.conciliado).map((transacao) => (
                          <TableRow key={transacao.id}>
                            <TableCell>
                              <Checkbox 
                                checked={transacao.conciliado}
                                onCheckedChange={() => handleConciliarTransacao(transacao.id)}
                              />
                            </TableCell>
                            <TableCell>{transacao.data}</TableCell>
                            <TableCell>{transacao.descricao}</TableCell>
                            <TableCell>{transacao.documento}</TableCell>
                            <TableCell>
                              <Badge className={transacao.tipo === 'credito' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                {transacao.tipo === 'credito' ? 'Crédito' : 'Débito'}
                              </Badge>
                            </TableCell>
                            <TableCell className={`text-right ${transacao.tipo === 'credito' ? 'text-green-600' : 'text-red-600'}`}>
                              {formatarValorMonetario(transacao.valor)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleConciliarTransacao(transacao.id)}>
                                Conciliar
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        
                        {transacoes.filter(t => !t.conciliado).length === 0 && (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-4">
                              <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
                              <p>Todas as transações estão conciliadas!</p>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="conciliadas" className="pt-4">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Conciliado</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead>Documento</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transacoes.filter(t => t.conciliado).map((transacao) => (
                          <TableRow key={transacao.id}>
                            <TableCell>
                              <Checkbox 
                                checked={transacao.conciliado}
                                onCheckedChange={() => handleConciliarTransacao(transacao.id)}
                              />
                            </TableCell>
                            <TableCell>{transacao.data}</TableCell>
                            <TableCell>{transacao.descricao}</TableCell>
                            <TableCell>{transacao.documento}</TableCell>
                            <TableCell>
                              <Badge className={transacao.tipo === 'credito' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                {transacao.tipo === 'credito' ? 'Crédito' : 'Débito'}
                              </Badge>
                            </TableCell>
                            <TableCell className={`text-right ${transacao.tipo === 'credito' ? 'text-green-600' : 'text-red-600'}`}>
                              {formatarValorMonetario(transacao.valor)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleConciliarTransacao(transacao.id)}>
                                Desconciliar
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        
                        {transacoes.filter(t => t.conciliado).length === 0 && (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-4">
                              <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                              <p>Não há transações conciliadas!</p>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="todas" className="pt-4">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Conciliado</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead>Documento</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transacoes.map((transacao) => (
                          <TableRow key={transacao.id}>
                            <TableCell>
                              <Checkbox 
                                checked={transacao.conciliado}
                                onCheckedChange={() => handleConciliarTransacao(transacao.id)}
                              />
                            </TableCell>
                            <TableCell>{transacao.data}</TableCell>
                            <TableCell>{transacao.descricao}</TableCell>
                            <TableCell>{transacao.documento}</TableCell>
                            <TableCell>
                              <Badge className={transacao.tipo === 'credito' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                {transacao.tipo === 'credito' ? 'Crédito' : 'Débito'}
                              </Badge>
                            </TableCell>
                            <TableCell className={`text-right ${transacao.tipo === 'credito' ? 'text-green-600' : 'text-red-600'}`}>
                              {formatarValorMonetario(transacao.valor)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleConciliarTransacao(transacao.id)}>
                                {transacao.conciliado ? 'Desconciliar' : 'Conciliar'}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
};

export default ConciliacaoBancaria;
