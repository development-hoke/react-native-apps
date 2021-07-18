import React, {Component} from 'react';
import {Image, StyleSheet, Text, View, Dimensions} from 'react-native';
import TextStyles from '../../constants/TextStyles';
import Colors from '../../constants/Colors';
import LoginButton from '../button/loginButton';
import Barcode from 'react-native-barcode-builder';
import GlobalState from '../../mobx/GlobalState';
import {requestPost, Net, alertNetworkError} from '../../utils/ApiUtils';

var moment = require('moment');

export default class CouponCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coupon: this.props.coupon,
      useCoupon: this.props.useCoupon,
      showExpiredLabel: this.props.expiredLabel,
      SCREEN_WIDTH: Dimensions.get("screen").width,
      SCREEN_HEIGHT: Dimensions.get("screen").height,
    };
  }

  render() {
    return (
      <View style={[styles.couponCard, {marginVertical: 10}]}>
        <View style={{flexDirection: 'row', marginTop: 5}}>
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
                  {fontSize: 16, lineHeight: 20},
                ]}>
                {this.props.coupon.title}
              </Text>
              <Text
                style={[
                  TextStyles.whiteText,
                  TextStyles.bold,
                  {fontSize: 20, lineHeight: 24},
                ]}>
                {this.props.coupon.content}
              </Text>
              <Text
                style={[
                  TextStyles.whiteText,
                  TextStyles.bold,
                  {fontSize: 20, lineHeight: 24},
                ]}>
                {`${this.props.coupon.amount}${this.props.coupon.unit == 0 ? "円引き" : "％引き"}`}
              </Text>
            </View>
          </View>
          <View
            style={{flex: 4, alignItems: 'center', justifyContent: 'center'}}>
            <Image
              source={require('../../../assets/coupon_symbol.jpg')}
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
                <View
                  style={{
                    display: 'none',
                    backgroundColor: Colors.white,
                    height: 120,
                    marginHorizontal: 5,
                    marginTop: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Barcode value={'06691686101'} height={70} />
                  <Text style={[TextStyles.normalText]}>06691686101</Text>
                </View>
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
            buttonType={'white'}
            style={{height: 48}}
            textStyle={[{fontSize: 24}, TextStyles.bold]}
            text={'クーポンを使う'}
          />
        )}
        <View style={{marginHorizontal: 20, marginTop: 5}}>
          <Text style={[TextStyles.whiteText]}>有効期限</Text>
          <Text
            style={[TextStyles.whiteText, {fontSize: 16, fontWeight: '100'}]}>
            {'\t'}
            {/* {this.props.coupon.from_date}～{this.props.coupon.to_date} */}
            {(typeof this.props.coupon.from_date) == 'string' ?
              `${this.props.coupon.from_date} ～ ${this.props.coupon.to_date}` :
              `${moment(this.props.coupon.from_date).format('YYYY-MM-DD')} ~ ${moment(this.props.coupon.to_date).format('YYYY-MM-DD')}`
            }
          </Text>
        </View>
      </View>
    );
  }
}

const margin_size = 20;
const coupon_image_size = 100;
const styles = StyleSheet.create({
  couponCard: {
    width: 300,
    height: 300,
    backgroundColor: Colors.black,
    borderRadius: 40,
    padding: 10,
    borderColor: Colors.white,
    borderWidth: 3,
  },
  couponCard_topIcon: {
    height: 40,
    width: 80,
  },
});
