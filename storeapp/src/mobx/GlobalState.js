import {observable} from 'mobx';
import DeviceInfo from 'react-native-device-info';

const GlobalState = observable(
  {
    loginStatus: {
      accessToken: 'INVALID_TOKEN',
    },
    deviceId: DeviceInfo.getUniqueId(),
    shopId: 0,
    isLoading: false,
    shopName: '',
    start_time: '',
    end_time: '',
    carryingGoods: [[], []],
    calculationSheet: 0,
    restDateList: [],
    reserveData: [],
    hoursList: [],
    atecCount: 0,
    detectedId: '',
  },
  {},
);

export default GlobalState;
