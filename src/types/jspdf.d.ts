
// Definição de tipos para jspdf e jspdf-autotable
declare module 'jspdf' {
  export interface jsPDF {
    getNumberOfPages: () => number;
    internal: {
      pageSize: {
        width: number;
        getWidth: () => number;
        height: number;
        getHeight: () => number;
      };
      [key: string]: any;
    };
    [key: string]: any;
  }
  
  // Outras definições específicas conforme necessário
  
  export default class JSPdf {
    constructor(options?: any);
    text(text: string, x: number, y: number, options?: any): JSPdf;
    setFontSize(size: number): JSPdf;
    setFont(font: string, style?: string): JSPdf;
    addPage(options?: any): JSPdf;
    setPage(pageNumber: number): JSPdf;
    addImage(imageData: any, format: string, x: number, y: number, width: number, height: number, alias?: string, compression?: any, rotation?: number): JSPdf;
    save(filename?: string): JSPdf;
    output(type: string, options?: any): any;
    setTextColor(r: number, g?: number, b?: number): JSPdf;
    setDrawColor(r: number, g?: number, b?: number): JSPdf;
    setFillColor(r: number, g?: number, b?: number): JSPdf;
    setLineWidth(width: number): JSPdf;
    line(x1: number, y1: number, x2: number, y2: number): JSPdf;
    rect(x: number, y: number, w: number, h: number, style?: string): JSPdf;
    roundedRect(x: number, y: number, w: number, h: number, rx: number, ry: number, style?: string): JSPdf;
    ellipse(x: number, y: number, rx: number, ry: number, style?: string): JSPdf;
    circle(x: number, y: number, r: number, style?: string): JSPdf;
    setProperties(properties: any): JSPdf;
    getNumberOfPages(): number;
    getCurrentPageInfo(): any;
    getFontList(): any;
    getDrawColor(): string;
    getTextColor(): string;
    getFillColor(): string;
    getLineWidth(): number;
    getFont(): any;
    getFontSize(): number;
    getPageInfo(pageNumberOneBased: number): any;
    getFileId(): string;
    dispose(): void;
    deletePage(pageNumber: number): JSPdf;
    movePage(targetPage: number, beforePage: number): JSPdf;
    insertPage(beforePage?: number): JSPdf;
    autoPrint(options?: any): JSPdf;
    setDocumentProperties(properties: any): JSPdf;
    setLanguage(language: string): JSPdf;
  }
}

declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf';
  
  interface AutoTableColumn {
    title?: string;
    dataKey?: string | number;
    header?: string;
    footer?: string;
    width?: number;
    styles?: any;
    headerStyles?: any;
    footerStyles?: any;
    cellStyles?: any;
    [key: string]: any;
  }
  
  interface AutoTableSettings {
    head?: any[][];
    body?: any[][];
    foot?: any[][];
    columns?: AutoTableColumn[];
    margin?: { top?: number; right?: number; bottom?: number; left?: number } | number;
    startY?: number;
    didDrawPage?: (data: any) => void;
    willDrawCell?: (data: any) => void;
    didDrawCell?: (data: any) => void;
    didParseCell?: (data: any) => void;
    headStyles?: any;
    bodyStyles?: any;
    footStyles?: any;
    alternateRowStyles?: any;
    columnStyles?: { [key: string]: any };
    styles?: any;
    tableWidth?: string;
    theme?: 'striped' | 'grid' | 'plain';
    tableLineWidth?: number;
    tableLineColor?: number | string;
    showHead?: 'everyPage' | 'firstPage' | 'never';
    showFoot?: 'everyPage' | 'lastPage' | 'never';
    horizontalPageBreak?: boolean;
    horizontalPageBreakRepeat?: number | string;
    includeHiddenHtml?: boolean;
    pageBreak?: 'auto' | 'avoid' | 'always';
    rowPageBreak?: 'auto' | 'avoid';
    [key: string]: any;
  }
  
  interface AutoTableOutput {
    previous?: AutoTableOutput;
    pageNumber?: number;
    pageCount?: number;
    settings?: AutoTableSettings;
    cursor?: { x: number; y: number };
    lastAutoTable?: boolean;
    table?: any;
    finalY?: number;
    [key: string]: any;
  }
  
  function autoTable(doc: jsPDF, settings: AutoTableSettings): AutoTableOutput;
  function autoTable(doc: jsPDF, columns: (string | AutoTableColumn)[], body: any[][], settings?: AutoTableSettings): AutoTableOutput;
  
  export default autoTable;
}
