import React, {Component} from 'react';
import MainScreenTheme from '../../components/controller/MainScreenTheme';
import Colors from '../../constants/Colors';
import TextStyles from '../../constants/TextStyles';
import {View, Text, Image, Alert, TouchableWithoutFeedback} from 'react-native';
import {MessageText, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../constants/AppConstants';
import {alertNetworkError, Net, requestPost} from '../../utils/APIUtils';
import GlobalState from '../../mobx/GlobalState';
import AsyncStorage from '@react-native-community/async-storage';
import HeavyLabel from '../../components/label/heavyLabel';
import Ripple from 'react-native-material-ripple';

export default class MarketSearchMarketSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {cityList: [], shopList: []};
  }
  componentDidMount() {
    requestPost(Net.marketSearch.getShopByProvince, {
      province: this.props.navigation.state.params.province,
    })
      .then(json => {
        if (json.result === Net.error.E_OK) {
          this.setState({cityList: json.cityList, shopList: json.shopList});
        }
      })
      .catch(err => alertNetworkError(err));
  }

  render() {
    return (
      <MainScreenTheme
        backButton={true}
        menuButton={true}
        headerImage={true}
        backColor={Colors.black}>
        <View
          style={{
            backgroundColor: Colors.black,
            justifyContent: 'center',
            height: 80,
          }}>
          <Text
            style={[
              {textAlign: 'center', fontSize: 25},
              TextStyles.whiteText,
              TextStyles.bold,
            ]}>
            店舗検索 【エリアから探す】
          </Text>
          <Text
            style={[
              {textAlign: 'center', fontSize: 25},
              TextStyles.whiteText,
              TextStyles.bold,
            ]}>
            {this.props.navigation.state.params.province}
          </Text>
        </View>
        {this.state.cityList.map((city, index) => {
          return (
            <View>
              <HeavyLabel
                style={{color: Colors.white}}
                label={'[' + city + ']'}
              />
              {this.state.shopList[index].map(shop => {
                return (
                  <Ripple
                    onPress={() => {
                      this.props.navigation.navigate(
                        'MarketSearchMarketDetail',
                        {
                          passParam: shop,
                        },
                      );
                    }}>
                    <HeavyLabel
                      style={[{color: Colors.white}, TextStyles.underline]}
                      label={shop.name}
                    />
                  </Ripple>
                );
              })}
            </View>
          );
        })}
      </MainScreenTheme>
    );
  }
}
