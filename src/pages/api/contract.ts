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

          //contract_no
          //buyer_id
          //seller_id
          //template
          //label
          //quantity
          //price
          //assessment_year

          console.clear();
          console.log('req.body.type', req.body.type);
          console.log('req.body.buyer_id', req.body.buyer_id);
          console.log('req.body.seller_id', req.body.seller_id);
          console.log('req.body.template', req.body.template);
          console.log('req.body.label', req.body.label);
          console.log('req.body.quantity', req.body.quantity);
          console.log('req.body.price', req.body.price);
          console.log('req.body.assessment_year', req.body.assessment_year);

          const contract = await Contract.create({
            buyer_id: req.body.buyer_id,
            seller_id: req.body.seller_id,
            template: req.body.template,
            label: req.body.label,
            quantity: req.body.quantity,
            price: req.body.price,
            assessment_year: req.body.assessment_year
          });

          res.status(201).json({ message: 'Contract have been successfully created.' });
        } catch (error: any) {
          console.log('Error', error)
          res.status(500).json({ error: 'Internal Error', errorDetail: 'An unexpected error occurred' });
        }

        break;
      case 'LIST':
        try {
          const dataList = await Contract.find({}).exec();
          res.status(200).json({ data: dataList });
        } catch (error: any) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
        break;
    }

  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }

}
