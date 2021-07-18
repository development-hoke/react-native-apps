import React, {Component} from 'react';
import MainScreenTheme from '../../components/controller/MainScreenTheme';
import {View, Text, Image, StyleSheet, FlatList} from 'react-native';
import Colors from '../../constants/Colors';
import TextStyles from '../../constants/TextStyles';
import Ripple from 'react-native-material-ripple';
import CheckBox from '../../components/button/CheckBox';
const moment = require('moment');

export default class SigongDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      carrying: this.props.navigation.state.params.passParam,
    };
  }
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
    const { carrying } = this.state;
    console.log(carrying);
    return (
      <MainScreenTheme
        noPaddingHoriz={true}
        backColor={Colors.black}
        backButton={true}>
        <View
          style={{
            alignItems: 'center',
            height: 500,
            backgroundColor: Colors.white,
            marginBottom: 10,
          }}>
          <Text
            style={[
              TextStyles.largeText,
              TextStyles.bold,
              {textAlign: 'center', marginTop: 30, lineHeight: 50},
            ]}>
            ハルトコーティング{'\n'}施工証明書
          </Text>
          <Image
            source={require('../../../assets/harutogw-L.jpg')}
            resizeMode={'contain'}
            style={{height: 100, width: '100%', marginHorizontal: 15}}
          />
          <Text
            style={[
              {textAlign: 'center', marginTop: 20, fontSize: 22},
              TextStyles.bold,
            ]}>
            {carrying.goods}
          </Text>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'flex-end',
              flex: 1,
              marginBottom: 20,
            }}>
            <Text
              style={[
                {
                  textAlign: 'center',
                  marginTop: 60,
                  fontSize: 20,
                },
              ]}>
              【施工日】 {moment(carrying.created_at).format('YYYY/MM/DD HH:mm')}
            </Text>
            <Text style={{textAlign: 'center', fontSize: 20, marginTop: 10}}>
              施工代理店: {carrying.shop.name}
            </Text>
            <Text style={{textAlign: 'center', fontSize: 20, marginTop: 10}}>
              申込番号:  {carrying.serial_no}
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: Colors.white,
            marginBottom: 10,
            paddingHorizontal: 15,
          }}>
          <Text style={{textAlign: 'center', fontSize: 20, marginTop: 20}}>
            ■{sigongTypeList[carrying.carrying_kind - 1]} 申込確認書
          </Text>
          <Text style={{marginTop: 30}}>
            施工品：{carrying.goods}
            {'\t\t'}数量{carrying.amount}
          </Text>
          <Text style={{marginTop: 5}}>
            お支払い金額 ¥{carrying.price}円(税込み)
          </Text>
          <View style={{paddingHorizontal: 10}}>
            <Text style={{fontWeight: 'bold', marginTop: 30}}>
              注意事項・確認事項
            </Text>
            <CheckBoxText
              text={
                'ハルトコーディングには抗ウィルス・抗菌の作用がありますが、全てのウィルスや菌を除去するわけではありません。'
              }
              isActive={carrying.c1 === 1}
              order={1}
            />
            <CheckBoxText
              text={
                'ハルトコーディングは、病気の予防を保証するものではありません。'
              }
              isActive={carrying.c2 === 1}
              order={2}
            />
            <CheckBoxText
              text={
                '施工面にアルコールやエタノール成分が付着すると、ハルトコーディングの効果が失われる場合があります。'
              }
              isActive={carrying.c3 === 1}
              order={3}
            />
            <CheckBoxText
              text={
                'ホコリや汚れの上から施工を行うと、ハルトコーディングの効果を十分に得られない場合があります。'
              }
              isActive={carrying.c4 === 1}
              order={4}
            />
            <CheckBoxText
              text={
                'ハルトコーディングの施工面は親水性（水に対する新和性が高い状態）になります。'
              }
              isActive={carrying.c5 === 1}
              order={5}
            />
            <CheckBoxText
              text={
                '施工面の素材や材質のよっては、シミ・変質・変色・色落ちする場合があります。'
              }
              isActive={carrying.c6 === 1}
              order={6}
            />
            <CheckBoxText
              text={
                '施工後の効果持続期間は、施工対象品の素材や材質、使用状況・摩擦の頻度のよって異なります。'
              }
              isActive={carrying.c7 === 1}
              order={7}
            />
            <CheckBoxText
              text={'施工後のキャンセルや返金はできません。'}
              isActive={carrying.c8 === 1}
              order={8}
            />
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              marginTop: 50,
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
            <View
              style={{
                borderWidth: 2,
                height: 80,
                padding: 10,
                marginBottom: 50,
              }}>
              <Image
                source={{uri: carrying.sign_image_path}}
                style={{width: '100%', height: '100%'}}
                resizeMode={'contain'}
              />
            </View>
          </View>
        </View>
        <View
          style={{
            backgroundColor: Colors.white,
            marginBottom: 10,
            paddingHorizontal: 15,
          }}>
            <FlatList
              data={carrying.himages}
              renderItem={this._renderImage}
              numColumns={3}
              horizontal={false}
            />
        </View>
        <View>
          <Ripple
            style={{alignItems: 'flex-end'}}
            onPress={() => {
              this.props.navigation.goBack();
            }}>
            <Text
              style={[
                TextStyles.normalText,
                TextStyles.whiteText,
                TextStyles.bold,
                TextStyles.underline,
                {textAlign: 'right', marginBottom: 10},
              ]}>
              施工履歴一覧➔
            </Text>
          </Ripple>
        </View>
      </MainScreenTheme>
    );
  }
}

class CheckBoxText extends Component {
  render() {
    return (
      <View style={[styles.checkBox, {paddingVertical: 5}]}>
        <Text style={styles.prefixNum}>{this.props.order}</Text>
        <CheckBox
          label={this.props.text}
          textStyle={styles.checkText}
          borderWidth={2}
          disabled={true}
          isActive={this.props.isActive}
          checkBoxSize={20}
          space_size={10}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  checkText: {
    // textDecorationLine: 'underline',
    letterSpacing: -1,
    fontSize: 13,
  },
  checkBox: {flexDirection: 'row', borderBottomWidth: 1, alignItems: 'center'},
  prefixNum: {marginRight: 15, marginLeft: 10},
});

const sigongTypeList = [
  'ハルトコーティング',
  'ハルトコーティングtypeF',
  'その他',
];
