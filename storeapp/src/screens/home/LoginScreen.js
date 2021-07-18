import React, {Component} from 'react';
import {Alert, Text, TextInput, View, StyleSheet} from 'react-native';
import MyStyles from '../../constants/MyStyles';
import LoginTemplate from '../../components/loginTemplate';
import {requestPost, Net, alertNetworkError} from '../../utils/ApiUtils';
import GlobalState from '../../mobx/GlobalState';
import ButtonEx from '../../components/button/ButtonEx';
import Ripple from 'react-native-material-ripple';
import { ASYNC_PARAMS } from '../../constants/AppConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

const styles = StyleSheet.create({
  label: {
    width: 300,
    textAlign: 'left',
  },
  input: {
    width: 300,
    marginBottom: 15,
  },
  button: {
    borderWidth: 1,
    borderColor: 'black',
    width: 300,
    marginBottom: 15,
  },
});

class LoginScreen extends Component {
  state = {
    name: '',
    password: '',
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <LoginTemplate>
        <Text style={styles.label}>ID</Text>
        <TextInput
          style={[MyStyles.input, styles.input]}
          value={this.state.name}
          onChangeText={value => {
            this.setState({name: value});
          }}
        />
        <Text style={styles.label}>パスワード</Text>
        <TextInput
          minLength={8}
          style={[MyStyles.input, styles.input]}
          ref={input => {
            this.password = input;
          }}
          value={this.state.password}
          secureTextEntry={true}
          onChangeText={value => {
            this.setState({password: value});
          }}
        />
        <ButtonEx
          style={styles.button}
          type={'black'}
          text={'ログイン'}
          onPress={this.doLogin}
        />
        <Ripple style={{textAlign: 'center', marginBottom: 15, display: 'none'}}>
          <Text>メールアドレス・パスワードを忘れた方はコチラ</Text>
        </Ripple>
        <ButtonEx
          style={styles.button}
          onPress={this.doSignup}
          text={'新規店舗として申請'}
        />
        <ButtonEx
          style={styles.button}
          onPress={this.doRequest}
          text={'追加デバイスの追加'}
        />
      </LoginTemplate>
    );
  }

  doRequest = () => {
    this.props.navigation.navigate('RequestDevice');
  };

  doLogin = async () => {
    if (!this.state.name || this.state.name === '') {
      Alert.alert('ログイン', 'IDfを入力してください.');
      return;
    }
    if (!this.state.password || this.state.password === '') {
      Alert.alert('ログイン', 'パスワードを入力してください.');
      return;
    }
    const fcmToken = await messaging().getToken();
    console.log(fcmToken);
    requestPost(Net.auth.login, {
      name: this.state.name,
      password: this.state.password,
      deviceId: GlobalState.deviceId,
      fcmToken: fcmToken,
    }).then(json => {
      if (json.result === Net.error.E_LOGIN) {
        Alert.alert(
          'ログイン失敗',
          'ログインに失敗しました. 勘定情報を確認してください.',
        );
        this.setState({name: '', password: ''});
      } else if (json.result === Net.error.E_MANAGER_DISABLED) {
        Alert.alert(
          'ログイン失敗',
          'ログインに失敗しました. IDが許可されなかったです.',
        );
      } else {
        GlobalState.loginStatus.accessToken = json.accessToken;
        GlobalState.shopId = json.shopData.id;
        GlobalState.shopName = json.shopData.name;
        GlobalState.start_time = json.shopData.start_time;
        GlobalState.end_time = json.shopData.end_time;
        AsyncStorage.multiSet([
          [ASYNC_PARAMS.IS_LOGIN, 'true'],
          [ASYNC_PARAMS.ACCESS_TOKEN, json.accessToken],
          [ASYNC_PARAMS.LOGIN_ID, this.state.name],
          [ASYNC_PARAMS.LOGIN_PW, this.state.password],
          [ASYNC_PARAMS.LOGIN_DI, GlobalState.deviceId],
        ], (errors) => {
          this.props.navigation.navigate('Main');
        });
      }
    }).catch(err => {
      alertNetworkError(err);
    });
  };

  doSignup = () => {
    this.props.navigation.navigate('RegisterShop');
  };
}

export default LoginScreen;
