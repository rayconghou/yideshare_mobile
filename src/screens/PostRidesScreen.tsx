import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  TextInput,
  Pressable,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { lightColors, darkColors } from '../constants/colors';

import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../components/RootNavigator';
import { rideCardStyles } from '../styles/RideCardStyles';

// icon imports
import { XIcon, MapPinSimpleIcon, CalendarDotsIcon, ClockIcon, MinusCircleIcon, PlusCircleIcon, Minus } from 'phosphor-react-native';

const mockData = [
  {
    id: '1',
    driver: {
      name: 'Jane Doe',
      email: 'test@test.com',
      phone: '555-1234',
      initials: 'JD',
    },
    from: "Test from",
    to: "Test to",
    date: 'Test Date',
    time: 'Test Time',
    seats: 0,
    note: undefined,
    createdAt: new Date().toISOString(),
    isBookmarked: false,
  },
];

const PostRideScreen: React.FC = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const [searchText, setSearchText] = useState('');
    const [openSeats, setOpenSeats] = useState(0);
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'postRide'>>();
    const route = useRoute<RouteProp<RootStackParamList, 'postRide'>>();

    const handleNavBack = () => {
      navigation.goBack();
    };

    const incrementSeats = (minus: Boolean) => {
      if (minus && openSeats > 0){
        setOpenSeats(openSeats - 1)
      } else if (!minus){
        setOpenSeats(openSeats + 1)
      }
    }

    return (
      <View style={[styles.container, isDarkMode && styles.darkContainer]}>
          {/* Header */}
          <View style={styles.header}>
              <TouchableOpacity style={styles.headerBackButton} onPress={handleNavBack}>
                  <XIcon size={24} color={lightColors.stone} style={styles.headerBackButtonIcon} />
              </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {/* Ride info */}
            {mockData.map((ride) => (
              <View key={ride.id} style={styles.rideInfoWrap}> 
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
                <View style={rideCardStyles.locationRow}>
                  <CalendarDotsIcon size={iconSizeMedium} style={rideCardStyles.calendarIcon} color={lightColors.secondary} />
                < Text style={styles.dateTimeText}>{ride.date}</Text>
                </View>
                <View style={rideCardStyles.locationRow}>
                  <ClockIcon size={iconSizeMedium} style={rideCardStyles.clockIcon} color={lightColors.secondary} />
                  <Text style={styles.dateTimeText}>{ride.time}</Text>
                </View>
              </View>
            ))}

            {/* Seat Selection Section */}
            <View style={styles.seatsContainer}>
              <Text style={styles.sectionHeaderText}>Number of open seats</Text>
              <View style={styles.seatsButtonRow}>
                <TouchableOpacity onPress={() => incrementSeats(true)}>
                  <MinusCircleIcon size={24} color={lightColors.tertiary}/>
                </TouchableOpacity>
                <Text style={styles.numOpenSeatsText}>{openSeats}</Text>
                <TouchableOpacity onPress={() => incrementSeats(false)}>
                  <PlusCircleIcon size={24} color={lightColors.tertiary} weight={'fill'}/>
                </TouchableOpacity>
              </View>
            </View>

            {/* Note Section */}
            <View style={styles.noteContainer}>
              <Text style={styles.sectionHeaderText}>Add a note: </Text>
              <Pressable style={styles.noteInputBox}>
                <TextInput
                  style={styles.noteTextInput}
                  placeholder="Please arrive 15 minutes early"
                  placeholderTextColor={lightColors.secondary}
                  value={searchText}
                  onChangeText={setSearchText}
                />
              </Pressable>
            </View>
          </View>
          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.footerPostRideButton}>
              <Text style={styles.footerPostRideText}>Post</Text>
            </TouchableOpacity>
          </View>
      </View>
  );
};

// Style constants
const defaultFontFamily = 'Lexend-Regular';
const defaultTextSize = 16;
const smallTextSize = 14;
const iconSizeMedium = 20;
const buttonTextSize = 14;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.white,
    paddingBottom: 48,
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  header: {
    backgroundColor: lightColors.white,
    paddingTop: 19,
    paddingHorizontal: 16,
  },
  headerBackButton: {
    padding: 8,
  },
  headerBackButtonIcon: {
    // No additional styles needed
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    backgroundColor: lightColors.white,
    gap: 32,
    flex: 1,
  },
  rideInfoWrap: {
    backgroundColor: lightColors.white,
    borderRadius: 26,
    marginTop: 32,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dateTimeText: {
    fontSize: defaultTextSize,
    color: lightColors.secondary,
    fontFamily: defaultFontFamily,
    fontWeight: 300,
  },
  seatsContainer: {
    gap: 12,
  },
  sectionHeaderText: {
    fontFamily: defaultFontFamily,
    color: lightColors.text,
    fontWeight: 300,
    fontSize: smallTextSize,
  },
  seatsButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'center',
    gap: 12,
  },
  numOpenSeatsText: {
    fontFamily: defaultFontFamily,
    fontWeight: 600,
    fontSize: defaultTextSize,
  },
  noteContainer: {
    gap: 12,
  },
  noteInputBox: {
    borderWidth: 1,
    borderColor: lightColors.secondary,
    borderRadius: 16,
    padding: 12,
    gap: 10,
    height: 157,
  },
  noteTextInput: {
    fontFamily: defaultFontFamily,
    fontWeight: 300,
    fontSize: smallTextSize
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  footerPostRideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: lightColors.tertiary,
  },
  footerPostRideText: {
    fontSize: buttonTextSize,
    color: lightColors.white,
    fontWeight: '600',
    fontFamily: defaultFontFamily,
  },
});

export default PostRideScreen;
