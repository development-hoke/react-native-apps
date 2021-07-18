import {StyleSheet} from 'react-native';
import colors from './Colors';

// Text styles
const TextStyles = StyleSheet.create({
  loginLabel: {
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 28,
    letterSpacing: 0.41,
    // color: colors.black,
    marginBottom: 2,
  },
  buttonLabel: {
    fontSize: 20,
    fontWeight: '700',
    fontStyle: 'normal',
    lineHeight: 38,
    letterSpacing: 0.41,
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  headerDescription: {
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 20,
    marginBottom: 5,
    textAlign: 'center',
  },
  navHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  underline: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: colors.black,
  },
  tabItemText: {
    fontSize: 7,
    textAlign: 'center',
  },
  settingItemText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: -2,
  },
  whiteText: {
    color: colors.white,
  },
  largeText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  normalText: {
    fontSize: 20,
    fontWeight: 'normal',
  },
  hugeText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 40,
    lineHeight: 60,
  },
});

export default TextStyles;
