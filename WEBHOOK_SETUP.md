# Stripe Webhook Setup for Clerk Integration

This document explains how to set up and troubleshoot the Stripe webhook integration that updates Clerk user metadata after successful payments.

## Overview

The webhook handler is located in `server/server.js` and listens for Stripe events to update user plans in Clerk from "Free Plan" to "Premium Plan".

## Webhook Endpoint

- **URL**: `POST /webhooks/stripe`
- **Content-Type**: `application/json`
- **Authentication**: Stripe signature verification

## Supported Events

The webhook handles the following Stripe events:

1. **`checkout.session.completed`** - When a checkout session is completed
2. **`customer.subscription.created`** - When a new subscription is created
3. **`customer.subscription.updated`** - When a subscription is updated
4. **`customer.subscription.deleted`** - When a subscription is deleted
5. **`invoice.payment_succeeded`** - When an invoice payment succeeds

## Required Environment Variables

Make sure these are set in your `.env` file:

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
CLERK_SECRET_KEY=sk_test_...
```

## Stripe Dashboard Configuration

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

## How It Works

1. **Checkout Session**: When using Clerk's `PricingTable`, the `client_reference_id` should automatically be set to the Clerk user ID
2. **Webhook Receives Event**: The webhook receives the Stripe event
3. **Extract User ID**: The webhook extracts the Clerk user ID from either:
   - `session.client_reference_id` (for checkout events)
   - `subscription.metadata.clerkUserId` (for subscription events)
4. **Update Clerk Metadata**: The webhook updates the user's metadata in Clerk:
   - `publicMetadata.plan`: "premium" or "free"
   - `privateMetadata.stripe_subscription_status`: subscription status
   - `privateMetadata.subscription_status`: subscription status

## Testing

### 1. Test Webhook Configuration

Run the test script to verify your setup:

```bash
cd server
node test-webhook.js
```

### 2. Test Webhook Endpoint

Visit: `https://your-domain.com/webhook-test`

This will show if your environment variables are configured correctly.

### 3. Test with Stripe CLI (Local Development)

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/webhooks/stripe

# In another terminal, trigger a test event
stripe trigger checkout.session.completed
```

### 4. Check Server Logs

The webhook includes detailed logging. Check your server logs for:

```
Received webhook event: checkout.session.completed
Checkout completed for user: user_xxx
Updating Clerk user user_xxx with plan: premium
Successfully updated user user_xxx metadata
```

## Troubleshooting

### Issue: User plan not updating after payment

**Possible Causes:**

1. **Missing `client_reference_id`**: The Clerk user ID is not being passed to Stripe
2. **Webhook not receiving events**: Check Stripe Dashboard → Webhooks → Recent deliveries
3. **Wrong webhook secret**: Verify `STRIPE_WEBHOOK_SECRET` in your `.env` file
4. **Clerk API error**: Check server logs for Clerk API errors

**Debug Steps:**

1. Check server logs for webhook events
2. Verify the webhook URL is accessible
3. Test with Stripe CLI to see raw webhook payload
4. Check if `client_reference_id` is present in the webhook payload

### Issue: Webhook signature verification failed

- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Ensure the webhook endpoint URL matches exactly
- Check that the webhook is receiving raw body data

### Issue: Clerk user not found

- Verify the user ID format is correct
- Check if the user exists in your Clerk dashboard
- Ensure `CLERK_SECRET_KEY` has the correct permissions

## Manual Testing

To manually test the webhook:

1. Create a test user in Clerk
2. Note the user ID (e.g., `user_xxx`)
3. Create a test checkout session with `client_reference_id` set to the user ID
4. Complete the checkout
5. Check if the user's metadata is updated in Clerk

## Production Considerations

1. **HTTPS Required**: Stripe webhooks require HTTPS in production
2. **Idempotency**: The webhook is designed to be idempotent
3. **Error Handling**: Failed webhook deliveries will be retried by Stripe
4. **Logging**: All webhook events are logged for debugging
5. **Rate Limiting**: Consider implementing rate limiting for the webhook endpoint

## Support

If you're still having issues:

1. Check the server logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test with Stripe CLI to see the raw webhook payload
4. Ensure your Clerk and Stripe accounts are properly configured
