/**
 * Mobile-Optimized App with Yale CAS Authentication
 * Uses proper mobile authentication patterns instead of deep links
 *
 * @format
 */

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MobileAuthProvider, useMobileAuth } from './src/contexts/MobileAuthContext';
import MobileLandingScreen from './src/screens/MobileLandingScreen';
import HomeScreen from './src/screens/HomeScreen';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, isPolling, user } = useMobileAuth();

  console.log('📱 [MOBILE APP] Current state:', { 
    isAuthenticated, 
    isLoading, 
    isPolling, 
    user: user?.netid 
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (isPolling) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Authenticating with Yale CAS...</Text>
        <Text style={styles.subText}>Please complete authentication in your browser</Text>
      </View>
    );
  }

  if (isAuthenticated) {
    console.log('🏠 [MOBILE APP] Rendering HomeScreen - user authenticated:', { 
      netid: user?.netid, 
      email: user?.email,
      name: user?.displayName 
    });
    return <HomeScreen />;
  }

  return <MobileLandingScreen onAuthSuccess={() => {}} />;
};

function MobileApp() {
  return (
    <SafeAreaProvider>
      <MobileAuthProvider>
        <AppContent />
      </MobileAuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  subText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default MobileApp;
