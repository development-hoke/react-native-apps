import React, {Component} from 'react';
import {Image, TouchableHighlight} from 'react-native';
import Colors from '../../constants/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class MyButton extends Component {
  constructor(props) {
    super(props);
    this.state = {isActive: false};
  }
  // componentDidMount(): void {
  //   console.log(this.props.iconList);
  //   this.setState({icon: this.props.iconList.inactive});
  // }
  _onPressIn = () => {
    this.setState({isActive: true});
  };
  _onPressOut = () => {
    this.setState({isActive: false});
  };

  render() {
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        onPressIn={this._onPressIn}
        onPressOut={this._onPressOut}
        underlayColor={Colors.white}
        style={[
          {
            // flex: 1,
            alignItems: 'center',
          },
          this.props.style,
        ]}>
        <Icon
          name={this.props.icon}
          size={this.props.iconSize == null ? 40 : this.props.iconSize}
          color={this.state.isActive ? Colors.black : Colors.white}
        />
      </TouchableHighlight>
    );
  }
}
