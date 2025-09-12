import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import MobileCASService from '../services/MobileCASService';
import { UserProfile } from '../services/CASService';

interface MobileAuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isPolling: boolean;
  login: () => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  startPolling: () => void;
  stopPolling: () => void;
}

const MobileAuthContext = createContext<MobileAuthContextType | undefined>(undefined);

export const useMobileAuth = () => {
  const context = useContext(MobileAuthContext);
  if (context === undefined) {
    throw new Error('useMobileAuth must be used within a MobileAuthProvider');
  }
  return context;
};

interface MobileAuthProviderProps {
  children: ReactNode;
}

export const MobileAuthProvider: React.FC<MobileAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<ReturnType<typeof setInterval> | null>(null);
  const [pollingTimeout, setPollingTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const shouldPollRef = useRef(false);

  const mobileCASService = MobileCASService.getInstance();

  // Check authentication status on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log('🔍 [MOBILE AUTH] Checking authentication status on app start');
        const isAuth = await mobileCASService.isAuthenticated();
        if (isAuth) {
          const currentUser = await mobileCASService.getCurrentUser();
          console.log('✅ [MOBILE AUTH] User is authenticated:', currentUser?.netid);
          setUser(currentUser);
        } else {
          console.log('❌ [MOBILE AUTH] User is not authenticated');
          setUser(null);
        }
      } catch (error) {
        console.error('💥 [MOBILE AUTH] Error checking auth status:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('🚀 [MOBILE AUTH] Starting login process');
      setIsLoading(true);
      
      const result = await mobileCASService.initiateLogin();
      
      if (result.success) {
        console.log('📱 [MOBILE AUTH] Login initiated, starting polling');
        startPolling();
      }
      
      return result;
    } catch (error) {
      console.error('💥 [MOBILE AUTH] Error during login:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Login failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('🚪 [MOBILE AUTH] Starting logout process');
      stopPolling();
      await mobileCASService.logout();
      setUser(null);
      console.log('🚪 [MOBILE AUTH] Logout completed');
    } catch (error) {
      console.error('💥 [MOBILE AUTH] Error during logout:', error);
    }
  };

  const startPolling = () => {
    // Don't start polling if already authenticated
    if (user) {
      console.log('🔄 [MOBILE AUTH] User already authenticated, skipping polling');
      return;
    }
    
    // Stop any existing polling first
    stopPolling();
    
    console.log('🔄 [MOBILE AUTH] Starting authentication polling');
    console.log('🔄 [MOBILE AUTH] Current user state:', user ? 'authenticated' : 'not authenticated');
    console.log('🔄 [MOBILE AUTH] Current isAuthenticated:', !!user);
    setIsPolling(true);
    shouldPollRef.current = true;
    
    const interval = setInterval(async () => {
      // Check if we should still be polling
      if (!shouldPollRef.current) {
        return; // Exit silently
      }
      
      // Check if user is already authenticated
      if (user) {
        console.log('🛑 [MOBILE AUTH] User already authenticated, stopping polling');
        stopPolling();
        return;
      }
      
      try {
        console.log('🔄 [MOBILE AUTH] Polling for authentication...');
        const result = await mobileCASService.pollForAuthentication();
        
        if (result.success && result.user) {
          console.log('✅ [MOBILE AUTH] Authentication completed:', result.user.netid);
          setUser(result.user);
          stopPolling();
          return; // Exit early to prevent any further processing
        } else if (result.message && result.message.includes('not completed yet')) {
          // Continue polling
          console.log('⏳ [MOBILE AUTH] Authentication not completed yet, continuing to poll...');
        } else {
          // Authentication failed or error
          console.log('❌ [MOBILE AUTH] Authentication failed:', result.message);
          stopPolling();
          return; // Exit early to prevent any further processing
        }
      } catch (error) {
        console.error('💥 [MOBILE AUTH] Error during polling:', error);
        stopPolling();
        return; // Exit early to prevent any further processing
      }
    }, 2000); // Poll every 2 seconds
    
    setPollingInterval(interval);
    
    // Set a timeout to stop polling after 5 minutes (300 seconds)
    const timeout = setTimeout(() => {
      console.log('⏰ [MOBILE AUTH] Polling timeout reached, stopping polling');
      stopPolling();
    }, 5 * 60 * 1000); // 5 minutes
    
    setPollingTimeout(timeout);
  };

  const stopPolling = () => {
    console.log('🛑 [MOBILE AUTH] Stopping authentication polling');
    shouldPollRef.current = false;
    setIsPolling(false);
    
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
    
    if (pollingTimeout) {
      clearTimeout(pollingTimeout);
      setPollingTimeout(null);
    }
  };

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isPolling,
    login,
    logout,
    startPolling,
    stopPolling,
  };

  return <MobileAuthContext.Provider value={value}>{children}</MobileAuthContext.Provider>;
};
