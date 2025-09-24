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
import { Ride } from '../services/RideService';

const BookmarksScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const { bookmarkedRides, toggleBookmark } = useAuth();

  const handleBookmarkToggle = async (rideId: string) => {
    await toggleBookmark(rideId);
  };

  const renderRideCard = (ride: Ride) => (
    <View key={ride.id} style={styles.rideCard}>
      <View style={styles.rideHeader}>
        <View style={styles.routeInfo}>
          <View style={styles.locationRow}>
            <Text style={styles.pinIcon}>📍</Text>
            <Text style={styles.locationText}>{ride.from}</Text>
          </View>
          <View style={styles.locationRow}>
            <Text style={styles.pinIcon}>📍</Text>
            <Text style={styles.locationText}>{ride.to}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.bookmarkButton} 
          onPress={() => handleBookmarkToggle(ride.id)}
        >
          <Text style={[
            styles.bookmarkIcon,
            ride.isBookmarked && styles.bookmarkIconActive
          ]}>
            {ride.isBookmarked ? '⭐' : '☆'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.rideDetails}>
        <View style={styles.timeInfo}>
          <Text style={styles.calendarIcon}>📅</Text>
          <Text style={styles.dateText}>{ride.date}</Text>
        </View>
        <View style={styles.timeInfo}>
          <Text style={styles.clockIcon}>🕘</Text>
          <Text style={styles.timeText}>{ride.time}</Text>
        </View>
      </View>
      
      <View style={styles.driverInfo}>
        <View style={styles.driverAvatar}>
          <Text style={styles.driverInitials}>{ride.driver.initials}</Text>
        </View>
        <View style={styles.driverDetails}>
          <Text style={styles.driverName}>{ride.driver.name}</Text>
          <Text style={styles.driverEmail}>{ride.driver.email}</Text>
          <Text style={styles.driverPhone}>{ride.driver.phone}</Text>
        </View>
      </View>
      
      <View style={styles.rideFooter}>
        <TouchableOpacity style={styles.noteButton}>
          <Text style={styles.noteText}>{ride.note}</Text>
        </TouchableOpacity>
        <Text style={styles.seatsText}>{ride.seats} open seats</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar barStyle="light-content" backgroundColor="#6B9080" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookmarks</Text>
      </View>
      
      {/* Content */}
      <ScrollView style={styles.content}>
        {bookmarkedRides.length > 0 ? (
          bookmarkedRides.map(renderRideCard)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔖</Text>
            <Text style={styles.emptyTitle}>No bookmarked rides</Text>
            <Text style={styles.emptySubtitle}>
              Bookmark rides you're interested in to see them here
            </Text>
          </View>
        )}
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
  rideCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  routeInfo: {
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  pinIcon: {
    fontSize: 14,
    marginRight: 8,
    fontFamily: defaultFontFamily,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
    fontFamily: defaultFontFamily,
  },
  bookmarkButton: {
    padding: 5,
  },
  bookmarkIcon: {
    fontSize: 18,
    fontFamily: defaultFontFamily,
    opacity: 0.6,
  },
  bookmarkIconActive: {
    opacity: 1,
  },
  rideDetails: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  calendarIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  clockIcon: {
    fontSize: 14,
    marginRight: 6,
    fontFamily: defaultFontFamily,
    flex: 1,
    textAlign: 'right'
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    fontFamily: defaultFontFamily,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    fontFamily: defaultFontFamily,
    textAlign: 'right',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  driverAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#B0E0D0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  driverInitials: {
    color: '#3D7A6A',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: defaultFontFamily,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 14,
    fontWeight: 400,
    color: '#000000',
    marginBottom: 2,
    fontFamily: defaultFontFamily,
  },
  driverEmail: {
    fontSize: 14,
    fontWeight: 300,
    color: '#000000',
    marginBottom: 2,
    fontFamily: defaultFontFamily,
  },
  driverPhone: {
    fontSize: 14,
    color: '#666',
    fontFamily: defaultFontFamily,
  },
  rideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteButton: {
    paddingVertical: 4,
  },
  noteText: {
    fontSize: 14,
    color: '#6B9080',
    textDecorationLine: 'underline',
    fontFamily: defaultFontFamily,
  },
  seatsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    fontFamily: defaultFontFamily,
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
});

export default BookmarksScreen;