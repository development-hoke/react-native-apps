import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Colors from '../../constants/Colors';
import MyStyles from '../../constants/MyStyles';

export default class CheckBox extends Component {
  constructor(props) {
    super(props);
    this.state = {checked: this.props.isActive? true: false};
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
    return (
      <View style={styles.container}>
        <TouchableOpacity activeOpacity={0.5} onPress={this.toggle}>
          <View
            style={[
              styles.outer,
              MyStyles.blackBorder,
              {
                width: this.props.checkBox_size,
                height: this.props.checkBox_size,
              },
            ]}>
            <View
              style={[
                styles.inner,
                {
                  backgroundColor: Colors.black,
                  width: this.props.checkBox_size - this.props.space_size,
                  height: this.props.checkBox_size - this.props.space_size,
                },
                !this.state.checked && {display: 'none'},
              ]}
            />
          </View>
        </TouchableOpacity>
        <Text style={{paddingHorizontal: 10, lineHeight: 20}}>
          {this.props.label}
        </Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 30,
  },
  outer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {},
});
