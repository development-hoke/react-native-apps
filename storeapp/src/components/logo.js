import React, {Component} from 'react';
import {StyleSheet, Image, View} from 'react-native';
import MyStyles from '../constants/MyStyles';

export default class Logo extends Component {
  render() {
    return (
      <Image
        style={MyStyles.logo_img}
        source={require('../../assets/harutob-L.jpg')}
        resizeMode={'contain'}
        height={70}
      />
    );
  }
}
