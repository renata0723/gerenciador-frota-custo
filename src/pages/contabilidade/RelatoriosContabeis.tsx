
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileSpreadsheet, FileText, Download, Printer, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const RelatoriosContabeis = () => {
  const navigate = useNavigate();
  const [periodoInicio, setPeriodoInicio] = useState(format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'));
  const [periodoFim, setPeriodoFim] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [tipoRelatorio, setTipoRelatorio] = useState('balancete');
  const [formatoExportacao, setFormatoExportacao] = useState('pdf');
  const [loading, setLoading] = useState(false);

  const handleGerarRelatorio = () => {
    setLoading(true);
    
    // Simulando a geração do relatório
    setTimeout(() => {
      toast.success('Relatório gerado com sucesso!');
      setLoading(false);
    }, 2000);
  };

  const tiposRelatorio = [
    { value: 'balancete', label: 'Balancete Mensal' },
    { value: 'dre', label: 'Demonstração de Resultado (DRE)' },
    { value: 'balanco', label: 'Balanço Patrimonial' },
    { value: 'livro-caixa', label: 'Livro Caixa' },
    { value: 'apuracao-lucro', label: 'Apuração de Lucro' },
    { value: 'centro-custo', label: 'Relatório por Centro de Custo' },
    { value: 'conciliacao', label: 'Conciliação Bancária' },
    { value: 'fluxo-caixa', label: 'Fluxo de Caixa' }
  ];

  return (
    <PageLayout>
      <PageHeader
        title="Relatórios Contábeis"
        description="Geração de relatórios financeiros e contábeis"
        icon={<FileSpreadsheet size={24} />}
        actions={
          <Button variant="outline" onClick={() => navigate('/contabilidade')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        }
      />

      <div className="grid grid-cols-1 mt-6 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Geração de Relatórios</CardTitle>
            <CardDescription>
              Selecione os parâmetros para gerar o relatório contábil desejado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="parametros" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="parametros">Parâmetros</TabsTrigger>
                <TabsTrigger value="agendados">Relatórios Agendados</TabsTrigger>
              </TabsList>
              
              <TabsContent value="parametros" className="pt-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="tipo-relatorio">Tipo de Relatório</Label>
                    <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de relatório" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposRelatorio.map((tipo) => (
                          <SelectItem key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="formato-exportacao">Formato de Exportação</Label>
                    <Select value={formatoExportacao} onValueChange={setFormatoExportacao}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o formato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="periodo-inicio">Período de Início</Label>
                    <Input
                      id="periodo-inicio"
                      type="date"
                      value={periodoInicio}
                      onChange={(e) => setPeriodoInicio(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="periodo-fim">Período de Fim</Label>
                    <Input
                      id="periodo-fim"
                      type="date"
                      value={periodoFim}
                      onChange={(e) => setPeriodoFim(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6">
                  <Button variant="outline" onClick={() => navigate('/contabilidade')}>
                    Cancelar
                  </Button>
                  <Button variant="outline" disabled={loading}>
                    <Printer className="mr-2 h-4 w-4" /> Imprimir
                  </Button>
                  <Button variant="outline" disabled={loading}>
                    <Download className="mr-2 h-4 w-4" /> Exportar
                  </Button>
                  <Button 
                    onClick={handleGerarRelatorio}
                    disabled={loading}
                    className="bg-sistema-primary hover:bg-sistema-primary-dark"
                  >
                    {loading ? 'Gerando...' : 'Gerar Relatório'}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="agendados" className="pt-4">
                <div className="rounded-md border">
                  <div className="p-6 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">Nenhum relatório agendado encontrado</h3>
                    <p className="text-gray-500 mt-2">
                      Você ainda não possui relatórios agendados.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Relatórios Recentes</CardTitle>
            <CardDescription>
              Relatórios gerados recentemente para consulta rápida
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="p-6 text-center">
                <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium">Nenhum relatório gerado recentemente</h3>
                <p className="text-gray-500 mt-2">
                  Gere um novo relatório para visualizá-lo aqui.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default RelatoriosContabeis;
