
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { FileDown, PlusCircle, Search } from 'lucide-react';
import { getLivroCaixa, criarLivroCaixaItem } from '@/services/contabilidadeService';
import { LivroCaixaItem, TipoMovimento } from '@/types/contabilidade';
import { formatCurrency, formatDate } from '@/utils/formatters';

const LivroCaixa = () => {
  const [movimentos, setMovimentos] = useState<LivroCaixaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<{
    data_movimento: string;
    descricao: string;
    tipo: TipoMovimento;
    valor: number;
    documento_referencia?: string;
  }>({
    data_movimento: new Date().toISOString().split('T')[0],
    descricao: '',
    tipo: 'Entrada',
    valor: 0,
    documento_referencia: ''
  });
  const [filtroData, setFiltroData] = useState<string>(new Date().toISOString().split('T')[0]);
  const [periodoInicio, setPeriodoInicio] = useState<string>(
    new Date(new Date().setDate(1)).toISOString().split('T')[0]
  );
  const [periodoFim, setPeriodoFim] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    carregarMovimentos();
  }, []);

  const carregarMovimentos = async () => {
    setLoading(true);
    try {
      const data = await getLivroCaixa();
      setMovimentos(data);
    } catch (error) {
      console.error('Erro ao carregar movimentos:', error);
      toast.error('Não foi possível carregar os movimentos');
    } finally {
      setLoading(false);
    }
  };

  const calcularSaldo = (): number => {
    return movimentos.reduce((total, item) => {
      if (item.tipo === 'Entrada') {
        return total + item.valor;
      } else {
        return total - item.valor;
      }
    }, 0);
  };

  const calcularTotalEntradas = (): number => {
    return movimentos
      .filter(item => item.tipo === 'Entrada')
      .reduce((total, item) => total + item.valor, 0);
  };

  const calcularTotalSaidas = (): number => {
    return movimentos
      .filter(item => item.tipo === 'Saída')
      .reduce((total, item) => total + item.valor, 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'valor' ? parseFloat(value) || 0 : value
    }));
  };

  const handleTipoChange = (value: TipoMovimento) => {
    setFormData(prev => ({
      ...prev,
      tipo: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.descricao) {
      toast.error('A descrição é obrigatória');
      return;
    }
    
    if (formData.valor <= 0) {
      toast.error('O valor deve ser maior que zero');
      return;
    }
    
    try {
      const novoSaldo = formData.tipo === 'Entrada' 
        ? calcularSaldo() + formData.valor
        : calcularSaldo() - formData.valor;
      
      const novoMovimento: LivroCaixaItem = {
        ...formData,
        saldo: novoSaldo,
        status: 'ativo'
      };
      
      await criarLivroCaixaItem(novoMovimento);
      toast.success('Movimento registrado com sucesso!');
      setModalOpen(false);
      carregarMovimentos();
      
      // Limpar formulário
      setFormData({
        data_movimento: new Date().toISOString().split('T')[0],
        descricao: '',
        tipo: 'Entrada',
        valor: 0,
        documento_referencia: ''
      });
    } catch (error) {
      console.error('Erro ao registrar movimento:', error);
      toast.error('Não foi possível registrar o movimento');
    }
  };

  const filtrarMovimentosPorData = () => {
    const dataFiltro = new Date(filtroData);
    
    return movimentos.filter(movimento => {
      const dataMovimento = new Date(movimento.data_movimento);
      return dataMovimento.getDate() === dataFiltro.getDate() &&
             dataMovimento.getMonth() === dataFiltro.getMonth() &&
             dataMovimento.getFullYear() === dataFiltro.getFullYear();
    });
  };

  const filtrarMovimentosPorPeriodo = () => {
    const dataInicio = new Date(periodoInicio);
    const dataFim = new Date(periodoFim);
    
    return movimentos.filter(movimento => {
      const dataMovimento = new Date(movimento.data_movimento);
      return dataMovimento >= dataInicio && dataMovimento <= dataFim;
    });
  };

  const movimentosFiltrados = filtroData ? filtrarMovimentosPorData() : movimentos;
  const movimentosPeriodo = filtrarMovimentosPorPeriodo();

  return (
    <PageLayout>
      <PageHeader 
        title="Livro Caixa" 
        description="Controle de entradas e saídas financeiras"
        backButton={true}
        backLink="/contabilidade"
      />
      
      <div className="mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Saldo Atual: {formatCurrency(calcularSaldo())}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 bg-green-50 p-4 rounded-md">
                <p className="text-sm text-green-700">Total de Entradas:</p>
                <p className="text-xl font-bold text-green-700">{formatCurrency(calcularTotalEntradas())}</p>
              </div>
              
              <div className="space-y-2 bg-red-50 p-4 rounded-md">
                <p className="text-sm text-red-700">Total de Saídas:</p>
                <p className="text-xl font-bold text-red-700">{formatCurrency(calcularTotalSaidas())}</p>
              </div>
              
              <div className="space-y-2 bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-blue-700">Saldo:</p>
                <p className="text-xl font-bold text-blue-700">{formatCurrency(calcularSaldo())}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2 items-center">
          <Input 
            type="date" 
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
            className="w-40"
          />
          <Button variant="outline" onClick={() => setFiltroData('')}>
            Limpar Filtro
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <FileDown size={18} />
            Exportar
          </Button>
          <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
            <PlusCircle size={18} />
            Novo Lançamento
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="diario" className="w-full">
        <TabsList className="w-full mb-6 grid grid-cols-2">
          <TabsTrigger value="diario">Lançamentos do Dia</TabsTrigger>
          <TabsTrigger value="periodo">Lançamentos por Período</TabsTrigger>
        </TabsList>
        
        <TabsContent value="diario">
          <Card>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="text-right">Saldo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">Carregando...</TableCell>
                    </TableRow>
                  ) : movimentosFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">Nenhum movimento encontrado</TableCell>
                    </TableRow>
                  ) : (
                    movimentosFiltrados.map((movimento, index) => (
                      <TableRow key={index}>
                        <TableCell>{formatDate(movimento.data_movimento)}</TableCell>
                        <TableCell>{movimento.descricao}</TableCell>
                        <TableCell>{movimento.documento_referencia || '-'}</TableCell>
                        <TableCell>
                          <span className={movimento.tipo === 'Entrada' ? 'text-green-600' : 'text-red-600'}>
                            {movimento.tipo}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          <span className={movimento.tipo === 'Entrada' ? 'text-green-600' : 'text-red-600'}>
                            {formatCurrency(movimento.valor)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(movimento.saldo)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="periodo">
          <div className="mb-6 flex gap-4 items-center">
            <div className="flex gap-2 items-center">
              <Label htmlFor="dataInicio">De:</Label>
              <Input 
                id="dataInicio"
                type="date" 
                value={periodoInicio}
                onChange={(e) => setPeriodoInicio(e.target.value)}
                className="w-40"
              />
            </div>
            <div className="flex gap-2 items-center">
              <Label htmlFor="dataFim">Até:</Label>
              <Input 
                id="dataFim"
                type="date" 
                value={periodoFim}
                onChange={(e) => setPeriodoFim(e.target.value)}
                className="w-40"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Search size={18} />
              Filtrar
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="text-right">Saldo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">Carregando...</TableCell>
                    </TableRow>
                  ) : movimentosPeriodo.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">Nenhum movimento encontrado no período</TableCell>
                    </TableRow>
                  ) : (
                    movimentosPeriodo.map((movimento, index) => (
                      <TableRow key={index}>
                        <TableCell>{formatDate(movimento.data_movimento)}</TableCell>
                        <TableCell>{movimento.descricao}</TableCell>
                        <TableCell>{movimento.documento_referencia || '-'}</TableCell>
                        <TableCell>
                          <span className={movimento.tipo === 'Entrada' ? 'text-green-600' : 'text-red-600'}>
                            {movimento.tipo}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          <span className={movimento.tipo === 'Entrada' ? 'text-green-600' : 'text-red-600'}>
                            {formatCurrency(movimento.valor)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(movimento.saldo)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Novo Lançamento</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="data_movimento">Data do Movimento</Label>
              <Input
                id="data_movimento"
                name="data_movimento"
                type="date"
                value={formData.data_movimento}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                placeholder="Descrição do movimento"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Movimento</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) => handleTipoChange(value as TipoMovimento)}
              >
                <SelectTrigger id="tipo">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Entrada">Entrada</SelectItem>
                  <SelectItem value="Saída">Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="valor">Valor</Label>
              <Input
                id="valor"
                name="valor"
                type="number"
                min="0.01"
                step="0.01"
                value={formData.valor}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="documento_referencia">Documento de Referência (opcional)</Label>
              <Input
                id="documento_referencia"
                name="documento_referencia"
                value={formData.documento_referencia}
                onChange={handleInputChange}
                placeholder="Número da NF, recibo, etc."
              />
            </div>
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default LivroCaixa;
