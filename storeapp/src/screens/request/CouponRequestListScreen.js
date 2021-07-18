import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet, Modal, SafeAreaView, Image,
} from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import ButtonEx from '../../components/button/ButtonEx';
import MyStyles from '../../constants/MyStyles';
import {
  requestUpload,
  requestGet,
  requestPost,
  Net,
  alertNetworkError,
} from '../../utils/ApiUtils';
import MainLayout from '../../components/container/MainLayout';
import CouponEditModal from '../../components/container/CouponEditModal';
import Ripple from 'react-native-material-ripple';
import DateInput from '../../components/input/DateInput';
import 'moment/min/locales';
import CouponCard from '../../components/controller/CouponCard';

var moment = require('moment');

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#c4c5d6',
  },
  tabHeader: {
    borderRadius: 0,
    borderWidth: 0,
  },
});

export default class CouponRequestListScreen extends Component {
  state = {
    tabTypes: ['secondary', 'none'],
    coupons: [],
    last_coupons: [],
    item: null, // Selected notice or coupon
    cdmodal_visible: false,
    changeDateModal_visible: false,
    from: '',
    to: '',
  };

  loadCouponsFromApi() {
    requestGet(Net.coupon.get).then(json => {
      this.setState({coupons: json.data});
    }).catch(err => {
      alertNetworkError(err);
    });
    requestGet(Net.last_coupon.get).then(json => {
      this.setState({last_coupons: json.data});
    }).catch(err => {
      alertNetworkError(err);
    });
  }

  componentDidMount() {
    this.loadCouponsFromApi();
  }

