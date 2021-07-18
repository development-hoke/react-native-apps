import React, {Component} from 'react';
import {Text, ScrollView, View} from 'react-native';
import HTMLView from 'react-native-htmlview';
import MainScreenTheme from '../../components/controller/MainScreenTheme';
import {SCREEN_HEIGHT} from '../../constants/AppConstants';
import {requestPost, Net, alertNetworkError} from '../../utils/APIUtils';
import MyStyles from '../../constants/MyStyles';
import TextStyles from '../../constants/TextStyles';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Colors from '../../constants/Colors';
import {
  NAVIGATION_HEADER_HEIGHT,
  BOTTOMBAR_HEIGHT,
} from '../../constants/AppConstants';

export default class FaqScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      faq1: '',
      faq2: '',
    }
  }
  componentDidMount() {
    requestPost(Net.auth.getFaq).then(json => {
      if (json.result !== Net.error.E_OK) {
        alertNetworkError();
      } else {
        this.setState({
          faq1: json.faq['policy'],
          faq2: json.faq['privacy'],
        });
        console.log(json.faq['policy']);
      }
    }).catch(err => {
      alertNetworkError(err);
    });
  }
  render() {
    return (
      <MainScreenTheme
        noPaddingHoriz={true}
        backButton={false}
        headerImage={true}
        menuButton={true}>
          <View style={{ height: '100%', flex: 1 }}>
            <ScrollableTabView
              style={{ height: SCREEN_HEIGHT - NAVIGATION_HEADER_HEIGHT - BOTTOMBAR_HEIGHT - 70}}
              tabBarActiveTextColor={Colors.black}
              tabBarInactiveTextColor={Colors.black}
              tabBarTextStyle={[{fontSize: 16}]}
              tabBarUnderlineStyle={{backgroundColor: Colors.black, height: 5}}>
              <View tabLabel="ハルトコーティング" style={{ paddingTop: 10 }}>
                <ScrollView style={{marginHorizontal: 10 }}>
                  <HTMLView value={this.state.faq1} />
                </ScrollView>
              </View>
              <View tabLabel="ハルトコーティング TypeF" style={{ paddingTop: 10 }}>
                <ScrollView style={{marginHorizontal: 10}}>
                  <HTMLView value={this.state.faq2} />
                </ScrollView>
              </View>
            </ScrollableTabView>
          </View>
        {/* <ScrollableTabView
          style={{ backgroundColor: 'red', height: 100}}
          tabBarActiveTextColor={Colors.black}
          tabBarInactiveTextColor={Colors.black}
          tabBarTextStyle={[{fontSize: 16}]}
          tabBarUnderlineStyle={{backgroundColor: Colors.black, height: 5}}>
            <View tabLabel="ハルトコーティング" style={{backgroundColor: 'black', height: 100}}>
              <ScrollView style={{marginHorizontal: 10}}>
                <HTMLView value={this.state.faq1} />
              </ScrollView>
            </View>
            <View tabLabel="ハルトコーティング TypeF" style={[{flex: 1, width: '100%'}]}></View>
        </ScrollableTabView> */}
      </MainScreenTheme>
    );
  }
}
