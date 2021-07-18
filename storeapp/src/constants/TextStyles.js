import {StyleSheet} from 'react-native';
import colors from './Colors';

// Text styles
const TextStyles = StyleSheet.create({
  loginLabel: {
    fontSize: 24,
    fontWeight: '700',
    fontStyle: 'normal',
    lineHeight: 38,
    letterSpacing: 0.41,
    color: colors.black,
    marginBottom: 5,
  },
  buttonLabel: {
    fontSize: 24,
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
  headerLabel: {
    fontSize: 20,
    fontStyle: 'normal',
    lineHeight: 38,
    letterSpacing: 0.41,
    color: colors.black,
    marginBottom: 5,
  },
  middleSize: {
    fontSize: 16,
    fontStyle: 'normal',
    lineHeight: 38,
    letterSpacing: 0.41,
    color: colors.black,
    marginBottom: 5,
  },
  standardSize: {
    fontSize: 14,
    fontStyle: 'normal',
    lineHeight: 38,
    letterSpacing: 0.41,
    color: colors.black,
    marginBottom: 5,
  },
  whiteText: {
    color: colors.white,
  },
});

export default TextStyles;
