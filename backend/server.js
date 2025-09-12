#!/usr/bin/env node

/**
 * Simple Backend Service for Yale CAS Authentication
 * This handles the CAS ticket validation and redirects back to the mobile app
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Yale CAS Configuration
const YALE_CAS_BASE_URL = 'https://secure.its.yale.edu';
const YALE_CAS_VALIDATE_URL = `${YALE_CAS_BASE_URL}/cas/serviceValidate`;

// Your mobile app's URL scheme
const MOBILE_APP_SCHEME = 'yideshare';

// In-memory session storage (in production, use Redis or database)
const SESSIONS = {};

// Store pending authentication states for polling
const PENDING_AUTH = {};

// Mock user data (in production, this would come from Yale's systems)
const MOCK_USERS = {
  'testuser': {
    netid: 'testuser',
    email: 'test.user@yale.edu',
    firstName: 'Test',
    lastName: 'User',
    displayName: 'Test User',
    isStudent: true,
    isFaculty: false,
    isStaff: false,
    graduationYear: '2025',
    school: 'Yale University',
    major: 'Computer Science',
    college: 'Branford'
  }
};

/**
 * Validate CAS ticket with Yale CAS server
 */
async function validateCASTicket(ticket, serviceUrl) {
  try {
    console.log(`🔍 [CAS DEBUG] Validating CAS ticket: ${ticket} for service: ${serviceUrl}`);
    console.log(`🌐 [CAS DEBUG] Making request to: ${YALE_CAS_VALIDATE_URL}`);
    
    const params = {
      ticket: ticket,
      service: serviceUrl,
      format: 'XML'
    };
    
    console.log(`📤 [CAS DEBUG] Request parameters:`, params);
    
    const response = await axios.get(YALE_CAS_VALIDATE_URL, { 
      params,
      timeout: 10000, // 10 second timeout
      headers: {
        'User-Agent': 'YideShare-Mobile/1.0'
      }
    });
    
    console.log(`📥 [CAS DEBUG] Response status: ${response.status}`);
    console.log(`📄 [CAS DEBUG] Raw XML response:`, response.data);
    
    if (response.status !== 200) {
      throw new Error(`CAS validation failed with status ${response.status}`);
    }
    
    // Parse XML response
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      textNodeName: "#text"
    });
    const result = parser.parse(response.data);
    
    console.log('📄 [CAS DEBUG] Parsed CAS Response:', JSON.stringify(result, null, 2));
    
    // Check if we have a valid CAS response structure
    if (!result || !result['cas:serviceResponse']) {
      console.log('❌ [CAS DEBUG] Invalid CAS response structure - no serviceResponse');
      return null;
    }
    
    const serviceResponse = result['cas:serviceResponse'];
    
    // Check if authentication was successful
    if (serviceResponse['cas:authenticationSuccess']) {
      const authSuccess = serviceResponse['cas:authenticationSuccess'];
      const user = authSuccess['cas:user'];
      
      console.log(`✅ [CAS DEBUG] CAS authentication successful for user: ${user}`);
      
      // Extract user attributes from CAS response
      const attributes = authSuccess['cas:attributes'] || {};
      console.log('👤 [CAS DEBUG] CAS Attributes:', JSON.stringify(attributes, null, 2));
      
      // Validate that we have a user
      if (!user) {
        console.log('❌ [CAS DEBUG] No user found in CAS response');
        return null;
      }
      
      // Extract real user data from CAS response
      const realUserData = {
        netid: user,
        email: attributes['cas:mail'] || attributes['cas:email'] || `${user}@yale.edu`,
        firstName: attributes['cas:givenName'] || attributes['cas:firstName'] || 'Yale',
        lastName: attributes['cas:surname'] || attributes['cas:lastName'] || 'User',
        displayName: attributes['cas:displayName'] || attributes['cas:cn'] || `${attributes['cas:givenName'] || 'Yale'} ${attributes['cas:surname'] || 'User'}`,
        isStudent: attributes['cas:eduPersonAffiliation']?.includes('student') || true,
        isFaculty: attributes['cas:eduPersonAffiliation']?.includes('faculty') || false,
        isStaff: attributes['cas:eduPersonAffiliation']?.includes('staff') || false,
        graduationYear: attributes['cas:graduationYear'] || attributes['cas:classYear'] || null,
        school: 'Yale University',
        major: attributes['cas:major'] || attributes['cas:department'] || null,
        college: attributes['cas:college'] || attributes['cas:residentialCollege'] || null
      };
      
      console.log('🎯 [CAS DEBUG] Extracted Real User Data:', JSON.stringify(realUserData, null, 2));
      console.log(`🔑 [CAS DEBUG] ACTUAL NETID CAPTURED: ${realUserData.netid}`);
      
      return realUserData;
    } else if (serviceResponse['cas:authenticationFailure']) {
      const failure = serviceResponse['cas:authenticationFailure'];
      console.log('❌ [CAS DEBUG] CAS authentication failed');
      console.log('❌ [CAS DEBUG] Failure code:', failure['@_code'] || failure['cas:code']);
      console.log('❌ [CAS DEBUG] Failure description:', failure['#text'] || failure['cas:description']);
      console.log('❌ [CAS DEBUG] Full failure object:', JSON.stringify(failure, null, 2));
      return null;
    } else {
      console.log('❌ [CAS DEBUG] Unknown CAS response format');
      console.log('❌ [CAS DEBUG] Service response:', JSON.stringify(serviceResponse, null, 2));
      return null;
    }
  } catch (error) {
    console.error('💥 [CAS DEBUG] Error validating CAS ticket:', error.message);
    if (error.response) {
      console.error('💥 [CAS DEBUG] Response status:', error.response.status);
      console.error('💥 [CAS DEBUG] Response data:', error.response.data);
    } else if (error.request) {
      console.error('💥 [CAS DEBUG] No response received:', error.request);
    } else {
      console.error('💥 [CAS DEBUG] Request setup error:', error.message);
    }
    return null;
  }
}

