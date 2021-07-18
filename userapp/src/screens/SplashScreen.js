import React, {Component} from 'react';
import {View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';

import Colors from '../constants/Colors';
import MyStyles from '../constants/MyStyles';
import Logo from '../components/logo';
import {ASYNC_PARAMS} from '../constants/AppConstants';
import GlobalState from '../mobx/GlobalState';

export default class SplashScreen extends Component {
  componentDidMount() {
    this.interval = setInterval(() => {
      AsyncStorage.getItem(ASYNC_PARAMS.IS_LOGIN, (error, result) => {
        if (result) {
          this.props.navigation.navigate('Main');
        } else {
          this.props.navigation.replace('SelectShop');
        }
        clearInterval(this.interval);
      });
    }, 2000);
    messaging().getToken().then(token => {
      GlobalState.fcmToken = token;
    })
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: Colors.black}}>
        <Logo />
      </View>
    );
  }
}
