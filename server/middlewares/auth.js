import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Middleware to check JWT token and user authentication
export const auth = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Unauthorized - No token provided' });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        
        // Get user from database
        const user = await prisma.user.findUnique({ where: { id: userId } });
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }
        
        // Store user info in request
        req.userId = user.id;
        req.user = user;
        req.auth = { userId: user.id }; // For compatibility with existing code
        
        // Check plan
        const hasPremiumPlan = user.plan === 'premium';
        req.plan = user.plan;
        req.free_usage = user.freeUsage;
        
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token expired' });
        }
        res.status(401).json({ success: false, message: 'Unauthorized' });
    }
};