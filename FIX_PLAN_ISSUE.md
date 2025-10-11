# Fix: Premium Plan Not Showing in UI

## Problem
The user has selected the Premium plan (as shown in the screenshots), but the UI still displays "Free Plan" in both the dashboard and sidebar.

## Root Cause
The Stripe webhook is not configured properly because the environment variables are missing:
- `STRIPE_SECRET_KEY` is not set
- `STRIPE_WEBHOOK_SECRET` is not set

This means when the user completes payment, the webhook doesn't receive the Stripe events to update the Clerk user metadata.

## Immediate Fix (Manual Update)

Since the payment has already been completed, you can manually update the user's plan:

### Method 1: Using Browser Console

1. Open your browser to `http://localhost:5173`
2. Open Developer Tools (F12)
3. Go to the Console tab
4. Run this command:

```javascript
fetch('/api/user/update-plan', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + (await window.Clerk.session.getToken())
  },
  body: JSON.stringify({ plan: 'premium' })
}).then(r => r.json()).then(console.log);
```

5. Refresh the page - you should now see "Premium Plan" in the UI

### Method 2: Using curl (if you have the user's token)

```bash
curl -X POST http://localhost:3000/api/user/update-plan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -d '{"plan": "premium"}'
```

## Permanent Fix (Configure Stripe Webhook)

To prevent this issue in the future, you need to configure the Stripe webhook:

### 1. Add Environment Variables

Add these to your `server/.env` file:

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 2. Configure Stripe Webhook

1. Go to your Stripe Dashboard → Webhooks
2. Create a new webhook endpoint
3. Set the URL to: `https://your-domain.com/webhooks/stripe`
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
5. Copy the webhook secret and add it to your `.env` file

### 3. Test the Webhook

Run the test script to verify configuration:

```bash
cd server
node test-webhook.js
```

## How It Works

The webhook handler in `server/server.js` listens for Stripe events and updates the Clerk user metadata:

```javascript
await clerkClient.users.updateUserMetadata(clerkUserId, {
  privateMetadata: {
    stripe_subscription_status: subscriptionStatus,
    subscription_status: subscriptionStatus,
  },
  publicMetadata: {
    plan: plan
  }
});
```

The UI uses Clerk's `<Protect plan='premium' fallback="Free">` component which checks this metadata to display the correct plan.

## Verification

After applying the fix:
1. The dashboard should show "Premium" instead of "Free"
2. The sidebar should show "Premium Plan" instead of "Free Plan"
3. Premium features should be accessible

## Files Modified

- `server/server.js` - Added manual plan update endpoint
- `WEBHOOK_SETUP.md` - Complete webhook setup documentation
- `test-webhook.js` - Webhook configuration test script
