import React, {Component} from 'react';
import {Text, TextInput, View, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import HeavyLabel from '../../components/label/heavyLabel';
import Colors from '../../constants/Colors';
import TextStyles from '../../constants/TextStyles';
import Ripple from 'react-native-material-ripple';
import CheckBox from '../../components/button/CheckBox';
import LoginButton from '../../components/button/loginButton';
import LoginTemplate from '../../components/loginTemplate';
import {requestPost, Net, alertNetworkError} from '../../utils/APIUtils';
import {ASYNC_PARAMS, MessageText} from '../../constants/AppConstants';
import GlobalState from '../../mobx/GlobalState';

export default class MemberRegisterConfirm extends Component {
  constructor(props) {
    super(props);
    this.state = {data: this.props.navigation.state.params.passParam};
    // GlobalState.myInfo = {
    //   firstName: this.state.data.firstName,
    //   lastName: this.state.data.lastName,
    //   japanese_lastName: this.state.data.japanese_lastName,
    //   japanese_firstName: this.state.data.japanese_firstName,
    //   phoneNumber: this.state.data.phoneNumber,
    //   fax: this.state.data.fax,
    //   email: this.state.data.email,
    //   password: this.state.data.password,
    //   birthDate: this.state.data.birthDate,
    //   device_id: GlobalState.deviceId,
    // };
  }
  onSignUp = () => {
    requestPost(Net.auth.signup, {
      memberInfo: this.state.data,
      isUpdate: this.props.navigation.state.params.isUpdate ? true : false,
      member_no: GlobalState.myInfo ? GlobalState.myInfo.member_no : null,
    })
      .then(json => {
        if (json.result !== Net.error.E_OK) {
          alertNetworkError();
        } else if (json.result === Net.error.E_MEMBER_ALREADY_EXIST) {
          Alert.alert(
            MessageText.DuplicateAccount_Title,
            MessageText.DuplicateAccount_Content,
          );
          return;
        } else {
          AsyncStorage.setItem(
            ASYNC_PARAMS.ACCESS_TOKEN,
            json.accessToken,
            () => {
              AsyncStorage.getItem(ASYNC_PARAMS.IS_LOGIN, (error, result) => {
                if (result) {
                  this.props.navigation.navigate('RegisterFinish');
                } else {
                  this.props.navigation.navigate('AgreePolicy', {
                    passParam: {
                      email: GlobalState.myInfo.email,
                      password: GlobalState.myInfo.password,
                    },
                  });
                }
              });
            },
          );
        }
      })
      .catch(err => {
        alertNetworkError(err);
      });
  };
  render() {
    return (
      <LoginTemplate header={'お客様情報登録確認'}>
        <View style={{paddingHorizontal: 15}}>
          <HeavyLabel
            label={
              '【氏名】' +
              this.state.data.firstName +
              '\t\t\t' +
              this.state.data.lastName
            }
            style={{marginBottom: 5}}
          />
          <HeavyLabel
            label={
              '【ふりがな】' +
              this.state.data.japanese_firstName +
              '\t\t\t' +
              this.state.data.japanese_lastName
            }
            style={{marginBottom: 5}}
          />
          <HeavyLabel
            label={'【生年月日】' + this.state.data.birthDate}
            style={{marginBottom: 5}}
          />
          <HeavyLabel
            label={'【郵便番号】' + this.state.data.fax}
            style={{marginBottom: 5}}
          />
          <HeavyLabel
            label={'【電話番号】' + this.state.data.phoneNumber}
            style={{marginBottom: 5}}
          />
          <HeavyLabel label={'【メールアドレス】'} style={{marginBottom: 5}} />
          <HeavyLabel
            label={this.state.data.email}
            style={[
              {marginBottom: 5, color: Colors.blue},
              TextStyles.underline,
            ]}
          />
          <HeavyLabel label={'【パスワード】'} style={{marginBottom: 5}} />
          <HeavyLabel label={'●'.repeat(this.state.data.password.length)} />
          <CheckBox
            isActive={true}
            disabled={true}
            style={{marginTop: 10}}
            checkBoxSize={40}
            label={
              '利用規約とプライバシーポリシーにご同意の上、利用開始してください。'
            }
          />
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Ripple
              onPress={() => {
                this.props.navigation.goBack();
              }}>
              <Text
                style={[
                  TextStyles.bold,
                  TextStyles.underline,
                  {fontSize: 16, marginTop: 10},
                ]}>
                編集する
              </Text>
            </Ripple>
          </View>
          <LoginButton
            onPress={this.onSignUp}
            buttonType={'black'}
            border={{borderWidth: 2, borderColor: Colors.orange}}
            style={{height: 60, marginBottom: 20, marginTop: 10}}
            textStyle={TextStyles.buttonLabel}
            text={'登録'}
          />
        </View>
      </LoginTemplate>
    );
  }
}
