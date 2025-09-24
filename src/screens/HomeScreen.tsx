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
import { rideCardStyles } from '../styles/RideCardStyles';

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
    <View key={ride.id} style={rideCardStyles.rideCard}>
      <View style={rideCardStyles.rideHeader}>
        <View style={rideCardStyles.routeInfo}>
          <View style={rideCardStyles.locationRow}>
            <MapPinSimpleIcon size={iconSizeMedium} style={styles.pinIcon} />
            <Text style={rideCardStyles.locationText}>{ride.from}</Text>
          </View>
          <View style={rideCardStyles.locationRow}>
            <MapPinSimpleIcon
              size={iconSizeMedium}
              color="#666"
              weight="fill"
              style={[styles.pinIcon, { transform: [{ rotate: '180deg' }] }]}
            />
            <Text style={rideCardStyles.locationText}>{ride.to}</Text>
          </View>
        </View>
      </View>
      
      <View style={rideCardStyles.rideDetails}>
        <View style={rideCardStyles.timeInfoLeft}>
          <CalendarDotsIcon size={iconSizeSmall} style={styles.calendarIcon} />
          <Text style={rideCardStyles.dateText}>{ride.date}</Text>
        </View>
        <View style={rideCardStyles.timeInfoRight}>
          <ClockIcon size={iconSizeSmall} style={styles.clockIcon} />
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
          <Text style={rideCardStyles.seeNoteText}>See note</Text>
        </TouchableOpacity>
        <Text style={rideCardStyles.seatsText}>{ride.seats} open seats</Text>
        <TouchableOpacity style={rideCardStyles.bookmarkButton} 
          onPress={() => handleBookmarkToggle(ride.id)}>
          <BookmarkSimpleIcon size={24} weight={ride.isBookmarked ? 'fill' : 'regular'} style={[
            rideCardStyles.bookmarkIcon,
            ride.isBookmarked && rideCardStyles.bookmarkIconActive]}/>
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
  pinIcon: {
    marginRight: 8,
  },
  calendarIcon: {
    marginRight: 6,
  },
  clockIcon: {
    marginRight: 6,
  },
});

export default HomeScreen;
