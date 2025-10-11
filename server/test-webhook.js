#!/usr/bin/env node

/**
 * Test script to verify Stripe webhook integration
 * Run this script to test if the webhook endpoint is working correctly
 */

import Stripe from 'stripe';
import { clerkClient } from '@clerk/express';
import 'dotenv/config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function testWebhookConfiguration() {
  console.log('🔍 Testing Stripe Webhook Configuration...\n');
  
  // Check environment variables
  console.log('Environment Variables:');
  console.log(`- STRIPE_SECRET_KEY: ${process.env.STRIPE_SECRET_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`- STRIPE_WEBHOOK_SECRET: ${process.env.STRIPE_WEBHOOK_SECRET ? '✅ Set' : '❌ Missing'}`);
  console.log(`- CLERK_SECRET_KEY: ${process.env.CLERK_SECRET_KEY ? '✅ Set' : '❌ Missing'}\n`);
  
  // Test Stripe connection
  try {
    const account = await stripe.accounts.retrieve();
    console.log(`✅ Stripe connection successful - Account: ${account.display_name || account.id}`);
  } catch (error) {
    console.log(`❌ Stripe connection failed: ${error.message}`);
  }
  
  // Test Clerk connection
  try {
    const users = await clerkClient.users.getUserList({ limit: 1 });
    console.log(`✅ Clerk connection successful - Found ${users.totalCount} users`);
  } catch (error) {
    console.log(`❌ Clerk connection failed: ${error.message}`);
  }
  
  console.log('\n📋 Webhook Events to Configure in Stripe Dashboard:');
  console.log('- checkout.session.completed');
  console.log('- customer.subscription.created');
  console.log('- customer.subscription.updated');
  console.log('- customer.subscription.deleted');
  console.log('- invoice.payment_succeeded');
  
  console.log('\n🔗 Webhook URL: https://your-domain.com/webhooks/stripe');
  console.log('   (Replace with your actual domain)');
  
  console.log('\n📝 Debugging Tips:');
  console.log('1. Check server logs when webhook events are received');
  console.log('2. Verify that client_reference_id is set in checkout sessions');
  console.log('3. Ensure subscription metadata includes clerkUserId');
  console.log('4. Test with Stripe CLI: stripe listen --forward-to localhost:3000/webhooks/stripe');
}

// Run the test
testWebhookConfiguration().catch(console.error);
