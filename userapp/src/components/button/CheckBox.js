import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Colors from '../../constants/Colors';
import MyStyles from '../../constants/MyStyles';

export default class CheckBox extends Component {
  constructor(props) {
    super(props);
    this.state = {checked: this.props.isActive ? true : false};
  }
  toggle = () => {
    if (this.props.disabled) return;
    this.setState(
      {
        checked: !this.state.checked,
      },
      () => {
        if (this.props.onPress) {
          this.props.onPress(this.state.checked);
        }
      },
    );
  };
  render() {
    const checkBox_size =
      this.props.checkBoxSize == null ? 50 : this.props.checkBoxSize;
    const borderWidth = this.props.borderWidth ? this.props.borderWidth : 3;
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 30,
      },
      outer: {
        width: checkBox_size,
        height: checkBox_size,
        // marginVertical: 5,
      },
      inner: {
        margin: (checkBox_size - borderWidth * 2) * 0.2,
        width: (checkBox_size - borderWidth * 2) * 0.6,
        height: (checkBox_size - borderWidth * 2) * 0.6,
      },
    });
    return (
      <View style={[styles.container, this.props.style]}>
        <TouchableOpacity activeOpacity={0.5} onPress={this.toggle}>
          <View
            style={[
              styles.outer,
              MyStyles.blackBorder,
              {borderWidth: borderWidth},
            ]}>
            <View
              style={[
                styles.inner,
                {backgroundColor: Colors.black},
                !this.state.checked && {display: 'none'},
              ]}
            />
          </View>
        </TouchableOpacity>
        <Text
          style={[
            {paddingHorizontal: 10, lineHeight: 20},
            this.props.textStyle,
          ]}>
          {this.props.label}
        </Text>
      </View>
    );
  }
}
