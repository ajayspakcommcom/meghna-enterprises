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

        doc.fontSize(10).fillColor('#000').text('SELLER', 25, 120);
        const sellerText = `M/S. LATUR SOLVENT EXT. PVT. LTD. PLOT NO. R7/1408, 'SHANTI HOUSE',  OPP. MARKET YARD GATE NO. 2, MANTHALE NAGAR, LATUR - 413 512. (MAHARASHRA) PAN: AKFPV8867P / GSTIN: 27AAACL9765G1Z5`;
        doc.fontSize(9).fillColor('#000').text(sellerText, 150, 120);

        doc.fontSize(10).fillColor('#000').text('BUYER', 25, 160);
        const buyerText = `M/S. LATUR SOLVENT EXT. PVT. LTD. PLOT NO. R7/1408, 'SHANTI HOUSE',  OPP. MARKET YARD GATE NO. 2, MANTHALE NAGAR, LATUR - 413 512. (MAHARASHRA) PAN: AKFPV8867P / GSTIN: 27AAACL9765G1Z5`;
        doc.fontSize(9).fillColor('#000').text(buyerText, 150, 160);

        doc.fontSize(10).fillColor('#000').text('COMMODITY', 25, 200);
        const commodityText = `M/S. LATUR SOLVENT EXT. PVT. LTD. PLOT NO. R7/1408, 'SHANTI HOUSE',  OPP. MARKET YARD GATE NO. 2, MANTHALE NAGAR, LATUR - 413 512. (MAHARASHRA) PAN: AKFPV8867P / GSTIN: 27AAACL9765G1Z5`;
        doc.fontSize(9).fillColor('#000').text(commodityText, 150, 200);

        doc.fontSize(10).fillColor('#000').text('QUANTITY', 25, 240);
        const quantityText = `121: GROSS MT.`;
        doc.fontSize(9).fillColor('#000').text(quantityText, 150, 240);

        doc.fontSize(10).fillColor('#000').text('PRICE', 25, 265);
        const priceText = `121: GROSS MT.`;
        doc.fontSize(9).fillColor('#000').text(priceText, 150, 265);

        doc.fontSize(10).fillColor('#000').text('PLACE OF DELIVERY', 25, 295);
        const placeOfDeliveryText = `AT POLLACHI`;
        doc.fontSize(9).fillColor('#000').text(placeOfDeliveryText, 150, 295);

        doc.fontSize(10).fillColor('#000').text('PERIOD OF DELIVERY', 25, 325);
        const periodOfDeliveryText = `DELIVERY OF GOODS UPTO 07/05/2024`;
        doc.fontSize(9).fillColor('#000').text(periodOfDeliveryText, 150, 325);

        doc.fontSize(10).fillColor('#000').text('PAYMENT', 25, 355);
        const paymentText = `PAYMENT WITHIN ONE WEEK`;
        doc.fontSize(9).fillColor('#000').text(paymentText, 150, 355);

        doc.fontSize(10).fillColor('#000').text('TERMS & CONDITIONS', 25, 385);
        const termsConditionsText = `PAKING IN PP BAGS.`;
        doc.fontSize(9).fillColor('#000').text(termsConditionsText, 150, 385);

        doc.fontSize(10).fillColor('#000').text('BROKERAGE LIABILITY', 25, 415);
        const brokerageLiabilityText = `WE ARE SOLELY ACTING AS A BROKER ON BEHALF OF BOTH THE PARTIES AND HENCEFORTH WILL NOT BE HELD RESPONSIBLE FOR ANY ACT OF SELLER AND BUYER WHETHER IT MAY PERTAINING TO FINANCIAL, CIVIL OR CRIMINAL NATURE. NONE OF THE PARTY IS ENTITLED TO TAKE ANY LEGAL OR OTHER ACTION  AGAINST US; IF ANY PARTY DOES SO THEN SUCH ACTION WILL BE CONSIDERED AS 'NULLIFIED' BY VIRTUAL OF THIS CLAUSE. HOWEVER, WE SHALL ALWAYS REMAIN AVAILABLE AS A WITNESS FOR THIS  CONTRACT. "SUBJECT TO MUMBAI JURIDICTION" ONLY.`;
        doc.fontSize(9).fillColor('#000').text(brokerageLiabilityText, 150, 415);

        doc.fontSize(10).fillColor('#000').text('BROKERAGE LIABILITY', 25, 485);
        const brokerageText = `AS USUAL`;
        doc.fontSize(9).fillColor('#000').text(brokerageText, 150, 485);

        // Finalize the PDF
        doc.end();

        res.status(201).json({ message: 'Pdf Generated created.' });

    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
