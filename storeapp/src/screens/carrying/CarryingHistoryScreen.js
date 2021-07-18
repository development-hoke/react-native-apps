import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  FlatList,
  Alert, Image, TouchableHighlight,
} from 'react-native';
import ButtonEx from '../../components/button/ButtonEx';
import MyStyles from '../../constants/MyStyles';
import {
  alertNetworkError,
  Net,
  requestGet,
  requestPost,
} from '../../utils/ApiUtils';
import MainLayout from '../../components/container/MainLayout';
import Ripple from 'react-native-material-ripple';
import GlobalState from '../../mobx/GlobalState';
import PropTypes from 'prop-types';
import CarryingDetailModal from '../../components/container/CarryingDetailModal';
import DateInput from '../../components/input/DateInput';

const moment = require('moment');

class LinkText extends Component {
  render() {
    return (
      <TouchableHighlight
        underlayColor={'#ddddff'}
        onPress={this.props.onPress}>
        <Text style={MyStyles.link}>{this.props.text}</Text>
      </TouchableHighlight>
    );
  }
}

LinkText.propsType = {
  text: PropTypes.string.isRequired,
};

export default class CarryingHistoryScreen extends Component {
  state = {
    data: [],
    selected: {},
    imageData: [],
    modalVisible: false,
    from: null,
    to: null,
  };

  componentDidMount() {
    requestPost(Net.carrying_history.get, {})
      .then(json => {
        this.setState({data: json.data});
      })
      .catch(err => {
        alertNetworkError(err);
      });
  }

  search() {
    /*if (!this.state.from) {
      Alert.alert('検索', '開始日付を選択してください.');
      return;
    } else if (!this.state.to) {
      Alert.alert('検索', '終了日付を選択してください.');
      return;
    }*/
    if (this.state.from && this.state.to && this.state.from >= this.state.to) {
      Alert.alert(
        '検索',
        '入力した有效期間が正確なのアンスブニニだ. 日付をまた確認してください.',
      );
      return;
    }
    requestPost(Net.carrying_history.get, {
      from_date: moment(this.state.from).format('YYYY-MM-DD'),
      to_date: moment(this.state.to).format('YYYY-MM-DD'),
    }).then(json => {
      this.setState({data: json.data});
    }).catch(err => {
      alertNetworkError(err);
    });
  }

  today_search() {
    requestPost(Net.carrying_history.get, {
      today_search: 1,
    })
      .then(json => {
        console.log(json);
        this.setState({data: json.data});
      })
      .catch(err => {
        alertNetworkError(err);
      });
  }

  toggleModal(visible, id) {
    if (id !== null) {
      requestGet(Net.carrying_history.image_get, {
        carrying_id: id,
      })
        .then(json => {
          this.setState({imageData: json.imageData});
        })
        .catch(err => {
          alertNetworkError(err);
        });
    }
    this.setState({modalVisible: visible});
  }

  toggleCarryingDetailModal(visible, carrying_id) {
    let tmpCarrying = this.state.data.find(d => {
      return d.id === carrying_id;
    });
    if (carrying_id !== null) {
      requestGet(Net.carrying_history.image_get, {
        carrying_id: carrying_id,
      }).then(json => {
        this.cdModal.setState({imageData: json.imageData});
      }).catch(err => {
        alertNetworkError(err);
      });
      requestGet(Net.carrying_history.sub_name, {
        id: carrying_id,
      }).then(json => {
        this.cdModal.setState({subName: json.data});
      }).catch(err => {
        alertNetworkError(err);
      });
    }
    this.cdModal.setState({modal_data: tmpCarrying});
    this.cdModal.doModal();
  }

  _renderImage = data => {
    return (
      <Image
        source={{uri: data.item.image_path}}
        style={{width: 100, height: 60, margin: 7}}
        resizeMode={'contain'}
      />
    );
  };

