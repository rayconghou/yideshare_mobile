/**
 * Mobile-Optimized App with Yale CAS Authentication
 * Uses proper mobile authentication patterns instead of deep links
 *
 * @format
 */

import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import LandingScreen from './src/screens/LandingScreen';
import HomeScreen from './src/screens/HomeScreen';
import BookmarksScreen from './src/screens/BookmarksScreen';
import MyRidesScreen from './src/screens/MyRidesScreen';
import MessagesScreen from './src/screens/MessagesScreen';

// Import Phosphor icons
import { HouseIcon, ChatCircleIcon, BellIcon, UserIcon } from 'phosphor-react-native';
import { lightColors, darkColors } from './src/constants/colors';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, isPolling, user } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

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
    const renderScreen = () => {
      switch (activeTab) {
        case 'bookmarks':
          return <BookmarksScreen />;
        case 'myrides':
          return <MyRidesScreen />;
        case 'messages':
          return <MessagesScreen />;
        default:
          return <HomeScreen />;
      }
    };
    const navBarIconSize = 32;
    return (
      <View style={styles.appContainer}>
        {renderScreen()}
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={[styles.navItem, activeTab === 'home' && styles.activeNavItem]}
            onPress={() => setActiveTab('home')}
          >
            <HouseIcon
              size={navBarIconSize}
              color={activeTab === 'home' ? '#6B9080' : '#999'}
              style={styles.navIcon}
              weight={activeTab === 'home' ? 'fill' : 'regular'}
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.navItem, activeTab === 'messages' && styles.activeNavItem]}
            onPress={() => setActiveTab('messages')}
          >
            <ChatCircleIcon
              size={navBarIconSize}
              color={activeTab === 'messages' ? '#6B9080' : '#999'}
              style={styles.navIcon}
              weight={activeTab === 'messages' ? 'fill' : 'regular'}
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.navItem, activeTab === 'bookmarks' && styles.activeNavItem]}
            onPress={() => setActiveTab('bookmarks')}
          >
            <BellIcon
              size={navBarIconSize}
              color={activeTab === 'bookmarks' ? '#6B9080' : '#999'}
              style={styles.navIcon}
              weight={activeTab === 'bookmarks' ? 'fill' : 'regular'}
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.navItem, activeTab === 'myrides' && styles.activeNavItem]}
            onPress={() => setActiveTab('myrides')}
          >
            <UserIcon
              size={navBarIconSize}
              color={activeTab === 'myrides' ? '#6B9080' : '#999'}
              style={styles.navIcon}
              weight={activeTab === 'myrides' ? 'fill' : 'regular'}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return <LandingScreen onAuthSuccess={() => {}} />;
};

function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
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
  appContainer: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: lightColors.backgroundBlue,
    paddingTop: 12,
    paddingBottom: 48,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeNavItem: {
    // Add any active state styling if needed
  },
  navIcon: {
    marginBottom: 4,
    color: lightColors.text,
  }
});

export default App;