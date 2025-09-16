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
            <Text style={styles.pinIcon}>📍</Text>
            <Text style={styles.locationText}>{ride.from}</Text>
          </View>
          <View style={styles.locationRow}>
            <Text style={styles.pinIcon}>📍</Text>
            <Text style={styles.locationText}>{ride.to}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.bookmarkButton}>
          <Text style={styles.bookmarkIcon}>🔖</Text>
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
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Yideshare</Text>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
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
            <Text style={styles.filterIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
        
        {mockRides.map(renderRideCard)}
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
    marginBottom: 15,
    fontFamily: 'Righteous-Regular'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
    fontFamily: defaultFontFamily,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    fontFamily: defaultFontFamily,
  },
  filterButton: {
    padding: 5,
  },
  filterIcon: {
    fontSize: 20,
    fontFamily: defaultFontFamily,
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
    fontWeight: '500',
    color: '#333',
    fontFamily: defaultFontFamily,
  },
  bookmarkButton: {
    padding: 5,
  },
  bookmarkIcon: {
    fontSize: 18,
    fontFamily: defaultFontFamily,
  },
  rideDetails: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  calendarIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  clockIcon: {
    fontSize: 14,
    marginRight: 6,
    fontFamily: defaultFontFamily,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
    fontFamily: defaultFontFamily,
  },
  driverEmail: {
    fontSize: 14,
    color: '#666',
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
});

export default HomeScreen;
