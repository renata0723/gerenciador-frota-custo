
import 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    getNumberOfPages(): number;
    setTextColor(r: number, g: number, b: number): jsPDF;
    setFontSize(size: number): jsPDF;
    setFont(fontName: string, fontStyle?: string): jsPDF;
    text(text: string, x: number, y: number, options?: any): jsPDF;
    setPage(pageNumber: number): jsPDF;
    internal: {
      pageSize: {
        width: number;
        height: number;
        getWidth: () => number;
        getHeight: () => number;
      };
      pages: any[];
      events: any;
      scaleFactor: number;
      getNumberOfPages(): number;
      getEncryptor(objectId: number): (data: string) => string;
    };
  }
}