  _renderCoupon = data => {
    return (
      <Ripple
        style={{borderBottomWidth: 1, borderColor: '#ddd'}}
        onPress={() => {
          this.setState({item: data.item});
          this.setState({cdmodal_visible: true});
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{width: 200, padding: 5, textAlign: 'center'}}>{data.item.agree === 0 ? '【申請中】' : ''}{data.item.type === 0 ? 'ハルト' : 'ハルト typeF'}</Text>
          <Text style={{width: 250, padding: 5, textAlign: 'center'}}>{data.item.amount}{data.item.unit === 0 ? ' 円引き' : '％引き'}</Text>
          <Text style={{flex: 1, padding: 5, textAlign: 'center'}}>{data.item.from_date}~{data.item.to_date}</Text>
        </View>
      </Ripple>
    );
  };

  _renderLastCoupon = data => {
    return (
      <Ripple
        style={{borderBottomWidth: 1, borderColor: '#ddd'}}
        onPress={() => {
          this.setState({item: data.item});
          this.setState({cdmodal_visible: true});
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{width: 200, padding: 5, textAlign: 'center'}}>{data.item.agree === 0 ? '【申請中】' : ''}{data.item.type === 0 ? 'ハルト' : 'ハルト typeF'}</Text>
          <Text style={{width: 250, padding: 5, textAlign: 'center'}}>{data.item.amount}</Text>
          <Text style={{flex: 1, padding: 5, textAlign: 'center'}}>{data.item.from_date}~{data.item.to_date}</Text>
        </View>
      </Ripple>
    );
  };

  createCoupon = () => {
    let data = this.ceModal.getData();
    requestPost(Net.coupon.add, data).then(json => {
      if (json.result === Net.error.E_OK) {
        this.setState({coupons: json.data});
      }
    }).catch(err => {
      alertNetworkError(err);
    });
  };

  updateCoupon = () => {
    this.setState({changeDateModal_visible: false})
    let from_date = moment(this.state.from).format('YYYY-MM-DD');
    let to_date = moment(this.state.to).format('YYYY-MM-DD');
    if (this.state.from == '') {
      from_date = moment(new Date(this.state.item.from_date1)).format('YYYY-MM-DD');
    }
    if (this.state.to == '') {
      to_date = moment(new Date(this.state.item.to_date1)).format('YYYY-MM-DD');
    }
    requestPost(Net.coupon.change_date, {
      id: this.state.item.id,
      from_date: from_date,
      to_date: to_date,
    }).then(json => {
      if (json.result === Net.error.E_OK) {
        this.setState({coupons: json.data});
        this.setState({item: json.item});
        this.loadCouponsFromApi();
      }
    })
    .catch(err => {
      alertNetworkError(err);
    });
  }

  render() {
    return (
      <MainLayout
        title={'クーポン申請'}
        homeCallback={() => {
          this.props.navigation.navigate('Main');
        }}>
        <View style={{...styles.tabBar, paddingLeft: 10, paddingRight: 10}}>
          <ButtonEx
            type={this.state.tabTypes[0]}
            text={'現在発行中のクーポン'}
            style={styles.tabHeader}
            onPress={() => {
              this.viewPager.setPage(0);
              this.setState({tabTypes: ['secondary', 'none']});
            }}
          />
          <ButtonEx
            type={this.state.tabTypes[1]}
            text={'過去の発行履歴'}
            style={styles.tabHeader}
            onPress={() => {
              this.viewPager.setPage(1);
              this.setState({tabTypes: ['none', 'secondary']});
            }}
          />
        </View>
        <ViewPager
          ref={viewPager => {
            this.viewPager = viewPager;
          }}
          style={{flex: 1}}
          initialPage={0}
          onPageSelected={e => {
            e.nativeEvent.position === 1
              ? this.setState({tabTypes: ['none', 'secondary']})
              : this.setState({tabTypes: ['secondary', 'none']});
          }}>
          <View key="1" style={{ padding: 15, paddingTop: 0 }}>
            <View style={MyStyles.tableRow}>
              <Text style={[MyStyles.tableHeader, {width: 200}]}>タイプ</Text>
              <Text style={[MyStyles.tableHeader, {width: 250}]}>クーポン内容</Text>
              <Text style={[MyStyles.tableHeader, {flex: 1}]}>有効期限</Text>
            </View>
            <View style={{flex: 1}}>
              <FlatList
                data={this.state.coupons}
                renderItem={this._renderCoupon}
              />
            </View>
            <View
              style={[
                {
                  marginTop: 15,
                  alignItems: 'flex-end',
                },
              ]}>
              <ButtonEx
                text={'クーポン申請'}
                type={'primary'}
                onPress={() => this.ceModal.doModal()}
              />
            </View>
          </View>
          <View key="2" style={{ padding: 15, paddingTop: 0 }}>
            <View style={MyStyles.tableRow}>
              <Text style={[MyStyles.tableHeader, {width: 200}]}>タイプ</Text>
              <Text style={[MyStyles.tableHeader, {width: 250}]}>クーポン内容</Text>
              <Text style={[MyStyles.tableHeader, {flex: 1}]}>有効期限</Text>
            </View>
            <View style={{flex: 1}}>
              <FlatList
                data={this.state.last_coupons}
                renderItem={this._renderLastCoupon}
              />
            </View>
            <View
              style={[
                {
                  marginTop: 15,
                  alignItems: 'flex-end',
                },
              ]}>
            </View>
          </View>
        </ViewPager>
        <Modal
          transparent={true}
          visible={this.state.cdmodal_visible}
          animationType={'fade'}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View style={{...MyStyles.Modal, height: 400}}>
              <View style={MyStyles.modalCloseView}>
                <ButtonEx
                  icon={'times'}
                  iconSize={15}
                  style={{borderWidth: 0}}
                  onPress={() => {
                    this.setState({cdmodal_visible: false});
                  }}
                />
              </View>
              <SafeAreaView style={{flexDirection: 'row', flex: 1}}>
                <View style={{flex: 1, margin: 10}}>
                  <Text style={MyStyles.mb_10}>
                    {this.state.item
                      ? this.state.item.type === 0
                        ? 'ハルトコーティング'
                        : 'ハルトコーティングtypeF'
                      : ''}
                  </Text>
                  <Text style={MyStyles.mb_10}>
                    {this.state.item ? this.state.item.title : ''}
                  </Text>
                  <Text style={MyStyles.mb_10}>
                    {this.state.item ? this.state.item.amount : ''}
                    {this.state.item
                      ? this.state.item.unit === 0
                        ? '円引き'
                        : '%引き'
                      : ''}
                  </Text>
                  <Text style={MyStyles.mb_10}>
                    {this.state.item
                      ? this.state.item.from_date + ' ~ ' + this.state.item.to_date
                      : ''}
                  </Text>
                  <Text style={MyStyles.mb_10}>
                    {this.state.item
                      ? this.state.item.reuse === 0
                        ? '一回きり'
                        : '期間内無制限'
                      : ''}
                  </Text>
                  <ButtonEx
                    style={MyStyles.mb_10}
                    text={'期間変更'}
                    type={'primary'}
                    onPress={() => this.setState({changeDateModal_visible: true})}
                  />
                  <ButtonEx
                    text={'配信停止'}
                    type={'secondary'}
                    // onPress={() => this.ceModal.doModal()}
                  />
                </View>
                <View style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
                  {this.state.item ? (
                    <CouponCard coupon={this.state.item} />
                  ) : null}
                </View>
              </SafeAreaView>
            </View>
          </View>
          <Modal
            transparent={true}
            visible={this.state.changeDateModal_visible}
            animationType={'fade'}>
            <View style={{...MyStyles.s_Modal, height: 250}}>
              <View style={MyStyles.modalCloseView}>
                <ButtonEx
                  icon={'times'}
                  iconSize={15}
                  style={{borderWidth: 0}}
                  onPress={() => {
                    this.setState({changeDateModal_visible: false});
                  }}
                />
              </View>
              <SafeAreaView style={{flexDirection: 'column', flex: 1}}>
                <View style={{flex: 1, margin: 30, flexDirection: 'row'}}>
                  <Text style={{height: 50}}>開始</Text>
                  <DateInput
                    style={{flex: 1}}
                    placeHolder={'開始日付'}
                    init_value={this.state.item ? new Date(this.state.item.from_date1) : ''}
                    onChange={date => this.setState({from: date})}
                  />
                </View>
                <View style={{flex: 1, margin: 30, flexDirection: 'row'}}>
                  <Text style={{height: 50}}>終了</Text>
                  <DateInput
                    style={{flex: 1}}
                    placeHolder={'終了日付'}
                    init_value={this.state.item ? new Date(this.state.item.to_date1) : ''}
                    onChange={date => this.setState({to: date})}
                  />
                </View>
                <ButtonEx
                  style={{margin: 20}}
                  text={'期間変更'}
                  type={'primary'}
                  onPress={this.updateCoupon}
                />
              </SafeAreaView>
            </View>
          </Modal>
        </Modal>
        <CouponEditModal
          ref={ref => (this.ceModal = ref)}
          onOK={this.createCoupon}
        />
      </MainLayout>
    );
  }
}
