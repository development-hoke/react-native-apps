import {StyleSheet, Dimensions} from 'react-native';
import Colors from './Colors';
import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  STATUSBAR_HEIGHT,
  BOTTOMBAR_HEIGHT,
  NAVIGATION_HEADER_HEIGHT,
} from './AppConstants';

export default StyleSheet.create({
  topContainer: {
    flex: 1,
    height: '100%',
    // height: SCREEN_HEIGHT - STATUSBAR_HEIGHT,
  },
  logo_img: {
    flex: 1,
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30,
    width: SCREEN_WIDTH - 60,
  },
  fullScreen: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  blackBorder: {
    borderWidth: 3,
    borderColor: Colors.black,
  },
  whiteInfoPane: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingStart: 15,
    paddingEnd: 15,
  },
  bottomTabBar: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: BOTTOMBAR_HEIGHT,
    backgroundColor: Colors.black,
    borderBottomWidth: 2,
    borderTopWidth: 2,
    borderBottomColor: Colors.white,
    borderTopColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  navigationHeader: {
    // position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: NAVIGATION_HEADER_HEIGHT,
    backgroundColor: Colors.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabbar_label: {
    fontSize: 9,
    fontWeight: 'normal',
    textAlign: 'center',
    marginBottom: 5,
  },
  pickerSelectIconStyles: {
    width: 44,
    height: 44,
    backgroundColor: '#AFABAB',
  },
});
