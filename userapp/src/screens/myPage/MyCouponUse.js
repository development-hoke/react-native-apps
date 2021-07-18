import React from 'react';
import {Text, View, ScrollView, StyleSheet, Image} from 'react-native';
import TextStyles from '../../constants/TextStyles';
import MainScreenTheme from '../../components/controller/MainScreenTheme';
import Colors from '../../constants/Colors';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {SCREEN_WIDTH} from '../../constants/AppConstants';
import LoginButton from '../../components/button/loginButton';
import CouponCard from '../../components/controller/CouponCard';
import {alertNetworkError, Net, requestPost} from '../../utils/APIUtils';
import GlobalState from '../../mobx/GlobalState';

export default class MyCouponUse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commonCoupon: null,
      myShopCoupon: null,
      usedCoupon: null,
      usedCouponState: null,
      isExpireList: null,
      myShop: this.props.navigation.state.params.myShop,
      allCoupon: null,
    };
  }
  componentDidMount() {
    requestPost(Net.myShop.getCouponList, {
      myShopID: GlobalState.myShop,
      customerID: GlobalState.myInfo.id,
    })
      .then(json => {
        console.log(json);
        if (json.result === Net.error.E_OK) {
          this.setState({
            commonCoupon: json.commonCoupon,
            myShopCoupon: json.myShopCoupon,
            usedCoupon: json.usedCoupon,
            usedCouponState: json.usedCouponState,
            isExpireList: json.isExpireList,
            allCoupon: json.commonCoupon.concat(json.myShopCoupon),
          });
        }
      })
      .catch(err => alertNetworkError(err));
  }
  render() {
    return (
      <MainScreenTheme
        noPaddingHoriz={true}
        backButton={true}
        menuButton={true}
        backColor={Colors.black}
        noScrollView={true}
        title={ this.state.myShop ? this.state.myShop.name : '' }>
        <ScrollView
          style={{marginHorizontal: 10}}
          showsVerticalScrollIndicator={false}>
          {this.state.allCoupon !== null &&
          this.state.allCoupon.length > 0 ? (
            <View>
              {this.state.allCoupon.map(coupon => {
                let used = false;
                let expiredLabel = false;
                let expire = false;
                if (
                  this.state.usedCoupon.length > 0 &&
                  this.state.usedCoupon.indexOf(coupon.id) >= 0 &&
                  coupon.reuse == 0
                ) {
                  used = true;
                  if (this.state.usedCouponState[this.state.usedCoupon.indexOf(coupon.id)] === 0) {
                    expiredLabel = true;
                    if (this.state.isExpireList[this.state.usedCoupon.indexOf(coupon.id)])
                      expire = true;
                  }
                }
                if (!expire) {
                  return (
                    <CouponCard
                      coupon={coupon}
                      useCoupon={used}
                      expiredLabel={expiredLabel}
                    />
                  );
                }
              })}
            </View>
          ) : null}
        </ScrollView>
        <ScrollableTabView
          style={{display: 'none'}}
          tabBarActiveTextColor={Colors.black}
          tabBarInactiveTextColor={Colors.black}
          tabBarTextStyle={[{fontSize: 16}]}
          tabBarUnderlineStyle={{backgroundColor: Colors.black, height: 5}}>
          <View tabLabel="共通クーポン" style={[{flex: 1, width: '100%'}]}>
            <ScrollView
              style={{marginHorizontal: 10}}
              showsVerticalScrollIndicator={false}>
              {this.state.commonCoupon !== null &&
              this.state.commonCoupon.length > 0 ? (
                <View>
                  {/* {this.state.commonCoupon.map(coupon => (
                    <CouponCard coupon={coupon} />
                  ))} */}
                </View>
              ) : null}
            </ScrollView>
          </View>
          <View tabLabel="マイショップ専用" style={[{flex: 1, width: '100%'}]}>
            <ScrollView
              style={{marginHorizontal: 10}}
              showsVerticalScrollIndicator={false}>
              {this.state.myShopCoupon !== null &&
              this.state.myShopCoupon.length > 0 ? (
                <View>
                  {/* {this.state.myShopCoupon.map(coupon => (
                    <CouponCard coupon={coupon} />
                  ))} */}
                </View>
              ) : null}
            </ScrollView>
          </View>
        </ScrollableTabView>
      </MainScreenTheme>
    );
  }
}
