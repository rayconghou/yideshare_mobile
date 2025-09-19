import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  useColorScheme,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';

const MyRidesScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const handleSendFeedback = () => {
    // TODO: Implement feedback functionality
    console.log('Send feedback pressed');
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar barStyle="light-content" backgroundColor="#6B9080" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Rides</Text>
      </View>
      
      {/* Content */}
      <ScrollView style={styles.content}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🚗</Text>
          <Text style={styles.emptyTitle}>No rides yet</Text>
          <Text style={styles.emptySubtitle}>
            Your created rides and bookings will appear here
          </Text>
        </View>
        
        {/* Bottom Buttons */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.feedbackButton} onPress={handleSendFeedback}>
            <Text style={styles.feedbackIcon}>✏️</Text>
            <Text style={styles.feedbackText}>Send Feedback</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const defaultFontFamily = 'Lexend-Regular'
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  header: {
    backgroundColor: '#6B9080',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'Righteous-Regular'
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
    fontFamily: defaultFontFamily
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    fontFamily: defaultFontFamily
  },
  bottomButtons: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6B9080',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  feedbackIcon: {
    fontSize: 14,
    marginRight: 6,
    color: '#6B9080',
  },
  feedbackText: {
    fontSize: 14,
    color: '#6B9080',
    fontWeight: '500',
  },
  logoutButton: {
    paddingVertical: 4,
  },
  logoutText: {
    fontSize: 14,
    color: '#6B9080',
    fontWeight: '500',
  },
});

export default MyRidesScreen;