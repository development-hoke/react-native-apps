import React, {Component} from 'react';
import {View, TextInput, Text, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import Colors from '../../constants/Colors';
import TextStyles from '../../constants/TextStyles';
import Ripple from 'react-native-material-ripple';
import CheckBox from '../../components/button/CheckBox';
import Toast from 'react-native-root-toast';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const moment = require('moment');
import 'moment/min/locales';
import ButtonEx from '../../components/button/ButtonEx';
import MyStyles from '../../constants/MyStyles';
import MainLayout from '../../components/container/MainLayout';
import {alertNetworkError, Net, requestPost} from '../../utils/ApiUtils';

const styles = StyleSheet.create({
  input: {
    color: 'black',
    borderColor: Colors.black,
    borderWidth: 1,
    height: 30,
    paddingTop: 0,
    paddingBottom: 0,
    flex: 1,
    marginRight: 10,
  },
});

export default class MemberRegister extends Component {
  constructor(props) {
    super(props);
    moment.locale('ko');
    this.state = {
      first_name: '',
      last_name: '',
      first_huri: '',
      last_huri: '',
      birthDate: '',
      birthYear: '',
      birthMonth: '',
      birthDay: '',
      fax: '',
      tel_no: '',
      email: '',
      password: '',
      confirmPassword: '',
      member_no: '',
      pwd_valid: false,
      pwd_confirm_valid: false,
      showDatePicker: false,
    };
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
      this.state.first_name === '' ||
      this.state.last_name === '' ||
      this.state.first_huri === '' ||
      this.state.last_huri === '' ||
      this.state.fax === '' ||
      this.state.tel_no === '' ||
      this.state.email === '' ||
      this.state.birthDate === ''
    ) {
      Toast.show('全体入力項目たちを満たしてください。', {position: 10});
      return false;
    }
    if (this.validateEmail(this.state.email) == false) {
      Toast.show('メール形式が当たらないです。');
      this.emailTextInput.focus();
      return false;
    }
    if (this.validatePwd(this.state.password) == false) {
      Toast.show('パスワードを確認してください。');
      this.pwdTextInput.focus();
      return false;
    }
    if (this.validatePwdConfirm(this.state.confirmPassword) == false) {
      Toast.show('パスワードを確認してください。');
      this.pwdConfirmTextInput.focus();
      return false;
    }
    return true;
  };
  goNext = () => {
    if (this.checkValidation()) {
      requestPost(Net.member.register, {
        id: this.props.navigation.state.params.memberId,
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        first_huri: this.state.first_huri,
        last_huri: this.state.last_huri,
        birthday: this.state.birthDate,
        tel_no: this.state.tel_no,
        fax: this.state.fax,
        email: this.state.email,
      })
        .then(json => {
          if (this.props.navigation.state.params.memberId === 0) {
            this.props.navigation.navigate('MemberSearch');
          } else {
            this.props.navigation.navigate('MemberDetail');
          }
        })
        .catch(err => {
          alertNetworkError(err);
        });
    }
  };

  componentDidMount() {
    if (this.props.navigation.state.params.memberId !== 0)
    {
      let memberData = this.props.navigation.state.params.memberData;
      this.setState({
        first_name: memberData.first_name,
        last_name: memberData.last_name,
        first_huri: memberData.first_huri,
        last_huri: memberData.last_huri,
        birthDate: memberData.birthday,
        tel_no: memberData.tel_no,
        fax: memberData.fax,
        email: memberData.email,
        birthYear: moment(memberData.birthday).format('YYYY'),
        birthMonth: moment(memberData.birthday).format('MM'),
        birthDay: moment(memberData.birthday).format('DD'),
      });
    }
  }
  render() {
    return (
      <MainLayout
        title={'会員登録'}
        homeCallback={() => this.props.navigation.navigate('Main')}>
        <ScrollView style={{marginHorizontal: 30}}>
          <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
            <Text style={{marginRight: 5}}>氏名(性)</Text>
            <TextInput
              style={[styles.input]}
              value={this.state.first_name}
              onChangeText={text => {
                this.setState({first_name: text});
              }}
            />
            <TextInput
              style={[styles.input]}
              value={this.state.last_name}
              onChangeText={text => {
                this.setState({last_name: text});
              }}
            />
            <Text style={{marginLeft: 15, marginRight: 5}}>ふりがな</Text>
            <TextInput
              style={[styles.input]}
              value={this.state.first_huri}
              onChangeText={text => {
                this.setState({first_huri: text});
              }}
            />
            <TextInput
              style={[styles.input]}
              value={this.state.last_huri}
              onChangeText={text => {
                this.setState({last_huri: text});
              }}
            />
            <Text style={{marginLeft: 15, marginRight: 5}}>生年月日</Text>
            <Ripple
              onPress={() => {
                this.setState({showDatePicker: true});
              }}
              style={{flex: 4, marginRight: 10}}
            >
              <View
                style={{
                  height: 30,
                  paddingHorizontal: 20,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: Colors.black,
                }}>
                <TextInput
                  editable={false}
                  style={[{paddingVertical: 0, flex: 3, color: Colors.black, textAlign: 'center'}]}
                  value={this.state.birthYear}
                />
                <Text style={{marginHorizontal: 5}}>
                  年
                </Text>
                <TextInput
                  editable={false}
                  style={[{paddingVertical: 0, flex: 2, color: Colors.black, textAlign: 'center'}]}
                  value={this.state.birthMonth}
                />
                <Text style={{marginHorizontal: 5}}>
                  月
                </Text>
                <TextInput
                  editable={false}
                  style={[{paddingVertical: 0, flex: 2, color: Colors.black, textAlign: 'center'}]}
                  value={this.state.birthDay}
                />
                <Text style={{marginHorizontal: 5}}>
                  日
                </Text>
              </View>
            </Ripple>
          </View>

          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 15}}>
            <Text style={{marginRight: 5}}>郵便番号</Text>
            <TextInput
              style={[styles.input]}
              keyboardType={'numeric'}
              value={this.state.fax}
              onChangeText={text => {
                this.setState({fax: text});
              }}
            />
            <Text style={{marginLeft: 15, marginRight: 5}}>電話番号</Text>
            <TextInput
              style={[styles.input]}
              keyboardType={'numeric'}
              value={this.state.tel_no}
              onChangeText={text => {
                this.setState({tel_no: text});
              }}
            />
          </View>
          <View style={{flex: 1, marginTop: 15}}>
            <Text style={{marginRight: 5}}>メールアドレス (※ドメイン ●●●●●●●●●●●●●●●●.ne.jp から
              メールを受信できるように設定をお願いします。)</Text>
            <TextInput
              style={[styles.input, {marginTop: 10}]}
              ref={ref => {
                this.emailTextInput = ref;
              }}
              value={this.state.email}
              onChangeText={text => {
                this.setState({email: text});
              }}
              keyboardType={'email-address'}
            />
          </View>
          <View style={{flex: 1, marginTop: 20}}>
            <Text>パスワード (※8文字以上の英数字)</Text>
            <TextInput
              style={[styles.input, {marginTop: 10}]}
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
          <View style={{flex: 1, marginTop: 10}}>
            <Text>パスワード(再度入力)</Text>
            <TextInput
              ref={ref => {
                this.pwdConfirmTextInput = ref;
              }}
              style={[styles.input, {marginTop: 10}]}
              secureTextEntry={true}
              value={this.state.confirmPassword}
              onChangeText={text => {
                this.setState({confirmPassword: text});
                this.validatePwdConfirm(text);
              }}
            />
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <ButtonEx
              onPress={this.goNext}
              type={'primary'}
              style={{height: 40, width: 100, marginVertical: 10}}
              text={'確認'}
            />
          </View>
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
        </ScrollView>
      </MainLayout>
    );
  }
}
