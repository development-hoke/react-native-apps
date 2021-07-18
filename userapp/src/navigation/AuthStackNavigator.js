import {createStackNavigator, TransitionPresets} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import AgreePolicyScreen from '../screens/AgreePolicyScreen';
import SMSAuthPhoneNumberScreen from '../screens/auth/SMSAuthPhoneNumberScreen';
import SMSAuthVerifyNumberScreen from '../screens/auth/SMSAuthVerifyNumberScreen';
import MemberRegister from '../screens/myPage/MemberRegisterScreen';
import MemberRegisterConfirmScreen from '../screens/myPage/MemberRegisterConfirmScreen';
import React from 'react';
import SelectProvinceScreen from '../screens/SelectProvinceScreen';
import SelectShopScreen from '../screens/SelectShopScreen';
import TransferCodeLogin from '../screens/TransferCodeLoginScreen';
const AuthStackNavigator = createStackNavigator(
  {
    Splash: SplashScreen,
    SelectProvince: SelectProvinceScreen,
    SelectShop: SelectShopScreen,
    Login: LoginScreen,
    AgreePolicy: AgreePolicyScreen,
    SMSAuthPhoneNumber: SMSAuthPhoneNumberScreen,
    SMSAuthVerifyNumber: SMSAuthVerifyNumberScreen,
    Signup: MemberRegister,
    SignupConfirm: MemberRegisterConfirmScreen,
    TransferCodeLogin: TransferCodeLogin,
  },
  {
    // initialRouteName: 'Splash',
    headerMode: 'screen ',
    defaultNavigationOptions: {
      ...TransitionPresets.ModalTransition,
    },
  },
);

export default createAppContainer(AuthStackNavigator);
