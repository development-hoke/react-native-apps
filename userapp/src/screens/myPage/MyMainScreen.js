import React from 'react';
import {Text, View, Image, Linking} from 'react-native';
import TextStyles from '../../constants/TextStyles';
import MainScreenTheme from '../../components/controller/MainScreenTheme';
import Colors from '../../constants/Colors';
import LoginButton from '../../components/button/loginButton';
import Ripple from 'react-native-material-ripple';
import Accordion from '../../components/controller/Accordion';
import QRCode from 'react-native-qrcode-svg';
import GlobalState from '../../mobx/GlobalState';
import {requestPost, Net, alertNetworkError} from '../../utils/APIUtils';
import Carousel from 'react-native-snap-carousel/src/carousel/Carousel';
import {SCREEN_WIDTH} from '../../constants/AppConstants';
import {Pagination} from 'react-native-snap-carousel';
import HeavyLabel from '../../components/label/heavyLabel';
import MyInfoPopup from './MyInfoPopup';
import {observer} from 'mobx-react';

const moment = require('moment');

@observer
class MyMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myShop: null,
      myShopImage: [],
      restType: Net.restType.ON_DUTY,
      sigongList: [],
      brifSigongList: [],
      activeImageIndex: 0,
      showMyInfoPopup: false,
      businessHours: [],
    };
  }
  componentDidMount() {
    this.refresh_myshop = this.props.navigation.addListener('willFocus', () => {
      requestPost(Net.marketSearch.getMyShop, {
        customerID: GlobalState.myInfo.id,
      }).then(json => {
        console.log(json);
        if (json.result === Net.error.E_OK) {
          this.setState({
            myShop: json.myShop,
            myShopImage: json.myShopImage,
            restType: json.restType,
            businessHours: json.businessHours,
          });
        }
      }).catch(err => {
        alertNetworkError(err);
      });
    });
  }
  componentWillUnmount() {
    this.refresh_myshop.remove();
  }

  renderIsWorking() {
    const current_time = moment().format('HH:mm');
    const start_time = this.state.businessHours[0];
    const end_time = this.state.businessHours[1];
    return current_time >= start_time && current_time <= end_time ? '営業中' : '営業時間外'
  }

  renderWorkingHours() {
    const start_time = this.state.businessHours[0];
    const end_time = this.state.businessHours[1];
    return `${start_time ? start_time.slice(0, -3) : '?'}-${end_time ? end_time.slice(0, -3) : '?'}`
  }

  renderImage = ({item, index}) => {
    return (
      <View>
        <Image
          // source={item.image}
          source={{uri: item.url}}
          resizeMode={'contain'}
          style={{width: '100%', height: 250}}
        />
      </View>
    );
  };

  render() {
    return (
      <MainScreenTheme
        // noPaddingHoriz={true}
        backButton={false}
        menuButton={true}
        backColor={Colors.black}
        title={ this.state.myShop ? this.state.myShop.name : '' }>
        <View
          style={{
            display: 'none',
            height: 250,
            backgroundColor: Colors.white,
            marginHorizontal: 15,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <QRCode
            value={
              GlobalState.myInfo.member_no
                ? GlobalState.myInfo.member_no
                : 'null'
            }
            size={160}
          />
          <Text style={[TextStyles.normalText, {marginTop: 20}]}>
            {GlobalState.myInfo.member_no}
          </Text>
        </View>
        <HeavyLabel
          label={
            this.state.restType === Net.restType.ON_DUTY
              ? `${this.renderIsWorking()} ${this.renderWorkingHours()}`
              : '定休日'
          }
          style={{color: Colors.white, textAlign: 'center', marginBottom: 10}}
        />
        <Carousel
          activeSlideAlignment="center"
          ref={c => {
            this._carousel = c;
          }}
          inactiveSlideScale={0.85}
          data={this.state.myShopImage}
          renderItem={this.renderImage}
          onSnapToItem={index => this.setState({activeImageIndex: index})}
          sliderWidth={SCREEN_WIDTH}
          itemWidth={SCREEN_WIDTH}
        />
        <Pagination
          dotsLength={this.state.myShopImage.length}
          activeDotIndex={this.state.activeImageIndex}
          dotContainerStyle={{height: 20}}
          containerStyle={{
            backgroundColor: 'transparent',
            paddingVertical: 0,
          }}
          dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 10,
            backgroundColor: Colors.light_orange,
            // marginHorizontal: -10,
          }}
          inactiveDotStyle={{
            width: 10,
            height: 10,
            borderRadius: 10,
            borderWidth: 1,
            backgroundColor: '#AFABAB',
          }}
          inactiveDotOpacity={0.8}
          inactiveDotScale={1}
        />
        <LoginButton
          buttonType={'white'}
          text={'お客様ID :' + GlobalState.myInfo.member_no}
          style={{height: 60}}
          textStyle={TextStyles.buttonLabel}
          onPress={() => {
            this.setState({showMyInfoPopup: !this.state.showMyInfoPopup});
          }}
        />
        <LoginButton
          buttonType={'yellow'}
          text={'クーポンを見る'}
          style={{height: 60}}
          textStyle={[TextStyles.buttonLabel, {color: Colors.black}]}
          onPress={() => {
            this.props.navigation.navigate('CouponUse', {
              myShop: this.state.myShop,
            });
          }}
        />
        <View style={{flex: 1, marginHorizontal: 15}}>
          <View style={{flexDirection: 'row'}}>
            <LoginButton
              onPress={() => {
                if (this.state.myShop.docomo == 1) {
                  this.props.navigation.navigate('MarketReserveMain');
                } else {
                  this.props.navigation.navigate('MarketReserveDetail', {
                    myShop: this.state.myShop,
                    myShopImage: this.state.myShopImage,
                  });
                }
              }}
              buttonType={'blue'}
              text={'来店予約'}
              textStyle={TextStyles.buttonLabel}
              style={{height: 60, marginRight: 5, flex: 1}}
            />
            <LoginButton
              onPress={() => {
                this.props.navigation.navigate('MarketReserveDetail', {
                  myShop: this.state.myShop,
                  myShopImage: this.state.myShopImage,
                });
              }}
              buttonType={'blue'}
              text={'お問合せ'}
              textStyle={TextStyles.buttonLabel}
              style={{height: 60, marginLeft: 5, flex: 1}}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <LoginButton
              buttonType={'blue'}
              text={''}
              textStyle={TextStyles.buttonLabel}
              style={{height: 60, marginRight: 5, flex: 1, display: 'none'}}
            />
            <LoginButton
              onPress={() => {
                this.props.navigation.navigate('SigongList');
              }}
              buttonType={'blue'}
              text={'施工履歴'}
              textStyle={TextStyles.buttonLabel}
              style={{height: 60, marginLeft: 5, flex: 1}}
            />
          </View>
        </View>
        <MyInfoPopup
          visible={this.state.showMyInfoPopup}
          onOk={() => {
            this.setState({showMyInfoPopup: false});
          }}
          onCancel={() => {
            this.setState({showMyInfoPopup: false});
          }}
        />
        <View style={{display: 'none'}}>
          <Accordion
            headerTitle={'施工履歴一覧'}
            style={{marginTop: 30}}
            sigongList={this.state.brifSigongList}>
            <View>
              <Ripple
                style={{alignItems: 'flex-end'}}
                onPress={() => {
                  this.props.navigation.navigate('SigongList');
                }}>
                <Text
                  style={[
                    TextStyles.normalText,
                    TextStyles.whiteText,
                    TextStyles.bold,
                    TextStyles.underline,
                    {textAlign: 'right', marginVertical: 10},
                  ]}>
                  施工履歴一覧➔
                </Text>
              </Ripple>
            </View>
          </Accordion>
          <Accordion headerTitle={'マイショップ'} style={{marginBottom: 40}}>
            {this.state.myShop ? (
              <View style={{paddingHorizontal: 20}}>
                <Text
                  style={[
                    TextStyles.whiteText,
                    TextStyles.bold,
                    {fontSize: 20, textAlign: 'center'},
                  ]}>
                  {this.state.myShop.name}
                </Text>
                <Image
                  source={{uri: this.state.myShop.image_path}}
                  resizeMode={'contain'}
                  style={{width: '100%', height: 200}}
                />
                <Text style={[TextStyles.whiteText, {textAlign: 'center'}]}>
                  {this.state.myShop.postal +
                    '\t\t\t' +
                    this.state.myShop.address}
                </Text>
                <Text
                  style={[
                    TextStyles.whiteText,
                    TextStyles.bold,
                    {fontSize: 20, textAlign: 'center'},
                  ]}>
                  TEL:
                  <Text style={[TextStyles.underline]}>
                    {this.state.myShop.tel_no}
                  </Text>
                </Text>
                <LoginButton
                  onPress={() => {
                    this.props.navigation.navigate('MarketReserveSchedule', {
                      shopID: this.state.myShop.f_shop_id,
                    });
                  }}
                  buttonType={'blue'}
                  text={'来店予約'}
                  textStyle={TextStyles.buttonLabel}
                  style={{height: 60}}
                />
              </View>
            ) : null}
          </Accordion>
        </View>
      </MainScreenTheme>
    );
  }
}

export default MyMain;
// const imageList = [
//   {image: require('../../../assets/test.jpg'), key: '1'},
//   {image: require('../../../assets/test.jpg'), key: '2'},
//   {image: require('../../../assets/test.jpg'), key: '3'},
// ];
