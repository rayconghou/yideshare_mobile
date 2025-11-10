# Yideshare Backend Service

This is a simple Node.js backend service that handles Yale CAS authentication for the Yideshare mobile app.

## Features

- Yale CAS ticket validation
- Mobile app deep linking support
- CORS enabled for mobile app communication
- Health check endpoint
- CAS server connectivity testing

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Start the server:
```bash
npm start
```

The server will run on `http://localhost:3001`

## Endpoints

- `GET /api/auth/callback` - Handles CAS authentication callback
- `GET /health` - Health check endpoint
- `GET /api/test-cas` - Test CAS server connectivity

## How it works

1. Mobile app initiates login by opening Yale CAS URL in browser
2. User authenticates with Yale CAS
3. Yale CAS redirects to `/api/auth/callback` with a ticket
4. Backend validates the ticket with Yale CAS server
5. Backend redirects back to mobile app with user data via deep link

## Deep Link Format

Success: `yideshare://auth-success?token=...&netid=...&email=...&name=...`
Failure: `yideshare://auth-failure?error=...`

## Production Deployment

For production, you'll need to:

1. Deploy this backend to a public URL (e.g., Heroku, AWS, etc.)
2. Update the `BACKEND_SERVICE_URL` in the mobile app
3. Register your service URL with Yale CAS
4. Use proper JWT tokens instead of simple base64 encoding
5. Add proper error handling and logging
6. Implement rate limiting and security measures

## CAS Configuration

The backend uses Yale CAS for authentication. By default, it uses the **test CAS environment** for local development.

### CAS Environments

- **Test (Default)**: `https://secure-tst.its.yale.edu/cas`
- **Production**: `https://secure.its.yale.edu/cas`

### Switching CAS Environments

To switch between test and production CAS, set the `YALE_CAS_BASE_URL` environment variable:

```bash
# Use test CAS (default)
YALE_CAS_BASE_URL=https://secure-tst.its.yale.edu/cas npm start

# Use production CAS
YALE_CAS_BASE_URL=https://secure.its.yale.edu/cas npm start
```

Or create a `.env` file in the `backend` directory:

```env
YALE_CAS_BASE_URL=https://secure.its.yale.edu/cas
```

### MFA Provider Unavailable Error

If you encounter "MFA Provider Unavailable" error when trying to authenticate:

1. **Test CAS Environment**: The test CAS server may have MFA enabled and the MFA provider might be unavailable. This is a server-side issue with Yale's test CAS environment.

2. **Solutions**:
   - **Option 1**: Switch to production CAS (see above). Production CAS may work better for local development.
   - **Option 2**: Wait for Yale IT to fix the test CAS MFA provider issue.
   - **Option 3**: Contact Yale IT to register your localhost service URL with the test CAS environment.

3. **Test CAS Connectivity**: 
   ```bash
   curl http://localhost:3001/api/test-cas
   ```
   This will tell you if the CAS server is reachable and if there's an MFA error.

## Testing

You can test the CAS integration by visiting:
- `http://localhost:3001/health` - Should return `{"status":"OK"}` with CAS configuration
- `http://localhost:3001/api/test-cas` - Tests CAS server connectivity and checks for MFA errors
