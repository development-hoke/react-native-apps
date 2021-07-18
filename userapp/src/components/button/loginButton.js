import React, {Component} from 'react';
import {View, Text, TouchableHighlight} from 'react-native';
import Colors from '../../constants/Colors';
import TextStyles from '../../constants/TextStyles';

export default class LoginButton extends Component {
  constructor(props) {
    super(props);
    this.state = {isBlack: false, isWhite: false, isBlue: false};
    if (this.props.buttonType == null || this.props.buttonType == 'black') {
      this.state.isBlack = true;
    } else if (this.props.buttonType == 'white') {
      this.state.isWhite = true;
    } else if (this.props.buttonType == 'blue') {
      this.state.isBlue = true;
    } else if (this.props.buttonType == 'orange') {
      this.state.isOrange = true;
    } else if (this.props.buttonType == 'yellow') {
      this.state.isYellow = true;
    } else if (this.props.buttonType == 'grey') {
      this.state.isGrey = true;
    }
  }
  render() {
    return (
      <TouchableHighlight
        underlayColor={'#0000ff'}
        style={[{marginTop: 20}, this.props.style]}
        onPress={this.props.onPress}>
        <View
          style={[
            {
              borderRadius: this.props.borderRadius
                ? this.props.borderRadius
                : 5,
              flex: 1,
              justifyContent: 'center',
            },
            this.state.isBlack && {backgroundColor: Colors.black},
            this.state.isWhite && {
              backgroundColor: Colors.white,
              borderColor: Colors.black,
              borderWidth: 3,
            },
            this.state.isBlue && {backgroundColor: Colors.blue},
            this.state.isOrange && {backgroundColor: Colors.orange},
            this.state.isYellow && {backgroundColor: Colors.yellow},
            this.state.isGrey && {backgroundColor: Colors.light_grey},
            this.props.border,
          ]}>
          <Text
            style={[
              {
                textAlign: 'center',
                color: this.state.isWhite ? Colors.black : Colors.white,
              },
              this.props.textStyle,
            ]}>
            {this.props.text}
          </Text>
          {this.props.badgeNumber && this.props.badgeNumber > 0 ? (
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: Colors.red,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                top: -20,
                right: -20,
              }}>
              <Text style={[TextStyles.whiteText, TextStyles.normalText]}>
                {this.props.badgeNumber}
              </Text>
            </View>
          ) : null}
          {this.props.children}
        </View>
      </TouchableHighlight>
    );
  }
}