/**
 * Generate a simple JWT-like token (in production, use proper JWT)
 */
function generateToken(userData) {
  const payload = {
    netid: userData.netid,
    email: userData.email,
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
  
  // Simple base64 encoding (in production, use proper JWT)
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

/**
 * CAS Authentication Callback Endpoint
 */
app.get('/api/auth/callback', async (req, res) => {
  try {
    const { ticket, state, redirect_uri } = req.query;
    
    console.log('🔄 [CALLBACK DEBUG] CAS Callback received:', { ticket, state, redirect_uri });
    console.log('🔄 [CALLBACK DEBUG] Full request query:', req.query);
    console.log('🔄 [CALLBACK DEBUG] Request headers:', req.headers);
    
    if (!ticket) {
      console.log('❌ [CALLBACK DEBUG] No ticket provided');
      return res.redirect(`${MOBILE_APP_SCHEME}://auth-failure?error=no_ticket&message=No%20CAS%20ticket%20provided`);
    }
    
    // Validate the CAS ticket - reconstruct the exact service URL that was sent to CAS
    const originalServiceUrl = `${req.protocol}://${req.get('host')}/api/auth/callback?state=${state}&redirect_uri=${encodeURIComponent(redirect_uri)}`;
    console.log('🔍 [CALLBACK DEBUG] Reconstructed service URL for validation:', originalServiceUrl);
    console.log('🔍 [CALLBACK DEBUG] Original URL from request:', req.originalUrl);
    
    console.log('⏳ [CALLBACK DEBUG] Starting CAS ticket validation...');
    const userData = await validateCASTicket(ticket, originalServiceUrl);
    
    if (!userData) {
      console.log('❌ [CALLBACK DEBUG] CAS ticket validation failed - no user data returned');
      return res.redirect(`${MOBILE_APP_SCHEME}://auth-failure?error=invalid_ticket&message=CAS%20validation%20failed`);
    }
    
    console.log('✅ [CALLBACK DEBUG] User data validated successfully:', JSON.stringify(userData, null, 2));
    console.log(`🔑 [CALLBACK DEBUG] FINAL NETID TO SEND TO MOBILE: ${userData.netid}`);
    
    // Generate token
    const token = generateToken(userData);
    console.log('🎫 [CALLBACK DEBUG] Generated token:', token);
    
    // Redirect back to mobile app with success and user data
    const successUrl = `${MOBILE_APP_SCHEME}://auth-success?token=${token}&netid=${userData.netid}&email=${encodeURIComponent(userData.email)}&name=${encodeURIComponent(userData.displayName)}`;
    
    console.log('📱 [CALLBACK DEBUG] Redirecting to mobile app:', successUrl);
    console.log('🎉 [CALLBACK DEBUG] Authentication flow completed successfully!');
    
    return res.redirect(successUrl);
    
  } catch (error) {
    console.error('💥 [CALLBACK DEBUG] Error in CAS callback:', error);
    console.error('💥 [CALLBACK DEBUG] Error stack:', error.stack);
    
    const errorMessage = encodeURIComponent(error.message || 'Unknown server error');
    return res.redirect(`${MOBILE_APP_SCHEME}://auth-failure?error=server_error&message=${errorMessage}`);
  }
});

/**
 * Mobile Authentication Endpoints
 */

// Get CAS login URL for mobile app
app.get('/api/auth/mobile/login', (req, res) => {
  try {
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const serviceUrl = `${req.protocol}://${req.get('host')}/api/auth/mobile/callback?state=${state}`;
    const casLoginUrl = `${YALE_CAS_BASE_URL}/cas/login?service=${encodeURIComponent(serviceUrl)}`;
    
    // Store pending authentication state
    PENDING_AUTH[state] = {
      status: 'pending',
      createdAt: new Date(),
      serviceUrl: serviceUrl
    };
    
    console.log('📱 [MOBILE AUTH] Generated login URL for mobile:', casLoginUrl);
    console.log('📱 [MOBILE AUTH] Stored pending auth state:', state);
    
    res.json({
      success: true,
      loginUrl: casLoginUrl,
      state: state
    });
  } catch (error) {
    console.error('💥 [MOBILE AUTH] Error generating login URL:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate login URL',
      message: error.message
    });
  }
});

// Mobile CAS callback - returns JSON instead of redirect
app.get('/api/auth/mobile/callback', async (req, res) => {
  try {
    const { ticket, state } = req.query;
    
    console.log('📱 [MOBILE CALLBACK] Mobile callback received:', { ticket, state });
    
    if (!ticket) {
      console.log('❌ [MOBILE CALLBACK] No ticket provided');
      return res.json({ 
        success: false, 
        error: 'no_ticket', 
        message: 'No CAS ticket provided' 
      });
    }
    
    // Validate the CAS ticket
    const serviceUrl = `${req.protocol}://${req.get('host')}/api/auth/mobile/callback?state=${state}`;
    console.log('🔍 [MOBILE CALLBACK] Service URL for validation:', serviceUrl);
    
    const userData = await validateCASTicket(ticket, serviceUrl);
    
    if (!userData) {
      console.log('❌ [MOBILE CALLBACK] CAS validation failed');
      return res.json({ 
        success: false, 
        error: 'invalid_ticket', 
        message: 'CAS validation failed' 
      });
    }
    
    console.log('✅ [MOBILE CALLBACK] User authenticated:', userData.netid);
    
    // Generate token
    const token = generateToken(userData);
    
    // Store session
    SESSIONS[token] = {
      user: userData,
      createdAt: new Date(),
      lastAccessed: new Date()
    };
    
    // Update pending auth state with success
    if (state && PENDING_AUTH[state]) {
      PENDING_AUTH[state] = {
        status: 'completed',
        token: token,
        user: userData,
        completedAt: new Date()
      };
      console.log('✅ [MOBILE CALLBACK] Updated pending auth state for:', state);
    }
    
    console.log('💾 [MOBILE CALLBACK] Session stored for token:', token);
    
    res.json({
      success: true,
      token: token,
      user: userData
    });
    
  } catch (error) {
    console.error('💥 [MOBILE CALLBACK] Error:', error);
    res.status(500).json({
      success: false,
      error: 'server_error',
      message: error.message || 'Unknown server error'
    });
  }
});

// Poll for authentication completion
app.get('/api/auth/mobile/poll', (req, res) => {
  try {
    const { state } = req.query;
    
    if (!state) {
      return res.json({ 
        success: false, 
        error: 'no_state', 
        message: 'No state parameter provided' 
      });
    }
    
    const pendingAuth = PENDING_AUTH[state];
    
    if (!pendingAuth) {
      return res.json({ 
        success: false, 
        error: 'invalid_state', 
        message: 'Authentication state not found or expired' 
      });
    }
    
    // Check if authentication is still pending
    if (pendingAuth.status === 'pending') {
      // Check if the request is too old (5 minutes timeout)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      if (pendingAuth.createdAt < fiveMinutesAgo) {
        // Clean up expired state
        delete PENDING_AUTH[state];
        return res.json({ 
          success: false, 
          error: 'timeout', 
          message: 'Authentication request expired' 
        });
      }
      
      return res.json({ 
        success: false, 
        message: 'Authentication not completed yet' 
      });
    }
    
    // Authentication completed
    if (pendingAuth.status === 'completed') {
      // Clean up the pending auth state
      delete PENDING_AUTH[state];
      
      return res.json({
        success: true,
        token: pendingAuth.token,
        user: pendingAuth.user,
        message: 'Authentication completed successfully'
      });
    }
    
    // Unknown status
    return res.json({ 
      success: false, 
      error: 'unknown_status', 
      message: 'Unknown authentication status' 
    });
    
  } catch (error) {
    console.error('💥 [MOBILE POLL] Error:', error);
    res.json({ 
      success: false, 
      error: 'polling_failed', 
      message: error.message || 'Polling failed' 
    });
  }
});

