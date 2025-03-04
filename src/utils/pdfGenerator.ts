
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ContaContabil } from '@/types/contabilidade';
import { formataMoeda } from './constants';

export const gerarRelatorioPlanoConta = (contas: ContaContabil[]) => {
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text('Plano de Contas Contábil', 14, 20);
  
  const headers = [['Código', 'Código Red.', 'Nome', 'Tipo', 'Natureza']];
  const data = contas.map(conta => [
    conta.codigo,
    conta.codigo_reduzido,
    conta.nome,
    conta.tipo,
    conta.natureza
  ]);

  autoTable(doc, {
    head: headers,
    body: data,
    startY: 30,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 65, 171] }
  });

  doc.save('plano-contas.pdf');
};

export const gerarRelatorioNotasFiscais = (notas: any[], mes: string) => {
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text(`Relatório de Notas Fiscais - ${mes}`, 14, 20);
  
  const headers = [['Nº Nota', 'Cliente', 'Valor', 'Data Coleta', 'Status']];
  const data = notas.map(nota => [
    nota.id,
    nota.client,
    formataMoeda(parseFloat(nota.value.replace('R$ ', '').replace('.', '').replace(',', '.'))),
    nota.date,
    nota.status
  ]);

  autoTable(doc, {
    head: headers,
    body: data,
    startY: 30,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 65, 171] }
  });

  doc.save(`notas-fiscais-${mes}.pdf`);
};
