import React, {Component} from 'react';
import {AsyncStorage, View} from 'react-native';
import TextStyles from '../constants/TextStyles';
import Colors from '../constants/Colors';
import MyTextInput from '../components/input/MyTextInput';
import HeavyLabel from '../components/label/heavyLabel';
import LoginButton from '../components/button/loginButton';
import LoginTemplate from '../components/loginTemplate';
import {requestPost, Net, alertNetworkError} from '../utils/APIUtils';
import {ASYNC_PARAMS, MessageText} from '../constants/AppConstants';
import Common from '../utils/Common';

class TransferCodeLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {transferCode: null};
  }
  validateEntry = () => {
    if (this.state.transferCode === '' || this.state.transferCode === null) {
      Common.showToast(MessageText.TransferCoceInput);
      return false;
    }
    return true;
  };
  doLogin = () => {
    if (!this.validateEntry()) return;
    requestPost(Net.auth.login, {
      transferCode: this.state.transferCode,
    }).then(json => {
      if (json.result === Net.error.E_OK) {
        AsyncStorage.setItem(ASYNC_PARAMS.IS_LOGIN, 'true', () => {
          AsyncStorage.setItem(
            ASYNC_PARAMS.ACCESS_TOKEN,
            json.accessToken,
            () => {
              AsyncStorage.setItem(
                ASYNC_PARAMS.MY_INFO,
                JSON.stringify(json.account),
                () => {
                  this.props.navigation.navigate('Main');
                },
              );
            },
          );
        });
        AsyncStorage.setItem(ASYNC_PARAMS.IS_SECOND, 'true');
      } else if (json.result === Net.error.E_LOGIN) {
        Common.showToast(MessageText.TransferCodeLoginNoAccount);
      }
    }).catch(err => {
      alertNetworkError(err);
    });
  };
  render() {
    return (
      <LoginTemplate noWhitePane={true}>
        <View style={{marginHorizontal: 20}}>
          <HeavyLabel label={'引き継ぎコード'} style={{color: Colors.white}} />
          <MyTextInput
            value={this.state.transferCode}
            onChangeText={text => {
              this.setState({transferCode: text});
            }}
            style={{backgroundColor: Colors.white, height: 50}}
          />
          <LoginButton
            onPress={this.doLogin}
            style={{marginTop: 50, marginBottom: 30, height: 60}}
            textStyle={TextStyles.buttonLabel}
            text={'ログイン'}
            buttonType={'orange'}
          />
        </View>
      </LoginTemplate>
    );
  }
}
export default TransferCodeLogin;
