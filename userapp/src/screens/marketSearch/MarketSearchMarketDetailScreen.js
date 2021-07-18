import React, {Component} from 'react';
import MainScreenTheme from '../../components/controller/MainScreenTheme';
import Colors from '../../constants/Colors';
import TextStyles from '../../constants/TextStyles';
import {View, Text, Image, Alert, Linking} from 'react-native';
import LoginButton from '../../components/button/loginButton';
import {
  ASYNC_PARAMS,
  MessageText,
  SCREEN_WIDTH,
} from '../../constants/AppConstants';
import {alertNetworkError, Net, requestPost} from '../../utils/APIUtils';
import GlobalState from '../../mobx/GlobalState';
import AsyncStorage from '@react-native-community/async-storage';

export default class MarketSearchMarketDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shop: this.props.navigation.state.params.passParam,
    };
  }

  componentDidMount() {
    console.log(this.props.navigation.state.params.passParam);
  }

  registerMyShop = (customerID, shopID) => {
    requestPost(Net.marketSearch.registerMyShop, {
      customerID: customerID,
      shopID: shopID,
    }).then(json => {
      Alert.alert(MessageText.MyShopRegister_Success);
      // AsyncStorage.setItem(ASYNC_PARAMS.MY_SHOP_ID, shopID.toString());
      GlobalState.myShop = shopID;
    }).catch(err => alertNetworkError(err));
  };
  render() {
    const { shop } = this.state;
    return (
      <MainScreenTheme
        backButton={true}
        menuButton={true}
        headerImage={true}
        backColor={Colors.black}>
        <Text
          style={[
            TextStyles.hugeText,
            TextStyles.bold,
            TextStyles.whiteText,
            {marginTop: 20, marginBottom: 10},
          ]}>
          {this.state.shop.name}
        </Text>
        <Image
          source={{uri: this.state.shop.image_path}}
          resizeMode={'contain'}
          style={{
            width: '100%',
            height: ((SCREEN_WIDTH - 30) / 4) * 3,
            marginBottom: 10,
          }}
        />
        <Text style={[TextStyles.whiteText, TextStyles.normalText]}>
          {this.state.shop.address}
        </Text>
        <Text
          style={[
            TextStyles.underline,
            TextStyles.normalText,
            {color: Colors.dark_blue, marginTop: 5},
          ]}>
          TEL:{this.state.shop.tel_no}
        </Text>
        <LoginButton
          onPress={() => {
            if (shop.docomo == 1) {
              Linking.openURL(shop.link);
            } else {
              this.props.navigation.popToTop();
              this.props.navigation.navigate('MarketReserveDetail', {
                shop: this.state.shop,
              });
            }
          }}
          text={'ご来店予約'}
          buttonType={'blue'}
          textStyle={TextStyles.largeText}
          style={{height: 60, marginHorizontal: 10}}
        />
        <LoginButton
          onPress={() => {
            requestPost(Net.marketSearch.getMyShop, {
              customerID: GlobalState.myInfo.id,
            })
              .then(json => {
                if (json.result === Net.error.E_NO_MY_SHOP) {
                  this.registerMyShop(
                    GlobalState.myInfo.id,
                    this.state.shop.id,
                  );
                } else {
                  Alert.alert(
                    MessageText.MyShopRegister_Title,
                    MessageText.MyShopRegister_Content,
                    [
                      {
                        text: MessageText.DialogButton_Cancel,
                        onPress: () => {},
                        style: 'cancel',
                      },
                      {
                        text: MessageText.DialogButton_OK,
                        onPress: () => {
                          this.registerMyShop(
                            GlobalState.myInfo.id,
                            this.state.shop.id,
                          );
                        },
                      },
                    ],
                  );
                }
              })
              .catch(err => alertNetworkError(err));
          }}
          text={'マイショップに登録'}
          buttonType={'orange'}
          textStyle={TextStyles.largeText}
          style={{height: 60, marginHorizontal: 10, marginBottom: 20}}
        />
      </MainScreenTheme>
    );
  }
}
