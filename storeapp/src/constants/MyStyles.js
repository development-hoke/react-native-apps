/* eslint-disable */
import Colors from './Colors';
import {StyleSheet} from 'react-native';
import { SCREEN_WIDTH, SCREEN_HEIGHT} from './AppConstants';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  logo_img: {
    flex:1,
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
    borderWidth: 2,
    borderColor: Colors.black,
  },
  whiteInfoPane: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    color: 'black',
    borderColor: Colors.black,
    borderWidth: 1,
    height: 32,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 10,
    paddingRight: 10,
  },
  pickerStyle: {
    borderColor: Colors.black,
    borderWidth: 1,
    height: 32,
  },
  background_image: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "absolute",
    flex: 1,
    height: null,
    width: null,
    resizeMode: "cover",
  },
  tableRow: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tableHeader: {
    fontSize: 16,
    backgroundColor: '#BFBFBF',
    textAlign: 'center',
    borderColor: '#FFFFFF',
    borderRightWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
  },
  tableContent: {
    fontSize: 12,
    backgroundColor: '#F2F2F2',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
    textAlignVertical: 'center',
    height: '100%'
  },
  transTableContent: {
    fontSize: 12,
    backgroundColor: 'transparent',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
    textAlignVertical: 'center',
    height: '100%'
  },
  Modal: {
    flexDirection: 'column',
    margin: 30,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#DAE3F3',
    elevation: 15,
  },
  s_Modal: {
    // flex: 1,
    flexDirection: 'column',
    margin: 100,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#DAE3F3',
    elevation: 15,
  },
  textArea: {
    borderWidth: 2,
    borderColor: '#000000',
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    textAlignVertical: 'top',
    padding: 10,
  },
  modalCloseView: {
    height: 30,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 5,
  },
  m_15: {
    margin: 15,
  },
  mt_15: {
    marginTop: 15,
  },
  mr_15: {
    marginRight: 15,
  },
  ml_15: {
    marginLeft: 15,
  },
  mb_15: {
    marginBottom: 15,
  },
  mb_10: {
    marginBottom: 10,
  },
  toggleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleColor: {
    backgroundColor: '#0070C0'
  },
  link: {
    color: '#4a85ba',
    textDecorationLine: 'underline',
  },
  checkStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderBottomWidth: 1,
    paddingBottom: 2,
  },
});
