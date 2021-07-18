import React, {Component} from 'react';
import LoginTemplate from '../../components/loginTemplate';
import HeavyLabel from '../../components/label/heavyLabel';
import MyTextInput from '../../components/input/MyTextInput';
import LoginButton from '../../components/button/loginButton';
import TextStyles from '../../constants/TextStyles';
import {Alert, View} from 'react-native';
import {requestPost, Net, alertNetworkError} from '../../utils/APIUtils';
import GlobalState from '../../mobx/GlobalState';
import {MessageText} from '../../constants/AppConstants';
import {observer} from 'mobx-react';

@observer
class SMSAuthPhoneNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {phoneNum: null};
  }
  sendPhoneNumber = () => {
    if (!this.state.phoneNum || this.state.phoneNum === '') {
      Alert.alert(MessageText.ErrorDialog_Title, MessageText.PhoneNumberInput);
      return;
    }
    GlobalState.isLoading = true;
    requestPost(Net.auth.sendVerifyNumber, {
      phoneNumber: this.state.phoneNum,
      forgotAccount: GlobalState.forgotAccount,
    })
      .then(json => {
        if (json.result === Net.error.E_INTERNAL) {
          Alert.alert(MessageText.NoMemberHasPhoneExist);
        } else {
          GlobalState.verifyNumber = json.verifyNumber;
          GlobalState.phoneNumber = this.state.phoneNum;
          this.props.navigation.navigate('SMSAuthVerifyNumber');
        }
      })
      .catch(err => {
        alertNetworkError(err);
      });
  };
  render() {
    return (
      <LoginTemplate closeButton={true}>
        <HeavyLabel
          label={MessageText.PhoneNumberInput}
          style={{marginBottom: 20}}
        />
        <MyTextInput
          keyboardType={'numeric'}
          value={this.state.phoneNum}
          onChangeText={text => {
            this.setState({phoneNum: text});
          }}
        />
        <View
          behavior={'height'}
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            marginBottom: 20,
          }}>
          <LoginButton
            onPress={this.sendPhoneNumber}
            buttonType={'black'}
            textStyle={[TextStyles.buttonLabel]}
            style={{
              height: 60,
              marginTop: 150,
            }}
            text={'Next'}
          />
        </View>
      </LoginTemplate>
    );
  }
}

export default SMSAuthPhoneNumber;
