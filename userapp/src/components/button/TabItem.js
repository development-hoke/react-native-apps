import React, {Component} from 'react';
import {Image, View, Text} from 'react-native';
import Ripple from 'react-native-material-ripple';
import MyStyles from '../../constants/MyStyles';
import Colors from '../../constants/Colors';
import TextStyles from '../../constants/TextStyles';

export default class TabItem extends Component {
  render() {
    return (
      <View
        style={[
          {
            flex: 1,
            alignItems: 'center',
          },
          {backgroundColor: this.props.isActive ? Colors.white : Colors.black},
        ]}>
        <Ripple
          style={{flex: 1, alignItems: 'center'}}
          onPress={this.props.onPress}>
          <Image
            style={[{flex: 9, marginTop: 10, marginBottom: 5}]}
            source={this.props.icon}
            resizeMode={'contain'}
          />
          <View
            style={{flex: 4, alignItems: 'center', justifyContent: 'center'}}>
            <Text
              style={[
                {color: this.props.isActive ? Colors.black : Colors.white},
                TextStyles.tabItemText,
              ]}>
              {this.props.text}
            </Text>
          </View>
        </Ripple>
      </View>
    );
  }
}
