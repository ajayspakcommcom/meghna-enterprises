declare module 'html2pdf.js' {
    interface Html2PdfOptions {
        margin?: number;
        filename?: string;
        image?: { type?: string; quality?: number };
        html2canvas?: { scale?: number; logging?: boolean };
        jsPDF?: { unit?: string; format?: string; orientation?: string };
    }

    function html2pdf(): {
        set(options: Html2PdfOptions): this;
        from(element: HTMLElement): this;
        save(filename?: string): Promise<void>;
    }

    export default html2pdf;
}
