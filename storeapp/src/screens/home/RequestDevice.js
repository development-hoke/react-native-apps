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

class RequestDevice extends Component {
  state = {
    name: '',
    password: '',
  };

  constructor(props) {
    super(props);
  }

  apiRegister = () => {
    requestPost(Net.auth.register_device, {
      ...this.state,
      deviceID: GlobalState.deviceId
    }).then(json => {
      if (json.result === Net.error.E_OK) {
        Alert.alert(
          '確認',
          '申し込みが成功しました。',
        );
        this.props.navigation.navigate('Login');
      }
    }).catch(err => {
      alertNetworkError(err);
    })
  }

  render() {
    return (
      <LoginTemplate>
        <Text style={styles.label}>ログインID</Text>
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
          text={'申請'}
          onPress={this.apiRegister}
        />
      </LoginTemplate>
    );
  }
}

export default RequestDevice;
