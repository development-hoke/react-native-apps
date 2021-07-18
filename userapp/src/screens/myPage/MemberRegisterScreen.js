import React, {Component} from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import LoginTemplate from '../../components/loginTemplate';
import HeavyLabel from '../../components/label/heavyLabel';
import Colors from '../../constants/Colors';
import TextStyles from '../../constants/TextStyles';
import Ripple from 'react-native-material-ripple';
import CheckBox from '../../components/button/CheckBox';
import LoginButton from '../../components/button/loginButton';
import Toast from 'react-native-root-toast';
import MyStyles from '../../constants/MyStyles';
import {ASYNC_PARAMS} from '../../constants/AppConstants';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Common from '../../utils/Common';

const moment = require('moment');
import 'moment/min/locales';
import GlobalState from '../../mobx/GlobalState';

export default class MemberRegister extends Component {
  constructor(props) {
    super(props);
    moment.locale('ko');
    this.state = {
      firstName: '',
      lastName: '',
      japanese_firstName: '',
      japanese_lastName: '',
      birthDate: '',
      birthYear: '',
      birthMonth: '',
      birthDay: '',
      fax: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreePolicy: false,
      pwd_valid: false,
      pwd_confirm_valid: false,
      showDatePicker: false,
      device_id: GlobalState.deviceId,
    };
  }
  componentDidMount(): void {
    let tmp = false;
    AsyncStorage.getItem(ASYNC_PARAMS.IS_LOGIN, (error, result) => {
      if (result) tmp = true;
      this.setState({showLicense: tmp});
    });
    if (GlobalState.myInfo) {
      this.setState({
        firstName: GlobalState.myInfo.first_name,
        lastName: GlobalState.myInfo.last_name,
        japanese_firstName: GlobalState.myInfo.first_huri,
        japanese_lastName: GlobalState.myInfo.last_huri,
        birthDate: GlobalState.myInfo.birthday,
        birthYear: new Date(GlobalState.myInfo.birthday).getFullYear().toString(),
        birthMonth: (new Date(GlobalState.myInfo.birthday).getMonth() + 1).toString(),
        birthDay: (new Date(GlobalState.myInfo.birthday).getDate() + 1).toString(),
        fax: GlobalState.myInfo.fax,
        phoneNumber: GlobalState.myInfo.tel_no,
        email: GlobalState.myInfo.email,
        password: GlobalState.myInfo.password,
        confirmPassword: GlobalState.myInfo.password,
      });
    }
  }

  validateEmail = email => {
    const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    if (expression.test(String(email).toLowerCase())) {
      this.setState({email_valid: true});
      return true;
    } else {
      this.setState({email_valid: false});
      return false;
    }
  };

