import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';
import YaliesService, { YaliesPerson } from './YaliesService';

const BACKEND_URL = 'http://localhost:3001';

// Simple user interface - only netid
export interface User {
  netid: string;
}

interface AuthSession {
  token: string;
  user: User;
  yaliesData?: YaliesPerson;
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
        console.error(`❌ [CAS AUTH] Login initiation failed with status: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`📄 [CAS AUTH] Login initiation response:`, JSON.stringify(data, null, 2));
      
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
  async pollForAuthentication(): Promise<{ success: boolean; user?: User; yaliesData?: YaliesPerson; message: string }> {
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
        console.log(`⏳ [CAS AUTH] Polling - not completed yet (status: ${response.status})`);
        return { success: false, message: 'Authentication not completed yet' };
      }

      const data = await response.json();
      console.log(`📄 [CAS AUTH] Polling response:`, JSON.stringify(data, null, 2));
      
      if (!data.success) {
        // Check if it's just not completed yet vs an actual error
        if (data.message && data.message.includes('not completed yet')) {
          return { success: false, message: 'Authentication not completed yet' };
        }
        return { success: false, message: data.message || 'Authentication failed' };
      }

      console.log('✅ [CAS AUTH] Authentication completed:', data.user.netid);
      
      // Query Yalies API for additional user information
      console.log('🔍 [YALIES] Querying user details...');
      const yaliesService = YaliesService.getInstance();
      const yaliesResult = await yaliesService.queryPersonByNetId(data.user.netid);
      
      let yaliesData: YaliesPerson | undefined;
      if (yaliesResult.success && yaliesResult.person) {
        yaliesData = yaliesResult.person;
        console.log('✅ [YALIES] Data retrieved:', yaliesData.preferred_name || yaliesData.first_name);
      } else {
        console.log('❌ [YALIES] Query failed:', yaliesResult.message);
      }
      
      // Store session with Yalies data - user only contains netid
      const session: AuthSession = {
        token: data.token,
        user: { netid: data.user.netid },
        yaliesData: yaliesData,
        createdAt: new Date()
      };
      
      await this.setSession(session);
      this.currentSession = session;
      
      // Clear state
      await AsyncStorage.removeItem('cas_state');
      
      return { success: true, user: { netid: data.user.netid }, yaliesData: yaliesData, message: 'Authentication successful' };
      
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
          console.error('❌ [LOGOUT] Error notifying backend:', error);
        }
      }

      // Clear local session
      this.currentSession = null;
      await AsyncStorage.removeItem('auth_session');
      await AsyncStorage.removeItem('cas_state');
    } catch (error) {
      console.error('❌ [LOGOUT] Error:', error);
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
  async getCurrentUser(): Promise<User | null> {
    const session = await this.getCurrentSession();
    return session?.user || null;
  }

  /**
   * Get current user's Yalies data
   */
  async getCurrentUserYaliesData(): Promise<YaliesPerson | null> {
    const session = await this.getCurrentSession();
    return session?.yaliesData || null;
  }
}

export default MobileCASService;
