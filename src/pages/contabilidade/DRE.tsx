
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Plus, FileSpreadsheet, FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

import { getDRE, criarDRE } from '@/services/contabilidadeService';
import { DREData } from '@/types/contabilidade';
import { formatarValorMonetario } from '@/utils/formatters';

const DRE = () => {
  const navigate = useNavigate();
  const [relatorios, setRelatorios] = useState<DREData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para novo relatório DRE
  const [novoDRE, setNovoDRE] = useState<DREData>({
    periodo_inicio: format(new Date(), 'yyyy-MM-dd'),
    periodo_fim: format(new Date(), 'yyyy-MM-dd'),
    receita_bruta: 0,
    receita_liquida: 0,
    custos_operacionais: 0,
    despesas_administrativas: 0,
    folha_pagamento: 0,
    resultado_periodo: 0,
    status: 'aberto'
  });
  
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        const data = await getDRE();
        setRelatorios(data);
      } catch (error) {
        console.error('Erro ao carregar DREs:', error);
        toast.error('Erro ao carregar demonstrativos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    carregarDados();
  }, []);
  
  useEffect(() => {
    // Calcula o resultado do período automaticamente quando os valores mudam
    const receita = novoDRE.receita_liquida;
    const custos = novoDRE.custos_operacionais;
    const despesas = novoDRE.despesas_administrativas;
    const folhaPagamento = novoDRE.folha_pagamento || 0;
    
    const resultado = receita - custos - despesas - folhaPagamento;
    
    setNovoDRE(prev => ({
      ...prev,
      resultado_periodo: resultado
    }));
  }, [novoDRE.receita_liquida, novoDRE.custos_operacionais, novoDRE.despesas_administrativas, novoDRE.folha_pagamento]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setNovoDRE(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };
  
  const handleReceitaLiquidaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = parseFloat(e.target.value);
    
    setNovoDRE(prev => ({
      ...prev,
      receita_liquida: valor,
      receita_bruta: valor * 1.0925 // Exemplo: considerando um abatimento padrão de 9,25%
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!novoDRE.periodo_inicio || !novoDRE.periodo_fim || novoDRE.receita_liquida <= 0) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    try {
      const response = await criarDRE(novoDRE);
      
      if (response) {
        toast.success('DRE registrado com sucesso.');
        
        // Atualiza a lista de DREs
        setRelatorios(prev => [response, ...prev]);
        
        // Limpa o formulário
        setNovoDRE({
          periodo_inicio: format(new Date(), 'yyyy-MM-dd'),
          periodo_fim: format(new Date(), 'yyyy-MM-dd'),
          receita_bruta: 0,
          receita_liquida: 0,
          custos_operacionais: 0,
          despesas_administrativas: 0,
          folha_pagamento: 0,
          resultado_periodo: 0,
          status: 'aberto'
        });
      } else {
        toast.error('Erro ao registrar DRE. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao salvar DRE:', error);
      toast.error('Erro ao salvar DRE. Tente novamente mais tarde.');
    }
  };
  
  const formatarData = (dataString: string) => {
    try {
      return format(parseISO(dataString), 'dd/MM/yyyy');
    } catch (error) {
      return dataString;
    }
  };
  
  const obterClasseResultado = (valor: number) => {
    return valor < 0 ? 'text-red-600' : 'text-green-600';
  };
  
  return (
    <PageLayout>
      <PageHeader 
        title="DRE - Demonstração do Resultado do Exercício" 
        description="Análise de receitas, custos e despesas por período"
        actions={
          <Button variant="ghost" onClick={() => navigate('/contabilidade')}>
            Voltar
          </Button>
        }
      />
      
      <Tabs defaultValue="listar" className="mt-6">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="listar">Demonstrativos</TabsTrigger>
          <TabsTrigger value="novo">Novo Demonstrativo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="listar">
          <Card className="p-6">
            {loading ? (
              <p className="text-center py-4">Carregando demonstrativos...</p>
            ) : relatorios.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Nenhum DRE registrado</h3>
                <p className="mt-1 text-gray-500">Clique em "Novo Demonstrativo" para adicionar.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Período</TableHead>
                      <TableHead>Receita Bruta</TableHead>
                      <TableHead>Receita Líquida</TableHead>
                      <TableHead>Custos Operacionais</TableHead>
                      <TableHead>Despesas Administrativas</TableHead>
                      <TableHead>Folha de Pagamento</TableHead>
                      <TableHead className="text-right">Resultado</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatorios.map((relatorio) => (
                      <TableRow key={relatorio.id}>
                        <TableCell>
                          {formatarData(relatorio.periodo_inicio)} a {formatarData(relatorio.periodo_fim)}
                        </TableCell>
                        <TableCell>{formatarValorMonetario(relatorio.receita_bruta)}</TableCell>
                        <TableCell>{formatarValorMonetario(relatorio.receita_liquida)}</TableCell>
                        <TableCell>{formatarValorMonetario(relatorio.custos_operacionais)}</TableCell>
                        <TableCell>{formatarValorMonetario(relatorio.despesas_administrativas)}</TableCell>
                        <TableCell>{formatarValorMonetario(relatorio.folha_pagamento || 0)}</TableCell>
                        <TableCell className={`text-right font-medium ${obterClasseResultado(relatorio.resultado_periodo)}`}>
                          {formatarValorMonetario(relatorio.resultado_periodo)}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            relatorio.status === 'fechado' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {relatorio.status === 'fechado' ? 'Fechado' : 'Aberto'}
                          </span>
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="periodo_inicio">Início do Período</Label>
                  <Input
                    id="periodo_inicio"
                    name="periodo_inicio"
                    type="date"
                    value={novoDRE.periodo_inicio}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="periodo_fim">Fim do Período</Label>
                  <Input
                    id="periodo_fim"
                    name="periodo_fim"
                    type="date"
                    value={novoDRE.periodo_fim}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Receitas</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="receita_liquida">Receita Líquida (R$)</Label>
                    <Input
                      id="receita_liquida"
                      name="receita_liquida"
                      type="number"
                      step="0.01"
                      min="0"
                      value={novoDRE.receita_liquida}
                      onChange={handleReceitaLiquidaChange}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Receita após abatimentos e deduções
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="receita_bruta">Receita Bruta (R$)</Label>
                    <Input
                      id="receita_bruta"
                      name="receita_bruta"
                      type="number"
                      step="0.01"
                      min="0"
                      value={novoDRE.receita_bruta}
                      onChange={handleInputChange}
                      readOnly
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Calculado automaticamente
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Custos e Despesas</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="custos_operacionais">Custos Operacionais (R$)</Label>
                    <Input
                      id="custos_operacionais"
                      name="custos_operacionais"
                      type="number"
                      step="0.01"
                      min="0"
                      value={novoDRE.custos_operacionais}
                      onChange={handleInputChange}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Custos diretos da operação
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="despesas_administrativas">Despesas Administrativas (R$)</Label>
                    <Input
                      id="despesas_administrativas"
                      name="despesas_administrativas"
                      type="number"
                      step="0.01"
                      min="0"
                      value={novoDRE.despesas_administrativas}
                      onChange={handleInputChange}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Despesas de estrutura e administração
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="folha_pagamento">Folha de Pagamento (R$)</Label>
                    <Input
                      id="folha_pagamento"
                      name="folha_pagamento"
                      type="number"
                      step="0.01"
                      min="0"
                      value={novoDRE.folha_pagamento || 0}
                      onChange={handleInputChange}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Salários e encargos
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Resultado</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="resultado_periodo">Resultado do Período (R$)</Label>
                    <Input
                      id="resultado_periodo"
                      name="resultado_periodo"
                      type="number"
                      step="0.01"
                      value={novoDRE.resultado_periodo}
                      className={obterClasseResultado(novoDRE.resultado_periodo)}
                      readOnly
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Calculado automaticamente
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-8">
                    <input
                      type="checkbox"
                      id="periodo_fechado"
                      checked={novoDRE.status === 'fechado'}
                      onChange={() => 
                        setNovoDRE(prev => ({
                          ...prev, 
                          status: prev.status === 'aberto' ? 'fechado' : 'aberto'
                        }))
                      }
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <Label htmlFor="periodo_fechado" className="text-sm">
                      Período Fiscal Fechado (não poderá ser alterado posteriormente)
                    </Label>
                  </div>
                </div>
              </div>
              
              <Button type="submit" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Registrar Demonstrativo
              </Button>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default DRE;
