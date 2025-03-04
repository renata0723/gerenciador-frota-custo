
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ContaContabil } from '@/types/contabilidade';
import { formataMoeda } from './constants';
import { formatCurrency, formatDate } from './formatters';

// Função para adicionar cabeçalho padrão em todos os PDFs gerados
const adicionarCabecalhoPadrao = (doc: jsPDF, titulo: string) => {
  // Tenta carregar a logo da empresa do localStorage
  const logoEmpresa = localStorage.getItem('logoEmpresa');
  const dadosEmpresa = localStorage.getItem('dadosEmpresa');
  let empresaInfo = { nome: 'ControlFrota', cnpj: '', endereco: '' };
  
  if (dadosEmpresa) {
    try {
      empresaInfo = JSON.parse(dadosEmpresa);
    } catch (e) {
      console.error('Erro ao carregar dados da empresa:', e);
    }
  }
  
  // Adiciona a logo se existir
  if (logoEmpresa) {
    try {
      doc.addImage(logoEmpresa, 'PNG', 14, 10, 40, 20);
      // Ajusta o título para não sobrepor a logo
      doc.setFontSize(16);
      doc.text(titulo, doc.internal.pageSize.width / 2, 20, { align: 'center' });
    } catch (e) {
      console.error('Erro ao adicionar logo:', e);
      // Centraliza o título se houver erro na logo
      doc.setFontSize(18);
      doc.text(titulo, doc.internal.pageSize.width / 2, 20, { align: 'center' });
    }
  } else {
    // Centraliza o título se não houver logo
    doc.setFontSize(18);
    doc.text(titulo, doc.internal.pageSize.width / 2, 20, { align: 'center' });
  }
  
  // Adiciona informações da empresa
  doc.setFontSize(10);
  doc.text(empresaInfo.nome, doc.internal.pageSize.width - 15, 15, { align: 'right' });
  
  if (empresaInfo.cnpj) {
    doc.text(`CNPJ: ${empresaInfo.cnpj}`, doc.internal.pageSize.width - 15, 20, { align: 'right' });
  }
  
  if (empresaInfo.endereco) {
    doc.text(empresaInfo.endereco, doc.internal.pageSize.width - 15, 25, { align: 'right' });
  }
  
  // Adiciona linha separadora após o cabeçalho
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 35, doc.internal.pageSize.width - 14, 35);
  
  // Retorna a posição Y após o cabeçalho para começar o conteúdo
  return 45; // Posição Y após o cabeçalho
};

// Função para adicionar rodapé padrão
const adicionarRodapePadrao = (doc: jsPDF) => {
  const totalPages = doc.getNumberOfPages();
  
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Adiciona linha antes do rodapé
    doc.setDrawColor(200, 200, 200);
    doc.line(14, doc.internal.pageSize.height - 20, doc.internal.pageSize.width - 14, doc.internal.pageSize.height - 20);
    
    // Adiciona data de geração
    doc.setFontSize(8);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, doc.internal.pageSize.height - 10);
    
    // Adiciona número da página
    doc.text(`Página ${i} de ${totalPages}`, doc.internal.pageSize.width - 14, doc.internal.pageSize.height - 10, { align: 'right' });
  }
};

export const gerarRelatorioPlanoConta = (contas: ContaContabil[]) => {
  const doc = new jsPDF();
  
  const startY = adicionarCabecalhoPadrao(doc, 'Plano de Contas Contábil');
  
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
    startY: startY,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 65, 171] }
  });

  adicionarRodapePadrao(doc);
  doc.save('plano-contas.pdf');
};

export const gerarRelatorioNotasFiscais = (notas: any[], mes: string) => {
  const doc = new jsPDF();
  
  const startY = adicionarCabecalhoPadrao(doc, `Relatório de Notas Fiscais - ${mes}`);
  
  const headers = [['Nº Nota', 'Cliente', 'Valor', 'Data Coleta', 'Status']];
  const data = notas.map(nota => [
    nota.id || nota.numero_nota_fiscal,
    nota.client || nota.cliente_destinatario,
    formatCurrency(nota.value || nota.valor_nota_fiscal),
    formatDate(nota.date || nota.data_coleta),
    nota.status || nota.status_nota
  ]);

  autoTable(doc, {
    head: headers,
    body: data,
    startY: startY,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 65, 171] }
  });

  adicionarRodapePadrao(doc);
  doc.save(`notas-fiscais-${mes}.pdf`);
};

