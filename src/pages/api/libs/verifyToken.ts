import jwt from 'jsonwebtoken';
import type { NextApiRequest } from 'next';

export function verifyToken(req: NextApiRequest) {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Bearer Token
        if (!token) {
            throw new Error('Token not provided');
        }
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }
        return jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload; // Cast the return type to JwtPayload
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            // Handle token expired error specifically if needed
            console.error('Token expired:', error.message);
        } else if (error instanceof jwt.JsonWebTokenError) {
            // Handle other JWT errors
            console.error('JWT error:', error.message);
        } else {
            // Handle other errors (like missing token or missing secret)
            console.error('Error verifying token:', error);
        }
        return null;
    }
}
