import React, {Component} from 'react';
import {
  View,
  Text,
  Picker,
  StyleSheet,
  Image,
  Alert,
  FlatList,
  TextInput,
  ScrollView,
  Platform
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ButtonEx from '../../components/button/ButtonEx';
import CheckBox from '../../components/button/CheckBox';
import MyStyles from '../../constants/MyStyles';
import {Net, requestPost, alertNetworkError} from '../../utils/ApiUtils';
import MainLayout from '../../components/container/MainLayout';
import GlobalState from '../../mobx/GlobalState';
import Ripple from 'react-native-material-ripple';
import RNPickerSelect from 'react-native-picker-select';

const styles = StyleSheet.create({
  container: {
    marginLeft: 20,
    marginRight: 20,
  },
  rightContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  leftContainer: {
    flex: 1,
    marginRight: 15,
    justifyContent: 'space-between',
  },
  typeButton: {
    fontSize: 10,
  },
  imageView: {
    borderColor: '#aaa',
    borderWidth: 1,
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  carryingKind_wrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFE699',
    position: 'absolute',
    borderRadius: 10,
  }
});

export default class CarryingRegisterScreen extends Component {
  state = {
    goods: [],
    bottleRemain: 0,
    bottleUse: 0,
    goods_name: '',
    carryingKind: 1,
    faceKind: 0,
    phoneKind: 0,
    price: 0,
    amount: 1,
    performer: '',
    imageData: [],
    selectedGoods: -1,
    selectedGoodsName: '',
    selectedSubGoods: [],
    toggleNotify: false,
    customer_id: '',
    serial_no: '',
  };

  componentDidMount() {
    const pad = (num, size) => {
      num = num.toString();
      while (num.length < size) num = "0" + num;
      return num;
    };
    requestPost(Net.carrying_register.index).then(json => {
      let goods = json.goods.map((item) => {
        return {
          ...item,
          subs: json.details.filter((sub) => sub.goods_id == item.id),
        }
      });
      this.setState({goods: goods});
      this.setState({serial_no: pad(json.serial, 10)});
    }).catch(err => {
      alertNetworkError(err);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedGoods != this.state.selectedGoods
      || prevState.selectedSubGoods != this.state.selectedSubGoods
      || prevState.amount != this.state.amount) {
      if (this.state.selectedGoods >= 0) {
        const obj = this.state.goods[this.state.selectedGoods];
        let cost = 0;
        if (obj.subs.length > 0) {
          this.state.selectedSubGoods.forEach((value) => {
            cost += Number.parseInt(value.price);
          })
        } else {
          cost = Number.parseInt(obj.price);
        }
        this.setState({ price: cost * this.state.amount });
      }
    }
  }

  _renderImage = ({item, index}) => {
    return (
      <Image
        key={index}
        source={{uri: item.uri}}
        style={{width: 140, height: 140, margin: 7}}
        resizeMode={'contain'}
      />
    );
  };

  select_sub_item(item) {
    const exist = this.state.selectedSubGoods.findIndex((value) => value.id === item.id);
    if (exist >= 0) {
      this.setState(prev => ({
        selectedSubGoods: prev.selectedSubGoods.filter((value) => value.id != item.id)
      }));
    } else {
      this.setState(prev => ({
        selectedSubGoods: [...prev.selectedSubGoods, item],
      }));
    }
  }

  add_library_image() {
    launchImageLibrary({mediaType: 'photo'}, (res) => {
      if (res.didCancel || res.errorCode) {
        return;
      }
      this.setState(prev => ({
        imageData: [
          ...prev.imageData,
          {
            uri: Platform.OS === 'android' ? res.uri : res.uri.replace('file://', ''),
            path: Platform.OS === 'android' ? res.uri : res.uri.replace('file://', ''),
          }
        ]
      }));
    });
  }

  carrying_confirm() {
    if (!this.state.customer_id || this.state.customer_id === '') {
      Alert.alert('施工登録', 'お客様IDを入力してください.');
      return;
    }
    if (!this.state.serial_no || this.state.serial_no === '') {
      Alert.alert('施工登録', 'コーティング剤 シリアルNOを入力してください.');
      return;
    }
    if (
      (this.state.selectedGoods < 0 || this.state.selectedGoods === '')
    ) {
      Alert.alert('施工登録', '商品を選択してください.');
      return;
    }
    if (!this.state.amount || this.state.amount === '') {
      Alert.alert('施工登録', '数量を入力してください.');
      return;
    }
    if (!this.state.price || this.state.price === '') {
      Alert.alert('施工登録', '金額を入力してください.');
      return;
    }
    
    var tmpGoods = this.state.goods[this.state.selectedGoods];
    this.setState({selectedGoodsName: tmpGoods.name});
    console.log(this.state.selectedSubGoods.map(item => item.name).join(' '));

    this.props.navigation.navigate('CarryingRegisterConfirm', {
      customer_id: this.state.customer_id,
      serial_no: this.state.serial_no,
      goods_name: this.state.goods_name,
      carryingKind: this.state.carryingKind,
      faceKind: this.state.faceKind,
      phoneKind: this.state.phoneKind,
      price: this.state.price,
      amount: this.state.amount,
      performer: this.state.performer,
      imageData: this.state.imageData,
      selectedGoods: this.state.selectedGoods,
      selectedGoodsName: tmpGoods.name,
      selectedSubs: this.state.selectedSubGoods.map(item => item.name).join(' '),
      toggleNotify: this.state.toggleNotify,
    });
  }

  render() {
    return (
      <MainLayout
        homeCallback={() => this.props.navigation.navigate('Main')}
        title={'施工登録'}
        rightHeader={
          <Ripple style={{ width: 48, height: 48 }} onPress={() => {
            this.props.navigation.navigate('ScanCustomer', {
              onGoBack: () => {
                this.setState({ customer_id: GlobalState.detectedId });
              }
            })
          }}>
            <Image style={{ width: '100%', height: '100%' }} source={require('../../../assets/camera.png')}/>
          </Ripple>
        }>
        <ScrollView style={{flex: 1, flexDirection: 'column', padding: 15}}>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Text style={{marginLeft: 10, flex: 1}}>お客様ID</Text>
            <Text style={{marginLeft: 10, flex: 1}}>受付担当者</Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: 3}}>
            <TextInput
              value={this.state.customer_id}
              onChangeText={text => {
                this.setState({customer_id: text});
              }}
              style={[MyStyles.input, {flex: 1, marginRight: 10}]}
            />
            <TextInput
              value={this.state.performer}
              onChangeText={text => {
                this.setState({performer: text});
              }}
              style={[MyStyles.input, {flex: 1, marginLeft: 10}]}
            />
          </View>
          <View style={{flexDirection: 'row', marginTop: 20}}>
            <Text style={{marginLeft: 10, flex: 1}}>コーティング剤 シリアルNO.</Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: 3}}>
            <TextInput
              value={this.state.serial_no}
              onChangeText={text => {
                this.setState({serial_no: text});
              }}
              style={[MyStyles.input, {flex: 1, marginRight: 30}]}
            />
            <Text style={{flex: 1}}></Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: 20, justifyContent: 'center'}}>
            <Ripple
              style={{ width: 164, height: 57 }}
              onPress={() => this.setState({ carryingKind: 1 })}
            >
              <Image
                source={require('../../../assets/carrying-haruto.jpg')}
              />
              <View
                style={{
                  ...styles.carryingKind_wrapper,
                  opacity: this.state.carryingKind == 1 ? 0.5 : 0
                }}
              />
            </Ripple>
            <Ripple
              style={{ width: 164, height: 57, marginLeft: 20}}
              onPress={() => this.setState({ carryingKind: 2 })}
            >
              <Image
                source={require('../../../assets/carrying-f.jpg')}
              />
              <View
                style={{
                  ...styles.carryingKind_wrapper,
                  opacity: this.state.carryingKind == 2 ? 0.5 : 0
                }}
              />
            </Ripple>
          </View>
          <View style={[MyStyles.input, {marginTop: 20, width: 500, paddingTop: 6}]}>
            <RNPickerSelect
              onValueChange={value => {
                this.setState({selectedGoods: value});
                this.setState({selectedSubGoods: []});
                if (value >= 0) {
                  this.setState({goods_name: this.state.goods[value].name});
                }
              }}
              items = {this.state.goods.map((item, idx) => ({label: item.name, value: idx}))}
              placeholder={{
                label: "施工商品を選択",
                value: -1
              }}
            />
          </View>
          <TextInput
            onChangeText={text => {
              this.setState({goods_name: text});
            }}
            style={[MyStyles.input, {marginTop: 20, width: 500}]}
            placeholder="品名"
          />
          <View style={{flexDirection: 'row', justifyContent: 'flex-start', marginTop: 20}}>
            {this.state.selectedGoods >= 0 && this.state.goods[this.state.selectedGoods].subs.map((item) => 
              <ButtonEx
                key={item.id}
                onPress={() => this.select_sub_item(item)}
                style={[
                  this.state.selectedSubGoods.findIndex((value) => value.id === item.id) >= 0 && MyStyles.toggleColor,
                  {marginRight: 10},
                ]}
                text={item.name}
                textStyle={styles.typeButton}
              />
            )}
          </View>
          <View
            style={[
              styles.content,
              {flexDirection: 'row', alignItems: 'center', marginTop: 20},
            ]}>
            <View style={[MyStyles.input, {width: 100, paddingTop: 6}]}>
              <RNPickerSelect
                onValueChange={value => {
                  this.setState({amount: value});
                }}
                items = {[...Array(10).keys()].map(
                  (_, idx) => ({
                    label: (idx + 1).toString(),
                    value: idx + 1,
                  })
                )}
                value={this.state.amount}
              />

            </View>
            <Text style={{marginLeft: 10, flex: 1}}>台</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <TextInput
              value={Math.round(this.state.price * 1.1).toString()}
              onChangeText={text => {
                this.setState({price: text});
              }}
              keyboardType="numeric"
              style={[MyStyles.input, {width: 200, textAlign: 'right'}]}
            />
            <Text style={{flex: 1, marginLeft: 10}}> 円(税込) 〔{Math.round(this.state.price)}円 税抜き〕</Text>
          </View>
          <View style={styles.imageView}>
            <FlatList
              data={this.state.imageData}
              renderItem={this._renderImage}
              style={{height: 150}}
              horizontal={true}
              keyExtractor={(item, index) => `carrying-img-${index}`}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            <ButtonEx
              onPress={() => this.add_library_image()}
              style={{borderWidth: 0}}
              icon={'paperclip'}
              iconSize={20}
            />
            <Text style={{marginRight: 10}} onPress={() => this.add_library_image()}>ライブラリから選択</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <CheckBox
              label={'3日後にWハルト通知する'}
              checkBox_size={30}
              space_size={10}
              onPress={isChecked => {
                this.setState({toggleNotify: isChecked});
              }}
            />
          </View>
          <View style={{alignItems: 'center', marginVertical: 20}}>
            <ButtonEx
              onPress={() => {
                this.carrying_confirm();
              }}
              text={'次へ'}
              type={'primary'}
              style={{width: 200}}
            />
          </View>
        </ScrollView>
      </MainLayout>
    );
  }
}