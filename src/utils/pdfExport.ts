
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

interface ExportConfig {
  title: string;
  fileName: string;
  headers: string[];
  data: any[][];
  subtitle?: string;
}

/**
 * Função para exportar dados para PDF com layout padrão da empresa
 */
export const exportarParaPDF = (config: ExportConfig) => {
  try {
    const doc = new jsPDF();
    
    // Adicionar cabeçalho com logo e dados da empresa
    doc.setFontSize(20);
    doc.text('SSLOG Transportes LTDA', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('CNPJ: 44.712.877/0001-80', 105, 30, { align: 'center' });
    doc.text('Rua Vagner Luis Boscardin, 7015 - Aguas Claras - Piraquara/PR', 105, 35, { align: 'center' });
    
    // Título do relatório
    doc.setFontSize(16);
    doc.text(config.title, 105, 50, { align: 'center' });
    
    // Subtítulo opcional
    if (config.subtitle) {
      doc.setFontSize(12);
      doc.text(config.subtitle, 105, 58, { align: 'center' });
    }
    
    // Data de geração
    doc.setFontSize(10);
    doc.text(`Data de geração: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 105, 65, { align: 'center' });
    
    // Adicionar tabela de dados
    // @ts-ignore - jsPDF-AutoTable é adicionado ao objeto jsPDF
    doc.autoTable({
      startY: 70,
      head: [config.headers],
      body: config.data,
      theme: 'striped',
      headStyles: { fillColor: [41, 80, 149], textColor: 255 }
    });
    
    // Adicionar rodapé
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Página ${i} de ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });
      doc.text(`SSLOG Transportes LTDA - Sistema de Controle de Frotas e Logística`, 105, doc.internal.pageSize.height - 5, { align: 'center' });
    }
    
    // Salvar o PDF
    doc.save(`${config.fileName}.pdf`);
    return true;
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    return false;
  }
};