  validatePwd = password => {
    // 8~16자리의 영문, 숫자, 특수문자 2문자 조합 검사
    const expression = /^(?=.*\d)(?=.*[a-zA-Z!@#$&*])[a-zA-Z0-9!@#$&*]{8,16}$/;
    if (expression.test(String(password).toLowerCase())) {
      this.setState({pwd_valid: true});
      return true;
    } else {
      this.setState({pwd_valid: false});
      return false;
    }
  };
  validatePwdConfirm = confirm_pwd => {
    if (this.state.password == confirm_pwd && this.state.pwd_valid) {
      this.setState({pwd_confirm_valid: true});
      return true;
    } else {
      this.setState({pwd_confirm_valid: false});
      return false;
    }
  };

  checkValidation = () => {
    if (
      this.state.firstName === '' ||
      this.state.lastName === '' ||
      this.state.japanese_firstName === '' ||
      this.state.japanese_lastName === '' ||
      this.state.fax === '' ||
      this.state.phoneNumber === '' ||
      this.state.email === '' ||
      this.state.birthDate === ''
    ) {
      Common.showToast('모든 입력마당들을 채워주세요.');
      return false;
    }
    if (this.state.showLicense && !this.state.agreePolicy) {
      Common.showToast('이용규약과 프라이버시폴리시에 동의해주세요.');
      return false;
    }
    if (this.validateEmail(this.state.email) == false) {
      Common.showToast('이메일 형식이 맞지 않습니다.');
      this.emailTextInput.focus();
      return false;
    }
    if (this.validatePwd(this.state.password) == false) {
      Common.showToast('비밀번호를 확인해주세요.');
      this.pwdTextInput.focus();
      return false;
    }
    if (this.validatePwdConfirm(this.state.confirmPassword) == false) {
      Common.showToast('비밀번호를 확인해주세요.');
      this.pwdConfirmTextInput.focus();
      return false;
    }
    return true;
  };
  goNext = () => {
    if (this.checkValidation()) {
      if (this.state.showLicense) {
        this.props.navigation.navigate('MemberRegisterConfirm', {
          passParam: this.state,
          isUpdate: true,
        });
      } else {
        this.props.navigation.navigate('SignupConfirm', {
          passParam: this.state,
        });
      }
    }
  };
  render() {
    return (
      <LoginTemplate
        closeButton={true}
        header={
          'ハルトコーテイングアプリ会員に本登録\n' +
          '下記のお客様情報を登録してください。'
        }>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1, paddingRight: 15}}>
            <HeavyLabel label={'氏名(性)'} />
            <TextInput
              style={styles.textInput}
              value={this.state.firstName}
              onChangeText={text => {
                this.setState({firstName: text});
              }}
            />
          </View>
          <View style={{flex: 1, paddingLeft: 15}}>
            <HeavyLabel label={'(名)'} />
            <TextInput
              style={styles.textInput}
              value={this.state.lastName}
              onChangeText={text => {
                this.setState({lastName: text});
              }}
            />
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1, paddingRight: 15}}>
            <HeavyLabel label={'ふりがな'} />
            <TextInput
              style={styles.textInput}
              value={this.state.japanese_firstName}
              onChangeText={text => {
                this.setState({japanese_firstName: text});
              }}
            />
          </View>
          <View style={{flex: 1, paddingLeft: 15}}>
            <HeavyLabel label={''} />
            <TextInput
              style={styles.textInput}
              value={this.state.japanese_lastName}
              onChangeText={text => {
                this.setState({japanese_lastName: text});
              }}
            />
          </View>
        </View>
        <Ripple
          onPress={() => {
            this.setState({showDatePicker: true});
          }}>
          <HeavyLabel label={'生年月日'} />
          <View
            style={{
              height: 50,
              paddingHorizontal: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderWidth: 3,
              borderColor: Colors.black,
            }}>
            <TextInput
              editable={false}
              style={[{flex: 3, color: Colors.black, textAlign: 'center'}]}
              value={this.state.birthYear}
            />
            <Text style={[TextStyles.normalText, {marginHorizontal: 5}]}>
              年
            </Text>
            <TextInput
              editable={false}
              style={[{flex: 2, color: Colors.black, textAlign: 'center'}]}
              value={this.state.birthMonth}
            />
            <Text style={[TextStyles.normalText, {marginHorizontal: 5}]}>
              月
            </Text>
            <TextInput
              editable={false}
              style={[{flex: 2, color: Colors.black, textAlign: 'center'}]}
              value={this.state.birthDay}
            />
            <Text style={[TextStyles.normalText, {marginHorizontal: 5}]}>
              日
            </Text>
          </View>
        </Ripple>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
          <HeavyLabel label={'郵便番号'} style={{marginRight: 10}} />
          <TextInput
            style={[{width: '50%'}, styles.textInput]}
            keyboardType={'numeric'}
            value={this.state.fax}
            onChangeText={text => {
              this.setState({fax: text});
            }}
          />
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
          <HeavyLabel label={'電話番号'} style={{marginRight: 10}} />
          <TextInput
            style={[{flex: 1}, styles.textInput]}
            keyboardType={'numeric'}
            value={this.state.phoneNumber}
            onChangeText={text => {
              this.setState({phoneNumber: text});
            }}
          />
        </View>
        <View style={{flex: 1, marginTop: 10}}>
          <HeavyLabel label={'メールアドレス'} />
          <TextInput
            style={[styles.textInput, {marginBottom: 0}]}
            ref={ref => {
              this.emailTextInput = ref;
            }}
            value={this.state.email}
            onChangeText={text => {
              this.setState({email: text});
            }}
            keyboardType={'email-address'}
          />
          <Text style={styles.infoText}>
            ※ドメイン ●●●●●●●●●●●●●●●●.ne.jp から
            メールを受信できるように設定をお願いします。
          </Text>
        </View>
        <View style={{marginTop: 10}}>
          <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
            <HeavyLabel
              label={'パスワード'}
              style={{marginRight: 10, flex: 1}}
            />
            <Text style={[styles.infoText, {flex: 1}]}>※8文字以上の英数字</Text>
          </View>
          <TextInput
            style={[styles.textInput, {flex: 1}]}
            ref={ref => {
              this.pwdTextInput = ref;
            }}
            secureTextEntry={true}
            value={this.state.password}
            onChangeText={text => {
              this.setState({password: text});
              this.validatePwd(text);
            }}
          />
        </View>
        <View style={{marginTop: 10}}>
          <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
            <HeavyLabel
              label={'パスワード(再度入力)'}
              style={{marginRight: 10, flex: 1}}
            />
          </View>
          <TextInput
            ref={ref => {
              this.pwdConfirmTextInput = ref;
            }}
            style={[styles.textInput, {flex: 1}]}
            secureTextEntry={true}
            value={this.state.confirmPassword}
            onChangeText={text => {
              this.setState({confirmPassword: text});
              this.validatePwdConfirm(text);
            }}
          />
        </View>
        {this.state.showLicense ? (
          <View>
            <View
              style={{
                marginTop: 10,
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              <View>
                <Ripple
                  onPress={() => {
                    this.props.navigation.navigate('UsePolicyLicense', {
                      isUse: true,
                    });
                  }}>
                  <Text style={[TextStyles.normalText, TextStyles.underline]}>
                    利用規約
                  </Text>
                </Ripple>
              </View>
              <View>
                <Ripple
                  onPress={() => {
                    this.props.navigation.navigate('UsePolicyLicense', {
                      isPrivacy: true,
                    });
                  }}>
                  <Text style={[TextStyles.normalText, TextStyles.underline]}>
                    プライバシーポリシー
                  </Text>
                </Ripple>
              </View>
            </View>
            <CheckBox
              onPress={isChecked => {
                this.setState({agreePolicy: isChecked});
              }}
              style={{marginTop: 10}}
              checkBoxSize={40}
              label={
                '利用規約とプライバシーポリシーにご同意の上、利用開始してください。'
              }
            />
          </View>
        ) : null}
        <LoginButton
          onPress={this.goNext}
          buttonType={'black'}
          border={{borderWidth: 2, borderColor: Colors.orange}}
          style={{height: 60, marginBottom: 20}}
          textStyle={TextStyles.buttonLabel}
          text={'確認画面へ'}
        />
        <DateTimePickerModal
          isVisible={this.state.showDatePicker}
          mode="date"
          onConfirm={date => {
            this.setState({
              showDatePicker: false,
              birthDate: moment(date).format('YYYY/MM/DD'),
              birthYear: moment(date).format('YYYY'),
              birthMonth: moment(date).format('MM'),
              birthDay: moment(date).format('DD'),
            });
          }}
          onCancel={() => {
            this.setState({showDatePicker: false});
          }}
        />
      </LoginTemplate>
    );
  }
}

const styles = StyleSheet.create({
  infoText: {
    lineHeight: 24,
    paddingHorizontal: 5,
  },
  textInput: {
    borderWidth: 3,
    borderColor: Colors.black,
    height: 40,
    paddingStart: 10,
    paddingEnd: 10,
    marginBottom: 10,
  },
});
