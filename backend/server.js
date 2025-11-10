#!/usr/bin/env node

/**
 * Simple Backend Service for Yale CAS Authentication
 * This handles the CAS ticket validation and redirects back to the mobile app
 */

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');

// db connection and utilities
const { RideDB, UserDB, BookmarkDB, healthCheck, disconnect } = require('./lib/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Yale CAS Configuration
// const YALE_CAS_BASE_URL = 'https://secure.its.yale.edu';
const YALE_CAS_BASE_URL = 'https://secure-tst.its.yale.edu';
const YALE_CAS_VALIDATE_URL = `${YALE_CAS_BASE_URL}/cas/serviceValidate`;


// In-memory session storage (in production, use Redis or database)
const SESSIONS = {};

// Store pending authentication states for polling
const PENDING_AUTH = {};

// In-memory ride and bookmark storage (in production, use database)
const RIDES = {};
const BOOKMARKS = {}; // userNetid -> Set of rideIds

// Initialize with some sample rides
const initializeSampleRides = () => {
  const sampleRides = [
    {
      id: 'ride_1',
      driver: {
        name: 'Aspen Carder',
        email: 'aspen.carder@yale.edu',
        phone: '(123) 456-7890',
        initials: 'AC',
      },
      from: 'Branford College',
      to: 'Hartford (BDL)',
      date: '14 Dec',
      time: '9:30 AM - 11:00 AM',
      seats: 2,
      note: 'See note',
      createdAt: new Date().toISOString()
    },
    {
      id: 'ride_2',
      driver: {
        name: 'Ruben Rosser',
        email: 'ruben.rosser@yale.edu',
        phone: '(123) 456-7890',
        initials: 'RR',
      },
      from: 'Branford College',
      to: 'Hartford (BDL)',
      date: '14 Dec',
      time: '9:30 AM - 11:00 AM',
      seats: 2,
      note: 'See note',
      createdAt: new Date().toISOString()
    },
    {
      id: 'ride_3',
      driver: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@yale.edu',
        phone: '(555) 123-4567',
        initials: 'SJ',
      },
      from: 'New Haven Union Station',
      to: 'JFK Airport',
      date: '15 Dec',
      time: '2:00 PM - 4:30 PM',
      seats: 3,
      note: 'Direct to terminal',
      createdAt: new Date().toISOString()
    }
  ];
  
  sampleRides.forEach(ride => {
    RIDES[ride.id] = ride;
  });
  
  console.log('🚗 [INIT] Initialized with', sampleRides.length, 'sample rides');
};

// Initialize sample data
initializeSampleRides();

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
      
      // Validate that we have a user
      if (!user) {
        console.log('❌ [CAS DEBUG] No user found in CAS response');
        return null;
      }
      
      // Only extract netid - all other data comes from Yalies API
      const userData = {
        netid: user
      };
      
      console.log(`✅ [CAS DEBUG] Extracted netid: ${userData.netid}`);
      
      return userData;
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
      console.log('🔍 [MOBILE CALLBACK] userData being stored:', JSON.stringify(userData, null, 2));
      PENDING_AUTH[state] = {
        status: 'completed',
        token: token,
        user: userData,
        completedAt: new Date()
      };
      console.log('✅ [MOBILE CALLBACK] Updated pending auth state for:', state);
    }
    
    console.log('💾 [MOBILE CALLBACK] Session stored for token:', token);
    
    // Redirect to mobile app with success
    const mobileAppUrl = `yideshare://auth/success?token=${encodeURIComponent(token)}&netid=${encodeURIComponent(userData.netid)}`;
    console.log('📱 [MOBILE CALLBACK] Redirecting to mobile app:', mobileAppUrl);
    
    res.redirect(mobileAppUrl);
    
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
        user: { netid: pendingAuth.user.netid },
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
 * Ride Management Endpoints
 */

// Get all rides
app.get('/api/rides', (req, res) => {
  try {
    const rides = Object.values(RIDES);
    res.json({
      success: true,
      rides: rides
    });
  } catch (error) {
    console.error('💥 [RIDES] Error fetching rides:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch rides',
      message: error.message
    });
  }
});

