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
import { Ride } from '../services/RideService';
import { lightColors } from '../constants/colors';
import { rideCardStyles } from '../styles/RideCardStyles';
import { 
  CalendarDotsIcon,  
  ClockIcon, 
  BookmarkSimpleIcon, 
  BookmarksSimpleIcon,
  MapPinSimpleIcon
} from 'phosphor-react-native';

const BookmarksScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const { bookmarkedRides, toggleBookmark } = useAuth();
  const insets = useSafeAreaInsets();

  const handleBookmarkToggle = async (rideId: string) => {
    await toggleBookmark(rideId);
  };

  {/* Renders each individual ride */}
  const renderRideCard = (ride: Ride) => (
      <View key={ride.id} style={rideCardStyles.rideCard}>
        {/* Location */}
        <View style={rideCardStyles.rideHeader}>
          <View style={rideCardStyles.routeInfo}>
            <View style={rideCardStyles.locationRow}>
              <MapPinSimpleIcon size={iconSizeMedium} />
              <Text style={rideCardStyles.locationText}>{ride.from}</Text>
            </View>
            <View style={rideCardStyles.locationRow}>
              <MapPinSimpleIcon
                size={iconSizeMedium}
                color="#666"
                weight="fill"
                style={{ transform: [{ rotate: '180deg' }] }}
              />
              <Text style={rideCardStyles.locationText}>{ride.to}</Text>
            </View>
          </View>
          {/* Date and time */}
          <View style={rideCardStyles.rideDetails}>
            <View style={rideCardStyles.timeInfoLeft}>
              <CalendarDotsIcon size={iconSizeMedium} />
              <Text style={rideCardStyles.dateText}>{ride.date}</Text>
            </View>
            <View style={rideCardStyles.timeInfoRight}>
              <ClockIcon size={iconSizeMedium} />
              <Text style={rideCardStyles.timeText}>{ride.time}</Text>
            </View>
          </View>
        </View>
  
        {/* Driver info */}
        <View style={rideCardStyles.cardContent}>
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
          
          {/* Note, seats, bookmark */}
          <View style={rideCardStyles.rideFooter}>
            <TouchableOpacity>
              <Text style={rideCardStyles.seeNoteText}>See note</Text>
            </TouchableOpacity>
            <Text style={rideCardStyles.seatsText}>{ride.seats} open seats</Text>
            <TouchableOpacity 
              onPress={() => handleBookmarkToggle(ride.id)}>
              <BookmarkSimpleIcon size={24} weight={ride.isBookmarked ? 'fill' : 'regular'} style={[
                rideCardStyles.bookmarkIcon,
                ride.isBookmarked && rideCardStyles.bookmarkIconActive]}/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar barStyle="light-content" backgroundColor="#6B9080" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 15 }]}>
        <Text style={styles.headerTitle}>Bookmarks</Text>
      </View>
      
      {/* Content */}
      <ScrollView style={styles.content}>
        {bookmarkedRides.length > 0 ? (
          bookmarkedRides.map(renderRideCard)
        ) : (
          <View style={styles.emptyState}>
            <BookmarksSimpleIcon size={60} style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>No bookmarked rides</Text>
            <Text style={styles.emptySubtitle}>
              Bookmark rides you're interested in to see them here
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const defaultFontFamily = 'Lexend-Regular'
const iconSizeMedium = 20;
const iconSizeSmall = 14; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.white,
    gap: 32,
    marginTop: 56,
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  header: {
    backgroundColor: lightColors.white,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  emptyState: {
    flex: 1,
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
});

export default BookmarksScreen;