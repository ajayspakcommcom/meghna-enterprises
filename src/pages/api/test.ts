// import path from "path";

// const pdf = require('html-pdf-node');
// const fs = require('fs');

// const html = '<h1>Hello, World!...</h1>';
// const file = { content: html };

// (async () => {
//     try {
//         const pdfBuffer = await pdf.generatePdf(file, { format: 'A4' });
//         const pdfPath = path.join(process.cwd(), 'public', 'pdf', 'billing.pdf');
//         fs.writeFileSync(pdfPath, pdfBuffer);
//         console.log('PDF generated successfully!');
//     } catch (error) {
//         console.error("Error generating PDF:", error);
//     }
// })();

import puppeteer from 'puppeteer';
import path from "path";

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent('<h1>Hello, World!</h1>');
    await page.pdf({ path: path.join(process.cwd(), 'public', 'pdf', 'billing.pdf'), format: 'A4' });
    await browser.close();
})();