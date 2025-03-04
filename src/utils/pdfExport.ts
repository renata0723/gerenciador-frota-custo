
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Função para adicionar o cabeçalho comum em PDFs gerados
export const adicionarCabecalhoPDF = (doc: jsPDF, titulo: string) => {
  // Logo da empresa
  // doc.addImage('logo.png', 'PNG', 15, 10, 35, 15);
  
  // Título do relatório
  doc.setFontSize(18);
  doc.setTextColor(41, 80, 149);
  doc.text(titulo, 105, 25, { align: 'center' });
  
  // Dados da empresa
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('SSLOG Transportes LTDA', 105, 35, { align: 'center' });
  doc.text('CNPJ: 44.712.877/0001-80', 105, 40, { align: 'center' });
  doc.text('Rua Vagner Luis Boscardin, 7015 - Águas Claras - Piraquara/PR', 105, 45, { align: 'center' });
  
  // Data do relatório
  const dataAtual = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  doc.setFontSize(9);
  doc.text(`Relatório gerado em: ${dataAtual}`, 105, 55, { align: 'center' });
  
  return 65; // Retorna a posição Y para iniciar a tabela
};

// Função para adicionar o rodapé padrão
export const adicionarRodapePDF = (doc: jsPDF) => {
  // Obter o número total de páginas
  // Usando tipagem para acessar a propriedade interna do jsPDF
  const totalPages = (doc as any).internal.getNumberOfPages();
  
  // Adicionar rodapé em todas as páginas
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Página ${i} de ${totalPages}`,
      105,
      doc.internal.pageSize.height - 15,
      { align: 'center' }
    );
    doc.text(
      'SSLOG Transportes LTDA - Sistema de Controle de Frotas e Logística',
      105,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
    
    // Adicionar data e hora no rodapé
    const dataHora = format(new Date(), 'dd/MM/yyyy HH:mm');
    doc.text(
      `Gerado em: ${dataHora}`,
      doc.internal.pageSize.width - 15,
      doc.internal.pageSize.height - 10,
      { align: 'right' }
    );
  }
};

// Função genérica para exportar relatórios
export const exportarRelatorioPDF = (
  nome: string,
  titulo: string,
  cabecalhos: string[],
  dados: any[][],
  opcoes?: any
) => {
  try {
    const doc = new jsPDF();
    
    // Adiciona o cabeçalho padrão e obtém a posição Y para iniciar a tabela
    const startY = adicionarCabecalhoPDF(doc, titulo);
    
    // Adiciona a tabela com os dados
    // @ts-ignore
    doc.autoTable({
      head: [cabecalhos],
      body: dados,
      startY: startY,
      theme: 'grid',
      headStyles: {
        fillColor: [41, 80, 149],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      ...opcoes
    });
    
    // Adiciona o rodapé padrão
    adicionarRodapePDF(doc);
    
    // Salva o PDF
    doc.save(`${nome}_${format(new Date(), 'yyyyMMdd_HHmmss')}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    return false;
  }
};
