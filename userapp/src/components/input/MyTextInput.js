import React, {Component} from 'react';
import {TextInput} from 'react-native';
import MyStyles from '../../constants/MyStyles';

export default class MyTextInput extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <TextInput
        // ref={this.props.ref}
        multiline={
          this.props.multiline == null || this.props.multiline == false
            ? false
            : true
        }
        value={this.props.value}
        onChangeText={this.props.onChangeText}
        keyboardType={this.props.keyboardType}
        secureTextEntry={this.props.secureTextEntry}
        style={[
          MyStyles.blackBorder,
          {height: 40, paddingStart: 10, paddingEnd: 10, marginBottom: 10},
          this.props.style,
        ]}
      />
    );
  }
}
