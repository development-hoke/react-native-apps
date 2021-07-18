import React, {Component} from 'react';
import {BackHandler, View, StyleSheet, Alert} from 'react-native';

import TextStyles from '../../constants/TextStyles';
import Colors from '../../constants/Colors';
import HeavyLabel from '../../components/label/heavyLabel';
import LoginButton from '../../components/button/loginButton';
import LoginTemplate from '../../components/loginTemplate';
import GlobalState from '../../mobx/GlobalState';
import {requestPost, Net, alertNetworkError, showToast} from '../../utils/ApiUtils';
import Toast from 'react-native-root-toast';
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
    console.log(GlobalState.deviceId);
    if (this.state.shop === '' || this.state.shop === null) {
      showToast('店鋪を選択してください.');
    } else {
      requestPost(Net.auth.signup, {
        store: this.state.shop,
        deviceId: GlobalState.deviceId,
      })
        .then(json => {
          if (json.result === Net.error.E_SHOP_DEVICE_ALREADY_EXIST)
            Alert.alert('登録失敗', '装置がもう登録されました.');
          else {
            Alert.alert(
              '登録成功',
              '申請しました.　許可された後にログインしてください',
            );
            this.props.navigation.navigate('Login');
          }
        })
        .catch(err => {
          alertNetworkError(err);
        });
    }
  };

  getProvinceList = () => {
    requestPost(Net.auth.getProvinceList, null)
      .then(json => {
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
            province: this.props.navigation.state.params
              ? this.props.navigation.state.params.selectedProvince
              : '',
          });
        }
      })
      .catch(err => {
        alertNetworkError(err);
      });
  };

  componentDidMount() {
    this.getProvinceList();
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
            label={'ログインする店舗を選択してください'}
            style={[
              TextStyles.navHeaderTitle,
              {color: Colors.orange, fontSize: 26},
            ]}
          />
          <HeavyLabel
            label={'都道府県'}
            style={{color: Colors.black, marginTop: 5, marginBottom: 2, fontSize: 18}}
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
            style={{color: Colors.black, marginTop: 5, marginBottom: 2, fontSize: 18}}
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
            style={{color: Colors.black, marginTop: 5, marginBottom: 2, fontSize: 18}}
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
            onPress={this.goLogin}
            text={'確認'}
            buttonType={'orange'}
            textStyle={TextStyles.largeText}
            style={{height: 40, marginBottom: 20}}
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
    height: 40,
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