// Create a new ride
app.post('/api/rides', (req, res) => {
  try {
    const { driver, from, to, date, time, seats, note } = req.body;
    
    if (!driver || !from || !to || !date || !time) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Driver, from, to, date, and time are required'
      });
    }
    
    const rideId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const ride = {
      id: rideId,
      driver,
      from,
      to,
      date,
      time,
      seats: seats || 1,
      note: note || '',
      createdAt: new Date().toISOString()
    };
    
    RIDES[rideId] = ride;
    
    console.log('🚗 [RIDES] Created new ride:', rideId);
    
    res.json({
      success: true,
      ride: ride
    });
  } catch (error) {
    console.error('💥 [RIDES] Error creating ride:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create ride',
      message: error.message
    });
  }
});

/**
 * Bookmark Management Endpoints
 */

// Get user's bookmarked rides
app.get('/api/bookmarks', (req, res) => {
  try {
    const { netid } = req.query;
    
    if (!netid) {
      return res.status(400).json({
        success: false,
        error: 'Missing netid',
        message: 'User netid is required'
      });
    }
    
    const userBookmarks = BOOKMARKS[netid] || new Set();
    const bookmarkedRides = Array.from(userBookmarks).map(rideId => RIDES[rideId]).filter(Boolean);
    
    res.json({
      success: true,
      rides: bookmarkedRides
    });
  } catch (error) {
    console.error('💥 [BOOKMARKS] Error fetching bookmarks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookmarks',
      message: error.message
    });
  }
});

// Toggle bookmark for a ride
app.post('/api/bookmarks/toggle', (req, res) => {
  try {
    const { netid, rideId } = req.body;
    
    if (!netid || !rideId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'User netid and ride ID are required'
      });
    }
    
    if (!RIDES[rideId]) {
      return res.status(404).json({
        success: false,
        error: 'Ride not found',
        message: 'The specified ride does not exist'
      });
    }
    
    // Initialize user's bookmarks if not exists
    if (!BOOKMARKS[netid]) {
      BOOKMARKS[netid] = new Set();
    }
    
    const userBookmarks = BOOKMARKS[netid];
    let isBookmarked = false;
    
    if (userBookmarks.has(rideId)) {
      userBookmarks.delete(rideId);
      console.log('🔖 [BOOKMARKS] Removed bookmark for ride:', rideId, 'by user:', netid);
    } else {
      userBookmarks.add(rideId);
      isBookmarked = true;
      console.log('🔖 [BOOKMARKS] Added bookmark for ride:', rideId, 'by user:', netid);
    }
    
    res.json({
      success: true,
      isBookmarked: isBookmarked,
      message: isBookmarked ? 'Ride bookmarked' : 'Bookmark removed'
    });
  } catch (error) {
    console.error('💥 [BOOKMARKS] Error toggling bookmark:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle bookmark',
      message: error.message
    });
  }
});

// Check if a ride is bookmarked by user
app.get('/api/bookmarks/check', (req, res) => {
  try {
    const { netid, rideId } = req.query;
    
    if (!netid || !rideId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'User netid and ride ID are required'
      });
    }
    
    const userBookmarks = BOOKMARKS[netid] || new Set();
    const isBookmarked = userBookmarks.has(rideId);
    
    res.json({
      success: true,
      isBookmarked: isBookmarked
    });
  } catch (error) {
    console.error('💥 [BOOKMARKS] Error checking bookmark:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check bookmark',
      message: error.message
    });
  }
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});


/**
 * Start server
 */
const server = app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📱 Mobile auth endpoints available`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`🗄️  Database test: http://localhost:${PORT}/test-db`);
  console.log(`📚 API Documentation:`);
  console.log(`   GET  /api/rides/search - Search rides`);
  console.log(`   POST /api/rides - Create ride`);
  console.log(`   GET  /api/rides/user - Get user rides`);
  console.log(`   PUT  /api/rides/:id - Update ride`);
  console.log(`   DELETE /api/rides/:id - Delete ride`);
  console.log(`   GET  /api/bookmarks - Get bookmarks`);
  console.log(`   POST /api/bookmarks/toggle - Toggle bookmark`);
});

/**
 * Graceful shutdown
 */
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  
  server.close(() => {
    console.log('📴 HTTP server closed.');
  });
  
  try {
    await disconnect();
    console.log('🗄️  Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  
  server.close(() => {
    console.log('📴 HTTP server closed.');
  });
  
  try {
    await disconnect();
    console.log('🗄️  Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

module.exports = app;
