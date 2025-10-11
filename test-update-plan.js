#!/usr/bin/env node

/**
 * Test script to manually update user plan to premium
 * This helps test the UI update without waiting for Stripe webhook
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

async function testUpdatePlan() {
  console.log('🧪 Testing manual plan update...\n');
  
  try {
    // Test the webhook endpoint first
    console.log('1. Checking webhook configuration...');
    const webhookResponse = await axios.get(`${BASE_URL}/webhook-test`);
    console.log('Webhook status:', webhookResponse.data);
    
    if (!webhookResponse.data.environment.hasStripeKey) {
      console.log('\n⚠️  Stripe keys are not configured. This is why the webhook isn\'t working.');
      console.log('To fix this, add these to your server/.env file:');
      console.log('STRIPE_SECRET_KEY=sk_test_...');
      console.log('STRIPE_WEBHOOK_SECRET=whsec_...');
    }
    
    console.log('\n2. To manually update your plan to premium:');
    console.log('   - Open your browser to http://localhost:5173');
    console.log('   - Open browser developer tools (F12)');
    console.log('   - Go to Console tab');
    console.log('   - Run this command:');
    console.log(`
fetch('/api/user/update-plan', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + (await window.Clerk.session.getToken())
  },
  body: JSON.stringify({ plan: 'premium' })
}).then(r => r.json()).then(console.log);
    `);
    
    console.log('\n3. After running the command, refresh the page to see the updated plan.');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the test
testUpdatePlan().catch(console.error);
