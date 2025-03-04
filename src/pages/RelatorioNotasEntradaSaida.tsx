
import React, { useState, useEffect } from 'react';
import NewPageLayout from '@/components/layout/NewPageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DateRange } from 'react-day-picker';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { supabase } from '@/integrations/supabase/client';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState as useStateWrapper } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface Nota {
  id: number;
  numero_nota: string;
  data_coleta: string;
  data_entrega: string;
  cliente: string;
  valor: number;
  status: string;
}

const RelatorioNotasEntradaSaida = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  
  const [notas, setNotas] = useState<Nota[]>([]);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [totalValor, setTotalValor] = useState(0);
  const [totalNotas, setTotalNotas] = useState(0);
  const [notasPorStatus, setNotasPorStatus] = useState<Record<string, number>>({});
  
  const fetchData = async () => {
    if (!dateRange?.from || !dateRange?.to) return;
    
    setLoading(true);
    try {
      const startDate = format(dateRange.from, 'yyyy-MM-dd');
      const endDate = format(dateRange.to, 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('Notas')
        .select('*')
        .gte('data_coleta', startDate)
        .lte('data_coleta', endDate)
        .order('data_coleta', { ascending: false });
      
      if (error) throw error;
      
      setNotas(data || []);
      processData(data || []);
    } catch (error) {
      console.error('Erro ao buscar notas:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const processData = (data: Nota[]) => {
    // Calcular estatísticas
    let total = 0;
    const statusCount: Record<string, number> = {};
    
    data.forEach(nota => {
      total += nota.valor || 0;
      
      const status = nota.status || 'Pendente';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });
    
    setTotalValor(total);
    setTotalNotas(data.length);
    setNotasPorStatus(statusCount);
    
    // Preparar dados para o gráfico
    const notasPorData: Record<string, { count: number, valor: number }> = {};
    
    data.forEach(nota => {
      const dataFormatada = nota.data_coleta ? format(new Date(nota.data_coleta), 'dd/MM/yyyy') : 'Sem data';
      
      if (!notasPorData[dataFormatada]) {
        notasPorData[dataFormatada] = { count: 0, valor: 0 };
      }
      
      notasPorData[dataFormatada].count += 1;
      notasPorData[dataFormatada].valor += nota.valor || 0;
    });
    
    const chartDataArr = Object.entries(notasPorData).map(([data, { count, valor }]) => ({
      data,
      quantidade: count,
      valor
    }));
    
    // Ordenar por data
    chartDataArr.sort((a, b) => {
      const dateA = a.data.split('/').reverse().join('-');
      const dateB = b.data.split('/').reverse().join('-');
      return dateA.localeCompare(dateB);
    });
    
    setChartData(chartDataArr);
  };
  
  useEffect(() => {
    fetchData();
  }, [dateRange]);
  
  const exportarPDF = () => {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(18);
    doc.text('Relatório de Notas Fiscais', 14, 22);
    
    // Período
    doc.setFontSize(10);
    const periodoTexto = dateRange?.from && dateRange?.to 
      ? `Período: ${format(dateRange.from, 'dd/MM/yyyy')} a ${format(dateRange.to, 'dd/MM/yyyy')}` 
      : 'Período: Todos';
    doc.text(periodoTexto, 14, 30);
    
    // Estatísticas
    doc.setFontSize(12);
    doc.text('Estatísticas:', 14, 40);
    doc.setFontSize(10);
    doc.text(`Total de Notas: ${totalNotas}`, 14, 46);
    doc.text(`Valor Total: R$ ${totalValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, 52);
    
    // Status
    doc.setFontSize(12);
    doc.text('Status das Notas:', 14, 62);
    doc.setFontSize(10);
    
    let yPos = 68;
    Object.entries(notasPorStatus).forEach(([status, count]) => {
      doc.text(`${status}: ${count}`, 14, yPos);
      yPos += 6;
    });
    
    // Tabela de Notas
    doc.setFontSize(12);
    doc.text('Detalhamento de Notas:', 14, yPos + 10);
    
    const tableColumn = ["Número", "Data Coleta", "Cliente", "Valor", "Status"];
    const tableRows = notas.map(nota => [
      nota.numero_nota || '',
      nota.data_coleta ? format(new Date(nota.data_coleta), 'dd/MM/yyyy') : '',
      nota.cliente || '',
      `R$ ${(nota.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      nota.status || ''
    ]);
    
    // @ts-ignore - jspdf-autotable
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: yPos + 15,
      theme: 'grid',
      headStyles: { fillColor: [66, 133, 244], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });
    
    // Informações do documento
    doc.setFontSize(8);
    // @ts-ignore
    const finalY = doc.lastAutoTable.finalY || 280;
    doc.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, finalY + 10);
    doc.text('ControlFrota - Sistema de Gestão de Frota', 14, finalY + 15);
    
    // Salvar PDF
    doc.save(`relatorio-notas-${format(new Date(), 'yyyyMMdd-HHmm')}.pdf`);
  };
  
  const exportarExcel = () => {
    // Implementação simplificada para demonstração
    const rows = [
      ['Numero', 'Data Coleta', 'Cliente', 'Valor', 'Status'],
      ...notas.map(nota => [
        nota.numero_nota,
        nota.data_coleta ? format(new Date(nota.data_coleta), 'dd/MM/yyyy') : '',
        nota.cliente,
        nota.valor,
        nota.status
      ])
    ];
    
    let csvContent = "data:text/csv;charset=utf-8,";
    rows.forEach(rowArray => {
      const row = rowArray.join(",");
      csvContent += row + "\r\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio-notas-${format(new Date(), 'yyyyMMdd-HHmm')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const buscarDetalhesNota = (notaNumero: string) => {
    alert(`Detalhes da nota ${notaNumero}`);
  };
  
  return (
    <NewPageLayout>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Relatório de Notas Fiscais</h1>
          <p className="text-muted-foreground">Análise de entrada e saída de notas fiscais no período</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportarExcel}>
            Exportar Excel
          </Button>
          <Button variant="default" onClick={exportarPDF} className="flex items-center">
            <FileDown className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Selecione um período para análise</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <DateRangePicker 
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
              <Button onClick={fetchData} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Carregando
                  </>
                ) : 'Aplicar Filtros'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3 mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total de Notas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalNotas}</div>
                <p className="text-xs text-muted-foreground">notas no período</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {totalValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">em notas fiscais</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Por Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {Object.entries(notasPorStatus).map(([status, count]) => (
                    <div key={status} className="flex justify-between text-sm">
                      <span className={cn({
                        'text-green-600': status === 'Entregue',
                        'text-amber-600': status === 'Em Trânsito',
                        'text-blue-600': status === 'Pendente',
                        'text-red-600': status === 'Cancelada',
                      })}>
                        {status}:
                      </span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Notas por Data</CardTitle>
                <CardDescription>Quantidade e valor das notas no período</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <BarChart 
                  width={800} 
                  height={300} 
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="quantidade" fill="#8884d8" name="Quantidade" />
                  <Bar yAxisId="right" dataKey="valor" fill="#82ca9d" name="Valor (R$)" />
                </BarChart>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Detalhamento de Notas</CardTitle>
                <CardDescription>
                  {notas.length} {notas.length === 1 ? 'nota encontrada' : 'notas encontradas'} no período
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Número</TableHead>
                        <TableHead>Data Coleta</TableHead>
                        <TableHead>Data Entrega</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {notas.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            Nenhuma nota encontrada no período selecionado.
                          </TableCell>
                        </TableRow>
                      ) : (
                        notas.map((nota) => (
                          <TableRow key={nota.id}>
                            <TableCell className="font-medium">{nota.numero_nota}</TableCell>
                            <TableCell>
                              {nota.data_coleta ? format(new Date(nota.data_coleta), 'dd/MM/yyyy') : '—'}
                            </TableCell>
                            <TableCell>
                              {nota.data_entrega ? format(new Date(nota.data_entrega), 'dd/MM/yyyy') : '—'}
                            </TableCell>
                            <TableCell>{nota.cliente}</TableCell>
                            <TableCell>
                              R$ {(nota.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell>
                              <span className={cn("px-2 py-1 rounded-full text-xs", {
                                'bg-green-100 text-green-800': nota.status === 'Entregue',
                                'bg-amber-100 text-amber-800': nota.status === 'Em Trânsito',
                                'bg-blue-100 text-blue-800': nota.status === 'Pendente',
                                'bg-red-100 text-red-800': nota.status === 'Cancelada',
                              })}>
                                {nota.status || 'Pendente'}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => buscarDetalhesNota(nota.numero_nota)}
                              >
                                Detalhes
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </NewPageLayout>
  );
};

export default RelatorioNotasEntradaSaida;
