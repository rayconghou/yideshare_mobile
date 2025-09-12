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

## Testing

You can test the CAS integration by visiting:
- `http://localhost:3001/health` - Should return `{"status":"OK"}`
- `http://localhost:3001/api/test-cas` - Tests CAS server connectivity
