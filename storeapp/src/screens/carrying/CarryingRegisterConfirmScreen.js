import React, {Component} from 'react';
import {View, Text, ScrollView, StyleSheet, Alert} from 'react-native';

import ButtonEx from '../../components/button/ButtonEx';
import CheckBox from '../../components/button/CheckBox';
import TextStyles from '../../constants/TextStyles';
import Colors from '../../constants/Colors';
import {
  Net,
  booleanToInt,
  alertNetworkError,
  requestUpload,
  requestPost,
} from '../../utils/ApiUtils';
import GlobalState from '../../mobx/GlobalState';
import Signature from 'react-native-signature-panel';

const styles = StyleSheet.create({
  checkStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
    borderBottomWidth: 1,
  },
});

export default class CarryingRegisterConfirmScreen extends Component {
  state = {
    c1: false,
    c2: false,
    c3: false,
    c4: false,
    c5: false,
    c6: false,
    c7: false,
    c8: false,
    sign_image: '',
    do_sign: false,
    sign_state: false,
  };

  sign() {
    // if (this.state.do_sign === false) {
    //   Alert.alert('施工登録', 'サインをしてください.');
    //   return;
    // }
    this.setState(prev => ({
      sign_state: !prev.sign_state
    }));
    if (this.state.sign_state) {
      this.setState({do_sign: false});
    }
  }

  getData = () => {
    let goods_name = this.props.navigation.state.params.selectedGoods
      ? this.props.navigation.state.params.selectedGoodsName
      : this.props.navigation.state.params.goods_name;
    return {
      shop_id: GlobalState.shopId,
      customer_id: this.props.navigation.state.params.customer_id,
      carrying_kind: this.props.navigation.state.params.carryingKind,
      goods_id: this.props.navigation.state.params.selectedGoods,
      goods: goods_name,
      face: this.props.navigation.state.params.faceKind,
      phone_kind: this.props.navigation.state.params.phoneKind,
      amount: this.props.navigation.state.params.amount,
      price: this.props.navigation.state.params.price,
      notify: booleanToInt(
        this.props.navigation.state.params.toggleNotify,
      ),
      bottle_use_amount: this.props.navigation.state.params.bottleUse,
      performer: this.props.navigation.state.params.performer,
      serial_no: this.props.navigation.state.params.serial_no,
      c1: booleanToInt(this.state.c1),
      c2: booleanToInt(this.state.c2),
      c3: booleanToInt(this.state.c3),
      c4: booleanToInt(this.state.c4),
      c5: booleanToInt(this.state.c5),
      c6: booleanToInt(this.state.c6),
      c7: booleanToInt(this.state.c7),
      c8: booleanToInt(this.state.c8),
      sign_image: this.state.sign_image,
      goods_subs: this.props.navigation.state.params.selectedSubs,
    };
  };

  async upload_history_images(id) {
    let imageData = this.props.navigation.state.params.imageData;
    let data = {carrying_id: id};
    await Promise.all(
      imageData.map(async (item, idx) => {
        await requestUpload(Net.carrying_register.history_image, data, item.path)
          .then(json => {})
          .catch(err => {
            alertNetworkError(err);
          });
      })
    );
    this.props.navigation.navigate('Main');
  }

  async carrying_done() {
    // if (this.state.do_sign === false) {
    //   Alert.alert('施工登録', 'サインボタンを押してください.');
    //   return;
    // }
    if (!(this.state.c1 && this.state.c2 && this.state.c3 && this.state.c4 && this.state.c5 && this.state.c6 && this.state.c7 && this.state.c8)) {
      Alert.alert('施工登録', 'チェックボックスが全て入力されているか確認してください');
      return;
    }
    let data = this.getData();
    if (this.state.do_sign === false) {
      await requestPost(Net.carrying_register.confirm, data).then(json => {
        this.upload_history_images(json.newId);
      }).catch(err => {
        alertNetworkError(err);
      })
    } else {
      await requestUpload(Net.carrying_register.confirm, data, data.sign_image).then(json => {
        this.upload_history_images(json.newId);
      }).catch(err => {
        alertNetworkError(err);
      });
    }
  }

