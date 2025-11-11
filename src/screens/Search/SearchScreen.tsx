import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  useColorScheme,
  TextInput,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { lightColors } from '../../constants/colors';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../components/RootNavigator';

// icon imports
import { 
    CalendarDotsIcon,  
    ClockIcon, 
    MapPinIcon,
    CaretLeftIcon,
} from 'phosphor-react-native';

const SearchScreen: React.FC = () => {
	const isDarkMode = useColorScheme() === 'dark';
	const [searchText, setSearchText] = useState('');
	const insets = useSafeAreaInsets();
	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'search'>>();
	
	// Handles clicking "X" button
	const handleNavBack = () => {
		navigation.goBack();
	};

	// Handles redirect to location selection screen
	const handleLocationSearch = (screen: string) => {
		navigation.navigate('locationSelect', {
			screen: screen,
		})
	};
	
	// Handles redirection to date selection screen
	const handleCalendarClick = () => {
		navigation.navigate('calendar');
	}

	// Handles redirection to time selection screen
	const handleTimeSelect = () => {
		navigation.navigate('timeSelect');
	}

	// Handles redirection to post new ride screen
	const handlePostRide = () => {
		navigation.navigate('postRide');
	}

  	return (
		<View style={[styles.container, isDarkMode && styles.darkContainer]}>
			<StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
			{/* Header */}
			<View style={[styles.header, { paddingTop: insets.top + 15 }]}>
				<TouchableOpacity style={styles.headerBackButton} onPress={handleNavBack}>
					<CaretLeftIcon size={16.5} color={lightColors.tertiary} style={styles.headerBackButtonIcon} />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Search</Text>
				<View style={styles.headerPlaceholder} />
			</View>

			{/* Content */}
			<View style={styles.content}>
				<Pressable style={styles.searchContainer} onPress={() => handleLocationSearch("leaving")}>
					<MapPinIcon size={iconSizeMedium} color={lightColors.secondary} weight="fill" />
					<TextInput
					style={styles.searchInput}
					placeholder="Leaving from"
					placeholderTextColor={lightColors.secondary}
					value={searchText}
					onChangeText={setSearchText}
					editable={false}
					pointerEvents="none"
					/>
				</Pressable>
				<Pressable style={styles.searchContainer} onPress={() => handleLocationSearch("going")}>
					<MapPinIcon size={iconSizeMedium} color={lightColors.placeholder_gray} weight="fill" />
					<TextInput
					style={styles.searchInput}
					placeholder="Going to"
					placeholderTextColor={lightColors.secondary}
					value={searchText}
					onChangeText={setSearchText}
					editable={false}
					pointerEvents="none"
					/>
				</Pressable>
				<Pressable style={styles.searchContainer} onPress={() => handleCalendarClick()}>
					<CalendarDotsIcon size={iconSizeMedium} color={lightColors.secondary} />
					<TextInput
					style={styles.searchInput}
					placeholder="Date"
					placeholderTextColor={lightColors.secondary}
					value={searchText}
					editable={false}
					pointerEvents="none"
					/>
				</Pressable>
				<Pressable style={styles.searchContainer} onPress={() => handleTimeSelect()}>
					<ClockIcon size={iconSizeMedium} color={lightColors.secondary} />
					<TextInput
					style={styles.searchInput}
					placeholder="Time range"
					placeholderTextColor={lightColors.secondary}
					value={searchText}
					onChangeText={setSearchText}
					editable={false}
					pointerEvents="none"
					/>
				</Pressable>
			</View>
			
			{/* Footer */}
			<View style={[styles.footer, { paddingBottom: Math.max(insets.bottom + 20, 32) }]}>
				<TouchableOpacity style={styles.footerSearchRideButton} onPress={handleNavBack}>
					<Text style={styles.footerSearchRideText}>Search Rides</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.footerPostRideButton} onPress={handlePostRide}>
					<Text style={styles.footerPostRideText}>Post Ride</Text>
				</TouchableOpacity>
			</View>
		</View>
  );
};

const defaultFontFamily = 'Lexend-Regular';
const defaultTextSize = 16;
const buttonTextSize = 14;
const iconSizeSmall = 16;
const iconSizeMedium = 20;

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: defaultTextSize,
    fontWeight: 400,
    color: lightColors.tertiary,
    fontFamily: 'Righteous-Regular',
    textAlign: 'center',
    flex: 1,
  },
  headerBackButton: {
    padding: 8,
  },
  headerBackButtonIcon: {
    // No additional styles needed
  },
  headerPlaceholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
	backgroundColor: lightColors.backgroundBlue,
	paddingBottom: 0,
	gap: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: lightColors.white,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
	gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: defaultTextSize,
    color: lightColors.secondary,
    fontFamily: defaultFontFamily,
	fontWeight: 300, 
  },
  footer: {
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'space-between',
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 20,
	gap: 12,
	backgroundColor: lightColors.backgroundBlue,
  },
  footerSearchRideButton: {
	flex: 1,
	flexDirection: 'row',
    alignItems: 'center',
	justifyContent: 'center',
    borderWidth: 1,
    borderColor: lightColors.tertiary,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  footerSearchRideText: {
	fontSize: buttonTextSize,
	color: lightColors.tertiary,
	fontWeight: '600',
	fontFamily: defaultFontFamily,
  },
  footerPostRideButton: {
    flex: 1,
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

export default SearchScreen;
