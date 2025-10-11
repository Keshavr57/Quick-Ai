import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware, requireAuth } from '@clerk/express'
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import Stripe from 'stripe';
import { clerkClient } from '@clerk/express';

const app = express()

await connectCloudinary()

app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

app.get('/', (req, res)=>res.send('Server is Live!'))

// Stripe webhook (must be before JSON parser for raw body)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed' || event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.created') {
      const session = event.data.object;
      const clerkUserId = session.client_reference_id || session.metadata?.clerkUserId;
      const subscriptionStatus = session.status || session.subscription?.status || 'active';
      if (clerkUserId) {
        await clerkClient.users.updateUserMetadata(clerkUserId, {
          privateMetadata: {
            stripe_subscription_status: subscriptionStatus,
            subscription_status: subscriptionStatus,
          },
          publicMetadata: {
            plan: subscriptionStatus === 'active' ? 'premium' : 'free'
          }
        });
      }
    }
    if (event.type === 'customer.subscription.deleted') {
      const session = event.data.object;
      const clerkUserId = session.metadata?.clerkUserId;
      if (clerkUserId) {
        await clerkClient.users.updateUserMetadata(clerkUserId, {
          privateMetadata: {
            stripe_subscription_status: 'canceled',
            subscription_status: 'canceled',
          },
          publicMetadata: { plan: 'free' }
        });
      }
    }
  } catch (e) {
    return res.status(500).send('Webhook handler error');
  }

  res.json({ received: true });
});

app.use(express.json())
app.use(requireAuth())

app.use('/api/ai', aiRouter)
app.use('/api/user', userRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log('Server is running on port', PORT);
})