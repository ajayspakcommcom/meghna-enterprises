import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import runMiddleware from './libs/runMiddleware';
import connectToMongoDB from './libs/mongodb';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { sendEmail } from './libs/emailService';
import { customDateFormatter } from '@/services/common';





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

                    const imagePath = path.join(process.cwd(), 'public', 'images', 'pdf.png');
                    doc.image(imagePath, 135, 5, { width: 335, height: 85 });


                    doc.fontSize(8).fillColor('#000').text('B-3 GIRIRAJ CO OP H S LTD, 6 MAMLATDAR WADI RAOD NO. 6 MALAD (WEST), MUMBAI - 400 064.', 120, 100);
                    doc.fontSize(8).fillColor('#000').text('PHONE NO: 022 2880 2452 | MOBILE NO: +91 99200 10200 / 99200 90200', 170, 115);
                    doc.fontSize(8).fillColor('#000').text('Email: | Pan No. AFRPC6408E', 250, 130);
                    doc.fontSize(8).fillColor('#000').text('GSTIN: 27AFRPC6408E1ZI', 252, 145);

                    doc.rect(doc.page.margins.left, 160, pageWidth, 30).fill('#d9d9d9');
                    doc.fontSize(11).fillColor('#000').text('CONTRACT NO : ', 25, 170);
                    doc.fontSize(10).fillColor('#000').text(`${req.body.contract_no}`, 120, 170);
                    doc.fontSize(11).fillColor('#000').text('DATE : ', 495, 170);
                    doc.fontSize(10).fillColor('#000').text(`${customDateFormatter(req.body.createdDate)}`, 535, 170);


                    doc.fontSize(10).fillColor('#000').text('SELLER', 25, 200);
                    const sellerText = `${req.body.seller_id.name}, ${req.body.seller_id.address}, PAN : ${req.body.seller_id.pan}, GSTIN :  ${req.body.seller_id.gstin}`;
                    doc.fontSize(9).fillColor('#000').text(sellerText, 150, 200);

                    doc.fontSize(10).fillColor('#000').text('BUYER', 25, 240);
                    const buyerText = `${req.body.buyer_id.name}, ${req.body.buyer_id.address}, PAN : ${req.body.buyer_id.pan}, GSTIN :  ${req.body.buyer_id.gstin}`;
                    doc.fontSize(9).fillColor('#000').text(buyerText, 150, 240);

                    doc.fontSize(10).fillColor('#000').text('COMMODITY', 25, 280);
                    const commodityText = `${req.body.template.COMMODITY}`;
                    doc.fontSize(9).fillColor('#000').text(commodityText, 150, 280);

                    doc.fontSize(10).fillColor('#000').text('QUANTITY', 25, 320);
                    const quantityText = `${req.body.quantity}`;
                    doc.fontSize(9).fillColor('#000').text(quantityText, 150, 320);

                    doc.fontSize(10).fillColor('#000').text('PRICE', 25, 340);
                    const priceText = `${req.body.price}`;
                    doc.fontSize(9).fillColor('#000').text(priceText, 150, 340);

                    if (req.body.template['PLACE OF DELIVERY']) {
                        doc.fontSize(10).fillColor('#000').text('PLACE OF DELIVERY', 25, 360);
                        const placeOfDeliveryText = `${req.body.template['PLACE OF DELIVERY']}`;
                        doc.fontSize(9).fillColor('#000').text(placeOfDeliveryText, 150, 360);
                    }

                    if (req.body.template['PERIOD OF DELIVERY']) {
                        doc.fontSize(10).fillColor('#000').text('PERIOD OF DELIVERY', 25, 380);
                        const periodOfDeliveryText = `${req.body.template['PERIOD OF DELIVERY']}`;
                        doc.fontSize(9).fillColor('#000').text(periodOfDeliveryText, 150, 380);
                    }

                    if (req.body.template.PAYMENT) {
                        doc.fontSize(10).fillColor('#000').text('PAYMENT', 25, 400);
                        const paymentText = `${req.body.template.PAYMENT}`;
                        doc.fontSize(9).fillColor('#000').text(paymentText, 150, 400);
                    }

                    if (req.body.template['TERMS & CONDITIONS']) {
                        doc.fontSize(10).fillColor('#000').text('TERMS & CONDITIONS', 25, 420);
                        const termsConditionsText = `${req.body.template['TERMS & CONDITIONS']}`;
                        doc.fontSize(9).fillColor('#000').text(termsConditionsText, 150, 420);
                    }

                    if (req.body.template['BROKERAGE LIABILITY']) {
                        doc.fontSize(10).fillColor('#000').text('BROKERAGE LIABILITY', 25, 440);
                        const brokerageLiabilityText = `${req.body.template['BROKERAGE LIABILITY']}`;
                        doc.fontSize(9).fillColor('#000').text(brokerageLiabilityText, 150, 440);
                    }

                    if (req.body.template['BROKERAGE']) {
                        doc.fontSize(10).fillColor('#000').text('BROKERAGE LIABILITY', 25, 520);
                        const brokerageText = `${req.body.template['BROKERAGE']}`;
                        doc.fontSize(9).fillColor('#000').text(brokerageText, 150, 520);
                    }

                    doc.rect(doc.page.margins.left, 540, pageWidth, 20).stroke('#d9d9d9');
                    doc.fontSize(10).fillColor('#000').text('Subject to Mumbai Juridiction', 240, 545);

                    doc.fontSize(10).fillColor('#000').text('For SEEDS & FEEDS INDIA', 240, 575);

                    doc.fontSize(10).fillColor('#000').text('FOR SELLER', 25, 600);
                    doc.fontSize(10).fillColor('#000').text('FOR BUYER', 520, 600);
                    doc.fontSize(10).fillColor('#000').text('(AS BROKER)', 270, 620);

                    doc.end();

                    const htmlContent = `<div>
                                            <b>Dear ${'Dear Sir / Madam,'}</b>
                                            <div style="margin-bottom:30px"></div>

                                            <span>Best regards,</span>
                                            <div></div>
                                            <span>Team Seeds & Feeds India.</span>
                                            <p style="margin-top:1px">
                                               B-3 GIRIRAJ CO OP H S LTD, 6 MAMLATDAR WADI RAOD NO. 6, MALAD (WEST), MUMBAI - 400 064.
                                                <br />
                                               PHONE NO: 022 2880 2452 | MOBILE NO: +91 99200 10200 / 99200 90200
                                            </p>
                                        </div>
                                    `;

                    await sendEmail({ recipient: 'ajay@spakcomm.com', subject: 'Feeds & Seeds Contract', text: htmlContent });

                    res.status(200).json({ message: 'Pdf sent successfully.' });
                } catch (error: any) {
                    console.clear();
                    console.log('Error', error)
                    res.status(500).json({ error: 'Internal Error', errorDetail: 'An unexpected error occurred' });
                }

                break;
        }



    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
