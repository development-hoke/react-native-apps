import React, {Component} from 'react';
import {View, Image, Text, TouchableHighlight} from 'react-native';
import {withNavigation} from 'react-navigation';
import MyStyles from '../constants/MyStyles';
import Logo from './logo';
import MyButton from './button/MyButton';
import TextStyles from '../constants/TextStyles';
import Colors from '../constants/Colors';

class NavigationHeader extends Component {
  render() {
    return (
      <View style={{...MyStyles.navigationHeader}}>
        {this.props.backButton ? (
          <MyButton
            onPress={() => {
              this.props.navigation.goBack();
            }}
            icon={'chevron-left'}
            style={{flex: 1, paddingHorizontal: 10, paddingVertical: 20}}
          />
        ) : (
          <View style={{flex: 1}} />
        )}
        <View style={{flex: 10, alignItems: 'center', paddingVertical: 5}}>
          {this.props.headerImage ? (
            <Logo />
          ) : (
            <Text style={[TextStyles.navHeaderTitle, {color: Colors.white}]}>
              {this.props.title}
            </Text>
          )}
        </View>
        <MyButton
          onPress={() => {
            this.props.navigation.navigate('Setting');
          }}
          icon={'bars'}
          style={[
            {flex: 1, paddingHorizontal: 10, paddingVertical: 20},
            !this.props.menuButton && {display: 'none'},
          ]}
        />
        <MyButton
          onPress={() => {
            this.props.navigation.goBack();
          }}
          icon={'times'}
          style={[
            {flex: 1, paddingHorizontal: 10, paddingVertical: 20},
            !this.props.closeButton && {display: 'none'},
          ]}
        />
        <View
          style={[
            (this.props.menuButton || this.props.closeButton) && {
              display: 'none',
            },
            {flex: 1},
          ]}
        />
      </View>
    );
  }
}

export default withNavigation(NavigationHeader);
