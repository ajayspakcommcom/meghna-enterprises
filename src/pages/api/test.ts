// const pdf = require('html-pdf-node');
// const fs = require('fs');

// const html = '<h1>Hello, World!...</h1>';
// const file = { content: html };

// (async () => {
//     try {
//         const pdfBuffer = await pdf.generatePdf(file, { format: 'A4' });
//         fs.writeFileSync('../../pdf/billing.pdf', pdfBuffer);
//         console.log('PDF generated successfully!');
//     } catch (error) {
//         console.error("Error generating PDF:", error);
//     }
// })();


import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import runMiddleware from './libs/runMiddleware';
import connectToMongoDB from './libs/mongodb';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const cors = Cors({
    methods: ['GET', 'OPTIONS'],
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectToMongoDB();
    await runMiddleware(req, res, cors);

    if (req.method === 'POST') {
        switch (req.body.type) {
            case 'HTML-TO-PDF':
                try {
                    const { html } = req.body;
                    const browser = await puppeteer.launch({
                        args: ['--no-sandbox', '--disable-setuid-sandbox'],
                    });
                    const page = await browser.newPage();
                    await page.setContent(html);

                    // Define the path where the PDF will be saved
                    const pdfPath = path.join(process.cwd(), 'public', 'pdf', 'generated.pdf');

                    // Generate PDF and save it to the specified path
                    await page.pdf({
                        path: pdfPath, // Save to public/pdf/generated.pdf
                        format: 'A4'
                    });

                    await browser.close();

                    // Optionally, send a response indicating success
                    res.status(200).json({ message: 'PDF generated successfully!', pdfPath });
                } catch (error) {
                    console.error("Error generating PDF:", error);
                    res.status(500).json({ message: 'Failed to generate PDF', error: error });
                }
                break;
            default:
                res.status(400).json({ message: 'Invalid type' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
