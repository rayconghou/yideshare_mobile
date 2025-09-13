import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import CASService, { User } from '../services/CASService';
import { YaliesPerson } from '../services/YaliesService';
import { DeepLinkService, DeepLinkData } from '../services/DeepLinkService';

interface AuthContextType {
  user: User | null;
  yaliesData: YaliesPerson | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isPolling: boolean;
  login: () => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  startPolling: () => void;
  stopPolling: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [yaliesData, setYaliesData] = useState<YaliesPerson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<ReturnType<typeof setInterval> | null>(null);
  const [pollingTimeout, setPollingTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const shouldPollRef = useRef(false);

  const casService = CASService.getInstance();
  const deepLinkService = DeepLinkService.getInstance();

  // Handle deep link authentication
  useEffect(() => {
    const handleDeepLink = (data: DeepLinkData) => {
      console.log('🔗 [AUTH] Deep link received:', data);
      
      if (data.token && data.netid) {
        // Authentication successful via deep link
        console.log('✅ [AUTH] Deep link authentication successful:', data.netid);
        
        // Create user object from deep link data
        const user: User = {
          netid: data.netid,
        };
        
        setUser(user);
        stopPolling(); // Stop any ongoing polling
        
        // Fetch additional user data from Yalies
        casService.getCurrentUserYaliesData().then(yaliesData => {
          if (yaliesData) {
            setYaliesData(yaliesData);
          }
        }).catch(error => {
          console.error('❌ [AUTH] Error fetching Yalies data:', error);
        });
      } else if (data.error) {
        console.error('❌ [AUTH] Deep link authentication failed:', data.error);
        stopPolling();
      }
    };

    deepLinkService.addListener(handleDeepLink);

    return () => {
      deepLinkService.removeListener(handleDeepLink);
    };
  }, []);

  // Check authentication status on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const isAuth = await casService.isAuthenticated();
        if (isAuth) {
          const currentUser = await casService.getCurrentUser();
          const currentYaliesData = await casService.getCurrentUserYaliesData();
          console.log('✅ [LOGIN] User authenticated:', currentUser?.netid);
          setUser(currentUser);
          setYaliesData(currentYaliesData);
        } else {
          setUser(null);
          setYaliesData(null);
        }
      } catch (error) {
        console.error('❌ [LOGIN] Error checking auth status:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('🚀 [LOGIN] Starting authentication process');
      setIsLoading(true);
      
      const result = await casService.initiateLogin();
      console.log(`📊 [LOGIN] Initiation result:`, JSON.stringify(result, null, 2));
      
      if (result.success) {
        startPolling();
      }
      
      return result;
    } catch (error) {
      console.error('❌ [LOGIN] Error:', error);
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
      console.log('🚪 [LOGOUT] Starting logout process');
      stopPolling();
      await casService.logout();
      setUser(null);
      setYaliesData(null);
      console.log('✅ [LOGOUT] Completed');
    } catch (error) {
      console.error('❌ [LOGOUT] Error:', error);
    }
  };

  const startPolling = () => {
    // Don't start polling if already authenticated
    if (user) {
      return;
    }
    
    // Stop any existing polling first
    stopPolling();
    
    setIsPolling(true);
    shouldPollRef.current = true;
    
    const interval = setInterval(async () => {
      // Check if we should still be polling
      if (!shouldPollRef.current) {
        return; // Exit silently
      }
      
      // Check if user is already authenticated
      if (user) {
        stopPolling();
        return;
      }
      
      try {
        const result = await casService.pollForAuthentication();
        console.log(`📊 [LOGIN] Polling result:`, JSON.stringify(result, null, 2));
        
        if (result.success && result.user) {
          console.log('✅ [LOGIN] Authentication completed:', result.user.netid);
          setUser(result.user);
          if (result.yaliesData) {
            console.log('✅ [LOGIN] Yalies data loaded:', result.yaliesData.preferred_name || result.yaliesData.first_name);
            setYaliesData(result.yaliesData);
          }
          stopPolling();
          return; // Exit early to prevent any further processing
        } else if (result.message && result.message.includes('not completed yet')) {
          // Continue polling silently
        } else {
          // Authentication failed or error
          console.log('❌ [LOGIN] Authentication failed:', result.message);
          stopPolling();
          return; // Exit early to prevent any further processing
        }
      } catch (error) {
        console.error('❌ [LOGIN] Error during polling:', error);
        stopPolling();
        return; // Exit early to prevent any further processing
      }
    }, 2000); // Poll every 2 seconds
    
    setPollingInterval(interval);
    
    // Set a timeout to stop polling after 5 minutes (300 seconds)
    const timeout = setTimeout(() => {
      stopPolling();
    }, 5 * 60 * 1000); // 5 minutes
    
    setPollingTimeout(timeout);
  };

  const stopPolling = () => {
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
    yaliesData,
    isAuthenticated: !!user,
    isLoading,
    isPolling,
    login,
    logout,
    startPolling,
    stopPolling,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
