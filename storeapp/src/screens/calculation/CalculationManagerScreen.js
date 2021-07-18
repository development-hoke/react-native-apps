import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableHighlight,
  FlatList,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import Ripple from 'react-native-material-ripple';
import RNPrint from 'react-native-print';
import ViewShot from "react-native-view-shot";
import ImgToBase64 from 'react-native-image-base64';

import ButtonEx from '../../components/button/ButtonEx';
import GlobalState from '../../mobx/GlobalState';
import MyStyles from '../../constants/MyStyles';
import {alertNetworkError, Net, requestPost} from '../../utils/ApiUtils';

const styles = StyleSheet.create({
  tableLeftHeader: {
    flex: 2,
    justifyContent: 'center',
    backgroundColor: '#BFBFBF',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default class CalculationManagerScreen extends Component {
  state = {
    firstName: '',
    lastName: '',
    nameToggle: false,
    calcSheet: 0,
    goodsData: [],
    sum1: 0,
    sum2: 0,
    name: '',
    tel_no: '',
    code: '',
    memberId: 0,
    modalVisible: false,
    qrVisible: false,
    customer_name: '',
    selectedPrinter: null,
  };
  componentDidMount() {
    this.refresh = this.props.navigation.addListener('willFocus', () => {
      this.setState({goodsData: GlobalState.carryingGoods[this.state.calcSheet]});
      let sum1 = 0;
      GlobalState.carryingGoods[0].map((item, idx) => {
        sum1 = sum1 + parseFloat(item.price);
      });
      let sum2 = 0;
      GlobalState.carryingGoods[1].map((item, idx) => {
        sum2 = sum2 + parseFloat(item.price);
      });
      this.setState({sum1: sum1.toString()});
      this.setState({sum2: sum2.toString()});
      // if (this.state.qrVisible === true) {
      //   this.setState({
      //     modalVisible: true,
      //     qrVisible: false,
      //   });
      //   if (this.props.navigation.state.params) {
      //     this.setState({
      //       code: this.props.navigation.state.params.code,
      //     });
      //   }
      // }
    });
  };

  componentWillUnmount() {
    this.refresh.remove();
  };

  toggleName() {
    if (this.state.nameToggle === false)
      this.setState({modalVisible: true});
    else {
      if (this.state.goodsData.length === 0)
      {
        Alert.alert('見積り', '商品を追加してください.');
        return;
      }
      requestPost(Net.calculation.save, {
        shop_id: GlobalState.shopId,
        customer_id: this.state.memberId,
        sum1: this.state.sum1,
        sum2: this.state.sum2,
        goods: this.state.goodsData,
      })
        .then(json => {
          Alert.alert('見積り', '見積を保存しました.');
        })
        .catch(err => {
          alertNetworkError(err);
        });
    }
  }

  setSheet(sheet) {
    this.setState({calcSheet: sheet});
    this.setState({goodsData: GlobalState.carryingGoods[sheet]});
  }

  showDeleteAlert(data) {
    Alert.alert(
      "警告",
      "項目を削除しますか？",
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "はい",
          onPress: () => {
            console.log(data.index);
            const sheet = this.state.calcSheet;
            GlobalState.carryingGoods[sheet] = GlobalState.carryingGoods[sheet].filter((item, idx) => idx != data.index);
            this.setState({ goodsData: GlobalState.carryingGoods[sheet] });
          },
          style: "default"
        }
      ],
      {
        cancelable: true
      }
    );
  }

  _renderGoods = (data) => {
    return (
      <Ripple style={{flexDirection: 'row'}} onLongPress={(e) => this.showDeleteAlert(data)}>
        <Text style={[MyStyles.tableContent, {flex: 2}]}>{data.item.type}</Text>
        <Text style={[MyStyles.tableContent, {flex: 3}]}>{data.item.name}</Text>
        <Text style={[MyStyles.tableContent, {flex: 1}]}>{data.item.other}</Text>
        <Text style={[MyStyles.tableContent, {flex: 1}]}>{data.item.amount}</Text>
        <Text style={[MyStyles.tableContent, {flex: 1}]}>{data.item.price}円</Text>
      </Ripple>
    );
  };

  searchMember = () => {
    if (!this.state.code || this.state.code === '') {
      if (!this.state.name || this.state.name === '') {
        Alert.alert('会員検索', '氏名を入力してください.');
        return;
      }
      if (!this.state.tel_no || this.state.tel_no === '') {
        Alert.alert('会員検索', '電話番号を入力してください.');
        return;
      }
    }
    requestPost(Net.member.search, {
      name: this.state.name,
      tel_no: this.state.tel_no,
      code: this.state.code,
    })
      .then(json => {
        if (json.result === Net.error.E_NO_MEMBER)
          Alert.alert('検索失敗', '検索結果がないです.');
        else if (json.result === Net.error.E_TOO_MANY_MEMBER)
          Alert.alert('検索失敗', '検索された会員があまりにも多いです.');
        else {
          this.setState({
            memberId: json.memberId,
            firstName: json.first_name,
            lastName: json.last_name,
            modalVisible: false,
            nameToggle: true,
          });
        }
      })
      .catch(err => {
        alertNetworkError(err);
      });
  };

  async printHTML(image) {
    passHtmltoPrinter = ({ imgData }) => {
      return `<img src="data:image/png;base64, ${imgData}" width="1600" height="800">`
    }
    await RNPrint.print({
      html: passHtmltoPrinter({ imgData: image })
    });
  }

  selectPrinter = async () => {
    this.refs.viewShot.capture().then(uri => {
      ImgToBase64.getBase64String(uri).then(base64String => {
        this.printHTML(base64String)
      }).catch(err => console.log(err));
    })
  }

  render() {
    return (
      <SafeAreaView style={{flex: 6, flexDirection: 'column'}}>
        <Modal transparent={true} visible={this.state.modalVisible}>
          <View style={MyStyles.Modal}>
            <View style={MyStyles.modalCloseView}>
              <ButtonEx
                icon={'times'}
                iconSize={15}
                style={{borderWidth: 0}}
                onPress={() => {
                  this.setState({modalVisible: false});
                }}
              />
            </View>
            <View
              style={[
                styles.container,
                {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  margin: 20,
                },
              ]}>
              <View style={{flex: 1}}>
                <ButtonEx
                  text={'会員コード読み取り\n'}
                  icon={'qrcode'}
                  iconSize={80}
                  vertical={true}
                  type={'info'}
                  style={{flex: 1}}
                  onPress={() => {
                    this.setState({modalVisible: false});
                    this.setState({qrVisible: true});
                    this.props.navigation.navigate('QRScan', {
                      prevScreen: 'calcManager',
                    });
                  }}
                />
                <Text style={{marginTop: 20}}>会員番号</Text>
                <TextInput
                  style={[MyStyles.input]}
                  onChangeText={text => this.setState({code: text})}
                  value={this.state.code}
                />
              </View>
              <View
                style={{
                  borderRadius: 5,
                  borderWidth: 1,
                  flex: 1,
                  marginLeft: 10,
                  padding: 20,
                  justifyContent: 'center',
                }}>
                <Text>氏名</Text>
                <TextInput
                  style={[MyStyles.input, {marginTop: 10}]}
                  onChangeText={value => {
                    this.setState({name: value});
                  }}
                />
                <Text style={{marginTop: 20}}>電話番号</Text>
                <TextInput
                  style={[MyStyles.input, {marginTop: 10}]}
                  onChangeText={value => {
                    this.setState({tel_no: value});
                  }}
                />
              </View>
            </View>
            <View
              style={[
                {
                  marginTop: 15,
                  alignItems: 'flex-end',
                },
              ]}>
              <ButtonEx
                text={'検索'}
                style={{width: 100, marginBottom: 20, marginRight: 20}}
                type={'primary'}
                onPress={this.searchMember}
              />
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
          <View style={{flex: 1, alignItems: 'flex-start'}}>
            <ButtonEx
              onPress={() => this.props.navigation.navigate('Main')}
              style={{borderWidth: 0}}
              text={'TOP'}
              textStyle={{fontSize: 12, lineHeight: 12}}
              icon={'home'}
              iconSize={30}
              vertical={true}
            />
          </View>
          <View
            style={{
              flex: 4,
              alignItems: 'flex-end',
              marginTop: 10,
            }}>
            <ButtonEx
              style={{
                height: 40,
                paddingLeft: 20,
                paddingRight: 20,
              }}
              type={'info'}
              text={'印刷'}
              icon={'print'}
              iconSize={25}
              onPress={() => this.selectPrinter()}
            />
          </View>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            marginTop: 30,
            marginLeft: 20,
            marginRight: 20,
          }}>
          <View
            style={{ flex: 1, alignItems: 'flex-start' }}>
            <ButtonEx
              onPress={() => {
                GlobalState.carryingGoods = [[], []];
                this.setState({goodsData: [], sum1: 0, sum2: 0});
              }}
              style={{
                height: 40,
              }}
              type={'secondary'}
              text={'リセット'}
            />
          </View>
          <View
            style={{ flex: 1, alignItems: 'flex-end' }}>
            <ButtonEx
              style={{
                width: 160,
                height: 40,
              }}
              type={'primary'}
              onPress={() => {
                GlobalState.calculationSheet = this.state.calcSheet;
                this.props.navigation.navigate('CalculationGoodsAdd');
              }}
              text={'施工商品を追加'}
              icon={'plus'}
              iconSize={20}
            />
          </View>
        </View>
        <ViewShot ref="viewShot" style={{flex: 6}}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            marginLeft: 20,
            marginRight: 20,
            marginTop: 10,
          }}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 16}}>見積りシート</Text>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                margin: 15,
              }}>
              <TouchableHighlight
                style={{flex: 1}}
                onPress={() => {
                  this.setSheet(0);
                }}>
                <Text
                  style={[
                    {fontSize: 20, textAlign: 'center'},
                    this.state.calcSheet === 0 && {color: '#72A2CE'},
                  ]}>
                  ①
                </Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{flex: 1}}
                onPress={() => {
                  this.setSheet(1);
                }}>
                <Text
                  style={[
                    {fontSize: 20, textAlign: 'center'},
                    this.state.calcSheet === 1 && {color: '#72A2CE'},
                  ]}>
                  ②
                </Text>
              </TouchableHighlight>
            </View>
          </View>
          <View
            style={{
              flex: 4,
              flexDirection: 'row',
              flexWrap: 'nowrap',
              alignItems: 'center',
            }}>
            <View style={{width: 350, height: 50, borderBottomWidth: 2}}>
              <TextInput
                onChangeText={text => {
                  this.setState({customer_name: text});
                }}
                style={[{flex: 1, padding: 0, textAlign: 'center', fontSize: 25}]}
              />
            </View>
            <View style={{width: 50}}>
              <Text style={{fontSize: 25}}>様</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 5,
            flexDirection: 'column',
            marginTop: 20,
            marginLeft: 20,
            marginRight: 20,
          }}>
          <View style={{flex:5}}>
            <View
              style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[MyStyles.tableHeader, {flex: 2}]}>項目</Text>
              <Text style={[MyStyles.tableHeader, {flex: 3}]}>施工商品</Text>
              <Text style={[MyStyles.tableHeader, {flex: 1}]}>備考</Text>
              <Text style={[MyStyles.tableHeader, {flex: 1}]}>数量</Text>
              <Text style={[MyStyles.tableHeader, {flex: 1}]}>金額</Text>
            </View>
            <View
              style={{
                // flex: 5,
                alignItems: 'center',
              }}>
              <View style={{width: '100%', height: '100%'}}>
                <View
                  style={{
                    flex: 1,
                    width: '100%',
                    height: '100%',
                    flexDirection: 'column',
                  }}>
                  <FlatList
                    data={this.state.goodsData}
                    renderItem={this._renderGoods}
                    style={{flex: 1}}
                    keyExtractor={(item, index) => `${this.state.calcSheet}-${index}`}
                  />
                </View>
              </View>
            </View>
          </View>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Text style={[MyStyles.tableHeader, {flex: 12, fontSize: 18}]}>小計</Text>
            <TextInput
              onChangeText={text => {
                if (this.state.calcSheet === 0) {
                  this.setState({sum1: text});
                } else {
                  this.setState({sum2: text});
                }
              }}
              value={this.state.calcSheet === 0 ? this.state.sum1.toLocaleString() : this.state.sum2.toLocaleString()}
              keyboardType="numeric"
              style={[MyStyles.textInput, {flex: 3, textAlign: 'right', height: 60}]}
            />
            <Text style={[{flex: 1, fontSize: 16}]}>円</Text>
          </View>
        </View>
        </ViewShot>
      </SafeAreaView>
    );
  }
}
