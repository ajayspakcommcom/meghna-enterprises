import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import runMiddleware from './libs/runMiddleware';
import connectToMongoDB from './libs/mongodb';
import { User } from './models/User';


const cors = Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'OPTIONS'],
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Only allow GET requests
    await runMiddleware(req, res, cors);

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Only GET requests allowed' });
    }

    try {
        // Connect to MongoDB
        await connectToMongoDB();

        // Fetch all users from the database
        const users = await User.find();

        // Send the list of users in the response
        res.status(200).json(users);
    } catch (error) {
        console.error('Error while fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
