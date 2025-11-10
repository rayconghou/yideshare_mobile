/**
 * Mobile-Optimized App with Yale CAS Authentication
 * Uses proper mobile authentication patterns instead of deep links
 *
 * @format
 */

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import LandingScreen from './src/screens/LandingScreen';
import { RootNavigator } from './src/components/RootNavigator';
import { NavigationContainer } from '@react-navigation/native';

import { lightColors } from './src/constants/colors';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, isPolling } = useAuth();

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

  // if (isAuthenticated) {
  //   const renderScreen = () => {
  //     switch (activeTab) {
  //       case 'bookmarks':
  //         return <BookmarksScreen />;
  //       case 'myrides':
  //         return <MyRidesScreen />;
  //       case 'messages':
  //         return <MessagesScreen />;
  //       case 'search':
  //         return <SearchScreen />;
  //       default:
  //         return <HomeScreen />;
  //     }
  //   };
  //   const navBarIconSize = 32;
  //   return (
  //     <View style={styles.appContainer}>
  //       {renderScreen()}
  //     </View>
  //   );
  // }

  if (isAuthenticated) {
    return <RootNavigator />;
  }
  return <LandingScreen onAuthSuccess={() => {}} />;
};

function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
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
  },
  navLabel: {
    fontSize: 12,
    color: lightColors.text,
    fontFamily: 'Lexend-Regular'
  },
  activeNavLabel: {
    color: lightColors.text,
  }
});

export default App;