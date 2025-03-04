
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { SaldoPagarItem } from '@/types/contabilidade';
import { ContaContabil } from '@/types/contabilidade';

// Função para adicionar cabeçalho padrão nos relatórios
const adicionarCabecalho = (doc: jsPDF, titulo: string) => {
  const logoEmpresa = localStorage.getItem('logoEmpresa');
  const dadosEmpresaStr = localStorage.getItem('dadosEmpresa');
  const dadosEmpresa = dadosEmpresaStr ? JSON.parse(dadosEmpresaStr) : { 
    nome: 'ControlFrota', 
    cnpj: '', 
    endereco: '' 
  };

  // Adicionar logo se existir
  if (logoEmpresa) {
    doc.addImage(logoEmpresa, 'JPEG', 14, 10, 30, 20);
    doc.setFontSize(10);
  } else {
    doc.setFontSize(20);
    doc.text(dadosEmpresa.nome || 'ControlFrota', 14, 20);
    doc.setFontSize(10);
  }

  // Dados da empresa
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  if (dadosEmpresa.cnpj) {
    doc.text(`CNPJ: ${dadosEmpresa.cnpj}`, 14, 35);
  }
  if (dadosEmpresa.endereco) {
    doc.text(dadosEmpresa.endereco, 14, 40);
  }

  // Título do relatório
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(titulo, doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });
  
  // Data da impressão
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 
    doc.internal.pageSize.getWidth() - 15, 10, { align: 'right' });
    
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
};

// Gerar relatório de Saldo a Pagar
export const gerarRelatorioSaldoPagar = (
  itens: SaldoPagarItem[], 
  filtro?: {dataInicio?: string, dataFim?: string, status?: string}
) => {
  const doc = new jsPDF();
  
  // Adicionar cabeçalho
  adicionarCabecalho(doc, 'RELATÓRIO DE SALDO A PAGAR');
  
  // Informações do filtro
  doc.setFontSize(9);
  let posY = 45;
  
  if (filtro) {
    if (filtro.dataInicio && filtro.dataFim) {
      doc.text(`Período: ${filtro.dataInicio} a ${filtro.dataFim}`, 14, posY);
      posY += 5;
    }
    
    if (filtro.status) {
      doc.text(`Status: ${filtro.status}`, 14, posY);
      posY += 5;
    }
  }
  
  // Calcular total
  const totalValor = itens.reduce((sum, item) => sum + (item.valor_total || 0), 0);
  const totalPago = itens.reduce((sum, item) => sum + (item.valor_pago || 0), 0);
  const totalRestante = itens.reduce((sum, item) => sum + (item.saldo_restante || 0), 0);
  
  doc.text(`Total de Registros: ${itens.length}`, 14, posY);
  posY += 5;
  doc.text(`Valor Total: R$ ${totalValor.toFixed(2)}`, 14, posY);
  posY += 5;
  doc.text(`Total Pago: R$ ${totalPago.toFixed(2)}`, 14, posY);
  posY += 5;
  doc.text(`Saldo Restante: R$ ${totalRestante.toFixed(2)}`, 14, posY);
  posY += 10;
  
  // Adicionar tabela
  autoTable(doc, {
    startY: posY,
    head: [['ID', 'Parceiro', 'Valor Total', 'Pago', 'Restante', 'Vencimento', 'Status']],
    body: itens.map(item => [
      item.id || '',
      item.parceiro || '',
      `R$ ${(item.valor_total || 0).toFixed(2)}`,
      `R$ ${(item.valor_pago || 0).toFixed(2)}`,
      `R$ ${(item.saldo_restante || 0).toFixed(2)}`,
      item.vencimento ? format(new Date(item.vencimento), 'dd/MM/yyyy') : '',
      item.status || 'pendente'
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 66, 66] }
  });
  
  // Rodapé
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(8);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.getWidth() / 2, 
      doc.internal.pageSize.getHeight() - 10, { align: 'center' });
  }
  
  return doc;
};

// Gerar relatório de Plano de Contas
export const gerarRelatorioPlanoConta = (contas: ContaContabil[]) => {
  const doc = new jsPDF();
  
  // Adicionar cabeçalho
  adicionarCabecalho(doc, 'PLANO DE CONTAS');
  
  // Informações gerais
  doc.setFontSize(9);
  doc.text(`Total de Contas: ${contas.length}`, 14, 45);
  
  // Ordenar contas por código
  const contasOrdenadas = [...contas].sort((a, b) => a.codigo.localeCompare(b.codigo));
  
  // Adicionar tabela
  autoTable(doc, {
    startY: 55,
    head: [['Código', 'Nome', 'Tipo', 'Natureza', 'Nível', 'Status']],
    body: contasOrdenadas.map(conta => [
      conta.codigo,
      conta.nome,
      conta.tipo,
      conta.natureza,
      conta.nivel.toString(),
      conta.status
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 66, 66] }
  });
  
  // Rodapé
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(8);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.getWidth() / 2, 
      doc.internal.pageSize.getHeight() - 10, { align: 'center' });
  }
  
  return doc;
};

// Exportar outras funções conforme necessário
export const gerarRelatorio = (tipo: string, dados: any, filtros?: any) => {
  switch (tipo) {
    case 'saldopagar':
      return gerarRelatorioSaldoPagar(dados, filtros);
    case 'planocontas':
      return gerarRelatorioPlanoConta(dados);
    default:
      throw new Error('Tipo de relatório não suportado');
  }
};
