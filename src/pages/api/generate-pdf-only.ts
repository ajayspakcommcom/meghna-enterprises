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

                    // const imagePath = path.join(process.cwd(), 'public', 'images', 'seedsnfeeds.png');

                    const imagePath = path.join(process.cwd(), 'public', 'images', `${req.body.logo === 'logo' ? 'seedsnfeeds' : req.body.logo}.png`);
                    doc.image(imagePath, 135, 5, { width: 335, height: 85 });

                    if (req.body.logo === 'logo') {
                        doc.fontSize(8).fillColor('#000').text('B-3 GIRIRAJ CO OP H S LTD, 6 MAMLATDAR WADI RAOD NO. 6 MALAD (WEST), MUMBAI - 400 064.', 120, 100);
                        doc.fontSize(8).fillColor('#000').text('PHONE NO: 022 2880 2452 | MOBILE NO: +91 99200 10200 / 99200 90200', 170, 115);
                        doc.fontSize(8).fillColor('#000').text('Email: | Pan No. AFRPC6408E', 250, 130);
                        doc.fontSize(8).fillColor('#000').text('GSTIN: 27AFRPC6408E1ZI', 252, 145);
                    }

                    if (req.body.logo === 'agro') {
                        doc.fontSize(8).fillColor('#000').text('504, SYNERGY, KACH PADA RD NO. 2, NEAR MALAD IND. ESTATE, RAMCHANDRA LANE EXTENTION, MALAD (W), MUMBAI - 400 064.', 55, 100);
                        doc.fontSize(8).fillColor('#000').text('Tel. : 022 2880 2452', 250, 115);
                        doc.fontSize(8).fillColor('#000').text('Email : meghnaagrocommodities@gmail.com | PAN No. : ABRPC6999E', 165, 130);
                    }

                    if (req.body.logo === 'bombay') {
                        doc.fontSize(8).fillColor('#000').text('504, SYNERGY, KACH PADA RD NO. 2, NEAR MALAD IND. ESTATE, RAMCHANDRA LANE EXTENTION, MALAD (W), MUMBAI - 400 064.', 55, 100);
                        doc.fontSize(8).fillColor('#000').text('Tel. : 022 2880 2683 / 2880 3920 | Cell : +91 98200 10200 / 93200 10200', 165, 115);
                        doc.fontSize(8).fillColor('#000').text('Email : meghnaagencies@gmail.com | PAN No. : AAAPC7200L', 185, 130);
                        doc.fontSize(8).fillColor('#000').text('GSTIN : 27AAAPC7200L1Z2', 252, 145);
                    }

                    if (req.body.logo === 'meghna') {
                        doc.fontSize(8).fillColor('#000').text('504, SYNERGY, KACH PADA RD NO. 2, NEAR MALAD IND. ESTATE, RAMCHANDRA LANE EXTENTION, MALAD (W), MUMBAI - 400 064.', 55, 100);
                        doc.fontSize(8).fillColor('#000').text('Tel. : 022 2880 2452-Fax : 022 2881 5002', 250, 115);
                        doc.fontSize(8).fillColor('#000').text('Email : meghnaagencies@gmail.com | PAN No. : AFRPC6408E', 195, 130);
                        doc.fontSize(8).fillColor('#000').text('GSTIN : 27AFRPC6408E1ZI', 252, 145);
                    }


                    doc.rect(doc.page.margins.left, 160, pageWidth, 30).fill('#d9d9d9');
                    doc.fontSize(11).fillColor('#000').text('CONTRACT NO : ', 25, 170);
                    doc.fontSize(10).fillColor('#000').text(`${req.body.contract_no}`, 120, 170);
                    doc.fontSize(11).fillColor('#000').text('DATE : ', 495, 170);
                    doc.fontSize(10).fillColor('#000').text(`${customFormatDate(new Date(req.body.createdDate))}`, 535, 170);


                    doc.fontSize(10).fillColor('#000').text('SELLER', 25, 200);
                    const sellerText = `${req.body.seller_id.name}, ${req.body.seller_id.address}, PAN : ${req.body.seller_id.pan}, GSTIN :  ${req.body.seller_id.gstin}`;
                    doc.fontSize(9).fillColor('#000').text(sellerText.replace(/\n\n/g, ' '), 150, 200);


                    const sellerTextHeight = doc.heightOfString(sellerText);


                    doc.fontSize(9).fillColor('#000').text('BUYER', 25, 240 + sellerTextHeight);
                    const buyerText = `${req.body.buyer_id.name}, ${req.body.buyer_id.address}, PAN : ${req.body.buyer_id.pan}, GSTIN :  ${req.body.buyer_id.gstin}`;
                    doc.fontSize(9).fillColor('#000').text(buyerText.replace(/\n\n/g, ' '), 150, 240 + sellerTextHeight);

                    const buyerTextHeight = doc.heightOfString(buyerText);

                    doc.fontSize(10).fillColor('#000').text('QUANTITY', 25, 305 + buyerTextHeight);
                    const quantityText = `${req.body.quantity}`;
                    doc.fontSize(9).fillColor('#000').text(quantityText.replace(/\n\n/g, ' '), 150, 305 + buyerTextHeight);

                    const quantityTextHeight = doc.heightOfString(quantityText);

                    doc.fontSize(10).fillColor('#000').text('PRICE', 25, 350 + quantityTextHeight);
                    const priceText = `${req.body.price}`;
                    doc.fontSize(9).fillColor('#000').text(priceText.replace(/\n\n/g, ' '), 150, 350 + quantityTextHeight);

                    const priceTextHeight = doc.heightOfString(priceText);

                    doc.fontSize(10).fillColor('#000').text('COMMODITY', 25, 375 + priceTextHeight);
                    const commodityText = `${req.body.template.COMMODITY}`;
                    doc.fontSize(9).fillColor('#000').text(commodityText.replace(/\n\n/g, ' '), 150, 375 + priceTextHeight);

                    const templateTextHeight = doc.heightOfString(commodityText);


                    if (req.body.template['PLACE OF DELIVERY']) {
                        doc.fontSize(10).fillColor('#000').text('PLACE OF DELIVERY', 25, 400 + templateTextHeight);
                        const placeOfDeliveryText = `${req.body.template['PLACE OF DELIVERY']}`;
                        doc.fontSize(9).fillColor('#000').text(placeOfDeliveryText.replace(/\n\n/g, ' '), 150, 400 + templateTextHeight);
                    }

                    if (req.body.template['PERIOD OF DELIVERY']) {
                        if (doc.heightOfString(req.body.template['PLACE OF DELIVERY'])) {
                            const placeOfDeliveryTextHeight = doc.heightOfString(req.body.template['PLACE OF DELIVERY']);
                            doc.fontSize(10).fillColor('#000').text('PERIOD OF DELIVERY', 25, 440 + placeOfDeliveryTextHeight);
                            const periodOfDeliveryText = `${req.body.template['PERIOD OF DELIVERY']}`;
                            doc.fontSize(9).fillColor('#000').text(periodOfDeliveryText.replace(/\n\n/g, ' '), 150, 440 + placeOfDeliveryTextHeight);
                        } else {
                            doc.fontSize(10).fillColor('#000').text('PERIOD OF DELIVERY', 25, 440);
                            const periodOfDeliveryText = `${req.body.template['PERIOD OF DELIVERY']}`;
                            doc.fontSize(9).fillColor('#000').text(periodOfDeliveryText.replace(/\n\n/g, ' '), 150, 440);
                        }
                    }


                    if (req.body.template.PAYMENT) {

                        if (doc.heightOfString(req.body.template['PERIOD OF DELIVERY'])) {
                            const periodOfDeliveryTextHeight = doc.heightOfString(req.body.template['PERIOD OF DELIVERY']);
                            doc.fontSize(10).fillColor('#000').text('PAYMENT', 25, 480);
                            const paymentText = `${req.body.template.PAYMENT}`;
                            doc.fontSize(9).fillColor('#000').text(paymentText.replace(/\n\n/g, ' '), 150, 480);
                        } else {
                            doc.fontSize(10).fillColor('#000').text('PAYMENT', 25, 480);
                            const paymentText = `${req.body.template.PAYMENT}`;
                            doc.fontSize(9).fillColor('#000').text(paymentText.replace(/\n\n/g, ' '), 150, 480);
                        }
                    }

                    if (req.body.template['TERMS & CONDITIONS']) {
                        if (doc.heightOfString(req.body.template.PAYMENT)) {
                            const paymentTextHeight = doc.heightOfString(req.body.template.PAYMENT);
                            doc.fontSize(10).fillColor('#000').text('TERMS & CONDITIONS', 25, 500 + paymentTextHeight);
                            const termsConditionsText = `${req.body.template['TERMS & CONDITIONS']}`;
                            doc.fontSize(9).fillColor('#000').text(termsConditionsText.replace(/\n\n/g, ''), 150, 500 + paymentTextHeight);
                        } else {
                            doc.fontSize(10).fillColor('#000').text('TERMS & CONDITIONS', 25, 500);
                            const termsConditionsText = `${req.body.template['TERMS & CONDITIONS']}`;
                            doc.fontSize(9).fillColor('#000').text(termsConditionsText.replace(/\n\n/g, ' '), 150, 500);
                        }
                    }

                    if (req.body.template['BROKERAGE LIABILITY']) {

                        if (doc.heightOfString(req.body.template['TERMS & CONDITIONS'])) {
                            const termsConditionTextHeight = doc.heightOfString(req.body.template.PAYMENT);
                            doc.fontSize(10).fillColor('#000').text('BROKERAGE LIABILITY', 25, 550 + termsConditionTextHeight);
                            const brokerageLiabilityText = `${req.body.template['BROKERAGE LIABILITY']}`;
                            doc.fontSize(9).fillColor('#000').text(brokerageLiabilityText.replace(/\n\n/g, ' '), 150, 550 + termsConditionTextHeight);
                        } else {
                            doc.fontSize(10).fillColor('#000').text('BROKERAGE LIABILITY', 25, 550);
                            const brokerageLiabilityText = `${req.body.template['BROKERAGE LIABILITY']}`;
                            doc.fontSize(9).fillColor('#000').text(brokerageLiabilityText.replace(/\n\n/g, ' '), 150, 550);
                        }
                    }

                    if (req.body.template['BROKERAGE']) {
                        if (doc.heightOfString(req.body.template['BROKERAGE LIABILITY'])) {
                            const brokerageLiabilityTextHeight = doc.heightOfString(req.body.template['BROKERAGE LIABILITY']);
                            doc.fontSize(10).fillColor('#000').text('BROKERAGE', 25, 580 + brokerageLiabilityTextHeight);
                            const brokerageText = `${req.body.template['BROKERAGE']}`;
                            doc.fontSize(9).fillColor('#000').text(brokerageText.replace(/\n\n/g, ' '), 150, 580 + brokerageLiabilityTextHeight);
                        } else {
                            doc.fontSize(10).fillColor('#000').text('BROKERAGE', 25, 580);
                            const brokerageText = `${req.body.template['BROKERAGE']}`;
                            doc.fontSize(9).fillColor('#000').text(brokerageText.replace(/\n\n/g, ' '), 150, 580);
                        }
                    }

                    const brokerageTextHeight = doc.heightOfString(req.body.template['BROKERAGE']);

                    if (brokerageTextHeight) {
                        doc.rect(doc.page.margins.left, 660 + brokerageTextHeight, pageWidth, 20).stroke('#d9d9d9');
                    } else {
                        doc.rect(doc.page.margins.left, 670 + brokerageTextHeight, pageWidth, 20).stroke('#d9d9d9');
                    }


                    doc.fontSize(10).fillColor('#000').text('Subject to Mumbai Juridiction', 240, 676);
                    doc.fontSize(10).fillColor('#000').text('For SEEDS & FEEDS INDIA', 240, 705);
                    doc.fontSize(10).fillColor('#000').text('FOR SELLER', 25, 730);
                    doc.fontSize(10).fillColor('#000').text('FOR BUYER', 520, 730);
                    doc.fontSize(10).fillColor('#000').text('(AS BROKER)', 270, 750);

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
