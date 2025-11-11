import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import CASService, { User } from '../services/CASService';
import { YaliesPerson } from '../services/YaliesService';
import { DeepLinkService, DeepLinkData } from '../services/DeepLinkService';
import RideService, { Ride } from '../services/RideService';

interface AuthContextType {
  user: User | null;
  yaliesData: YaliesPerson | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isPolling: boolean;
  rides: Ride[];
  bookmarkedRides: Ride[];
  login: () => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  startPolling: () => void;
  stopPolling: () => void;
  fetchRides: () => Promise<void>;
  fetchBookmarkedRides: () => Promise<void>;
  toggleBookmark: (rideId: string) => Promise<void>;
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
  const [rides, setRides] = useState<Ride[]>([]);
  const [bookmarkedRides, setBookmarkedRides] = useState<Ride[]>([]);
  const shouldPollRef = useRef(false);

  const casService = CASService.getInstance();
  const deepLinkService = DeepLinkService.getInstance();
  const rideService = RideService.getInstance();

  // Handle deep link authentication
  useEffect(() => {
    const handleDeepLink = (data: DeepLinkData) => {
      console.log('🔗 [AUTH] Deep link received:', data);
      
      if (data.token && data.netid) {
        // Authentication successful via deep link
        console.log('✅ [AUTH] Deep link authentication successful:', data.netid);
        
        // Create user object from deep link data
        const deepLinkUser: User = {
          netid: data.netid,
        };
        
        setUser(deepLinkUser);
        stopPolling(); // Stop any ongoing polling
        
        // Fetch additional user data from Yalies
        casService.getCurrentUserYaliesData().then(yaliesUserData => {
          if (yaliesUserData) {
            setYaliesData(yaliesUserData);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch rides when user is authenticated
  useEffect(() => {
    if (user) {
      fetchRides();
      fetchBookmarkedRides();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
      setRides([]);
      setBookmarkedRides([]);
      console.log('✅ [LOGOUT] Completed');
    } catch (error) {
      console.error('❌ [LOGOUT] Error:', error);
    }
  };

  const fetchRides = async (): Promise<void> => {
    if (!user) return;
    
    try {
      console.log('🚗 [RIDES] Fetching rides with bookmark status');
      const ridesWithBookmarkStatus = await rideService.getRidesWithBookmarkStatus(user);
      setRides(ridesWithBookmarkStatus);
      console.log('✅ [RIDES] Fetched', ridesWithBookmarkStatus.length, 'rides');
    } catch (error) {
      console.error('❌ [RIDES] Error fetching rides:', error);
    }
  };

  const fetchBookmarkedRides = async (): Promise<void> => {
    if (!user) return;
    
    try {
      console.log('🔖 [BOOKMARKS] Fetching bookmarked rides');
      const fetchedBookmarkedRides = await rideService.getBookmarkedRides(user);
      setBookmarkedRides(fetchedBookmarkedRides);
      console.log('✅ [BOOKMARKS] Fetched', bookmarkedRides.length, 'bookmarked rides');
    } catch (error) {
      console.error('❌ [BOOKMARKS] Error fetching bookmarked rides:', error);
    }
  };

  const toggleBookmark = async (rideId: string): Promise<void> => {
    if (!user) return;
    
    try {
      console.log('🔖 [BOOKMARKS] Toggling bookmark for ride:', rideId);
      const result = await rideService.toggleBookmark(user, rideId);
      
      if (result.success) {
        // Refresh both arrays from server to ensure consistency
        await Promise.all([
          fetchRides(),
          fetchBookmarkedRides()
        ]);
        
        console.log('✅ [BOOKMARKS] Bookmark toggled successfully:', result.isBookmarked);
      } else {
        console.error('❌ [BOOKMARKS] Failed to toggle bookmark:', result.message);
      }
    } catch (error) {
      console.error('❌ [BOOKMARKS] Error toggling bookmark:', error);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    user,
    yaliesData,
    isAuthenticated: !!user,
    isLoading,
    isPolling,
    rides,
    bookmarkedRides,
    login,
    logout,
    startPolling,
    stopPolling,
    fetchRides,
    fetchBookmarkedRides,
    toggleBookmark,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
