import React from 'react';
import {createStackNavigator, TransitionPresets} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import Colors from '../constants/Colors';
import MyStyles from '../constants/MyStyles';
import SettingMenu from '../screens/SettingMenu';
import RegisterFinish from '../screens/myPage/RegisterFinish';
import MarketSearchMain from '../screens/marketSearch/MarketSearchMainScreen';
import TopMainScreen from '../screens/top/TopMainScreen';
import TopicDetailScreen from '../screens/top/TopicDetailScreen';
import NoticeMain from '../screens/notice/NoticeMainScreen';
import MyMain from '../screens/myPage/MyMainScreen';
import MarketReserveMain from '../screens/marketReserve/MarketReserveMainScreen';
import OnLineShopMain from '../screens/onlineShop/OnLineShopMainScreen';
import {BOTTOMBAR_HEIGHT} from '../constants/AppConstants';
import MyCouponUse from '../screens/myPage/MyCouponUse';
import MarketReserveScheduleScreen from '../screens/marketReserve/MarketReserveScheduleScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import MarketReserveQuestionScreen from '../screens/marketReserve/MarketReserveQuestionScreen';
import MarketReserveQuestionConfirmScreen from '../screens/marketReserve/MarketReserveQuestionConfirmScreen';
import MarketReserveFinishScreen from '../screens/marketReserve/MarketReserveFinishScreen';
import MarketReserveReceiveListScreen from '../screens/marketReserve/MarketReserveReceiveListScreen';
import MarketReserveReceiveDetailScreen from '../screens/marketReserve/MarketReserveReceiveDetailScreen';
import MarketSearchAreaScreen from '../screens/marketSearch/MarketSearchAreaScreen';
import MarketSearchMarketScreen from '../screens/marketSearch/MarketSearchMarketScreen';
import MarketSearchMarketDetailScreen from '../screens/marketSearch/MarketSearchMarketDetailScreen';
import NoticeDetailScreen from '../screens/notice/NoticeDetailScreen';
import MemberRegisterScreen from '../screens/myPage/MemberRegisterScreen';
import GlobalState from '../mobx/GlobalState';
import GlobalVariable from '../mobx/GlobalVariable';
import MemberRegisterConfirmScreen from '../screens/myPage/MemberRegisterConfirmScreen';
import SigongListScreen from '../screens/myPage/SigongListScreen';
import SigongDetailScreen from '../screens/myPage/SigongDetailScreen';
import AgreePolicyScreen from '../screens/AgreePolicyScreen';
import MarketSearchMapScreen from '../screens/marketSearch/MarketSearchMapScreen';
import MarketReserveDetailScreen from '../screens/marketReserve/MarketReserveDetailScreen';
import MarketSearchProvinceSelectScreen from '../screens/marketSearch/MarketSearchProvinceSelectScreen';
import MarketSearchMarketSelect from '../screens/marketSearch/MarketSearchMarketSelectScreen';
import FaqScreen from '../screens/marketReserve/FaqScreen';

const TopStack = createStackNavigator(
  {
    TopMain: TopMainScreen,
    Topic: TopicDetailScreen,
    Setting: SettingMenu,
  },
  {
    headerMode: 'screen ',
    defaultNavigationOptions: {
      // headerBackTitleVisible: true,
      ...TransitionPresets.SlideFromRightIOS,
    },
  },
);

TopStack.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;
  let routeName = navigation.state.routes[navigation.state.index].routeName;
  return {
    tabBarLabel: 'Top',
    tabBarIcon: ({focused}) =>
      focused ? (
        <Icon name={'home'} size={40} color={Colors.black} />
      ) : (
        <Icon name={'home'} size={40} color={Colors.white} />
      ),
    tabBarVisible: tabBarVisible,
  };
};

const NoticeStack = createStackNavigator(
  {
    NoticeMain: NoticeMain,
    Setting: SettingMenu,
    NoticeDetail: NoticeDetailScreen,
  },
  {
    headerMode: 'screen ',
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
    },
  },
);

NoticeStack.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;
  let routeName = navigation.state.routes[navigation.state.index].routeName;
  return {
    tabBarLabel: 'お知らせ',
    tabBarIcon: ({focused}) =>
      focused ? (
        <Icon name={'bell'} size={35} color={Colors.black} />
      ) : (
        <Icon name={'bell'} size={35} color={Colors.white} />
      ),
    tabBarVisible: tabBarVisible,
  };
};

