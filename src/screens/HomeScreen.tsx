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
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../components/RootNavigator';

import { useAuth } from '../contexts/AuthContext';
import { Ride } from '../services/RideService';
import { lightColors } from '../constants/colors';
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

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'main'>;

const HomeScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const { rides, toggleBookmark } = useAuth();
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const insets = useSafeAreaInsets();

  const handleBookmarkToggle = async (rideId: string) => {
    await toggleBookmark(rideId);
  };
  
  const handleNavSearch = () => {
    navigation.navigate('search');
  };

  const renderRideCard = (ride: Ride) => (
    <View key={ride.id} style={rideCardStyles.rideCard}>
      <View style={rideCardStyles.rideHeader}>
        <View style={rideCardStyles.routeInfo}>
          <View style={rideCardStyles.locationRow}>
            <MapPinSimpleIcon size={iconSizeMedium} style={rideCardStyles.pinIcon} />
            <Text style={rideCardStyles.locationText}>{ride.from}</Text>
          </View>
          <View style={rideCardStyles.locationRow}>
            <MapPinSimpleIcon
              size={iconSizeMedium}
              color="#666"
              weight="fill"
              style={[rideCardStyles.pinIcon, { transform: [{ rotate: '180deg' }] }]}
            />
            <Text style={rideCardStyles.locationText}>{ride.to}</Text>
          </View>
        </View>
      </View>
      
      <View style={rideCardStyles.rideDetails}>
        <View style={rideCardStyles.timeInfoLeft}>
          <CalendarDotsIcon size={iconSizeSmall} style={rideCardStyles.calendarIcon} />
          <Text style={rideCardStyles.dateText}>{ride.date}</Text>
        </View>
        <View style={rideCardStyles.timeInfoRight}>
          <ClockIcon size={iconSizeSmall} style={rideCardStyles.clockIcon} />
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
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 15 }]}>
        <Text style={styles.headerTitle}>Yideshare</Text>
        <Pressable style={styles.searchContainer} onPress={handleNavSearch}>
          <MagnifyingGlassIcon size={iconSizeSmall} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Where to?"
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
            editable={false}
            pointerEvents="none"
          />
        </Pressable>
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
      
    </View>
  );
};

const defaultFontFamily = 'Lexend-Regular';
const iconSizeSmall = 16;
const iconSizeMedium = 20;
const iconSizeLarge = 32;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.backgroundBlue,
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  header: {
    backgroundColor: lightColors.backgroundBlue,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 400,
    color: lightColors.tertiary,
    marginBottom: 16,
    fontFamily: 'Righteous-Regular',
    textAlign: 'center'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: lightColors.white,
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
    backgroundColor: lightColors.white
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
});

export default HomeScreen;
