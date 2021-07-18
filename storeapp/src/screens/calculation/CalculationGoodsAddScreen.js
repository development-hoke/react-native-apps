import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableHighlight,
  Image,
  FlatList, TextInput, Alert,
} from 'react-native';
import ButtonEx from '../../components/button/ButtonEx';
import MyStyles from '../../constants/MyStyles';
import {Net, requestPost, alertNetworkError} from '../../utils/ApiUtils';
import Ripple from 'react-native-material-ripple';
import GlobalState from '../../mobx/GlobalState';
import { ESTIMATE_ITEMS } from '../../constants/AppConstants';

const styles = StyleSheet.create({

});

export default class CalculationGoodsAddScreen extends Component {
  state = {
    goodsKind: 1,
    modalVisible: false,
    goodsData: [],
    selected: {
      subs: []
    },
    selectedSub: {
      id: '',
      goods_id: '',
      name: '',
      price: 0,
    },
    faceKind: 0,
    phoneKind: 0,
    amount: '',
    price: '',
    description: '',
  }
  componentDidMount() {
    requestPost(Net.calculation_add.get, {}).then(json => {
      let goods = json.goodsData.map((item) => {
        return {
          ...item,
          subs: json.details.filter((sub) => sub.goods_id == item.id),
        }
      });
      this.setState({goodsData: goods});
    }).catch(err => {
      alertNetworkError(err);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selected != this.state.selected
      || prevState.selectedSub != this.state.selectedSub
      || prevState.amount != this.state.amount) {
      if (this.state.selected.id) {
        let cost = 0;
        if (this.state.selected.subs.length > 0 && this.state.selectedSub.id == '') return;
        if (this.state.selectedSub.id != '') {
          cost = Number.parseInt(this.state.selectedSub.price);
        } else {
          cost = Number.parseInt(this.state.selected.price);
        }
        this.setState({ price: cost * this.state.amount });
      }
    }
  }

  _renderGoods = (data) => {
    return (
      <Ripple
        id={data.item.index}
        style={{flex: 1}}
        onPress={() => {
          this.setState({selected: data.item, modalVisible: true});
        }}>
        <View style={{marginBottom: 20, display: 'flex', alignItems: 'center'}}>
          <Image
            source={{uri: data.item.image_path}}
            style={{height: 60, width: 60 ,margin: 10}}
            resizeMode={'contain'}
          />
          <Text style={{textAlign: 'center'}}>{data.item.name}</Text>
        </View>
      </Ripple>
    );
  };

  setFace(faceKind) {
    if (faceKind === this.state.faceKind) {
      this.setState({faceKind: 0});
    } else {
      this.setState({faceKind: faceKind});
    }
  }

  setPhone(phoneKind) {
    if (phoneKind === this.state.phoneKind) {
      this.setState({phoneKind: 0});
    } else {
      this.setState({phoneKind: phoneKind});
    }
  }
  toggleModal(visible, goods_id) {
    this.setState({modalVisible: visible});
  }
  setKind(goods_kind) {
    this.setState({goodsKind: goods_kind});
  }

  change_amount(amount) {
    this.setState({amount: amount});
  }

  add_goods() {
    if (this.state.amount === '' || this.state.amount === 0) {
      Alert.alert('施工商品追加', '数量を入力してください.');
      return;
    }
    if (this.state.price === '' || this.state.price === 0) {
      Alert.alert('施工商品追加', '金額を入力してください.');
      return;
    }
    let tmpList = GlobalState.carryingGoods[GlobalState.calculationSheet];
    let type;
    if (this.state.goodsKind === 1) {
      type = 'ハルトコーティング';
    } else if (this.state.goodsKind === 2) {
      type = 'ハルトコーティングtypeF';
    } else {
      type = 'その他';
    }
    let name = this.state.selected.name;
    if (this.state.selected.subs.length > 0) {
      name = `${name}(${this.state.selectedSub.name})`;
    }
    
    tmpList.push({
      type: type,
      name: name,
      other: this.state.description,
      amount: this.state.amount,
      price: this.state.price,
    });

    GlobalState.carryingGoods[GlobalState.calculationSheet] = tmpList;
    this.setState({ modalVisible: false });
    this.props.navigation.navigate('CalculationManager');
  }
  render() {
    return (
      <SafeAreaView style={{flex: 6, flexDirection: 'column'}}>
        <Modal transparent={true} visible={this.state.modalVisible}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View style={{...MyStyles.Modal, height: 400}}>
              <View style={MyStyles.modalCloseView}>
                <ButtonEx
                  icon={'times'}
                  iconSize={15}
                  style={{borderWidth: 0}}
                  onPress={() => {
                    this.toggleModal(!this.state.modalVisible);
                    this.setState({
                      selected: { subs: [] },
                      selectedSub: {
                        id: '',
                        goods_id: '',
                        name: '',
                        price: 0,
                      },
                      amount: '',
                      price: '',
                    })
                  }}
                />
              </View>
              <View style={{flex: 6, flexDirection: 'row'}}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                <View style={{flex: 2}}>
                  {this.state.selected.image_path != '' && (
                    <Image
                      source={{uri: this.state.selected.image_path}}
                      style={{marginRight: 10, width: 200, height: 200}}
                      resizeMode={'contain'}
                    />
                  )}
                </View>
                <View style={{flex: 1}}>
                  <Text style={{fontSize: 20, textAlign: 'center'}}>
                    {this.state.selected.name}
                  </Text>
                </View>
              </View>
              <View
                style={{ flex: 1, flexDirection: 'column' }}>
                <View style={{flexDirection: 'row', marginLeft: 35, flexWrap: 'wrap'}}>
                  {this.state.selected.subs.map(subitem => 
                    <ButtonEx
                      key={`subitem-${subitem.id}`}
                      onPress={() => {
                        this.setState({selectedSub: subitem})
                      }}
                      style={[
                        this.state.selectedSub.id == subitem.id && MyStyles.toggleColor,
                        {borderColor: '#000000', marginRight: 10, marginTop: 10, paddingLeft: 10, paddingRight: 10},
                      ]}
                      text={subitem.name}
                      textStyle={styles.typeButton}
                    />
                  )}
                </View>
                <View
                  style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{textAlign: 'right', marginRight: 10}}>備考</Text>
                  <TextInput
                    value={this.state.description}
                    onChangeText={text => this.setState({ description: text })}
                    keyboardType="default"
                    style={[MyStyles.input, {textAlign: 'right', flex: 2}]}
                  />
                  <Text style={{flex: 1, marginLeft: 10}}></Text>
                </View>
                <View
                  style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{textAlign: 'right', marginRight: 10}}>数量</Text>
                  <TextInput
                    value={this.state.amount.toLocaleString()}
                    onChangeText={text => {
                      this.change_amount(text);
                    }}
                    keyboardType="numeric"
                    style={[MyStyles.input, {textAlign: 'right', flex: 2}]}
                  />
                  <Text style={{flex: 1, marginLeft: 10}}>個/枚/本など</Text>
                </View>
                <View
                  style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{textAlign: 'right', marginRight: 10}}>金額</Text>
                  <TextInput
                    value={this.state.price.toLocaleString()}
                    onChangeText={text => {
                      this.setState({price: text});
                    }}
                    keyboardType="numeric"
                    style={[MyStyles.input, {flex: 2, textAlign: 'right'}]}
                  />
                  <Text style={{flex: 1, marginLeft: 10}}>円</Text>
                </View>
                <View style={{flexDirection: 'row', marginBottom: 20}}>
                  <ButtonEx
                    onPress={() =>
                      this.add_goods()
                    }
                    style={{paddingLeft: 30, paddingRight: 30}}
                    type={'primary'}
                    text={'追加する'}
                  />
                </View>
              </View>
            </View>
            </View>
          </View>
        </Modal>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            marginTop: 20,
            marginLeft: 20,
            marginRight: 20,
          }}>
          <ButtonEx
            onPress={() => this.props.navigation.navigate('Main')}
            style={{borderWidth: 0}}
            text={'TOP'}
            textStyle={{fontSize: 12}}
            styles={{marginLeft: 10}}
            icon={'home'}
            iconSize={30}
            vertical={true}
          />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            marginTop: 10,
            marginLeft: 50,
            marginRight: 50,
          }}>
          <View style={MyStyles.toggleContainer}>
            <ButtonEx
              onPress={() => {
                this.setKind(1);
              }}
              style={[
                {width: 200},
                this.state.goodsKind === 1 && MyStyles.toggleColor,
              ]}
              text={'ハルトコーティング'}
            />
          </View>
          <View style={MyStyles.toggleContainer}>
            <ButtonEx
              onPress={() => {
                this.setKind(2);
              }}
              style={[
                {width: 200},
                this.state.goodsKind === 2 && MyStyles.toggleColor,
              ]}
              text={'ハルトコーティングtypeF'}
            />
          </View>
          <View style={MyStyles.toggleContainer}>
            <ButtonEx
              onPress={() => {
                this.setKind(3);
              }}
              style={[
                {width: 200},
                this.state.goodsKind === 3 && MyStyles.toggleColor,
              ]}
              text={'その他'}
            />
          </View>
        </View>
        <View
          style={{
            flex: 6,
            marginLeft: 70,
            marginRight: 70,
            marginTop: 10,
          }}>
          <View style={{width: '100%', height: '100%'}}>
            <FlatList
              data={this.state.goodsData}
              renderItem={this._renderGoods}
              numColumns={4}
              style={{flex: 1}}
              // keyExtractor={(item) => item.index}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
