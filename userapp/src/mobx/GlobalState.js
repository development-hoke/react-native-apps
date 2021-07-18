import {observable} from 'mobx';
import DeviceInfo from 'react-native-device-info';

const GlobalState = observable(
  {
    deviceId: DeviceInfo.getUniqueId(),
    loginStatus: {
      accessToken: 'INVALID_TOKEN',
    },
    forgotAccount: false,
    signupDateTime: '',
    canReserve: true,
    hoursList: [],
    restDateList: [],
    reservedData: [],
    shopList: [],
    selectedShopID: null,
    verifyNumber: null, 
    phoneNumber: null,
    myInfo: null,
    myShop: null,
    isLoading: false,
    isLogout: false,
    noticeDetailData: null,
    canExit: false,
    backHandler: null,
    access_token: '',
    fcmToken: '',
  },
  {},
);

export default GlobalState;