// Validate mobile token
app.post('/api/auth/mobile/validate', (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.json({ success: false, error: 'no_token' });
    }
    
    const session = SESSIONS[token];
    
    if (!session) {
      return res.json({ success: false, error: 'invalid_token' });
    }
    
    // Update last accessed
    session.lastAccessed = new Date();
    
    res.json({
      success: true,
      user: session.user
    });
    
  } catch (error) {
    console.error('💥 [MOBILE VALIDATE] Error:', error);
    res.json({ success: false, error: 'validation_failed' });
  }
});

// Logout mobile session
app.post('/api/auth/mobile/logout', (req, res) => {
  try {
    const { token } = req.body;
    
    if (token && SESSIONS[token]) {
      delete SESSIONS[token];
      console.log('🚪 [MOBILE LOGOUT] Session deleted for token:', token);
    }
    
    res.json({ success: true });
    
  } catch (error) {
    console.error('💥 [MOBILE LOGOUT] Error:', error);
    res.json({ success: false, error: 'logout_failed' });
  }
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

/**
 * Test endpoint to verify CAS integration
 */
app.get('/api/test-cas', async (req, res) => {
  try {
    console.log('🧪 [TEST DEBUG] Testing CAS server connectivity...');
    
    // Test CAS server connectivity
    const response = await axios.get(YALE_CAS_BASE_URL, { 
      timeout: 5000,
      headers: {
        'User-Agent': 'YideShare-Mobile/1.0'
      }
    });
    
    console.log('✅ [TEST DEBUG] CAS server is reachable');
    
    res.json({ 
      status: 'OK', 
      casServer: 'reachable',
      statusCode: response.status,
      validateUrl: YALE_CAS_VALIDATE_URL,
      baseUrl: YALE_CAS_BASE_URL
    });
  } catch (error) {
    console.error('❌ [TEST DEBUG] CAS server test failed:', error.message);
    
    res.json({ 
      status: 'ERROR', 
      casServer: 'unreachable',
      error: error.message,
      validateUrl: YALE_CAS_VALIDATE_URL,
      baseUrl: YALE_CAS_BASE_URL
    });
  }
});

/**
 * Test endpoint to simulate CAS validation (for debugging)
 */
app.get('/api/test-cas-validation', async (req, res) => {
  try {
    const { ticket } = req.query;
    
    if (!ticket) {
      return res.status(400).json({ 
        error: 'No ticket provided',
        usage: 'Add ?ticket=YOUR_TICKET to test validation'
      });
    }
    
    console.log('🧪 [TEST DEBUG] Testing CAS validation with ticket:', ticket);
    
    const serviceUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    console.log('🧪 [TEST DEBUG] Using service URL:', serviceUrl);
    const userData = await validateCASTicket(ticket, serviceUrl);
    
    if (userData) {
      res.json({
        status: 'SUCCESS',
        message: 'CAS validation successful',
        userData: userData
      });
    } else {
      res.json({
        status: 'FAILED',
        message: 'CAS validation failed',
        userData: null
      });
    }
  } catch (error) {
    console.error('❌ [TEST DEBUG] CAS validation test failed:', error.message);
    res.status(500).json({
      status: 'ERROR',
      message: 'CAS validation test failed',
      error: error.message
    });
  }
});

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📱 Mobile app scheme: ${MOBILE_APP_SCHEME}`);
  console.log(`🔗 CAS callback URL: http://localhost:${PORT}/api/auth/callback`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
