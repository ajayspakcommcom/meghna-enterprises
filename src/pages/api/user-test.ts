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

        doc.rect(doc.page.margins.left, 15, pageWidth, 70).fill('#000');

        const imagePath = path.join(process.cwd(), 'public', 'images', 'pdf.png');
        doc.image(imagePath, 135, 5, { width: 335, height: 85 });


        // doc.fontSize(8).fillColor('#000').text('B-3 GIRIRAJ CO OP H S LTD, 6 MAMLATDAR WADI RAOD NO. 6 MALAD (WEST), MUMBAI - 400 064.', 120, 100);
        doc.fontSize(8).fillColor('#000').text('504, SYNERGY, KACH PADA RD NO. 2, NEAR MALAD IND. ESTATE, RAMCHANDRA LANE EXTENTION, MALAD (W), MUMBAI - 400 064.', 120, 100);
        doc.fontSize(8).fillColor('#000').text('PHONE NO: 022 2880 2452 | MOBILE NO: +91 99200 10200 / 99200 90200', 170, 115);
        doc.fontSize(8).fillColor('#000').text('Email: kashyap.seedsnfeeds@gmail.com | Pan No. AFRPC6408E', 250, 130);
        doc.fontSize(8).fillColor('#000').text('GSTIN: 27AFRPC6408E1ZI', 252, 145);

        doc.rect(doc.page.margins.left, 160, pageWidth, 30).fill('#d9d9d9');
        doc.fontSize(11).fillColor('#000').text('CONTRACT NO : ', 25, 170);
        doc.fontSize(10).fillColor('#000').text('S&f/L/0001/24-25 : ', 120, 170);
        doc.fontSize(11).fillColor('#000').text('DATE : ', 495, 170);
        doc.fontSize(10).fillColor('#000').text('29/04/2024', 535, 170);


        doc.fontSize(10).fillColor('#000').text('SELLER', 25, 200);
        const sellerText = `M/S. LATUR SOLVENT EXT. PVT. LTD. PLOT NO. R7/1408, 'SHANTI HOUSE',  OPP. MARKET YARD GATE NO. 2, MANTHALE NAGAR, LATUR - 413 512. (MAHARASHRA) PAN: AKFPV8867P / GSTIN: 27AAACL9765G1Z5`;
        doc.fontSize(9).fillColor('#000').text(sellerText, 150, 200);

        doc.fontSize(10).fillColor('#000').text('BUYER', 25, 240);
        const buyerText = `M/S. LATUR SOLVENT EXT. PVT. LTD. PLOT NO. R7/1408, 'SHANTI HOUSE',  OPP. MARKET YARD GATE NO. 2, MANTHALE NAGAR, LATUR - 413 512. (MAHARASHRA) PAN: AKFPV8867P / GSTIN: 27AAACL9765G1Z5`;
        doc.fontSize(9).fillColor('#000').text(buyerText, 150, 240);

        doc.fontSize(10).fillColor('#000').text('COMMODITY', 25, 280);
        const commodityText = `M/S. LATUR SOLVENT EXT. PVT. LTD. PLOT NO. R7/1408, 'SHANTI HOUSE',  OPP. MARKET YARD GATE NO. 2, MANTHALE NAGAR, LATUR - 413 512. (MAHARASHRA) PAN: AKFPV8867P / GSTIN: 27AAACL9765G1Z5`;
        doc.fontSize(9).fillColor('#000').text(commodityText, 150, 280);

        doc.fontSize(10).fillColor('#000').text('QUANTITY', 25, 320);
        const quantityText = `121`;
        doc.fontSize(9).fillColor('#000').text(quantityText, 150, 320);

        doc.fontSize(10).fillColor('#000').text('PRICE', 25, 340);
        const priceText = `121`;
        doc.fontSize(9).fillColor('#000').text(priceText, 150, 340);

        doc.fontSize(10).fillColor('#000').text('PLACE OF DELIVERY', 25, 360);
        const placeOfDeliveryText = `AT POLLACHI`;
        doc.fontSize(9).fillColor('#000').text(placeOfDeliveryText, 150, 360);

        doc.fontSize(10).fillColor('#000').text('PERIOD OF DELIVERY', 25, 380);
        const periodOfDeliveryText = `DELIVERY OF GOODS UPTO 07/05/2024`;
        doc.fontSize(9).fillColor('#000').text(periodOfDeliveryText, 150, 380);

        doc.fontSize(10).fillColor('#000').text('PAYMENT', 25, 400);
        const paymentText = `PAYMENT WITHIN ONE WEEK`;
        doc.fontSize(9).fillColor('#000').text(paymentText, 150, 400);

        doc.fontSize(10).fillColor('#000').text('TERMS & CONDITIONS', 25, 420);
        const termsConditionsText = `PAKING IN PP BAGS.`;
        doc.fontSize(9).fillColor('#000').text(termsConditionsText, 150, 420);

        doc.fontSize(10).fillColor('#000').text('BROKERAGE LIABILITY', 25, 440);
        const brokerageLiabilityText = `WE ARE SOLELY ACTING AS A BROKER ON BEHALF OF BOTH THE PARTIES AND HENCEFORTH WILL NOT BE HELD RESPONSIBLE FOR ANY ACT OF SELLER AND BUYER WHETHER IT MAY PERTAINING TO FINANCIAL, CIVIL OR CRIMINAL NATURE. NONE OF THE PARTY IS ENTITLED TO TAKE ANY LEGAL OR OTHER ACTION  AGAINST US; IF ANY PARTY DOES SO THEN SUCH ACTION WILL BE CONSIDERED AS 'NULLIFIED' BY VIRTUAL OF THIS CLAUSE. HOWEVER, WE SHALL ALWAYS REMAIN AVAILABLE AS A WITNESS FOR THIS  CONTRACT. "SUBJECT TO MUMBAI JURIDICTION" ONLY.`;
        doc.fontSize(9).fillColor('#000').text(brokerageLiabilityText, 150, 440);

        doc.fontSize(10).fillColor('#000').text('BROKERAGE LIABILITY', 25, 520);
        const brokerageText = `AS USUAL`;
        doc.fontSize(9).fillColor('#000').text(brokerageText, 150, 520);

        doc.rect(doc.page.margins.left, 540, pageWidth, 20).stroke('#d9d9d9');
        doc.fontSize(10).fillColor('#000').text('Subject to Mumbai Juridiction', 240, 545);

        doc.fontSize(10).fillColor('#000').text('For SEEDS & FEEDS VYANAH', 240, 575);

        doc.fontSize(10).fillColor('#000').text('FOR SELLER', 25, 600);
        doc.fontSize(10).fillColor('#000').text('FOR BUYER', 520, 600);
        doc.fontSize(10).fillColor('#000').text('(AS BROKER)', 270, 620);

        doc.end();

        res.status(201).json({ message: 'Pdf Generated created.' });

    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
