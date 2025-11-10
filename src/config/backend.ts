import { Platform } from 'react-native';

/**
 * Backend URL Configuration
 * 
 * IMPORTANT: For local development, ensure your backend server is running!
 * Start the backend: cd backend && npm start
 * 
 * For development:
 * - iOS Simulator: localhost works (requires NSExceptionDomains in Info.plist)
 * - Android Emulator: Use 10.0.2.2 (special IP that maps to host machine)
 * - Physical Device: Use your machine's local IP address (e.g., 192.168.x.x or 10.x.x.x)
 * 
 * To use a physical device, replace 'localhost' below with your machine's IP address.
 * Find your IP: Mac/Linux: `ifconfig | grep "inet "`, Windows: `ipconfig`
 * 
 * iOS App Transport Security (ATS) Configuration:
 * - Info.plist must have NSExceptionDomains for localhost to allow HTTP connections
 * - See ios/YideShareMobile/Info.plist for the required NSAppTransportSecurity settings
 * 
 * For production, this should be your deployed backend URL
 */
const getBackendUrl = (): string => {
  // You can override this by setting a specific IP for physical devices
  // Example: 'http://192.168.1.100:3001' or 'http://10.66.154.65:3001'
  const DEVICE_IP = 'localhost'; // Change this to your machine's IP if testing on physical device
  
  if (__DEV__) {
    // For iOS Simulator, localhost works (with proper Info.plist configuration)
    if (Platform.OS === 'ios') {
      return `http://${DEVICE_IP}:3001`;
    }
    // For Android Emulator, use special IP
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3001';
    }
  }
  
  // Production URL (update when deploying)
  // @ts-ignore - process.env is available at runtime
  return (typeof process !== 'undefined' && process.env?.BACKEND_URL) || 'http://localhost:3001';
};

export const BACKEND_URL = getBackendUrl();

// Log the backend URL in development for debugging
if (__DEV__) {
  console.log(`🔧 [CONFIG] Using backend URL: ${BACKEND_URL} (Platform: ${Platform.OS})`);
  console.log(`🔧 [CONFIG] Make sure your backend server is running on this address!`);
  console.log(`🔧 [CONFIG] Start backend: cd backend && npm start`);
}

