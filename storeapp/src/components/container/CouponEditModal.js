import React, {Component} from 'react';
import {
  View,
  Modal,
  Image,
  StyleSheet,
  TextInput,
  Text,
  Picker,
  Alert, TouchableOpacity,
} from 'react-native';
import ButtonEx from '../../components/button/ButtonEx';
import MyStyles from '../../constants/MyStyles';
import { launchImageLibrary } from 'react-native-image-picker';
import Ripple from 'react-native-material-ripple';
import DateInput from '../../components/input/DateInput';
import 'moment/min/locales';
import PropTypes from 'prop-types';
import Colors from '../../constants/Colors';
import CouponCard from '../../components/controller/CouponCard';

var moment = require('moment');

const styles = StyleSheet.create({
  ripple: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    height: 94,
    marginBottom: 15,
  },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderColor: '#000000',
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner_select_radio: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderColor: '#000000',
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner_radio: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default class CouponEditModal extends Component {
  state = {
    visible: false,
    title: '',
    content: '',
    image: '',
    path: '',
    from_date: null,
    to_date: null,
    reuseKind: 0,
    typeKind: 0,
    unit: 0,
    amount: 0,
  };

  constructor(props) {
    super(props);
  }

  doModal = () => {
    this.setState({
      visible: true,
      title: '',
      content: '',
      image: '',
      path: '',
      from_date: null,
      to_date: null,
      reuseKind: 0,
      typeKind: 0,
      unit: 0,
      amount: 0,
    });
  };

  getData = () => {
    return {
      title: this.state.title,
      content: this.state.content,
      image: this.state.path,
      from: moment(this.state.from_date).format('YYYY-MM-DD'),
      to: moment(this.state.to_date).format('YYYY-MM-DD'),
      reuse: this.state.reuseKind,
      type: this.state.typeKind,
      unit: this.state.unit,
      amount: this.state.amount,
    };
  };

  setType(typeKind) {
    if (typeKind === this.state.typeKind) {
      this.setState({typeKind: 0});
    } else {
      this.setState({typeKind: typeKind});
    }
  }

  setReuse(reuseKind) {
    if (reuseKind === this.state.reuseKind) {
      this.setState({reuseKind: 0});
    } else {
      this.setState({reuseKind: reuseKind});
    }
  }

  setUnit(unitKind) {
    if (unitKind === this.state.unit) {
      this.setState({unit: 0});
    } else {
      this.setState({unit: unitKind});
    }
  }

  render() {
    return (
      <Modal
        transparent={true}
        visible={this.state.visible}
        animationType={'fade'}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <View style={[MyStyles.Modal, {marginTop: 10, marginBottom: 10}]}>
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
            <View style={{flexDirection: 'row'}}>
              <View style={[MyStyles.container, MyStyles.m_15]}>
                <View style={[MyStyles.mb_15, {flexDirection: 'row'}]}>
                  <TouchableOpacity
                    style={{marginLeft: 60}}
                    activeOpacity={0.5}
                    onPress={() => {
                      this.setType(0);
                    }}>
                    <View style={[styles.radio, {}]}>
                      <View style={[this.state.typeKind === 0 ? styles.inner_select_radio : styles.inner_radio, {}]} />
                    </View>
                  </TouchableOpacity>
                  <Text style={{marginLeft: 10}}>ハルト</Text>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={{marginLeft: 20}}
                    onPress={() => {
                      this.setType(1);
                    }}>
                    <View style={[styles.radio, {}]}>
                      <View style={[this.state.typeKind === 1 ? styles.inner_select_radio : styles.inner_radio, {}]} />
                    </View>
                  </TouchableOpacity>
                  <Text style={{marginLeft: 10}}>ハルトtypeF</Text>
                </View>
                <View style={[MyStyles.mb_15, {flexDirection: 'row', alignItems: 'center'}]}>
                  <Text style={{width: 50, textAlign: 'right'}}>１行目</Text>
                  <TextInput
                    placeholder={'●文字以内'}
                    onChangeText={text => {
                      this.setState({title: text});
                    }}
                    style={[MyStyles.input, {flex: 1, marginLeft: 10}]}
                  />
                </View>
                <View style={[MyStyles.mb_15, {flexDirection: 'row', alignItems: 'center'}]}>
                  <Text style={{width: 50, textAlign: 'right'}}>２行目</Text>
                  <TextInput
                    placeholder={'●文字以内'}
                    onChangeText={text => {
                      this.setState({content: text});
                    }}
                    style={[MyStyles.input, {flex: 1, marginLeft: 10}]}
                  />
                </View>
                <View style={[MyStyles.mb_15, {flexDirection: 'row', alignItems: 'center'}]}>
                  <TextInput
                    placeholder={'¥00000-'}
                    onChangeText={text => {
                      this.setState({amount: text});
                    }}
                    style={[MyStyles.input, {flex: 1, marginLeft: 60}]}
                  />
                  <View style={{flexDirection: 'column', alignItems: 'center', marginLeft: 10}}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{marginRight: 10}}>円引き</Text>
                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => {
                          this.setUnit(0);
                        }}>
                        <View style={[styles.radio, {}]}>
                          <View style={[this.state.unit === 0 ? styles.inner_select_radio : styles.inner_radio, {}]} />
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{marginRight: 10}}>％引き</Text>
                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => {
                          this.setUnit(1);
                        }}>
                        <View style={[styles.radio, {}]}>
                          <View style={[this.state.unit === 1 ? styles.inner_select_radio : styles.inner_radio, {}]} />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={[MyStyles.mb_15, {flexDirection: 'row'}]}>
                  <TouchableOpacity
                    style={{marginLeft: 60}}
                    activeOpacity={0.5}
                    onPress={() => {
                      this.setReuse(0);
                    }}>
                    <View style={[styles.radio, {}]}>
                      <View style={[this.state.reuseKind === 0 ? styles.inner_select_radio : styles.inner_radio, {}]} />
                    </View>
                  </TouchableOpacity>
                  <Text style={{marginLeft: 10}}>一回きり</Text>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={{marginLeft: 40}}
                    onPress={() => {
                      this.setReuse(1);
                    }}>
                    <View style={[styles.radio, {}]}>
                      <View style={[this.state.reuseKind === 1 ? styles.inner_select_radio : styles.inner_radio, {}]} />
                    </View>
                  </TouchableOpacity>
                  <Text style={{marginLeft: 10}}>期間内無制限</Text>
                </View>
                <View style={[MyStyles.mb_15, {flexDirection: 'row', alignItems: 'center'}]}>
                  <Text style={{width: 50, textAlign: 'right'}}>開始</Text>
                  <DateInput
                    style={[MyStyles.input, {flex: 1, marginLeft: 10}]}
                    placeHolder={'開始日付'}
                    onChange={date => this.setState({from_date: date})}
                  />
                </View>
                <View style={[MyStyles.mb_15, {flexDirection: 'row', alignItems: 'center'}]}>
                  <Text style={{width: 50, textAlign: 'right'}}>終了</Text>
                  <DateInput
                    style={[MyStyles.input, {flex: 1, marginLeft: 10}]}
                    placeHolder={'終了日付'}
                    onChange={date => this.setState({to_date: date})}
                  />
                </View>
              </View>
              <View style={[MyStyles.container, MyStyles.m_15]}>
                <CouponCard coupon={this.state} />
                <ButtonEx
                  type={'primary'}
                  text={'申請'}
                  onPress={() => {
                    if (this.state.title === '') {
                      Alert.alert('申請', 'クーポン名を入力してください.');
                      return;
                    } else if (this.state.content === '') {
                      Alert.alert('申請', 'クーポン内容を入力してください.');
                      return;
                    } else if (!this.state.amount) {
                      Alert.alert('申請', '割引値を選択してください.');
                      return;
                    } else if (!this.state.from_date) {
                      Alert.alert('申請', '開始日付を選択してください.');
                      return;
                    } else if (!this.state.to_date) {
                      Alert.alert('申請', '終了日付を選択してください.');
                      return;
                    } else if (this.state.from_date >= this.state.to_date) {
                      Alert.alert(
                        '申請',
                        '入力した有效期間が正確なのアンスブニニだ. 日付をまた確認してください.',
                      );
                      return;
                    }
                    if (this.props.onOK) {
                      this.props.onOK();
                      this.setState({visible: false});
                    } else {
                      this.setState({visible: false});
                    }
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

CouponEditModal.propTypes = {
  onOK: PropTypes.func,
};
