import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  useColorScheme,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { Ride } from '../services/RideService';
import { lightColors, darkColors } from '../constants/colors';

// icon imports
import { 
  CalendarDotsIcon,  
  ClockIcon, 
  SlidersHorizontalIcon, 
  MagnifyingGlassIcon,
  BookmarkSimpleIcon, 
  MapPinSimpleIcon
} from 'phosphor-react-native';

const HomeScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const { user, yaliesData, logout, rides, toggleBookmark, fetchRides } = useAuth();
  const [searchText, setSearchText] = useState('');

  const handleLogout = () => {
    logout();
  };

  const handleBookmarkToggle = async (rideId: string) => {
    await toggleBookmark(rideId);
  };

  const handleRefresh = () => {
    fetchRides();
  };

  const renderRideCard = (ride: Ride) => (
    <View key={ride.id} style={styles.rideCard}>
      <View style={styles.rideHeader}>
        <View style={styles.routeInfo}>
          <View style={styles.locationRow}>
            <MapPinSimpleIcon size={iconSizeMedium} style={styles.pinIcon} />
            <Text style={styles.locationText}>{ride.from}</Text>
          </View>
          <View style={styles.locationRow}>
            <MapPinSimpleIcon
              size={iconSizeMedium}
              color="#666"
              weight="fill"
              style={[styles.pinIcon, { transform: [{ rotate: '180deg' }] }]} // This flips the icon
            />
            <Text style={styles.locationText}>{ride.to}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.rideDetails}>
        <View style={styles.timeInfoLeft}>
          <CalendarDotsIcon size={iconSizeSmall} style={styles.calendarIcon} />
          <Text style={styles.dateText}>{ride.date}</Text>
        </View>
        <View style={styles.timeInfoRight}>
          <ClockIcon size={iconSizeSmall} style={styles.clockIcon} />
          <Text style={styles.timeText}>{ride.time}</Text>
        </View>
      </View>
      <View style={styles.driverInfo}>
        <View style={styles.driverAvatar}>
          <Text style={styles.driverInitials}>{ride.driver.initials}</Text>
        </View>
        <View style={styles.driverDetails}>
          <View style={styles.driverNameRow}>
            <Text style={styles.driverName}>{ride.driver.name}</Text>
            <Text style={styles.driverEmail}>{ride.driver.email}</Text>
          </View>
        </View>
        <View style={styles.driverPhone}>
          <Text style={styles.driverPhoneText}>{ride.driver.phone}</Text>
        </View>
      </View>
      
      <View style={styles.rideFooter}>
        <TouchableOpacity>
          <Text style={styles.seeNoteText}>See note</Text>
        </TouchableOpacity>
        <Text style={styles.seatsText}>{ride.seats} open seats</Text>
        <TouchableOpacity style={styles.bookmarkButton} 
          onPress={() => handleBookmarkToggle(ride.id)}>
          <BookmarkSimpleIcon size={24} weight={ride.isBookmarked ? 'fill' : 'regular'} style={[
            styles.bookmarkIcon,
            ride.isBookmarked && styles.bookmarkIconActive]}/>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Yideshare</Text>
        <View style={styles.searchContainer}>
          <MagnifyingGlassIcon size={iconSizeSmall} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Where to?"
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>
      
      {/* Content */}
      <ScrollView style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore rides</Text>
          <TouchableOpacity style={styles.filterButton}>
            <SlidersHorizontalIcon size={iconSizeLarge} color={lightColors.text} style={styles.filterIcon} />
          </TouchableOpacity>
        </View>
        
        {rides.map(renderRideCard)}
      </ScrollView>
      
    </SafeAreaView>
  );
};

const defaultFontFamily = 'Lexend-Regular';
const defaultTextSize = 16;
const smallTextSize = 12;
const iconSizeSmall = 16;
const iconSizeMedium = 20;
const iconSizeLarge = 32;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  header: {
    backgroundColor: lightColors.backgroundBlue,
    paddingVertical: 64,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 400,
    color: lightColors.titleText,
    marginBottom: 16,
    fontFamily: 'Righteous-Regular',
    textAlign: 'center'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 10,
    color: lightColors.secondary,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: lightColors.secondary,
    fontFamily: defaultFontFamily,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: lightColors.text,
    fontFamily: defaultFontFamily,
    textAlign: 'center',
    flex: 1,
  },
  filterButton: {
    padding: 5,
  },
  filterIcon: {
    // No size needed here since we use size prop
  },
  rideCard: {
    backgroundColor: '#ffffff',
    borderRadius: 26,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: lightColors.secondary,
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
    marginBottom: 12,
  },
  pinIcon: {
    marginRight: 8,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '400',
    color: lightColors.text,
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
    justifyContent: 'space-between',
  },
  timeInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  timeInfoRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  calendarIcon: {
    marginRight: 6,
  },
  clockIcon: {
    marginRight: 6,
  },
  dateText: {
    fontSize: defaultTextSize,
    color: lightColors.text,
    fontWeight: 300, 
    fontFamily: defaultFontFamily,
  },
  timeText: {
    fontSize: defaultTextSize,
    color: lightColors.text,
    fontFamily: defaultFontFamily,
    textAlign: 'right',
    fontWeight: 300,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopColor: lightColors.primary,
    borderTopWidth: 1,
    marginBottom: 12,
    fontFamily: defaultFontFamily,
    fontSize: smallTextSize,
  },
  driverAvatar: {
    width: 32,
    height: 32,
    borderRadius: 38,
    backgroundColor: '#B0E0D0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
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
  driverNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  driverName: {
    fontSize: smallTextSize,
    fontWeight: 400,
    color: lightColors.text,
    fontFamily: defaultFontFamily,
    textAlign: 'left',
  },
  driverEmail: {
    fontSize: smallTextSize,
    fontWeight: 300,
    color: lightColors.text,
    fontFamily: defaultFontFamily,
    textAlign: 'center',
    flex: 10,
  },
  driverPhone: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  driverPhoneText: {
    fontSize: smallTextSize,
    fontWeight: 300,
    color: lightColors.text,
    fontFamily: defaultFontFamily,
    textAlign: 'right',
  },
  rideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seeNoteText: {
    fontSize: 14,
    color: lightColors.tertiary,
    fontFamily: defaultFontFamily,
    textDecorationLine: 'underline',
  },
  seatsText: {
    fontSize: 14,
    color: lightColors.text,
    fontFamily: defaultFontFamily,
    fontWeight: 300,
  },
  timeElapsed: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  timeElapsedText: {
    textAlign: 'right',
    fontSize: 14,
    fontWeight: 300,
    color: lightColors.text,
    fontFamily: defaultFontFamily,
  }
});

export default HomeScreen;