  _renderItem = data => {
    return (
      <Ripple
        style={{borderBottomWidth: 1, borderColor: '#ddd'}}
        onPress={() => {
          this.setState({selected: data.item});
          //this.toggleModal(true, data.item.id);
          this.toggleCarryingDetailModal(true, this.state.selected.id);
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{width: 120, padding: 5, textAlign: 'center'}}>
            {data.item.date}
          </Text>
          <Text style={{width: 200, padding: 5, textAlign: 'center'}}>
            {data.item.carrying_kind === 1 ? 'ハルトコーティング' : ''}
            {data.item.carrying_kind === 2 ? 'ハルトコーティングtypeF' : ''}
            {data.item.carrying_kind === 3 ? 'その他' : ''}
          </Text>
          <Text style={{flex: 1, padding: 5}}>{data.item.goods}</Text>
        </View>
      </Ripple>
    );
  };

  render() {
    return (
      <MainLayout
        title={'受付一覧'}
        homeCallback={() => {
          this.props.navigation.navigate('Main');
        }}>
        <Modal transparent={true} visible={this.state.modalVisible}>
          <View style={MyStyles.Modal}>
            <View style={MyStyles.modalCloseView}>
              <ButtonEx
                icon={'times'}
                iconSize={15}
                style={{borderWidth: 0}}
                onPress={() => {
                  this.toggleModal(false);
                }}
              />
            </View>
            <View
              style={{
                height: 50,
                flexDirection: 'row',
                marginLeft: 30,
                marginRight: 30,
              }}>
              <View style={{width: 100}}>
                <Text style={MyStyles.tableContent}>{this.state.selected.date}</Text>
              </View>
              <View style={{width: 180}}>
                <Text style={MyStyles.tableContent}>
                  {this.state.selected.carrying_kind === 1
                    ? 'ハルトコーティング'
                    : ''}
                  {this.state.selected.carrying_kind === 2
                    ? 'ハルトコーティングtypeF'
                    : ''}
                  {this.state.selected.carrying_kind === 3 ? 'その他' : ''}
                </Text>
              </View>
              <View style={{width: 220}}>
                <Text style={MyStyles.tableContent}>
                  {this.state.selected.goods}
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={MyStyles.tableContent}>
                  {this.state.selected.phone_kind === 1 ? 'iPhone' : ''}
                  {this.state.selected.phone_kind === 2 ? 'android' : ''}
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={MyStyles.tableContent}>
                  {this.state.selected.face === 1 ? '画面' : ''}
                  {this.state.selected.face === 2 ? '裏面' : ''}
                </Text>
              </View>
            </View>
            <View style={{height: 50, flexDirection: 'row', marginLeft: 30, marginRight: 30}}>
              <View style={{width: 100}}>
                <Text style={MyStyles.tableContent}>{this.state.selected.amount}個</Text>
              </View>
              <View style={{width: 120}}>
                <Text style={MyStyles.tableContent}>¥{this.state.selected.price}円</Text>
              </View>
              <View style={{width: 150}}>
                <Text style={MyStyles.tableContent}>
                  {this.state.selected.bottle_use === 1
                    ? 'ボトル' +
                      this.state.selected.bottle_use_amount +
                      'cc利用'
                    : 'ボトルを使わないこと'}
                </Text>
              </View>
              <View style={{width: 120}}>
                <Text style={MyStyles.tableContent}>
                  担当：{this.state.selected.performer}
                </Text>
              </View>
              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <LinkText
                  text={'申込書'}
                  onPress={() => {
                    this.toggleCarryingDetailModal(true, this.state.selected.id);
                  }}
                />
              </View>
            </View>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 10, marginTop: 20}}>
              <FlatList
                data={this.state.imageData}
                renderItem={this._renderImage}
                numColumns={4}
                style={{flex: 1}}
              />
            </View>
          </View>
        </Modal>
        <CarryingDetailModal ref={ref => (this.cdModal = ref)} />
        <View style={{flexDirection: 'row', marginBottom: 20, alignItems: 'center', paddingLeft: 15, paddingRight: 15}}>
          <ButtonEx
            onPress={() => this.today_search()}
            type={this.state.sign_state ? 'secondary' : 'primary'}
            text={'本日'}
            textStyle={{marginHorizontal: 20}}
          />
          <DateInput
            style={[MyStyles.input, {flex: 1, marginLeft: 50}]}
            placeHolder={'開始日付'}
            onChange={date => this.setState({from: date})}
          />
          <Text style={{textAlign: 'right'}}>    ~</Text>
          <DateInput
            style={[MyStyles.input, {flex: 1, marginRight: 20}]}
            placeHolder={'終了日付'}
            onChange={date => this.setState({to: date})}
          />
          <ButtonEx
            onPress={() => this.search()}
            type={this.state.sign_state ? 'secondary' : 'primary'}
            text={'検索'}
            textStyle={{marginLeft: 20, marginRight: 20}}
          />
        </View>
        <View style={{...MyStyles.tableRow, paddingLeft: 15, paddingRight: 15}}>
          <Text style={[MyStyles.tableHeader, {width: 120}]}>日付</Text>
          <Text style={[MyStyles.tableHeader, {width: 200}]}>種別</Text>
          <Text style={[MyStyles.tableHeader, {flex: 1}]}>施工商品</Text>
        </View>
        <FlatList
          data={this.state.data}
          renderItem={this._renderItem}
          style={{marginBottom: 15, flex: 1, paddingLeft: 15, paddingRight: 15}}
        />
      </MainLayout>
    );
  }
}
