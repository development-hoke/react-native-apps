import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../constants/AppConstants';

const styles = StyleSheet.create({
  topText: {
    marginBottom: 30,
  },
});

export default class QRScanScreen extends Component {
  onSuccess = e => {
    if (this.props.navigation.state.params.prevScreen === 'calcManager') {
      this.props.navigation.navigate('CalculationManager', {code: e.data});
    } else {
      this.props.navigation.navigate('MemberSearch', {code: e.data});
    }
  };

  render() {
    return (
      <QRCodeScanner
        onRead={this.onSuccess}
        showMarker={true}
        cameraStyle={{width: SCREEN_WIDTH, height: SCREEN_HEIGHT}}
      />
    );
  }
}