export const gerarRelatorioContratos = (contratos: any[], periodo: string) => {
  const doc = new jsPDF();
  
  const startY = adicionarCabecalhoPadrao(doc, `Relatório de Contratos - ${periodo}`);
  
  const headers = [['Nº Contrato', 'Cliente', 'Origem/Destino', 'Valor Frete', 'Status']];
  const data = contratos.map(contrato => [
    contrato.id,
    contrato.cliente_destino,
    `${contrato.cidade_origem}/${contrato.cidade_destino}`,
    formatCurrency(contrato.valor_frete),
    contrato.status_contrato
  ]);

  autoTable(doc, {
    head: headers,
    body: data,
    startY: startY,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 65, 171] }
  });

  adicionarRodapePadrao(doc);
  doc.save(`contratos-${periodo}.pdf`);
};

export const gerarRelatorioSaldoPagar = (saldos: any[]) => {
  const doc = new jsPDF();
  
  const startY = adicionarCabecalhoPadrao(doc, 'Relatório de Saldos a Pagar');
  
  const headers = [['Parceiro', 'Contratos', 'Valor Total', 'Valor Pago', 'Saldo Restante', 'Vencimento']];
  const data = saldos.map(saldo => [
    saldo.parceiro,
    saldo.contratos_associados || '-',
    formatCurrency(saldo.valor_total),
    formatCurrency(saldo.valor_pago),
    formatCurrency(saldo.valor_total - (saldo.valor_pago || 0)),
    formatDate(saldo.vencimento || saldo.data_vencimento)
  ]);

  autoTable(doc, {
    head: headers,
    body: data,
    startY: startY,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 65, 171] }
  });

  adicionarRodapePadrao(doc);
  doc.save('saldos-a-pagar.pdf');
};

export const gerarRelatorioVeiculos = (veiculos: any[]) => {
  const doc = new jsPDF();
  
  const startY = adicionarCabecalhoPadrao(doc, 'Relatório de Veículos');
  
  const headers = [['Placa Cavalo', 'Placa Carreta', 'Tipo', 'Status', 'Proprietário']];
  const data = veiculos.map(veiculo => [
    veiculo.placa_cavalo,
    veiculo.placa_carreta || '-',
    veiculo.tipo_frota === 'frota' ? 'Próprio' : 'Terceirizado',
    veiculo.status_veiculo || 'Ativo',
    veiculo.proprietario || '-'
  ]);

  autoTable(doc, {
    head: headers,
    body: data,
    startY: startY,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 65, 171] }
  });

  adicionarRodapePadrao(doc);
  doc.save('veiculos.pdf');
};

export const gerarRelatorioLancamentosContabeis = (lancamentos: any[], periodo: string) => {
  const doc = new jsPDF();
  
  const startY = adicionarCabecalhoPadrao(doc, `Relatório de Lançamentos Contábeis - ${periodo}`);
  
  const headers = [['Data', 'Histórico', 'Conta Débito', 'Conta Crédito', 'Valor']];
  const data = lancamentos.map(lanc => [
    formatDate(lanc.data_lancamento),
    lanc.historico,
    lanc.conta_debito_nome || lanc.conta_debito,
    lanc.conta_credito_nome || lanc.conta_credito,
    formatCurrency(lanc.valor)
  ]);

  autoTable(doc, {
    head: headers,
    body: data,
    startY: startY,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 65, 171] }
  });

  adicionarRodapePadrao(doc);
  doc.save(`lancamentos-contabeis-${periodo}.pdf`);
};

export const gerarRelatorioDespesasGerais = (despesas: any[], periodo: string) => {
  const doc = new jsPDF();
  
  const startY = adicionarCabecalhoPadrao(doc, `Relatório de Despesas Gerais - ${periodo}`);
  
  const headers = [['Data', 'Tipo', 'Valor', 'Descrição', 'Contabilizado']];
  const data = despesas.map(despesa => [
    formatDate(despesa.data_despesa),
    despesa.tipo_despesa || '-',
    formatCurrency(despesa.valor_despesa),
    despesa.descricao_detalhada || '-',
    despesa.contabilizado ? 'Sim' : 'Não'
  ]);

  autoTable(doc, {
    head: headers,
    body: data,
    startY: startY,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 65, 171] }
  });

  adicionarRodapePadrao(doc);
  doc.save(`despesas-gerais-${periodo}.pdf`);
};
