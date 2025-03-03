
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
import { FileText, FileDown, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

import { getDREs, criarDRE } from '@/services/contabilidadeService';
import { DREData } from '@/types/contabilidade';
import { formatarValorMonetario } from '@/utils/formatters';

const DRE = () => {
  const navigate = useNavigate();
  const [dres, setDres] = useState<DREData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para a nova DRE
  const [novaDre, setNovaDre] = useState<DREData>({
    periodo_inicio: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
    periodo_fim: format(new Date(), 'yyyy-MM-dd'),
    receita_bruta: 0,
    deducoes: 0,
    receita_liquida: 0,
    custos: 0,
    lucro_bruto: 0,
    despesas_operacionais: 0,
    resultado_operacional: 0,
    resultado_financeiro: 0,
    resultado_antes_ir_csll: 0,
    provisao_ir_csll: 0,
    resultado_liquido: 0,
    status: 'ativo'
  });
  
  useEffect(() => {
    const carregarDREs = async () => {
      try {
        setLoading(true);
        const data = await getDREs();
        setDres(data);
      } catch (error) {
        console.error('Erro ao carregar DREs:', error);
        toast.error('Erro ao carregar demonstrações de resultado. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    carregarDREs();
  }, []);
  
  useEffect(() => {
    // Calcula automaticamente os campos derivados
    const receita_liquida = (novaDre.receita_bruta || 0) - (novaDre.deducoes || 0);
    const lucro_bruto = receita_liquida - (novaDre.custos || 0);
    const resultado_operacional = lucro_bruto - (novaDre.despesas_operacionais || 0);
    const resultado_antes_ir_csll = resultado_operacional + (novaDre.resultado_financeiro || 0);
    const resultado_liquido = resultado_antes_ir_csll - (novaDre.provisao_ir_csll || 0);
    
    setNovaDre(prev => ({
      ...prev,
      receita_liquida,
      lucro_bruto,
      resultado_operacional,
      resultado_antes_ir_csll,
      resultado_liquido
    }));
  }, [
    novaDre.receita_bruta, 
    novaDre.deducoes, 
    novaDre.custos, 
    novaDre.despesas_operacionais,
    novaDre.resultado_financeiro,
    novaDre.provisao_ir_csll
  ]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setNovaDre(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await criarDRE(novaDre);
      
      if (response) {
        toast.success('DRE registrada com sucesso.');
        
        // Atualiza a lista de DREs
        setDres(prev => [response, ...prev]);
        
        // Limpa parcialmente o formulário (mantém as datas)
        setNovaDre({
          ...novaDre,
          receita_bruta: 0,
          deducoes: 0,
          receita_liquida: 0,
          custos: 0,
          lucro_bruto: 0,
          despesas_operacionais: 0,
          resultado_operacional: 0,
          resultado_financeiro: 0,
          resultado_antes_ir_csll: 0,
          provisao_ir_csll: 0,
          resultado_liquido: 0,
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
  
  return (
    <PageLayout>
      <PageHeader 
        title="Demonstração de Resultado do Exercício" 
        description="Visualize e registre os resultados financeiros da empresa por período"
        actions={
          <Button variant="ghost" onClick={() => navigate('/contabilidade')}>
            Voltar
          </Button>
        }
      />
      
      <Tabs defaultValue="listar" className="mt-6">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="listar">DREs</TabsTrigger>
          <TabsTrigger value="nova">Nova DRE</TabsTrigger>
        </TabsList>
        
        <TabsContent value="listar">
          <Card className="p-6">
            {loading ? (
              <p className="text-center py-4">Carregando demonstrações...</p>
            ) : dres.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Nenhuma DRE registrada</h3>
                <p className="mt-1 text-gray-500">Clique em "Nova DRE" para adicionar.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {dres.map((dre, index) => (
                  <Card key={dre.id || index} className="overflow-hidden">
                    <CardHeader className="bg-slate-50 pb-3">
                      <CardTitle className="text-lg">
                        DRE - Período: {formatarData(dre.periodo_inicio)} a {formatarData(dre.periodo_fim)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Receita Bruta</TableCell>
                            <TableCell className="text-right">{formatarValorMonetario(dre.receita_bruta || 0)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">(-) Deduções</TableCell>
                            <TableCell className="text-right text-red-600">
                              {formatarValorMonetario(dre.deducoes || 0)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Receita Líquida</TableCell>
                            <TableCell className="text-right font-semibold">
                              {formatarValorMonetario(dre.receita_liquida || 0)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">(-) Custos</TableCell>
                            <TableCell className="text-right text-red-600">
                              {formatarValorMonetario(dre.custos || 0)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Lucro Bruto</TableCell>
                            <TableCell className="text-right font-semibold">
                              {formatarValorMonetario(dre.lucro_bruto || 0)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">(-) Despesas Operacionais</TableCell>
                            <TableCell className="text-right text-red-600">
                              {formatarValorMonetario(dre.despesas_operacionais || 0)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Resultado Operacional</TableCell>
                            <TableCell className="text-right font-semibold">
                              {formatarValorMonetario(dre.resultado_operacional || 0)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Resultado Financeiro</TableCell>
                            <TableCell className="text-right">
                              {formatarValorMonetario(dre.resultado_financeiro || 0)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Resultado Antes do IR/CSLL</TableCell>
                            <TableCell className="text-right font-semibold">
                              {formatarValorMonetario(dre.resultado_antes_ir_csll || 0)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">(-) Provisão IR/CSLL</TableCell>
                            <TableCell className="text-right text-red-600">
                              {formatarValorMonetario(dre.provisao_ir_csll || 0)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium text-lg">Resultado Líquido</TableCell>
                            <TableCell className={`text-right font-bold text-lg ${(dre.resultado_liquido || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatarValorMonetario(dre.resultado_liquido || 0)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                      
                      <div className="flex justify-end mt-4">
                        <Button variant="outline" size="sm">
                          <FileDown className="mr-2 h-4 w-4" /> Exportar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="nova">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="periodo_inicio">Período Início</Label>
                  <Input
                    id="periodo_inicio"
                    name="periodo_inicio"
                    type="date"
                    value={novaDre.periodo_inicio}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="periodo_fim">Período Fim</Label>
                  <Input
                    id="periodo_fim"
                    name="periodo_fim"
                    type="date"
                    value={novaDre.periodo_fim}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="receita_bruta">Receita Bruta (R$)</Label>
                  <Input
                    id="receita_bruta"
                    name="receita_bruta"
                    type="number"
                    step="0.01"
                    value={novaDre.receita_bruta}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="deducoes">Deduções (R$)</Label>
                  <Input
                    id="deducoes"
                    name="deducoes"
                    type="number"
                    step="0.01"
                    value={novaDre.deducoes}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="receita_liquida">Receita Líquida (R$)</Label>
                <Input
                  id="receita_liquida"
                  name="receita_liquida"
                  type="number"
                  step="0.01"
                  value={novaDre.receita_liquida}
                  readOnly
                  className="bg-slate-50"
                />
              </div>
              
              <div>
                <Label htmlFor="custos">Custos (R$)</Label>
                <Input
                  id="custos"
                  name="custos"
                  type="number"
                  step="0.01"
                  value={novaDre.custos}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="lucro_bruto">Lucro Bruto (R$)</Label>
                <Input
                  id="lucro_bruto"
                  name="lucro_bruto"
                  type="number"
                  step="0.01"
                  value={novaDre.lucro_bruto}
                  readOnly
                  className="bg-slate-50"
                />
              </div>
              
              <div>
                <Label htmlFor="despesas_operacionais">Despesas Operacionais (R$)</Label>
                <Input
                  id="despesas_operacionais"
                  name="despesas_operacionais"
                  type="number"
                  step="0.01"
                  value={novaDre.despesas_operacionais}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="resultado_operacional">Resultado Operacional (R$)</Label>
                <Input
                  id="resultado_operacional"
                  name="resultado_operacional"
                  type="number"
                  step="0.01"
                  value={novaDre.resultado_operacional}
                  readOnly
                  className="bg-slate-50"
                />
              </div>
              
              <div>
                <Label htmlFor="resultado_financeiro">Resultado Financeiro (R$)</Label>
                <Input
                  id="resultado_financeiro"
                  name="resultado_financeiro"
                  type="number"
                  step="0.01"
                  value={novaDre.resultado_financeiro}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="resultado_antes_ir_csll">Resultado Antes do IR/CSLL (R$)</Label>
                <Input
                  id="resultado_antes_ir_csll"
                  name="resultado_antes_ir_csll"
                  type="number"
                  step="0.01"
                  value={novaDre.resultado_antes_ir_csll}
                  readOnly
                  className="bg-slate-50"
                />
              </div>
              
              <div>
                <Label htmlFor="provisao_ir_csll">Provisão IR/CSLL (R$)</Label>
                <Input
                  id="provisao_ir_csll"
                  name="provisao_ir_csll"
                  type="number"
                  step="0.01"
                  value={novaDre.provisao_ir_csll}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="resultado_liquido">Resultado Líquido (R$)</Label>
                <Input
                  id="resultado_liquido"
                  name="resultado_liquido"
                  type="number"
                  step="0.01"
                  value={novaDre.resultado_liquido}
                  readOnly
                  className={`bg-slate-50 ${novaDre.resultado_liquido >= 0 ? 'text-green-600' : 'text-red-600'} font-bold`}
                />
              </div>
              
              <Button type="submit" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Registrar DRE
              </Button>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default DRE;
