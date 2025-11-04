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
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { lightColors, darkColors } from '../constants/colors';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../components/RootNavigator';

// icon imports
import { XIcon } from 'phosphor-react-native';

// Calendar config
LocaleConfig.locales['us'] = {
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  today: 'Today',
};
LocaleConfig.defaultLocale = 'us';

const SearchScreen: React.FC = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const [searchText, setSearchText] = useState('');
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'search'>>();
    
    const handleNavBack = () => {
        console.log("back");
        navigation.goBack();
    };

    // Calendar selection
    const [selected, setSelected] = useState('');
    const handleDayPress = (day: DateData) => {
        // TODO get actual day
        console.log(day);
        setSelected(day.dateString);
        // navigation.goBack();
    };

    return (
        <View style={[styles.container, isDarkMode && styles.darkContainer]}>
            {/* <StatusBar barStyle="light-content" backgroundColor="#4A90E2" /> */}
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerBackButton} onPress={handleNavBack}>
                    <XIcon size={24} color={lightColors.stone} style={styles.headerBackButtonIcon} />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Calendar
                    // showSixWeeks={true}
                    onDayPress={handleDayPress}
                    markedDates={{
                        [selected]: {selected: true, disableTouchEvent: true}
                    }}
                    headerStyle = {{
                        rowGap: 48,
                    
                    }}
                    theme = {{
                        backgroundColor: lightColors.white,
                        calendarBackground: lightColors.white,
                        textSectionTitleColor: lightColors.text,
                        selectedDayBackgroundColor: lightColors.secondary,
                        selectedDayTextColor: lightColors.text,
                        todayTextColor: lightColors.text,
                        
                        arrowColor: lightColors.text,
                        disabledArrowColor: lightColors.placeholder_gray,
                        
                        textDayFontFamily: defaultFontFamily,
                        textDayFontWeight: 400,
                        textDayFontSize: 13,
                        dayTextColor: lightColors.text,

                        textMonthFontFamily: defaultFontFamily,
                        textMonthFontWeight: 600,
                        textMonthFontSize: 16,
                        monthTextColor: lightColors.text,
                        
                        textDayHeaderFontFamily: defaultFontFamily,
                        textDayHeaderFontWeight: 300,
                        textDayHeaderFontSize: 13,
       
                        // dotColor: lightColors.secondary,
                        // selectedDotColor: lightColors.secondary
                        // indicatorColor: lightColors.placeholder_gray, 
                    }}
                />
            </View>
        </View>
  );
};

const defaultFontFamily = 'Lexend-Regular';
const defaultTextSize = 16;
const smallTextSize = 12;
const buttonTextSize = 14;
const iconSizeSmall = 16;
const iconSizeMedium = 20;
const iconSizeLarge = 32;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.white,
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  header: {
    backgroundColor: lightColors.white,
    paddingBottom: 100,
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
    backgroundColor: lightColors.white,
    paddingBottom: 0,
  },
});

export default SearchScreen;
