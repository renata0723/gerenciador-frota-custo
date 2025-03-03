
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, FileDown, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

import { getBalancosPatrimoniais, criarBalancoPatrimonial } from '@/services/contabilidadeService';
import { BalancoPatrimonialData } from '@/types/contabilidade';
import { formatarValorMonetario } from '@/utils/formatters';

const BalancoPatrimonial = () => {
  const navigate = useNavigate();
  const [balancos, setBalancos] = useState<BalancoPatrimonialData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para o novo balanço
  const [novoBalanco, setNovoBalanco] = useState<BalancoPatrimonialData>({
    data_fechamento: format(new Date(), 'yyyy-MM-dd'),
    ativo_circulante: 0,
    ativo_nao_circulante: 0,
    passivo_circulante: 0,
    passivo_nao_circulante: 0,
    patrimonio_liquido: 0,
    status: 'ativo'
  });
  
  useEffect(() => {
    const carregarBalancos = async () => {
      try {
        setLoading(true);
        const data = await getBalancosPatrimoniais();
        setBalancos(data);
      } catch (error) {
        console.error('Erro ao carregar balanços patrimoniais:', error);
        toast.error('Erro ao carregar balanços patrimoniais. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    carregarBalancos();
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setNovoBalanco(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };
  
  const calcularTotais = () => {
    // Para cada balanço, calcula os totais
    const totalAtivo = (novoBalanco.ativo_circulante || 0) + (novoBalanco.ativo_nao_circulante || 0);
    const totalPassivo = (novoBalanco.passivo_circulante || 0) + 
                         (novoBalanco.passivo_nao_circulante || 0) + 
                         (novoBalanco.patrimonio_liquido || 0);
    
    return { totalAtivo, totalPassivo };
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    const { totalAtivo, totalPassivo } = calcularTotais();
    
    if (Math.abs(totalAtivo - totalPassivo) > 0.01) {  // Tolerância para erros de arredondamento
      toast.error('O total de Ativos deve ser igual ao total de Passivos + Patrimônio Líquido.');
      return;
    }
    
    try {
      const response = await criarBalancoPatrimonial(novoBalanco);
      
      if (response) {
        toast.success('Balanço patrimonial registrado com sucesso.');
        
        // Atualiza a lista de balanços
        setBalancos(prev => [response, ...prev]);
        
        // Limpa parcialmente o formulário (mantém a data)
        setNovoBalanco({
          ...novoBalanco,
          ativo_circulante: 0,
          ativo_nao_circulante: 0,
          passivo_circulante: 0,
          passivo_nao_circulante: 0,
          patrimonio_liquido: 0,
        });
      } else {
        toast.error('Erro ao registrar balanço. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao salvar balanço:', error);
      toast.error('Erro ao salvar balanço. Tente novamente mais tarde.');
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
        title="Balanço Patrimonial" 
        description="Visualize e registre a posição patrimonial da empresa"
        actions={
          <Button variant="ghost" onClick={() => navigate('/contabilidade')}>
            Voltar
          </Button>
        }
      />
      
      <Tabs defaultValue="listar" className="mt-6">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="listar">Balanços</TabsTrigger>
          <TabsTrigger value="novo">Novo Balanço</TabsTrigger>
        </TabsList>
        
        <TabsContent value="listar">
          <Card className="p-6">
            {loading ? (
              <p className="text-center py-4">Carregando balanços patrimoniais...</p>
            ) : balancos.length === 0 ? (
              <div className="text-center py-8">
                <BarChart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Nenhum balanço registrado</h3>
                <p className="mt-1 text-gray-500">Clique em "Novo Balanço" para adicionar.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {balancos.map((balanco, index) => {
                  const totalAtivo = (balanco.ativo_circulante || 0) + (balanco.ativo_nao_circulante || 0);
                  const totalPassivo = (balanco.passivo_circulante || 0) + 
                                       (balanco.passivo_nao_circulante || 0) + 
                                       (balanco.patrimonio_liquido || 0);
                  
                  return (
                    <Card key={balanco.id || index} className="overflow-hidden">
                      <CardHeader className="bg-slate-50 pb-3">
                        <CardTitle className="text-lg">
                          Balanço Patrimonial - {formatarData(balanco.data_fechamento)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-x divide-gray-200">
                          {/* Coluna Ativo */}
                          <div className="p-4">
                            <h3 className="text-lg font-bold mb-4 text-center">ATIVO</h3>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">Ativo Circulante</TableCell>
                                  <TableCell className="text-right">
                                    {formatarValorMonetario(balanco.ativo_circulante || 0)}
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Ativo Não Circulante</TableCell>
                                  <TableCell className="text-right">
                                    {formatarValorMonetario(balanco.ativo_nao_circulante || 0)}
                                  </TableCell>
                                </TableRow>
                                <TableRow className="border-t-2 border-gray-900">
                                  <TableCell className="font-bold">TOTAL DO ATIVO</TableCell>
                                  <TableCell className="text-right font-bold">
                                    {formatarValorMonetario(totalAtivo)}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                          
                          {/* Coluna Passivo */}
                          <div className="p-4">
                            <h3 className="text-lg font-bold mb-4 text-center">PASSIVO</h3>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">Passivo Circulante</TableCell>
                                  <TableCell className="text-right">
                                    {formatarValorMonetario(balanco.passivo_circulante || 0)}
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Passivo Não Circulante</TableCell>
                                  <TableCell className="text-right">
                                    {formatarValorMonetario(balanco.passivo_nao_circulante || 0)}
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Patrimônio Líquido</TableCell>
                                  <TableCell className="text-right">
                                    {formatarValorMonetario(balanco.patrimonio_liquido || 0)}
                                  </TableCell>
                                </TableRow>
                                <TableRow className="border-t-2 border-gray-900">
                                  <TableCell className="font-bold">TOTAL DO PASSIVO</TableCell>
                                  <TableCell className="text-right font-bold">
                                    {formatarValorMonetario(totalPassivo)}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                        
                        <div className="flex justify-end p-4 border-t border-gray-200">
                          <Button variant="outline" size="sm">
                            <FileDown className="mr-2 h-4 w-4" /> Exportar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="novo">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="data_fechamento">Data de Fechamento</Label>
                <Input
                  id="data_fechamento"
                  name="data_fechamento"
                  type="date"
                  value={novoBalanco.data_fechamento}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                {/* Coluna Ativo */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold mb-4">ATIVO</h3>
                  
                  <div>
                    <Label htmlFor="ativo_circulante">Ativo Circulante (R$)</Label>
                    <Input
                      id="ativo_circulante"
                      name="ativo_circulante"
                      type="number"
                      step="0.01"
                      value={novoBalanco.ativo_circulante}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="ativo_nao_circulante">Ativo Não Circulante (R$)</Label>
                    <Input
                      id="ativo_nao_circulante"
                      name="ativo_nao_circulante"
                      type="number"
                      step="0.01"
                      value={novoBalanco.ativo_nao_circulante}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="total_ativo">Total do Ativo (R$)</Label>
                    <Input
                      id="total_ativo"
                      type="number"
                      step="0.01"
                      value={(novoBalanco.ativo_circulante || 0) + (novoBalanco.ativo_nao_circulante || 0)}
                      readOnly
                      className="bg-slate-50 font-bold"
                    />
                  </div>
                </div>
                
                {/* Coluna Passivo */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold mb-4">PASSIVO</h3>
                  
                  <div>
                    <Label htmlFor="passivo_circulante">Passivo Circulante (R$)</Label>
                    <Input
                      id="passivo_circulante"
                      name="passivo_circulante"
                      type="number"
                      step="0.01"
                      value={novoBalanco.passivo_circulante}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="passivo_nao_circulante">Passivo Não Circulante (R$)</Label>
                    <Input
                      id="passivo_nao_circulante"
                      name="passivo_nao_circulante"
                      type="number"
                      step="0.01"
                      value={novoBalanco.passivo_nao_circulante}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="patrimonio_liquido">Patrimônio Líquido (R$)</Label>
                    <Input
                      id="patrimonio_liquido"
                      name="patrimonio_liquido"
                      type="number"
                      step="0.01"
                      value={novoBalanco.patrimonio_liquido}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="total_passivo">Total do Passivo (R$)</Label>
                    <Input
                      id="total_passivo"
                      type="number"
                      step="0.01"
                      value={
                        (novoBalanco.passivo_circulante || 0) + 
                        (novoBalanco.passivo_nao_circulante || 0) + 
                        (novoBalanco.patrimonio_liquido || 0)
                      }
                      readOnly
                      className="bg-slate-50 font-bold"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button type="submit" className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Registrar Balanço Patrimonial
                </Button>
              </div>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default BalancoPatrimonial;
