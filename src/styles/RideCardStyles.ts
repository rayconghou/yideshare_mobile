import { StyleSheet } from 'react-native';
import { lightColors } from '../constants/colors';

const defaultFontFamily = 'Lexend-Regular';
const defaultTextSize = 16;
const smallTextSize = 12;

export const rideCardStyles = StyleSheet.create({
  rideCard: {
    backgroundColor: lightColors.white,
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
