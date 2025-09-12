#!/usr/bin/env node

/**
 * Test script to verify CAS integration
 * Run this to test the backend server and CAS connectivity
 */

const axios = require('axios');

const BACKEND_URL = 'http://localhost:3001';

async function testBackend() {
  console.log('🧪 Testing Backend Server...\n');
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BACKEND_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test CAS connectivity
    console.log('\n2. Testing CAS server connectivity...');
    const casResponse = await axios.get(`${BACKEND_URL}/api/test-cas`);
    console.log('✅ CAS test result:', casResponse.data);
    
    if (casResponse.data.status === 'OK') {
      console.log('\n3. CAS server is reachable! Testing validation endpoint...');
      console.log('   (This will fail without a real ticket, but tests the endpoint)');
      
      try {
        const validationResponse = await axios.get(`${BACKEND_URL}/api/test-cas-validation?ticket=test`);
        console.log('✅ Validation endpoint test:', validationResponse.data);
      } catch (validationError) {
        console.log('⚠️  Validation endpoint test (expected to fail):', validationError.response?.data || validationError.message);
      }
    }
    
    console.log('\n🎉 Backend server is ready for CAS authentication!');
    console.log('\n📱 To test the full flow:');
    console.log('1. Start the backend: npm start');
    console.log('2. Start the mobile app: npx react-native run-ios (or run-android)');
    console.log('3. Tap "Login with Yale CAS" in the app');
    console.log('4. Complete authentication on Yale CAS website');
    console.log('5. Check the console logs for NetID extraction');
    console.log('\n🔍 Debug endpoints available:');
    console.log(`   - Health: ${BACKEND_URL}/health`);
    console.log(`   - CAS Test: ${BACKEND_URL}/api/test-cas`);
    console.log(`   - CAS Validation: ${BACKEND_URL}/api/test-cas-validation?ticket=YOUR_TICKET`);
    
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    console.log('\n💡 Make sure to start the backend server first:');
    console.log('   cd backend && npm start');
  }
}

testBackend();
