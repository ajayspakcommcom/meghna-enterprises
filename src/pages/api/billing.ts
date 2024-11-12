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
import {sendHtmlContent} from './libs/sendHtmlService'
import { sentBillingHtmlTemplateOnEmail } from '@/services/common';
import { getSeller } from '@/services/seller';
import { getBuyer } from '@/services/buyer';


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
          const {billingId, billingDate, billingNo, sgst, cgst, igst, netAmount,brokerage,grandTotalAmt, contracts} = req.body;          
          if (!billingId) {
            return res.status(400).json({ error: 'billingNo is required.' });
          }

          const updatedContracts = contracts.map((contract:any) => ({
              ...contract,
              isBillCreated: true
            }));
          
          try {
            await Billing.updateOne(
              { _id: billingId },
              { $set: {billingDate, billingNo, sgst, cgst, igst, netAmount,brokerage,grandTotalAmt, contracts: [...updatedContracts]} },
              { runValidators: true }
            );
          } catch(error) {
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
            const billNo =  req.body.billingData.billingNo; 
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
            const emailList =  req.body.partyData.email.split(',').map((email: any) => email.trim().toLowerCase()); //['ajay@spakcomm.com', 'shiv@spakcomm.com', 'sunil@spakcomm.com'];
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (Array.isArray(emailList) && emailList.length > 0) {
              for (const email of emailList) {
                if (email && emailRegex.test(email)) {                  
                  await sendHtmlContent({recipient:`${email}`, subject:`Billing No (${billNo})`, htmlContent:finalHtmlContent});
                } else {
                  console.error("Email is invalid:", email);
                }
              }
            }

            //await sendHtmlContent({recipient:'ajay@spakcomm.com', subject:`Billing No (${billNo})`, htmlContent:finalHtmlContent});       
            res.status(200).json({ message:'Bill sent...' });
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
                      sgst: bill.netAmount * (bill.sgst/100),
                      cgst: bill.netAmount * (bill.cgst/100),
                      igst: bill.netAmount * (bill.igst/100),
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
        
    }

  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }

}
