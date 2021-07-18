/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {View, ActivityIndicator} from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import GlobalState from './src/mobx/GlobalState';
import {observer} from 'mobx-react'
import messaging from '@react-native-firebase/messaging';

@observer
class App extends Component {
  constructor(props) {
    super(props);
    this.state={
      fcmToken: '',
    }
  }

  componentDidMount() {
    this.getToken();
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });
    messaging().onMessage(async remoteMessage => {
      console.log('Message handled in the foreground!', JSON.stringify(remoteMessage));
    });
    messaging().getInitialNotification().then(remoteMessage => {
      // console.log(
      //   'Notification caused app to open from quit state:',
      //   remoteMessage.notification,
      // );
    });
  }

  async getToken() {
    await messaging().registerDeviceForRemoteMessages();
    const fcmToken = await messaging().getToken();
  }

  render() {
    return (
      <View style={{width: '100%', height: '100%'}}>
        <AppNavigator />
        {GlobalState.isLoading ? (
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'transparent',
            }}>
            <ActivityIndicator
              style={{backgroundColor: 'transparent'}}
              size="large"
              color="#aaa"
            />
          </View>
        ) : null}
       </View>
    );
  }
}

export default App;
