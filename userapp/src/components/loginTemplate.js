import React, {Component} from 'react';
import {SafeAreaView, Text} from 'react-native';
import MyStyles from '../constants/MyStyles';
import Colors from '../constants/Colors';
import {View} from 'react-native';
import Logo from './logo';
import {ScrollView} from 'react-native';
import TextStyles from '../constants/TextStyles';
import {LOGO_HEIGHT} from '../constants/AppConstants';
import MyButton from './button/MyButton';
import {withNavigation} from 'react-navigation';

class LoginTemplate extends Component {
  render() {
    return (
      <SafeAreaView
        style={[
          {
            backgroundColor: this.props.noWhitePane
              ? Colors.black
              : Colors.white,
          },
          MyStyles.topContainer,
          this.props.style,
        ]}>
        {this.props.noScrollView ? (
          <View style={{backgroundColor: Colors.black, flex: 1}}>
            <View
              style={{
                height: LOGO_HEIGHT,
              }}>
              {this.props.closeButton ? (
                <MyButton
                  onPress={() => {
                    this.props.navigation.pop();
                    // BackHandler.exitApp();
                  }}
                  icon={'times'}
                  style={{width: 50, height: 50}}
                  iconSize={50}
                />
              ) : null}
              <Logo />
              {this.props.header != null ? (
                <Text
                  style={[
                    {
                      color: Colors.white,
                      marginHorizontal: 20,
                    },
                    TextStyles.headerDescription,
                  ]}>
                  {this.props.header}
                </Text>
              ) : null}
            </View>
            {this.props.noWhitePane ? (
              <View style={{flex: 1}}>{this.props.children}</View>
            ) : (
              <View style={[{flex: 1}, MyStyles.whiteInfoPane]}>
                {this.props.children}
              </View>
            )}
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                height: LOGO_HEIGHT + 30,
                backgroundColor: Colors.black,
                paddingBottom: 20,
              }}>
              {this.props.closeButton ? (
                <MyButton
                  onPress={() => {
                    this.props.navigation.pop();
                    // BackHandler.exitApp();
                  }}
                  icon={'times'}
                  style={{width: 50, height: 50}}
                  iconSize={50}
                />
              ) : null}
              <Logo />
              {this.props.header != null ? (
                <Text
                  style={[
                    {
                      color: Colors.white,
                      marginHorizontal: 20,
                    },
                    TextStyles.headerDescription,
                    this.props.headerStyle,
                  ]}>
                  {this.props.header}
                </Text>
              ) : null}
            </View>
            {this.props.noWhitePane ? (
              <View style={{flex: 1, marginTop: -30}}>
                {this.props.children}
              </View>
            ) : (
              <View style={[{flex: 1, marginTop: -30}, MyStyles.whiteInfoPane]}>
                {this.props.children}
              </View>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    );
  }
}

export default withNavigation(LoginTemplate);
