import connectToMongoDB from './libs/mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Error } from 'mongoose';
import { Error as MongooseError } from 'mongoose';
import runMiddleware from './libs/runMiddleware';
import Cors from 'cors';
import { Billing } from './models/Billing';
import { Contract } from './models/Contract';
import { Buyer } from './models/Buyer';
import { Seller } from './models/Seller';
import mongoose from 'mongoose';
import { sendHtmlContent } from './libs/sendHtmlService'
import { sentBillingHtmlTemplateOnEmail } from '@/services/common';
import { getSeller } from '@/services/seller';
import { getBuyer } from '@/services/buyer';
import puppeteer from 'puppeteer';
import path from 'path';


interface ApiResponse {
  message?: string;
  error?: string;
  errorDetail?: any;
  data?: any;
  total?: number;
}

const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {

  await connectToMongoDB();
  await runMiddleware(req, res, cors);

  if (req.method === 'POST') {

    switch (req.body.type) {
      case 'CREATE':
        try {
          await Billing.create({
            billingNo: req.body.billingNo,
            billingDate: req.body.billingDate || Date.now(),
            partyType: req.body.partyType,
            partyId: req.body.partyId,
            contracts: req.body.contracts.map((contract: any) => ({
              contractId: contract.contractId,
              quantity: contract.quantity,
              price: contract.price,
              brokerageQty: contract.brokerageQty,
              brokerageAmt: contract.brokerageAmt,
              partyId: req.body.partyId,
              isBillCreated: true,
              partyType: contract.partyType,
              contractNo: contract.contractNo,
              createdDate: contract.createdDate,
              templateName: contract.template_name
            })),
            sgst: req.body.sgst || 0,
            cgst: req.body.cgst || 0,
            igst: req.body.igst || 18,
            netAmount: req.body.netAmount,
            brokerage: req.body.brokerage,
            grandTotalAmt: req.body.grandTotalAmt,
            outstandingAmount: req.body.outstandingAmount || 0,
            createdDate: req.body.createdDate || Date.now(),
            updatedDate: req.body.updatedDate || null,
            deletedDate: req.body.deletedDate || null,
            isDeleted: req.body.isDeleted || false
          });

          res.status(201).json({ message: 'Billing has been successfully created.' });
        } catch (error: any) {
          res.status(500).json({ error: 'Internal Error', errorDetail: `An unexpected error occurred: ${error}` });
        }


        break;
      case 'LIST':
        try {
          const dataList = await Billing.find({ isDeleted: false }).sort({ _id: -1 }).exec();

          const formattedData = await Promise.all(
            dataList.map(async (billing: any) => {
              const partyData = billing.partyType.toLowerCase() === 'buyer' ? await Buyer.findById(billing.partyId).exec() : await Seller.findById(billing.partyId).exec();
              return {
                ...billing._doc,
                partyDetail: partyData
              };
            })
          );
          res.status(200).json({ data: formattedData });
        } catch (error: any) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
        break;
      case 'UPDATE':
        try {
          const { billingId, billingDate, billingNo, sgst, cgst, igst, netAmount, brokerage, grandTotalAmt, contracts } = req.body;
          if (!billingId) {
            return res.status(400).json({ error: 'billingNo is required.' });
          }

          const updatedContracts = contracts.map((contract: any) => ({
            ...contract,
            isBillCreated: true
          }));

          try {
            await Billing.updateOne(
              { _id: billingId },
              { $set: { billingDate, billingNo, sgst, cgst, igst, netAmount, brokerage, grandTotalAmt, contracts: [...updatedContracts] } },
              { runValidators: true }
            );
          } catch (error) {
            res.status(500).json({ error: `Internal Server Error ${error}` });
          }

          res.status(200).json({ message: 'Billing updated successfully' });

        } catch (error: any) {
          res.status(500).json({ error: `Internal Server Error ${error}` });
        }
        break;
      case 'DETAIL':
        try {
          const dataList = await Billing.findById(req.body.id).exec();
          if (!dataList) {
            return res.status(404).json({ error: 'Billing not found' });
          }
          res.status(200).json({ data: dataList });
        } catch (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
        break;
      case 'DELETE':
        try {

          const buyerId = req.body.id;
          const deletedBuyer = await Billing.findByIdAndUpdate(
            buyerId,
            { $set: { isDeleted: true, deletedDate: Date.now() } },
            { new: true }
          );

          if (!deletedBuyer) {
            return res.status(404).json({ error: 'Billing not found' });
          }

          res.status(200).json({ message: 'Billing deleted successfully', data: deletedBuyer });

        } catch (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
        break;
      case 'ID-NAME':
        try {
          const dataList = await Billing.find({ isDeleted: false }).select('_id name').exec();
          if (!dataList) {
            return res.status(404).json({ error: 'Billing not found' });
          }
          res.status(200).json({ data: dataList });
        } catch (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
        break;

      case 'PARTY-LIST':
        try {
          const buyerList = await Buyer.find({ isDeleted: false }).select('id name').exec();
          const sellerList = await Seller.find({ isDeleted: false }).select('id name').exec();

          const buyersWithType = buyerList.map(buyer => ({
            ...buyer._doc,   // Spread buyer properties (_doc is used to access Mongoose document fields)
            type: 'buyer'    // Add the 'type' field with value 'buyer'
          }));

          const sellersWithType = sellerList.map(seller => ({
            ...seller._doc,  // Spread seller properties
            type: 'seller'   // Add the 'type' field with value 'seller'
          }));

          const combinedList = [...buyersWithType, ...sellersWithType];
          res.status(200).json({ data: combinedList });
        } catch (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
        break;
      case 'LAST':
        try {
          const dataList = await Billing.findOne({}).sort({ _id: -1 }).exec();
          res.status(200).json({ data: dataList });
        } catch (error: any) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
        break;

      case 'BILL-CREATED-CONTRACT-LIST':
        try {
          const { partyId } = req.body;

          const contractsList = await Billing.aggregate([
            { $unwind: '$contracts' },
            {
              $match: {
                'contracts.isBillCreated': true,
                $or: [{ 'contracts.partyId': new mongoose.Types.ObjectId(partyId) }]
              }
            },
            {
              $project: {
                _id: 0,
                billingNo: 1,
                billingDate: 1,
                'contracts.contractId': 1,
                'contracts.quantity': 1,
                'contracts.price': 1,
                'contracts.brokerageQty': 1,
                'contracts.brokerageAmt': 1,
                'contracts.isBillCreated': 1
              }
            }
          ]);

          res.status(200).json({ total: contractsList.length, data: contractsList });
        } catch (error: any) {
          res.status(500).json({ error: 'Internal Server Error', errorDetail: error.message });
        }
        break;

      case 'BILL-NO-CHECK':
        try {
          const { billingNo } = req.body;
          const data = await Billing.findOne({ billingNo: billingNo }).exec();
          res.status(200).json({ data: data });
        } catch (error: any) {
          res.status(500).json({ error: 'Internal Server Error', errorDetail: error.message });
        }
        break;

      // case 'SEND-BILLING':
      //   try {          
      //     const htmlContent = sentBillingHtmlTemplateOnEmail(req.body);             
      //     await sendHtmlContent({recipient:'ajay@spakcomm.com', subject:'Testing', htmlContent:htmlContent})       
      //     res.status(200).json({ message:'Bill sent...' });
      // } 
      // catch (error: any) {
      //   res.status(500).json({ error: 'Internal Server Error', errorDetail: error.message });
      // }
      //   break;

      case 'SEND-BILLING':
        try {
          const billNo = req.body.billingData.billingNo;
          const htmlContent = sentBillingHtmlTemplateOnEmail(req.body);
          const finalHtmlContent = `
                <div id=":28o" class="a3s aiL">
                    <div>
                        <div class="adM"></div>
                        <b>Dear Sir / Madam,</b>
                        <div style="margin-bottom:30px"></div>

                        <span>Best regards,</span>
                        <div></div>
                        <span>Team Seeds &amp; Feeds India.</span>
                        <p style="margin-top:1px">
                          B-3 GIRIRAJ CO OP H S LTD, 6 MAMLATDAR WADI ROAD NO. 6, MALAD (WEST), MUMBAI - 400 064.
                            <br>
                          PHONE NO: 022 2880 2452 | MOBILE NO: +91 99200 10200 / 99200 90200
                        </p>
                        <div class="yj6qo"></div>
                        <div class="adL"></div>
                    </div>
                      ${htmlContent}
                </div>
            `;
          console.log('Body', req.body);
          const emailList = req.body.partyData.email.split(',').map((email: any) => email.trim().toLowerCase()); //['ajay@spakcomm.com', 'shiv@spakcomm.com', 'sunil@spakcomm.com'];
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          if (Array.isArray(emailList) && emailList.length > 0) {
            for (const email of emailList) {
              if (email && emailRegex.test(email)) {
                await sendHtmlContent({ recipient: `${email}`, subject: `Billing No (${billNo})`, htmlContent: finalHtmlContent });
              } else {
                console.error("Email is invalid:", email);
              }
            }
          }

          //await sendHtmlContent({recipient:'ajay@spakcomm.com', subject:`Billing No (${billNo})`, htmlContent:finalHtmlContent});       
          res.status(200).json({ message: 'Bill sent...' });
        }
        catch (error: any) {
          res.status(500).json({ error: 'Internal Server Error', errorDetail: error.message });
        }
        break;

      case 'BILL-REPORT':
        try {
          // Retrieve all bills, sorted by `_id`
          const billList = await Billing.find({ isDeleted: false }).sort({ _id: -1 }).exec();

          // Fetch party data for each bill in parallel
          const updatedBillingList = await Promise.all(billList.map(async (bill) => {
            try {
              const response = bill.partyType.toLowerCase() === 'seller' ? await getSeller(bill.partyId) : await getBuyer(bill.partyId);
              const partData = (response as any).data;

              return {
                billingDate: bill.billingDate,
                billingNo: bill.billingNo,
                partyName: partData.name,
                gstin: partData.gstin,
                stateCode: partData.state_code,
                netAmount: bill.netAmount,
                sgst: bill.netAmount * (bill.sgst / 100),
                cgst: bill.netAmount * (bill.cgst / 100),
                igst: bill.netAmount * (bill.igst / 100),
                round: 0.00,
                grandTotalAmt: bill.grandTotalAmt,
              };

            } catch (error) {
              console.error('Error fetching party data:', error);
              return null; // Return null or a fallback value in case of an error
            }
          }));

          // Filter out any null values (in case of fetch errors) and send the response
          const filteredBillingList = updatedBillingList.filter((item) => item !== null);
          res.status(200).json({ total: filteredBillingList.length, data: filteredBillingList });
        } catch (error: any) {
          res.status(500).json({ error: 'Internal Server Error', errorDetail: error.message });
        }
        break;

      case 'DOWNLOAD-BILL-REPORT':
        try {

          const {data} = req.body;

          (async function(){
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
          
            const transactions = data.map((item:any, index:number) => ({
              date: new Date(item.billingDate).toLocaleDateString() || '',
              billNo: item.billingNo,
              partyName: item.partyName || ``, 
              gstin: item.gstin || ``,
              stateCode: item.stateCode || ``,
              amount: item.netAmount || 0,
              sgst: item.sgst || 9,
              cgst: item.cgst || 9,
              igst: item.igst || 18,
              round: item.round || 0.00,
              total: item.grandTotalAmt || 0,
          }));

            // Calculate totals
            const totalAmount = transactions.reduce((sum:any, tx:any) => sum + (parseFloat(tx.amount) || 0), 0).toFixed(2);
            const totalCgst = transactions.reduce((sum:any, tx:any) => sum + (parseFloat(tx.cgst) || 0), 0).toFixed(2);
            const totalSgst = transactions.reduce((sum:any, tx:any) => sum + (parseFloat(tx.sgst) || 0), 0).toFixed(2);
            const totalIgst = transactions.reduce((sum:any, tx:any) => sum + (parseFloat(tx.igst) || 0), 0).toFixed(2);
            const totalRound = transactions.reduce((sum:any, tx:any) => sum + (parseFloat(tx.round) || 0), 0).toFixed(2);
            const totalGrandTotal = transactions.reduce((sum:any, tx:any) => sum + (parseFloat(tx.total) || 0), 0).toFixed(2);
            //const finalBalance = transactions[transactions.length - 1].balance;
          
            // Generate HTML table rows
            let tableRows = `
              <tr>
                <th>Date</th>
                <th>Bill No</th>
                <th>Party Name</th>
                <th>GSTIN</th>
                <th>State Code</th>
                <th>Amount</th>
                <th>SGST@9%</th>
                <th>CGST@9%</th>
                <th>IGST18%</th>
                <th>Round</th>
                <th>Total</th>
              </tr>
            `;
          
            transactions.forEach((tx:any) => {
              tableRows += `
                <tr>
                  <td>${tx.date}</td>
                  <td>${tx.billNo}</td>
                  <td>${tx.partyName}</td>
                  <td>${tx.gstin}</td>
                  <td>${tx.stateCode}</td>
                  <td>${tx.amount}</td>
                  <td>${tx.sgst}</td>
                  <td>${tx.cgst}</td>
                  <td>${tx.igst}</td>
                  <td>${tx.round}</td>
                  <td>${tx.total}</td>
                </tr>
              `;
            });
          

            // Add totals row
            tableRows += `
              <tr class="totals">
                <td colspan="5" style="text-align:right; padding-right:20px;"><strong>Totals</strong></td>
                <td><strong>${totalAmount}</strong></td>
                <td><strong>${totalCgst}</strong></td>
                <td><strong>${totalSgst}</strong></td>
                <td><strong>${totalIgst}</strong></td>
                <td><strong>${totalRound}</strong></td>
                <td><strong>${totalGrandTotal}</strong></td>
              </tr>
            `;
          
            // Define HTML content with CSS for multi-page
            const content = `
              <html>
                <head>
                  <style>
                    @page {
                      margin: 15px 10px;
                    }
                    body {
                      font-family: Arial, sans-serif;
                      font-size: 12px;
                    }                    
                    .heading {
                      color:red;
                    }

                    .billing-reporting-header {                        
                        display: flex;
                        justify-content: center;
                        padding: 15px 0;
                    }

                    .billing-reporting-header-year {
                      background-color: #f2f2f2;
                      display: flex;
                      justify-content: center;
                      padding: 15px 0;
                      font-size: 14px;
                      margin-bottom:15px;
                  }

                    .table {
                      width: 100%;
                      border-collapse: collapse;
                      page-break-inside: auto;
                    }
                    .table th, .table td {
                        text-align:left;
                        font-size:10px;
                      }
                      .table td {
                      padding: 5px 0;
                      }
                    .table th {
                     padding-bottom:5px;
                    }

                    

                    .totals td {
                     padding-top:15px;
                    }



                    .totals {
                     border-top:1px solid #000;
                    }

                  </style>
                </head>
                <body>
                
                <div class="billing-reporting-header">
                  <img src="http://13.235.48.111/images/billing-logo.jpg" alt="Signature" style="width: 100%; height: auto; display: block; margin: 0 0 0 0;" />
                </div>

                <div class="billing-reporting-header-year"><b>Accounting Year: 01/04/2024 - 03/31/2025</b></div>
                
                  <table class="table">
                    <thead>
                      ${tableRows.split('</tr>')[0]}</tr>
                    </thead>
                    <tbody>
                      ${tableRows.split('</tr>').slice(1, -1).join('</tr>')}
                    </tbody>
                    <tfoot>
                      ${tableRows.split('</tr>').slice(-1)[0]}
                    </tfoot>
                  </table>
                </body>
              </html>
            `;
          
            await page.setContent(content, { waitUntil: 'networkidle0' });
          
            await page.pdf({
              path: path.join(process.cwd(), 'public', 'pdf', 'billing_statement.pdf'),  //'billing_statement.pdf',
              format: 'A4',
              printBackground: true,
              landscape: true,
              margin: {
                top: '50px',
                bottom: '50px',
                left: '50px',
                right: '50px'
              },
              displayHeaderFooter: true,
              preferCSSPageSize: true,
            });
          
            await browser.close();            
          })();

          res.status(200).json({ message: 'DOWNLOAD-BILL-REPORT' });
        } catch (error: any) {
          res.status(500).json({ error: 'Internal Server Error', errorDetail: error.message });
        }
        break;

    }

  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }

}
