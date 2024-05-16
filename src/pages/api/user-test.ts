import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import runMiddleware from './libs/runMiddleware';
import connectToMongoDB from './libs/mongodb';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';





const cors = Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'OPTIONS'],
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    await connectToMongoDB();
    await runMiddleware(req, res, cors);

    if (req.method === 'POST') {


        const doc = new PDFDocument();

        const filePath = path.join(process.cwd(), 'public', 'pdf', 'contract.pdf');
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        doc.page.margins = { top: 15, bottom: 15, left: 15, right: 15 };

        const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

        doc.rect(doc.page.margins.left, 15, pageWidth, 30).fill('#d9d9d9');

        doc.fontSize(11).fillColor('#000').text('CONTRACT NO : ', 25, 25);
        doc.fontSize(10).fillColor('#000').text('S&f/L/0001/24-25 : ', 120, 25);

        doc.fontSize(11).fillColor('#000').text('DATE : ', 495, 25);
        doc.fontSize(10).fillColor('#000').text('29/04/2024', 535, 25);

        doc.fontSize(8).fillColor('#000').text('B-3 GIRIRAJ CO OP H S LTD, 6 MAMLATDAR WADI RAOD NO. 6 MALAD (WEST), MUMBAI - 400 064.', 120, 55);
        doc.fontSize(8).fillColor('#000').text('PHONE NO: 022 2880 2452 | MOBILE NO: +91 99200 10200 / 99200 90200', 170, 70);
        doc.fontSize(8).fillColor('#000').text('Email: | Pan No. AFRPC6408E', 250, 85);
        doc.fontSize(8).fillColor('#000').text('GSTIN: 27AFRPC6408E1ZI', 252, 98);

        doc.fontSize(10).fillColor('#000').text('SELLER : ', 25, 110);

        // const rules2 = 'PHONE NO: 022 2880 2452 | MOBILE NO: +91 99200 10200 / 99200 90200';
        // const textWidth2 = doc.widthOfString(rules2);
        // const centerX2 = (doc.page.width - textWidth2) / 2;
        // doc.fontSize(8).fillColor('#000').text(rules2, centerX2, 70);

        // Finalize the PDF
        doc.end();

        res.status(201).json({ message: 'Pdf Generated created.' });

    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
