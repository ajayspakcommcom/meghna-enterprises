const pdf = require('html-pdf-node');
const fs = require('fs');

const html = '<h1>Hello, World!...</h1>';
const file = { content: html };

(async () => {
    try {
        const pdfBuffer = await pdf.generatePdf(file, { format: 'A4' });
        fs.writeFileSync('billing.pdf', pdfBuffer);
        console.log('PDF generated successfully!');
    } catch (error) {
        console.error("Error generating PDF:", error);
    }
})();
