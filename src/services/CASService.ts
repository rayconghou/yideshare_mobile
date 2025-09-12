import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Yale CAS Configuration
const YALE_CAS_BASE_URL = 'https://secure.its.yale.edu';
const YALE_CAS_LOGIN_URL = `${YALE_CAS_BASE_URL}/cas/login`;
const YALE_CAS_VALIDATE_URL = `${YALE_CAS_BASE_URL}/cas/serviceValidate`;

// Your backend service URL (you'll need to deploy this)
const BACKEND_SERVICE_URL = 'http://localhost:3001'; // Local development backend
const APP_SCHEME = 'yideshare'; // URL scheme for deep linking

export interface UserProfile {
  netid: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  isStudent: boolean;
  isFaculty: boolean;
  isStaff: boolean;
  graduationYear?: string;
  school?: string;
  major?: string;
  college?: string;
}

export interface AuthSession {
  token: string;
  user: UserProfile;
  expiresAt: number;
}

class CASService {
  private static instance: CASService;
  private currentSession: AuthSession | null = null;

  static getInstance(): CASService {
    if (!CASService.instance) {
      CASService.instance = new CASService();
    }
    return CASService.instance;
  }

  /**
   * Initiate Yale CAS login by opening browser
   */
  async initiateLogin(): Promise<{ success: boolean; message: string }> {
    try {
      // Generate a unique state parameter for security
      const state = this.generateState();
      await AsyncStorage.setItem('cas_state', state);

      // Create the service URL that will handle the callback
      const serviceUrl = `${BACKEND_SERVICE_URL}/api/auth/callback?state=${state}&redirect_uri=${APP_SCHEME}://auth-success`;

      // Construct the Yale CAS login URL
      const casLoginUrl = `${YALE_CAS_LOGIN_URL}?service=${encodeURIComponent(serviceUrl)}`;

      console.log('Opening Yale CAS login:', casLoginUrl);

      // Open the browser with Yale CAS login
      const canOpen = await Linking.canOpenURL(casLoginUrl);
      if (canOpen) {
        await Linking.openURL(casLoginUrl);
        return { success: true, message: 'Opening Yale CAS login...' };
      } else {
        return { success: false, message: 'Cannot open browser' };
      }
    } catch (error) {
      console.error('Error initiating CAS login:', error);
      return { success: false, message: 'Failed to initiate login' };
    }
  }

  /**
   * Handle the callback from Yale CAS
   */
  async handleCallback(url: string): Promise<{ success: boolean; message: string; user?: UserProfile }> {
    try {
      console.log('📱 [MOBILE DEBUG] Handling CAS callback:', url);

      // Parse the callback URL manually
      const urlParts = url.split('?');
      if (urlParts.length < 2) {
        console.log('❌ [MOBILE DEBUG] Invalid callback URL - no query string');
        return { success: false, message: 'Invalid callback URL' };
      }
      
      const queryString = urlParts[1];
      const params: { [key: string]: string } = {};
      
      // Parse query parameters manually
      queryString.split('&').forEach(param => {
        const [key, value] = param.split('=');
        if (key && value) {
          params[decodeURIComponent(key)] = decodeURIComponent(value);
        }
      });
      
      console.log('📋 [MOBILE DEBUG] Parsed callback parameters:', JSON.stringify(params, null, 2));
      
      const token = params.token;
      const netid = params.netid;
      const email = params.email;
      const name = params.name;

      console.log(`🔑 [MOBILE DEBUG] EXTRACTED NETID FROM BACKEND: ${netid}`);
      console.log(`📧 [MOBILE DEBUG] EXTRACTED EMAIL FROM BACKEND: ${email}`);
      console.log(`👤 [MOBILE DEBUG] EXTRACTED NAME FROM BACKEND: ${name}`);

      if (!token || !netid) {
        console.log('❌ [MOBILE DEBUG] Missing required data - token or netid');
        return { success: false, message: 'Invalid callback data' };
      }

      // Create user profile from callback data
      const userProfile: UserProfile = {
        netid: netid,
        email: email || '',
        firstName: name ? name.split(' ')[0] : 'User',
        lastName: name ? name.split(' ').slice(1).join(' ') : 'User',
        displayName: name || 'User',
        isStudent: true,
        isFaculty: false,
        isStaff: false,
        graduationYear: '2025',
        school: 'Yale University',
        major: 'Computer Science',
        college: 'Branford'
      };

      console.log('👤 [MOBILE DEBUG] Created user profile:', JSON.stringify(userProfile, null, 2));
      console.log(`🎯 [MOBILE DEBUG] FINAL NETID STORED IN APP: ${userProfile.netid}`);

      // Store the session
      const session: AuthSession = {
        token: token,
        user: userProfile,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };

      await this.setSession(session);
      this.currentSession = session;

      // Clear the state
      await AsyncStorage.removeItem('cas_state');

      console.log('✅ [MOBILE DEBUG] Authentication successful - user data stored');

      return { 
        success: true, 
        message: 'Authentication successful',
        user: userProfile
      };
    } catch (error) {
      console.error('💥 [MOBILE DEBUG] Error handling CAS callback:', error);
      return { success: false, message: 'Failed to handle callback' };
    }
  }

  /**
   * Validate CAS ticket with backend service
   */
  private async validateTicket(ticket: string, state: string): Promise<{ success: boolean; message?: string; user?: UserProfile; token?: string }> {
    try {
      // For now, we'll simulate the backend validation
      // In production, this would call your actual backend service
      console.log('Validating ticket with backend:', { ticket, state });

      // Simulate network delay
      await new Promise<void>(resolve => setTimeout(resolve, 1000));

      // Mock validation - in production, this would be a real API call
      if (ticket && ticket.length > 10) {
        const mockUser: UserProfile = {
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
        };

        return {
          success: true,
          user: mockUser,
          token: 'mock_jwt_token_' + Date.now()
        };
      } else {
        return { success: false, message: 'Invalid ticket' };
      }
    } catch (error) {
      console.error('Error validating ticket:', error);
      return { success: false, message: 'Validation failed' };
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
        if (session.expiresAt > Date.now()) {
          this.currentSession = session;
          return session;
        } else {
          await this.logout();
        }
      }
    } catch (error) {
      console.error('Error getting session:', error);
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
      console.error('Error setting session:', error);
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      console.log('🚪 [CAS SERVICE DEBUG] Starting logout process');
      this.currentSession = null;
      await AsyncStorage.removeItem('auth_session');
      await AsyncStorage.removeItem('cas_state');
      console.log('🚪 [CAS SERVICE DEBUG] Logout completed - session cleared');
    } catch (error) {
      console.error('💥 [CAS SERVICE DEBUG] Error during logout:', error);
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const session = await this.getCurrentSession();
    return session !== null;
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<UserProfile | null> {
    const session = await this.getCurrentSession();
    return session?.user || null;
  }

  /**
   * Clear all authentication data (for debugging)
   */
  async clearAllData(): Promise<void> {
    try {
      console.log('🧹 [CAS SERVICE DEBUG] Clearing all authentication data');
      this.currentSession = null;
      await AsyncStorage.removeItem('auth_session');
      await AsyncStorage.removeItem('cas_state');
      console.log('🧹 [CAS SERVICE DEBUG] All data cleared');
    } catch (error) {
      console.error('💥 [CAS SERVICE DEBUG] Error clearing data:', error);
    }
  }

  /**
   * Generate a random state parameter
   */
  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

export default CASService;
