import React, {Component} from 'react';
import {View, Text, ScrollView, Linking} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import Colors from '../../constants/Colors';
import MainScreenTheme from '../../components/controller/MainScreenTheme';
import LoginButton from '../../components/button/loginButton';
import TextStyles from '../../constants/TextStyles';
import Icon from 'react-native-vector-icons/FontAwesome';
import {alertNetworkError, Net, requestPost} from '../../utils/APIUtils';
import GlobalState from '../../mobx/GlobalState';
import Common from '../../utils/Common';
import {
  BOTTOMBAR_HEIGHT,
  LOAD_CALENDAR_TYPE,
  NAVIGATION_HEADER_HEIGHT,
  SCREEN_HEIGHT,
} from '../../constants/AppConstants';
import Ripple from 'react-native-material-ripple';
import HeavyLabel from '../../components/label/heavyLabel';

export default class MarketReserveMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shopList: [],
      myReserveInfo: {},
      countUnreadInquiries: 0,
      myShop: null,
      myShopImage: [],
      docomoDays: [],
      shopOrg: null,
    };
  }
  componentDidMount() {
    LocaleConfig.locales['ja'] = {
      monthNames: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
      monthNamesShort: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
      dayNames: ['日', '月', '火', '水', '木', '金', '土'],
      dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
      today: '今日'
    };
    LocaleConfig.defaultLocale = 'ja';
    requestPost(Net.marketSearch.getMyShop, {
      customerID: GlobalState.myInfo.id,
    }).then(json => {
      if (json.result === Net.error.E_OK) {
        let sDocomoDays = {};
        json.restDocomoList.forEach(item => {
          sDocomoDays[item.f_rest_date] = { selected: true };
        });
        this.setState({
          myShop: json.myShop, 
          myShopImage: json.myShopImage, 
          docomoDays: sDocomoDays,
          shopOrg: json.shopOrg,
        });
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
        backColor={Colors.black}
        menuButton={true}>
        <ScrollView style={{width: '100%', height: SCREEN_HEIGHT - 180}}>
          <HeavyLabel
            label={ this.state.myShop ? this.state.myShop.name : '' }
            style={{color: Colors.white, textAlign: 'center', marginTop: 50}}
          />
          <LoginButton
            onPress={() => {
              if (this.state.myShop.docomo == 1) {
                Linking.openURL(this.state.shopOrg.link);
              } else {
                this.props.navigation.navigate('MarketReserveDetail', {
                  myShop: this.state.myShop,
                  myShopImage: this.state.myShopImage,
                });
              }
            }}
            buttonType={'orange'}
            textStyle={[TextStyles.largeText, {color: Colors.black}]}
            style={{height: 100, marginHorizontal: 50}}
            text={'ご来店予約'}
          />
          {this.state.myShop && this.state.myShop.docomo == 1 && (
            <LoginButton
              onPress={() => {
                const link = this.state.shopOrg.class_link 
                Linking.openURL(
                  link != null && link != '' ? link : 'https://study.smt.docomo.ne.jp/reservation/index.html'
                );
              }}
              buttonType={'orange'}
              textStyle={[TextStyles.largeText, {color: Colors.black}]}
              style={{height: 100, marginHorizontal: 50}}
              text={'スマホ教室予約'}
            />
          )}
          <Ripple
            style={{ marginTop: 10, marginBottom: 10 }}
            onPress={() => {
              this.props.navigation.navigate('Faq');
            }}>
            <Text
              style={[
                TextStyles.normalText,
                TextStyles.whiteText,
                TextStyles.underline,
                {textAlign: 'center', marginTop: 5},
              ]}>
              よくあるご質問(Q＆A)はコチラ
            </Text>
          </Ripple>
        </ScrollView>
      </MainScreenTheme>
    );
  }
}
