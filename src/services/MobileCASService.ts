import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';
import { UserProfile } from './CASService';

const BACKEND_URL = 'http://localhost:3001';

interface AuthSession {
  token: string;
  user: UserProfile;
  createdAt: Date;
}

/**
 * Mobile-Optimized CAS Authentication Service
 * Uses proper mobile authentication patterns instead of deep links
 */
class MobileCASService {
  private currentSession: AuthSession | null = null;

  /**
   * Get singleton instance
   */
  static getInstance(): MobileCASService {
    if (!MobileCASService.instance) {
      MobileCASService.instance = new MobileCASService();
    }
    return MobileCASService.instance;
  }

  private static instance: MobileCASService;

  /**
   * Initiate mobile CAS authentication
   */
  async initiateLogin(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('📱 [MOBILE CAS] Initiating mobile CAS authentication');
      
      // Get login URL from backend
      const response = await fetch(`${BACKEND_URL}/api/auth/mobile/login`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to get login URL');
      }

      console.log('📱 [MOBILE CAS] Got login URL from backend:', data.loginUrl);
      
      // Store state for later validation
      await AsyncStorage.setItem('cas_state', data.state);
      
      // Open browser with CAS login URL
      const canOpen = await Linking.canOpenURL(data.loginUrl);
      if (!canOpen) {
        throw new Error('Cannot open browser');
      }

      await Linking.openURL(data.loginUrl);
      
      console.log('📱 [MOBILE CAS] Opened browser for CAS authentication');
      
      return { success: true, message: 'Browser opened for authentication' };
      
    } catch (error) {
      console.error('💥 [MOBILE CAS] Error initiating login:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Poll for authentication completion
   * This is the key difference - we poll the backend instead of relying on deep links
   */
  async pollForAuthentication(): Promise<{ success: boolean; user?: UserProfile; message: string }> {
    try {
      console.log('📱 [MOBILE CAS] Polling for authentication completion');
      
      const state = await AsyncStorage.getItem('cas_state');
      if (!state) {
        return { success: false, message: 'No authentication state found' };
      }

      // Poll the backend to check if authentication completed
      const response = await fetch(`${BACKEND_URL}/api/auth/mobile/poll?state=${state}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return { success: false, message: 'Authentication not completed yet' };
      }

      const data = await response.json();
      
      if (!data.success) {
        // Check if it's just not completed yet vs an actual error
        if (data.message && data.message.includes('not completed yet')) {
          return { success: false, message: 'Authentication not completed yet' };
        }
        return { success: false, message: data.message || 'Authentication failed' };
      }

      console.log('✅ [MOBILE CAS] Authentication completed:', data.user.netid);
      
      // Store session
      const session: AuthSession = {
        token: data.token,
        user: data.user,
        createdAt: new Date()
      };
      
      await this.setSession(session);
      this.currentSession = session;
      
      // Clear state
      await AsyncStorage.removeItem('cas_state');
      
      return { success: true, user: data.user, message: 'Authentication successful' };
      
    } catch (error) {
      console.error('💥 [MOBILE CAS] Error polling for authentication:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Validate current session with backend
   */
  async validateSession(): Promise<boolean> {
    try {
      const session = await this.getCurrentSession();
      if (!session) {
        return false;
      }

      const response = await fetch(`${BACKEND_URL}/api/auth/mobile/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: session.token }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      
      if (data.success && data.user) {
        // Update user data
        session.user = data.user;
        await this.setSession(session);
        this.currentSession = session;
        return true;
      }

      return false;
      
    } catch (error) {
      console.error('💥 [MOBILE CAS] Error validating session:', error);
      return false;
    }
  }

  /**
   * Get current session
   */
  async getCurrentSession(): Promise<AuthSession | null> {
    if (this.currentSession) {
      return this.currentSession;
    }

    try {
      const sessionData = await AsyncStorage.getItem('auth_session');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        this.currentSession = session;
        return session;
      }
    } catch (error) {
      console.error('💥 [MOBILE CAS] Error getting session:', error);
    }

    return null;
  }

  /**
   * Set session in storage
   */
  private async setSession(session: AuthSession): Promise<void> {
    try {
      await AsyncStorage.setItem('auth_session', JSON.stringify(session));
    } catch (error) {
      console.error('💥 [MOBILE CAS] Error setting session:', error);
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      console.log('🚪 [MOBILE CAS] Starting logout process');
      
      const session = await this.getCurrentSession();
      if (session) {
        // Notify backend to invalidate session
        try {
          await fetch(`${BACKEND_URL}/api/auth/mobile/logout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: session.token }),
          });
        } catch (error) {
          console.error('💥 [MOBILE CAS] Error notifying backend of logout:', error);
        }
      }

      // Clear local session
      this.currentSession = null;
      await AsyncStorage.removeItem('auth_session');
      await AsyncStorage.removeItem('cas_state');
      
      console.log('🚪 [MOBILE CAS] Logout completed');
    } catch (error) {
      console.error('💥 [MOBILE CAS] Error during logout:', error);
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const session = await this.getCurrentSession();
    if (!session) {
      return false;
    }

    // Validate session with backend
    return await this.validateSession();
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<UserProfile | null> {
    const session = await this.getCurrentSession();
    return session?.user || null;
  }
}

export default MobileCASService;
