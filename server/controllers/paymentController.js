import Razorpay from 'razorpay';
import crypto from 'crypto';
import prisma from '../configs/db.js';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID', // Fallback for dev prevention
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET'
});

// Create Order
export const createOrder = async (req, res) => {
    try {
        const userId = req.userId;
        const { planId = 'premium_monthly' } = req.body;

        // You can have different amounts for different plans
        const amount = 19900; // ₹199.00 in paise
        const currency = 'INR';

        const options = {
            amount: amount,
            currency: currency,
            receipt: `rcpt_${userId.substring(0, 10)}_${Date.now().toString().slice(-10)}`,
            notes: {
                userId: userId,
                plan: 'premium'
            }
        };

        const order = await razorpay.orders.create(options);

        res.json({
            success: true,
            order
        });

    } catch (error) {
        console.error('Create Order Error:', error);
        res.status(500).json({ success: false, message: 'Failed to create payment order' });
    }
};

// Verify Payment
export const verifyPayment = async (req, res) => {
    try {
        const userId = req.userId;
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Payment successful, update user
            await prisma.user.update({
                where: { id: userId },
                data: {
                    plan: 'premium',
                    updatedAt: new Date()
                }
            });

            res.json({
                success: true,
                message: 'Payment verified and plan updated'
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid signature'
            });
        }

    } catch (error) {
        console.error('Verify Payment Error:', error);
        res.status(500).json({ success: false, message: 'Payment verification failed' });
    }
};
