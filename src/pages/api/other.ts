import connectToMongoDB from './libs/mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import runMiddleware from './libs/runMiddleware';
import Cors from 'cors';
import { sendEmail } from './libs/emailService';

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
  //const user = verifyToken(req);

  // if (!user) {
  //   return res.status(401).json({ message: 'Unauthorized' });
  // } else {

  if (req.method === 'POST') {

    switch (req.body.type) {
      case 'MAIL':
        try {

          const htmlContent = `<div>
                                  <b>Dear ${req.body.FirstName},</b>
                                  <div style="padding:5px 15px;"></div>
                                  <p>Thank you for reaching out to us.</p>
                                  <p>We will get in touch soon.</p>
                                  <div style="padding:15px 15px;"></div>
                                  <div style="display:inline-block; padding:15px 0;">
                                      <img src="https://astaracademy.in/img/logo.png" alt="Image" style="width:200px; height:auto;">
                                  </div>
                                </div>
                              `;


          const emailSent = await sendEmail({ recipient: req.body.Email, subject: 'Admission Submission', text: htmlContent });


          res.status(201).json({ message: 'Seller have been successfully created.' });
        } catch (error: any) {
          res.status(500).json({ error: 'Internal Error', errorDetail: 'An unexpected error occurred' });
        }

        break;


    }

  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }

}
