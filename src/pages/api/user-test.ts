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
    // Only allow GET requests
    await connectToMongoDB();
    await runMiddleware(req, res, cors);

    if (req.method === 'POST') {

        const doc = new PDFDocument();

        const filePath = path.join(process.cwd(), 'public/pdf', 'contract.pdf');
        const stream = fs.createWriteStream(filePath);

        doc.pipe(stream);

        const textContent = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book`;

        // doc.fontSize(30).fillColor('red').text('Hello, World!', 10, 15);
        // doc.fontSize(14).fillColor('black').text(textContent, 10, 50);
        // doc.fontSize(10).fillColor('brown').text('This is Done', 10, 200);

        const imagePath = path.join(process.cwd(), 'public/pdf', 'logo.svg');
        doc.image(imagePath, {
            fit: [250, 250],
            align: 'center',
            valign: 'center'
        });

        doc.end();

        res.status(201).json({ message: 'Pdf Generated created.' });

    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
