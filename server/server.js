import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import prisma from './configs/db.js';
import aiRouter from './routes/aiRoutes.js';
import authRouter from './routes/authRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import { auth } from './middlewares/auth.js';
import Stripe from 'stripe';

const app = express()

await connectCloudinary()

app.use(cors())
app.use(express.json())

app.get('/', (req, res)=>res.send('Server is Live!'))

// Manual endpoint to update user plan (for testing)
app.post('/api/user/update-plan', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { plan } = req.body;
    
    if (!plan || !['free', 'premium'].includes(plan)) {
      return res.status(400).json({ success: false, message: 'Invalid plan. Must be "free" or "premium"' });
    }
    
    // Update user plan in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { plan }
    });
    
    console.log(`Updated user ${userId} to ${plan} plan`);
    
    res.json({ 
      success: true, 
      message: `User plan updated to ${plan}`,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        plan: updatedUser.plan
      }
    });
    
  } catch (error) {
    console.error('Error updating user plan:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Stripe webhook (optional - for premium subscriptions)
if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
      console.log(`Received webhook event: ${event.type}`);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      let userId = null;
      let subscriptionStatus = 'active';

      // Handle checkout.session.completed
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        userId = session.client_reference_id;
        subscriptionStatus = 'active';
      }
      // Handle subscription events
      else if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
        const subscription = event.data.object;
        userId = subscription.metadata?.userId;
        subscriptionStatus = subscription.status;
      }
      // Handle subscription deletion
      else if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object;
        userId = subscription.metadata?.userId;
        subscriptionStatus = 'canceled';
      }

      // Update user plan in database
      if (userId) {
        const plan = subscriptionStatus === 'active' ? 'premium' : 'free';
        await prisma.user.update({
          where: { id: userId },
          data: { plan }
        });
        console.log(`Updated user ${userId} to ${plan} plan via Stripe webhook`);
      }
    } catch (e) {
      console.error('Webhook handler error:', e);
      return res.status(500).send('Webhook handler error');
    }

    res.json({ received: true });
  });
}

app.use('/api/auth', authRouter)
app.use('/api/ai', aiRouter)
app.use('/api/user', userRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log('Server is running on port', PORT);
})