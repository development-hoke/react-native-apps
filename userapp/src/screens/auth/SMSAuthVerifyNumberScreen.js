import React, {Component} from 'react';
import LoginTemplate from '../../components/loginTemplate';
import HeavyLabel from '../../components/label/heavyLabel';
import MyTextInput from '../../components/input/MyTextInput';
import LoginButton from '../../components/button/loginButton';
import TextStyles from '../../constants/TextStyles';
import {Alert} from 'react-native';
import GlobalState from '../../mobx/GlobalState';
import {requestPost, Net, alertNetworkError} from '../../utils/APIUtils';
import {IS_DEV_MODE, MessageText} from '../../constants/AppConstants';
import {observer} from 'mobx-react';

@observer
class SMSAuthVerifyNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {verifyNum: null};
  }
  onVerifyNumber = () => {
    if (!this.state.verifyNum || this.state.verifyNum === '') {
      Alert.alert(
        MessageText.WarningDialog_Title,
        MessageText.VerifyNumberInput,
      );
      return;
    }
    requestPost(Net.auth.confirmVerifyNumber, {
      phoneNumber: GlobalState.phoneNumber,
      verifyNumber: this.state.verifyNum,
      forgotAccount: GlobalState.forgotAccount,
    })
      .then(json => {
        if (json.result !== Net.error.E_OK) {
          alertNetworkError();
        } else {
          if (json.isMatch === Net.error.E_OK) {
            this.props.navigation.pop(2);
            if (!GlobalState.forgotAccount) {
              this.props.navigation.navigate('Signup');
            } else {
              if (IS_DEV_MODE) {
                Alert.alert('암호재설정 URL은' + json.resetURL + '입니다.');
              }
            }
          } else {
            Alert.alert(
              MessageText.WarningDialog_Title,
              MessageText.VerifyNumber_NoMatch,
            );
          }
        }
      })
      .catch(err => {
        alertNetworkError(err);
      });
  };
  componentDidMount() {
    if (IS_DEV_MODE) {
      Alert.alert('Test Alert', GlobalState.verifyNumber);
    }
  }
  render() {
    return (
      <LoginTemplate closeButton={true}>
        <HeavyLabel
          label={MessageText.VerifyNumberInput}
          style={{marginBottom: 20}}
        />
        <MyTextInput
          keyboardType={'numeric'}
          value={this.state.verifyNum}
          onChangeText={text => {
            this.setState({verifyNum: text});
          }}
        />
        <LoginButton
          onPress={this.onVerifyNumber}
          buttonType={'black'}
          style={{height: 60, marginTop: 150}}
          textStyle={[TextStyles.buttonLabel]}
          text={'Confirm'}
        />
      </LoginTemplate>
    );
  }
}

export default SMSAuthVerifyNumber;
