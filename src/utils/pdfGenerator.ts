
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReportOptions {
  title: string;
  subtitle?: string;
  landscape?: boolean;
  filename?: string;
  columns: { header: string; dataKey: string; width?: number }[];
  data: any[];
  logoUrl?: string;
  empresaNome?: string;
  empresaEndereco?: string;
  empresaCnpj?: string;
}

export const generatePDF = async ({
  title,
  subtitle,
  landscape = false,
  filename,
  columns,
  data,
  logoUrl,
  empresaNome,
  empresaEndereco,
  empresaCnpj
}: ReportOptions) => {
  // Criar documento PDF
  const doc = new jsPDF({
    orientation: landscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Margens padrão (em mm)
  const marginLeft = 15;
  const marginTop = 15;
  const pageWidth = landscape ? 297 : 210;
  const contentWidth = pageWidth - (marginLeft * 2);
  
  // Adicionar data atual
  const dataAtual = format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  
  // Configurar cabeçalho com logo e dados da empresa
  let currentY = marginTop;
  
  // Tentar carregar o logo se fornecido
  if (logoUrl) {
    try {
      const img = new Image();
      img.src = logoUrl;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      
      // Calcular proporção para redimensionar mantendo o aspecto
      const imgWidth = 40; // largura máxima da logo em mm
      const imgHeight = (img.height * imgWidth) / img.width;
      
      doc.addImage(img, 'JPEG', marginLeft, currentY, imgWidth, imgHeight);
      
      // Informações da empresa à direita
      if (empresaNome) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(empresaNome, pageWidth - marginLeft - doc.getTextWidth(empresaNome), currentY + 5);
        
        if (empresaCnpj) {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.text(`CNPJ: ${empresaCnpj}`, pageWidth - marginLeft - doc.getTextWidth(`CNPJ: ${empresaCnpj}`), currentY + 10);
        }
        
        if (empresaEndereco) {
          doc.setFontSize(10);
          doc.text(empresaEndereco, pageWidth - marginLeft - doc.getTextWidth(empresaEndereco), currentY + 15);
        }
      }
      
      currentY += imgHeight + 10; // Avançar após a logo
    } catch (error) {
      console.error('Erro ao carregar logo:', error);
      // Se falhar, apenas avançar o Y um pouco para o título
      currentY += 5;
    }
  } else if (empresaNome) {
    // Se não tiver logo mas tiver nome da empresa
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(empresaNome, marginLeft, currentY + 7);
    
    if (empresaCnpj) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`CNPJ: ${empresaCnpj}`, marginLeft, currentY + 14);
    }
    
    if (empresaEndereco) {
      doc.setFontSize(10);
      doc.text(empresaEndereco, marginLeft, currentY + 21);
    }
    
    currentY += 30;
  }
  
  // Adicionar título e subtítulo
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  
  // Centralizar título
  const titleWidth = doc.getTextWidth(title);
  doc.text(title, (pageWidth - titleWidth) / 2, currentY);
  currentY += 10;
  
  if (subtitle) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const subtitleWidth = doc.getTextWidth(subtitle);
    doc.text(subtitle, (pageWidth - subtitleWidth) / 2, currentY);
    currentY += 8;
  }
  
  // Adicionar linha divisória
  doc.setDrawColor(200, 200, 200);
  doc.line(marginLeft, currentY, pageWidth - marginLeft, currentY);
  currentY += 5;
  
  // Adicionar data de geração
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Relatório gerado em: ${dataAtual}`, marginLeft, currentY);
  currentY += 8;
  
  // Preparar dados para tabela
  const tableData = data.map(item => {
    const row: any = {};
    columns.forEach(col => {
      row[col.dataKey] = item[col.dataKey] != null ? item[col.dataKey].toString() : '';
    });
    return row;
  });
  
  // Configurar cabeçalhos da tabela
  const tableHeaders = columns.map(col => ({
    header: col.header,
    dataKey: col.dataKey,
    width: col.width
  }));
  
  // Adicionar tabela ao documento
  (doc as any).autoTable({
    startY: currentY,
    head: [tableHeaders.map(header => header.header)],
    body: tableData.map(row => 
      tableHeaders.map(header => row[header.dataKey])
    ),
    margin: { left: marginLeft, right: marginLeft },
    theme: 'grid',
    headStyles: {
      fillColor: [51, 103, 214],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    columnStyles: tableHeaders.reduce((styles, header, index) => {
      if (header.width) {
        styles[index] = { cellWidth: header.width };
      }
      return styles;
    }, {} as Record<number, any>),
    didDrawPage: (data: any) => {
      // Adicionar rodapé em cada página
      const pageCount = doc.getNumberOfPages();
      const currentPage = data.pageNumber;
      
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Página ${currentPage} de ${pageCount}`, 
        pageWidth - marginLeft - 40, 
        doc.internal.pageSize.height - 10
      );
    }
  });

  // Salvar ou abrir PDF
  const finalFilename = filename || `${title.toLowerCase().replace(/\s+/g, '-')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  doc.save(finalFilename);
  
  return doc;
};

// Função auxiliar para gerar relatórios a partir de configurações de empresa
export const generateCompanyReport = async (options: ReportOptions) => {
  try {
    // Buscar configurações da empresa do localStorage
    const empresaDataStr = localStorage.getItem('dadosEmpresa');
    const logoEmpresa = localStorage.getItem('logoEmpresa');
    
    let empresaData = null;
    if (empresaDataStr) {
      try {
        empresaData = JSON.parse(empresaDataStr);
      } catch (e) {
        console.error('Erro ao processar dados da empresa:', e);
      }
    }

    // Mesclar com as opções fornecidas
    const reportConfig = {
      ...options,
      logoUrl: logoEmpresa || options.logoUrl,
      empresaNome: empresaData?.nome || options.empresaNome || 'ControlFrota',
      empresaCnpj: empresaData?.cnpj || options.empresaCnpj,
      empresaEndereco: empresaData?.endereco || options.empresaEndereco
    };

    return await generatePDF(reportConfig);
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    throw error;
  }
};
