import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import runMiddleware from './libs/runMiddleware';
import connectToMongoDB from './libs/mongodb';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { customFormatDate } from '@/services/common';
import puppeteer from 'puppeteer';
import pdf from 'html-pdf-node';

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
                    const file = { content: html };
                    const pdfBuffer = await pdf.generatePdf(file, { format: 'A4' });

                    res.setHeader('Content-Type', 'application/pdf');
                    res.setHeader('Content-Disposition', 'attachment; filename=generated.pdf');
                    res.send(pdfBuffer);
                } catch (error) {
                    console.error("Error generating PDF:", error);
                    res.status(500).json({ message: 'Failed to generate PDF', error: error });
                }
                break;
        }



    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
