import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import runMiddleware from './libs/runMiddleware';
import connectToMongoDB from './libs/mongodb';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { sendEmail } from './libs/emailService';
import { customFormatDate } from '@/services/common';

const cors = Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'OPTIONS'],
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    await connectToMongoDB();
    await runMiddleware(req, res, cors);

    if (req.method === 'POST') {


        switch (req.body.type) {
            case 'EMAIL-SEND':
                try {

                    const doc = new PDFDocument();

                    const filePath = path.join(process.cwd(), 'public', 'pdf', 'contract.pdf');
                    const stream = fs.createWriteStream(filePath);
                    doc.pipe(stream);
                    doc.page.margins = { top: 15, bottom: 15, left: 15, right: 15 };
                    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
                    doc.rect(doc.page.margins.left, 15, pageWidth, 70).fill('#000');

                    const imagePath = path.join(process.cwd(), 'public', 'images', `${req.body.logo === 'logo' ? 'seedsnfeeds' : req.body.logo}.png`);
                    doc.image(imagePath, 135, 5, { width: 335, height: 85 });

                    let y = 100;
                    const heightIncrease = 8;

                    if (req.body.logo === 'logo') {
                        //const firstAddText = `B-3 GIRIRAJ CO OP H S LTD, 6 MAMLATDAR WADI RAOD NO. 6 MALAD (WEST), MUMBAI - 400 064.`;
                        const firstAddText = `504, SYNERGY, KACH PADA RD NO. 2, NEAR MALAD IND. ESTATE, RAMCHANDRA LANE EXTENTION, MALAD (W), MUMBAI - 400 064.`;
                        doc.fontSize(8).fillColor('#000').text(firstAddText, 120, y);
                        y += doc.heightOfString(firstAddText.replace(/\n\n/g, ' '), { width: pageWidth, align: 'left' }) + heightIncrease;

                        const secondAddText = `PHONE NO: 022 2880 2452 | MOBILE NO: +91 99200 10200 / 99200 90200`;
                        doc.fontSize(8).fillColor('#000').text(secondAddText, 170, y);
                        y += doc.heightOfString(secondAddText.replace(/\n\n/g, ' '), { width: pageWidth, align: 'left' }) + heightIncrease;

                        const thirdAddText = `Email: kashyap.seedsnfeeds@gmail.com | Pan No. AFRPC6408E`;
                        doc.fontSize(8).fillColor('#000').text(thirdAddText, 250, y);
                        y += doc.heightOfString(thirdAddText.replace(/\n\n/g, ' '), { width: pageWidth, align: 'left' }) + heightIncrease;

                        const fourthAddText = `GSTIN: 27AFRPC6408E1ZI`;
                        doc.fontSize(8).fillColor('#000').text(fourthAddText, 252, y);
                        y += doc.heightOfString(fourthAddText.replace(/\n\n/g, ' '), { width: pageWidth, align: 'left' }) + heightIncrease;
                    }

                    doc.rect(doc.page.margins.left, y, pageWidth, 30).fill('#d9d9d9');

                    doc.fontSize(11).fillColor('#000').text('CONTRACT NO : ', 25, (y + 10));
                    doc.fontSize(10).fillColor('#000').text(`${req.body.contract_no}`, 120, (y + 10));
                    y += doc.heightOfString(`${req.body.contract_no.replace(/\n\n/g, ' ')}`, { width: pageWidth, align: 'left' }) + heightIncrease;

                    doc.fontSize(11).fillColor('#000').text('DATE : ', 495, (y - 10));
                    doc.fontSize(10).fillColor('#000').text(`${customFormatDate(new Date(req.body.createdDate))}`, 535, (y - 10));
                    y += doc.heightOfString(`${customFormatDate(new Date(req.body.createdDate))}`, { width: pageWidth, align: 'left' }) + heightIncrease + 5;

                    doc.fontSize(10).fillColor('#000').text('SELLER', 25, y);
                    const sellerText = `${req.body.seller_id.name}, ${req.body.seller_id.address}, PAN : ${req.body.seller_id.pan}, GSTIN :  ${req.body.seller_id.gstin}`;
                    doc.fontSize(9).fillColor('#000').text(sellerText.replace(/\n\n/g, ' '), 150, y);
                    y += doc.heightOfString(sellerText.replace(/\n\n/g, ' '), { width: pageWidth, align: 'left' }) + heightIncrease;


                    doc.fontSize(9).fillColor('#000').text('BUYER', 25, y);
                    const buyerText = `${req.body.buyer_id.name}, ${req.body.buyer_id.address}, PAN : ${req.body.buyer_id.pan}, GSTIN :  ${req.body.buyer_id.gstin}`;
                    doc.fontSize(9).fillColor('#000').text(buyerText.replace(/\n\n/g, ' '), 150, y);
                    y += doc.heightOfString(buyerText.replace(/\n\n/g, ' '), { width: pageWidth, align: 'left' }) + heightIncrease;

                    doc.fontSize(10).fillColor('#000').text('QUANTITY', 25, y);
                    const quantityText = `${req.body.quantity}`;
                    doc.fontSize(9).fillColor('#000').text(quantityText.replace(/\n\n/g, ' '), 150, y);
                    y += doc.heightOfString(quantityText.replace(/\n\n/g, ' '), { width: pageWidth, align: 'left' }) + heightIncrease;


                    doc.fontSize(10).fillColor('#000').text('PRICE', 25, y);
                    const priceText = `${req.body.price}`;
                    doc.fontSize(9).fillColor('#000').text(priceText.replace(/\n\n/g, ' '), 150, y);
                    y += doc.heightOfString(priceText.replace(/\n\n/g, ' '), { width: pageWidth, align: 'left' }) + heightIncrease;


                    doc.fontSize(10).fillColor('#000').text('COMMODITY', 25, y);
                    const commodityText = `${req.body.template.COMMODITY}`;
                    doc.fontSize(9).fillColor('#000').text(commodityText.replace(/\n\n/g, ' '), 150, y);
                    y += doc.heightOfString(commodityText.replace(/\n\n/g, ' '), { width: pageWidth, align: 'left' }) + heightIncrease;


                    if (req.body.template['PLACE OF DELIVERY']) {
                        doc.fontSize(10).fillColor('#000').text('PLACE OF DELIVERY', 25, y);
                        const placeOfDeliveryText = `${req.body.template['PLACE OF DELIVERY']}`;
                        doc.fontSize(9).fillColor('#000').text(placeOfDeliveryText.replace(/\n\n/g, ' '), 150, y);
                        y += doc.heightOfString(placeOfDeliveryText.replace(/\n\n/g, ' '), { width: pageWidth, align: 'left' }) + heightIncrease;
                    }



                    if (req.body.template['PERIOD OF DELIVERY']) {
                        doc.fontSize(10).fillColor('#000').text('PERIOD OF DELIVERY', 25, y);
                        const periodOfDeliveryText = `${req.body.template['PERIOD OF DELIVERY']}`;
                        doc.fontSize(9).fillColor('#000').text(periodOfDeliveryText.replace(/\n\n/g, ' '), 150, y);
                        y += doc.heightOfString(periodOfDeliveryText.replace(/\n\n/g, ' '), { width: pageWidth, align: 'left' }) + heightIncrease;
                    }


                    if (req.body.template.PAYMENT) {
                        doc.fontSize(10).fillColor('#000').text('PAYMENT', 25, y);
                        const paymentText = `${req.body.template.PAYMENT}`;
                        doc.fontSize(9).fillColor('#000').text(paymentText.replace(/\n\n/g, ' '), 150, y);
                        y += doc.heightOfString(paymentText.replace(/\n\n/g, ' '), { width: pageWidth, align: 'left' }) + heightIncrease;
                    }


                    if (req.body.template['TERMS & CONDITIONS']) {
                        doc.fontSize(10).fillColor('#000').text('TERMS & CONDITIONS', 25, y);
                        const termsConditionsText = `${req.body.template['TERMS & CONDITIONS']}`;
                        doc.fontSize(9).fillColor('#000').text(termsConditionsText.replace(/\n\n/g, ' '), 150, y);
                        y += doc.heightOfString(termsConditionsText.replace(/\n\n/g, ' '), { width: pageWidth, align: 'left' }) + heightIncrease;
                    }


                    if (req.body.template['BROKERAGE LIABILITY']) {
                        doc.fontSize(10).fillColor('#000').text('BROKERAGE LIABILITY', 25, y);
                        const brokerageLiabilityText = `${req.body.template['BROKERAGE LIABILITY']}`;
                        doc.fontSize(9).fillColor('#000').text(brokerageLiabilityText.replace(/\n\n/g, ' '), 150, y);
                        y += doc.heightOfString(brokerageLiabilityText.replace(/\n\n/g, ' '), { width: pageWidth, align: 'left' }) + heightIncrease;
                    }


                    if (req.body.template['BROKERAGE']) {
                        doc.fontSize(10).fillColor('#000').text('BROKERAGE', 25, y + 5);
                        const brokerageText = `${req.body.template['BROKERAGE']}`;
                        doc.fontSize(9).fillColor('#000').text(brokerageText.replace(/\n\n/g, ' '), 150, y + 5);
                        y += doc.heightOfString(brokerageText.replace(/\n\n/g, ' '), { width: pageWidth, align: 'left' }) + heightIncrease;
                    }

                    doc.rect(doc.page.margins.left, y, pageWidth, 20).stroke('#d9d9d9');

                    y += 5;

                    doc.fontSize(10).fillColor('#000').text('Subject to Mumbai Juridiction', 240, y);
                    y += doc.heightOfString('Subject to Mumbai Juridiction', { width: pageWidth, align: 'left' }) + heightIncrease;

                    y += 10;

                    doc.fontSize(10).fillColor('#000').text('For SEEDS & FEEDS VYANAH', 240, y);
                    y += doc.heightOfString('For SEEDS & FEEDS VYANAH', { width: pageWidth, align: 'left' }) + heightIncrease;
                    doc.fontSize(10).fillColor('#000').text('FOR SELLER', 25, y);
                    y += doc.heightOfString('FOR SELLER', { width: pageWidth, align: 'left' }) + heightIncrease;
                    doc.fontSize(10).fillColor('#000').text('FOR BUYER', 520, y);
                    y += doc.heightOfString('FOR BUYER', { width: pageWidth, align: 'left' }) + heightIncrease;
                    doc.fontSize(10).fillColor('#000').text('(AS BROKER)', 270, y);
                    y += doc.heightOfString('(AS BROKER)', { width: pageWidth, align: 'left' }) + heightIncrease;

                    doc.end();

                    res.status(200).json({ message: 'Pdf sent successfully.' });
                } catch (error: any) {
                    res.status(500).json({ error: 'Internal Error', errorDetail: 'An unexpected error occurred' });
                }

                break;
        }



    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
