// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectToMongoDB from './libs/mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Error } from 'mongoose';
import { Error as MongooseError } from 'mongoose';
import runMiddleware from './libs/runMiddleware';
import Cors from 'cors';
import { Seller } from './models/Seller';




interface ApiResponse {
  message?: string;
  error?: string;
  errorDetail?: any;
  data?: any;
}

const cors = Cors({
  // Only allow requests with GET, POST and OPTIONS
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {

  await connectToMongoDB();
  await runMiddleware(req, res, cors);
  //const user = verifyToken(req);

  // if (!user) {
  //   return res.status(401).json({ message: 'Unauthorized' });
  // } else {

  if (req.method === 'POST') {

    switch (req.body.type) {
      case 'CREATE':
        try {

          const seller = await Seller.create({
            name: req.body.name,
            address: req.body.address,
            telephone_no: req.body.telephone_no,
            mobile_no: req.body.mobile_no,
            fax: req.body.fax,
            pan: req.body.pan,
            gstin: req.body.gstin,
            state_code: req.body.state_code,
            email: req.body.email
          });


          res.status(201).json({ message: 'Seller have been successfully created.' });
        } catch (error: any) {
          res.status(500).json({ error: 'Internal Error', errorDetail: 'An unexpected error occurred' });
        }

        break;
      case 'LIST':
        try {
          const dataList = await Seller.find({ isDeleted: false }).sort({ _id: -1 }).exec();
          res.status(200).json({ data: dataList });
        } catch (error: any) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
        break;

      case 'UPDATE':
        try {

          const sellerId = req.body.id;

          const updatedData = {
            name: req.body.name,
            address: req.body.address,
            telephone_no: req.body.telephone_no,
            mobile_no: req.body.mobile_no,
            fax: req.body.fax,
            pan: req.body.pan,
            gstin: req.body.gstin,
            state_code: req.body.state_code,
            email: req.body.email,
            updatedDate: Date.now(),
          };

          const updatedSeller = await Seller.findByIdAndUpdate(sellerId, updatedData, { new: true });

          if (!updatedSeller) {
            return res.status(404).json({ error: 'Seller not found' });
          }

          res.status(200).json({ message: 'Seller updated successfully', data: updatedSeller });

        } catch (error: any) {
          res.status(500).json({ error: `Internal Server Error ${error}` });
        }
        break;

      case 'DETAIL':
        try {
          const dataList = await Seller.findById(req.body.id).exec();
          if (!dataList) {
            return res.status(404).json({ error: 'Seller not found' });
          }
          res.status(200).json({ data: dataList });
        } catch (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
        break;

      case 'DELETE':
        try {

          const sellerId = req.body.id;
          const deletedSeller = await Seller.findByIdAndUpdate(
            sellerId,
            { $set: { isDeleted: true, deletedDate: Date.now() } },
            { new: true }
          );

          if (!deletedSeller) {
            return res.status(404).json({ error: 'Seller not found' });
          }

          res.status(200).json({ message: 'Seller deleted successfully', data: deletedSeller });

        } catch (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
        break;

      case 'ID-NAME':
        try {
          const dataList = await Seller.find({ isDeleted: false }).select('_id name').exec();
          if (!dataList) {
            return res.status(404).json({ error: 'Seller not found' });
          }
          res.status(200).json({ data: dataList });
        } catch (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
        break;

    }

  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }

}
