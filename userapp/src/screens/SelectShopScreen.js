import React, {Component} from 'react';
import {BackHandler, View, StyleSheet, Alert} from 'react-native';

import TextStyles from '../constants/TextStyles';
import Colors from '../constants/Colors';
import HeavyLabel from '../components/label/heavyLabel';
import LoginButton from '../components/button/loginButton';
import LoginTemplate from '../components/loginTemplate';
import GlobalState from '../mobx/GlobalState';
import {requestPost, Net, alertNetworkError} from '../utils/APIUtils';
import {MessageText, SCREEN_WIDTH} from '../constants/AppConstants';
import Toast from 'react-native-root-toast';
import Common from '../utils/Common';
import Icon from 'react-native-vector-icons/FontAwesome';
import RNPickerSelect from 'react-native-picker-select';

class SelectShopScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null,
      provinceList: [],
      province: '',
      cityList: [],
      city: '',
      shopList: [],
      shop: '',
    };
  }
  goLogin = () => {
    this.props.navigation.navigate('Login');
  };
  goLicense = () => {
    if (this.state.shop === '' || this.state.shop === null) {
      Common.showToast(MessageText.ShopSelect);
    } else {
      GlobalState.myShop = this.state.shop;
      this.props.navigation.navigate('AgreePolicy');
    }
  };
  getProvinceList = () => {
    requestPost(Net.auth.getProvinceList, null).then(json => {
      if (json.result === Net.error.E_OK) {
        let provinceList = [];
        if (json.provinceList && json.provinceList.length > 0) {
          json.provinceList.map(item => {
            provinceList.push({
              label: item.name_p,
              value: item.name_p,
            });
          });
        }
        this.setState({
          provinceList: provinceList,
          province: '',
        });
        this.getCurrentProvince(provinceList);
      }
    }).catch(err => {
      alertNetworkError(err);
    });
  };
  getCurrentProvince = async (provinceList) => {
    const url = 'http://ip-api.com/json/?lang=ja';
    GlobalState.isLoading = true;
    await fetch(url).then(response => response.json()).then(data => {
      console.log(provinceList.filter((item) => item.value == data.regionName));
      this.setState({
        province: data.regionName
      })
    }).catch(error => {
      GlobalState.isLoading = false;
      throw error;
    });
    GlobalState.isLoading = false;
  }

  handleBackPress = () => {
    this.interval = setTimeout(() => {
      this._backPress = 0;
      clearInterval(this.interval);
    }, 1000);
    this._backPress += 1;
    if (this._backPress <= 1) {
      Toast.show(MessageText.ExitApp, {
        duration: 500,
        backgroundColor: Colors.grey,
      });
      return true;
    }
    BackHandler.exitApp();
  };
  componentDidMount() {
    this.getProvinceList();
    this._backPress = 0;
    this.navigationFocusLisener = this.props.navigation.addListener(
      'willFocus',
      () => {
        this.backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          this.handleBackPress,
        );
      },
    );
    this.navigationBlurListener = this.props.navigation.addListener(
      'willBlur',
      () => {
        if (this.backHandler) this.backHandler.remove();
      },
    );
  }
  componentWillUnmount() {
    this.navigationBlurListener.remove();
    this.navigationFocusLisener.remove();
    if (this.backHandler) {
      if(this.backHandler) this.backHandler.remove();
    }
  }
  onProvinceChange = value => {
    this.setState({province: value});
    if (value !== '' && value !== null) {
      requestPost(Net.auth.getCityListByProvince, {
        name_province: value,
      })
        .then(json => {
          if (json.result === Net.error.E_OK) {
            let cityList = [];
            if (json.cityList && json.cityList.length > 0) {
              json.cityList.map(item => {
                cityList.push({label: item.name_c, value: item.name_c});
              });
              this.setState({cityList: cityList, city: cityList[0].value});
            }
          }
        })
        .catch(err => alertNetworkError(err));
    } else {
      this.setState({cityList: [], city: ''});
    }
  };
  onCityChange = value => {
    this.setState({city: value});
    if (value !== '' && value !== null) {
      requestPost(Net.auth.getShopListByCity, {name_city: value})
        .then(json => {
          if (json.result === Net.error.E_OK) {
            if (json.shopList && json.shopList.length > 0) {
              let shopList = [];
              json.shopList.map(item => {
                shopList.push({
                  value: item.id,
                  label: item.name,
                });
              });
              this.setState({
                shopList: shopList,
                shop: shopList[0].value,
              });
            }
          }
        })
        .catch(err => alertNetworkError(err));
    } else {
      this.setState({shopList: [], shop: ''});
    }
  };
  render() {
    return (
      <LoginTemplate noWhitePane={true}>
        <View style={{marginHorizontal: 20}}>
          <HeavyLabel
            label={'お気に入り店舗を選択してください'}
            style={[
              TextStyles.navHeaderTitle,
              {color: Colors.orange, fontSize: 26},
            ]}
          />
          <HeavyLabel
            label={'都道府県'}
            style={{color: Colors.white, marginTop: 10, marginBottom: 10}}
          />
          <RNPickerSelect
            placeholder={{
              label: '都道府県を選択',
              value: '',
              color: Colors.brownish_grey_60,
            }}
            style={{...pickerSelectStyles}}
            value={this.state.province}
            useNativeAndroidPickerStyle={false}
            Icon={() => {
              return (
                <Icon
                  name={'sort-down'}
                  size={30}
                  color={Colors.grey}
                  style={{paddingRight: 10}}
                />
              );
            }}
            onValueChange={value => {
              this.onProvinceChange(value);
            }}
            items={this.state.provinceList}
          />
          <HeavyLabel
            label={'市区町村'}
            style={{color: Colors.white, marginTop: 10, marginBottom: 10}}
          />
          <RNPickerSelect
            placeholder={{
              label: '市区町村を選択',
              value: '',
              color: Colors.brownish_grey_60,
            }}
            style={{...pickerSelectStyles}}
            value={this.state.city}
            useNativeAndroidPickerStyle={false}
            Icon={() => {
              return (
                <Icon
                  name={'sort-down'}
                  size={30}
                  color={Colors.grey}
                  style={{paddingRight: 10}}
                />
              );
            }}
            onValueChange={value => {
              this.onCityChange(value);
            }}
            items={this.state.cityList}
          />
          <HeavyLabel
            label={'店舗を選択'}
            style={{color: Colors.white, marginTop: 10, marginBottom: 10}}
          />
          <RNPickerSelect
            placeholder={{
              label: '店舗を選択',
              value: '',
              color: Colors.brownish_grey_60,
            }}
            style={{...pickerSelectStyles}}
            value={this.state.shop}
            useNativeAndroidPickerStyle={false}
            Icon={() => {
              return (
                <Icon
                  name={'sort-down'}
                  size={30}
                  color={Colors.grey}
                  style={{paddingRight: 10}}
                />
              );
            }}
            onValueChange={(value, index) => {
              this.setState({
                shop: value,
              });
            }}
            items={this.state.shopList}
          />
          <LoginButton
            onPress={this.goLicense}
            text={'確認'}
            buttonType={'orange'}
            textStyle={TextStyles.largeText}
            style={{height: 80}}
          />
          <LoginButton
            onPress={this.goLogin}
            style={{
              marginTop: 30,
              marginBottom: 30,
              height: 120,
            }}
            borderRadius={10}
            textStyle={TextStyles.buttonLabel}
            text={'ログイン\n' + '既に登録済の方はこちら'}
            buttonType={'white'}
          />
        </View>
      </LoginTemplate>
    );
  }
}
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    backgroundColor: Colors.white,
    borderColor: '#767171',
    borderWidth: 2,
    fontSize: 14,
    height: 45,
    paddingHorizontal: 15,
  },
  inputAndroid: {
    backgroundColor: Colors.white,
    borderColor: '#767171',
    borderWidth: 2,
    fontSize: 14,
    height: 44,
    paddingHorizontal: 15,
  },
});
export default SelectShopScreen;
