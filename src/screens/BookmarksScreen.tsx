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
import { lightColors, darkColors } from '../constants/colors';
import { rideCardStyles } from '../styles/RideCardStyles';
import { 
  CalendarDotsIcon,  
  ClockIcon, 
  BookmarkSimpleIcon, 
  MapPinSimpleIcon
} from 'phosphor-react-native';

const BookmarksScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const { bookmarkedRides, toggleBookmark } = useAuth();

  const handleBookmarkToggle = async (rideId: string) => {
    await toggleBookmark(rideId);
  };

  const renderRideCard = (ride: Ride) => (
    <View key={ride.id} style={rideCardStyles.rideCard}>
      <View style={rideCardStyles.rideHeader}>
        <View style={rideCardStyles.routeInfo}>
          <View style={rideCardStyles.locationRow}>
            <MapPinSimpleIcon size={20} style={styles.pinIcon} />
            <Text style={rideCardStyles.locationText}>{ride.from}</Text>
          </View>
          <View style={rideCardStyles.locationRow}>
            <MapPinSimpleIcon size={20} color="#666" weight="fill" style={[styles.pinIcon, { transform: [{ rotate: '180deg' }] }]} />
            <Text style={rideCardStyles.locationText}>{ride.to}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={rideCardStyles.bookmarkButton} 
          onPress={() => handleBookmarkToggle(ride.id)}
        >
          <BookmarkSimpleIcon size={24} weight={ride.isBookmarked ? 'fill' : 'regular'} style={[
            rideCardStyles.bookmarkIcon,
            ride.isBookmarked && rideCardStyles.bookmarkIconActive
          ]}/>
        </TouchableOpacity>
      </View>
      
      <View style={rideCardStyles.rideDetails}>
        <View style={rideCardStyles.timeInfoLeft}>
          <CalendarDotsIcon size={16} style={styles.calendarIcon} />
          <Text style={rideCardStyles.dateText}>{ride.date}</Text>
        </View>
        <View style={rideCardStyles.timeInfoRight}>
          <ClockIcon size={16} style={styles.clockIcon} />
          <Text style={rideCardStyles.timeText}>{ride.time}</Text>
        </View>
      </View>
      
      <View style={rideCardStyles.driverInfo}>
        <View style={rideCardStyles.driverAvatar}>
          <Text style={rideCardStyles.driverInitials}>{ride.driver.initials}</Text>
        </View>
        <View style={rideCardStyles.driverDetails}>
          <View style={rideCardStyles.driverNameRow}>
            <Text style={rideCardStyles.driverName}>{ride.driver.name}</Text>
            <Text style={rideCardStyles.driverEmail}>{ride.driver.email}</Text>
          </View>
        </View>
        <View style={rideCardStyles.driverPhone}>
          <Text style={rideCardStyles.driverPhoneText}>{ride.driver.phone}</Text>
        </View>
      </View>
      
      <View style={rideCardStyles.rideFooter}>
        <TouchableOpacity>
          <Text style={rideCardStyles.seeNoteText}>{ride.note}</Text>
        </TouchableOpacity>
        <Text style={rideCardStyles.seatsText}>{ride.seats} open seats</Text>
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
    backgroundColor: '#ffffff',
    paddingTop: 56,
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
    paddingVertical: 12,
  },
  pinIcon: {
    marginRight: 8,
  },
  calendarIcon: {
    marginRight: 6,
  },
  clockIcon: {
    marginRight: 6,
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