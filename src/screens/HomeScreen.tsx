import React, { useState } from 'react';
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

// Mock ride data
const mockRides = [
  {
    id: '1',
    from: 'Branford College',
    to: 'Hartford (BDL)',
    date: '14 Dec',
    time: '9:30 AM - 11:00 AM',
    driver: {
      name: 'Aspen Carder',
      email: 'driver@yale.edu',
      phone: '(123) 456-7890',
      initials: 'AC',
    },
    seats: 2,
    note: 'See note',
    timeElapsed: '1 day ago'
  },
  {
    id: '2',
    from: 'Branford College',
    to: 'Hartford (BDL)',
    date: '14 Dec',
    time: '9:30 AM - 11:00 AM',
    driver: {
      name: 'Ruben Rosser',
      email: 'driver@yale.edu',
      phone: '(123) 456-7890',
      initials: 'RR',
    },
    seats: 2,
    note: 'See note',
    timeElapsed: '1 day ago'
  },
];

const HomeScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const { user, yaliesData, logout } = useAuth();
  const [searchText, setSearchText] = useState('');

  const handleLogout = () => {
    logout();
  };

  const renderRideCard = (ride: typeof mockRides[0]) => (
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
        <TouchableOpacity style={styles.bookmarkButton}>
          <BookmarkSimpleIcon size={iconSizeMedium} style={styles.bookmarkIcon} />
        </TouchableOpacity>
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
          <Text style={styles.driverName}>{ride.driver.name}</Text>
          <Text style={styles.driverEmail}>{ride.driver.email}</Text>
        </View>
        <View style={styles.timeElapsed}>
          <Text style={styles.timeElapsedText}>{ride.timeElapsed}</Text>
        </View>
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
        
        {mockRides.map(renderRideCard)}
      </ScrollView>
      
    </SafeAreaView>
  );
};

const defaultFontFamily = 'Lexend-Regular';
const defaultTextSize = 16;
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
    marginBottom: 8,
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
    // No size needed here since we use size prop
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
    color: lightColors.text,
    marginBottom: 2,
    fontFamily: defaultFontFamily,
  },
  driverEmail: {
    fontSize: 14,
    fontWeight: 300,
    color: lightColors.text,
    fontFamily: defaultFontFamily,
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
