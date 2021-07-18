import React, {Component} from 'react';
import {Text, TextInput} from 'react-native';
import Colors from '../../constants/Colors';
import TextStyles from '../../constants/TextStyles';
import LoginButton from '../../components/button/loginButton';
import MainScreenTheme from '../../components/controller/MainScreenTheme';
import {requestPost, Net, alertNetworkError} from '../../utils/APIUtils';
import GlobalState from '../../mobx/GlobalState';

export default class MarketReserveQuestionConfirm extends Component {
  sendQuestion = () => {
    requestPost(Net.marketReserve.sendQuestion, {
      customer: GlobalState.myInfo.id,
      shop: this.props.navigation.state.params.passParam.shopID,
      contentOfQuery: this.props.navigation.state.params.passParam.contentOfQuery,
    })
      .then(json => {
        if (json.result === Net.error.E_OK) {
          this.props.navigation.popToTop();
          this.props.navigation.navigate('MarketReserveFinish');
        }
      })
      .catch(err => {
        alertNetworkError(err);
      });
  };
  render() {
    return (
      <MainScreenTheme
        backButton={true}
        title={'お問い合わせ'}
        backColor={Colors.black}>
        <Text
          style={[
            TextStyles.normalText,
            TextStyles.whiteText,
            TextStyles.bold,
            {marginBottom: 5, marginLeft: 10},
          ]}>
          お問い合わせ内容の確認
        </Text>
        <TextInput
          style={{
            backgroundColor: Colors.white,
            color: Colors.black,
            height: 300,
            textAlignVertical: 'top',
            paddingHorizontal: 15,
            marginBottom: 30,
          }}
          value={this.props.navigation.state.params.passParam.contentOfQuery}
          editable={false}
          multiline={true}
          // placeholder="상대에 대해 보낼 메시지를 진심을 담아 작성해주세요."
          returnKeyType="done"
        />
        <LoginButton
          onPress={this.sendQuestion}
          buttonType={'orange'}
          textStyle={[
            {color: Colors.black},
            TextStyles.largeText,
            TextStyles.bold,
          ]}
          text={'送信'}
          style={{height: 80, marginBottom: 20}}
        />
      </MainScreenTheme>
    );
  }
}
