import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import LoginTemplate from '../components/loginTemplate';
import MyStyles from '../constants/MyStyles';
import TextStyles from '../constants/TextStyles';
import LoginButton from '../components/button/loginButton';
import Colors from '../constants/Colors';
import CheckBox from '../components/button/CheckBox';
import Ripple from 'react-native-material-ripple';
import {requestPost, Net, alertNetworkError} from '../utils/APIUtils';
import Toast from 'react-native-root-toast';
import {ASYNC_PARAMS, EXTERNAL_URL, MessageText, SCREEN_HEIGHT} from '../constants/AppConstants';
import GlobalState from '../mobx/GlobalState';
import { ScrollView } from 'react-native';
import WebView from 'react-native-webview';
import HTMLView from 'react-native-htmlview';

export default class AgreePolicyScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      license: '',
      useLicense: '',
      privacyLicense: '',
      isActive_use: true,
      isActive_privacy: false,
      allowPrivacy: true,
    };
  }
  componentDidMount(): void {
    this.loadData();
    if (this.props.navigation.state.params) {
      if (this.props.navigation.state.params.isUse) {
        this.showLicense();
      }
      if (this.props.navigation.state.params.isPrivacy) {
        this.showPrivacy();
      }
    } else {
      this.showLicense();
    }
    console.log(`${EXTERNAL_URL}terms_of_use`);
  }

  loadData = () => {
    requestPost(Net.auth.getLicense)
      .then(json => {
        if (json.result !== Net.error.E_OK) {
          alertNetworkError();
        } else {
          this.setState({
            useLicense: json.license['policy'],
            privacyLicense: json.license['privacy'],
            license: json.license['policy'],
          });
        }
      })
      .catch(err => {
        alertNetworkError(err);
      });
  };
  toggle = () => {
    this.setState({
      allowPrivacy: !this.state.allowPrivacy,
    });
  };
  showPrivacy = () => {
    this.setState({
      license: this.state.privacyLicense,
      isActive_privacy: true,
      isActive_use: false,
    });
  };
  showLicense = () => {
    this.setState({
      license: this.state.useLicense,
      isActive_privacy: false,
      isActive_use: true,
    });
  };
  createAccount = () => {
    if (this.state.agreePolicy) {
      requestPost(Net.auth.createAccount, {
        shop: GlobalState.myShop,
        device_id: GlobalState.deviceId,
        fcm_token: GlobalState.fcmToken,
      })
        .then(json => {
          if (json.result === Net.error.E_OK) {
            GlobalState.myInfo = {
              member_no: json.member_no,
              password: json.password,
              id: json.id,
            };
            AsyncStorage.setItem(ASYNC_PARAMS.ACCESS_TOKEN, json.accessToken);
            AsyncStorage.setItem(
              ASYNC_PARAMS.MY_INFO,
              JSON.stringify(GlobalState.myInfo),
            );
            AsyncStorage.setItem(ASYNC_PARAMS.IS_SECOND, 'true');
            AsyncStorage.setItem(ASYNC_PARAMS.IS_LOGIN, 'true', () => {
              this.props.navigation.navigate('MyMain');
            });
            // AsyncStorage.setItem(
            //   ASYNC_PARAMS.MY_SHOP_ID,
            //   GlobalState.myShop.toString(),
            // );
          }
        })
        .catch(err => {
          alertNetworkError(err);
        });
    } else {
      Toast.show(MessageText.AgreeLicense, {position: Toast.positions.BOTTOM});
    }
  };
  goMain = () => {
    if (this.state.agreePolicy) {
      requestPost(Net.auth.login, {
        email: this.props.navigation.state.params.passParam.email,
        password: this.props.navigation.state.params.passParam.password,
      }).then(json => {
        AsyncStorage.setItem(
          ASYNC_PARAMS.MY_INFO,
          JSON.stringify(json.account),
        );
        AsyncStorage.setItem(ASYNC_PARAMS.IS_LOGIN, 'true', () => {
          this.props.navigation.navigate('Main');
        });
      }).catch(err => {
        alertNetworkError(err);
      });
    } else {
      Toast.show(MessageText.AgreeLicense, {position: Toast.positions.BOTTOM});
    }
  };
  render() {
    return (
      <LoginTemplate
        closeButton={this.props.navigation.state.params ? true : false}
        header={'下記の利用規約をご確認ください。'}
        headerStyle={[
          TextStyles.settingItemText,
          {lineHeight: 50, letterSpacing: 0},
        ]}>
        <ScrollView
          style={[
            MyStyles.blackBorder,
            {
              paddingVertical: 5, 
              paddingHorizontal: 20, 
              height: SCREEN_HEIGHT * 0.43,
            },
          ]}>
          {this.state.isActive_use ? (
            <Text style={TextStyles.bold}>-利用規約-</Text>
          ) : null}
          {this.state.isActive_privacy ? (
            <Text style={TextStyles.bold}>-プライバシーポリシー-</Text>
          ) : null}
          {/* <Text>{this.state.license}</Text> */}
          {/* <WebView 
            source={{ html: this.state.license }} 
          /> */}
          <HTMLView value={this.state.license} />
        </ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <View style={{display: 'none'}}>
            <View>
              <Ripple onPress={this.showLicense}>
                <Text
                  style={[
                    TextStyles.normalText,
                    TextStyles.underline,
                    !this.state.isActive_use && {color: Colors.grey},
                  ]}>
                  利用規約
                </Text>
              </Ripple>
            </View>
            <View>
              <Ripple onPress={this.showPrivacy}>
                <Text
                  style={[
                    TextStyles.normalText,
                    TextStyles.underline,
                    !this.state.isActive_privacy && {color: Colors.grey},
                  ]}>
                  プライバシーポリシー
                </Text>
              </Ripple>
            </View>
          </View>
        </View>
        {!this.props.navigation.state.params ? (
          <View>
            <View style={{alignItems: 'center'}}>
              <CheckBox
                onPress={checked => {
                  this.setState({agreePolicy: checked});
                }}
                style={{marginTop: 5, alignItems: 'center'}}
                checkBoxSize={20}
                label={'利用規約に同意する'}
                textStyle={[TextStyles.buttonLabel, {fontWeight: 'normal'}]}
              />
            </View>
            <LoginButton
              style={{marginBottom: 30, height: 80, marginTop: 10}}
              textStyle={TextStyles.largeText}
              text={'利用開始'}
              onPress={this.createAccount}
            />
          </View>
        ) : null}
      </LoginTemplate>
    );
  }
}
