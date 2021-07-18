import React, {Component} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import TextStyles from '../../constants/TextStyles';
import Colors from '../../constants/Colors';
import LoginButton from '../button/loginButton';
import {SCREEN_WIDTH} from '../../constants/AppConstants';
import Barcode from 'react-native-barcode-builder';
import GlobalState from '../../mobx/GlobalState';
import {requestPost, Net, alertNetworkError} from '../../utils/APIUtils';

// var moment = require('moment');

export default class CouponCard extends Component {
  constructor(props) {
    super(props);
    // let _couponExpired = false;
    // if (
    //   moment(new Date(new Date().getTime() + 24 * 60 * 60 * 1000)).format(
    //     'YYYY-MM-DD',
    //   ) >= this.props.coupon.to_date
    // ) {
    //   _couponExpired = true;
    // }
    this.state = {
      coupon: this.props.coupon,
      useCoupon: this.props.useCoupon,
      // couponExpired: _couponExpired && this.props.expire,
      showExpiredLabel: this.props.expiredLabel,
    };
  }

  render() {
    return (
      <View style={[styles.couponCard, {marginVertical: 10}]}>
        <View style={{flexDirection: 'row', marginTop: 20}}>
          <View style={{flex: 6}}>
            <Image
              source={require('../../../assets/harutob-L.jpg')}
              resizeMode={'contain'}
              style={[styles.couponCard_topIcon, {marginLeft: 10}]}
            />
            <View style={{marginHorizontal: 5}}>
              <Text
                style={[
                  TextStyles.whiteText,
                  TextStyles.bold,
                  {fontSize: 20, lineHeight: 30},
                ]}>
                {this.state.coupon.title}
              </Text>
              <Text
                style={[
                  TextStyles.whiteText,
                  TextStyles.bold,
                  {fontSize: 24, lineHeight: 40},
                ]}>
                {this.state.coupon.content}
              </Text>
            </View>
          </View>
          <View
            style={{flex: 4, alignItems: 'center', justifyContent: 'center'}}>
            <Image
              source={{uri: this.state.coupon.image_path || ''}}
              // resizeMode={'contain'}
              style={{
                borderRadius: coupon_image_size / 2,
                width: coupon_image_size,
                height: coupon_image_size,
              }}
            />
          </View>
        </View>
        {this.state.useCoupon ? (
          <View>
            {this.state.showExpiredLabel ? (
              <LoginButton
                buttonType={'white'}
                style={{height: 100}}
                textStyle={[{fontSize: 36}, TextStyles.bold]}
                text={'使用済み'}
              />
            ) : (
              <View>
                <LoginButton
                  onPress={() => {
                    requestPost(Net.myShop.expireCoupon, {
                      customerID: GlobalState.myInfo.id,
                      couponID: this.state.coupon.id,
                    })
                      .then(json => {
                        if (json.result === Net.error.E_OK) {
                          this.setState({showExpiredLabel: true});
                        }
                      })
                      .catch(err => alertNetworkError(err));
                  }}
                  buttonType={'white'}
                  style={{height: 120}}
                  textStyle={[{fontSize: 36}, TextStyles.bold]}
                  text={'使用済みにする'}>
                  <Text
                    style={{
                      color: Colors.red,
                      textAlign: 'center',
                      marginTop: 20,
                    }}>
                    ※使用済みにするを押すとクーポンは削除されます。
                  </Text>
                </LoginButton>
              </View>
            )}
          </View>
        ) : (
          <LoginButton
            onPress={() => {
              requestPost(Net.myShop.useCoupon, {
                customerID: GlobalState.myInfo.id,
                couponID: this.state.coupon.id,
              })
                .then(json => {
                  if (json.result === Net.error.E_OK) {
                    this.setState({useCoupon: true});
                  }
                })
                .catch(err => alertNetworkError(err));
            }}
            buttonType={'white'}
            style={{height: 100}}
            textStyle={[{fontSize: 36}, TextStyles.bold]}
            text={'クーポンを使う'}
          />
        )}
        <View style={{marginHorizontal: 20, marginTop: 10}}>
          <Text style={[TextStyles.whiteText]}>有効期限</Text>
          <Text
            style={[TextStyles.whiteText, {fontSize: 20, fontWeight: '100'}]}>
            {'\t\t'}
            {this.state.coupon.from_date}～{this.state.coupon.to_date}
          </Text>
        </View>
        {/*{this.state.useCoupon &&*/}
        {/*this.state.couponExpired &&*/}
        {/*!this.state.showExpiredLabel ? (*/}
        {/*  <View>*/}
        {/*    <LoginButton*/}
        {/*      onPress={() => {*/}
        {/*        this.setState({showExpiredLabel: true});*/}
        {/*      }}*/}
        {/*      text={'使用済みにする'}*/}
        {/*      style={{height: 60, marginHorizontal: 30}}*/}
        {/*      textStyle={{*/}
        {/*        fontSize: 24,*/}
        {/*        fontWeight: 'bold',*/}
        {/*        color: Colors.red,*/}
        {/*      }}*/}
        {/*      buttonType={'white'}*/}
        {/*    />*/}
        {/*    <Text*/}
        {/*      style={[*/}
        {/*        TextStyles.whiteText,*/}
        {/*        {textAlign: 'center', marginTop: 5, marginBottom: 40},*/}
        {/*      ]}>*/}
        {/*      ※使用済みにするを押すとクーポンは削除されます。*/}
        {/*    </Text>*/}
        {/*  </View>*/}
        {/*) : null}*/}
      </View>
    );
  }
}

const margin_size = 20;
const coupon_image_size = (SCREEN_WIDTH - margin_size * 2) * 0.4 - margin_size;

const styles = StyleSheet.create({
  couponCard: {
    width: SCREEN_WIDTH - margin_size,
    backgroundColor: Colors.black,
    borderRadius: 40,
    padding: 10,
    borderColor: Colors.white,
    borderWidth: 3,
  },
  couponCard_topIcon: {
    height: 40,
    width: 120,
  },
});
