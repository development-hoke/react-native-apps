/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import LoginTemplate from '../../components/loginTemplate';
import TextStyles from '../../constants/TextStyles';
import LoginButton from '../../components/button/loginButton';

export default class RegisterFinish extends React.Component {
  render() {
    return (
      <LoginTemplate noWhitePane={true}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text style={[TextStyles.whiteText, styles.big]}>登録完了</Text>
          <Text
            style={[
              TextStyles.whiteText,
              // TextStyles.normalText,
              {textAlign: 'center'},
            ]}>
            ご登録いただき有難うございます。
          </Text>
        </View>
        <View style={{flex: 1, marginTop: 50}}>
          <LoginButton
            buttonType={'orange'}
            text={'TOPへ'}
            style={{height: 100, marginHorizontal: 20}}
            textStyle={[styles.big]}
            onPress={() => {
              this.props.navigation.pop();
              this.props.navigation.navigate('TopMain');
            }}
          />
        </View>
      </LoginTemplate>
    );
  }
}

const styles = StyleSheet.create({
  big: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 40,
  },
});
