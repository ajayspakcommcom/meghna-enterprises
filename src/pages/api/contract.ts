// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectToMongoDB from './libs/mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Error } from 'mongoose';
import { Error as MongooseError } from 'mongoose';
import runMiddleware from './libs/runMiddleware';
import Cors from 'cors';
import { Contract } from './models/Contract';

interface ApiResponse {
  message?: string;
  error?: string;
  errorDetail?: any;
  data?: any;
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
          await Contract.create({
            contract_no: req.body.contract_no,
            buyer_id: req.body.buyer_id,
            seller_id: req.body.seller_id,
            template: req.body.template,
            label: req.body.label,
            quantity: req.body.quantity,
            price: 'Rs ' + req.body.price,
            assessment_year: req.body.assessment_year,
            template_id: req.body.template_id,
            company: req.body.company,
            createdDate: req.body.createdDate,
          });

          res.status(201).json({ message: 'Contract have been successfully created.' });
        } catch (error: any) {
          res.status(500).json({ error: 'Internal Error', errorDetail: 'An unexpected error occurred' });
        }

        break;
      case 'LIST':
        try {

          const dataList = await Contract.find({ isDeleted: false, company: req.body.company })
            .sort({ _id: -1 }).populate('buyer_id')
            .populate('seller_id').exec();

          res.status(200).json({ data: dataList });
        } catch (error: any) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
        break;

      case 'UPDATE':
        try {

          const contractId = req.body.id;

          const updatedData = {
            contract_no: req.body.contract_no,
            buyer_id: req.body.buyer_id,
            seller_id: req.body.seller_id,
            template: req.body.template,
            label: req.body.label,
            quantity: req.body.quantity,
            price: req.body.price,
            assessment_year: req.body.assessment_year,
            template_id: req.body.template_id,
            createdDate: req.body.createdDate,
            updatedDate: Date.now(),
          };

          const updatedContract = await Contract.findByIdAndUpdate(contractId, updatedData, { new: true });

          if (!updatedContract) {
            return res.status(404).json({ error: 'Contract not found' });
          }

          res.status(200).json({ message: 'Contract updated successfully', data: updatedContract });

        } catch (error: any) {
          res.status(500).json({ error: `Internal Server Error ${error}` });
        }
        break;


      case 'DETAIL':
        try {
          const dataList = await Contract.findById(req.body.id).populate('buyer_id')
            .populate('seller_id').exec();
          if (!dataList) {
            return res.status(404).json({ error: 'Contract not found' });
          }
          res.status(200).json({ data: dataList });
        } catch (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
        break;

      case 'SELLER-CONTRACT':
        try {
          const dataList = await Contract.find({ isDeleted: false, seller_id: req.body.id }, 'template contract_no seller_id quantity price createdDate').exec();

          if (!dataList) {
            return res.status(404).json({ error: 'Contract not found' });
          }

          const updatedDataList = dataList.map(item => {
            const priceWithText = item.price;
            const quantityWithText = item.quantity
            const price = parseInt(priceWithText.replace(/[^\d.-]+/g, ''));
            const quantity = parseInt(quantityWithText.replace(/[^\d.-]+/g, ''));

            return {
              ...item.toObject(),
              category: 'Seller',
              price: isNaN(price) ? 0 : price,
              quantity: isNaN(quantity) ? 0 : quantity,
              template: item.template ? Object.fromEntries(item.template) : {},
              label: item.label ? Object.fromEntries(item.label) : {}
            }

          });


          res.status(200).json({ data: updatedDataList });
        } catch (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
        break;


      case 'BUYER-CONTRACT':
        try {
          const dataList = await Contract.find({ isDeleted: false, buyer_id: req.body.id }, 'template contract_no buyer_id quantity price createdDate').exec();
          if (!dataList) {
            return res.status(404).json({ error: 'Contract not found' });
          }

          const updatedDataList = dataList.map(item => {
            const priceWithText = item.price;
            const quantityWithText = item.quantity
            const price = parseInt(priceWithText.replace(/[^\d.-]+/g, ''));
            const quantity = parseInt(quantityWithText.replace(/[^\d.-]+/g, ''));
            return {
              ...item.toObject(),
              category: 'Buyer',
              price: isNaN(price) ? 0 : price,
              quantity: isNaN(quantity) ? 0 : quantity,
              template: item.template ? Object.fromEntries(item.template) : {},
              label: item.label ? Object.fromEntries(item.label) : {}
            }

          });


          res.status(200).json({ data: updatedDataList });
        } catch (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
        break;

      case 'DELETE':
        try {

          const contractId = req.body.id;
          const deletedContract = await Contract.findByIdAndUpdate(
            contractId,
            { $set: { isDeleted: true, deletedDate: Date.now() } },
            { new: true }
          );

          if (!deletedContract) {
            return res.status(404).json({ error: 'Contract not found' });
          }

          res.status(200).json({ message: 'Contract deleted successfully', data: deletedContract });

        } catch (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
        break;

      case 'LAST':
        try {
          const dataList = await Contract.findOne({}).sort({ _id: -1 }).exec();
          res.status(200).json({ data: dataList });
        } catch (error: any) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
        break;

      case 'ID-NAME':
        try {
          const dataList = await Contract.find({ isDeleted: false }).select('_id contract_no').exec();
          if (!dataList) {
            return res.status(404).json({ error: 'Contract not found' });
          }
          res.status(200).json({ data: dataList });
        } catch (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
        break;

      case 'BUYER-SELLER-DETAIL':

        try {
          const dataList = await Contract.findById({ isDeleted: false, _id: req.body.id })
            .populate('buyer_id')
            .populate('seller_id')
            .exec();

          if (!dataList || dataList.length === 0) {
            return res.status(404).json({ error: 'Contracts not found' });
          }

          res.status(200).json({ data: dataList });
        } catch (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
        break;

      case 'CONTRACT-NO-CHECK':
        try {
          const { contractNo } = req.body;
          const data = await Contract.findOne({ contract_no: contractNo }).exec();
          res.status(200).json({ data: data });
        } catch (error: any) {
          res.status(500).json({ error: 'Internal Server Error', errorDetail: error.message });
        }
        break;

    }


  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }

}
