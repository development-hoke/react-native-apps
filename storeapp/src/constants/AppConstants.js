/* eslint-disable */
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Dimensions } from 'react-native';

export const IS_DEV_MODE = true;
export const API_BASE_URL = 'http://3.15.186.172/api';

export const SCREEN_HEIGHT = Dimensions.get("screen").height;
export const SCREEN_WIDTH = Dimensions.get("screen").width;

export const calendar_leftTopCell_width = 100;
export const calendar_dayCell_width =
  (SCREEN_WIDTH - 30 - calendar_leftTopCell_width) / 7;
export const LOAD_CALENDAR_TYPE = {
  ONLY_DATE: 1,
  ONLY_SCHEDULE_DATA: 2,
  BOTH: 3,
};
export const DayOfWeekNameList = ['日', '月', '火', '水', '木', '金', '土'];

export const MAP_ACTUAL_WIDTH = 816;
export const MAP_ACTUAL_HEIGHT = 756;
export const MAP_VIEW_WIDTH = 350;
export const LOGO_HEIGHT = 250; // 상단에 놓이는 LOGO 그림의 높이

export const ASYNC_PARAMS = {
  IS_LOGIN: "@coatingstore:is_login",
  ACCESS_TOKEN: '@coatingstore:access_token',
  LOGIN_ID: "@coatingstore:login_id",
  LOGIN_PW: "@coatingstore:login_password",
  LOGIN_DI: "@coatingstore:login_device_id",
};

export const ESTIMATE_ITEMS = [
  {
    index: 1,
    title: 'スマートフォン',
    image: require('../../assets/items/smartphone.png'),
  },
  {
    index: 2,
    title: 'メガネ',
    image: require('../../assets/items/glass.png'),
  },
  {
    index: 3,
    title: '腕時計',
    image: require('../../assets/items/watch.png'),
  },
  {
    index: 4,
    title: 'バッグ',
    image: require('../../assets/items/bag.png'),
  },
  {
    index: 5,
    title: 'アクセサリー',
    image: require('../../assets/items/accessory.png'),
  },
  {
    index: 6,
    title: '値引き',
    image: require('../../assets/items/nebiki.png'),
  },
  {
    index: 7,
    title: 'その他',
    image: require('../../assets/items/other.png'),
  },
  {
    index: 8,
    title: '',
  }
]