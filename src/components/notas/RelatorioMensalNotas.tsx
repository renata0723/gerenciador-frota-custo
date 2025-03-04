
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FileDown, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Importar jsPDF e autotable corretamente
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface RelatorioMensalNotasProps {
  permissoes: string[];
}

const RelatorioMensalNotas: React.FC<RelatorioMensalNotasProps> = ({ permissoes }) => {
  const [mesAno, setMesAno] = useState(format(new Date(), 'yyyy-MM'));
  const [dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [ano, mes] = mesAno.split('-');
      const { data, error } = await supabase
        .from('Notas Fiscais')
        .select('*')
        .like('data_coleta', `${ano}-${mes}%`);

      if (error) throw error;
      setDados(data || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar relatório mensal');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permissoes.includes('visualizar_relatorios')) {
      carregarDados();
    }
  }, [mesAno, permissoes]);

  const exportarRelatorio = () => {
    if (!permissoes.includes('exportar_relatorios')) {
      toast.error('Você não tem permissão para exportar relatórios');
      return;
    }

    try {
      const doc = new jsPDF();
      
      // Cabeçalho
      doc.setFontSize(16);
      doc.text('Relatório Mensal de Notas Fiscais', 14, 15);
      doc.setFontSize(12);
      doc.text(`Período: ${format(new Date(mesAno), 'MMMM/yyyy', { locale: ptBR })}`, 14, 25);

      // Tabela
      const tableRows = dados.map(nota => [
        nota.numero_nota_fiscal || '',
        nota.data_coleta ? format(new Date(nota.data_coleta), 'dd/MM/yyyy') : '',
        nota.cliente_destinatario || '',
        nota.cidade_destino || '',
        `R$ ${(nota.valor_nota_fiscal || 0).toFixed(2)}`,
        nota.status_nota || ''
      ]);

      autoTable(doc, {
        head: [['Nº Nota', 'Data Coleta', 'Cliente', 'Destino', 'Valor', 'Status']],
        body: tableRows,
        startY: 35,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [41, 108, 196] }
      });

      // Totais
      const totalNotas = dados.length;
      const valorTotal = dados.reduce((sum, nota) => sum + (nota.valor_nota_fiscal || 0), 0);

      const finalY = (doc as any).lastAutoTable.finalY || 150;
      
      doc.setFontSize(10);
      doc.text(`Total de Notas: ${totalNotas}`, 14, finalY + 10);
      doc.text(`Valor Total: R$ ${valorTotal.toFixed(2)}`, 14, finalY + 20);

      // Download
      doc.save(`relatorio_notas_${mesAno}.pdf`);
      toast.success('Relatório exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      toast.error('Erro ao exportar relatório');
    }
  };

  const mesesDisponiveis = () => {
    const meses = [];
    const dataAtual = new Date();
    
    for (let i = 0; i < 12; i++) {
      const data = new Date(dataAtual.getFullYear(), dataAtual.getMonth() - i, 1);
      const valor = format(data, 'yyyy-MM');
      const label = format(data, 'MMMM/yyyy', { locale: ptBR });
      meses.push({ valor, label });
    }
    
    return meses;
  };

  if (!permissoes.includes('visualizar_relatorios')) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-medium flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          Relatório Mensal de Notas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Select value={mesAno} onValueChange={setMesAno}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selecione o mês" />
            </SelectTrigger>
            <SelectContent>
              {mesesDisponiveis().map(mes => (
                <SelectItem key={mes.valor} value={mes.valor}>
                  {mes.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {permissoes.includes('exportar_relatorios') && (
            <Button 
              variant="outline" 
              onClick={exportarRelatorio}
              disabled={loading || dados.length === 0}
              className="w-full sm:w-auto"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Exportar Relatório
            </Button>
          )}
        </div>

        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total de Notas</p>
              <p className="text-2xl font-semibold">{dados.length}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Valor Total</p>
              <p className="text-2xl font-semibold">
                R$ {dados.reduce((sum, nota) => sum + (nota.valor_nota_fiscal || 0), 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Entregues</p>
              <p className="text-2xl font-semibold text-green-600">
                {dados.filter(nota => nota.status_nota === 'Entregue').length}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Em Trânsito</p>
              <p className="text-2xl font-semibold text-blue-600">
                {dados.filter(nota => nota.status_nota === 'Em trânsito').length}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatorioMensalNotas;
