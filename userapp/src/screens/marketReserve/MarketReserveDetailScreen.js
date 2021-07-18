import React, {Component} from 'react';
import {Image, Text, View} from 'react-native';
import TextStyles from '../../constants/TextStyles';
import LoginTemplate from '../../components/loginTemplate';
import Colors from '../../constants/Colors';
import HeavyLabel from '../../components/label/heavyLabel';
import Carousel from 'react-native-snap-carousel/src/carousel/Carousel';
import {SCREEN_WIDTH} from '../../constants/AppConstants';
import {Pagination} from 'react-native-snap-carousel';
import Ripple from 'react-native-material-ripple';
import {alertNetworkError, Net, requestPost} from '../../utils/APIUtils';
import GlobalState from '../../mobx/GlobalState';

export default class MarketReserveDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myShop: this.props.navigation.state.params.myShop
        ? this.props.navigation.state.params.myShop
        : {},
      myShopImage: this.props.navigation.state.params.myShopImage
        ? this.props.navigation.state.params.myShopImage
        : [],
      activeImageIndex: 0,
    };
  }
  renderImage = ({item, index}) => {
    return (
      <View style={{paddingHorizontal: 20}}>
        <Image
          // source={item.image}
          source={{uri: item.url}}
          resizeMode={'contain'}
          style={{width: '100%', height: 250}}
        />
      </View>
    );
  };
  componentDidMount() {
    if (this.props.navigation.state.params.shop) {
      requestPost(Net.marketReserve.getShopImage, {
        shopID: this.props.navigation.state.params.shop.id,
      }).then(json => {
        if (json.result === Net.error.E_OK) {
          this.setState({
            myShopImage: json.shopImage,
            myShop: this.props.navigation.state.params.shop,
          });
        }
      }).catch(err => {
        alertNetworkError(err);
      });
    }
  }

  render() {
    return (
      <LoginTemplate noWhitePane={true}>
        <HeavyLabel
          label={ this.state.myShop ? this.state.myShop.name : '' }
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
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            marginBottom: 30,
            marginTop: 10,
            justifyContent: 'center'
          }}>
          <HeavyLabel
            label={`〒${this.state.myShop.postal.substring(0, 3)}-${this.state.myShop.postal.substring(3, 7)}`}
            style={{color: Colors.white}}
          />
          <HeavyLabel
            label={this.state.myShop.address}
            style={{color: Colors.white, marginLeft: 20, width: 200}}
          />
        </View>
        <Text
          style={[
            TextStyles.whiteText,
            // TextStyles.normalText,
            {textAlign: 'center', paddingHorizontal: 20, lineHeight: 25},
          ]}>
          ご来店予約・お問い合わせはお電話にて承ります。{'\n'}
          下記のお電話までご連絡ください。
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 30,
          }}>
          <HeavyLabel
            label={'TEL:'}
            style={[{color: Colors.white, lineHeight: 30}, TextStyles.largeText]}
          />
          <Ripple>
            <HeavyLabel
              label={this.state.myShop.tel_no}
              style={[
                {color: Colors.white, lineHeight: 30},
                TextStyles.largeText,
                TextStyles.underline,
              ]}
            />
          </Ripple>
        </View>
      </LoginTemplate>
    );
  }
}
