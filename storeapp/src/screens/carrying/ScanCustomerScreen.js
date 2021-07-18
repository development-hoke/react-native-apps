import React, {Component} from 'react';
import {
  View,
  Text,
  Picker,
  StyleSheet,
  Image,
  Alert,
  FlatList,
  TextInput,
  ScrollView,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import ButtonEx from '../../components/button/ButtonEx';
import CheckBox from '../../components/button/CheckBox';
import MyStyles from '../../constants/MyStyles';
import {Net, requestPost, alertNetworkError} from '../../utils/ApiUtils';
import MainLayout from '../../components/container/MainLayout';
import GlobalState from '../../mobx/GlobalState';
import Ripple from 'react-native-material-ripple';

export default class ScanCustomerScreen extends Component {
  onSuccess = e => {
    GlobalState.detectedId = e.data;
    this.props.navigation.state.params.onGoBack();
    this.props.navigation.goBack();
  };
  render() {
    return (
      <MainLayout
        homeCallback={() => this.props.navigation.navigate('Main')}
        title={'QRコード読み取り'}>
        <QRCodeScanner
          onRead={this.onSuccess}
          flashMode={RNCamera.Constants.FlashMode.off}
          containerStyle={{
            width: '100%',
            height: '100%'
          }}
          cameraStyle={{
            width: '100%',
            height: '100%'
          }}
        />          
      </MainLayout>
    )
  }
}