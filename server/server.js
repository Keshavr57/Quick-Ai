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

// Test endpoint to check webhook configuration
app.get('/webhook-test', (req, res) => {
  res.json({
    message: 'Webhook endpoint is accessible',
    timestamp: new Date().toISOString(),
    environment: {
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      hasClerkSecret: !!process.env.CLERK_SECRET_KEY
    }
  });
});

// Clerk webhook handler (for PricingTable integration)
app.post('/webhooks/clerk', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const event = JSON.parse(req.body);
    console.log('Received Clerk webhook event:', event.type);
    
    if (event.type === 'user.updated') {
      const user = event.data;
      console.log('User updated:', user.id);
      
      // Check if user has premium subscription
      // This would need to be customized based on how Clerk tracks subscriptions
      const hasPremium = user.public_metadata?.subscription_status === 'active' ||
                        user.public_metadata?.plan === 'premium';
      
      if (hasPremium) {
        console.log(`User ${user.id} has premium subscription`);
      }
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Clerk webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Manual endpoint to update user plan (for testing)
app.post('/api/user/update-plan', requireAuth(), async (req, res) => {
  try {
    const { userId } = req.auth;
    const { plan } = req.body;
    
    if (!plan || !['free', 'premium'].includes(plan)) {
      return res.status(400).json({ success: false, message: 'Invalid plan. Must be "free" or "premium"' });
    }
    
    const isActive = plan === 'premium';
    
    // Update with multiple possible formats that Clerk might expect
    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: {
        stripe_subscription_status: isActive ? 'active' : 'canceled',
        subscription_status: isActive ? 'active' : 'canceled',
        plan: plan,
        hasPremiumPlan: isActive
      },
      publicMetadata: {
        plan: plan,
        subscription_plan: plan,
        hasPremiumPlan: isActive,
        // Try different formats that Clerk Protect might expect
        subscription: {
          plan: plan,
          status: isActive ? 'active' : 'inactive'
        }
      }
    });
    
    // Also try updating the user's unsafe metadata
    await clerkClient.users.updateUserMetadata(userId, {
      unsafeMetadata: {
        plan: plan,
        subscription_plan: plan,
        hasPremiumPlan: isActive
      }
    });
    
    console.log(`Manually updated user ${userId} to ${plan} plan with multiple metadata formats`);
    
    // Get the updated user to verify
    const updatedUser = await clerkClient.users.getUser(userId);
    
    res.json({ 
      success: true, 
      message: `User plan updated to ${plan}`,
      plan: plan,
      metadata: {
        public: updatedUser.publicMetadata,
        private: updatedUser.privateMetadata,
        unsafe: updatedUser.unsafeMetadata
      }
    });
    
  } catch (error) {
    console.error('Error updating user plan:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Stripe webhook (must be before JSON parser for raw body)
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
    let clerkUserId = null;
    let subscriptionStatus = 'active';

    // Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      clerkUserId = session.client_reference_id;
      subscriptionStatus = 'active';
      console.log(`Checkout completed for user: ${clerkUserId}`);
      console.log('Session object:', JSON.stringify(session, null, 2));
    }
    
    // Handle subscription events
    else if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
      const subscription = event.data.object;
      clerkUserId = subscription.metadata?.clerkUserId;
      subscriptionStatus = subscription.status;
      console.log(`Subscription ${event.type} for user: ${clerkUserId}, status: ${subscriptionStatus}`);
      console.log('Subscription object:', JSON.stringify(subscription, null, 2));
    }
    
    // Handle subscription deletion
    else if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      clerkUserId = subscription.metadata?.clerkUserId;
      subscriptionStatus = 'canceled';
      console.log(`Subscription deleted for user: ${clerkUserId}`);
    }
    
    // Handle invoice payment succeeded (alternative event)
    else if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object;
      if (invoice.subscription) {
        // Get the subscription to find the clerkUserId
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
        clerkUserId = subscription.metadata?.clerkUserId;
        subscriptionStatus = subscription.status;
        console.log(`Invoice payment succeeded for user: ${clerkUserId}, status: ${subscriptionStatus}`);
      }
    }

    // Update Clerk user metadata if we have a valid user ID
    if (clerkUserId) {
      const isActive = subscriptionStatus === 'active';
      const plan = isActive ? 'premium' : 'free';
      
      console.log(`Updating Clerk user ${clerkUserId} with plan: ${plan}`);
      
      try {
        await clerkClient.users.updateUserMetadata(clerkUserId, {
          privateMetadata: {
            stripe_subscription_status: subscriptionStatus,
            subscription_status: subscriptionStatus,
          },
          publicMetadata: {
            plan: plan
          }
        });
        
        console.log(`Successfully updated user ${clerkUserId} metadata`);
      } catch (clerkError) {
        console.error(`Failed to update Clerk user ${clerkUserId}:`, clerkError);
        throw clerkError;
      }
    } else {
      console.warn(`No clerkUserId found for event type: ${event.type}`);
      console.log('Event data:', JSON.stringify(event.data, null, 2));
    }
    
  } catch (e) {
    console.error('Webhook handler error:', e);
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