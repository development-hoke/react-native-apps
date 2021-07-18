/**
 *
 */

import React, {Component} from 'react';
import {StyleSheet, View, ActivityIndicator, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import Colors from '../../constants/Colors';
import MyStyles from '../../constants/MyStyles';
import Logo from '../../components/logo';
import { ASYNC_PARAMS } from '../../constants/AppConstants';
import {requestPost, Net, alertNetworkError} from '../../utils/ApiUtils';
import GlobalState from '../../mobx/GlobalState';

export default class SplashScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      AsyncStorage.getItem(ASYNC_PARAMS.IS_LOGIN, (error, result) => {
        if (result == 'true') {
          checkAuth();
        } else {
          this.props.navigation.navigate('Login');
        }
      });
      clearInterval(this.interval);
    }, 2000);

    const checkAuth = async () => {
      let values
      try {
        values = await AsyncStorage.multiGet([
          ASYNC_PARAMS.ACCESS_TOKEN, 
          ASYNC_PARAMS.LOGIN_ID,
          ASYNC_PARAMS.LOGIN_PW,
          ASYNC_PARAMS.LOGIN_DI,
        ])
        const fcmToken = await messaging().getToken();
        requestPost(Net.auth.login, {
          name: values[1][1],
          password: values[2][1],
          deviceId: values[3][1],
          fcmToken: fcmToken,
        })
          .then(json => {
            if (json.result === Net.error.E_LOGIN) {
              Alert.alert(
                'ログイン失敗',
                'ログインに失敗しました. 勘定情報を確認してください.',
              );
              this.props.navigation.navigate('Login');
            } else if (json.result === Net.error.E_MANAGER_DISABLED) {
              Alert.alert(
                'ログイン失敗',
                'ログインに失敗しました. IDが許可されなかったです.',
              );
              this.props.navigation.navigate('Login');
            } else {
              GlobalState.loginStatus.accessToken = json.accessToken;
              GlobalState.shopId = json.shopData.id;
              GlobalState.shopName = json.shopData.name;
              GlobalState.start_time = json.shopData.start_time;
              GlobalState.end_time = json.shopData.end_time;
              AsyncStorage.multiSet([
                [ASYNC_PARAMS.IS_LOGIN, 'true'],
                [ASYNC_PARAMS.ACCESS_TOKEN, json.accessToken],
              ], (errors) => {
                this.props.navigation.navigate('Main');
              });
            }
          })
          .catch(err => {
            alertNetworkError(err);
          });
      } catch(e) {
        // read error
        this.props.navigation.navigate('Login');
      }
    }
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: Colors.black}}>
        <Logo />
      </View>
    );
  }
}
