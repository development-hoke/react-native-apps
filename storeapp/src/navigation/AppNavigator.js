/* eslint-disable prettier/prettier */
import {createStackNavigator, TransitionPresets} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import SplashScreen from '../screens/home/SplashScreen';
import LoginScreen from '../screens/home/LoginScreen';
import RequestDevice from '../screens/home/RequestDevice';
import RegisterShop from '../screens/home/RegisterShop';
import MainScreen from '../screens/home/MainScreen';
import SignupScreen from '../screens/home/SignupScreen';
import MemberSearchScreen from '../screens/member/MemberSearchScreen';
import MemberDetailScreen from '../screens/member/MemberDetailScreen';
import CarryingRegisterScreen from '../screens/carrying/CarryingRegisterScreen';
import ScanCustomerScreen from '../screens/carrying/ScanCustomerScreen';
import CarryingRegisterConfirmScreen from '../screens/carrying/CarryingRegisterConfirmScreen';
import BottleManagerScreen from '../screens/member/BottleManagerScreen';
import BottleBuyScreen from '../screens/member/BottleBuyScreen';
import CalculationManagerScreen from '../screens/calculation/CalculationManagerScreen';
import CalculationGoodsAddScreen from '../screens/calculation/CalculationGoodsAddScreen';
import InquiryManagerScreen from '../screens/inquiry/InquiryManagerScreen';
import TossupScreen from '../screens/inquiry/TossupScreen';
import AtecManagerScreen from '../screens/atec/AtecManagerScreen';
import RequestListScreen from '../screens/request/RequestListScreen';
import CarryingHistoryScreen from '../screens/carrying/CarryingHistoryScreen';
import MemberRegisterScreen from '../screens/member/MemberRegisterScreen';import QRScanScreen from '../screens/member/QRScanScreen';
import ShopReserveScreen from '../screens/member/ShopReserveScreen';
import CouponRequestListScreen from '../screens/request/CouponRequestListScreen';
import ManualScreen from '../screens/home/ManualScreen';
import CarryingTool from '../screens/home/CarryingTool';
import MyShopEditScreen from '../screens/home/MyShopEditScreen';
import NoticeRequestListScreen from '../screens/request/NoticeRequestListScreen';
import SelectProvinceScreen from '../screens/home/SelectProvinceScreen';
import SelectShopScreen from '../screens/home/SelectShopScreen';
const AppNavigator = createStackNavigator({
  Splash: SplashScreen,
  Login: LoginScreen,
  RequestDevice: RequestDevice,
  RegisterShop: RegisterShop,
  Main: MainScreen,
  Signup: SignupScreen,
  MemberSearch: MemberSearchScreen,
  MemberDetail: MemberDetailScreen,
  CarryingRegister: CarryingRegisterScreen,
  ScanCustomer: ScanCustomerScreen,
  CarryingRegisterConfirm: CarryingRegisterConfirmScreen,
  CarryingHistory: CarryingHistoryScreen,
  BottleManager: BottleManagerScreen,
  BottleBuy: BottleBuyScreen,
  CalculationManager: CalculationManagerScreen,
  CalculationGoodsAdd: CalculationGoodsAddScreen,
  InquiryManager: InquiryManagerScreen,
  AtecManager: AtecManagerScreen,
  Tossup: TossupScreen,
  Request: RequestListScreen,
  CouponRequest: CouponRequestListScreen,
  MemberRegister: MemberRegisterScreen,
  QRScan: QRScanScreen,
  ShopReserve: ShopReserveScreen,
  Manual: ManualScreen,
  CarryingTool: CarryingTool,
  MyShopEdit: MyShopEditScreen,
  NoticeRequest: NoticeRequestListScreen,
  SelectProvince: SelectProvinceScreen,
  SelectShop: SelectShopScreen,
},
  {
    initialRouteName: 'Splash',
    headerMode: 'screen ',
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
    },
  },
);

export default createAppContainer(AppNavigator);
