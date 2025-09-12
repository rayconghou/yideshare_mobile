# Yale CAS Authentication Debug Guide

## Overview
This guide helps you debug the Yale CAS authentication flow to ensure we're properly capturing the actual NetID from real Yale CAS authentication.

## What We Fixed

### 1. **Real CAS Validation**
- ✅ Backend now properly validates CAS tickets with Yale's actual CAS server
- ✅ Extracts real user data from CAS XML response instead of using mock data
- ✅ Comprehensive error handling for network issues and validation failures

### 2. **Enhanced Debug Logging**
- ✅ Detailed logging throughout the entire authentication flow
- ✅ Clear markers for NetID extraction at each step
- ✅ Error tracking and troubleshooting information

### 3. **Improved Error Handling**
- ✅ Better error messages for different failure scenarios
- ✅ Network timeout handling
- ✅ CAS response validation

## Testing Steps

### Step 1: Start the Backend Server
```bash
cd backend
npm start
```

You should see:
```
🚀 Backend server running on port 3001
📱 Mobile app scheme: yideshare
🔗 CAS callback URL: http://localhost:3001/api/auth/callback
🏥 Health check: http://localhost:3001/health
```

### Step 2: Test Backend Connectivity
```bash
cd backend
node test-cas.js
```

This will test:
- Backend server health
- Yale CAS server connectivity
- Validation endpoint availability

### Step 3: Start the Mobile App
```bash
npx react-native run-ios
# or
npx react-native run-android
```

### Step 4: Test Authentication Flow
1. Tap "Login with Yale CAS" in the app
2. You'll see the "Login Initiated" modal
3. Complete authentication on Yale CAS website
4. **Watch the console logs** for detailed debugging information

## Debug Console Output

### Backend Logs (Terminal)
Look for these key log messages:

```
🔄 [CALLBACK DEBUG] CAS Callback received: { ticket: 'ST-...', state: '...', redirect_uri: '...' }
🔍 [CAS DEBUG] Validating CAS ticket: ST-... for service: http://localhost:3001/api/auth/callback
🌐 [CAS DEBUG] Making request to: https://secure.its.yale.edu/cas/serviceValidate
📥 [CAS DEBUG] Response status: 200
📄 [CAS DEBUG] Raw XML response: <cas:serviceResponse>...
✅ [CAS DEBUG] CAS authentication successful for user: john.doe
🔑 [CAS DEBUG] ACTUAL NETID CAPTURED: john.doe
🎯 [CAS DEBUG] Extracted Real User Data: { netid: 'john.doe', email: '...', ... }
🔑 [CALLBACK DEBUG] FINAL NETID TO SEND TO MOBILE: john.doe
📱 [CALLBACK DEBUG] Redirecting to mobile app: yideshare://auth-success?...
```

### Mobile App Logs (Metro/React Native)
Look for these key log messages:

```
🔗 [APP DEBUG] Deep link received: yideshare://auth-success?...
📱 [MOBILE DEBUG] Handling CAS callback: yideshare://auth-success?...
📋 [MOBILE DEBUG] Parsed callback parameters: { token: '...', netid: 'john.doe', ... }
🔑 [MOBILE DEBUG] EXTRACTED NETID FROM BACKEND: john.doe
🎯 [MOBILE DEBUG] FINAL NETID STORED IN APP: john.doe
✅ [AUTH CONTEXT DEBUG] USER NETID SET IN CONTEXT: john.doe
```

## Troubleshooting

### If CAS Validation Fails
Check the backend logs for:
- Network connectivity issues
- Invalid CAS response format
- Missing user data in CAS response

### If Mobile App Doesn't Receive Data
Check:
- Deep link URL scheme is correct (`yideshare://`)
- Backend is running on correct port (3001)
- Mobile app is listening for deep links

### If NetID is Still Mock Data
This means the CAS validation is not working properly. Check:
1. Backend logs for CAS validation errors
2. Network connectivity to Yale CAS server
3. CAS ticket format and validity

## Debug Endpoints

### Health Check
```
GET http://localhost:3001/health
```

### CAS Server Test
```
GET http://localhost:3001/api/test-cas
```

### CAS Validation Test
```
GET http://localhost:3001/api/test-cas-validation?ticket=YOUR_TICKET
```

## Expected Flow

1. **User taps "Login with Yale CAS"**
   - App opens browser with Yale CAS login URL
   - Backend generates callback URL with service parameter

2. **User authenticates on Yale CAS**
   - Yale CAS validates credentials
   - Yale CAS redirects to backend callback URL with ticket

3. **Backend validates ticket**
   - Backend sends ticket to Yale CAS validation endpoint
   - Yale CAS returns XML response with user data
   - Backend extracts real NetID and user information

4. **Backend redirects to mobile app**
   - Backend redirects to `yideshare://auth-success` with user data
   - Mobile app receives deep link with NetID

5. **Mobile app processes authentication**
   - App parses deep link parameters
   - App stores user data including real NetID
   - App updates authentication state

## Key Success Indicators

✅ **Backend logs show**: "ACTUAL NETID CAPTURED: [real_netid]"
✅ **Mobile logs show**: "EXTRACTED NETID FROM BACKEND: [real_netid]"
✅ **Mobile logs show**: "FINAL NETID STORED IN APP: [real_netid]"
✅ **App shows authenticated state** with real user data

If you see these logs, the authentication flow is working correctly and capturing real NetIDs from Yale CAS!
