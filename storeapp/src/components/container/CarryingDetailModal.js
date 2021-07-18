import React, {Component} from 'react';
import {
  View,
  Modal,
  Image,
  Text,
  ScrollView, FlatList,
} from 'react-native';
import ButtonEx from '../../components/button/ButtonEx';
import MyStyles from '../../constants/MyStyles';
import 'moment/min/locales';
import Colors from '../../constants/Colors';
import TextStyles from '../../constants/TextStyles';
import CheckBox from '../button/CheckBox';

export default class CarryingDetailModal extends Component {
  state = {
    visible: false,
    modal_data: {},
    imageData: [],
    subName: '',
  };

  doModal = () => {
    this.setState({
      visible: true,
    });
  };

  _renderImage = data => {
    return (
      <Image
        source={{uri: data.item.image_path}}
        style={{width: 120, height: 120, margin: 7}}
        resizeMode={'contain'}
      />
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
          <ScrollView>
            <View
              style={{
                alignItems: 'center',
                flex: 1,
                backgroundColor: Colors.white,
                marginBottom: 10
              }}>
              <Text
                style={[
                  TextStyles.largeText,
                  TextStyles.bold,
                  {
                    textAlign: 'center',
                    marginTop: 20,
                    lineHeight: 50,
                    fontSize: 26,
                  },
                ]}>
                ハルトコーティング{'\n'}施工証明書
              </Text>
              <Image
                source={require('../../../assets/harutogw-L.jpg')}
                resizeMode={'contain'}
                style={{height: 100}}
              />
              <Text
                style={[
                  {
                    textAlign: 'center',
                    marginTop: 60,
                    fontSize: 20,
                  },
                ]}>
                【施工日】     {this.state.modal_data.date}
              </Text>
              <Text style={{textAlign: 'center', marginTop: 10, fontSize: 20,}}>
                施工店舗      {this.state.modal_data.shop_name}
              </Text>
              <Text style={{textAlign: 'center', marginTop: 10}}>
                シリアルNO. {this.state.modal_data.serial_no}
              </Text>
              <Text style={{textAlign: 'center', marginTop: 10}}>
                受付担当者 {this.state.modal_data.performer}
              </Text>
              <Text style={{textAlign: 'center', fontSize: 20, marginTop: 10}}>
                申込番号 {this.state.modal_data.id}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: Colors.white,
                marginBottom: 10,
                paddingHorizontal: 50,
              }}>
              <Text style={{textAlign: 'center', fontSize: 20, marginTop: 20}}>
                ■ハルトコーティング 申込確認書
              </Text>
              <Text style={{marginTop: 30}}>施工品：{this.state.modal_data.goods}{'\t\t'}品名 : {this.state.subName}{'\t\t'}数量 : {this.state.modal_data.amount}</Text>
              <Text style={{marginTop: 5}}>お支払い金額 ¥{Math.round(this.state.modal_data.price)}円(税込み)</Text>
              <Text style={{fontWeight: 'bold', marginTop: 30}}>注意事項・確認事項</Text>
              <View style={MyStyles.checkStyle}>
                <Text style={{marginRight: 20}}>1</Text>
                <CheckBox
                  label={
                    'ハルトコーディングには抗ウィルス・抗菌の作用がありますが、全てのウィルスや菌を除去するわけではありません。'
                  }
                  disabled={true}
                  isActive={this.state.modal_data.c1 === 1}
                  checkBox_size={20}
                  space_size={10}
                />
              </View>
              <View style={MyStyles.checkStyle}>
                <Text style={{marginRight: 20}}>2</Text>
                <CheckBox
                  label={
                    'ハルトコーディングは、病気の予防を保証するものではありません。'
                  }
                  isActive={this.state.modal_data.c2 === 1}
                  disabled={true}
                  checkBox_size={20}
                  space_size={10}
                />
              </View>
              <View style={MyStyles.checkStyle}>
                <Text style={{marginRight: 20}}>3</Text>
                <CheckBox
                  label={
                    '施工面にアルコールやエタノール成分が付着すると、ハルトコーディングの効果が失われる場合があります。'
                  }
                  isActive={this.state.modal_data.c3 === 1}
                  disabled={true}
                  checkBox_size={20}
                  space_size={10}
                />
              </View>
              <View style={MyStyles.checkStyle}>
                <Text style={{marginRight: 20}}>4</Text>
                <CheckBox
                  label={
                    'ホコリや汚れの上から施工を行うと、ハルトコーディングの効果を十分に得られない場合があります。'
                  }
                  isActive={this.state.modal_data.c4 === 1}
                  disabled={true}
                  checkBox_size={20}
                  space_size={10}
                />
              </View>
              <View style={MyStyles.checkStyle}>
                <Text style={{marginRight: 20}}>5</Text>
                <CheckBox
                  label={
                    'ハルトコーディングの施工面は親水性（水に対する新和性が高い状態）になります。'
                  }
                  isActive={this.state.modal_data.c5 === 1}
                  disabled={true}
                  checkBox_size={20}
                  space_size={10}
                />
              </View>
              <View style={MyStyles.checkStyle}>
                <Text style={{marginRight: 20}}>6</Text>
                <CheckBox
                  label={
                    '施工面の素材や材質のよっては、シミ・変質・変色・色落ちする場合があります。'
                  }
                  isActive={this.state.modal_data.c6 === 1}
                  disabled={true}
                  checkBox_size={20}
                  space_size={10}
                />
              </View>
              <View style={MyStyles.checkStyle}>
                <Text style={{marginRight: 20}}>7</Text>
                <CheckBox
                  label={
                    '施工後の効果持続期間は、施工対象品の素材や材質、使用状況・摩擦の頻度のよって異なります。'
                  }
                  isActive={this.state.modal_data.c7 === 1}
                  disabled={true}
                  checkBox_size={20}
                  space_size={10}
                />
              </View>
              <View style={MyStyles.checkStyle}>
                <Text style={{marginRight: 20}}>8</Text>
                <CheckBox
                  label={'施工後のキャンセルや返金はできません。'}
                  isActive={this.state.modal_data.c8 === 1}
                  disabled={true}
                  checkBox_size={20}
                  space_size={10}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  marginTop: 70,
                  marginBottom: 30,
                }}>
                <Text
                  style={[
                    TextStyles.bold,
                    {textAlign: 'center', lineHeight: 20, marginBottom: 10},
                  ]}>
                  上記「注意事項・確認事項」を了承の上、{'\n'}
                  HARUTO COATING を申し込みます。
                </Text>
                <View style={{borderWidth: 2, height: 80}}>
                  <Image
                    source={{uri: this.state.modal_data.sign_image_path}}
                    style={{height: 80, margin: 7}}
                    resizeMode={'stretch'}
                  />
                </View>
              </View>
            </View>
            <View style={{
              alignItems: 'center', 
              justifyContent: 'center', 
              marginBottom: 10, 
              backgroundColor: 'white',
              paddingTop: 10,
              paddingBottom: 10,
            }}>
              <FlatList
                data={this.state.imageData}
                renderItem={this._renderImage}
                numColumns={5}
                horizontal={false}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  }
}
