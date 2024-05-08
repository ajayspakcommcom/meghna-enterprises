// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectToMongoDB from './libs/mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Error } from 'mongoose';
import { Error as MongooseError } from 'mongoose';
import runMiddleware from './libs/runMiddleware';
import Cors from 'cors';
import { Template } from './models/Template';




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

          const template = await Template.create({
            name: req.body.name,
            label: req.body.label,
          });

          res.status(201).json({ message: 'Template have been successfully created.' });
        } catch (error: any) {

          if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 11000) {

            const errorMessage = (error as any).errmsg;

            if (errorMessage.includes('name_1')) {
              return res.status(400).json({ error: 'Duplicate Name', errorDetail: 'The Template type name is already in use. Please choose a different name.' });
            }
            else {
              res.status(500).json({ error: 'Internal Error', errorDetail: error });
            }
          }

          res.status(500).json({ error: 'Internal Error', errorDetail: 'An unexpected error occurred' });
        }

        break;
      case 'LIST':
        try {
          const dataList = await Template.find({}).exec();
          res.status(200).json({ data: dataList });
        } catch (error: any) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
        break;

      case 'DETAIL':
        try {
          const dataList = await Template.findById(req.body.id).exec();
          if (!dataList) {
            return res.status(404).json({ error: 'Template not found' });
          }
          res.status(200).json({ data: dataList });
        } catch (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
        break;

      case 'ID-NAME':
        try {
          const dataList = await Template.findById(req.body.id).select('_id name').exec();
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