  render() {
    return (
      <ScrollView style={{flexDirection: 'column'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 30,
            marginLeft: 20,
          }}>
          <Text style={[TextStyles.headerLabel, {flex: 1, textAlign: 'center'}]}>
            ハルトコーティング 申込確認書
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 40,
          }}>
          <Text style={[TextStyles.middleSize, {flex: 1}]}>
            お客様ID：{this.props.navigation.state.params.customer_id}
          </Text>
          <Text style={[TextStyles.middleSize, {flex: 1, textAlign: 'right', marginRight: 40}]}>
            受付担当者 : {this.props.navigation.state.params.performer}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 40,
          }}>
          <Text style={[TextStyles.middleSize, {flex: 1, textAlign: 'right', marginRight: 40}]}>
            シリアルNO. : {this.props.navigation.state.params.serial_no}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 40,
          }}>
          <Text style={[TextStyles.headerLabel, {flex: 1, textAlign: 'center'}]}>
            施工品 ：
            {this.props.navigation.state.params.selectedGoods
              ? this.props.navigation.state.params.selectedGoodsName
              : this.props.navigation.state.params.goods_name}
            {`  品名 : ${this.props.navigation.state.params.selectedSubs}`}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 40,
          }}>
          <Text style={[TextStyles.headerDescription, {flex: 1, textAlign: 'center'}]}>
            お支払い金額 ：{this.props.navigation.state.params.price}円(税込み)
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 20,
          }}>
          <View
            style={{
              backgroundColor: Colors.black,
              width: 10,
              height: 10,
              marginRight: 5,
            }}
          />
          <Text style={[TextStyles.standardSize, {fontWeight: 'bold'}]}>
            注意事項・確認事項
          </Text>
        </View>
        <View style={styles.checkStyle}>
          <Text style={[TextStyles.standardSize, {marginRight: 20}]}>1</Text>
          <CheckBox
            label={
              'ハルトコーディングには抗ウィルス・抗菌の作用がありますが、全てのウィルスや菌を除去するわけではありません。'
            }
            checkBox_size={20}
            space_size={10}
            onPress={isChecked => {
              this.setState({c1: isChecked});
            }}
          />
        </View>
        <View style={styles.checkStyle}>
          <Text style={[TextStyles.standardSize, {marginRight: 20}]}>2</Text>
          <CheckBox
            label={
              'ハルトコーディングは、病気の予防を保証するものではありません。'
            }
            checkBox_size={20}
            space_size={10}
            onPress={isChecked => {
              this.setState({c2: isChecked});
            }}
          />
        </View>
        <View style={styles.checkStyle}>
          <Text style={[TextStyles.standardSize, {marginRight: 20}]}>3</Text>
          <CheckBox
            label={
              '施工面にアルコールやエタノール成分が付着すると、ハルトコーディングの効果が失われる場合があります。'
            }
            checkBox_size={20}
            space_size={10}
            onPress={isChecked => {
              this.setState({c3: isChecked});
            }}
          />
        </View>
        <View style={styles.checkStyle}>
          <Text style={[TextStyles.standardSize, {marginRight: 20}]}>4</Text>
          <CheckBox
            label={
              'ホコリや汚れの上から施工を行うと、ハルトコーディングの効果を十分に得られない場合があります。'
            }
            checkBox_size={20}
            space_size={10}
            onPress={isChecked => {
              this.setState({c4: isChecked});
            }}
          />
        </View>
        <View style={styles.checkStyle}>
          <Text style={[TextStyles.standardSize, {marginRight: 20}]}>5</Text>
          <CheckBox
            label={
              'ハルトコーディングの施工面は親水性（水に対する新和性が高い状態）になります。'
            }
            checkBox_size={20}
            space_size={10}
            onPress={isChecked => {
              this.setState({c5: isChecked});
            }}
          />
        </View>
        <View style={styles.checkStyle}>
          <Text style={[TextStyles.standardSize, {marginRight: 20}]}>6</Text>
          <CheckBox
            label={
              '施工面の素材や材質のよっては、シミ・変質・変色・色落ちする場合があります。'
            }
            checkBox_size={20}
            space_size={10}
            onPress={isChecked => {
              this.setState({c6: isChecked});
            }}
          />
        </View>
        <View style={styles.checkStyle}>
          <Text style={[TextStyles.standardSize, {marginRight: 20}]}>7</Text>
          <CheckBox
            label={
              '施工後の効果持続期間は、施工対象品の素材や材質、使用状況・摩擦の頻度のよって異なります。'
            }
            checkBox_size={20}
            space_size={10}
            onPress={isChecked => {
              this.setState({c7: isChecked});
            }}
          />
        </View>
        <View style={styles.checkStyle}>
          <Text style={[TextStyles.standardSize, {marginRight: 20}]}>8</Text>
          <CheckBox
            label={'施工後のキャンセルや返金はできません。'}
            checkBox_size={20}
            space_size={10}
            onPress={isChecked => {
              this.setState({c8: isChecked});
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
          }}>
          <Text style={TextStyles.headerDescription}>
            上記「注意事項・確認事項」を了承の上、HARUTO COATINGを申し込みます。
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
          }}>
          <ButtonEx
            onPress={() => this.sign()}
            type={this.state.sign_state ? 'secondary' : 'primary'}
            text={'サイン'}
            textStyle={{marginLeft: 20, marginRight: 20}}
          />
          {this.state.sign_state && (
            <ButtonEx
              onPress={() => this.signatureRef.reset()}
              type={'danger'}
              text={'リセット'}
              textStyle={{marginLeft: 20, marginRight: 20}}
              style={{ marginLeft: 20 }}
            />
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            margin: 20,
            borderWidth: 2,
            height: 100,
          }}>
          {this.state.sign_state && (
            <Signature
              ref={ref => {
                this.signatureRef = ref;
              }}
              onFingerUp={signature => {
                this.setState({do_sign: true});
                this.setState({sign_image: signature});
              }}
              height={100}
            />
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <ButtonEx
            onPress={() =>
              this.props.navigation.navigate('CarryingRegisterConfirm')
            }
            type={'info'}
            text={'申込確認書を印刷'}
            textStyle={{marginLeft: 20, marginRight: 20}}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <ButtonEx
            style={{
              marginTop: 30,
              marginBottom: 20,
            }}
            onPress={() => {
              this.carrying_done();
            }}
            type={'primary'}
            text={'施工開始'}
            textStyle={{marginLeft: 20, marginRight: 20}}
          />
        </View>
      </ScrollView>
    );
  }
}
