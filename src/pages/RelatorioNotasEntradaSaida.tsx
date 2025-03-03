
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, FileText, AlertCircle, FileDown, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

interface NotaFiscal {
  id: number;
  numero_nota_fiscal: number;
  cliente_destinatario: string;
  data_coleta: string;
  data_prevista_entrega: string;
  cidade_destino: string;
  estado_destino: string;
  valor_nota_fiscal: number;
  status: string;
  data_saida?: string;
  contrato_id?: string;
}

const RelatorioNotasEntradaSaida = () => {
  const [activeTab, setActiveTab] = useState("pendentes");
  const [notasPendentes, setNotasPendentes] = useState<NotaFiscal[]>([]);
  const [notasEmitidas, setNotasEmitidas] = useState<NotaFiscal[]>([]);
  const [periodoInicio, setPeriodoInicio] = useState<string>(
    format(new Date(new Date().setDate(new Date().getDate() - 30)), 'yyyy-MM-dd')
  );
  const [periodoFim, setPeriodoFim] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');
  const [clientes, setClientes] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    carregarClientes();
    carregarNotasFiscais();
  }, []);

  const carregarClientes = async () => {
    try {
      const { data, error } = await supabase
        .from('Notas Fiscais')
        .select('cliente_destinatario')
        .order('cliente_destinatario');

      if (error) {
        console.error("Erro ao carregar clientes:", error);
        return;
      }

      // Extrair nomes de clientes únicos
      const uniqueClientes = [...new Set(data.map(item => item.cliente_destinatario))];
      setClientes(uniqueClientes);
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const carregarNotasFiscais = async () => {
    setCarregando(true);
    try {
      // Primeiramente, carregamos todas as notas fiscais
      const { data: notasData, error: notasError } = await supabase
        .from('Notas Fiscais')
        .select('*')
        .order('data_coleta', { ascending: false });

      if (notasError) {
        console.error("Erro ao carregar notas fiscais:", notasError);
        toast.error("Erro ao carregar notas fiscais.");
        setCarregando(false);
        return;
      }

      // Em seguida, carregamos todos os contratos que têm notas associadas
      const { data: contratosData, error: contratosError } = await supabase
        .from('Contratos')
        .select('id, notas_fiscais, data_saida');

      if (contratosError) {
        console.error("Erro ao carregar contratos:", contratosError);
        toast.error("Erro ao carregar dados de contratos.");
        setCarregando(false);
        return;
      }

      // Criar um mapa de notas fiscais para contratos
      const notasContratosMap = new Map();
      
      contratosData.forEach(contrato => {
        if (contrato.notas_fiscais && Array.isArray(contrato.notas_fiscais)) {
          contrato.notas_fiscais.forEach((notaNumero: number) => {
            notasContratosMap.set(notaNumero.toString(), {
              contrato_id: contrato.id,
              data_saida: contrato.data_saida
            });
          });
        }
      });

      // Processar as notas fiscais com as informações de contratos
      const notasProcessadas = notasData.map((nota: any) => {
        const notaInfo = notasContratosMap.get(nota.numero_nota_fiscal?.toString());
        return {
          ...nota,
          status: notaInfo ? 'emitida' : 'pendente',
          data_saida: notaInfo?.data_saida || null,
          contrato_id: notaInfo?.contrato_id || null
        };
      });

      // Separar notas pendentes e emitidas
      const pendentes = notasProcessadas.filter(nota => nota.status === 'pendente');
      const emitidas = notasProcessadas.filter(nota => nota.status === 'emitida');

      setNotasPendentes(pendentes);
      setNotasEmitidas(emitidas);
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Ocorreu um erro ao processar dados.");
    } finally {
      setCarregando(false);
    }
  };

  const filtrarNotas = (notas: NotaFiscal[]) => {
    return notas.filter(nota => {
      // Filtrar por período
      const dataColeta = nota.data_coleta ? new Date(nota.data_coleta) : null;
      const dataInicio = periodoInicio ? new Date(periodoInicio) : null;
      const dataFim = periodoFim ? new Date(periodoFim) : null;
      
      const dentroDoPeriodo = !dataColeta || !dataInicio || !dataFim || 
        (dataColeta >= dataInicio && dataColeta <= dataFim);
      
      // Filtrar por termo de busca
      const matchesSearch = !searchTerm || 
        nota.numero_nota_fiscal.toString().includes(searchTerm) || 
        nota.cliente_destinatario.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nota.cidade_destino.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtrar por cliente
      const matchesCliente = !filtroCliente || nota.cliente_destinatario === filtroCliente;
      
      return dentroDoPeriodo && matchesSearch && matchesCliente;
    });
  };

  const notasPendentesFiltradas = filtrarNotas(notasPendentes);
  const notasEmitidasFiltradas = filtrarNotas(notasEmitidas);

  const handleSearch = () => {
    carregarNotasFiscais();
  };

  const exportarCSV = () => {
    const notas = activeTab === "pendentes" ? notasPendentesFiltradas : notasEmitidasFiltradas;
    
    if (notas.length === 0) {
      toast.error("Não há dados para exportar");
      return;
    }
    
    // Criar cabeçalho
    let csv = 'Nº NF,Cliente,Data Coleta,Data Prevista Entrega,Cidade Destino,Estado,Valor NF';
    
    if (activeTab === "emitidas") {
      csv += ',Data Saída,Contrato ID';
    }
    
    csv += '\n';
    
    // Adicionar linhas
    notas.forEach(nota => {
      let linha = `${nota.numero_nota_fiscal},"${nota.cliente_destinatario}",${nota.data_coleta},${nota.data_prevista_entrega},"${nota.cidade_destino}",${nota.estado_destino},${nota.valor_nota_fiscal}`;
      
      if (activeTab === "emitidas") {
        linha += `,${nota.data_saida || ''},${nota.contrato_id || ''}`;
      }
      
      csv += linha + '\n';
    });
    
    // Criar arquivo para download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `notas-fiscais-${activeTab}-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Arquivo CSV gerado com sucesso");
  };

  const imprimirRelatorio = () => {
    const notas = activeTab === "pendentes" ? notasPendentesFiltradas : notasEmitidasFiltradas;
    
    if (notas.length === 0) {
      toast.error("Não há dados para imprimir");
      return;
    }
    
    // Abrir janela de impressão
    const janelaImpressao = window.open('', '_blank');
    if (!janelaImpressao) {
      toast.error('Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está desativado.');
      return;
    }
    
    const titulo = activeTab === "pendentes" ? "Notas Fiscais Pendentes de Saída" : "Notas Fiscais com Saída Emitida";
    
    janelaImpressao.document.write(`
      <html>
        <head>
          <title>${titulo}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; font-size: 18px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .filtros { margin-bottom: 20px; }
            .filtro-item { margin-bottom: 5px; }
            .data-geracao { text-align: right; font-size: 12px; margin-top: 20px; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>${titulo}</h1>
          
          <div class="filtros">
            <div class="filtro-item"><strong>Período:</strong> ${periodoInicio ? format(new Date(periodoInicio), 'dd/MM/yyyy') : 'N/A'} até ${periodoFim ? format(new Date(periodoFim), 'dd/MM/yyyy') : 'N/A'}</div>
            ${filtroCliente ? `<div class="filtro-item"><strong>Cliente:</strong> ${filtroCliente}</div>` : ''}
            ${searchTerm ? `<div class="filtro-item"><strong>Busca:</strong> ${searchTerm}</div>` : ''}
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Nº NF</th>
                <th>Cliente</th>
                <th>Data Coleta</th>
                <th>Data Prev. Entrega</th>
                <th>Destino</th>
                <th>Valor NF</th>
                ${activeTab === "emitidas" ? '<th>Data Saída</th><th>Contrato</th>' : ''}
              </tr>
            </thead>
            <tbody>
              ${notas.map(nota => `
                <tr>
                  <td>${nota.numero_nota_fiscal}</td>
                  <td>${nota.cliente_destinatario}</td>
                  <td>${nota.data_coleta ? format(new Date(nota.data_coleta), 'dd/MM/yyyy') : 'N/A'}</td>
                  <td>${nota.data_prevista_entrega ? format(new Date(nota.data_prevista_entrega), 'dd/MM/yyyy') : 'N/A'}</td>
                  <td>${nota.cidade_destino}/${nota.estado_destino}</td>
                  <td>R$ ${nota.valor_nota_fiscal.toFixed(2)}</td>
                  ${activeTab === "emitidas" ? `
                    <td>${nota.data_saida ? format(new Date(nota.data_saida), 'dd/MM/yyyy') : 'N/A'}</td>
                    <td>${nota.contrato_id || 'N/A'}</td>
                  ` : ''}
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="data-geracao">
            Documento gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm:ss')}
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <button onclick="window.print();" style="padding: 10px 20px; background: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Imprimir
            </button>
          </div>
        </body>
      </html>
    `);
    
    janelaImpressao.document.close();
    janelaImpressao.focus();
    
    // Após renderizar o conteúdo, chama o método de impressão
    setTimeout(() => {
      janelaImpressao.print();
    }, 250);
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Relatório de Notas Fiscais" 
        description="Acompanhe as notas fiscais pendentes e emitidas"
        icon={<FileText />}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Relatórios", href: "/relatorios" },
          { label: "Notas Fiscais" }
        ]}
        actions={
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={exportarCSV}
              className="flex items-center gap-2"
            >
              <FileDown className="h-4 w-4" />
              Exportar CSV
            </Button>
            <Button 
              variant="outline" 
              onClick={imprimirRelatorio}
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
          </div>
        }
      />
      
      <div className="space-y-4">
        <Card className="p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Filtros</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium">Data Inicial</label>
                <Input 
                  type="date" 
                  value={periodoInicio}
                  onChange={(e) => setPeriodoInicio(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Data Final</label>
                <Input 
                  type="date" 
                  value={periodoFim}
                  onChange={(e) => setPeriodoFim(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Cliente</label>
                <Select 
                  value={filtroCliente} 
                  onValueChange={setFiltroCliente}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os clientes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os clientes</SelectItem>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente} value={cliente}>{cliente}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Busca</label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Nº NF, Cliente ou Cidade" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button 
                    onClick={handleSearch}
                    className="px-3"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="pendentes">
              Pendentes de Saída
              {notasPendentes.length > 0 && (
                <Badge variant="destructive" className="ml-2">{notasPendentes.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="emitidas">
              Com Saída Emitida
              {notasEmitidas.length > 0 && (
                <Badge variant="success" className="ml-2">{notasEmitidas.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pendentes" className="space-y-4">
            {carregando ? (
              <div className="text-center py-8">Carregando...</div>
            ) : notasPendentesFiltradas.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Sem notas pendentes</AlertTitle>
                <AlertDescription>
                  Não foram encontradas notas fiscais pendentes de saída para os filtros selecionados.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nº NF</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Coleta</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Prev. Entrega</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destino</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor NF</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {notasPendentesFiltradas.map((nota) => (
                      <tr key={nota.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{nota.numero_nota_fiscal}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{nota.cliente_destinatario}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {nota.data_coleta ? format(new Date(nota.data_coleta), 'dd/MM/yyyy') : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {nota.data_prevista_entrega ? format(new Date(nota.data_prevista_entrega), 'dd/MM/yyyy') : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {nota.cidade_destino}/{nota.estado_destino}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          R$ {nota.valor_nota_fiscal.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Badge variant="pendente">Pendente</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="emitidas" className="space-y-4">
            {carregando ? (
              <div className="text-center py-8">Carregando...</div>
            ) : notasEmitidasFiltradas.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Sem notas emitidas</AlertTitle>
                <AlertDescription>
                  Não foram encontradas notas fiscais com saída emitida para os filtros selecionados.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nº NF</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Coleta</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Saída</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destino</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor NF</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contrato</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {notasEmitidasFiltradas.map((nota) => (
                      <tr key={nota.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{nota.numero_nota_fiscal}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{nota.cliente_destinatario}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {nota.data_coleta ? format(new Date(nota.data_coleta), 'dd/MM/yyyy') : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {nota.data_saida ? format(new Date(nota.data_saida), 'dd/MM/yyyy') : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {nota.cidade_destino}/{nota.estado_destino}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          R$ {nota.valor_nota_fiscal.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {nota.contrato_id || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Badge variant="success">Emitida</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default RelatorioNotasEntradaSaida;
