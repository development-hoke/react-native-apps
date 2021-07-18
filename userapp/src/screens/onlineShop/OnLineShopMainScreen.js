import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import MainScreenTheme from '../../components/controller/MainScreenTheme';
import {EXTERNAL_URL} from '../../constants/AppConstants';

export default class OnLineShopMain extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <MainScreenTheme
        headerImage={true}
        noPaddingHoriz={true}
        menuButton={true}
        noScrollView={true}>
        <WebView source={{uri: EXTERNAL_URL}} />
      </MainScreenTheme>
    );
  }
}
