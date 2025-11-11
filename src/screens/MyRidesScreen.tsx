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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { lightColors } from '../constants/colors';
import { CarProfileIcon, PencilSimpleIcon } from 'phosphor-react-native';

const MyRidesScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const { logout } = useAuth();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    logout();
  };

  const handleSendFeedback = () => {
    // TODO: Implement feedback functionality
    console.log('Send feedback pressed');
  };


  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar barStyle="light-content" backgroundColor="#6B9080" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 15 }]}>
        <Text style={styles.headerTitle}>My Rides</Text>
      </View>
      
      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.emptyState}>
          <CarProfileIcon size={60} style={styles.emptyIcon}/>
          <Text style={styles.emptyTitle}>No rides yet</Text>
          <Text style={styles.emptySubtitle}>
            Your created rides will appear here
          </Text>
        </View>
      </ScrollView>
      
      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.feedbackButton} onPress={handleSendFeedback}>
          <PencilSimpleIcon size={12.5} style={styles.feedbackIcon} />
          <Text style={styles.feedbackText}>Send Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const defaultFontFamily = 'Lexend-Regular'
const buttonTextSize = 12
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.white,
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  header: {
    backgroundColor: lightColors.white,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: lightColors.text,
      fontFamily: 'Righteous-Regular',
    },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    flexGrow: 1,
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    marginBottom: 20,
    fontFamily: defaultFontFamily
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: defaultFontFamily,
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: lightColors.white,
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
    marginRight: 6,
    color: lightColors.tertiary,
  },
  feedbackText: {
    fontSize: buttonTextSize,
    color: lightColors.tertiary,
    fontWeight: '500',
  },
  logoutButton: {
    paddingVertical: 4,
  },
  logoutText: {
    fontSize: buttonTextSize,
    color: lightColors.tertiary,
    fontWeight: '500',
  },
});

export default MyRidesScreen;