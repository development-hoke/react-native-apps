import React, {Component} from 'react';
import {Text, View} from 'react-native';
import TextStyles from '../../constants/TextStyles';
import LoginButton from '../../components/button/loginButton';
import LoginTemplate from '../../components/loginTemplate';

export default class MarketReserveFinish extends Component {
  render() {
    return (
      <LoginTemplate noWhitePane={true}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text style={[TextStyles.whiteText, TextStyles.hugeText]}>
            予約完了
          </Text>
          <Text
            style={[
              TextStyles.whiteText,
              // TextStyles.normalText,
              {textAlign: 'center', paddingHorizontal: 20, lineHeight: 25},
            ]}>
            予約時間から15分経過してもご来店が無い場合には、
            キャンセル扱いとさせていただきます。
          </Text>
        </View>
        <View style={{flex: 1, marginTop: 50}}>
          <LoginButton
            buttonType={'orange'}
            text={'TOPへ'}
            style={{height: 100, marginHorizontal: 20}}
            textStyle={[TextStyles.hugeText]}
            onPress={() => {
              this.props.navigation.navigate('MarketReserveMain');
            }}
          />
        </View>
      </LoginTemplate>
    );
  }
}
