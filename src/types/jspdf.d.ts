
declare module 'jspdf' {
  interface jsPDF {
    internal: any;
    setFontSize: (size: number) => void;
    setTextColor: (r: number, g: number, b: number) => void;
    setFillColor: (r: number, g: number, b: number) => void;
    rect: (x: number, y: number, width: number, height: number, style: string) => void;
    text: (text: string, x: number, y: number, options?: any) => jsPDF;
    addImage: (imageData: string, format: string, x: number, y: number, width: number, height: number, alias?: string, compression?: string, rotation?: number) => jsPDF;
    save: (filename: string) => void;
    output: (type: string, options?: any) => any;
    addPage: () => void;
    getNumberOfPages: () => number;
    setPage: (pageNumber: number) => jsPDF;
    line: (x1: number, y1: number, x2: number, y2: number) => jsPDF;
    getTextWidth: (text: string) => number;
    getStringUnitWidth: (text: string) => number;
    getFontSize: () => number;
    setFont: (fontName: string, fontStyle?: string) => jsPDF;
    setLineWidth: (width: number) => jsPDF;
    setDrawColor: (r: number, g: number, b: number) => jsPDF;
    circle: (x: number, y: number, r: number, style: string) => jsPDF;
    ellipse: (x: number, y: number, rx: number, ry: number, style: string) => jsPDF;
    setProperties: (properties: any) => jsPDF;
    CapJoinStyles: any;
    version: string;
    compatAPI: any;
    advancedAPI: any;
  }

  // Alias para JSPdf
  type JSPdf = jsPDF;

  export default class JsPDF {
    constructor(options?: any);
    internal: any;
    setFontSize: (size: number) => void;
    setTextColor: (r: number, g: number, b: number) => void;
    setFillColor: (r: number, g: number, b: number) => void;
    rect: (x: number, y: number, width: number, height: number, style: string) => void;
    text: (text: string, x: number, y: number, options?: any) => jsPDF;
    addImage: (imageData: string, format: string, x: number, y: number, width: number, height: number, alias?: string, compression?: string, rotation?: number) => jsPDF;
    save: (filename: string) => void;
    output: (type: string, options?: any) => any;
    addPage: () => void;
    getNumberOfPages: () => number;
    setPage: (pageNumber: number) => jsPDF;
    line: (x1: number, y1: number, x2: number, y2: number) => jsPDF;
    getTextWidth: (text: string) => number;
    getStringUnitWidth: (text: string) => number;
    getFontSize: () => number;
    setFont: (fontName: string, fontStyle?: string) => jsPDF;
    setLineWidth: (width: number) => jsPDF;
    setDrawColor: (r: number, g: number, b: number) => jsPDF;
    circle: (x: number, y: number, r: number, style: string) => jsPDF;
    ellipse: (x: number, y: number, rx: number, ry: number, style: string) => jsPDF;
    setProperties: (properties: any) => jsPDF;
    CapJoinStyles: any;
    version: string;
    compatAPI: any;
    advancedAPI: any;
  }
}
