import React, {Component} from 'react';
import {StyleSheet, Text, Image, View} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Ripple from 'react-native-material-ripple';

const btnColors = {
  none: [null, '#ddd', '#000'],
  primary: ['#5867dd', '#383fcf', '#fff'],
  secondary: ['#c4c5d6', '#a7a7c0', '#000'],
  success: ['#34bfa3', '#039682', '#fff'],
  info: ['#36a3f7', '#008beb', '#fff'],
  warning: ['#FFD966', '#000', '#000'],
  danger: ['#f22d4e', '#f82a42', '#fff'],
  black: ['#000', '#222', '#fff'],
};

const styles = StyleSheet.create({
  ripple: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    padding: 8,
  },
});

export default class ButtonEx extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const type = this.props.type ? this.props.type : 'none';
    return (
      <Ripple
        style={[
          styles.ripple,
          {
            backgroundColor: btnColors[type][0],
            borderColor: btnColors[type][1],
            flexDirection: this.props.vertical === true ? 'column' : 'row',
            padding: this.props.padding ? this.props.padding : 8,
          },
          this.props.style,
        ]}
        onPress={this.props.onPress}>
        {this.props.new ? (
          <View
            style={{
              position: 'absolute',
              top: 5,
              left: 5,
              width: 20,
              height: 20,
              backgroundColor: '#FF0000',
              borderRadius: 100,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text>{this.props.new}</Text>
          </View>
        ) : null}
        {this.props.icon ? (
          <Icon
            name={this.props.icon}
            size={this.props.iconSize ? this.props.iconSize : null}
            color={btnColors[type][2]}
          />
        ) : null}
        {this.props.image ? (
          <Image
            source={this.props.image}
            style={this.props.imageStyle}
            resizeMode={'contain'}
          />
        ) : null}
        {this.props.text ? (
          <Text
            style={[
              {
                marginTop:
                  (this.props.image || this.props.icon) && this.props.vertical
                    ? 2
                    : null,
                marginLeft:
                  (this.props.image || this.props.icon) && !this.props.vertical
                    ? 5
                    : null,
                textAlign: 'center',
                color: btnColors[type][2],
              },
              this.props.textStyle,
            ]}>
            {this.props.text}
          </Text>
        ) : null}
      </Ripple>
    );
  }
}

ButtonEx.propTypes = {
  type: PropTypes.string,
  icon: PropTypes.string,
  iconSize: PropTypes.number,
  image: PropTypes.number,
  imageStyle: Image.propTypes.style,
  text: PropTypes.string,
  textStyle: Text.propTypes.style,
  vertical: PropTypes.bool,
  padding: PropTypes.number,
};
