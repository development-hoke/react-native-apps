import React, {Component} from 'react';
import {
  View,
  Modal,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableHighlight,
  FlatList,
  TextInput,
} from 'react-native';
import ButtonEx from '../../components/button/ButtonEx';
import MyStyles from '../../constants/MyStyles';
import 'moment/min/locales';
import Colors from '../../constants/Colors';
import TextStyles from '../../constants/TextStyles';
import CheckBox from '../button/CheckBox';
import {alertNetworkError, Net, requestPost} from '../../utils/ApiUtils';

export default class CalculationDetailModal extends Component {
  state = {
    visible: false,
    calulation_id: 0,
    sum1: 0,
    sum2: 0,
    name: '',
    calcSheet: 1,
    goodsData: [],
  };

  doModal = () => {
    this.setState({
      visible: true,
    });
  };

  _renderGoods = data => {
    return (
      <View style={{flexDirection: 'row'}}>
        <Text style={[MyStyles.tableContent, {flex: 2}]}>{data.item.type}</Text>
        <Text style={[MyStyles.tableContent, {flex: 3}]}>{data.item.name}</Text>
        <Text style={[MyStyles.tableContent, {flex: 1}]}>{data.item.other}</Text>
        <Text style={[MyStyles.tableContent, {flex: 1}]}>{data.item.amount}</Text>
        <Text style={[MyStyles.tableContent, {flex: 1}]}>{data.item.price}円</Text>
      </View>
    );
  };
  render() {
    return (
      <Modal
        transparent={true}
        visible={this.state.visible}
        animationType={'fade'}>
        <View style={[MyStyles.Modal, {marginTop: 30, marginBottom: 30}]}>
          <View style={MyStyles.modalCloseView}>
            <ButtonEx
              icon={'times'}
              iconSize={15}
              style={{borderWidth: 0}}
              onPress={() => {
                this.setState({visible: false});
              }}
            />
          </View>
          <SafeAreaView style={{flex: 1, flexDirection: 'column'}}>
            <View
              style={{
                height: 50,
                flexDirection: 'row',
                marginLeft: 20,
                marginRight: 20,
                marginTop: 30,
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
                      this.setState({calcSheet: 1});
                    }}>
                    <Text
                      style={[
                        {fontSize: 20, textAlign: 'center'},
                        this.state.calcSheet === 1 && {color: '#72A2CE'},
                      ]}>
                      ①
                    </Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    style={{flex: 1}}
                    onPress={() => {
                      this.setState({calcSheet: 2});
                    }}>
                    <Text
                      style={[
                        {fontSize: 20, textAlign: 'center'},
                        this.state.calcSheet === 2 && {color: '#72A2CE'},
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
                <View style={{width: 350, borderBottomWidth: 2}}>
                  <Text style={{fontSize: 30, textAlign: 'center'}}>{this.state.name}</Text>
                </View>
                <View style={{width: 50, borderBottomWidth: 2}}>
                  <Text style={{fontSize: 30}}>様</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                marginTop: 20,
                marginLeft: 20,
                marginRight: 20,
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={[MyStyles.tableHeader, {flex: 2}]}>項目</Text>
                <Text style={[MyStyles.tableHeader, {flex: 3}]}>施工商品</Text>
                <Text style={[MyStyles.tableHeader, {flex: 1}]}>備考</Text>
                <Text style={[MyStyles.tableHeader, {flex: 1}]}>数量</Text>
                <Text style={[MyStyles.tableHeader, {flex: 1}]}>金額</Text>
              </View>
              <View
                style={{
                  flex: 5,
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
                    />
                  </View>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <Text style={[MyStyles.tableHeader, {flex: 3, fontSize: 18}]}>小計</Text>
                <Text style={[{flex: 1, fontSize: 16, textAlign: 'center'}]}>{this.state.calcSheet === 1 ? this.state.sum1 : this.state.sum2} 円</Text>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    );
  }
}