const MyStack = createStackNavigator(
  {
    MyMain: MyMain,
    RegisterFinish: RegisterFinish,
    Setting: SettingMenu,
    CouponUse: MyCouponUse,
    MemberRegister: MemberRegisterScreen,
    MemberRegisterConfirm: MemberRegisterConfirmScreen,
    SigongList: SigongListScreen,
    SigongDetail: SigongDetailScreen,
    UsePolicyLicense: AgreePolicyScreen,
  },
  {
    headerMode: 'screen ',
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
    },
  },
);

MyStack.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;
  let routeName = navigation.state.routes[navigation.state.index].routeName;
  return {
    tabBarLabel: 'マイページ',
    tabBarIcon: ({focused}) =>
      focused ? (
        <Icon name={'user'} size={40} color={Colors.black} />
      ) : (
        <Icon name={'user'} size={40} color={Colors.white} />
      ),
    tabBarVisible: tabBarVisible,
  };
};

const MarketReserveStack = createStackNavigator(
  {
    MarketReserveMain: MarketReserveMain,
    Setting: SettingMenu,
    MarketReserveSchedule: MarketReserveScheduleScreen,
    MarketReserveQuestion: MarketReserveQuestionScreen,
    MarketReserveQuestionConfirm: MarketReserveQuestionConfirmScreen,
    MarketReserveFinish: MarketReserveFinishScreen,
    MarketReserveReceiveList: MarketReserveReceiveListScreen,
    MarketReserveReceiveDetail: MarketReserveReceiveDetailScreen,
    MarketReserveDetail: MarketReserveDetailScreen,
    Faq: FaqScreen,
  },
  {
    headerMode: 'screen ',
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
    },
  },
);

MarketReserveStack.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;
  let routeName = navigation.state.routes[navigation.state.index].routeName;
  if (routeName == 'MarketReserveFinish') tabBarVisible = false;
  return {
    tabBarLabel: 'ご来店予約\nお問い合わせ',
    tabBarIcon: ({focused}) =>
      focused ? (
        <Icon name={'calendar'} size={40} color={Colors.black} />
      ) : (
        <Icon name={'calendar'} size={40} color={Colors.white} />
      ),
    tabBarVisible: tabBarVisible,
  };
};

const MarketSearchStack = createStackNavigator(
  {
    MarketSearchMap: MarketSearchMapScreen,
    MarketSearchMain: MarketSearchMain,
    Setting: SettingMenu,
    MarketSearchArea: MarketSearchAreaScreen,
    MarketSearchMarket: MarketSearchMarketScreen,
    MarketSearchMarketDetail: MarketSearchMarketDetailScreen,
    MarketSearchProvinceSelect: MarketSearchProvinceSelectScreen,
    MarketSearchMarketSelect: MarketSearchMarketSelect,
  },
  {
    headerMode: 'screen ',
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
    },
  },
);

MarketSearchStack.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;
  let routeName = navigation.state.routes[navigation.state.index].routeName;
  return {
    tabBarLabel: '店舗検索',
    tabBarIcon: ({focused}) =>
      focused ? (
        <Icon name={'map-marker'} size={40} color={Colors.black} />
      ) : (
        <Icon name={'map-marker'} size={40} color={Colors.white} />
      ),
    tabBarVisible: tabBarVisible,
  };
};

const OnLineShopStack = createStackNavigator(
  {
    OnLineShopMain: OnLineShopMain,
    Setting: SettingMenu,
  },
  {
    headerMode: 'screen ',
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
    },
  },
);

OnLineShopStack.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;
  let routeName = navigation.state.routes[navigation.state.index].routeName;
  return {
    tabBarLabel: 'HARUTO\nオンラインショップ',
    tabBarIcon: ({focused}) =>
      focused ? (
        <Icon name={'shopping-cart'} size={40} color={Colors.black} />
      ) : (
        <Icon name={'shopping-cart'} size={40} color={Colors.white} />
      ),
    tabBarVisible: tabBarVisible,
  };
};

export default createBottomTabNavigator(
  {
    TopStack,
    NoticeStack,
    MyStack,
    MarketReserveStack,
    MarketSearchStack,
  },
  {
    initialRouteName: 'TopStack',
    // backBehavior: 'history',
    tabBarOptions: {
      activeBackgroundColor: Colors.white,
      inactiveBackgroundColor: Colors.black,
      activeTintColor: Colors.black,
      inactiveTintColor: Colors.white,
      labelStyle: MyStyles.tabbar_label,
      style: [
        {
          height: BOTTOMBAR_HEIGHT,
          borderBottomColor: Colors.white,
          borderBottomWidth: 1,
        },
      ],
    },
  },
);
