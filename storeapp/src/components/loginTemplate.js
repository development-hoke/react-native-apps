import React, {Component} from 'react';
import {ScrollView, SafeAreaView, View} from 'react-native';
import MyStyles from '../constants/MyStyles';
import Colors from '../constants/Colors';
import Logo from './logo';

export default class LoginTemplate extends Component {
  render() {
    return (
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <SafeAreaView
          style={[
            MyStyles.container,
            {
              flexDirection: 'column',
              backgroundColor: Colors.black,
            },
          ]}>
          <Logo />
          <View style={[MyStyles.whiteInfoPane, this.props.style]}>{this.props.children}</View>
        </SafeAreaView>
      </ScrollView>
    );
  }
}
