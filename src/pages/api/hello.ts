// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connectToMongoDB from "./libs/mongodb";
import runMiddleware from "./libs/runMiddleware";
import { verifyToken } from "./libs/verifyToken";
import Cors from 'cors';

export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  await connectToMongoDB();
  await runMiddleware(req, res, cors);
  const user = verifyToken(req);

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  } else {

    if (req.method === 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }

  }
}
