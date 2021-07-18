import React, {Component} from 'react';
import {AsyncStorage, View} from 'react-native';
import TextStyles from '../constants/TextStyles';
import Colors from '../constants/Colors';
import MyTextInput from '../components/input/MyTextInput';
import HeavyLabel from '../components/label/heavyLabel';
import LoginButton from '../components/button/loginButton';
import LoginTemplate from '../components/loginTemplate';
import GlobalState from '../mobx/GlobalState';
import {requestPost, Net, alertNetworkError} from '../utils/APIUtils';
import {ASYNC_PARAMS, MessageText} from '../constants/AppConstants';
import Common from '../utils/Common';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {id: null, password: null};
  }
  validateEntry = () => {
    if (this.state.id === '' || this.state.id === null) {
      Common.showToast(MessageText.IDInput);
      return false;
    }
    if (this.state.password === '' || this.state.password === null) {
      Common.showToast(MessageText.PasswordInput);
      return false;
    }
    return true;
  };
  doLogin = () => {
    if (!this.validateEntry()) return;
    requestPost(Net.auth.login, {
      id: this.state.id,
      password: this.state.password,
      deviceId: GlobalState.deviceId,
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
        Common.showToast(MessageText.LoginNoAccount);
      }
    }).catch(err => {
      alertNetworkError(err);
    });
  };
  // doSignup = () => {
  //   this.props.navigation.navigate('SMSAuthPhoneNumber');
  // };
  // handleBackPress = () => {
  //   this.interval = setTimeout(() => {
  //     this._backPress = 0;
  //     clearInterval(this.interval);
  //   }, 1000);
  //   this._backPress += 1;
  //   if (this._backPress <= 1) {
  //     Toast.show(MessageText.ExitApp, {
  //       duration: 500,
  //       backgroundColor: Colors.grey,
  //     });
  //     return true;
  //   }
  //   BackHandler.exitApp();
  // };
  // componentDidMount() {
  //   this._backPress = 0;
  //   this.navigationFocusLisener = this.props.navigation.addListener(
  //     'willFocus',
  //     () => {
  //       this.backHandler = BackHandler.addEventListener(
  //         'hardwareBackPress',
  //         this.handleBackPress,
  //       );
  //     },
  //   );
  //   this.navigationBlurListener = this.props.navigation.addListener(
  //     'willBlur',
  //     () => {
  //       this.backHandler.remove();
  //     },
  //   );
  // }
  // componentWillUnmount() {
  //   this.navigationBlurListener.remove();
  //   this.navigationFocusLisener.remove();
  //   if (this.backHandler) this.backHandler.remove();
  // }
  render() {
    return (
      <LoginTemplate noWhitePane={true}>
        <View style={{marginHorizontal: 20}}>
          <HeavyLabel label={'ID'} style={{color: Colors.white}} />
          <MyTextInput
            value={this.state.id}
            onChangeText={text => {
              this.setState({id: text});
            }}
            style={{backgroundColor: Colors.white, height: 50}}
          />
          <HeavyLabel label={'パスワード'} style={{color: Colors.white}} />
          <MyTextInput
            secureTextEntry={true}
            value={this.state.password}
            onChangeText={text => {
              this.setState({password: text});
            }}
            style={{backgroundColor: Colors.white, height: 50}}
          />
          <LoginButton
            style={{height: 60}}
            text={'ログイン'}
            buttonType={'orange'}
            textStyle={TextStyles.buttonLabel}
            onPress={this.doLogin}
          />
          <LoginButton
            onPress={() => {
              this.props.navigation.navigate('TransferCodeLogin');
            }}
            style={{marginTop: 50, marginBottom: 30, height: 60}}
            textStyle={TextStyles.buttonLabel}
            text={'引き継ぎコード入力'}
            buttonType={'white'}
          />
        </View>
      </LoginTemplate>
    );
  }
}
export default LoginScreen;
