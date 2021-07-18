import React, {Component} from 'react';
import {Text} from 'react-native';
import MyStyles from '../../constants/MyStyles';
import TextStyles from '../../constants/TextStyles';

export default class HeavyLabel extends Component {
  render() {
    return (
      <Text style={[TextStyles.loginLabel, this.props.style]}>
        {this.props.label}
      </Text>
    );
  }
}
