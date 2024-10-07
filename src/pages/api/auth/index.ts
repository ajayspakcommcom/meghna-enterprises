import type { NextApiRequest, NextApiResponse } from 'next';

import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import Cors from 'cors';
import runMiddleware from '../libs/runMiddleware';
import connectToMongoDB from '../libs/mongodb';
import { User } from '../models/User';


// Define a type for the user object
type User = {
    id: ObjectId;
    username: string;
    password: string;
};

// Define a type for the request body
type LoginRequest = {
    username: string;
    password: string;
};

const cors = Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'OPTIONS'],
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Only allow POST requests

    await connectToMongoDB(); // This is for database connection
    await runMiddleware(req, res, cors); // This is for cors

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    } else {

        try {
            const { username, password }: LoginRequest = req.body;

            // Check if the user exists
            const user = await User.findOne({ username });

            if (!user) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            //Check if the password is correct
            const isPasswordValid = user.password === password;

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            // Generate JWT token
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

            // Send the token in the response
            res.status(200).json({ token, user: user });
        } catch (error) {
            console.error('Error while logging in:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
